/* Experimental platforms: static posters first, animation only on request. */
(() => {
  'use strict';

  let nextId = 0;
  let globalObserver = null;
  let preferenceBound = false;
  let visibilityBound = false;
  const initialized = new WeakSet();
  const instances = new Set();
  const resolveAsset = path => window.CIEI_EMBEDDED_ASSETS?.[path.replace(/^(?:\.{1,2}\/)+/,'')] || path;
  const text = value => typeof value === 'string' ? value : '';
  const t = value => typeof window.CIEI_I18N?.t === 'function' ? text(window.CIEI_I18N.t(value)) || value : value;
  const mediaLabel = (phrase, title) => `${t(phrase)} · ${title}`;
  const escape = value => text(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[character]));
  const safeBase = value => value === '../' ? '../' : value === './' ? './' : '';
  const safeAsset = value => /^assets\/(?:[A-Za-z0-9_-]+\/)*[A-Za-z0-9_-]+\.(?:webp|png|jpe?g|gif|avif)$/i.test(text(value)) ? value : '';
  const safeSource = value => {
    try {
      const url = new URL(text(value));
      return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
    } catch (_) { return ''; }
  };
  const normalize = items => !Array.isArray(items) ? [] : items
    .filter(item => item && typeof item === 'object' && !Array.isArray(item))
    .map(item => ({
      title: text(item.title) || t('实验平台'),
      description: text(item.description),
      use: text(item.use),
      poster: safeAsset(item.poster),
      animation: safeAsset(item.animation),
      source: safeSource(item.source)
    })).filter(item => item.poster);
  const json = data => JSON.stringify(data).replace(/[<>&\u2028\u2029]/g, character => ({
    '<': '\\u003c', '>': '\\u003e', '&': '\\u0026', '\u2028': '\\u2028', '\u2029': '\\u2029'
  }[character]));

  function render(items, base = './') {
    const entries = normalize(items);
    if (!entries.length) return `<div class="ciei-exhibit ciei-exhibit--empty"><p>${escape(t('实验平台资料正在整理中。'))}</p></div>`;
    const prefix = safeBase(base);
    const id = `ciei-exhibit-${++nextId}`;
    const first = entries[0];
    const asset = path => escape(resolveAsset(prefix + path));
    return `<div class="ciei-exhibit" data-ciei-exhibit>
      <div class="ciei-exhibit__backdrop" aria-hidden="true"><img data-ciei-backdrop src="${asset(first.poster)}" alt="" loading="lazy" decoding="async"></div>
      <div class="ciei-exhibit__heading">
        <div><p class="ciei-exhibit__eyebrow">${escape(t('EXPERIMENTAL PLATFORMS'))}</p><h3>${escape(t('实验平台'))}</h3></div>
      </div>
      <div class="ciei-exhibit__layout">
        <figure class="ciei-exhibit__stage">
          <button class="ciei-exhibit__frame" type="button" data-ciei-expand aria-haspopup="dialog" aria-controls="${id}-dialog" aria-label="${escape(mediaLabel('放大画面', first.title))}">
            <img class="ciei-exhibit__image" data-ciei-image src="${asset(first.poster)}" alt="${escape(mediaLabel('演示画面', first.title))}" width="960" height="540" loading="lazy" decoding="async">
            <span class="ciei-exhibit__expand-label" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/></svg></span>
          </button>
          <figcaption class="ciei-exhibit__toolbar">
            <button class="ciei-exhibit__play" type="button" data-ciei-play aria-pressed="false" ${first.animation ? '' : 'disabled'}>${escape(t(first.animation ? '播放演示' : '暂无动态演示'))}</button>
          </figcaption>
        </figure>
        <div class="ciei-exhibit__aside">
          <div class="ciei-exhibit__choices" role="group" aria-label="${escape(t('选择实验平台'))}">
            ${entries.map((item, index) => `<button class="ciei-exhibit__choice" type="button" data-ciei-select="${index}" aria-pressed="${index === 0}" aria-controls="${id}-details">
              <img src="${asset(item.poster)}" alt="" aria-hidden="true" width="64" height="48" loading="lazy" decoding="async">
              <span>${escape(item.title)}</span>
            </button>`).join('')}
          </div>
          <div class="ciei-exhibit__details" id="${id}-details" aria-live="polite" aria-atomic="true">
            <p class="ciei-exhibit__use" data-ciei-use ${first.use ? '' : 'hidden'}>${escape(first.use)}</p>
            <h4 data-ciei-title>${escape(first.title)}</h4>
            <p class="ciei-exhibit__description" data-ciei-description>${escape(first.description)}</p>
          </div>
        </div>
      </div>
      <p class="ciei-exhibit__status" data-ciei-status role="status"></p>
      <dialog class="ciei-exhibit__dialog" id="${id}-dialog" aria-labelledby="${id}-dialog-title">
        <div class="ciei-exhibit__dialog-header"><div><p class="ciei-exhibit__eyebrow">${escape(t('EXPERIMENTAL PLATFORMS'))}</p><h3 id="${id}-dialog-title" data-ciei-dialog-title>${escape(first.title)}</h3></div><button class="ciei-exhibit__close" type="button" data-ciei-close>${escape(t('关闭'))}</button></div>
        <div class="ciei-exhibit__dialog-media"><img data-ciei-dialog-image alt="${escape(mediaLabel('放大画面', first.title))}" width="960" height="540"></div>
        <div class="ciei-exhibit__dialog-footer"><button class="ciei-exhibit__play" type="button" data-ciei-dialog-play aria-pressed="false" ${first.animation ? '' : 'disabled'}>${escape(t(first.animation ? '播放演示' : '暂无动态演示'))}</button></div>
      </dialog>
      <script type="application/json" data-ciei-exhibit-data>${json({ items: entries, base: prefix })}</script>
    </div>`;
  }

  function ensureGlobalControls() {
    if (!visibilityBound) {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden) return;
        instances.forEach(instance => {
          if (instance.element.isConnected) instance.pause();
          else instances.delete(instance);
        });
      });
      visibilityBound = true;
    }
    if (!globalObserver && typeof MutationObserver === 'function' && document.documentElement) {
      globalObserver = new MutationObserver(() => {
        if (document.documentElement.dataset.motion !== 'paused') return;
        instances.forEach(instance => {
          if (instance.element.isConnected) instance.pause();
          else instances.delete(instance);
        });
      });
      globalObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-motion'] });
    }
    if (!preferenceBound && typeof window.matchMedia === 'function') {
      const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
      const onChange = event => { if (event.matches) instances.forEach(instance => instance.pause()); };
      if (typeof preference.addEventListener === 'function') preference.addEventListener('change', onChange);
      else if (typeof preference.addListener === 'function') preference.addListener(onChange);
      preferenceBound = true;
    }
  }

  function init(root = document) {
    const components = [];
    if (root?.matches?.('[data-ciei-exhibit]')) components.push(root);
    root?.querySelectorAll?.('[data-ciei-exhibit]').forEach(element => components.push(element));
    components.forEach(element => {
      if (initialized.has(element)) return;
      let data;
      try { data = JSON.parse(element.querySelector('[data-ciei-exhibit-data]')?.textContent || '{}'); }
      catch (_) { return; }
      const items = normalize(data.items);
      if (!items.length) return;
      const base = safeBase(data.base);
      const find = selector => element.querySelector(selector);
      const stageImage = find('[data-ciei-image]');
      const stagePlay = find('[data-ciei-play]');
      const expand = find('[data-ciei-expand]');
      const dialog = find('.ciei-exhibit__dialog');
      const dialogImage = find('[data-ciei-dialog-image]');
      const dialogPlay = find('[data-ciei-dialog-play]');
      if (![stageImage, stagePlay, expand, dialog, dialogImage, dialogPlay].every(Boolean)) return;
      initialized.add(element);

      let selected = 0;
      let returnFocus = null;
      const playing = { stage: false, dialog: false };
      const media = {
        stage: { image: stageImage, button: stagePlay },
        dialog: { image: dialogImage, button: dialogPlay }
      };
      const item = () => items[selected];
      let pendingSwitch = false;
      let switchTimer = 0;
      const motionAllowed = () => document.documentElement.dataset.motion !== 'paused'
        && !(typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      const clearSwitch = () => {
        window.clearTimeout(switchTimer);
        pendingSwitch = false;
        stageImage.classList.remove('is-switching');
      };
      const animateSwitch = () => {
        const allowed = motionAllowed() && !document.hidden;
        clearSwitch();
        if (!allowed) return;
        // Restart the short image-only entrance; the selected text remains visible.
        void stageImage.offsetWidth;
        stageImage.classList.add('is-switching');
        switchTimer = window.setTimeout(() => stageImage.classList.remove('is-switching'), 360);
      };
      const updatePlayback = (kind, requested) => {
        const { image, button } = media[kind];
        const active = requested && Boolean(item().animation);
        playing[kind] = active;
        button.disabled = !item().animation;
        button.setAttribute('aria-pressed', String(active));
        button.setAttribute('aria-label', mediaLabel(active ? '暂停演示' : '播放演示', item().title));
        button.textContent = t(active ? '加载演示…' : item().animation ? '播放演示' : '暂无动态演示');
        image.setAttribute('aria-busy', String(active));
        image.src = resolveAsset(base + (active ? item().animation : item().poster));
        image.dataset.cieiPlaying = String(active);
        if (active && image.complete && image.naturalWidth) {
          button.textContent = t('暂停演示');
          image.setAttribute('aria-busy', 'false');
        }
      };
      const pause = () => { clearSwitch(); updatePlayback('stage', false); updatePlayback('dialog', false); };
      const instance = { element, pause };
      instances.add(instance);
      if (typeof IntersectionObserver === 'function') {
        const viewportObserver = new IntersectionObserver(entries => {
          if (!element.isConnected) {
            viewportObserver.disconnect();
            instances.delete(instance);
            return;
          }
          if (!entries[0]?.isIntersecting) {
            clearSwitch();
            // Only the inline stage goes off screen; an open top-layer dialog
            // can still be visible and must retain its explicit playback state.
            updatePlayback('stage', false);
          }
        }, { threshold: 0 });
        viewportObserver.observe(element);
      }

      Object.entries(media).forEach(([kind, { image, button }]) => {
        button.addEventListener('click', () => {
          find('[data-ciei-status]').textContent = '';
          if (kind === 'stage') clearSwitch();
          updatePlayback(kind, !playing[kind]);
        });
        image.addEventListener('load', () => {
          if (playing[kind] && image.getAttribute('src') === resolveAsset(base + item().animation)) button.textContent = t('暂停演示');
          image.setAttribute('aria-busy', 'false');
          if (kind === 'stage' && !playing.stage && pendingSwitch && image.getAttribute('src') === resolveAsset(base + item().poster)) animateSwitch();
        });
        image.addEventListener('error', () => {
          if (playing[kind]) {
            updatePlayback(kind, false);
            find('[data-ciei-status]').textContent = t('动态演示暂时无法加载，请稍后重试。');
          }
        });
      });

      const select = index => {
        if (!Number.isInteger(index) || !items[index]) return;
        const changed = selected !== index;
        selected = index;
        const backdrop=find('[data-ciei-backdrop]');if(backdrop)backdrop.src=resolveAsset(base+item().poster);
        pause();
        element.querySelectorAll('[data-ciei-select]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.cieiSelect) === index)));
        find('[data-ciei-title]').textContent = item().title;
        find('[data-ciei-use]').textContent = item().use;
        find('[data-ciei-use]').hidden = !item().use;
        find('[data-ciei-description]').textContent = item().description;
        find('[data-ciei-dialog-title]').textContent = item().title;
        find('[data-ciei-status]').textContent = '';
        stageImage.alt = mediaLabel('演示画面', item().title);
        dialogImage.alt = mediaLabel('放大画面', item().title);
        expand.setAttribute('aria-label', mediaLabel('放大画面', item().title));
        pendingSwitch = changed && motionAllowed() && !document.hidden;
        if (pendingSwitch && stageImage.complete && stageImage.naturalWidth) animateSwitch();
      };
      element.querySelectorAll('[data-ciei-select]').forEach(button => button.addEventListener('click', () => select(Number(button.dataset.cieiSelect))));
      expand.addEventListener('click', () => {
        returnFocus = document.activeElement;
        pause();
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
        find('[data-ciei-close]').focus();
      });
      const onClose = () => {
        updatePlayback('dialog', false);
        if (returnFocus?.isConnected) returnFocus.focus();
      };
      const closeDialog = () => {
        if (typeof dialog.close === 'function') dialog.close();
        else { dialog.removeAttribute('open'); onClose(); }
      };
      find('[data-ciei-close]').addEventListener('click', closeDialog);
      dialog.addEventListener('close', onClose);
      dialog.addEventListener('click', event => { if (event.target === dialog) closeDialog(); });
      if (typeof dialog.showModal !== 'function') dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); closeDialog(); }
      });
      select(0);
    });
    ensureGlobalControls();
  }

  window.CIEI_EXHIBIT = Object.freeze({ render, init });
})();
