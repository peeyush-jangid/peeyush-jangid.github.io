/* Site-wide English | हिंदी switch.
   Hindi uses the Google Translate widget, loaded ONLY when Hindi is chosen (English visitors load nothing extra).
   Add to every page:  <script src="pj-lang.js" defer></script>
   Optional: put <span data-lang-toggle></span> where you want the switch; otherwise it goes into the top <nav>. */
(function () {
  var KEY = 'siteLang', lang = 'en';
  try { lang = localStorage.getItem(KEY) === 'hi' ? 'hi' : 'en'; } catch (e) { }
  window.PJ_LANG = lang;

  function cookie(v) {
    var exp = 'expires=Thu, 01 Jan 1970 00:00:00 GMT', h = location.hostname;
    if (v) { document.cookie = 'googtrans=' + v + ';path=/'; return; }
    document.cookie = 'googtrans=;' + exp + ';path=/';
    document.cookie = 'googtrans=;' + exp + ';path=/;domain=' + h;
    document.cookie = 'googtrans=;' + exp + ';path=/;domain=.' + h;
  }
  function choose(l) {
    if (l === lang) return;
    try { localStorage.setItem(KEY, l); } catch (e) { }
    cookie(l === 'hi' ? '/en/hi' : null);
    location.reload();
  }

  /* keep formulas / code in English while translating */
  function mark() {
    document.querySelectorAll('code,pre,kbd,.copybox').forEach(function (e) {
      if (e.getAttribute('translate') !== 'no') { e.setAttribute('translate', 'no'); e.classList.add('notranslate'); }
    });
  }

  var css = document.createElement('style');
  css.textContent =
    '.pj-lang{display:inline-flex;align-items:center;border:1px solid currentColor;border-radius:99px;overflow:hidden;margin-left:14px;vertical-align:middle;font:600 12px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;list-style:none}' +
    '.pj-lang button{all:unset;box-sizing:border-box;cursor:pointer;padding:7px 11px;color:inherit}' +
    '.pj-lang button.on{background:var(--pjl,#2563eb);color:var(--pjt,#fff)}' +
    '.pj-lang button:focus-visible{outline:2px solid currentColor;outline-offset:-2px}' +
    '.pj-lang.pj-fixed{position:fixed;z-index:99999;right:12px;margin:0;background:#fff;color:#0f172a;box-shadow:0 6px 20px rgba(0,0,0,.25)}' +
    '.pj-lang.pj-top{top:10px}.pj-lang.pj-bot{bottom:14px}' +
    'html,body{top:0!important;margin-top:0!important;position:static!important}' +
    '.goog-te-banner-frame,.goog-te-banner-frame.skiptranslate,iframe.skiptranslate,body>.skiptranslate,iframe.VIpgJd-ZVi9od-ORHb-OEVmcd,.VIpgJd-ZVi9od-ORHb-OEVmcd,.VIpgJd-ZVi9od-aZ2wEe-wOHMyf,#goog-gt-tt,.goog-te-balloon-frame,.goog-tooltip{display:none!important;visibility:hidden!important;height:0!important}' +
    '.goog-text-highlight{background:none!important;box-shadow:none!important}#pj_gt{position:absolute;left:-9999px;top:0;height:0;overflow:hidden}';
  document.head.appendChild(css);

  function init() {
    var bg = (getComputedStyle(document.body).backgroundColor.match(/\d+/g) || [255, 255, 255]).map(Number);
    var dark = (bg[0] * .299 + bg[1] * .587 + bg[2] * .114) < 110 && (bg[3] === undefined || bg[3] > 0);
    var box = document.createElement('div');
    box.className = 'pj-lang notranslate'; box.setAttribute('translate', 'no'); box.setAttribute('role', 'group'); box.setAttribute('aria-label', 'Language');
    box.style.setProperty('--pjl', dark ? '#d4af5a' : '#2563eb'); box.style.setProperty('--pjt', dark ? '#1a1405' : '#fff');
    box.innerHTML = '<button type="button" data-l="en" class="' + (lang === 'en' ? 'on' : '') + '" aria-pressed="' + (lang === 'en') + '">EN</button><button type="button" data-l="hi" class="' + (lang === 'hi' ? 'on' : '') + '" aria-pressed="' + (lang === 'hi') + '">हिंदी</button>';
    box.addEventListener('click', function (e) { var b = e.target.closest('button[data-l]'); if (b) choose(b.dataset.l); });

    var slot = document.querySelector('[data-lang-toggle]'), nav = !slot && (document.querySelector('header nav') || document.querySelector('nav'));
    /* Tools Hub page: switch lives INSIDE the opened tool only (the hub's #toolView is hidden on the home screen, so nothing shows there) */
    var tv = document.getElementById('toolView'), th = tv && tv.querySelector('.thead');
    if (th) {
      box.style.marginLeft = 'auto'; box.style.alignSelf = 'flex-start'; box.style.flex = '0 0 auto';
      th.appendChild(box);
      if (lang === 'hi') { cookie('/en/hi'); mark(); loadGT(); } else cookie(null);
      return;
    }
    function place() {
      if (slot) { if (box.parentNode !== slot) slot.appendChild(box); return; }
      var inNav = false;
      if (nav) {
        var ul = nav.querySelector('ul,ol'), parent = ul || nav;
        if (box.parentNode !== parent) { box.classList.remove('pj-fixed', 'pj-top', 'pj-bot'); parent.appendChild(box); }
        var r = box.getBoundingClientRect(); inNav = box.offsetWidth > 0 && r.right <= innerWidth + 1 && r.left >= 0;
      }
      if (!inNav) { document.body.appendChild(box); box.classList.add('pj-fixed', nav ? 'pj-bot' : 'pj-top'); }
    }
    place(); var t; addEventListener('resize', function () { clearTimeout(t); t = setTimeout(place, 200); });

    if (lang === 'hi') { cookie('/en/hi'); mark(); loadGT(); } else cookie(null);
  }
  function loadGT() {
    var d = document.createElement('div'); d.id = 'pj_gt'; document.body.appendChild(d);
    window.pjGT = function () { new google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'en,hi', autoDisplay: false }, 'pj_gt'); };
    var s = document.createElement('script'); s.src = 'https://translate.google.com/translate_a/element.js?cb=pjGT'; s.async = true; document.head.appendChild(s);
    var q; new MutationObserver(function () { clearTimeout(q); q = setTimeout(mark, 50); }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
