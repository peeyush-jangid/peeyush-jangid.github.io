/* ===== PJ Pro – core: helpers, practice-question generators, Practice Test + Practice Sheet engine,
   "Practice" panel added under the right tools, and the Practice Center tool.
   Load AFTER pj-tools-upgrade.js and the pj-pro-data-*.js files, BEFORE pj-tools-app.js ===== */
(function () {
  const D = window.PJD, PJ = window.PJ = window.PJ || {};
  const LS = {
    get(k, d) { try { const v = localStorage.getItem('pjp_' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('pjp_' + k, JSON.stringify(v)); } catch (e) { } }
  };
  const rnd = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = a => a[rnd(0, a.length - 1)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i);[a[i], a[j]] = [a[j], a[i]]; } return a; };
  const rs = n => '₹' + inr(n, 0);
  Object.assign(PJ, { LS, rnd, pick, shuffle });

  /* ---------- date helpers for generators ---------- */
  const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const dstr = d => d.getDate() + ' ' + MON[d.getMonth()] + ' ' + d.getFullYear();
  const rdate = (y1, y2) => new Date(rnd(y1, y2), rnd(0, 11), rnd(1, 28));

  /* ---------- generators: each returns {t:'num', q, a, d, u, e} or {t:'mcq', q, o, a, e} ---------- */
  const G = {};
  G.emi = () => {
    const P = rnd(2, 40) * 50000, r = pick([7, 7.5, 8, 8.5, 9, 10, 10.5, 11, 12]), y = rnd(1, 7), n = y * 12, i = r / 1200, k = Math.pow(1 + i, n);
    const emi = P * i * k / (k - 1), v = rnd(0, 2);
    const base = `Loan of ${rs(P)} at ${r}% p.a. (reducing balance) for ${y} year${y > 1 ? 's' : ''}. `;
    const ex = `EMI = P×i×(1+i)ⁿ ÷ ((1+i)ⁿ−1) with i = ${r}/12/100 = ${i.toFixed(5)} and n = ${n} months → EMI ≈ ${rs(emi)}.`;
    if (v === 0) return { t: 'num', q: base + 'Find the monthly EMI.', a: emi, d: 0, u: '₹', e: ex };
    if (v === 1) return { t: 'num', q: base + 'Find the TOTAL INTEREST paid over the full loan.', a: emi * n - P, d: 0, u: '₹', e: ex + ` Total interest = EMI×n − P = ${rs(emi * n)} − ${rs(P)}.` };
    return { t: 'num', q: base + 'Find the TOTAL amount paid to the bank.', a: emi * n, d: 0, u: '₹', e: ex + ` Total = EMI × ${n}.` };
  };
  G.loan = () => {
    const P = rnd(1, 20) * 10000, r = pick([6, 8, 9, 10, 12]), t = rnd(1, 5), si = P * r * t / 100, v = rnd(0, 2);
    if (v === 0) return { t: 'num', q: `Simple interest on ${rs(P)} at ${r}% per year for ${t} year(s)?`, a: si, d: 0, u: '₹', e: `SI = P×R×T/100 = ${P}×${r}×${t}/100 = ${rs(si)}.` };
    if (v === 1) return { t: 'num', q: `Flat-rate loan: ${rs(P)} at ${r}% flat for ${t} year(s). Total amount to repay?`, a: P + si, d: 0, u: '₹', e: `Interest = P×R×T/100 = ${rs(si)}; Total = P + interest = ${rs(P + si)}.` };
    return { t: 'num', q: `Flat-rate loan: ${rs(P)} at ${r}% flat for ${t} year(s). Monthly instalment?`, a: (P + si) / (12 * t), d: 0, u: '₹', e: `(P + interest) ÷ months = ${rs(P + si)} ÷ ${12 * t} = ${rs((P + si) / (12 * t))}.` };
  };
  G.gst = () => {
    const amt = rnd(5, 500) * 100, rt = pick([5, 12, 18, 28]), v = rnd(0, 3);
    if (v === 0) return { t: 'num', q: `Price before GST is ${rs(amt)}. GST rate ${rt}%. How much is the GST amount?`, a: amt * rt / 100, d: 2, u: '₹', e: `GST = ${amt} × ${rt}/100.` };
    if (v === 1) return { t: 'num', q: `Price before GST is ${rs(amt)}. GST rate ${rt}%. What is the total bill?`, a: amt * (1 + rt / 100), d: 2, u: '₹', e: `Total = ${amt} × (1 + ${rt}/100).` };
    if (v === 2) { const tot = Math.round(amt * (1 + rt / 100)); return { t: 'num', q: `The bill amount including ${rt}% GST is ${rs(tot)}. Find the price BEFORE GST.`, a: tot * 100 / (100 + rt), d: 2, u: '₹', e: `Base = Total × 100 ÷ (100 + ${rt}).` }; }
    return { t: 'num', q: `Intra-state sale of ${rs(amt)} at ${rt}% GST. How much is the CGST alone?`, a: amt * rt / 200, d: 2, u: '₹', e: `GST is split equally: CGST = SGST = ${amt}×${rt}/100 ÷ 2.` };
  };
  G.percentage = () => {
    const v = rnd(0, 3);
    if (v === 0) { const x = pick([5, 8, 12, 15, 18, 20, 25, 35, 45]), y = rnd(2, 50) * 100; return { t: 'num', q: `What is ${x}% of ${inr(y, 0)}?`, a: x * y / 100, d: 2, e: `${x}/100 × ${y}.` }; }
    if (v === 1) { const a = rnd(10, 90) * 10, b = a + pick([-1, 1]) * rnd(1, 40) * 5; return { t: 'num', q: `A value changes from ${a} to ${b}. Percentage change (use a minus sign for a decrease)?`, a: (b - a) / a * 100, d: 2, u: '%', e: `(New − Old) ÷ Old × 100 = (${b} − ${a}) ÷ ${a} × 100.` }; }
    if (v === 2) { const b = rnd(5, 40) * 10, a = rnd(1, 9) * b / 10 + 0; return { t: 'num', q: `What percent of ${b} is ${a}?`, a: a / b * 100, d: 2, u: '%', e: `${a} ÷ ${b} × 100.` }; }
    const t = pick([50, 100, 200, 500]), m = rnd(Math.floor(t * .3), t); return { t: 'num', q: `A student scored ${m} out of ${t}. What is the percentage?`, a: m / t * 100, d: 2, u: '%', e: `${m} ÷ ${t} × 100.` };
  };
  G.datediff = () => {
    const a = rdate(2024, 2026), b = new Date(a.getTime() + rnd(20, 400) * 864e5);
    return { t: 'num', q: `How many days are there from ${dstr(a)} to ${dstr(b)}?`, a: Math.round((b - a) / 864e5), d: 0, u: 'days', e: 'Subtract the two dates (end − start). The start date itself is not counted.' };
  };
  G.age = () => {
    const dob = rdate(1985, 2008), on = rdate(2025, 2026);
    let y = on.getFullYear() - dob.getFullYear(); if (on.getMonth() < dob.getMonth() || (on.getMonth() === dob.getMonth() && on.getDate() < dob.getDate())) y--;
    return { t: 'num', q: `Born on ${dstr(dob)}. How many completed years old is the person on ${dstr(on)}?`, a: y, d: 0, u: 'years', e: 'Subtract the birth year, then subtract 1 if the birthday has not come yet in that year.' };
  };
  G['tr-to-kw'] = () => {
    const v = rnd(0, 3);
    if (v === 0) { const t = pick([1.5, 2, 3, 5, 10, 15, 20, 50, 100]); return { t: 'num', q: `Convert ${t} TR to kW.`, a: t * 3.517, d: 2, u: 'kW', e: '1 TR = 3.517 kW.' }; }
    if (v === 1) { const k = pick([7, 10.5, 17.5, 35, 70, 105]); return { t: 'num', q: `Convert ${k} kW cooling to TR.`, a: k / 3.517, d: 2, u: 'TR', e: 'TR = kW ÷ 3.517.' }; }
    if (v === 2) { const t = pick([1, 1.5, 2, 3, 5, 10]); return { t: 'num', q: `How many BTU/h is ${t} TR?`, a: t * 12000, d: 0, u: 'BTU/h', e: '1 TR = 12,000 BTU/h.' }; }
    const b = pick([18000, 24000, 36000, 48000, 60000]); return { t: 'num', q: `An AC is rated ${inr(b, 0)} BTU/h. What is its capacity in TR?`, a: b / 12000, d: 2, u: 'TR', e: 'TR = BTU/h ÷ 12,000.' };
  };
  G.cfm = () => {
    if (rnd(0, 1)) { const a = pick([1, 1.5, 2, 2.5, 3, 4]), v = pick([600, 800, 1000, 1200, 1500]); return { t: 'num', q: `Duct area ${a} sq ft, air velocity ${v} FPM. Airflow in CFM?`, a: a * v, d: 0, u: 'CFM', e: 'CFM = Area (sq ft) × Velocity (FPM).' }; }
    const l = pick([12, 15, 20, 25, 30]), w = pick([10, 12, 15, 20]), h = pick([9, 10, 12]), ach = pick([6, 8, 10, 12]);
    return { t: 'num', q: `Room ${l} ft × ${w} ft × ${h} ft needs ${ach} air changes per hour (ACH). Required CFM?`, a: l * w * h * ach / 60, d: 0, u: 'CFM', e: `Volume = ${l * w * h} cu ft; CFM = Volume × ACH ÷ 60.` };
  };
  G['duct-size'] = () => {
    const c = pick([500, 800, 1000, 1500, 2000, 3000, 4000]), v = pick([600, 800, 1000, 1200]), A = c / v, k = rnd(0, 2);
    if (k === 0) return { t: 'num', q: `Airflow ${c} CFM at ${v} FPM. Required duct area?`, a: A, d: 2, u: 'sq ft', e: 'Area = CFM ÷ Velocity.' };
    if (k === 1) return { t: 'num', q: `Airflow ${c} CFM at ${v} FPM. Diameter of the ROUND duct (inches)?`, a: Math.sqrt(4 * A / Math.PI) * 12, d: 1, u: 'inch', e: 'A = CFM ÷ V; D = √(4A/π) × 12 (inches).' };
    const w = pick([12, 16, 20, 24]); return { t: 'num', q: `Airflow ${c} CFM at ${v} FPM. A rectangular duct is ${w} inch wide. How many inches high?`, a: A * 144 / w, d: 1, u: 'inch', e: 'Height = Area (sq in) ÷ width = (CFM ÷ V × 144) ÷ width.' };
  };
  G['air-velocity'] = () => {
    const c = pick([500, 800, 1000, 1500, 2000]);
    if (rnd(0, 1)) { const w = pick([12, 16, 20, 24]), h = pick([8, 10, 12, 16]); return { t: 'num', q: `${c} CFM flows in a ${w}″ × ${h}″ rectangular duct. Velocity in FPM?`, a: c / (w * h / 144), d: 0, u: 'FPM', e: 'Velocity = CFM ÷ Area (sq ft); Area = w×h/144.' }; }
    const dm = pick([10, 12, 14, 16, 18]); return { t: 'num', q: `${c} CFM flows in a ${dm}″ round duct. Velocity in FPM?`, a: c / (Math.PI * dm * dm / 4 / 144), d: 0, u: 'FPM', e: 'Area = π d²/4 ÷ 144 (sq ft); Velocity = CFM ÷ Area.' };
  };
  G.btu = () => {
    if (rnd(0, 1)) { const a = rnd(10, 60) * 10; return { t: 'num', q: `Rule of thumb: 20 BTU/h per sq ft. A ${a} sq ft room needs how many BTU/h?`, a: a * 20, d: 0, u: 'BTU/h', e: 'BTU/h = Area × 20.' }; }
    const a = rnd(10, 60) * 10; return { t: 'num', q: `A ${a} sq ft room is cooled at 20 BTU/h per sq ft. What AC tonnage (TR) is required (exact value)?`, a: a * 20 / 12000, d: 2, u: 'TR', e: `BTU = ${a * 20}; TR = BTU ÷ 12,000.` };
  };
  G.attendance = () => {
    const days = pick([28, 30, 31]), off = 4, hol = rnd(0, 2), work = days - off - hol, pr = rnd(work - 8, work - 2), pl = rnd(0, 1), half = rnd(0, 2), sal = rnd(15, 60) * 1000, att = pr + pl + half * .5, absent = work - att;
    const base = `Month has ${days} days, ${off} weekly offs, ${hol} holiday(s). Employee was present ${pr} days, took ${pl} paid leave, ${half} half-day(s). Salary ${rs(sal)}. `;
    if (rnd(0, 1)) return { t: 'num', q: base + 'Attendance % (against working days)?', a: att / work * 100, d: 2, u: '%', e: `Working days = ${work}; attended = ${att}; % = ${att}/${work}×100.` };
    return { t: 'num', q: base + 'Salary deduction (per-day = salary ÷ days in month)?', a: sal / days * absent, d: 0, u: '₹', e: `Absent days = ${work} − ${att} = ${absent}; deduction = ${rs(sal)}/${days} × ${absent}.` };
  };
  G['number-to-words'] = () => {
    const n = rnd(1000, 99999999), c = n2w(n), ds = new Set([c]);
    [n + 1000, n * 10 > 999999999 ? n + 100000 : n * 10, Math.max(1, n - 100), n + 10, n + 100000].forEach(x => { if (ds.size < 4) ds.add(n2w(x)); });
    const o = shuffle([...ds]); return { t: 'mcq', q: `Write ${inr(n, 0)} in words (Indian system).`, o, a: o.indexOf(c), e: `${inr(n, 0)} = ${c}.` };
  };
  G.salary = () => {
    const v = rnd(0, 2);
    if (v === 0) { const c = rnd(3, 24) * 100000; return { t: 'num', q: `Annual CTC is ${rs(c)}. Monthly CTC?`, a: c / 12, d: 0, u: '₹', e: 'Monthly = Annual ÷ 12.' }; }
    if (v === 1) { const b = rnd(15, 80) * 1000; return { t: 'num', q: `Basic pay ${rs(b)}. Employee PF at 12% of basic?`, a: b * .12, d: 0, u: '₹', e: 'PF = 12% × Basic.' }; }
    const m = rnd(20, 90) * 1000; return { t: 'num', q: `Monthly salary ${rs(m)}. Annual salary?`, a: m * 12, d: 0, u: '₹', e: 'Annual = Monthly × 12.' };
  };
  G['salary-slip'] = () => {
    const b = rnd(15, 50) * 1000, hra = Math.round(b * .4), sp = rnd(2, 10) * 1000, pf = Math.round(b * .12), tax = rnd(0, 5) * 500, g = b + hra + sp;
    return { t: 'num', q: `Basic ${rs(b)}, HRA ${rs(hra)}, Special allowance ${rs(sp)}. Deductions: PF ${rs(pf)}, Tax ${rs(tax)}. What is the NET pay?`, a: g - pf - tax, d: 0, u: '₹', e: `Gross = ${rs(g)}; Net = Gross − deductions = ${rs(g)} − ${rs(pf + tax)}.` };
  };
  G.invoice = () => {
    const q = rnd(2, 20), r = rnd(5, 100) * 10, g = pick([5, 12, 18]), tx = q * r;
    if (rnd(0, 1)) return { t: 'num', q: `Invoice: ${q} items × ${rs(r)} each, GST ${g}%. Grand total?`, a: tx * (1 + g / 100), d: 2, u: '₹', e: `Taxable = ${rs(tx)}; GST = ${g}% ; Total = Taxable × (1 + ${g}/100).` };
    return { t: 'num', q: `Invoice: ${q} items × ${rs(r)} each, inter-state sale at ${g}% IGST. IGST amount?`, a: tx * g / 100, d: 2, u: '₹', e: `Taxable = ${rs(tx)}; IGST = ${rs(tx)} × ${g}%.` };
  };
  const GEN = { emi: ['emi'], loan: ['loan'], gst: ['gst'], percentage: ['percentage'], age: ['age', 'datediff'], datediff: ['datediff'], 'tr-to-kw': ['tr-to-kw'], cfm: ['cfm'], 'duct-size': ['duct-size'], 'air-velocity': ['air-velocity'], btu: ['btu'], attendance: ['attendance'], 'number-to-words': ['number-to-words'], salary: ['salary'], 'salary-slip': ['salary-slip'], invoice: ['invoice', 'gst'] };

  /* ---------- question set builder ---------- */
  function mcqToQ(m) {
    const correct = m[1][m[2]], o = shuffle(m[1]);
    return { t: 'mcq', q: m[0], o, a: o.indexOf(correct), e: m[3] || '' };
  }
  function bankFor(id) { const k = D.MCQ_MAP[id]; return (k && D.MCQ[k]) || D.MCQ[id] || []; }
  function hasPractice(id) { return !!(GEN[id] || bankFor(id).length); }
  function buildSet(id, n, bank) {
    const gens = GEN[id] || [], b = bank || bankFor(id), out = [];
    const ng = gens.length ? (b.length ? Math.ceil(n * .6) : n) : 0;
    for (let i = 0; i < ng; i++) out.push(G[pick(gens)]());
    const nb = n - out.length; if (nb > 0) shuffle(b).slice(0, nb).forEach(m => out.push(mcqToQ(m)));
    return shuffle(out);
  }
  Object.assign(PJ, { G, GEN, buildSet, mcqToQ, hasPractice, bankFor });

  /* ---------- Quiz UI ---------- */
  const mmss = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  const gradeMsg = p => p >= 90 ? '🏆 Excellent! You are ready.' : p >= 70 ? '👍 Good work – revise the mistakes.' : p >= 50 ? '🙂 Fair – practise a little more.' : '📘 Keep practising – review the explanations below.';
  function saveScore(key, title, pct) {
    const s = LS.get('scores', {}), o = s[key] || { best: 0, attempts: 0, title };
    o.best = Math.max(o.best, pct); o.last = pct; o.attempts++; o.title = title; o.date = Date.now(); s[key] = o; LS.set('scores', s);
  }
  function renderQuiz(host, qs, o) {
    o = o || {}; let left = o.minutes ? o.minutes * 60 : 0, tid = null, t0 = Date.now(), done = false;
    const html = qs.map((q, i) => `<div class="pp-q" data-i="${i}"><b class="qt">Q${i + 1}. ${esc(q.q)}</b>${q.t === 'mcq'
      ? q.o.map((x, j) => `<label class="pp-opt"><input type="radio" name="pq${i}" value="${j}"><span>${esc(x)}</span></label>`).join('')
      : `<div class="pp-num"><input type="number" step="any" inputmode="decimal" placeholder="Your answer"> <span>${esc(q.u || '')}</span></div><small class="note">Round sensibly – 1% tolerance is allowed.</small>`}<div class="pp-res"></div></div>`).join('');
    host.innerHTML = `<div class="card pp-noprint"><div class="pp-head"><h3>${esc(o.title || 'Practice test')} · ${qs.length} questions</h3>${o.minutes ? '<span class="pp-timer" id="ppt">' + mmss(left) + '</span>' : ''}</div>${html}<div class="row"><button class="btn" id="ppsub">Submit test</button></div></div><div id="ppout"></div>`;
    const stop = () => { clearInterval(tid); tid = null; };
    const submit = () => {
      if (done) return; done = true; stop(); let ok = 0;
      qs.forEach((q, i) => {
        const box = $(`.pp-q[data-i="${i}"]`, host); let right = false, shown = '';
        if (q.t === 'mcq') { const c = box.querySelector('input:checked'); right = c && +c.value === q.a; shown = q.o[q.a]; box.querySelectorAll('input').forEach(x => x.disabled = true); }
        else { const v = parseFloat(box.querySelector('input').value); right = isFinite(v) && Math.abs(v - q.a) <= Math.max(Math.abs(q.a) * .01, .51); shown = inr(q.a, q.d ?? 2) + (q.u ? ' ' + q.u : ''); box.querySelector('input').disabled = true; }
        if (right) ok++; box.classList.add(right ? 'ok' : 'no');
        $('.pp-res', box).innerHTML = `<div class="pp-exp"><b>${right ? '✅ Correct' : '❌ Wrong'}</b>${right ? '' : ' – correct answer: <b>' + esc(shown) + '</b>'}${q.e ? '<br>' + esc(q.e) : ''}</div>`;
      });
      const pct = Math.round(ok / qs.length * 100), took = Math.round((Date.now() - t0) / 1000);
      if (o.key) saveScore(o.key, o.title, pct);
      $('#ppsub', host).hidden = true;
      $('#ppout', host).innerHTML = `<div class="card"><div class="pp-score">${ok} / ${qs.length} <small style="font-size:1rem;color:var(--mut)">(${pct}%)</small></div><div class="pp-bar"><i style="width:${pct}%"></i></div><p>${gradeMsg(pct)} · Time: ${mmss(took)}</p><div class="row"><button class="btn" id="ppagain">🔄 New test</button><button class="btn ghost" id="ppsame">Retry same questions</button></div></div>`;
      $('#ppagain', host).onclick = () => o.again && o.again(); $('#ppsame', host).onclick = () => renderQuiz(host, qs, o);
      $('#ppout', host).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    };
    $('#ppsub', host).onclick = submit;
    if (left) tid = setInterval(() => { if (!host.isConnected) return stop(); left--; const t = $('#ppt', host); if (t) { t.textContent = mmss(Math.max(0, left)); t.classList.toggle('low', left <= 30); } if (left <= 0) { toast('Time up! ⏰'); submit(); } }, 1000);
  }
  PJ.renderQuiz = renderQuiz;

  /* ---------- Practice Test (setup + quiz) ---------- */
  function renderTest(host, id, title, bank) {
    const key = 'test:' + id;
    host.innerHTML = `<div class="card pp-noprint"><div class="pp-head"><h3>📝 Practice Test – ${esc(title)}</h3></div>
      <p class="note">Fresh questions every time. Choose how many questions and a timer if you want exam practice.</p>
      <div class="pp-sel"><label>Questions<select id="ppn"><option>5</option><option selected>10</option><option>15</option><option>20</option></select></label>
      <label>Timer<select id="ppm"><option value="0">No timer</option><option value="5">5 minutes</option><option value="10">10 minutes</option><option value="15">15 minutes</option><option value="c">Custom…</option></select></label>
      <label id="ppcw" hidden>Custom minutes<input id="ppc" type="number" min="1" max="180" value="7"></label>
      <button class="btn" id="ppgo">Start test →</button></div>${(() => { const s = LS.get('scores', {})[key]; return s ? `<p class="note">Best: <b>${s.best}%</b> · Last: ${s.last}% · Attempts: ${s.attempts}</p>` : ''; })()}</div><div id="ppq"></div>`;
    const sel = $('#ppm', host); sel.onchange = () => $('#ppcw', host).hidden = sel.value !== 'c';
    const start = () => {
      const n = +$('#ppn', host).value, mins = sel.value === 'c' ? Math.max(1, +$('#ppc', host).value || 5) : +sel.value;
      const qs = buildSet(id, n, bank); if (!qs.length) return toast('No questions available yet');
      renderQuiz($('#ppq', host), qs, { minutes: mins, key, title: 'Practice test – ' + title, again: start });
      $('#ppq', host).scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    $('#ppgo', host).onclick = start;
  }
  PJ.renderTest = renderTest;

  /* ---------- Practice Sheet ---------- */
  function printHTML(title, body) {
    const w = window.open('', '_blank'); if (!w) return toast('Pop-up blocked – please allow pop-ups to print');
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(title)}</title><style>body{font-family:Arial,Helvetica,sans-serif;margin:28px;color:#111;line-height:1.5}h1{font-size:20px;margin:0}h2{font-size:15px;margin:22px 0 6px}.meta{display:flex;justify-content:space-between;border-bottom:2px solid #111;padding-bottom:6px;margin-bottom:14px;font-size:13px}li{margin:0 0 14px;font-size:14px}.ln{display:inline-block;border-bottom:1px solid #555;min-width:160px;margin-left:6px}.o{margin:2px 0 0 18px;font-size:13px}.k{color:#065f46}.pb{page-break-before:always}</style></head><body>${body}</body></html>`);
    w.document.close(); setTimeout(() => { try { w.focus(); w.print(); } catch (e) { } }, 450);
  }
  PJ.printHTML = printHTML;
  function sheetItems(qs, key) {
    return qs.map((q, i) => {
      const L = 'ABCD';
      if (q.t === 'mcq') return `<li>${esc(q.q)}<div class="o">${q.o.map((x, j) => `${L[j]}) ${esc(x)}`).join('<br>')}</div><span class="pp-answer k">Answer: ${L[q.a]}) ${esc(q.o[q.a])}${q.e ? ' – ' + esc(q.e) : ''}</span></li>`;
      return `<li>${esc(q.q)} <span class="pp-ans ln"></span> ${esc(q.u || '')}<span class="pp-answer k">Answer: ${inr(q.a, q.d ?? 2)} ${esc(q.u || '')} – ${esc(q.e || '')}</span></li>`;
    }).join('');
  }
  function renderSheet(host, id, title, bank) {
    host.innerHTML = `<div class="card pp-noprint"><div class="pp-head"><h3>📋 Practice Sheet – ${esc(title)}</h3></div><p class="note">A printable worksheet. Solve it on paper first, then press "Show answers" to check.</p>
      <div class="pp-sel"><label>Number of questions<select id="psn"><option>10</option><option selected>15</option><option>20</option><option>25</option></select></label><button class="btn" id="psgo">Make sheet →</button></div></div><div id="psout"></div>`;
    const make = () => {
      const n = +$('#psn', host).value, qs = buildSet(id, n, bank); if (!qs.length) return toast('No questions available yet');
      const items = sheetItems(qs);
      $('#psout', host).innerHTML = `<div class="card pp-sheet pp-key-hide"><div class="pp-head"><h3>${esc(title)} – Worksheet</h3><span class="note">Name: ____________ &nbsp; Date: ${dstr(new Date())}</span></div><ol>${items}</ol>
        <div class="row pp-noprint"><button class="btn sm" id="psk">👁️ Show answers</button><button class="btn ghost sm" id="psn2">🔄 New sheet</button><button class="btn ghost sm" id="psp">🖨️ Print / Save as PDF</button></div></div>`;
      const card = $('.pp-sheet', host);
      $('#psk', host).onclick = e => { card.classList.toggle('pp-key-hide'); e.target.textContent = card.classList.contains('pp-key-hide') ? '👁️ Show answers' : '🙈 Hide answers'; };
      $('#psn2', host).onclick = make;
      $('#psp', host).onclick = () => {
        const q2 = qs.map((q, i) => { const L = 'ABCD'; return q.t === 'mcq' ? `<li>${esc(q.q)}<div class="o">${q.o.map((x, j) => `${L[j]}) ${esc(x)}`).join('<br>')}</div></li>` : `<li>${esc(q.q)} <span class="ln"></span> ${esc(q.u || '')}</li>`; }).join('');
        const k2 = qs.map((q, i) => `<li>${q.t === 'mcq' ? 'ABCD'[q.a] + ') ' + esc(q.o[q.a]) : inr(q.a, q.d ?? 2) + ' ' + esc(q.u || '')}<br><small>${esc(q.e || '')}</small></li>`).join('');
        printHTML(title + ' – Practice Sheet', `<div class="meta"><h1>${esc(title)} – Practice Sheet</h1><span>Name: ____________ &nbsp; Date: ${dstr(new Date())}</span></div><ol>${q2}</ol><div class="pb"><h2>Answer Key</h2><ol>${k2}</ol></div><p style="font-size:11px;color:#666">Peeyush Tools Hub</p>`);
      };
      $('#psout', host).scrollIntoView({ behavior: 'smooth', block: 'start' });
    };
    $('#psgo', host).onclick = make;
  }
  PJ.renderSheet = renderSheet;

  /* ---------- "Practice" panel appended under selected tools ---------- */
  const PRACT = ['emi', 'age', 'gst', 'percentage', 'salary', 'loan', 'datediff', 'tr-to-kw', 'cfm', 'duct-size', 'air-velocity', 'btu', 'autocad', 'excel-formulas', 'number-to-words', 'attendance', 'invoice', 'salary-slip', 'interview-questions', 'banking-interview', 'kyc-bpo', 'resume-builder', 'resume-maker', 'resume-improvement', 'email-templates', 'email-writing'];
  PJ.PRACT = PRACT;
  function practicePanel(id, name) {
    const box = document.createElement('div'); box.className = 'pp-wrap pp-noprint'; box.dataset.pp = id;
    box.innerHTML = `<div class="card"><div class="pp-head"><h3>🏋️ Practice – ${esc(name)}</h3><div class="pp-lv"><button data-m="test">📝 Practice Test</button><button data-m="sheet">📋 Practice Sheet</button></div></div><p class="note" style="margin:0">Test yourself with fresh questions (with timer) or print a worksheet. Your best scores are saved on this device.</p></div><div class="pp-body"></div>`;
    const body = $('.pp-body', box), btns = $$('button', box);
    const open = m => { btns.forEach(b => b.classList.toggle('on', b.dataset.m === m)); (m === 'test' ? renderTest : renderSheet)(body, id, name); };
    btns.forEach(b => b.onclick = () => open(b.dataset.m));
    try { const f = sessionStorage.getItem('pjp_open'); if (f && f.split(':')[1] === id) { sessionStorage.removeItem('pjp_open'); setTimeout(() => { open(f.split(':')[0]); box.scrollIntoView({ behavior: 'smooth' }); }, 150); } } catch (e) { }
    return box;
  }
  PJ.practicePanel = practicePanel;
  PRACT.forEach(id => {
    const t = TOOLS.find(x => x.id === id); if (!t || t._pp) return; t._pp = 1;
    const orig = t.render;
    t.render = el => {
      orig(el);
      const box = practicePanel(id, t.name); el.appendChild(box);
      const obs = new MutationObserver(() => { if (location.hash.replace(/^#\/?/, '') !== id) return obs.disconnect(); if (!box.isConnected) el.appendChild(box); });
      obs.observe(el, { childList: true });
    };
  });

})();
