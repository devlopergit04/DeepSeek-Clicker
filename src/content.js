(() => {
  const api = typeof browser !== 'undefined' ? browser : chrome;
  const LABELS = ['continue', 'continue generating', '继续', '继续生成'];
  const settings = { enabled: true, delay: 800 };
  let pending = null;

  const norm = (s) => (s || '').replace(/\s+/g, ' ').trim().toLowerCase();

  function findContinue() {
    const nodes = document.querySelectorAll('button, [role="button"], div[class*="button"], div[class*="btn"]');
    for (const el of nodes) {
      if (!el.offsetParent || el.disabled || el.getAttribute('aria-disabled') === 'true') continue;
      if (LABELS.includes(norm(el.innerText || el.textContent))) return el;
    }
    return null;
  }

  function check() {
    if (!settings.enabled || pending) return;
    const btn = findContinue();
    if (!btn) return;
    pending = setTimeout(() => {
      pending = null;
      const still = findContinue();
      if (!still || !settings.enabled) return;
      still.click();
      api.storage.local.get({ clicks: 0 }, (r) => api.storage.local.set({ clicks: (r.clicks || 0) + 1 }));
    }, settings.delay);
  }

  api.storage.sync.get(settings, (r) => { Object.assign(settings, r); check(); });
  api.storage.onChanged.addListener((ch) => {
    if (ch.enabled) settings.enabled = ch.enabled.newValue;
    if (ch.delay) settings.delay = ch.delay.newValue;
  });

  let raf = 0;
  new MutationObserver(() => {
    if (raf) return;
    raf = requestAnimationFrame(() => { raf = 0; check(); });
  }).observe(document.body, { childList: true, subtree: true, characterData: true });
  setInterval(check, 2000);
})();
