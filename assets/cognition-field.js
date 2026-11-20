/* CIEI Lab — original, illustrative 2D/3D cognition fields.
 * No experimental data, third-party code, remote assets, or dependencies.
 * Public API: CIEI_FIELD.mount(canvas, { theme }).
 */
(() => {
  'use strict';

  const THEMES = new Set(['hero', 'social', 'health', 'embodied', 'engineering']);
  const instances = new WeakMap();
  const TAU = Math.PI * 2;
  const BLUE = '#4b7198';
  const DEEP = '#304c6b';
  const TEAL = '#438b8a';
  const VIOLET = '#9482b1';
  const SILVER = '#c4d4e0';
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const mix = (a, b, amount) => a + (b - a) * amount;
  const fract = value => value - Math.floor(value);
  const color = (hex, alpha) => {
    const value = Number.parseInt(hex.slice(1), 16);
    return `rgba(${value >> 16},${(value >> 8) & 255},${value & 255},${clamp(alpha, 0, 1)})`;
  };

  function mount(canvas, options = {}) {
    if (!canvas || typeof canvas.getContext !== 'function') {
      throw new TypeError('CIEI_FIELD.mount requires a canvas element.');
    }
    instances.get(canvas)?.dispose();
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) throw new Error('The 2D canvas context is unavailable.');

    const win = canvas.ownerDocument.defaultView || window;
    const doc = canvas.ownerDocument;
    const reducedMotion = win.matchMedia('(prefers-reduced-motion: reduce)');
    const compact = win.matchMedia('(max-width: 760px)').matches;
    const quality = compact ? { rows: 29, samples: 66, nodes: 48 } : { rows: 43, samples: 90, nodes: 72 };
    let theme = THEMES.has(options.theme) ? options.theme : 'hero';
    let width = 0;
    let height = 0;
    let dpr = 1;
    let disposed = false;
    let manualPause = false;
    let inView = true;
    let frameId = 0;
    let lastDraw = 0;
    let time = 0;
    let pulseAt = -20;
    let pulseSerial = 0;
    let transition = null;
    let formation = 0;
    let lastTrailSample = -1;
    let view = null;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const pulsePosition = { x: .5, y: .5 };
    const nodes = Array.from({ length: quality.nodes }, (_, index) => ({
      index,
      seed: fract(index * .61803398875 + .172),
      angle: index * 2.39996322973,
      group: index % 3,
    }));
    const agents = Array.from({ length: 5 }, (_, index) => ({
      index, x: null, z: null, trail: [],
    }));
    const isPaused = () => manualPause || reducedMotion.matches;
    const active = () => !disposed && inView && !doc.hidden && width > 0 && height > 0;
    const moving = () => active() && !isPaused();
    const energy = () => Math.exp(-Math.max(0, time - pulseAt) * 1.65);

    function configureView(rx, ry, rz, scaleFactor = 1, centerY = .51) {
      const x = rx + pointer.y * .045;
      const y = ry + pointer.x * .08;
      view = {
        sx: Math.sin(x), cx: Math.cos(x),
        sy: Math.sin(y), cy: Math.cos(y),
        sz: Math.sin(rz), cz: Math.cos(rz),
        scale: Math.min(width * .235, height * .405) * scaleFactor,
        centerX: width * .5 + pointer.x * 5,
        centerY: height * centerY + pointer.y * 4,
        focal: 5.5,
      };
    }

    function project(point) {
      const x1 = point[0] * view.cy + point[2] * view.sy;
      const z1 = -point[0] * view.sy + point[2] * view.cy;
      const y1 = point[1] * view.cx - z1 * view.sx;
      const z2 = point[1] * view.sx + z1 * view.cx;
      const x2 = x1 * view.cz - y1 * view.sz;
      const y2 = x1 * view.sz + y1 * view.cz;
      const perspective = view.focal / Math.max(2.4, view.focal + z2);
      return {
        x: view.centerX + x2 * view.scale * perspective,
        y: view.centerY + y2 * view.scale * perspective,
        z: z2,
        scale: view.scale * perspective,
      };
    }

    function line(points, stroke, lineWidth = 1, fill = null, closed = false) {
      if (!points.length) return;
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
      if (closed) ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); }
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lineWidth; ctx.stroke(); }
    }

    function line3(points, stroke, lineWidth = 1, fill = null, closed = false) {
      line(points.map(project), stroke, lineWidth, fill, closed);
    }

    function glow(x, y, radius, tint, opacity) {
      if (radius <= 0) return;
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, color(tint, opacity));
      gradient.addColorStop(.42, color(tint, opacity * .45));
      gradient.addColorStop(1, color(tint, 0));
      ctx.fillStyle = gradient;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
    }

    function bead(point, radius, tint, opacity = 1, halo = false) {
      const p = Array.isArray(point) ? project(point) : point;
      const r = Math.max(.6, radius);
      if (halo) glow(p.x, p.y, r * 5, tint, opacity * .12);
      const gradient = ctx.createRadialGradient(p.x - r * .3, p.y - r * .4, 0, p.x, p.y, r);
      gradient.addColorStop(0, color('#ffffff', opacity * .97));
      gradient.addColorStop(.3, color(tint, opacity * .68));
      gradient.addColorStop(1, color(tint, opacity));
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, TAU);
      ctx.fillStyle = gradient;
      ctx.fill();
    }

    function ribbonPoint(u, v, phase = 0) {
      const twist = u * 1.5 + phase;
      const radius = 1.27 + v * .48 * Math.cos(twist);
      return [
        radius * Math.cos(u),
        v * .61 * Math.sin(twist) + .15 * Math.sin(u * 2 + phase),
        radius * Math.sin(u),
      ];
    }

    function heroScene() {
      configureView(.72, -.34 + time * .065, -.30, 1.09);
      const center = project([0, 0, 0]);
      glow(center.x, center.y, view.scale * 1.7, BLUE, .10);
      glow(center.x + view.scale * .8, center.y - view.scale * .55, view.scale, TEAL, .08);
      const phase = .15 * Math.sin(time * .18) + energy() * .13;
      const patches = [];
      const fillRows = compact ? 6 : 9;
      const segments = compact ? 30 : 40;
      for (let row = 0; row < fillRows; row++) {
        const v0 = -1 + row / fillRows * 2;
        const v1 = -1 + (row + 1) / fillRows * 2;
        for (let segment = 0; segment < segments; segment++) {
          const u0 = segment / segments * TAU;
          const u1 = (segment + 1) / segments * TAU;
          const corners = [
            ribbonPoint(u0, v0, phase), ribbonPoint(u1, v0, phase),
            ribbonPoint(u1, v1, phase), ribbonPoint(u0, v1, phase),
          ].map(project);
          patches.push({ corners, depth: corners.reduce((sum, p) => sum + p.z, 0) / 4, row });
        }
      }
      patches.sort((a, b) => b.depth - a.depth);
      for (const patch of patches) {
        const tint = patch.row < fillRows * .42 ? TEAL : patch.row > fillRows * .72 ? VIOLET : BLUE;
        line(patch.corners, null, 0, color(tint, .023 + clamp(-patch.depth, 0, 1.5) * .018), true);
      }
      const strips = [];
      for (let row = 0; row < quality.rows; row++) {
        const v = -1 + row / (quality.rows - 1) * 2;
        const points = [];
        for (let sample = 0; sample <= quality.samples; sample++) {
          points.push(project(ribbonPoint(sample / quality.samples * TAU, v, phase)));
        }
        strips.push({ points, v, depth: points.reduce((sum, p) => sum + p.z, 0) / points.length });
      }
      strips.sort((a, b) => b.depth - a.depth);
      for (const strip of strips) {
        const edge = Math.abs(strip.v) > .96;
        const tint = strip.v < -.25 ? TEAL : strip.v > .5 ? VIOLET : BLUE;
        line(strip.points, color(tint, edge ? .67 : .27 + (1 - Math.abs(strip.v)) * .10), edge ? 1.25 : .68);
      }
      // A second, open bundle creates a flow through the surface rather than another icon-like ring.
      const flowRows = compact ? 10 : 16;
      for (let row = 0; row < flowRows; row++) {
        const v = (row / (flowRows - 1) - .5) * .32;
        const points = [];
        for (let sample = 0; sample <= 70; sample++) {
          const u = sample / 70;
          const x = -2.3 + u * 4.6;
          points.push([x, .48 * Math.sin(x * 1.12 - time * .16) + v, .42 * Math.cos(x * .9 + time * .10)]);
        }
        line3(points, color(row % 3 === 0 ? TEAL : BLUE, .12), .65);
      }
      const count = compact ? 20 : 28;
      const orbit = [];
      for (let index = 0; index < count; index++) {
        const u = index / count * TAU + time * .12;
        const point = project(ribbonPoint(u, index % 2 ? .99 : -.99, phase));
        orbit.push({ point, index });
      }
      orbit.sort((a, b) => b.point.z - a.point.z);
      for (const { point, index } of orbit) bead(point, index % 5 ? 1.7 : 3.0, index % 3 ? BLUE : TEAL, .85, index % 5 === 0);
    }

    function socialScene() {
      configureView(.18, .16 + Math.sin(time * .13) * .09, -.08, 1.05);
      const centers = [[-1.05, -.42, -.04], [1.04, -.34, .18], [.03, .96, -.05]];
      const tints = [BLUE, TEAL, VIOLET];
      const anchors = centers.map(project);
      for (let group = 0; group < 3; group++) {
        const p = anchors[group];
        glow(p.x, p.y, view.scale * .78, tints[group], .16);
      }
      // Curved, translucent hyperedges carry the group relationship.
      for (let layer = 0; layer < 8; layer++) {
        const inset = layer / 8;
        const p = anchors.map((anchor, index) => ({
          x: mix(anchor.x, view.centerX, inset * .26) + Math.sin(time * .21 + index + layer * .3) * 3,
          y: mix(anchor.y, view.centerY, inset * .26),
        }));
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        ctx.quadraticCurveTo(view.centerX, p[0].y - 45 + layer * 8, p[1].x, p[1].y);
        ctx.quadraticCurveTo(p[1].x + 16 - layer * 3, view.centerY + 25, p[2].x, p[2].y);
        ctx.quadraticCurveTo(p[0].x - 25 + layer * 2, view.centerY + 25, p[0].x, p[0].y);
        ctx.fillStyle = color(layer % 2 ? VIOLET : BLUE, .010);
        ctx.fill();
        ctx.strokeStyle = color(BLUE, .085);
        ctx.lineWidth = .65;
        ctx.stroke();
      }
      const points = nodes.map(node => {
        const groupIndex = Math.floor(node.index / 3);
        const groupCount = Math.ceil(nodes.length / 3);
        const vertical = 1 - 2 * (groupIndex + .5) / groupCount;
        const r = Math.sqrt(Math.max(0, 1 - vertical * vertical));
        const angle = node.angle + time * .12 * (node.group === 1 ? -1 : 1);
        const radius = .47 + Math.sin(time * .4 + node.group) * .025 + energy() * .04;
        const center = centers[node.group];
        return {
          ...project([
            center[0] + Math.cos(angle) * r * radius,
            center[1] + vertical * radius,
            center[2] + Math.sin(angle) * r * radius,
          ]),
          node,
        };
      });
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const a = points[i]; const b = points[j];
          if (a.node.group !== b.node.group) continue;
          const distance = Math.hypot(a.x - b.x, a.y - b.y);
          if (distance < view.scale * .42) line([a, b], color(tints[a.node.group], (1 - distance / (view.scale * .42)) * .25), .65);
        }
      }
      for (let group = 0; group < 3; group++) {
        const a = anchors[group]; const b = anchors[(group + 1) % 3];
        for (let filament = 0; filament < 9; filament++) {
          const bend = (filament - 4) * 3 + Math.sin(time * .3 + group) * 3;
          ctx.beginPath(); ctx.moveTo(a.x, a.y);
          ctx.quadraticCurveTo((a.x + b.x) / 2 + bend, (a.y + b.y) / 2 - bend * 1.6, b.x, b.y);
          ctx.strokeStyle = color(tints[group], .12); ctx.lineWidth = .6; ctx.stroke();
        }
      }
      points.sort((a, b) => b.z - a.z);
      for (const point of points) {
        const selected = point.node.index % 13 === pulseSerial % 13;
        bead(point, selected ? 4.2 : 1.9 + point.node.seed * 1.2, tints[point.node.group], selected ? .95 : .74, selected);
      }
    }

    function healthPoint(u, offset, group) {
      const converge = 1 - .90 * Math.exp(-Math.pow((u - .59) / .17, 2));
      const carrier = Math.sin(u * 11 + time * .45 + group * 1.9) * .072;
      return [
        -2.18 + u * 4.36,
        ((group - 1) * .8 + offset * .29) * converge + carrier * (converge + .14),
        offset * .26 + Math.cos(u * 5 + group) * .14,
      ];
    }

    function healthScene() {
      configureView(.08, -.10, -.04, 1.04);
      const center = project([.38, 0, 0]);
      glow(center.x, center.y, view.scale * 1.08, BLUE, .17);
      const tints = [VIOLET, BLUE, TEAL];
      const rows = compact ? 12 : 18;
      for (let group = 0; group < 3; group++) {
        const boundary = [];
        for (let sample = 0; sample <= 74; sample++) boundary.push(healthPoint(sample / 74, -1, group));
        for (let sample = 74; sample >= 0; sample--) boundary.push(healthPoint(sample / 74, 1, group));
        line3(boundary, null, 0, color(tints[group], .035), true);
        for (let row = 0; row < rows; row++) {
          const offset = -1 + row / (rows - 1) * 2;
          const points = [];
          for (let sample = 0; sample <= quality.samples; sample++) points.push(healthPoint(sample / quality.samples, offset, group));
          line3(points, color(tints[group], row === 0 || row === rows - 1 ? .5 : .18), row === 0 || row === rows - 1 ? 1 : .65);
        }
      }
      // A softly lit lens gives the convergence point a readable volume.
      const lensRadius = view.scale * .48;
      const lens = ctx.createRadialGradient(center.x - lensRadius * .25, center.y - lensRadius * .25, 0, center.x, center.y, lensRadius);
      lens.addColorStop(0, 'rgba(255,255,255,.48)');
      lens.addColorStop(.65, color(SILVER, .11));
      lens.addColorStop(.94, color(BLUE, .045));
      lens.addColorStop(1, color(BLUE, .015));
      ctx.fillStyle = lens; ctx.beginPath(); ctx.arc(center.x, center.y, lensRadius, 0, TAU); ctx.fill();
      for (let ring = 0; ring < 7; ring++) {
        const angle = ring / 7 * Math.PI + Math.sin(time * .14) * .12;
        const points = [];
        for (let sample = 0; sample <= 80; sample++) {
          const u = sample / 80 * TAU;
          const y = Math.sin(u) * .48;
          const x = Math.cos(u) * .48;
          points.push([.38 + x * Math.cos(angle), y, x * Math.sin(angle)]);
        }
        line3(points, color(ring % 2 ? TEAL : BLUE, .22), .8);
      }
      for (let group = 0; group < 3; group++) {
        for (let dot = 0; dot < 4; dot++) {
          const u = fract(time * .065 + dot / 4 + group * .14);
          bead(healthPoint(u, Math.sin(dot * 2.1) * .7, group), 2.6, tints[group], .84, true);
        }
      }
      bead([.38, 0, 0], 5, BLUE, .88, true);
    }

    function formationOffset(index) {
      if (formation === 1) return [(index - 2) * .43, .12 * Math.sin(index * Math.PI / 2)];
      if (formation === 2) {
        if (index === 0) return [0, -.55];
        const angle = (index - 1) / 4 * TAU + Math.PI / 4;
        return [Math.cos(angle) * .64, Math.sin(angle) * .64 + .13];
      }
      return [[0, -.65], [-.45, -.03], [.45, -.03], [-.84, .59], [.84, .59]][index];
    }

    function route(at) {
      return [.42 * Math.sin(at * .23), .40 * Math.sin(at * .17 + .4)];
    }

    function embodiedScene(delta) {
      configureView(.84, -.38, -.015, 1.02, .50);
      const planeY = .66;
      const floor = [[-1.95, planeY, -1.58], [1.95, planeY, -1.58], [1.95, planeY, 1.58], [-1.95, planeY, 1.58]];
      line3(floor, color(BLUE, .10), .8, color(SILVER, .055), true);
      for (let index = -5; index <= 5; index++) {
        const x = index * .37;
        line3([[x, planeY, -1.58], [x, planeY, 1.58]], color(BLUE, index === 0 ? .18 : .085), .6);
      }
      for (let index = -4; index <= 4; index++) {
        const z = index * .37;
        line3([[-1.95, planeY, z], [1.95, planeY, z]], color(BLUE, index === 0 ? .18 : .085), .6);
      }
      const routePoints = [];
      for (let sample = 0; sample <= 80; sample++) {
        const progress = sample / 80;
        routePoints.push([-1.8 + progress * 3.6, planeY - .005, Math.sin(progress * 5.2 + .5) * .65]);
      }
      ctx.setLineDash([4, 7]); line3(routePoints, color(TEAL, .27), .9); ctx.setLineDash([]);
      const center = route(time);
      const addTrail = time - lastTrailSample > .14;
      if (addTrail) lastTrailSample = time;
      const positions = [];
      for (const agent of agents) {
        const offset = formationOffset(agent.index);
        const targetX = center[0] + offset[0];
        const targetZ = center[1] + offset[1];
        if (agent.x === null || isPaused()) { agent.x = targetX; agent.z = targetZ; }
        else {
          const amount = 1 - Math.exp(-delta * 1.8);
          agent.x = mix(agent.x, targetX, amount);
          agent.z = mix(agent.z, targetZ, amount);
        }
        if (addTrail && !isPaused()) {
          agent.trail.push([agent.x, planeY - .02, agent.z]);
          if (agent.trail.length > (compact ? 25 : 36)) agent.trail.shift();
        }
        const tint = agent.index === 0 ? BLUE : agent.index % 2 ? TEAL : VIOLET;
        if (agent.trail.length > 1) line3(agent.trail, color(tint, .29), 1.35);
        const future = [];
        for (let sample = 0; sample <= 20; sample++) {
          const next = route(time + sample * .35);
          future.push([next[0] + offset[0], planeY - .015, next[1] + offset[1]]);
        }
        line3(future, color(tint, .15), .85);
        positions.push({ agent, tint, p: project([agent.x, planeY - .22, agent.z]) });
      }
      const formationPoints = positions.map(({ agent }) => [agent.x, planeY - .20, agent.z]);
      const links = formation === 1 ? [[0, 1], [1, 2], [2, 3], [3, 4]] : [[0, 1], [0, 2], [1, 3], [2, 4], [1, 2], [3, 4]];
      for (const [a, b] of links) line3([formationPoints[a], formationPoints[b]], color(BLUE, .22), .85);
      positions.sort((a, b) => b.p.z - a.p.z);
      for (const { agent, tint, p } of positions) {
        const shadow = project([agent.x, planeY + .006, agent.z]);
        const size = clamp(p.scale * .12, 9, 28);
        ctx.beginPath(); ctx.ellipse(shadow.x, shadow.y, size * 1.3, size * .40, -.10, 0, TAU);
        ctx.fillStyle = color(DEEP, .08); ctx.fill();
        glow(p.x, p.y, size * 2.6, tint, agent.index === 0 ? .15 : .075);
        ctx.beginPath(); ctx.ellipse(p.x, p.y + size * .28, size, size * .56, 0, 0, TAU);
        ctx.fillStyle = color(tint, .70); ctx.fill();
        const dome = ctx.createRadialGradient(p.x - size * .32, p.y - size * .45, 0, p.x, p.y, size);
        dome.addColorStop(0, 'rgba(255,255,255,.99)');
        dome.addColorStop(.45, color(tint, .25));
        dome.addColorStop(1, color(tint, .89));
        ctx.beginPath(); ctx.ellipse(p.x, p.y, size, size * .71, 0, 0, TAU);
        ctx.fillStyle = dome; ctx.fill(); ctx.strokeStyle = color(tint, .7); ctx.lineWidth = .8; ctx.stroke();
        ctx.beginPath(); ctx.ellipse(p.x, p.y, size * .48, size * .34, 0, 0, TAU);
        ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1; ctx.stroke();
      }
    }

    function engineeringScene() {
      configureView(.65, -.48 + Math.sin(time * .12) * .035, -.05, 1.00);
      const tints = [VIOLET, TEAL, BLUE];
      const layers = [-.78, .02, .82];
      const sheet = (x, z, level) => [x, level + Math.sin(x * 1.8 + z + time * .19) * .028, z];
      const loopPoint = u => [Math.cos(u) * 1.94, .02 + Math.sin(u) * .38, Math.sin(u) * 1.34];
      const loop = [];
      for (let sample = 0; sample <= 110; sample++) loop.push(loopPoint(sample / 110 * TAU));
      line3(loop, color(BLUE, .19), .9);
      for (let layer = 0; layer < layers.length; layer++) {
        const level = layers[layer];
        const corners = [[-1.22, -.91], [1.22, -.91], [1.22, .91], [-1.22, .91]].map(([x, z]) => sheet(x, z, level));
        line3(corners, color(tints[layer], .40), .9, color(tints[layer], .042), true);
        for (let row = -3; row <= 3; row++) {
          const z = row * .27;
          const points = [];
          for (let sample = 0; sample <= 30; sample++) points.push(sheet(-1.22 + sample / 30 * 2.44, z, level));
          line3(points, color(tints[layer], row === 0 ? .25 : .13), .65);
        }
        for (let column = -4; column <= 4; column++) {
          const x = column * .27;
          const points = [];
          for (let sample = 0; sample <= 25; sample++) points.push(sheet(x, -.91 + sample / 25 * 1.82, level));
          line3(points, color(tints[layer], .12), .6);
        }
      }
      const shafts = [[-.83, -.45], [.70, -.55], [.83, .54], [-.75, .49], [0, 0]];
      for (let index = 0; index < shafts.length; index++) {
        const [x, z] = shafts[index];
        line3([[x, -.8, z], [x, .84, z]], color(BLUE, .19), .8);
        const lightY = -.78 + fract(time * .12 + index * .23) * 1.6;
        bead([x, lightY, z], index === 4 ? 4.8 : 2.5, index % 2 ? TEAL : BLUE, .78, index === 4);
        for (const level of layers) {
          const ring = [];
          for (let sample = 0; sample <= 25; sample++) {
            const u = sample / 25 * TAU;
            ring.push([x + Math.cos(u) * .075, level, z + Math.sin(u) * .075]);
          }
          line3(ring, color(BLUE, .31), .7);
        }
      }
      for (let dot = 0; dot < 8; dot++) {
        const u = time * .22 + dot / 8 * TAU;
        bead(loopPoint(u), dot === 0 ? 4.4 : 2.1, dot % 2 ? TEAL : BLUE, dot === 0 ? .93 : .70, dot === 0);
        if (dot === 0) {
          const tail = [];
          for (let sample = 0; sample <= 20; sample++) tail.push(loopPoint(u - sample * .017));
          line3(tail, color(BLUE, .46), 1.5);
        }
      }
    }

    function drawPulse() {
      const age = time - pulseAt;
      if (age < 0 || age > 2.1) return;
      const still = isPaused();
      const progress = still ? .27 : age / 2.1;
      const radius = Math.min(width, height) * (.055 + progress * .46);
      const alpha = still ? .13 : .25 * Math.pow(1 - progress, 2);
      ctx.strokeStyle = color(pulseSerial % 2 ? TEAL : BLUE, alpha);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(width * pulsePosition.x, height * pulsePosition.y, radius, radius * .78, -.12, 0, TAU);
      ctx.stroke();
      ctx.strokeStyle = color(VIOLET, alpha * .4);
      ctx.beginPath();
      ctx.ellipse(width * pulsePosition.x, height * pulsePosition.y, radius * 1.17, radius * .91, -.12, 0, TAU);
      ctx.stroke();
    }

    function draw(delta = 0) {
      if (!active()) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash([]);
      let blend = 1;
      if (transition) {
        blend = isPaused() ? 1 : clamp((time - transition.at) / .6, 0, 1);
        ctx.globalAlpha = 1 - blend;
        ctx.drawImage(transition.canvas, 0, 0, width, height);
        if (blend === 1) transition = null;
      }
      ctx.globalAlpha = blend;
      if (theme === 'hero') heroScene();
      else if (theme === 'social') socialScene();
      else if (theme === 'health') healthScene();
      else if (theme === 'embodied') embodiedScene(delta);
      else engineeringScene();
      drawPulse();
      ctx.globalAlpha = 1;
    }

    function stop() {
      if (frameId) win.cancelAnimationFrame(frameId);
      frameId = 0;
      lastDraw = 0;
    }

    function tick(stamp) {
      frameId = 0;
      if (!moving()) return;
      if (!lastDraw || stamp - lastDraw >= 1000 / 30) {
        const delta = lastDraw ? Math.min((stamp - lastDraw) / 1000, .10) : 1 / 30;
        lastDraw = stamp;
        time += delta;
        pointer.x = mix(pointer.x, pointer.targetX, .065);
        pointer.y = mix(pointer.y, pointer.targetY, .065);
        draw(delta);
      }
      frameId = win.requestAnimationFrame(tick);
    }

    function start() {
      if (moving() && !frameId) frameId = win.requestAnimationFrame(tick);
    }

    function resize() {
      if (disposed) return;
      const rect = canvas.getBoundingClientRect();
      const nextWidth = Math.max(0, rect.width);
      const nextHeight = Math.max(0, rect.height);
      const nextDpr = clamp(win.devicePixelRatio || 1, 1, 2);
      inView = rect.bottom > 0 && rect.right > 0 && rect.top < win.innerHeight && rect.left < win.innerWidth;
      if (width !== nextWidth || height !== nextHeight || dpr !== nextDpr) {
        width = nextWidth; height = nextHeight; dpr = nextDpr;
        canvas.width = Math.max(1, Math.round(width * dpr));
        canvas.height = Math.max(1, Math.round(height * dpr));
        transition = null;
        draw(0);
      }
      if (moving()) start(); else stop();
    }

    function pulseAtPosition(x = .5, y = .5) {
      if (disposed) return;
      pulseAt = time;
      pulseSerial++;
      pulsePosition.x = clamp(x, 0, 1);
      pulsePosition.y = clamp(y, 0, 1);
      if (theme === 'embodied') formation = (formation + 1) % 3;
      if (isPaused()) draw(0);
      else start();
    }

    function onPointerMove(event) {
      if (event.pointerType !== 'mouse' || isPaused()) return;
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pointer.targetX = clamp((event.clientX - rect.left) / rect.width * 2 - 1, -1, 1);
      pointer.targetY = clamp((event.clientY - rect.top) / rect.height * 2 - 1, -1, 1);
    }

    function onPointerLeave() { pointer.targetX = 0; pointer.targetY = 0; }
    function onPointerDown(event) {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      pulseAtPosition((event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height);
    }
    function onVisibility() {
      if (active()) { draw(0); start(); } else stop();
    }
    function onMotionPreference() {
      transition = null;
      if (isPaused()) { stop(); pointer.x = pointer.y = 0; draw(0); }
      else start();
    }

    const resizeObserver = typeof win.ResizeObserver === 'function' ? new win.ResizeObserver(resize) : null;
    const intersectionObserver = typeof win.IntersectionObserver === 'function' ? new win.IntersectionObserver(entries => {
      if (disposed) return;
      inView = entries[0].isIntersecting;
      if (active()) { draw(0); start(); } else stop();
    }, { threshold: 0 }) : null;
    resizeObserver?.observe(canvas);
    intersectionObserver?.observe(canvas);
    win.addEventListener('resize', resize, { passive: true });
    canvas.addEventListener('pointermove', onPointerMove, { passive: true });
    canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });
    canvas.addEventListener('pointerdown', onPointerDown, { passive: true });
    doc.addEventListener('visibilitychange', onVisibility);
    if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', onMotionPreference);
    else reducedMotion.addListener(onMotionPreference);

    const api = Object.freeze({
      setTheme(nextTheme) {
        if (disposed || !THEMES.has(nextTheme) || nextTheme === theme) return;
        if (!isPaused() && active()) {
          const previous = doc.createElement('canvas');
          previous.width = canvas.width; previous.height = canvas.height;
          previous.getContext('2d').drawImage(canvas, 0, 0);
          transition = { canvas: previous, at: time };
        } else transition = null;
        theme = nextTheme;
        if (theme === 'embodied') {
          agents.forEach(agent => { agent.x = agent.z = null; agent.trail.length = 0; });
          lastTrailSample = -1;
        }
        draw(0); start();
      },
      pulse() { pulseAtPosition(); },
      setPaused(value) {
        if (disposed) return;
        manualPause = Boolean(value);
        if (isPaused()) {
          stop(); transition = null; pointer.x = pointer.y = 0; draw(0);
        } else start();
      },
      dispose() {
        if (disposed) return;
        disposed = true; stop();
        resizeObserver?.disconnect(); intersectionObserver?.disconnect();
        win.removeEventListener('resize', resize);
        canvas.removeEventListener('pointermove', onPointerMove);
        canvas.removeEventListener('pointerleave', onPointerLeave);
        canvas.removeEventListener('pointerdown', onPointerDown);
        doc.removeEventListener('visibilitychange', onVisibility);
        if (reducedMotion.removeEventListener) reducedMotion.removeEventListener('change', onMotionPreference);
        else reducedMotion.removeListener(onMotionPreference);
        transition = null;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (instances.get(canvas) === api) instances.delete(canvas);
      },
    });
    instances.set(canvas, api);
    resize();
    return api;
  }

  window.CIEI_FIELD = Object.freeze({ mount });
})();
