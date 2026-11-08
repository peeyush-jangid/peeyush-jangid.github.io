// Owner-only live user list for admin.html (works in the website admin page and the installed admin app).
// Shows every account created on the website or the /app/ with all details, and alerts you on new sign-ups / sign-ins.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore, collection, query, orderBy, limit, onSnapshot, doc, updateDoc, getDocs, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const status = $('u-status');
function say(t, ok) { if (!status) return; status.textContent = t || ''; status.style.color = ok ? '#8ff0b3' : '#ff9aa5'; }

const cfg = window.FIREBASE_CONFIG;
if (!$('u-root')) { /* not on the admin page */ }
else if (!cfg || !cfg.apiKey) { say('firebase-config.js not found or empty.'); }
else init();

function init() {
  const app = initializeApp(cfg);
  const auth = getAuth(app);
  const db = getFirestore(app);
  let unsub = null, first = true, seen = {}, rows = [];
  const opened = new Set();

  /* ---------- styles + toast ---------- */
  const css = document.createElement('style');
  css.textContent = '.u-badge{font-size:.72rem;padding:2px 9px;border-radius:99px;border:1px solid rgba(255,255,255,.2);letter-spacing:.06em}.u-badge.on{color:#8ff0b3;border-color:rgba(143,240,179,.5)}.u-badge.off{color:#ff9aa5;border-color:rgba(255,154,165,.5)}.u-photo{width:64px;height:64px;border-radius:50%;object-fit:cover;border:2px solid #d9bd7b;margin-bottom:.8rem;display:block}.u-ph{width:64px;height:64px;border-radius:50%;display:grid;place-items:center;background:#10284a;color:#d9bd7b;font-weight:800;font-size:1.4rem;margin-bottom:.8rem}.u-act{margin-top:.4rem}.u-link{color:#e2c27e;text-decoration:none}.u-toasts{position:fixed;top:14px;right:14px;z-index:9999;display:grid;gap:10px;max-width:min(360px,calc(100vw - 28px))}.u-toast{background:#10284a;border:1px solid #d9bd7b;border-radius:14px;padding:12px 14px;color:#eef4ff;box-shadow:0 12px 36px rgba(0,0,0,.5);font-size:.9rem;word-break:break-word}.u-toast b{display:block;color:#e2c27e;margin-bottom:2px}';
  document.head.appendChild(css);
  const toasts = document.createElement('div'); toasts.className = 'u-toasts'; document.body.appendChild(toasts);

  function beep() {
    try {
      const A = window.AudioContext || window.webkitAudioContext; if (!A) return;
      const c = new A(), o = c.createOscillator(), g = c.createGain();
      o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = 0.06;
      o.start(); setTimeout(() => { o.stop(); c.close(); }, 220);
    } catch (e) { /* sound is optional */ }
  }
  function alertOwner(title, body) {
    const t = document.createElement('div'); t.className = 'u-toast';
    t.innerHTML = '<b>' + esc(title) + '</b>' + esc(body);
    toasts.appendChild(t); setTimeout(() => t.remove(), 12000);
    try { if ('Notification' in window && Notification.permission === 'granted') new Notification(title, { body, icon: 'admin-icon-192.png' }); } catch (e) { /* ignore */ }
    beep();
  }

  /* ---------- helpers ---------- */
  function fmt(ts) {
    if (!ts) return '-';
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return isNaN(d) ? '-' : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
  }
  const secs = (ts) => (ts && ts.seconds) || 0;
  const sortKey = (u) => secs(u.createdAt) || secs(u.lastLogin);
  const waNumber = (p) => String(p || '').replace(/\D/g, '');

  /* ---------- list ---------- */
  function row(label, val) { return '<div><small>' + label + '</small>' + val + '</div>'; }
  function render() {
    const list = $('u-list'); if (!list) return;
    const data = rows.slice().sort((a, b) => sortKey(b) - sortKey(a));
    $('u-count').textContent = data.length + ' registered user' + (data.length === 1 ? '' : 's');
    if (!data.length) { list.innerHTML = '<p class="u-note">No users yet.</p>'; return; }
    list.innerHTML = data.map((u) => {
      const off = u.status === 'deactivated';
      const init = esc(((u.name || u.email || '?')[0] || '?').toUpperCase());
      const photo = u.photo ? '<img class="u-photo" src="' + esc(u.photo) + '" alt="" referrerpolicy="no-referrer">' : '<div class="u-ph">' + init + '</div>';
      const phone = u.phone ? '<a class="u-link" href="tel:' + esc(u.phone) + '">' + esc(u.phone) + '</a> · <a class="u-link" target="_blank" rel="noopener" href="https://wa.me/' + waNumber(u.phone) + '">WhatsApp</a>' : '-';
      const email = u.email ? '<a class="u-link" href="mailto:' + esc(u.email) + '">' + esc(u.email) + '</a>' : '-';
      return '<details class="u-folder" data-id="' + esc(u.id) + '"' + (opened.has(u.id) ? ' open' : '') + '>'
        + '<summary><b>' + esc(u.name || '(no name)') + '</b><span>' + esc(u.email || '') + '</span><small class="u-badge ' + (off ? 'off' : 'on') + '">' + (off ? 'DEACTIVATED' : 'ACTIVE') + '</small></summary>'
        + '<div class="u-body">' + photo
        + '<div class="u-grid">'
        + row('Mobile', phone) + row('Email', email) + row('Status', off ? 'Deactivated' : 'Active')
        + row('Sign-in method', esc(u.provider || '-')) + row('Registered on', esc(u.source === 'app' ? 'App' : 'Website / App'))
        + row('Joined', esc(fmt(u.createdAt))) + row('Last sign-in', esc(fmt(u.lastLogin))) + row('User ID', esc(u.id))
        + '</div>'
        + '<button class="u-act" type="button" data-act="toggle" data-id="' + esc(u.id) + '" data-next="' + (off ? 'active' : 'deactivated') + '">' + (off ? 'Reactivate account' : 'Deactivate account') + '</button>'
        + '<div class="u-logins" id="lg-' + esc(u.id) + '"><small>RECENT SIGN-INS</small><div class="u-row"><span>Loading…</span></div></div>'
        + '</div></details>';
    }).join('');
    opened.forEach(loadLogins);
  }

  async function loadLogins(id) {
    const box = document.getElementById('lg-' + id); if (!box) return;
    try {
      const s = await getDocs(query(collection(db, 'users', id, 'logins'), orderBy('at', 'desc'), limit(15)));
      box.innerHTML = '<small>RECENT SIGN-INS</small>' + (s.empty ? '<div class="u-row"><span>No sign-ins recorded.</span></div>'
        : s.docs.map((d) => { const x = d.data(); return '<div class="u-row"><span>' + esc(x.event || 'SIGN-IN') + ' · ' + esc(x.provider || '') + '</span><span>' + esc(fmt(x.at)) + '</span></div>'; }).join(''));
    } catch (e) { box.innerHTML = '<small>RECENT SIGN-INS</small><div class="u-row"><span>Could not load.</span></div>'; }
  }

  $('u-list').addEventListener('toggle', (e) => {
    const d = e.target; if (!d.dataset || !d.dataset.id) return;
    if (d.open) { opened.add(d.dataset.id); loadLogins(d.dataset.id); } else opened.delete(d.dataset.id);
  }, true);

  $('u-list').addEventListener('click', (e) => {
    const b = e.target.closest('button[data-act]'); if (!b) return;
    const id = b.dataset.id, next = b.dataset.next;
    if (!confirm(next === 'deactivated' ? 'Deactivate this account? The user will not be able to sign in.' : 'Reactivate this account?')) return;
    const patch = { status: next, updatedAt: serverTimestamp() };
    if (next === 'deactivated') patch.deactivatedAt = serverTimestamp();
    b.disabled = true;
    updateDoc(doc(db, 'users', id), patch).then(() => say('Account ' + (next === 'active' ? 'reactivated.' : 'deactivated.'), true))
      .catch((x) => { b.disabled = false; say('Could not update: ' + (x.code || x.message)); });
  });

  /* ---------- live updates + notifications ---------- */
  function start() {
    stop(); first = true; seen = {};
    unsub = onSnapshot(collection(db, 'users'), (snap) => {
      rows = snap.docs.map((d) => Object.assign({ id: d.id }, d.data()));
      if (!first) {
        snap.docChanges().forEach((ch) => {
          if (ch.doc.metadata.hasPendingWrites) return;
          const d = ch.doc.data(), p = seen[ch.doc.id] || {};
          const who = (d.name || d.email || 'A user') + (d.phone ? ' · ' + d.phone : '');
          if (ch.type === 'added') alertOwner('New account created', who + (d.email ? ' (' + d.email + ')' : ''));
          else if (ch.type === 'modified') {
            if (!p.phone && d.phone) alertOwner('Mobile number added', who);
            else if (secs(d.lastLogin) && secs(d.lastLogin) !== secs(p.lastLogin)) alertOwner('User signed in', who);
          }
        });
      }
      snap.docs.forEach((d) => { seen[d.id] = d.data(); });
      first = false; render();
      if (status && status.style.color !== 'rgb(143, 240, 179)') say('');
    }, (err) => {
      say(err.code === 'permission-denied' ? 'This account is not the owner, so it cannot view users. Sign in with the owner account.' : 'Could not load users: ' + (err.code || err.message));
    });
  }
  function stop() { if (unsub) { unsub(); unsub = null; } }

  /* ---------- notification button ---------- */
  const top = document.querySelector('#u-panel .u-top > div:last-child');
  if (top && 'Notification' in window) {
    const nb = document.createElement('button'); nb.type = 'button'; nb.id = 'u-notify';
    const label = () => { nb.textContent = Notification.permission === 'granted' ? 'Notifications on ✓' : 'Enable notifications'; };
    label();
    nb.addEventListener('click', () => { Notification.requestPermission().then(label).catch(() => {}); });
    top.insertBefore(nb, top.firstChild);
  }

  /* ---------- sign in / out ---------- */
  function authMsg(e) {
    const c = (e && e.code) || '';
    if (/invalid-credential|wrong-password|user-not-found/.test(c)) return 'Email or password is incorrect.';
    if (/too-many/.test(c)) return 'Too many attempts. Wait a few minutes and try again.';
    if (/popup-closed|cancelled/.test(c)) return 'Google sign-in was closed.';
    if (/unauthorized-domain/.test(c)) return 'This domain is not authorised in Firebase (Authentication > Settings > Authorized domains).';
    if (/network/.test(c)) return 'No internet connection.';
    return 'Sign-in failed' + (c ? ' (' + c + ')' : '') + '.';
  }
  $('u-signin').addEventListener('click', () => {
    const e = $('u-email').value.trim(), p = $('u-pass').value;
    if (!e || !p) { say('Enter your owner email and password.'); return; }
    say('');
    signInWithEmailAndPassword(auth, e, p).catch((x) => say(authMsg(x)));
  });
  $('u-google').addEventListener('click', () => {
    say('');
    const pr = new GoogleAuthProvider(); pr.setCustomParameters({ prompt: 'select_account' });
    signInWithPopup(auth, pr).catch((x) => say(authMsg(x)));
  });
  $('u-out').addEventListener('click', () => { signOut(auth); });
  $('u-refresh').addEventListener('click', () => { render(); say('List is live; refreshed.', true); });

  onAuthStateChanged(auth, (user) => {
    $('u-login').style.display = user ? 'none' : '';
    $('u-panel').style.display = user ? '' : 'none';
    if (user) { $('u-who').textContent = 'Signed in as ' + user.email; $('u-pass').value = ''; start(); }
    else { stop(); rows = []; $('u-list').innerHTML = ''; }
  });
}
