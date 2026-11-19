/* ===== Router / Hub UI ===== */
(function () {
  // display order inside "Office & Productivity" (as requested)
  const ORDER = ['excel-formulas', 'salary-slip', 'number-to-words', 'invoice', 'attendance', 'templates'];
  TOOLS.sort((a, b) => (a.cat === 'office' && b.cat === 'office') ? ORDER.indexOf(a.id) - ORDER.indexOf(b.id) : 0);
  const hub = $('#hub'), view = $('#toolView'), grid = $('#toolsGrid');
  $('#yr').textContent = new Date().getFullYear();

  function renderGrid(q = '') {
    q = q.trim().toLowerCase();
    let html = '', n = 0;
    Object.entries(CATS).forEach(([k, label]) => {
      const list = TOOLS.filter(t => t.cat === k && (!q || (t.name + ' ' + t.desc + ' ' + label).toLowerCase().includes(q)));
      if (!list.length) return; n += list.length;
      html += `<div class="cat"><h2>${label}</h2><span>${list.length} tools</span></div><div class="grid">${list.map(t => `<a class="tcard" href="#/${t.id}"><span class="tico">${t.ico}</span><div><b>${t.name}</b><small>${t.desc}</small></div></a>`).join('')}</div>`;
    });
    grid.innerHTML = html || '<div class="empty">No tools found. Try another keyword.</div>';
  }

  function route() {
    if (CLEANUP) { try { CLEANUP(); } catch (e) { } CLEANUP = null; }
    const id = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
    const t = TOOLS.find(x => x.id === id);
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

  $('#q').addEventListener('input', e => renderGrid(e.target.value));
  $('#explore').addEventListener('click', e => { e.preventDefault(); history.replaceState(null, '', location.pathname + location.search); route(); grid.scrollIntoView({ behavior: 'smooth' }); });
  $('#navTools').addEventListener('click', e => { if (hub.hidden) return; e.preventDefault(); grid.scrollIntoView({ behavior: 'smooth' }); });
  window.addEventListener('hashchange', route);
  renderGrid(); route();
})();
