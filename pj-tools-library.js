/* Dynamic PJ Tools Library. This is an additive section; existing tools and styling are untouched. */
(function () {
  const DATA_URL = 'https://raw.githubusercontent.com/peeyush-jangid/peeyush-jangid.github.io/main/pj-tools-library.json';
  const host = document.querySelector('#hub');
  if (!host) return;
  const section = document.createElement('section');
  section.id = 'pj-managed-library';
  section.className = 'wrap';
  section.style.cssText = 'margin:36px auto 54px;';
  section.innerHTML = `
    <div style="padding:22px 0;border-top:1px solid currentColor;opacity:.92">
      <h2 style="margin:0 0 6px">My Knowledge Library</h2>
      <p style="margin:0 0 18px;opacity:.72">Formulas, AutoCAD commands, MS Word tips and more—managed from Admin.</p>
      <input id="pj-library-search" type="search" placeholder="Search formulas, commands, shortcuts…" aria-label="Search library" style="box-sizing:border-box;width:100%;max-width:520px;padding:12px;border-radius:10px;border:1px solid currentColor;background:transparent;color:inherit;font:inherit;margin-bottom:14px">
      <div id="pj-library-filters" style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px"></div>
      <div id="pj-library-items" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px"><p>Loading entries…</p></div>
    </div>`;
  host.appendChild(section);
  const list = section.querySelector('#pj-library-items');
  const search = section.querySelector('#pj-library-search');
  const filters = section.querySelector('#pj-library-filters');
  let entries = [], selected = 'All';
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const categories = () => ['All', ...new Set(entries.map(x => x.category || 'Other'))];
  function renderFilters() {
    filters.innerHTML = categories().map(c => `<button type="button" data-cat="${esc(c)}" style="border:1px solid currentColor;border-radius:999px;padding:7px 12px;background:${selected===c?'currentColor':'transparent'};color:${selected===c?'#fff':'inherit'};font:inherit;cursor:pointer">${esc(c)}</button>`).join('');
    filters.querySelectorAll('button').forEach(b => b.addEventListener('click', () => { selected=b.dataset.cat; renderFilters(); render(); }));
  }
  function render() {
    const q = search.value.trim().toLowerCase();
    const matches = entries.filter(x => (selected==='All' || (x.category||'Other')===selected) && `${x.category||''} ${x.title||''} ${x.content||''} ${x.description||''} ${x.example||''}`.toLowerCase().includes(q));
    if (!matches.length) { list.innerHTML = '<p style="opacity:.7">No entries found.</p>'; return; }
    list.innerHTML = matches.map(x => `<article style="border:1px solid currentColor;border-radius:14px;padding:16px;min-width:0;overflow-wrap:anywhere"><small style="opacity:.7">${esc(x.category||'Other')}</small><h3 style="margin:7px 0">${esc(x.title)}</h3>${x.description?`<p style="margin:0 0 10px;opacity:.78">${esc(x.description)}</p>`:''}<pre style="white-space:pre-wrap;overflow-wrap:anywhere;padding:12px;border-radius:9px;background:rgba(127,127,127,.12);font:inherit;margin:0">${esc(x.content)}</pre>${x.example?`<p style="margin:10px 0 0;opacity:.75"><b>Example:</b> ${esc(x.example)}</p>`:''}</article>`).join('');
  }
  search.addEventListener('input', render);
  fetch(DATA_URL, {cache:'no-store'}).then(r => { if(!r.ok) throw new Error('library file not found'); return r.json(); }).then(data => { entries=Array.isArray(data.items)?data.items:[]; renderFilters(); render(); }).catch(() => { list.innerHTML='<p style="opacity:.7">Library is not published yet. Add entries from Admin and refresh later.</p>'; });
})();
