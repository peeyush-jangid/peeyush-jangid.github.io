// Owner-only "Registered users" panel for admin.html.
// Reads users saved by index.html in Firestore. Access is enforced by firestore.rules (owner UID only).
(function () {
  var $ = function (id) { return document.getElementById(id); };
  var V = '10.14.1', fb = null;
  var CFG = window.FIREBASE_CONFIG;

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function when(ts) { try { return ts && ts.toDate ? ts.toDate().toLocaleString('en-IN') : '—'; } catch (e) { return '—'; } }
  function say(m, bad) { var s = $('u-status'); s.textContent = m || ''; s.style.color = bad ? '#ff9b9b' : '#d9bd7b'; }

  function load() {
    if (!CFG || !CFG.apiKey) return Promise.reject(new Error('firebase-config.js not found or empty.'));
    if (fb) return Promise.resolve(fb);
    return Promise.all([
      import('https://www.gstatic.com/firebasejs/' + V + '/firebase-app.js'),
      import('https://www.gstatic.com/firebasejs/' + V + '/firebase-auth.js'),
      import('https://www.gstatic.com/firebasejs/' + V + '/firebase-firestore.js')
    ]).then(function (m) {
      var app = m[0].initializeApp(CFG, 'admin'), au = m[1], fs = m[2];
      fb = { au: au, fs: fs, auth: au.getAuth(app), db: fs.getFirestore(app) };
      au.onAuthStateChanged(fb.auth, onAuth);
      return fb;
    });
  }

  function onAuth(user) {
    $('u-login').style.display = user ? 'none' : '';
    $('u-panel').style.display = user ? '' : 'none';
    if (user) {
      $('u-who').textContent = (user.email || '') + '  ·  UID: ' + user.uid;
      refresh();
    }
  }

  function refresh() {
    if (!fb || !fb.auth.currentUser) return;
    var fs = fb.fs;
    $('u-list').textContent = 'Loading…'; say('');
    fs.getDocs(fs.query(fs.collection(fb.db, 'users'), fs.orderBy('lastLogin', 'desc'))).then(function (snap) {
      $('u-count').textContent = snap.size + ' registered user' + (snap.size === 1 ? '' : 's');
      if (snap.empty) { $('u-list').textContent = 'No users yet.'; return; }
      var html = '';
      snap.forEach(function (d) {
        var u = d.data();
        html += '<details class="u-folder" data-uid="' + esc(d.id) + '"><summary><b>📁 ' + esc(u.name || '(no name)') + '</b><span>' + esc(u.email) + '</span></summary>' +
          '<div class="u-body"><div class="u-grid">' +
          '<div><small>Name</small>' + esc(u.name) + '</div>' +
          '<div><small>Email</small>' + esc(u.email) + '</div>' +
          '<div><small>Sign-in method</small>' + esc(u.provider) + '</div>' +
          '<div><small>Registered</small>' + esc(when(u.createdAt)) + '</div>' +
          '<div><small>Last login</small>' + esc(when(u.lastLogin)) + '</div>' +
          '<div><small>User ID</small>' + esc(d.id) + '</div></div>' +
          '<div class="u-logins"><small>Login history</small><div class="u-log">Open to load…</div></div></div></details>';
      });
      $('u-list').innerHTML = html;
    }).catch(function (e) {
      $('u-list').textContent = '';
      say(e.code === 'permission-denied'
        ? 'Permission denied. Put your UID (shown above) in firestore.rules as the owner, then publish the rules.'
        : (e.message || 'Could not load users.'), true);
    });
  }

  function loadLogins(det) {
    if (det.dataset.loaded) return;
    det.dataset.loaded = '1';
    var fs = fb.fs, box = det.querySelector('.u-log');
    box.textContent = 'Loading…';
    fs.getDocs(fs.query(fs.collection(fb.db, 'users', det.dataset.uid, 'logins'), fs.orderBy('at', 'desc'), fs.limit(30))).then(function (s) {
      box.innerHTML = s.empty ? 'No history.' : s.docs.map(function (x) {
        var l = x.data();
        return '<div class="u-row"><span>' + esc(when(l.at)) + '</span><span>' + esc(l.event) + ' · ' + esc(l.provider) + '</span></div>';
      }).join('');
    }).catch(function (e) { box.textContent = e.message || 'Could not load.'; delete det.dataset.loaded; });
  }

  function init() {
    if (!$('u-root')) return;
    $('u-signin').addEventListener('click', function () {
      var em = $('u-email').value.trim(), pw = $('u-pass').value;
      if (!em || !pw) return say('Enter your owner email and password.', true);
      load().then(function (f) { return f.au.signInWithEmailAndPassword(f.auth, em, pw); })
        .then(function () { $('u-pass').value = ''; say(''); })
        .catch(function (e) { say(e.code === 'auth/invalid-credential' ? 'Email or password is incorrect.' : (e.message || 'Sign-in failed.'), true); });
    });
    $('u-google').addEventListener('click', function () {
      load().then(function (f) { return f.au.signInWithPopup(f.auth, new f.au.GoogleAuthProvider()); })
        .catch(function (e) { say(e.message || 'Google sign-in failed.', true); });
    });
    $('u-out').addEventListener('click', function () { if (fb) fb.au.signOut(fb.auth); });
    $('u-refresh').addEventListener('click', refresh);
    $('u-list').addEventListener('toggle', function (e) { if (e.target.open && e.target.classList.contains('u-folder')) loadLogins(e.target); }, true);
    load().catch(function (e) { say(e.message, true); });
  }
  init();
})();
