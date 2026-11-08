// Passcode lock for admin.html (owner app).
// The GitHub token is stored on THIS device only, encrypted with your passcode (PBKDF2 + AES-GCM).
// After unlock it is placed into the existing #token field, so admin.js / admin-certs.js work unchanged.
(function () {
  var KEY = 'ownerLockV1', IDLE_MIN = 5;
  var enc = new TextEncoder(), dec = new TextDecoder();
  var idleTimer = null, unlocked = false, fails = 0, blockedUntil = 0;

  // hide the page until unlocked (runs before body is parsed)
  var pre = document.createElement('style');
  pre.id = 'lock-pre';
  pre.textContent = '.admin-shell{visibility:hidden}#lock-ov{position:fixed;inset:0;z-index:99999;background:#050d19;display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto}#lock-ov .box{width:min(420px,100%);border:1px solid #dab5673d;border-radius:20px;padding:26px;background:linear-gradient(145deg,#112339f7,#07111ffe);box-shadow:0 25px 90px #0008;color:#eef4ff;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}#lock-ov .k{color:#d7b36b;letter-spacing:.2em;font-size:11px;font-weight:800}#lock-ov h2{margin:10px 0 6px;font-size:26px}#lock-ov p{color:#aab8c9;font-size:13px;line-height:1.6;margin:0 0 6px}#lock-ov label{display:block;margin:14px 0 6px;font-size:13px;font-weight:700;color:#dce5f1}#lock-ov input{width:100%;box-sizing:border-box;border:1px solid #34465c;border-radius:9px;background:#071321;color:#fff;padding:13px;font:inherit}#lock-ov button{margin-top:16px;width:100%;border:0;border-radius:10px;padding:14px;background:linear-gradient(100deg,#b98c43,#f0d18a);color:#111827;font-weight:800;cursor:pointer;font:inherit;font-weight:800}#lock-ov button.g{background:transparent;color:#aab8c9;border:1px solid #34465c;margin-top:10px;font-weight:600}#lock-ov .m{min-height:20px;margin-top:12px;font-size:13px;color:#ff9b9b}#lock-btn{position:fixed;right:14px;bottom:14px;z-index:9999;border:1px solid #dab5673d;border-radius:999px;background:#07111f;color:#d9bd7b;padding:10px 16px;font:600 13px system-ui,sans-serif;cursor:pointer;box-shadow:0 6px 24px #0008}';
  document.head.appendChild(pre);

  function b64(buf) { var a = new Uint8Array(buf), s = ''; for (var i = 0; i < a.length; i++) s += String.fromCharCode(a[i]); return btoa(s); }
  function unb64(s) { var b = atob(s), a = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a; }
  function deriveKey(pass, salt) {
    return crypto.subtle.importKey('raw', enc.encode(pass), 'PBKDF2', false, ['deriveKey']).then(function (m) {
      return crypto.subtle.deriveKey({ name: 'PBKDF2', salt: salt, iterations: 250000, hash: 'SHA-256' }, m, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']);
    });
  }
  function seal(pass, text) {
    var salt = crypto.getRandomValues(new Uint8Array(16)), iv = crypto.getRandomValues(new Uint8Array(12));
    return deriveKey(pass, salt).then(function (k) { return crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, k, enc.encode(text)); })
      .then(function (ct) { return { salt: b64(salt), iv: b64(iv), ct: b64(ct) }; });
  }
  function open(pass, o) {
    return deriveKey(pass, unb64(o.salt)).then(function (k) { return crypto.subtle.decrypt({ name: 'AES-GCM', iv: unb64(o.iv) }, k, unb64(o.ct)); })
      .then(function (pt) { return dec.decode(pt); });
  }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } }

  var ov, btn;
  function $(id) { return document.getElementById(id); }

  function buildOverlay() {
    ov = document.createElement('div');
    ov.id = 'lock-ov';
    document.body.appendChild(ov);
    btn = document.createElement('button');
    btn.id = 'lock-btn'; btn.type = 'button'; btn.textContent = '🔒 Lock'; btn.style.display = 'none';
    btn.onclick = lock;
    document.body.appendChild(btn);
  }

  function render() {
    var saved = load();
    ov.style.display = 'flex';
    if (!saved) {
      ov.innerHTML = '<div class="box"><img src="favicon.svg" alt="" width="56" height="56" style="display:block;margin-bottom:14px"><div class="k">PRIVATE OWNER APP</div><h2>Setup</h2>' +
        '<p>Pehli baar: apna GitHub token aur ek passcode set karo. Token sirf is device par, passcode se encrypt hokar save hoga.</p>' +
        '<label for="lk-t">GitHub token (sirf is repo ke liye, Contents: Read and write)</label><input id="lk-t" type="password" autocomplete="off" placeholder="github_pat_…">' +
        '<label for="lk-p1">Naya passcode (kam se kam 6 characters)</label><input id="lk-p1" type="password" autocomplete="new-password">' +
        '<label for="lk-p2">Passcode dobara</label><input id="lk-p2" type="password" autocomplete="new-password">' +
        '<button id="lk-go" type="button">Save &amp; open</button><div class="m" id="lk-m"></div></div>';
      $('lk-go').onclick = setup;
    } else {
      ov.innerHTML = '<div class="box"><img src="favicon.svg" alt="" width="56" height="56" style="display:block;margin-bottom:14px"><div class="k">PRIVATE OWNER APP</div><h2>Unlock</h2>' +
        '<p>Passcode daalo.</p>' +
        '<label for="lk-p">Passcode</label><input id="lk-p" type="password" autocomplete="current-password">' +
        '<button id="lk-go" type="button">Unlock</button>' +
        '<button id="lk-reset" class="g" type="button">Reset this device</button><div class="m" id="lk-m"></div></div>';
      $('lk-go').onclick = unlock;
      $('lk-p').addEventListener('keydown', function (e) { if (e.key === 'Enter') unlock(); });
      $('lk-reset').onclick = function () {
        if (confirm('Is device se saved token hata dun? Passcode bhool gaye ho to yehi karna padega.')) { localStorage.removeItem(KEY); render(); }
      };
      setTimeout(function () { var p = $('lk-p'); if (p) p.focus(); }, 50);
    }
  }
  function say(t) { var m = $('lk-m'); if (m) m.textContent = t; }

  function reveal(token) {
    var t = $('token');
    if (t) { t.value = token; t.dispatchEvent(new Event('input', { bubbles: true })); }
    unlocked = true;
    ov.style.display = 'none';
    btn.style.display = 'block';
    pre.textContent = pre.textContent.replace('.admin-shell{visibility:hidden}', '');
    resetIdle();
  }

  function setup() {
    var t = $('lk-t').value.trim(), p1 = $('lk-p1').value, p2 = $('lk-p2').value;
    if (!t) return say('Token daalo.');
    if (p1.length < 6) return say('Passcode kam se kam 6 characters ka ho.');
    if (p1 !== p2) return say('Dono passcode same nahi hain.');
    say('Saving…');
    seal(p1, t).then(function (o) { localStorage.setItem(KEY, JSON.stringify(o)); reveal(t); })
      .catch(function (e) { say('Error: ' + e.message); });
  }

  function unlock() {
    if (Date.now() < blockedUntil) return say(Math.ceil((blockedUntil - Date.now()) / 1000) + ' second ruko, phir try karo.');
    var p = $('lk-p').value, saved = load();
    open(p, saved).then(function (token) { fails = 0; reveal(token); }, function () {
      fails++;
      if (fails >= 5) { blockedUntil = Date.now() + 30000 * (fails - 4); say('Bahut galat koshish. Thodi der ruko.'); }
      else say('Galat passcode.');
    });
  }

  function lock() {
    unlocked = false;
    var t = $('token'); if (t) t.value = '';
    var u = $('u-pass'); if (u) u.value = '';
    ['admin-files', 'admin-certificates'].forEach(function (id) { var el = $(id); if (el) el.textContent = 'Locked. Unlock karke refresh dabao.'; });
    pre.textContent = '.admin-shell{visibility:hidden}' + pre.textContent;
    btn.style.display = 'none';
    clearTimeout(idleTimer);
    render();
  }

  function resetIdle() {
    clearTimeout(idleTimer);
    if (!unlocked) return;
    idleTimer = setTimeout(lock, IDLE_MIN * 60000);
  }
  ['click', 'keydown', 'touchstart', 'scroll'].forEach(function (ev) { document.addEventListener(ev, resetIdle, { passive: true }); });

  var hiddenAt = 0;
  document.addEventListener('visibilitychange', function () {
    if (!unlocked) return;
    if (document.hidden) hiddenAt = Date.now();
    else if (hiddenAt && Date.now() - hiddenAt > IDLE_MIN * 60000) lock();
  });

  document.addEventListener('DOMContentLoaded', function () {
    buildOverlay();
    render();
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('admin-sw.js').catch(function () {});
  });
})();
