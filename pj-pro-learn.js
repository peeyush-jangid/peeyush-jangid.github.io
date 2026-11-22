/* ===== PJ Pro – MS Word & PowerPoint learning tools + Interview Practice v2 ===== */
(function () {
  const D = window.PJD, PJ = window.PJ, LS = PJ.LS, shuffle = PJ.shuffle;

  /* ---------- reusable learning tool: Commands · Lessons · Interview · Test · Sheet ---------- */
  function learnTool(id, ico, name, desc, DATA, appName) {
    const LV = D.LV, bank = DATA.mcq.map(m => ({ l: m[0], m: m.slice(1) }));
    TOOLS.push({
      cat: 'office', id, ico, name, desc, render: el => {
        const tabs = [['cmd', '⌨️ Commands'], ['les', '🧭 Lessons'], ['qa', '🎤 Interview Q&A'], ['test', '📝 Practice Test'], ['sheet', '📋 Practice Sheet']];
        el.innerHTML = `<div class="card"><div class="tabs" id="lt">${tabs.map((t, i) => `<button class="tab ${i ? '' : 'on'}" data-t="${t[0]}">${t[1]}</button>`).join('')}</div><div id="lb"></div></div>`;
        const lb = $('#lb', el); let lv = 'ALL';
        const lvBar = (cb, withAll = true) => `<div class="pp-lv">${(withAll ? [['ALL', 'All levels']] : []).concat(Object.entries(LV)).map(([k, v]) => `<button data-l="${k}" class="${k === lv ? 'on' : ''}">${v}</button>`).join('')}</div>`;
        const bindLv = (root, cb) => $$('.pp-lv [data-l]', root).forEach(b => b.onclick = () => { lv = b.dataset.l; $$('.pp-lv [data-l]', root).forEach(x => x.classList.toggle('on', x === b)); cb(); });
        const views = {
          cmd() {
            lb.innerHTML = `<p class="note" style="margin-top:0">${DATA.cmds.length} commands &amp; shortcuts for ${appName} (Windows; on Mac use ⌘ instead of Ctrl and ⌥ instead of Alt). Tap a level and search.</p>${lvBar()}<input id="cs" type="search" placeholder="Search a command, e.g. page break, table, animation…"><div style="overflow-x:auto;margin-top:10px"><table class="pp-tbl"><thead><tr><th>Level</th><th>Command / Shortcut</th><th>What it does</th></tr></thead><tbody id="ct"></tbody></table></div><p class="note" id="cn"></p>`;
            const draw = () => {
              const q = $('#cs', lb).value.trim().toLowerCase(), rows = DATA.cmds.filter(r => (lv === 'ALL' || r[0] === lv) && (!q || (r[1] + ' ' + r[2]).toLowerCase().includes(q)));
              $('#ct', lb).innerHTML = rows.map(r => `<tr><td><span class="pp-lvb ${r[0]}">${LV[r[0]]}</span></td><td><kbd>${esc(r[1])}</kbd></td><td>${esc(r[2])}</td></tr>`).join('') || '<tr><td colspan="3">No command found.</td></tr>';
              $('#cn', lb).textContent = rows.length + ' shown';
            };
            bindLv(lb, draw); $('#cs', lb).oninput = draw; draw();
          },
          les() {
            lb.innerHTML = `<p class="note" style="margin-top:0">Step-by-step lessons – start from Beginner and move up to Pro.</p>${lvBar(0, false)}<div id="ll"></div>`;
            if (lv === 'ALL') lv = 'B';
            $$('.pp-lv [data-l]', lb).forEach(b => b.classList.toggle('on', b.dataset.l === lv));
            const draw = () => { $('#ll', lb).innerHTML = DATA.lessons[lv].map((l, i) => `<details ${i === 0 ? 'open' : ''}><summary><b>${i + 1}. ${esc(l[0])}</b></summary><ol>${l[1].map(s => `<li>${esc(s)}</li>`).join('')}</ol></details>`).join(''); };
            bindLv(lb, draw); draw();
          },
          qa() {
            lb.innerHTML = `<p class="note" style="margin-top:0">Common interview questions on ${appName} with short answers.</p>${DATA.qa.map(x => `<details><summary><b>${esc(x[0])}</b></summary><p>${esc(x[1])}</p></details>`).join('')}`;
          },
          test() {
            lb.innerHTML = `<p class="note" style="margin-top:0">Pick a level, then start. Questions are shuffled every time.</p>${lvBar()}<div id="th"></div>`;
            const draw = () => { const b = bank.filter(x => lv === 'ALL' || x.l === lv).map(x => x.m); PJ.renderTest($('#th', lb), id, name + (lv === 'ALL' ? '' : ' (' + LV[lv] + ')'), b); };
            bindLv(lb, draw); draw();
          },
          sheet() {
            lb.innerHTML = `<h3 style="margin-top:0">Hands-on tasks – do these in ${appName}</h3>${lvBar(0, false)}<div id="tk"></div><div class="row pp-noprint"><button class="btn ghost sm" id="tp">🖨️ Print task sheet</button><button class="btn ghost sm" id="tr">↺ Reset ticks</button></div><hr style="border:0;border-top:1px solid var(--bd);margin:18px 0"><div id="wk"></div>`;
            if (lv === 'ALL') lv = 'B'; $$('.pp-lv [data-l]', lb).forEach(b => b.classList.toggle('on', b.dataset.l === lv));
            const key = 'tasks:' + id, draw = () => {
              const st = LS.get(key, {}), arr = st[lv] || [], T = DATA.sheet[lv], dn = T.filter((_, i) => arr[i]).length;
              $('#tk', lb).innerHTML = `<div class="pp-bar"><i style="width:${Math.round(dn / T.length * 100)}%"></i></div><p class="note">${dn} / ${T.length} done</p>` + T.map((t, i) => `<label class="pp-task ${arr[i] ? 'done' : ''}"><input type="checkbox" data-i="${i}" ${arr[i] ? 'checked' : ''}><span>${i + 1}. ${esc(t)}</span></label>`).join('');
              $$('#tk input', lb).forEach(c => c.onchange = () => { const s = LS.get(key, {}); s[lv] = s[lv] || []; s[lv][+c.dataset.i] = c.checked; LS.set(key, s); draw(); });
            };
            bindLv(lb, draw); draw();
            $('#tr', lb).onclick = () => { const s = LS.get(key, {}); s[lv] = []; LS.set(key, s); draw(); };
            $('#tp', lb).onclick = () => PJ.printHTML(name + ' – ' + LV[lv] + ' Task Sheet', `<div class="meta"><h1>${esc(name)} – ${LV[lv]} Practice Tasks</h1><span>Name: ____________ &nbsp; Date: ________</span></div><ol>${DATA.sheet[lv].map(t => `<li>☐ ${esc(t)}</li>`).join('')}</ol>`);
            PJ.renderSheet($('#wk', lb), id, name + ' – Written', bank.map(x => x.m));
          }
        };
        const show = t => { $$('#lt .tab', el).forEach(b => b.classList.toggle('on', b.dataset.t === t)); lv = (t === 'les' || t === 'sheet') ? (lv === 'ALL' ? 'B' : lv) : lv; views[t](); };
        $$('#lt .tab', el).forEach(b => b.onclick = () => show(b.dataset.t));
        let first = 'cmd'; try { const f = sessionStorage.getItem('pjp_open'); if (f && f === 'test:' + id) { sessionStorage.removeItem('pjp_open'); first = 'test'; } } catch (e) { }
        show(first);
      }
    });
    D.MCQ[id] = DATA.mcq.map(m => m.slice(1));
  }
  learnTool('ms-word', '📘', 'MS Word – Beginner to Pro', 'All Word commands & shortcuts, lessons, interview questions, practice test and sheet', D.word, 'Microsoft Word');
  learnTool('ms-powerpoint', '📙', 'MS PowerPoint – Beginner to Pro', 'All PowerPoint commands & shortcuts, lessons, interview questions, practice test and sheet', D.ppt, 'Microsoft PowerPoint');

  /* ---------- Interview Practice v2 ---------- */
  const T = TOOLS.find(t => t.id === 'interview-practice'); if (!T) return;
  T.desc = 'Choose field, Fresher or Experienced, set your own timer, practise & get a report';
  const beep = () => { try { const c = new (window.AudioContext || window.webkitAudioContext)(), o = c.createOscillator(), g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = .15; o.start(); setTimeout(() => { o.stop(); c.close(); }, 350); } catch (e) { } };
  const mmss = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  T.render = el => {
    const fields = D.IB_FIELDS, hist = LS.get('ivhist', []);
    el.innerHTML = `<div class="card" id="setup"><h3 style="margin-top:0">🎯 Set up your practice</h3><div class="pp-sel">
      <label>Field<select id="f">${fields.map(f => `<option>${esc(f)}</option>`).join('')}<option value="ALL">🔀 Mix of all fields</option></select></label>
      <label>Experience level<select id="lvl"><option value="F">🎓 Fresher (0–1 year)</option><option value="E">💼 Experienced (1+ years)</option><option value="B">Both</option></select></label>
      <label>Order<select id="ord"><option value="r">Random</option><option value="s">In order</option></select></label>
      <label>Questions<select id="cnt"><option>5</option><option selected>10</option><option>15</option><option value="0">All</option></select></label>
      <label>Time per question<select id="dur"><option value="30">30 seconds</option><option value="60">1 minute</option><option value="120" selected>2 minutes</option><option value="180">3 minutes</option><option value="300">5 minutes</option><option value="c">Custom…</option><option value="0">No timer</option></select></label>
      <label id="cw" hidden>Custom (min : sec)<span style="display:flex;gap:6px"><input id="cm" type="number" min="0" max="30" value="1"><input id="cs" type="number" min="0" max="59" value="30"></span></label></div>
      <div class="row"><label class="pp-opt"><input type="checkbox" id="auto" checked><span>Auto-start timer</span></label><label class="pp-opt"><input type="checkbox" id="next"><span>Auto-next when time ends</span></label><label class="pp-opt"><input type="checkbox" id="spk"><span>Read question aloud</span></label></div>
      <div class="row"><button class="btn" id="go">Start interview practice →</button></div></div>
      <div id="run"></div>
      <div class="card"><h3>Answer framework</h3>${ul(['<b>Fresher:</b> use <b>Present → Past → Future</b> for "Tell me about yourself"; use projects, internships, training and college work as proof.', '<b>Experienced:</b> use <b>STAR</b> – <b>S</b>ituation, <b>T</b>ask, <b>A</b>ction, <b>R</b>esult – with numbers (₹, %, time saved).', 'Keep each answer 60–120 seconds. Be honest, positive and specific.'])}</div>
      ${hist.length ? `<div class="card"><h3>Recent sessions</h3>${ul(hist.slice(0, 5).map(h => `${esc(h.date)} – ${esc(h.field)} (${h.lvl}) · ${h.n} questions · avg self-rating ${h.avg}/5`))}</div>` : ''}`;
    $('#dur', el).onchange = e => $('#cw', el).hidden = e.target.value !== 'c';
    $('#go', el).onclick = () => {
      const f = $('#f', el).value, lvl = $('#lvl', el).value, ord = $('#ord', el).value; let cnt = +$('#cnt', el).value;
      let pool = []; (f === 'ALL' ? fields : [f]).forEach(fl => (lvl === 'B' ? ['F', 'E'] : [lvl]).forEach(l => D.IB[fl][l].forEach(q => pool.push({ q: q[0], h: q[1], fld: fl, l }))));
      if (ord === 'r') pool = shuffle(pool); if (cnt) pool = pool.slice(0, cnt);
      let dur = $('#dur', el).value; dur = dur === 'c' ? Math.max(10, (+$('#cm', el).value || 0) * 60 + (+$('#cs', el).value || 0)) : +dur;
      startSession(pool, { f, lvl, dur, auto: $('#auto', el).checked, next: $('#next', el).checked, spk: $('#spk', el).checked });
    };
    function startSession(pool, o) {
      if (!pool.length) return toast('No questions found');
      let i = 0, left = o.dur, tid = null, spent = 0; const log = pool.map(p => ({ ...p, note: '', rate: 0, t: 0 }));
      $('#setup', el).hidden = true; const run = $('#run', el);
      const stop = () => { clearInterval(tid); tid = null; const b = $('#st', run); if (b) b.textContent = '▶ Start timer'; };
      const tick = () => {
        if (!run.isConnected) return stop(); left--; spent++; log[i].t++; paint();
        if (left <= 0) { stop(); beep(); toast('Time up! ⏰'); if (o.next) setTimeout(() => go(1), 600); }
      };
      const run1 = () => { if (!o.dur) return; if (tid) return stop(); $('#st', run).textContent = '⏸ Pause'; tid = setInterval(tick, 1000); };
      const paint = () => { const t = $('#tm', run); if (!t) return; t.textContent = o.dur ? mmss(Math.max(0, left)) : '∞'; t.classList.toggle('low', o.dur && left <= 15); const b = $('#tb', run); if (b && o.dur) b.style.width = Math.max(0, left / o.dur * 100) + '%'; };
      const speak = txt => { try { speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(txt); u.lang = 'en-IN'; u.rate = .95; speechSynthesis.speak(u); } catch (e) { toast('Voice not supported on this device'); } };
      const save = () => { if (!$('#ans', run)) return; log[i].note = $('#ans', run).value; log[i].rate = +$('#rt', run).value || 0; };
      const show = () => {
        stop(); left = o.dur; const q = log[i];
        run.innerHTML = `<div class="card"><div class="pp-head"><span class="note">Question ${i + 1} of ${log.length} · ${esc(q.fld)} · ${q.l === 'F' ? 'Fresher' : 'Experienced'}</span><span class="pp-timer" id="tm"></span></div>
          <div class="pp-bar"><i id="tb" style="width:100%"></i></div>
          <h3 style="font-size:1.25rem;margin:12px 0">${esc(q.q)}</h3>
          <div class="row" style="margin-top:0"><button class="btn sm" id="st">▶ Start timer</button><button class="btn ghost sm" id="rs">↺ Reset</button><button class="btn ghost sm" id="hn">💡 Show hint / model points</button><button class="btn ghost sm" id="sp">🔊 Read aloud</button></div>
          <div id="hb" class="pp-exp" hidden>${esc(q.h)}</div>
          <label class="fld" style="margin-top:14px"><span>Your answer notes (speak aloud first, then write key points)</span><textarea id="ans" rows="5">${esc(q.note)}</textarea></label><div class="note" id="wc">0 words</div>
          <div class="pp-sel" style="margin-top:10px"><label>Rate your answer<select id="rt"><option value="0">–</option>${[1, 2, 3, 4, 5].map(n => `<option value="${n}" ${q.rate === n ? 'selected' : ''}>${'★'.repeat(n)} ${['Poor', 'Fair', 'Good', 'Very good', 'Excellent'][n - 1]}</option>`).join('')}</select></label></div>
          <div class="row"><button class="btn ghost" id="pv" ${i === 0 ? 'disabled' : ''}>← Previous</button><button class="btn" id="nx">${i === log.length - 1 ? 'Finish ✓' : 'Next question →'}</button><button class="btn ghost" id="en">End session</button></div></div>`;
        paint(); const wc = () => $('#wc', run).textContent = ($('#ans', run).value.match(/\S+/g) || []).length + ' words'; $('#ans', run).oninput = wc; wc();
        $('#st', run).onclick = run1; $('#rs', run).onclick = () => { stop(); left = o.dur; paint(); };
        $('#hn', run).onclick = () => $('#hb', run).hidden = !$('#hb', run).hidden; $('#sp', run).onclick = () => speak(q.q);
        $('#pv', run).onclick = () => go(-1); $('#nx', run).onclick = () => go(1); $('#en', run).onclick = finish;
        if (o.spk) speak(q.q); if (o.auto && o.dur) run1();
      };
      const go = d => { save(); if (i + d >= log.length) return finish(); i = Math.max(0, i + d); show(); };
      const finish = () => {
        save(); stop(); try { speechSynthesis.cancel(); } catch (e) { }
        const rated = log.filter(x => x.rate), avg = rated.length ? (rated.reduce((a, b) => a + b.rate, 0) / rated.length).toFixed(1) : '–', ans = log.filter(x => x.note.trim()).length;
        const h = LS.get('ivhist', []); h.unshift({ date: todayStr(), field: o.f === 'ALL' ? 'Mixed' : o.f, lvl: o.lvl === 'F' ? 'Fresher' : o.lvl === 'E' ? 'Experienced' : 'Both', n: log.length, avg }); LS.set('ivhist', h.slice(0, 20));
        const report = `INTERVIEW PRACTICE REPORT – ${todayStr()}\nField: ${o.f === 'ALL' ? 'Mixed' : o.f} | Level: ${o.lvl}\nQuestions: ${log.length} | Answered with notes: ${ans} | Avg self-rating: ${avg}/5 | Time used: ${mmss(spent)}\n\n` + log.map((x, n) => `Q${n + 1}. ${x.q}\nRating: ${x.rate || '-'}/5 | Time: ${mmss(x.t)}\nMy notes: ${x.note || '(none)'}\nModel points: ${x.h}\n`).join('\n');
        run.innerHTML = `<div class="card"><h3 style="margin-top:0">✅ Session complete</h3>${res([['Questions', log.length], ['Answered with notes', ans], ['Average self-rating', avg + ' / 5'], ['Time used', mmss(spent)]])}<div class="row"><button class="btn" id="dl">⬇ Download report</button><button class="btn ghost" id="cp">Copy report</button><button class="btn ghost" id="again">🔄 New session</button></div></div>
          <div class="card"><h3>Review</h3>${log.map((x, n) => `<details><summary><b>Q${n + 1}. ${esc(x.q)}</b> ${x.rate ? '· ' + '★'.repeat(x.rate) : ''}</summary><p><b>Your notes:</b> ${esc(x.note) || '–'}</p><p><b>Model points:</b> ${esc(x.h)}</p></details>`).join('')}</div>`;
        $('#dl', run).onclick = () => download(new Blob([report], { type: 'text/plain' }), 'interview-practice-report.txt'); $('#cp', run).onclick = () => copy(report); $('#again', run).onclick = () => PJ.again();
      };
      PJ.again = () => { run.innerHTML = ''; $('#setup', el).hidden = false; };
      show(); run.scrollIntoView({ behavior: 'smooth' });
    }
  };
})();
