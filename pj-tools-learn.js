/* ===== PJ Tools Hub – Learning engine: tabs, command tables, Q&A, practice tests, practice sheets =====
   Exposes window.PJ. Everything runs in the browser, progress is saved in localStorage. */
(function () {
  const PJ = window.PJ = window.PJ || {};
  const LS = PJ.LS = {
    get(k, d) { try { const v = localStorage.getItem('pj_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('pj_' + k, JSON.stringify(v)); } catch (e) { } }
  };
  const timers = new Set();
  PJ.timer = (fn, ms) => { const id = setInterval(fn, ms); timers.add(id); return id; };
  PJ.clear = id => { clearInterval(id); timers.delete(id); };
  PJ.cleanup = () => { timers.forEach(clearInterval); timers.clear(); try { speechSynthesis.cancel(); } catch (e) { } };

  const LVN = { B: 'Beginner', I: 'Intermediate', P: 'Pro', F: 'Fresher', E: 'Experienced' };
  const LVC = { B: 'b', I: 'i', P: 'p', F: 'f', E: 'e' };
  PJ.LVN = LVN;
  const lvTag = l => `<span class="lv ${LVC[l] || ''}">${LVN[l] || l}</span>`;
  PJ.lvTag = lvTag;
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  PJ.shuffle = shuffle;
  const mmss = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  PJ.mmss = mmss;

  /* ---------- compact-data parsers ---------- */
  PJ.rows = s => s.trim().split('\n').map(l => l.trim()).filter(Boolean).map(l => l.split('|').map(x => x.trim()));
  PJ.qs = s => PJ.rows(s).map(r => ({ l: r[0], q: r[1], o: r.slice(2, 6), a: (+r[6]) - 1, e: r[7] || '' }));
  PJ.tasks = s => PJ.rows(s).map(r => ({ l: r[0], t: r[1], a: r[2] || '' }));
  PJ.qa = s => PJ.rows(s).map(r => ({ l: r[0], q: r[1], a: r[2] || '' }));

  /* ---------- print / download helpers ---------- */
  PJ.printHTML = (title, html) => {
    const w = window.open('', '_blank');
    const page = `<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>body{font-family:Calibri,Arial,sans-serif;max-width:780px;margin:24px auto;padding:0 18px;color:#111;line-height:1.5}h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:18px 0 6px;border-bottom:1px solid #999}.t{margin:0 0 14px;page-break-inside:avoid}.line{border-bottom:1px solid #999;height:24px}.k{page-break-before:always}small{color:#555}code{background:#eee;padding:1px 4px}@media print{.np{display:none}}</style></head><body><button class="np" onclick="print()" style="float:right;padding:8px 14px">Print / Save as PDF</button>${html}</body></html>`;
    if (!w) { dlDoc(title.replace(/\W+/g, '_'), esc(title), html); toast('Popup blocked – downloaded as Word file'); return; }
    w.document.write(page); w.document.close(); setTimeout(() => { try { w.focus(); w.print(); } catch (e) { } }, 400);
  };

  /* ---------- tabs ---------- */
  PJ.tabs = (el, defs, start = 0) => {
    el.innerHTML = `<div class="pj-tabs noprint">${defs.map((d, i) => `<button class="tab" data-i="${i}">${d[0]}</button>`).join('')}</div><div class="pj-pane"></div>`;
    const pane = $('.pj-pane', el);
    const go = i => {
      PJ.cleanup();
      $$('.tab', el).forEach((b, k) => b.classList.toggle('on', k === i));
      pane.innerHTML = ''; defs[i][1](pane);
      LS.set('lasttab_' + (el.dataset.k || ''), i);
    };
    $$('.tab', el).forEach(b => b.onclick = () => { go(+b.dataset.i); });
    go(Math.min(start, defs.length - 1));
    return go;
  };

  /* ---------- command / reference table with level filter ---------- */
  PJ.cmdTable = (box, cfg) => {
    const rows = cfg.rows, head = cfg.head || ['Command', 'What it does'];
    let lv = 'all';
    box.innerHTML = `<div class="card"><div class="pj-bar"><label class="fld"><span>Search</span><input id="cq" type="search" placeholder="${esc(cfg.ph || 'Search command, shortcut or use…')}"></label>
      <div class="tabs" style="margin:0" id="clv"><button class="tab on" data-l="all">All</button>${['B', 'I', 'P'].map(l => `<button class="tab" data-l="${l}">${LVN[l]}</button>`).join('')}</div>
      <button class="btn sm ghost" id="cdl">⬇ Download CSV</button><button class="btn sm ghost" id="cpr">🖨 Print cheat-sheet</button></div>
      <div class="note" id="cn" style="margin:0 0 10px"></div><div class="scroll"><table class="pj-cmd"><tr><th>Level</th><th>${head[0]}</th><th>${head[1]}</th><th></th></tr><tbody id="cb"></tbody></table></div></div>`;
    const key = c => /^((ctrl|alt|shift|win)\+|f\d{1,2}(\b|$)|(tab|enter|esc|home|end|del|space|page ?up|page ?down)(\+|$))/i.test(c) ? c.split('+').map(k => `<kbd>${esc(k.trim())}</kbd>`).join(' + ') : `<code>${esc(c)}</code>`;
    const draw = () => {
      const q = $('#cq', box).value.toLowerCase().trim();
      const list = rows.filter(r => (lv === 'all' || r[0] === lv) && (!q || r.join(' ').toLowerCase().includes(q)));
      $('#cb', box).innerHTML = list.map((r, i) => `<tr><td>${lvTag(r[0])}</td><td>${key(r[1])}</td><td>${esc(r[2])}</td><td><button class="btn sm ghost" data-c="${esc(r[1])}">Copy</button></td></tr>`).join('') || '<tr><td colspan="4" class="empty">Nothing found</td></tr>';
      $('#cn', box).textContent = `${list.length} of ${rows.length} items`;
      $$('[data-c]', box).forEach(b => b.onclick = () => copy(b.dataset.c));
    };
    $('#cq', box).addEventListener('input', draw);
    $$('#clv .tab', box).forEach(b => b.onclick = () => { lv = b.dataset.l; $$('#clv .tab', box).forEach(x => x.classList.toggle('on', x === b)); draw(); });
    $('#cdl', box).onclick = () => dlCsv(cfg.name || 'commands', [['Level', head[0], head[1]], ...rows.map(r => [LVN[r[0]], r[1], r[2]])]);
    $('#cpr', box).onclick = () => PJ.printHTML(cfg.title || 'Cheat-sheet', `<h1>${esc(cfg.title || 'Cheat-sheet')}</h1><small>PJ Tools Hub</small>` + ['B', 'I', 'P'].map(l => `<h2>${LVN[l]}</h2><table border="1" cellpadding="4" style="border-collapse:collapse;width:100%;font-size:12px">${rows.filter(r => r[0] === l).map(r => `<tr><td style="width:32%"><b>${esc(r[1])}</b></td><td>${esc(r[2])}</td></tr>`).join('')}</table>`).join(''));
    draw();
  };

  /* ---------- Q&A with level (+ optional group/field) filter ---------- */
  PJ.qaList = (box, cfg) => {
    const items = cfg.items, levels = cfg.levels || ['F', 'E'];
    const groups = cfg.groups || null;
    box.innerHTML = `<div class="card"><div class="pj-bar">
      ${groups ? `<label class="fld"><span>Field / Subject</span><select id="qg">${groups.map(g => `<option>${esc(g)}</option>`).join('')}</select></label>` : ''}
      <label class="fld sm"><span>Level</span><select id="ql"><option value="all">All levels</option>${levels.map(l => `<option value="${l}">${LVN[l]}</option>`).join('')}</select></label>
      <label class="fld"><span>Search</span><input id="qs2" type="search" placeholder="Search question or answer…"></label></div>
      <div class="row" style="margin:0 0 12px"><button class="btn sm ghost" id="qsh">🔀 Shuffle</button><button class="btn sm ghost" id="qex">Expand / collapse all</button><button class="btn sm ghost" id="qdl">⬇ Download Word</button><button class="btn sm ghost" id="qpr">🖨 Print</button></div>
      <div class="note" id="qn" style="margin:0 0 10px"></div><div id="qb"></div></div>`;
    let order = items.map((_, i) => i);
    const cur = () => {
      const g = groups ? $('#qg', box).value : null, l = $('#ql', box).value, q = $('#qs2', box).value.toLowerCase().trim();
      return order.map(i => items[i]).filter(x => (!g || x.g === g) && (l === 'all' || x.l === l) && (!q || (x.q + ' ' + x.a).toLowerCase().includes(q)));
    };
    const draw = () => {
      const list = cur();
      $('#qb', box).innerHTML = list.map(x => `<details><summary>${esc(x.q)} ${lvTag(x.l)}</summary><p>${esc(x.a)}</p></details>`).join('') || '<div class="empty">No questions found for this filter.</div>';
      $('#qn', box).textContent = list.length + ' questions';
    };
    $$('select,input', box).forEach(x => x.addEventListener('input', draw));
    $('#qsh', box).onclick = () => { order = shuffle(order); draw(); };
    $('#qex', box).onclick = () => { const d = $$('details', box); const open = d.some(x => !x.open); d.forEach(x => x.open = open); };
    const html = () => `<h1>${esc(cfg.title || 'Interview questions')}</h1><small>PJ Tools Hub</small>` + cur().map((x, i) => `<div class="t"><b>${i + 1}. ${esc(x.q)}</b> <small>(${LVN[x.l] || ''})</small><br>${esc(x.a)}</div>`).join('');
    $('#qdl', box).onclick = () => dlDoc((cfg.name || 'questions'), esc(cfg.title || 'Questions'), html());
    $('#qpr', box).onclick = () => PJ.printHTML(cfg.title || 'Questions', html());
    draw();
  };

  /* ---------- Practice test (MCQ) ---------- */
  PJ.quiz = (box, cfg) => {
    const all = cfg.qs, lvls = [...new Set(all.map(q => q.l))].filter(Boolean);
    const bestKey = 'best_' + cfg.id;
    const best = LS.get(bestKey, null);
    const setup = () => {
      PJ.cleanup();
      box.innerHTML = `<div class="card"><h3>📝 ${esc(cfg.title)}</h3>
        <div class="form">
          <label class="fld"><span>Level</span><select id="zl"><option value="all">All levels (${all.length} Q)</option>${lvls.map(l => `<option value="${l}">${LVN[l] || l} (${all.filter(q => q.l === l).length} Q)</option>`).join('')}</select></label>
          <label class="fld"><span>Number of questions</span><select id="zn"><option>5</option><option selected>10</option><option>15</option><option>20</option><option value="999">All</option></select></label>
          <label class="fld"><span>Timer (minutes, 0 = no timer)</span><input id="zt" type="number" min="0" step="1" value="10"></label>
          <label class="fld"><span>Mode</span><select id="zm"><option value="exam">Exam – answers at the end</option><option value="learn">Practice – show answer after each question</option></select></label>
        </div><div class="row"><button class="btn" id="zgo">Start test →</button></div>
        ${best ? `<p class="note">Your best score: <b>${best.pct}%</b> (${best.s}/${best.n}) · attempts: ${best.tries || 1}</p>` : ''}</div>`;
      $('#zgo', box).onclick = () => start(all);
    };
    const start = (pool, retry) => {
      const lv = retry ? 'all' : $('#zl', box).value;
      let list = pool.filter(q => lv === 'all' || q.l === lv);
      const n = retry ? list.length : Math.min(+$('#zn', box).value, list.length);
      const mins = retry ? 0 : Math.max(0, +$('#zt', box).value || 0);
      const mode = retry ? 'learn' : $('#zm', box).value;
      list = shuffle(list).slice(0, n).map(q => {
        const idx = shuffle(q.o.map((_, i) => i)); return { ...q, o2: idx.map(i => q.o[i]), a2: idx.indexOf(q.a), pick: -1 };
      });
      if (!list.length) return toast('No questions for this level');
      let i = 0, left = mins * 60, tid = null, done = false;
      const finish = () => {
        if (done) return; done = true; if (tid) PJ.clear(tid);
        const s = list.filter(q => q.pick === q.a2).length, pct = Math.round(s / list.length * 100);
        if (!retry) { const b = LS.get(bestKey, null); LS.set(bestKey, { pct: Math.max(pct, b ? b.pct : 0), s: pct >= (b ? b.pct : 0) ? s : b.s, n: pct >= (b ? b.pct : 0) ? list.length : b.n, tries: (b ? b.tries || 1 : 0) + 1 }); }
        const grade = pct >= 85 ? '🏆 Excellent!' : pct >= 65 ? '👍 Good – keep practising' : pct >= 40 ? '📘 Average – revise the topics below' : '💪 Needs more practice – start with the Commands tab';
        box.innerHTML = `<div class="card"><h3>Result</h3><div class="res"><div class="rr big"><span>${grade}</span><b>${s} / ${list.length} (${pct}%)</b></div>
          <div class="rr"><span>Correct</span><b>${s}</b></div><div class="rr"><span>Wrong</span><b>${list.filter(q => q.pick >= 0 && q.pick !== q.a2).length}</b></div><div class="rr"><span>Skipped</span><b>${list.filter(q => q.pick < 0).length}</b></div></div>
          <div class="row"><button class="btn" id="zre">New test</button>${s < list.length ? '<button class="btn ghost" id="zwr">Retry wrong ones</button>' : ''}<button class="btn ghost" id="zdl">⬇ Download result</button></div></div>
          <div class="card"><h3>Review</h3>${list.map((q, k) => `<div class="qz-rev ${q.pick === q.a2 ? 'ok' : 'no'}"><b>${k + 1}. ${esc(q.q)}</b><br>Your answer: ${q.pick < 0 ? '<i>skipped</i>' : esc(q.o2[q.pick])}<br>Correct answer: <b>${esc(q.o2[q.a2])}</b>${q.e ? `<div class="qz-ex">${esc(q.e)}</div>` : ''}</div>`).join('')}</div>`;
        $('#zre', box).onclick = setup;
        const wr = $('#zwr', box); if (wr) wr.onclick = () => start(list.filter(q => q.pick !== q.a2).map(q => ({ l: q.l, q: q.q, o: q.o, a: q.a, e: q.e })), true);
        $('#zdl', box).onclick = () => dlDoc('practice-result', 'Result', `<h1>${esc(cfg.title)} – Result</h1><p><b>Score: ${s}/${list.length} (${pct}%)</b> · ${new Date().toLocaleString()}</p>` + list.map((q, k) => `<p><b>${k + 1}. ${esc(q.q)}</b><br>Your answer: ${q.pick < 0 ? 'skipped' : esc(q.o2[q.pick])}<br>Correct: ${esc(q.o2[q.a2])}<br><i>${esc(q.e)}</i></p>`).join(''));
      };
      const show = () => {
        const q = list[i], locked = mode === 'learn' && q.pick >= 0;
        box.innerHTML = `<div class="card"><span class="qz-timer" id="ztm">${mins ? mmss(left) : ''}</span><div class="note" style="margin:0">Question ${i + 1} of ${list.length} ${lvTag(q.l)}</div>
          <div class="pj-meter" style="margin:8px 0"><i style="width:${i / list.length * 100}%"></i></div>
          <div class="qz-q">${esc(q.q)}</div>
          ${q.o2.map((o, k) => `<button class="qz-o ${locked ? (k === q.a2 ? 'ok' : (k === q.pick ? 'no' : '')) : (q.pick === k ? 'sel' : '')}" data-k="${k}" ${locked ? 'disabled' : ''}>${String.fromCharCode(65 + k)}. ${esc(o)}</button>`).join('')}
          ${locked && q.e ? `<div class="qz-ex">💡 ${esc(q.e)}</div>` : ''}
          <div class="row"><button class="btn ghost" id="zpv" ${i ? '' : 'disabled'}>← Back</button><button class="btn" id="znx">${i === list.length - 1 ? 'Finish ✔' : 'Next →'}</button><button class="btn ghost" id="zsk">Skip</button></div></div>`;
        $$('.qz-o', box).forEach(b => b.onclick = () => { q.pick = +b.dataset.k; show(); });
        $('#zpv', box).onclick = () => { i--; show(); };
        $('#zsk', box).onclick = () => { if (mode === 'learn') q.pick = -1; if (i === list.length - 1) finish(); else { i++; show(); } };
        $('#znx', box).onclick = () => { if (i === list.length - 1) finish(); else { i++; show(); } };
      };
      if (mins) tid = PJ.timer(() => { left--; const t = $('#ztm', box); if (t) { t.textContent = mmss(Math.max(left, 0)); t.classList.toggle('low', left <= 30); } if (left <= 0) { toast('Time up! ⏰'); finish(); } }, 1000);
      show();
    };
    setup();
  };

  /* ---------- Practice sheet (hands-on tasks, printable, progress saved) ---------- */
  PJ.sheet = (box, cfg) => {
    const tasks = cfg.tasks, lvls = [...new Set(tasks.map(t => t.l))];
    const key = 'sheet_' + cfg.id;
    let lv = lvls[0], prog = LS.get(key, {}), showAns = false;
    const id = t => t.l + ':' + tasks.indexOf(t);
    const draw = () => {
      const list = tasks.filter(t => t.l === lv), allDone = tasks.filter(t => prog[id(t)]).length;
      box.innerHTML = `<div class="card ${showAns ? 'sh-show' : ''}"><h3>📄 ${esc(cfg.title)}</h3><p class="note" style="margin:0 0 10px">${esc(cfg.intro || 'Do each task yourself in the application, tick it when done. Check the answer only after trying.')}</p>
        <div class="tabs" style="margin-bottom:10px">${lvls.map(l => `<button class="tab ${l === lv ? 'on' : ''}" data-l="${l}">${LVN[l]} (${tasks.filter(t => t.l === l).length})</button>`).join('')}</div>
        <div class="pj-meter"><i style="width:${allDone / tasks.length * 100}%"></i></div><div class="note" style="margin:4px 0 12px">Overall progress: ${allDone} / ${tasks.length} tasks done</div>
        <div class="row" style="margin:0 0 12px"><label style="display:flex;gap:6px;align-items:center;font-size:.85rem"><input type="checkbox" id="sha" style="width:auto" ${showAns ? 'checked' : ''}> Show answers</label>
          <button class="btn sm ghost" id="shp">🖨 Print worksheet</button><button class="btn sm ghost" id="shd">⬇ Word (with answer key)</button><button class="btn sm ghost" id="shr">↺ Reset progress</button></div>
        ${list.map(t => `<div class="sh-task ${prog[id(t)] ? 'done' : ''}"><input type="checkbox" data-t="${id(t)}" ${prog[id(t)] ? 'checked' : ''}><div style="flex:1"><b>${list.indexOf(t) + 1}. ${esc(t.t)}</b><div class="ans">✔ ${esc(t.a)}</div></div></div>`).join('')}</div>`;
      $$('.tab', box).forEach(b => b.onclick = () => { lv = b.dataset.l; draw(); });
      $$('[data-t]', box).forEach(c => c.onchange = () => { prog[c.dataset.t] = c.checked ? 1 : 0; LS.set(key, prog); draw(); });
      $('#sha', box).onchange = e => { showAns = e.target.checked; draw(); };
      $('#shr', box).onclick = () => { if (confirm('Reset all progress for this sheet?')) { prog = {}; LS.set(key, prog); draw(); } };
      const doc = withKey => `<h1>${esc(cfg.title)}</h1><small>Name: ________________ &nbsp; Date: __________ &nbsp; Score: ____ / ${tasks.length}</small>` +
        lvls.map(l => `<h2>${LVN[l]}</h2>` + tasks.filter(t => t.l === l).map((t, k) => `<div class="t"><b>${k + 1}. ${esc(t.t)}</b><div class="line"></div><div class="line"></div></div>`).join('')).join('') +
        (withKey ? `<div class="k"><h1>Answer key</h1>` + lvls.map(l => `<h2>${LVN[l]}</h2>` + tasks.filter(t => t.l === l).map((t, k) => `<div class="t"><b>${k + 1}.</b> ${esc(t.a)}</div>`).join('')).join('') + '</div>' : '');
      $('#shp', box).onclick = () => PJ.printHTML(cfg.title, doc(false));
      $('#shd', box).onclick = () => dlDoc(cfg.id + '-practice-sheet', esc(cfg.title), doc(true).replace(/class="line"/g, 'style="border-bottom:1px solid #999;height:22px"'));
    };
    draw();
  };

  /* ---------- one-stop learning tool: Commands / Interview / Test / Sheet ---------- */
  PJ.learnTool = c => {
    const defs = [];
    if (c.cmds) defs.push(['⌨ ' + (c.cmdTab || 'Commands'), p => PJ.cmdTable(p, { rows: c.cmds, head: c.cmdHead, title: c.name + ' – Cheat-sheet', name: c.id + '-commands', ph: c.ph })]);
    if (c.guide) defs.push(['📘 Learn', c.guide]);
    if (c.qa) defs.push(['🎤 Interview Q&A', p => PJ.qaList(p, { items: c.qa, title: c.name + ' – Interview Questions', name: c.id + '-interview', levels: ['F', 'E'] })]);
    if (c.qs) defs.push(['📝 Practice Test', p => PJ.quiz(p, { id: c.id, title: c.name + ' – Practice Test', qs: c.qs })]);
    if (c.tasks) defs.push(['📄 Practice Sheet', p => PJ.sheet(p, { id: c.id, title: c.name + ' – Practice Sheet', tasks: c.tasks, intro: c.sheetIntro })]);
    (c.extra || []).forEach(x => defs.push(x));
    TOOLS.push({
      cat: c.cat || 'learn', id: c.id, ico: c.ico, name: c.name, desc: c.desc, tags: c.tags || ['Practice test', 'Practice sheet'],
      render: el => { CLEANUP = PJ.cleanup; el.dataset.k = c.id; PJ.tabs(el, defs); }
    });
  };

  /* ---------- new hub category + order ---------- */
  const keep = Object.assign({}, CATS); Object.keys(CATS).forEach(k => delete CATS[k]);
  ['calc', 'career', 'learn', 'hvac', 'office', 'ai'].forEach(k => { CATS[k] = k === 'learn' ? 'Learn & Practice (Word · PowerPoint · Excel · AutoCAD · HVAC)' : keep[k]; });
  Object.keys(keep).forEach(k => { if (!CATS[k]) CATS[k] = keep[k]; });
})();
