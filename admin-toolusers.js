/* Admin: Tools Hub sign-ups viewer (Firestore collection "toolUsers"). Uses the same Firebase sign-in as the "Registered users" section. */
const V = '10.12.2', CDN = 'https://www.gstatic.com/firebasejs/' + V + '/';
const $ = (i) => document.getElementById(i);
const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
let rows = [];

function conf() {
  const c = (window.PJ_AUTH && window.PJ_AUTH.firebase) || {};
  return c.apiKey ? c : (window.firebaseConfig || window.FIREBASE_CONFIG || null);
}
const fmt = (t) => { try { return t && t.toDate ? t.toDate().toLocaleString('en-IN') : ''; } catch (e) { return ''; } };

async function load() {
  const list = $('tu-list'); list.textContent = 'Loading…';
  try {
    const [A, S, F] = await Promise.all([import(CDN + 'firebase-app.js'), import(CDN + 'firebase-auth.js'), import(CDN + 'firebase-firestore.js')]);
    const c = conf(); if (!c) throw new Error('Firebase config missing (pj-auth-config.js)');
    const app = A.getApps().length ? A.getApp() : A.initializeApp(c);
    const auth = S.getAuth(app);
    if (!auth.currentUser) { await new Promise((r) => { const u = S.onAuthStateChanged(auth, () => { u(); r(); }); }); }
    if (!auth.currentUser) throw new Error('Pehle "Registered users" section me owner account se sign in karo.');
    const db = F.getFirestore(app);
    const col = (window.PJ_AUTH && window.PJ_AUTH.usersCollection) || 'toolUsers';
    const snap = await F.getDocs(F.query(F.collection(db, col), F.orderBy('createdAt', 'desc')));
    rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    render();
  } catch (e) {
    list.innerHTML = '<p class="err" style="color:var(--redtxt)">' + esc(e.code === 'permission-denied' ? 'Permission denied – Firestore rules me owner email allow karo.' : e.message) + '</p>';
  }
}

function render() {
  const q = ($('tu-q').value || '').toLowerCase();
  const f = rows.filter((r) => !q || JSON.stringify([r.fullName, r.email, r.mobile, r.city, r.state, r.country, r.categories, r.purposes]).toLowerCase().includes(q));
  $('tu-count').textContent = f.length + ' of ' + rows.length + ' users';
  $('tu-list').innerHTML = f.map((r) => {
    const av = r.photo ? '<img src="' + esc(r.photo) + '" alt="" style="width:56px;height:56px;border-radius:50%;object-fit:cover">' : '<div class="av" style="width:56px;height:56px">' + esc((r.firstName || '?').charAt(0).toUpperCase()) + '</div>';
    return '<details class="u-folder"><summary><b>' + esc(r.fullName || r.email) + '</b><span>' + esc(r.email) + '</span></summary><div class="u-body">' +
      '<div style="display:flex;gap:14px;align-items:center;margin-bottom:12px">' + av + '<div class="u-who">UID: ' + esc(r.uid || r.id) + '</div></div>' +
      '<div class="u-grid">' +
      [['First name', r.firstName], ['Middle name', r.middleName], ['Last name', r.lastName], ['Email', r.email], ['Email verified', r.emailVerified ? 'Yes (OTP)' : 'No'], ['Mobile', r.mobile],
      ['Country', r.country], ['State', r.state], ['City', r.city], ['User category', (r.categories || []).join(', ')], ['Purpose', (r.purposes || []).join(', ')],
      ['Terms accepted', r.termsAccepted ? 'Yes' : 'No'], ['Registered on', fmt(r.createdAt)], ['Last login', fmt(r.lastLogin)]]
        .map((x) => '<div><small>' + x[0] + '</small>' + esc(x[1] || '–') + '</div>').join('') +
      '</div></div></details>';
  }).join('') || '<p class="file-hint">Koi user nahi mila.</p>';
}

function csv() {
  const h = ['firstName', 'middleName', 'lastName', 'email', 'mobile', 'country', 'state', 'city', 'categories', 'purposes', 'createdAt', 'lastLogin'];
  const q = (v) => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  const lines = [h.join(',')].concat(rows.map((r) => h.map((k) => q(Array.isArray(r[k]) ? r[k].join('; ') : (k === 'createdAt' || k === 'lastLogin') ? fmt(r[k]) : r[k])).join(',')));
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv' }));
  a.download = 'tool-users.csv'; a.click();
}

$('tu-load').addEventListener('click', load);
$('tu-q').addEventListener('input', render);
$('tu-csv').addEventListener('click', () => rows.length ? csv() : load().then(csv));
