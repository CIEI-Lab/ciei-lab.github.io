/* CIEI Lab: delegated tactile feedback, dialog scroll locking and small utilities. */
(() => {
  'use strict';

  if (window.CIEI_TACTILE?.refresh) {
    window.CIEI_TACTILE.refresh();
    return;
  }

  const root = document.documentElement;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const presses = new Map();
  const ripples = new Set();
  const rippleTimers = new WeakMap();
  const nonRippleTags = new Set([
    'INPUT', 'TEXTAREA', 'SELECT', 'IMG', 'CANVAS', 'VIDEO', 'AUDIO',
    'IFRAME', 'OBJECT', 'EMBED', 'BR', 'HR', 'AREA', 'SOURCE', 'TRACK'
  ]);
  let activeElement = null;
  let pointerFrame = 0;
  let pendingPointer = null;
  let scrollFrame = 0;
  let toast = null;
  let toastTimer = 0;
  let toastFrame = 0;
  let dialogCount = 0;
  let scrollLock = null;

  const canAnimate = () => !reducedMotion.matches && root.dataset.motion !== 'paused';
  const closest = (target, selector) => target instanceof Element ? target.closest(selector) : null;
  const isEnabled = element => element instanceof HTMLElement &&
    !element.matches(':disabled, [aria-disabled="true"]') && !element.closest('[inert]');
  const clamp = value => Math.max(0, Math.min(1, value));

  function resetPointer(element = activeElement) {
    if (!element) return;
    element.style.setProperty('--pointer-x', '50%');
    element.style.setProperty('--pointer-y', '50%');
    element.style.setProperty('--tilt-x', '0deg');
    element.style.setProperty('--tilt-y', '0deg');
    if (activeElement === element) activeElement = null;
  }

  function flushPointer() {
    pointerFrame = 0;
    const point = pendingPointer;
    pendingPointer = null;
    if (!point || !point.element.isConnected || !canAnimate() || !finePointer.matches) {
      resetPointer();
      return;
    }
    if (activeElement && activeElement !== point.element) resetPointer();
    activeElement = point.element;
    const bounds = activeElement.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = clamp((point.x - bounds.left) / bounds.width);
    const y = clamp((point.y - bounds.top) / bounds.height);
    activeElement.style.setProperty('--pointer-x', `${(x * 100).toFixed(2)}%`);
    activeElement.style.setProperty('--pointer-y', `${(y * 100).toFixed(2)}%`);
    activeElement.style.setProperty('--tilt-x', `${((0.5 - y) * 4).toFixed(2)}deg`);
    activeElement.style.setProperty('--tilt-y', `${((x - 0.5) * 4).toFixed(2)}deg`);
  }

  function clearPendingPointer() {
    pendingPointer = null;
    if (pointerFrame) cancelAnimationFrame(pointerFrame);
    pointerFrame = 0;
    resetPointer();
  }

  function removePress(key) {
    const element = presses.get(key);
    presses.delete(key);
    if (element && !Array.from(presses.values()).includes(element)) {
      element.classList.remove('is-pressed');
    }
  }

  function removeRipple(ripple) {
    clearTimeout(rippleTimers.get(ripple));
    rippleTimers.delete(ripple);
    ripples.delete(ripple);
    ripple.remove();
  }

  function addRipple(element, event) {
    if (!canAnimate() || nonRippleTags.has(element.tagName)) return;
    const bounds = element.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    const x = clamp((event.clientX - bounds.left) / bounds.width) * bounds.width;
    const y = clamp((event.clientY - bounds.top) / bounds.height) * bounds.height;
    const size = Math.max(24, Math.hypot(
      Math.max(x, bounds.width - x), Math.max(y, bounds.height - y)
    ) * 2);
    const ripple = document.createElement('span');
    ripple.className = 'touch-ripple';
    ripple.setAttribute('aria-hidden', 'true');
    ripple.setAttribute('role', 'presentation');
    ripple.style.pointerEvents = 'none';
    ripple.style.left = `${x.toFixed(1)}px`;
    ripple.style.top = `${y.toFixed(1)}px`;
    ripple.style.width = `${size.toFixed(1)}px`;
    ripple.style.height = `${size.toFixed(1)}px`;
    ripple.style.setProperty('--ripple-size', `${size.toFixed(1)}px`);
    element.append(ripple);
    ripples.add(ripple);
    ripple.addEventListener('animationend', () => removeRipple(ripple), { once: true });
    rippleTimers.set(ripple, setTimeout(() => removeRipple(ripple), 1200));
  }

  function clearFeedback() {
    clearPendingPointer();
    for (const element of presses.values()) element.classList.remove('is-pressed');
    presses.clear();
    for (const ripple of Array.from(ripples)) removeRipple(ripple);
  }

  document.addEventListener('pointermove', event => {
    const element = closest(event.target, '[data-tactile]');
    if (event.pointerType === 'touch' || !finePointer.matches || !canAnimate() || !isEnabled(element)) {
      clearPendingPointer();
      return;
    }
    pendingPointer = { element, x: event.clientX, y: event.clientY };
    if (!pointerFrame) pointerFrame = requestAnimationFrame(flushPointer);
  }, { passive: true });

  document.addEventListener('pointerout', event => {
    const element = pendingPointer?.element || activeElement;
    if (element && (!(event.relatedTarget instanceof Node) || !element.contains(event.relatedTarget))) {
      clearPendingPointer();
    }
  }, { passive: true });

  document.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    const element = closest(event.target, '[data-tactile]');
    if (!isEnabled(element)) return;
    removePress(event.pointerId);
    presses.set(event.pointerId, element);
    element.classList.add('is-pressed');
    addRipple(element, event);
  }, { passive: true });

  const releasePointer = event => removePress(event.pointerId);
  document.addEventListener('pointerup', releasePointer, { capture: true, passive: true });
  document.addEventListener('pointercancel', releasePointer, { capture: true, passive: true });
  document.addEventListener('lostpointercapture', releasePointer, { capture: true, passive: true });

  document.addEventListener('keydown', event => {
    if (event.repeat || !['Enter', ' '].includes(event.key)) return;
    const element = closest(event.target, '[data-tactile]');
    if (!isEnabled(element) || element.matches('input, textarea, select, [contenteditable="true"]')) return;
    presses.set(`key:${event.key}`, element);
    element.classList.add('is-pressed');
  });
  document.addEventListener('keyup', event => removePress(`key:${event.key}`));
  document.addEventListener('focusout', event => {
    for (const [key, element] of Array.from(presses)) {
      if (typeof key === 'string' && element === event.target) removePress(key);
    }
  });
  window.addEventListener('blur', clearFeedback);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clearFeedback(); });
  finePointer.addEventListener('change', clearPendingPointer);
  reducedMotion.addEventListener('change', () => { if (!canAnimate()) clearFeedback(); });

  function notify(message) {
    const text = String(message ?? '').trim();
    if (!text || !document.body) return;
    clearTimeout(toastTimer);
    if (toastFrame) cancelAnimationFrame(toastFrame);
    if (!toast?.isConnected) {
      toast = document.createElement('div');
      toast.className = 'tactile-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      toast.setAttribute('aria-atomic', 'true');
    }
    // Keep feedback inside the active dialog's top layer and accessibility tree.
    const openDialogs = Array.from(document.querySelectorAll('dialog[open]'));
    const host = openDialogs[openDialogs.length - 1] || document.body;
    if (toast.parentElement !== host) host.append(toast);
    toast.textContent = '';
    toast.classList.remove('is-visible');
    toastFrame = requestAnimationFrame(() => {
      toastFrame = 0;
      toast.textContent = text;
      toast.classList.add('is-visible');
      toastTimer = setTimeout(() => {
        toast.classList.remove('is-visible');
        toast.textContent = '';
      }, 2600);
    });
  }

  function updateScrollTop() {
    scrollFrame = 0;
    const top = scrollLock ? scrollLock.y : window.scrollY;
    document.querySelectorAll('[data-scroll-top]').forEach(button => {
      const visible = top > 500;
      button.hidden = !visible;
      button.classList.toggle('is-visible', visible);
      button.setAttribute('aria-hidden', String(!visible));
    });
  }
  window.addEventListener('scroll', () => {
    if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollTop);
  }, { passive: true });
  document.addEventListener('click', event => {
    const button = closest(event.target, '[data-scroll-top]');
    if (!isEnabled(button)) return;
    event.preventDefault();
    window.scrollTo({ top: 0, left: 0, behavior: canAnimate() ? 'smooth' : 'instant' });
  });

  function saveStyles(element, properties) {
    return properties.map(property => [
      property, element.style.getPropertyValue(property), element.style.getPropertyPriority(property)
    ]);
  }
  function restoreStyles(element, entries) {
    for (const [property, value, priority] of entries) {
      if (value) element.style.setProperty(property, value, priority);
      else element.style.removeProperty(property);
    }
  }

  function syncDialogs() {
    if (!document.body) return;
    dialogCount = document.querySelectorAll('dialog[open]').length;
    if (dialogCount && !scrollLock) {
      clearPendingPointer();
      const body = document.body;
      const gap = Math.max(0, window.innerWidth - root.clientWidth);
      const padding = parseFloat(window.getComputedStyle(body).paddingRight) || 0;
      scrollLock = {
        body, x: window.scrollX, y: window.scrollY,
        styles: saveStyles(body, ['position', 'top', 'left', 'right', 'width', 'overflow', 'padding-right'])
      };
      body.style.position = 'fixed';
      body.style.top = `${-scrollLock.y}px`;
      body.style.left = '0';
      body.style.right = '0';
      body.style.width = '100%';
      body.style.overflow = 'hidden';
      if (gap) body.style.paddingRight = `${padding + gap}px`;
    } else if (!dialogCount && scrollLock) {
      const previous = scrollLock;
      scrollLock = null;
      restoreStyles(previous.body, previous.styles);
      window.scrollTo({ left: previous.x, top: previous.y, behavior: 'instant' });
    }
    updateScrollTop();
  }

  const containsDialog = node => node instanceof Element &&
    (node.matches('dialog') || Boolean(node.querySelector('dialog')));
  const containsScrollTop = node => node instanceof Element &&
    (node.matches('[data-scroll-top]') || Boolean(node.querySelector('[data-scroll-top]')));
  const observer = new MutationObserver(records => {
    let dialogsChanged = false;
    let scrollTopChanged = false;
    for (const record of records) {
      if (record.type === 'attributes') {
        if (record.attributeName === 'open' && record.target.matches('dialog')) dialogsChanged = true;
        if (record.target === root && record.attributeName === 'data-motion' && !canAnimate()) clearFeedback();
      } else {
        const changed = [...record.addedNodes, ...record.removedNodes];
        if (!dialogsChanged) dialogsChanged = changed.some(containsDialog);
        if (!scrollTopChanged) scrollTopChanged = changed.some(containsScrollTop);
      }
    }
    if (dialogsChanged) syncDialogs();
    else if (scrollTopChanged) updateScrollTop();
  });
  observer.observe(root, { subtree: true, childList: true, attributes: true, attributeFilter: ['open', 'data-motion'] });
  document.addEventListener('close', event => { if (event.target.matches?.('dialog')) syncDialogs(); }, true);
  document.addEventListener('toggle', event => { if (event.target.matches?.('dialog')) syncDialogs(); }, true);

  function refresh() {
    if (!canAnimate()) clearFeedback();
    syncDialogs();
    updateScrollTop();
  }

  window.CIEI_TACTILE = Object.freeze({ notify, refresh });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refresh, { once: true });
  else refresh();
  window.addEventListener('pageshow', refresh);
})();
