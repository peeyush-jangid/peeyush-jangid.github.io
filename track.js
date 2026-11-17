/* Visit logger -> Firestore "visits". Shown live in admin.html. Stores no IP address. */
(function () {
  try {
    if (localStorage.getItem('ownerNoTrack')) return;
    var ua = navigator.userAgent || '';
    if (/bot|crawl|spider|headless|lighthouse/i.test(ua)) return;
    var path = location.pathname.replace(/index\.html$/, '') || '/';
    var k = 'vt:' + path;
    if (sessionStorage.getItem(k)) return;          // once per session per page
    sessionStorage.setItem(k, '1');

    function browser() {
      if (/Edg\//.test(ua)) return 'Edge';
      if (/OPR\/|Opera/.test(ua)) return 'Opera';
      if (/SamsungBrowser/.test(ua)) return 'Samsung';
      if (/Firefox\//.test(ua)) return 'Firefox';
      if (/Chrome\//.test(ua)) return 'Chrome';
      if (/Safari\//.test(ua)) return 'Safari';
      return 'Other';
    }
    function os() {
      if (/Windows/.test(ua)) return 'Windows';
      if (/Android/.test(ua)) return 'Android';
      if (/iPhone|iPad|iPod/.test(ua)) return 'iOS';
      if (/Mac OS X/.test(ua)) return 'macOS';
      if (/Linux/.test(ua)) return 'Linux';
      return 'Other';
    }
    function geo() {   // city / country only (from the visitor's IP via free services); IP itself is NOT saved
      return new Promise(function (ok) {
        var done = false, fin = function (v) { if (!done) { done = true; ok(v || {}); } };
        setTimeout(function () { fin(); }, 3500);
        fetch('https://ipwho.is/?fields=success,city,region,country').then(function (r) { return r.json(); })
          .then(function (d) { if (d && d.success) fin(d); else throw 0; })
          .catch(function () {   // fallback provider
            fetch('https://ipapi.co/json/').then(function (r) { return r.json(); })
              .then(function (d) { fin(d && d.city ? { city: d.city, region: d.region, country: d.country_name } : {}); })
              .catch(function () { fin(); });
          });
      });
    }

    function send(c) {
      if (!c || !c.apiKey || !c.projectId || c.apiKey.indexOf('YOUR_') === 0) return;
      var vid = localStorage.getItem('vsid');
      if (!vid) { vid = Math.random().toString(36).slice(2) + Date.now().toString(36); localStorage.setItem('vsid', vid); }
      var ref = 'direct';
      try { if (document.referrer) { var h = new URL(document.referrer).hostname; if (h && h !== location.hostname) ref = h; } } catch (e) {}
      var utm = '';
      try { utm = new URLSearchParams(location.search).get('utm_source') || ''; } catch (e) {}
      var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) {}
      var s = function (v) { return { stringValue: String(v || '').slice(0, 120) }; };
      geo().then(function (g) {
        var body = { fields: {
          page: s(path),
          site: s(path.indexOf('/app/') === 0 ? 'app' : 'site'),
          ref: s(ref), utm: s(utm),
          device: s(/Mobi|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop'),
          browser: s(browser()), os: s(os()),
          screen: s(screen.width + 'x' + screen.height),
          lang: s(navigator.language), tz: s(tz),
          city: s(g.city), region: s(g.region), country: s(g.country),
          vid: s(vid),
          at: { timestampValue: new Date().toISOString() }
        } };
        fetch('https://firestore.googleapis.com/v1/projects/' + c.projectId + '/databases/(default)/documents/visits?key=' + encodeURIComponent(c.apiKey), {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: true
        }).catch(function () {});
      });
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
