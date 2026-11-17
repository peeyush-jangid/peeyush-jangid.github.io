/* Admin "Visitors" panel: reads Firestore "visits" (owner only) */
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
  const app = A.getApps().length ? A.getApp() : A.initializeApp(cfg);
  const auth = Au.getAuth(app), db = F.getFirestore(app);
  const out = $('v-out');

  function top(map, n) { return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, n); }
  function rows(list) { return list.length ? list.map(([k, v]) => `<div class="u-row"><span>${esc(k)}</span><b>${v}</b></div>`).join('') : '<div class="u-note">No data yet.</div>'; }

  async function load() {
    out.innerHTML = 'Loading…';
    try {
      const snap = await F.getDocs(F.query(F.collection(db, 'visits'), F.orderBy('at', 'desc'), F.limit(2000)));
      const v = snap.docs.map(d => d.data()).map(d => ({ ...d, t: d.at && d.at.toDate ? d.at.toDate() : new Date(0) }));
      const now = new Date(), day0 = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const inDays = n => v.filter(x => x.t.getTime() >= day0 - (n - 1) * 864e5);
      const uniq = a => new Set(a.map(x => x.vid)).size;
      const today = inDays(1), d7 = inDays(7), d30 = inDays(30);
      const by = (key) => { const m = {}; d30.forEach(x => { const k = x[key] || '-'; m[k] = (m[k] || 0) + 1; }); return top(m, 6); };
      const src = {}; d30.forEach(x => { const k = x.utm || x.ref || 'direct'; src[k] = (src[k] || 0) + 1; });
      const card = (l, a, b) => `<div><small>${l}</small><b style="font-size:1.5rem">${a}</b><div class="u-who">${b} unique</div></div>`;
      out.innerHTML = `<div class="u-grid">${card('Today', today.length, uniq(today))}${card('Last 7 days', d7.length, uniq(d7))}${card('Last 30 days', d30.length, uniq(d30))}${card('Loaded (all)', v.length, uniq(v))}</div>
<div class="u-grid"><div><small>Site vs App (30d)</small>${rows(by('site'))}</div><div><small>Devices (30d)</small>${rows(by('device'))}</div><div><small>Sources (30d)</small>${rows(top(src, 6))}</div><div><small>Top pages (30d)</small>${rows(by('page'))}</div></div>
<small style="display:block;color:#9aa4b2;letter-spacing:.08em;text-transform:uppercase;font-size:.72rem;margin:.6rem 0 .2rem">Latest visits</small>${v.slice(0, 15).map(x => `<div class="u-row"><span>${esc(x.t.toLocaleString())}</span><span>${esc(x.site)} ${esc(x.page)}</span><span>${esc(x.device)} · ${esc(x.utm || x.ref)}</span></div>`).join('') || '<div class="u-note">No visits recorded yet.</div>'}`;
    } catch (e) {
      out.innerHTML = /permission/i.test(e.message || '') ? 'Permission denied: Firestore rules me "visits" ka owner read rule add karo (neeche instructions).' : esc(e.message || e);
    }
  }
  Au.onAuthStateChanged(auth, u => {
    $('v-login-note').style.display = u ? 'none' : '';
    $('v-panel').style.display = u ? '' : 'none';
    if (u) load();
  });
  $('v-refresh').addEventListener('click', load);
}
