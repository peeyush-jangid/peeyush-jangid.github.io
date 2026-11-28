/* ===== PJ Dark / Light toggle =====
   Choice localStorage me save hoti hai, isliye saare pages par same rehti hai.
   Default = Light. Agar visitor ke phone/PC ki setting ke hisaab se chahiye to DEFAULT = 'auto' karein. */
(function () {
  var DEFAULT = 'light', KEY = 'pj-theme', root = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]'), lightColor = meta ? meta.content : '';
  function saved() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function initial() {
    var s = saved(); if (s === 'dark' || s === 'light') return s;
    if (DEFAULT === 'auto') return (window.matchMedia && matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
    return DEFAULT;
  }
  var btn;
  function apply(t) {
    root.setAttribute('data-theme', t);
    if (meta) meta.content = t === 'dark' ? '#0b1220' : lightColor;
    if (btn) { btn.setAttribute('aria-pressed', t === 'dark'); btn.title = t === 'dark' ? 'Light mode par jaayein' : 'Dark mode par jaayein'; btn.setAttribute('aria-label', btn.title); }
  }
  function set(t) { try { localStorage.setItem(KEY, t); } catch (e) { } apply(t); }
  apply(initial());
  function build() {
    if (document.querySelector('.pj-theme-btn')) return;
    btn = document.createElement('button'); btn.type = 'button'; btn.className = 'pj-theme-btn';
    btn.innerHTML = '<svg class="i-moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>' +
      '<svg class="i-sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v3M12 19.5v3M1.5 12h3M19.5 12h3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/></svg>';
    btn.onclick = function () { set(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'); };
    document.body.appendChild(btn); apply(root.getAttribute('data-theme'));
  }
  if (document.body) build(); else document.addEventListener('DOMContentLoaded', build);
  window.addEventListener('storage', function (e) { if (e.key === KEY && (e.newValue === 'dark' || e.newValue === 'light')) apply(e.newValue); });
  window.PJTheme = { set: set, get: function () { return root.getAttribute('data-theme'); } };
})();
