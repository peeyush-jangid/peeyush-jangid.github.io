/* Lightweight visit logger -> Firestore "visits" (no SDK, no IP stored). Shown in admin.html */
(function () {
  try {
    if (localStorage.getItem('ownerNoTrack')) return;
    var ua = navigator.userAgent || '';
    if (/bot|crawl|spider|headless|lighthouse/i.test(ua)) return;
    var path = location.pathname.replace(/index\.html$/, '') || '/';
    var k = 'vt:' + path;
    if (sessionStorage.getItem(k)) return;          // once per session per page
    sessionStorage.setItem(k, '1');

    function send(c) {
      if (!c || !c.apiKey || !c.projectId || c.apiKey.indexOf('YOUR_') === 0) return;
      var vid = localStorage.getItem('vsid');
      if (!vid) { vid = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('vsid', vid); }
      var ref = 'direct';
      try { if (document.referrer) { var h = new URL(document.referrer).hostname; if (h && h !== location.hostname) ref = h; } } catch (e) {}
      var utm = '';
      try { utm = new URLSearchParams(location.search).get('utm_source') || ''; } catch (e) {}
      var s = function (v) { return { stringValue: String(v || '').slice(0, 150) }; };
      var body = { fields: {
        page: s(path),
        site: s(path.indexOf('/app/') === 0 ? 'app' : 'site'),
        ref: s(ref), utm: s(utm),
        device: s(/Mobi|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop'),
        vid: s(vid),
        at: { timestampValue: new Date().toISOString() }
      } };
      fetch('https://firestore.googleapis.com/v1/projects/' + c.projectId + '/databases/(default)/documents/visits?key=' + encodeURIComponent(c.apiKey), {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true
      }).catch(function () {});
    }

    if (window.FIREBASE_CONFIG) send(window.FIREBASE_CONFIG);
    else {
      var sc = document.createElement('script');
      sc.src = '/firebase-config.js';
      sc.onload = function () { send(window.FIREBASE_CONFIG); };
      document.head.appendChild(sc);
    }
  } catch (e) {}
})();
