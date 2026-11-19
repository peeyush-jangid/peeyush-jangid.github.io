/* Tools Manager (admin): edit / hide / delete / restore / reorder built-in tools, add or delete custom tools,
   edit Excel-formula & AutoCAD rows. Saves pj-tools-overrides.json through the GitHub Contents API.
   Uses the token / owner / repo / branch fields already on this page. */
(function () {
  const FILE = 'pj-tools-overrides.json';
  const mount = document.querySelector('.admin-card');
  if (!mount) return;
  const F = 'width:100%;box-sizing:border-box;border:1px solid #34465c;border-radius:9px;background:#071321;color:white;padding:13px;font:inherit';
  const wrap = document.createElement('section');
  wrap.id = 'admin-tools-manager';
  wrap.style.cssText = 'margin-top:34px;padding-top:24px;border-top:1px solid #ffffff24';
  wrap.innerHTML = `
    <h2 style="margin:0 0 6px">Tools Manager</h2>
    <p class="admin-intro">PJ Tools Hub ke tools yahin se edit, hide/show, reorder, delete/restore aur naye add karo. Site ka font aur design same rehta hai.</p>
    <div class="security-note"><b>Token:</b> upar wale "GitHub access token", username, repository aur branch ke boxes use hote hain. Pehle wahan token bharo, phir "Load Tools" dabao.</div>
    <div style="display:flex;flex-wrap:wrap;gap:8px"><button id="tm-load" class="admin-button" type="button" style="flex:1;min-width:150px">Load Tools ↗</button><button id="tm-new" class="admin-refresh" type="button" style="margin-top:22px">+ Add new tool</button></div>
    <div id="tm-status" class="admin-status" aria-live="polite"></div>

    <div id="tm-form" style="display:none;margin-top:18px;padding:16px;border:1px solid #34465c;border-radius:12px">
      <h3 id="tm-form-title" style="margin:0 0 8px">Add new tool</h3>
      <div class="admin-two"><div><label for="tm-cat">Category</label><select id="tm-cat" style="${F}"></select></div><div id="tm-newcat-box" style="display:none"><label for="tm-newcat">New category name</label><input id="tm-newcat" placeholder="e.g. Electrical Tools"></div></div>
      <div class="admin-two"><div><label for="tm-ico">Icon (emoji)</label><input id="tm-ico" placeholder="🧩" maxlength="4"></div><div><label for="tm-name">Tool name</label><input id="tm-name" placeholder="e.g. Pipe Size Chart"></div></div>
      <label for="tm-desc">Short description (card par dikhega)</label><input id="tm-desc" placeholder="One line about the tool">
      <div id="tm-custom-fields">
        <label for="tm-type">Tool type</label>
        <select id="tm-type" style="${F}"><option value="table">Table – formulas / commands (3 columns, search + copy)</option><option value="notes">Questions &amp; Answers (expand / collapse)</option><option value="copy">Copy-paste text snippets</option><option value="html">Custom HTML / JS (apna calculator code)</option></select>
        <div id="tm-head-box"><label for="tm-head">Column names (3, comma separated)</label><input id="tm-head" value="Item, Formula / Command, Use"></div>
        <label for="tm-content" id="tm-content-label">Content</label>
        <textarea id="tm-content" rows="9" style="${F};font-family:monospace"></textarea>
        <div class="file-hint" id="tm-hint"></div>
      </div>
      <div style="display:flex;flex-wrap:wrap;gap:8px"><button id="tm-save" class="admin-button" type="button" style="flex:1;min-width:150px">Publish ↗</button><button id="tm-cancel" class="admin-refresh" type="button" style="margin-top:22px">Cancel</button></div>
    </div>

    <div id="tm-rows" style="display:none;margin-top:18px;padding:16px;border:1px solid #34465c;border-radius:12px">
      <h3 id="tm-rows-title" style="margin:0 0 8px"></h3>
      <div class="file-hint">Har line ek row: <code>Column1 | Column2 | Column3</code>. Line delete karo = row delete, nayi line = nayi row.</div>
      <textarea id="tm-rows-text" rows="16" style="${F};font-family:monospace;margin-top:8px"></textarea>
      <div style="display:flex;flex-wrap:wrap;gap:8px"><button id="tm-rows-save" class="admin-button" type="button" style="flex:1;min-width:150px">Publish rows ↗</button><button id="tm-rows-reset" class="admin-refresh" type="button" style="margin-top:22px">Reset to default</button><button id="tm-rows-cancel" class="admin-refresh" type="button" style="margin-top:22px">Cancel</button></div>
    </div>

    <div class="admin-list-head"><h2>All tools</h2><span id="tm-count" class="admin-files"></span></div>
    <div id="tm-list" class="admin-files">Token bharo aur "Load Tools" dabao.</div>`;
  mount.appendChild(wrap);

  const $ = id => wrap.querySelector('#' + id);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const val = id => (document.getElementById(id)?.value || '').trim();
  const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30) || 'tool';
  const TABLES = { 'excel-formulas': ['Excel formulas & shortcuts', 'Function | Example | Use'], autocad: ['AutoCAD commands', 'Shortcut | Command | What it does'] };
  const emptyOv = () => ({ version: 1, categories: {}, overrides: {}, custom: [], order: {}, tables: {} });
  let base = null, ov = emptyOv(), sha = '', loaded = false, editing = null, rowsFor = null;

  const say = (s, good = false) => { $('tm-status').textContent = s; $('tm-status').style.color = good ? '#9fdb9e' : '#d9bd7b'; };
  function creds() { return { token: val('token'), owner: val('owner') || 'peeyush-jangid', repo: val('repo') || 'peeyush-jangid.github.io', branch: val('branch') || 'main' }; }
  const endpoint = c => `https://api.github.com/repos/${encodeURIComponent(c.owner)}/${encodeURIComponent(c.repo)}/contents/${FILE}`;
  const head = c => ({ Authorization: `Bearer ${c.token}`, Accept: 'application/vnd.github+json' });
  const needToken = c => { if (!c.token) throw new Error('Upar "GitHub access token" box me token bharo (ya connect/unlock karo), phir dobara try karo.'); };

  /* ---------- GitHub I/O ---------- */
  async function readOverrides() {
    const c = creds(); needToken(c);
    const res = await fetch(endpoint(c) + '?ref=' + encodeURIComponent(c.branch) + '&t=' + Date.now(), { headers: head(c) });
    if (res.status === 404) { sha = ''; ov = emptyOv(); return; }
    if (!res.ok) throw new Error(`GitHub read failed (${res.status}). Token, repository aur permission check karo.`);
    const f = await res.json(); sha = f.sha;
    const txt = new TextDecoder().decode(Uint8Array.from(atob(f.content.replace(/\n/g, '')), ch => ch.charCodeAt(0)));
    const d = JSON.parse(txt);
    ov = Object.assign(emptyOv(), d);
  }
  async function writeOverrides(msg) {
    const c = creds(); needToken(c);
    const bytes = new TextEncoder().encode(JSON.stringify(ov, null, 2)); let bin = ''; bytes.forEach(b => bin += String.fromCharCode(b));
    const payload = { message: msg, content: btoa(bin), branch: c.branch }; if (sha) payload.sha = sha;
    const res = await fetch(endpoint(c), { method: 'PUT', headers: { ...head(c), 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!res.ok) { const e = await res.json().catch(() => ({})); throw new Error(res.status === 409 || res.status === 422 ? 'File kisi aur jagah se badal gayi hai. "Load Tools" dabake dobara try karo.' : (e.message || `Publish failed (${res.status}).`)); }
    sha = (await res.json()).content?.sha || sha;
  }
  function loadBase() {
    return new Promise((ok, no) => {
      const f = document.createElement('iframe');
      f.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden'; f.src = 'pj-tools.html?raw=1';
      const t = setTimeout(() => { f.remove(); no(new Error('pj-tools.html load nahi hua.')); }, 15000);
      f.onload = () => {
        clearTimeout(t); let b = null; try { b = f.contentWindow.PJ_BASE; } catch (e) { }
        if (!b) { f.remove(); return no(new Error('Tools data nahi mila. Pehle naya pj-tools-app.js publish karo (GitHub me upload).')); }
        const copy = JSON.parse(JSON.stringify(b)); f.remove(); ok(copy);
      };
      document.body.appendChild(f);
    });
  }
  /* apply a change, publish it, roll back on failure */
  async function commit(change, msg, okMsg) {
    if (!loaded) { say('Pehle "Load Tools" dabao.'); return false; }
    const snap = JSON.stringify(ov); change(); renderList(); say('Publishing…');
    try { await writeOverrides(msg); say(okMsg + ' Public site 1–2 minute me update hogi.', true); return true; }
    catch (e) { ov = JSON.parse(snap); renderList(); say(e.message); return false; }
  }

  /* ---------- merged view ---------- */
  const cats = () => ({ ...base.cats, ...ov.categories });
  function allTools() {
    const list = base.tools.map(t => ({ ...t, builtin: true }));
    ov.custom.forEach(c => list.push({ id: c.id, cat: c.cat, ico: c.ico, name: c.name, desc: c.desc, custom: true, type: c.type }));
    list.forEach((t, i) => {
      t._i = i; const o = ov.overrides[t.id];
      if (o) { ['name', 'ico', 'desc', 'cat'].forEach(k => { if (o[k]) t[k] = o[k]; }); t.hidden = !!o.hidden; t.deleted = !!o.deleted; t.edited = true; }
    });
    const key = t => typeof ov.order[t.id] === 'number' ? ov.order[t.id] : 1e6 + t._i;
    return list.sort((a, b) => key(a) - key(b));
  }
  function renderList() {
    if (!base) return;
    const list = allTools(), live = list.filter(t => !t.deleted), gone = list.filter(t => t.deleted);
    $('tm-count').textContent = `${live.length} tools` + (gone.length ? ` · ${gone.length} deleted` : '');
    let html = Object.entries(cats()).map(([k, label]) => {
      const items = live.filter(t => t.cat === k); if (!items.length) return '';
      return `<div style="margin:14px 0 6px;font-weight:700;color:#d9bd7b">${esc(label)} <span style="opacity:.6;font-weight:400">(${items.length})</span></div>` + items.map((t, i) => `
        <div class="admin-file" style="align-items:center;${t.hidden ? 'opacity:.55' : ''}"><div style="min-width:0"><b>${esc(t.ico)} ${esc(t.name)}</b>
          ${t.hidden ? ' <small style="color:#ff9d9d">HIDDEN</small>' : ''}${t.custom ? ' <small style="color:#9fdb9e">CUSTOM</small>' : t.edited ? ' <small style="color:#d9bd7b">EDITED</small>' : ''}
          <div style="opacity:.65;margin-top:3px">${esc(t.desc)}</div></div>
          <div style="display:flex;flex-wrap:wrap;gap:6px;flex-shrink:0;justify-content:flex-end">
            <button type="button" class="admin-refresh" data-act="up" data-id="${esc(t.id)}" ${i === 0 ? 'disabled' : ''}>▲</button>
            <button type="button" class="admin-refresh" data-act="down" data-id="${esc(t.id)}" ${i === items.length - 1 ? 'disabled' : ''}>▼</button>
            <button type="button" class="admin-refresh" data-act="edit" data-id="${esc(t.id)}">Edit</button>
            ${TABLES[t.id] ? `<button type="button" class="admin-refresh" data-act="rows" data-id="${esc(t.id)}">Rows${ov.tables[t.id] ? ' ✎' : ''}</button>` : ''}
            ${t.custom ? '' : `<button type="button" class="admin-refresh" data-act="hide" data-id="${esc(t.id)}">${t.hidden ? 'Show' : 'Hide'}</button>`}
            <button type="button" class="admin-refresh" data-act="${t.custom ? 'delete' : 'delbuiltin'}" data-id="${esc(t.id)}">Delete</button>
          </div></div>`).join('');
    }).join('');
    if (gone.length) {
      html += `<div style="margin:22px 0 6px;font-weight:700;color:#ff9d9d">Deleted tools <span style="opacity:.6;font-weight:400">(${gone.length}) – Restore se wapas aa jayenge</span></div>` + gone.map(t => `
        <div class="admin-file" style="align-items:center;opacity:.7"><div style="min-width:0"><b>${esc(t.ico)} ${esc(t.name)}</b> <small style="color:#ff9d9d">DELETED</small>
          <div style="opacity:.65;margin-top:3px">${esc(t.desc)}</div></div>
          <div style="flex-shrink:0"><button type="button" class="admin-refresh" data-act="restore" data-id="${esc(t.id)}">Restore</button></div></div>`).join('');
    }
    $('tm-list').innerHTML = html || '<p>No tools.</p>';
  }

  /* ---------- list actions ---------- */
  $('tm-list').addEventListener('click', e => {
    const b = e.target.closest('button[data-act]'); if (!b || b.disabled) return;
    const id = b.dataset.id, act = b.dataset.act, t = allTools().find(x => x.id === id); if (!t) return;
    if (act === 'edit') return openForm(t);
    if (act === 'rows') return openRows(id);
    if (act === 'up' || act === 'down') {
      const same = allTools().filter(x => x.cat === t.cat && !x.deleted), i = same.findIndex(x => x.id === id), j = act === 'up' ? i - 1 : i + 1;
      [same[i], same[j]] = [same[j], same[i]];
      return commit(() => same.forEach((x, n) => ov.order[x.id] = n), 'Reorder tools', 'Order saved.');
    }
    if (act === 'hide') return commit(() => { const o = ov.overrides[id] = ov.overrides[id] || {}; o.hidden = !o.hidden; if (!o.hidden) delete o.hidden; if (!Object.keys(o).length) delete ov.overrides[id]; }, `${t.hidden ? 'Show' : 'Hide'} ${t.name}`, t.hidden ? 'Tool wapas show ho gaya.' : 'Tool hide ho gaya (kabhi bhi Show kar sakte ho).');
    if (act === 'delbuiltin') {
      if (!confirm(`"${t.name}" delete karna hai? (Neeche "Deleted tools" se baad me Restore ho sakta hai)`)) return;
      return commit(() => { const o = ov.overrides[id] = ov.overrides[id] || {}; o.deleted = true; }, `Delete ${t.name}`, 'Tool delete ho gaya.');
    }
    if (act === 'restore') {
      return commit(() => { const o = ov.overrides[id]; if (o) { delete o.deleted; if (!Object.keys(o).length) delete ov.overrides[id]; } }, `Restore ${t.name}`, 'Tool wapas aa gaya.');
    }
    if (act === 'delete') {
      if (!confirm(`"${t.name}" ko permanently delete karna hai?`)) return;
      commit(() => { ov.custom = ov.custom.filter(c => c.id !== id); delete ov.overrides[id]; delete ov.order[id]; }, `Delete ${t.name}`, 'Tool delete ho gaya.');
    }
  });

  /* ---------- add / edit form ---------- */
  const HINTS = {
    table: ['Rows (har line: Column1 | Column2 | Column3)', 'SUM | =SUM(A1:A10) | Adds numbers in a range', 'Har line me 3 parts, | se alag. Search aur Copy button (2nd column copy hota hai) apne aap aayenge.'],
    notes: ['Questions (har line: Question || Answer)', 'What is HVAC? || Heating, ventilation and air conditioning.', 'Question aur Answer ko || se alag karo, ek line me ek pair.'],
    copy: ['Snippets (har line: Title || Text)', 'Greeting || Hello Sir,\\nThank you for your time.', 'Title aur Text ko || se alag karo. Nayi line ke liye \\n likho.'],
    html: ['HTML + JavaScript code', '<input id="a" type="number"> ...', 'Apna tool ka HTML/CSS/JS yahan paste karo. Site ke card style me dikhega. Sirf apna trusted code daalo.']
  };
  function fillCats(sel) {
    $('tm-cat').innerHTML = Object.entries(cats()).map(([k, l]) => `<option value="${esc(k)}">${esc(l)}</option>`).join('') + '<option value="__new">➕ New category…</option>';
    if (sel) $('tm-cat').value = sel; syncCat();
  }
  const syncCat = () => { $('tm-newcat-box').style.display = $('tm-cat').value === '__new' ? '' : 'none'; };
  function syncType() {
    const t = $('tm-type').value, h = HINTS[t];
    $('tm-head-box').style.display = t === 'table' ? '' : 'none';
    $('tm-content-label').textContent = h[0]; $('tm-content').placeholder = h[1]; $('tm-hint').textContent = h[2];
  }
  $('tm-cat').addEventListener('change', syncCat); $('tm-type').addEventListener('change', syncType);
  function serialize(c) {
    if (c.type === 'table') return (c.rows || []).map(r => r.join(' | ')).join('\n');
    if (c.type === 'html') return c.html || '';
    return (c.items || []).map(i => i[0] + ' || ' + String(i[1]).replace(/\n/g, '\\n')).join('\n');
  }
  function openForm(t) {
    if (!loaded) return say('Pehle "Load Tools" dabao.');
    editing = t ? t.id : null; $('tm-rows').style.display = 'none';
    $('tm-form').style.display = ''; $('tm-form-title').textContent = t ? `Edit: ${t.name}` : 'Add new tool';
    fillCats(t ? t.cat : Object.keys(cats())[0]); $('tm-newcat').value = '';
    $('tm-ico').value = t ? t.ico : '🧩'; $('tm-name').value = t ? t.name : ''; $('tm-desc').value = t ? t.desc : '';
    const c = t && t.custom ? ov.custom.find(x => x.id === t.id) : null;
    $('tm-custom-fields').style.display = (!t || c) ? '' : 'none';
    $('tm-type').disabled = !!c; $('tm-type').value = c ? c.type : 'table';
    $('tm-head').value = c && c.head ? c.head.join(', ') : 'Item, Formula / Command, Use';
    $('tm-content').value = c ? serialize(c) : ''; syncType();
    $('tm-save').textContent = t ? 'Update ↗' : 'Publish ↗'; $('tm-form').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  const closeForm = () => { $('tm-form').style.display = 'none'; editing = null; };
  $('tm-new').addEventListener('click', () => openForm(null));
  $('tm-cancel').addEventListener('click', closeForm);

  function parseContent(type, text) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (type === 'html') return { html: text.trim() };
    if (type === 'table') {
      const rows = lines.map(l => { const p = l.split('|').map(x => x.trim()); return [p[0] || '', p[1] || '', p.slice(2).join(' | ')]; }).filter(r => r[0] || r[1]);
      const h = val('tm-head') ? $('tm-head').value.split(',').map(x => x.trim()).filter(Boolean) : [];
      return { head: h.length === 3 ? h : ['Item', 'Formula / Command', 'Use'], rows };
    }
    const items = lines.map(l => { const i = l.indexOf('||'); return i < 0 ? null : [l.slice(0, i).trim(), l.slice(i + 2).trim().replace(/\\n/g, '\n')]; }).filter(x => x && x[0] && x[1]);
    return { items };
  }
  $('tm-save').addEventListener('click', async () => {
    if (!loaded) return say('Pehle "Load Tools" dabao.');
    const name = $('tm-name').value.trim(); if (!name) return say('Tool name likho.');
    const ico = $('tm-ico').value.trim() || '🧩', desc = $('tm-desc').value.trim();
    let cat = $('tm-cat').value, newCatLabel = '';
    if (cat === '__new') {
      newCatLabel = $('tm-newcat').value.trim(); if (!newCatLabel) return say('Nayi category ka naam likho.');
      const hit = Object.entries(cats()).find(([, l]) => l.toLowerCase() === newCatLabel.toLowerCase());
      cat = hit ? hit[0] : 'cat-' + slug(newCatLabel); if (hit) newCatLabel = '';
    }
    const existing = editing ? allTools().find(x => x.id === editing) : null;
    if (existing && !existing.custom) { // built-in: only card details
      return commit(() => { if (newCatLabel) ov.categories[cat] = newCatLabel; const o = ov.overrides[editing] = ov.overrides[editing] || {}; Object.assign(o, { name, ico, desc, cat }); },
        `Edit ${name}`, 'Tool update ho gaya.').then(ok => ok && closeForm());
    }
    const type = $('tm-type').value, data = parseContent(type, $('tm-content').value);
    if (type === 'html' ? !data.html : !(data.rows || data.items).length) return say('Content khaali hai ya format galat hai (hint dekho).');
    commit(() => {
      if (newCatLabel) ov.categories[cat] = newCatLabel;
      const rec = { id: editing || `c-${slug(name)}-${Date.now().toString(36).slice(-4)}`, type, cat, ico, name, desc, ...data };
      if (editing) ov.custom = ov.custom.map(c => c.id === editing ? rec : c); else ov.custom.push(rec);
    }, `${editing ? 'Update' : 'Add'} tool ${name}`, editing ? 'Tool update ho gaya.' : 'Naya tool publish ho gaya.').then(ok => ok && closeForm());
  });

  /* ---------- built-in table rows ---------- */
  function openRows(id) {
    closeForm(); rowsFor = id; const rows = ov.tables[id] || base.tables[id] || [];
    $('tm-rows-title').textContent = `${TABLES[id][0]} – ${rows.length} rows (${TABLES[id][1]})`;
    $('tm-rows-text').value = rows.map(r => r.join(' | ')).join('\n');
    $('tm-rows').style.display = ''; $('tm-rows').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  const closeRows = () => { $('tm-rows').style.display = 'none'; rowsFor = null; };
  $('tm-rows-cancel').addEventListener('click', closeRows);
  $('tm-rows-save').addEventListener('click', () => {
    const rows = $('tm-rows-text').value.split('\n').map(l => l.trim()).filter(Boolean).map(l => { const p = l.split('|').map(x => x.trim()); return [p[0] || '', p[1] || '', p.slice(2).join(' | ')]; });
    if (!rows.length) return say('Kam se kam ek row chahiye.');
    commit(() => { ov.tables[rowsFor] = rows; }, `Update ${rowsFor} rows`, `${rows.length} rows publish ho gayi.`).then(ok => ok && closeRows());
  });
  $('tm-rows-reset').addEventListener('click', () => {
    if (!confirm('Original rows wapas laani hain? Aapke changes hat jayenge.')) return;
    commit(() => { delete ov.tables[rowsFor]; }, `Reset ${rowsFor} rows`, 'Original rows wapas aa gayi.').then(ok => ok && closeRows());
  });

  /* ---------- load ---------- */
  $('tm-load').addEventListener('click', async () => {
    say('Loading…');
    try { await readOverrides(); base = await loadBase(); loaded = true; renderList(); say('Tools load ho gaye.', true); }
    catch (e) { say(e.message); }
  });
})();
