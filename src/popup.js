const api = typeof browser !== 'undefined' ? browser : chrome;
const $ = (id) => document.getElementById(id);
api.storage.sync.get({ enabled: true, delay: 800 }, (s) => {
  $('enabled').checked = s.enabled; $('delay').value = s.delay; $('dv').textContent = s.delay;
});
api.storage.local.get({ clicks: 0 }, (r) => { $('clicks').textContent = r.clicks; });
$('enabled').onchange = (e) => api.storage.sync.set({ enabled: e.target.checked });
$('delay').oninput = (e) => { $('dv').textContent = e.target.value; api.storage.sync.set({ delay: +e.target.value }); };
$('reset').onclick = () => api.storage.local.set({ clicks: 0 }, () => { $('clicks').textContent = 0; });
