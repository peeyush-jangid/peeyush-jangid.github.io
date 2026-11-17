/* Admin "Visitors" panel: LIVE view of Firestore "visits" (owner only) */
const $ = id => document.getElementById(id);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const root = $('v-root');
const cfg = window.FIREBASE_CONFIG;
if (root && cfg && cfg.apiKey && cfg.apiKey.indexOf('YOUR_') !== 0) {
  const V = '10.14.1';
  const [A, Au, F] = await Promise.all([
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`),
    import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)
  ]);
  const app = A.getApps().some(a => a.name === 'admin') ? A.getApp('admin') : A.initializeApp(cfg, 'admin'); // same named app as users.js -> shares its sign-in
  const auth = Au.getAuth(app), db = F.getFirestore(app);
  const out = $('v-out');
  let stop = null, shown = 30, cur = null, timer = null;
  let cache = [];

  const top = (m, n) => Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, n);
  const rows = l => l.length ? l.map(([k, v]) => `<div class="u-row"><span>${esc(k)}</span><b>${v}</b></div>`).join('') : '<div class="u-note">No data yet.</div>';
  const place = x => [x.city, x.country].filter(Boolean).join(', ') || 'Unknown';

  function draw() {
    const v = cache;
    const now = new Date(), day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const inDays = n => v.filter(x => x.t.getTime() >= day0 - (n - 1) * 864e5);
    const uniq = a => new Set(a.map(x => x.vid)).size;
    const today = inDays(1), d7 = inDays(7), d30 = inDays(30);
    const cnt = (list, f) => { const m = {}; list.forEach(x => { const k = f(x) || '-'; m[k] = (m[k] || 0) + 1; }); return top(m, 6); };
    const card = (l, a, b) => `<div><small>${l}</small><b style="font-size:1.5rem">${a}</b><div class="u-who">${b} unique</div></div>`;
    const live = v.filter(x => now - x.t < 5 * 60e3);
    out.innerHTML = `<div class="u-who" style="margin:.6rem 0">🟢 Live: <b>${uniq(live)}</b> visitor(s) in last 5 min</div>
<div class="u-grid">${card('Today', today.length, uniq(today))}${card('Last 7 days', d7.length, uniq(d7))}${card('Last 30 days', d30.length, uniq(d30))}${card('Loaded (all)', v.length, uniq(v))}</div>
<div class="u-grid"><div><small>Site vs App (30d)</small>${rows(cnt(d30, x => x.site))}</div><div><small>Countries (30d)</small>${rows(cnt(d30, x => x.country))}</div><div><small>Cities (30d)</small>${rows(cnt(d30, x => x.city))}</div><div><small>Sources (30d)</small>${rows(cnt(d30, x => x.utm || x.ref))}</div><div><small>Device / OS (30d)</small>${rows(cnt(d30, x => x.device + ' · ' + x.os))}</div><div><small>Browser (30d)</small>${rows(cnt(d30, x => x.browser))}</div><div><small>Top pages (30d)</small>${rows(cnt(d30, x => x.page))}</div></div>
<small style="display:block;color:#9aa4b2;letter-spacing:.08em;text-transform:uppercase;font-size:.72rem;margin:.8rem 0 .2rem">Latest visitors</small>${v.slice(0, shown).map(x => `<details class="u-folder"><summary><span>${esc(x.t.toLocaleString())}</span><span>${esc(x.site === 'app' ? 'APP' : 'SITE')} ${esc(x.page)}</span><span>${esc(place(x))} · ${esc(x.device)}</span></summary><div class="u-body"><div class="u-grid"><div><small>Location</small>${esc([x.city, x.region, x.country].filter(Boolean).join(', ') || 'Unknown')}</div><div><small>Device</small>${esc(x.device)} · ${esc(x.os)} · ${esc(x.browser)}</div><div><small>Screen</small>${esc(x.screen)}</div><div><small>Language / Timezone</small>${esc(x.lang)} · ${esc(x.tz)}</div><div><small>Came from</small>${esc(x.utm || x.ref)}</div><div><small>Visitor ID</small>${esc(x.vid)}</div></div></div></details>`).join('') || '<div class="u-note">No visits recorded yet.</div>'}${v.length > shown ? '<button id="v-more" type="button">Show more</button>' : ''}`;
    const m = $('v-more'); if (m) m.onclick = () => { shown += 30; draw(); };
  }

  const setCache = snap => {
    cache = snap.docs.map(d => d.data()).map(d => ({ ...d, t: d.at && d.at.toDate ? d.at.toDate() : new Date(0) }));
    $('v-updated').textContent = 'Updated: ' + new Date().toLocaleTimeString();
    draw();
  };
  const q = s => F.query(F.collection(s.db, 'visits'), F.orderBy('at', 'desc'), F.limit(1000));
  async function refreshNow() {
    if (!cur) return;
    const b = $('v-refresh'); b.disabled = true; b.textContent = 'Refreshing…';
    try { setCache(await F.getDocs(q(cur))); } catch (e) { out.innerHTML = esc(e.message || e); }
    b.disabled = false; b.textContent = '🔄 Refresh visitors';
  }
  function setTimer() {
    clearInterval(timer); timer = null;
    if ($('v-auto').checked && cur) timer = setInterval(refreshNow, 30000);
  }
  $('v-refresh').onclick = refreshNow;
  $('v-auto').onchange = setTimer;

  function start(s) {
    cur = s; setTimer();
    out.innerHTML = 'Loading…';
    stop = F.onSnapshot(q(s), setCache, e => {
      out.innerHTML = /permission/i.test(e.message || '') ? 'Permission denied: Firestore rules me "visits" ka owner read rule add karo.' : esc(e.message || e);
    });
  }
  // Watch every Firebase app on the page (users.js may use its own) + own sign-in as a fallback
  const note = $('v-login-note'), login = $('v-login');
  note.textContent = 'Checking sign-in…';
  let user = null, firstDone = false;
  const apps = new Set([app]);
  const apply = () => {
    if (stop) { stop(); stop = null; }
    if (!user) { cur = null; clearInterval(timer); }
    $('v-panel').style.display = user ? '' : 'none';
    note.style.display = user ? 'none' : '';
    login.style.display = (!user && firstDone) ? '' : 'none';
    if (!user && firstDone) note.textContent = 'Visitors dekhne ke liye owner account se sign in karo:';
    if (user) start(user);
  };
  const watch = a => {
    const au = Au.getAuth(a);
    Au.onAuthStateChanged(au, u => { if (u) user = { u, db: F.getFirestore(a) }; else if (user && user.u === au.currentUser) user = null; firstDone = true; apply(); });
  };
  A.getApps().forEach(a => apps.add(a));
  apps.forEach(watch);
  setTimeout(() => { firstDone = true; apply(); }, 2500);
  const err = e => { note.style.display = ''; note.textContent = (e && e.code) || (e && e.message) || String(e); };
  $('v-signin').onclick = () => Au.signInWithEmailAndPassword(auth, $('v-email').value.trim(), $('v-pass').value).catch(err);
  $('v-google').onclick = () => Au.signInWithPopup(auth, new Au.GoogleAuthProvider()).catch(err);
}
