/* ===== Router / Hub UI (with Admin overrides support) =====
   Built-in tools stay exactly as before. If pj-tools-overrides.json exists it is applied on top:
   rename / re-icon / re-describe / move / hide / delete built-in tools, add custom tools and categories,
   and replace the rows of the Excel-formulas and AutoCAD tables. No CSS or markup is changed. */
(function () {
  // display order inside "Office & Productivity" (as requested)
  const ORDER = ['excel-formulas', 'salary-slip', 'number-to-words', 'invoice', 'attendance', 'templates'];
  TOOLS.sort((a, b) => (a.cat === 'office' && b.cat === 'office') ? ORDER.indexOf(a.id) - ORDER.indexOf(b.id) : 0);
  TOOLS.forEach((t, i) => t._i = i);
  const hub = $('#hub'), view = $('#toolView'), grid = $('#toolsGrid');
  $('#yr').textContent = new Date().getFullYear();

  /* snapshot of the original data – used by the Admin "Tools Manager" (pj-tools.html?raw=1) */
  const tbl = { 'excel-formulas': typeof XL !== 'undefined' ? XL : null, autocad: typeof ACAD !== 'undefined' ? ACAD : null };
  try {
    window.PJ_BASE = JSON.parse(JSON.stringify({
      cats: CATS,
      tools: TOOLS.map(t => ({ id: t.id, cat: t.cat, ico: t.ico, name: t.name, desc: t.desc })),
      tables: Object.fromEntries(Object.entries(tbl).filter(e => e[1]).map(([k, v]) => [k, v.map(r => r.slice(0, 3))]))
    }));
  } catch (e) { }

  /* ---------- overrides ---------- */
  function customRender(c) {
    if (c.type === 'table') {
      const head = (Array.isArray(c.head) && c.head.length === 3) ? c.head : ['Item', 'Formula / Command', 'Use'];
      return tableTool(head, (c.rows || []).map(r => [r[0] || '', r[1] || '', r[2] || '']), 'Search…');
    }
    if (c.type === 'notes') return qaPage([{ t: c.name, items: (c.items || []).map(i => [String(i[0]), String(i[1])]) }]);
    if (c.type === 'copy') return copyList((c.items || []).map(i => [String(i[0]), String(i[1])]));
    return el => { // custom HTML / JS
      el.innerHTML = `<div class="card">${c.html || ''}</div>`;
      $$('script', el).forEach(old => {
        const s = document.createElement('script');
        [...old.attributes].forEach(a => s.setAttribute(a.name, a.value));
        s.textContent = old.textContent; old.replaceWith(s);
      });
    };
  }

  function applyOverrides(ov) {
    if (!ov || typeof ov !== 'object') return;
    Object.entries(ov.categories || {}).forEach(([k, v]) => { if (typeof v === 'string' && v.trim()) CATS[k] = v.trim(); });
    Object.entries(ov.tables || {}).forEach(([id, rows]) => {
      const target = tbl[id];
      if (!target || !Array.isArray(rows) || !rows.length) return;
      const clean = rows.filter(r => Array.isArray(r) && r.length >= 3).map(r => r.slice(0, 3).map(String));
      if (!clean.length) return;
      target.splice(0, target.length, ...clean); // in place: tools hold a reference to this array
      const t = TOOLS.find(x => x.id === id);
      if (t) t.desc = t.desc.replace(/^\d+\+/, clean.length + '+');
    });
    (ov.custom || []).forEach((c, i) => {
      if (!c || !c.id || !c.name || TOOLS.some(t => t.id === c.id)) return;
      TOOLS.push({ cat: c.cat || 'office', id: c.id, ico: c.ico || '🧩', name: c.name, desc: c.desc || '', render: customRender(c), custom: true, _i: 5000 + i });
    });
    Object.entries(ov.overrides || {}).forEach(([id, o]) => {
      const t = TOOLS.find(x => x.id === id); if (!t || !o) return;
      ['name', 'ico', 'desc', 'cat'].forEach(k => { if (typeof o[k] === 'string' && o[k].trim()) t[k] = o[k]; });
      if (o.hidden || o.deleted) t.hidden = true; // deleted built-ins are removed from the site (restorable from admin)
    });
    if (ov.order && typeof ov.order === 'object') {
      const key = t => typeof ov.order[t.id] === 'number' ? ov.order[t.id] : 1e6 + t._i;
      TOOLS.sort((a, b) => key(a) - key(b));
    }
  }

  /* ---------- hub ---------- */
  function renderGrid(q = '') {
    q = q.trim().toLowerCase();
    let html = '', n = 0;
    Object.entries(CATS).forEach(([k, label]) => {
      const list = TOOLS.filter(t => !t.hidden && t.cat === k && (!q || (t.name + ' ' + t.desc + ' ' + label).toLowerCase().includes(q)));
      if (!list.length) return; n += list.length;
      html += `<div class="cat"><h2>${esc(label)}</h2><span>${list.length} tools</span></div><div class="grid">${list.map(t => `<a class="tcard" href="#/${t.id}"><span class="tico">${t.ico}</span><div><b>${t.name}</b><small>${t.desc}</small></div></a>`).join('')}</div>`;
    });
    grid.innerHTML = html || '<div class="empty">No tools found. Try another keyword.</div>';
  }

  function route() {
    if (CLEANUP) { try { CLEANUP(); } catch (e) { } CLEANUP = null; }
    const id = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const t = TOOLS.find(x => x.id === id && !x.hidden);
    if (t) {
      hub.hidden = true; view.hidden = false;
      $('#tIco').textContent = t.ico; $('#tName').textContent = t.name; $('#tDesc').textContent = t.desc;
      document.title = t.name + ' – PJ Tools Hub';
      const body = $('#toolBody'); body.innerHTML = '';
      try { t.render(body); } catch (e) { console.error(e); body.innerHTML = `<div class="card">${bad('Something went wrong loading this tool.')}</div>`; }
      window.scrollTo(0, 0);
    } else {
      view.hidden = true; hub.hidden = false;
      document.title = 'PJ Tools Hub – Free Online Tools';
      if (id === 'toolsGrid') setTimeout(() => grid.scrollIntoView(), 0);
    }
  }

  function start() {
    $('#q').addEventListener('input', e => renderGrid(e.target.value));
    $('#explore').addEventListener('click', e => { e.preventDefault(); history.replaceState(null, '', location.pathname + location.search); route(); grid.scrollIntoView({ behavior: 'smooth' }); });
    $('#navTools').addEventListener('click', e => { if (hub.hidden) return; e.preventDefault(); grid.scrollIntoView({ behavior: 'smooth' }); });
    window.addEventListener('hashchange', route);
    renderGrid(); route();
  }

  const raw = /[?&]raw=1/.test(location.search); // admin reads the untouched built-in data this way
  const load = raw ? Promise.resolve(null) : Promise.race([
    fetch('pj-tools-overrides.json?t=' + Date.now(), { cache: 'no-store' }).then(r => r.ok ? r.json() : null).catch(() => null),
    new Promise(ok => setTimeout(() => ok(null), 3000))
  ]);
  load.then(ov => { try { applyOverrides(ov); } catch (e) { console.error('overrides failed', e); } start(); });
})();
