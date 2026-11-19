/* ===== PJ Tools Hub – core helpers + calculators ===== */
const TOOLS = [];
const CATS = {
  calc:   'Calculators & Utilities',
  career: 'Career & Jobs',
  hvac:   'Engineering & HVAC Tools',
  office: 'Office & Productivity',
  ai:     'AI Assistant'
};
let CLEANUP = null; // called when leaving a tool

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const inr = (n, d = 2) => isFinite(n) ? (+n).toLocaleString('en-IN', { maximumFractionDigits: d }) : '—';
const cur = n => '₹' + inr(n, 2);
const todayStr = () => new Date(Date.now() - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const pd = s => new Date(s + 'T00:00:00');
const bad = m => `<p class="err">${m}</p>`;

function toast(m) {
  const t = $('#toast'); t.textContent = m; t.classList.add('on');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 1800);
}
function copy(text) {
  const ok = () => toast('Copied ✓');
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, () => fb());
  else fb();
  function fb() { const a = document.createElement('textarea'); a.value = text; document.body.appendChild(a); a.select(); try { document.execCommand('copy'); ok(); } catch (e) { toast('Copy failed'); } a.remove(); }
}
function download(blob, name) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function res(rows) {
  return `<div class="res">${rows.map(r => `<div class="rr ${r[2] ? 'big' : ''}"><span>${r[0]}</span><b>${r[1]}</b></div>`).join('')}</div>`;
}

/* ---------- form builder ---------- */
function fld(f, pfx = '') {
  const id = `f_${pfx}${f.id}`;
  let inp;
  if (f.type === 'select')
    inp = `<select id="${id}">${f.options.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return `<option value="${esc(v)}" ${String(v) === String(f.value) ? 'selected' : ''}>${esc(l)}</option>`; }).join('')}</select>`;
  else if (f.type === 'textarea')
    inp = `<textarea id="${id}" rows="${f.rows || 4}" placeholder="${esc(f.ph || '')}">${esc(f.value || '')}</textarea>`;
  else
    inp = `<input id="${id}" type="${f.type || 'text'}" value="${esc(f.value ?? '')}" ${f.type === 'number' || !f.type ? '' : ''} ${f.type === 'number' ? 'step="any"' : ''} ${f.ph ? `placeholder="${esc(f.ph)}"` : ''} ${f.min != null ? `min="${f.min}"` : ''}>`;
  return `<label class="fld ${f.wide ? 'wide' : ''}"><span>${f.label}</span>${inp}${f.hint ? `<small>${f.hint}</small>` : ''}</label>`;
}
function readVals(root, fields, pfx = '') {
  const v = {};
  fields.forEach(f => {
    const e = $(`#f_${pfx}${f.id}`, root);
    v[f.id] = f.type === 'number' ? parseFloat(e.value) : e.value;
  });
  return v;
}
/* sections: [{title, fields, calc(v)->html, note}] */
function M(sections) {
  return el => {
    el.innerHTML = sections.map((s, i) => `
      <div class="card">${s.title ? `<h3>${s.title}</h3>` : ''}
        <div class="form">${s.fields.map(f => fld(f, i + '_')).join('')}</div>
        <div class="out" id="out${i}" style="margin-top:18px"></div>
        ${s.note ? `<p class="note">${s.note}</p>` : ''}
      </div>`).join('');
    sections.forEach((s, i) => {
      const run = () => {
        const v = readVals(el, s.fields, i + '_');
        try { $(`#out${i}`, el).innerHTML = s.calc(v); } catch (e) { $(`#out${i}`, el).innerHTML = bad('Please check the values.'); }
      };
      $$(`input,select,textarea`, el).filter(x => x.id.startsWith(`f_${i}_`)).forEach(x => x.addEventListener('input', run));
      run();
    });
  };
}
const C = o => M([o]);
const add = (cat, id, ico, name, desc, render) => TOOLS.push({ cat, id, ico, name, desc, render });
const pos = (...a) => a.every(x => isFinite(x) && x > 0);

/* ---------- date helpers ---------- */
function ymd(a, b) {
  let y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate();
  if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return { y, m, d };
}
const dayDiff = (a, b) => Math.round((b - a) / 864e5);

/* ======================= CALCULATORS ======================= */

add('calc', 'age', '🎂', 'Age Calculator', 'Exact age in years, months, days & next birthday', C({
  fields: [
    { id: 'dob', label: 'Date of Birth', type: 'date', value: '2000-01-01' },
    { id: 'on', label: 'Age on date', type: 'date', value: todayStr() }
  ],
  calc: v => {
    if (!v.dob || !v.on) return bad('Select both dates.');
    const a = pd(v.dob), b = pd(v.on);
    if (a > b) return bad('Date of birth must be before the "age on" date.');
    const r = ymd(a, b);
    let nb = new Date(b.getFullYear(), a.getMonth(), a.getDate());
    if (nb < b) nb = new Date(b.getFullYear() + 1, a.getMonth(), a.getDate());
    const days = dayDiff(a, b);
    return res([
      ['Your Age', `${r.y} Years, ${r.m} Months, ${r.d} Days`, 1],
      ['Total Months', inr(r.y * 12 + r.m, 0)], ['Total Weeks', inr(Math.floor(days / 7), 0)],
      ['Total Days', inr(days, 0)], ['Total Hours', inr(days * 24, 0)],
      ['Next Birthday', `${nb.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} (${dayDiff(b, nb)} days)`],
      ['Born on', a.toLocaleDateString('en-IN', { weekday: 'long' })]
    ]);
  }
}));

function emiCalc(P, rate, n) {
  const r = rate / 1200;
  const emi = r ? P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1) : P / n;
  return { emi, total: emi * n, interest: emi * n - P, r };
}
function amort(P, emi, r, n) {
  let bal = P, rows = [], yP = 0, yI = 0;
  for (let m = 1; m <= n; m++) {
    const i = bal * r, p = Math.min(emi - i, bal); bal -= p; yP += p; yI += i;
    if (m % 12 === 0 || m === n) { rows.push([Math.ceil(m / 12), yP, yI, Math.max(bal, 0)]); yP = 0; yI = 0; }
  }
  return `<h4>Year-wise Payment Schedule</h4><div class="scroll"><table><tr><th>Year</th><th class="r">Principal Paid</th><th class="r">Interest Paid</th><th class="r">Balance</th></tr>${rows.map(r => `<tr><td>${r[0]}</td><td class="r">${cur(r[1])}</td><td class="r">${cur(r[2])}</td><td class="r">${cur(r[3])}</td></tr>`).join('')}</table></div>`;
}
add('calc', 'emi', '🏦', 'EMI Calculator', 'Monthly EMI, total interest & payment schedule', C({
  fields: [
    { id: 'P', label: 'Loan Amount (₹)', type: 'number', value: 1000000 },
    { id: 'rate', label: 'Interest Rate (% per year)', type: 'number', value: 9 },
    { id: 't', label: 'Tenure', type: 'number', value: 5 },
    { id: 'u', label: 'Tenure in', type: 'select', value: 'years', options: [['years', 'Years'], ['months', 'Months']] }
  ],
  calc: v => {
    const n = Math.round(v.u === 'years' ? v.t * 12 : v.t);
    if (!pos(v.P, n) || !(v.rate >= 0)) return bad('Enter valid amount, rate and tenure.');
    const e = emiCalc(v.P, v.rate, n), pp = v.P / e.total * 100;
    return res([['Monthly EMI', cur(e.emi), 1], ['Principal Amount', cur(v.P)], ['Total Interest', cur(e.interest)], ['Total Payment', cur(e.total)]]) +
      `<div class="bar"><i style="width:${pp}%"></i></div><div class="legend"><span><i style="background:#2563eb"></i>Principal ${pp.toFixed(1)}%</span><span><i style="background:#fbbf24"></i>Interest ${(100 - pp).toFixed(1)}%</span></div>` +
      amort(v.P, e.emi, e.r, n);
  }
}));

add('calc', 'gst', '🧾', 'GST Calculator', 'Add or remove GST – CGST/SGST/IGST split', C({
  fields: [
    { id: 'amt', label: 'Amount (₹)', type: 'number', value: 10000 },
    { id: 'rate', label: 'GST Rate', type: 'select', value: '18', options: [['0.25', '0.25%'], ['3', '3%'], ['5', '5%'], ['12', '12%'], ['18', '18%'], ['28', '28%']] },
    { id: 'mode', label: 'Calculation', type: 'select', value: 'add', options: [['add', 'Add GST (exclusive)'], ['rem', 'Remove GST (inclusive)']] }
  ],
  calc: v => {
    if (!pos(v.amt)) return bad('Enter a valid amount.');
    const r = +v.rate; let base, gst, tot;
    if (v.mode === 'add') { base = v.amt; gst = base * r / 100; tot = base + gst; }
    else { tot = v.amt; base = tot * 100 / (100 + r); gst = tot - base; }
    return res([['Total Amount', cur(tot), 1], ['Net Amount (before GST)', cur(base)], ['GST Amount', cur(gst)], [`CGST (${r / 2}%)`, cur(gst / 2)], [`SGST (${r / 2}%)`, cur(gst / 2)], [`IGST (${r}%)`, cur(gst)]]);
  }
}));

add('calc', 'percentage', '％', 'Percentage Calculator', 'Percent of, percent change, add/subtract %', M([
  { title: 'What is X% of Y?', fields: [{ id: 'x', label: 'X (%)', type: 'number', value: 15 }, { id: 'y', label: 'Y', type: 'number', value: 2000 }],
    calc: v => res([['Result', inr(v.x * v.y / 100, 4), 1]]) },
  { title: 'X is what % of Y?', fields: [{ id: 'x', label: 'X', type: 'number', value: 30 }, { id: 'y', label: 'Y', type: 'number', value: 200 }],
    calc: v => v.y ? res([['Result', inr(v.x / v.y * 100, 4) + ' %', 1]]) : bad('Y cannot be zero.') },
  { title: 'Percentage Increase / Decrease', fields: [{ id: 'x', label: 'Old Value', type: 'number', value: 500 }, { id: 'y', label: 'New Value', type: 'number', value: 650 }],
    calc: v => v.x ? res([[v.y >= v.x ? 'Increase' : 'Decrease', inr(Math.abs((v.y - v.x) / v.x * 100), 4) + ' %', 1], ['Difference', inr(v.y - v.x, 4)]]) : bad('Old value cannot be zero.') },
  { title: 'Add / Subtract a Percentage', fields: [{ id: 'y', label: 'Value', type: 'number', value: 1000 }, { id: 'x', label: 'Percentage (%)', type: 'number', value: 10 }],
    calc: v => res([[`${v.y} + ${v.x}%`, inr(v.y * (1 + v.x / 100), 4)], [`${v.y} − ${v.x}%`, inr(v.y * (1 - v.x / 100), 4)]]) }
]));

function taxNew(inc) { // new regime slabs (approx, FY 2025-26)
  const sl = [[400000, 0], [800000, .05], [1200000, .10], [1600000, .15], [2000000, .20], [2400000, .25], [Infinity, .30]];
  let t = 0, prev = 0;
  for (const [lim, rt] of sl) { if (inc > prev) t += (Math.min(inc, lim) - prev) * rt; prev = lim; }
  if (inc <= 1200000) t = 0; else t = Math.min(t, inc - 1200000);
  return t * 1.04;
}
add('calc', 'salary', '💼', 'Salary Calculator', 'CTC to monthly in-hand salary (approx.)', C({
  fields: [
    { id: 'ctc', label: 'Annual CTC / Gross (₹)', type: 'number', value: 600000 },
    { id: 'basic', label: 'Basic % of CTC', type: 'number', value: 40 },
    { id: 'pf', label: 'Employee PF', type: 'select', value: 'cap', options: [['cap', '12% of basic, capped at ₹1,800'], ['full', '12% of full basic'], ['none', 'No PF']] },
    { id: 'pt', label: 'Professional Tax / month (₹)', type: 'number', value: 200 },
    { id: 'tax', label: 'Deduct income tax (new regime)?', type: 'select', value: 'y', options: [['y', 'Yes'], ['n', 'No']] }
  ],
  calc: v => {
    if (!pos(v.ctc)) return bad('Enter valid CTC.');
    const g = v.ctc / 12, basic = g * v.basic / 100, hra = basic * .5, spl = g - basic - hra;
    const pf = v.pf === 'none' ? 0 : v.pf === 'cap' ? Math.min(basic * .12, 1800) : basic * .12;
    const tax = v.tax === 'y' ? taxNew(Math.max(0, v.ctc - 75000)) / 12 : 0;
    const net = g - pf - (v.pt || 0) - tax;
    return res([['Monthly In-hand (approx.)', cur(net), 1], ['Gross / month', cur(g)], ['Basic', cur(basic)], ['HRA (50% of basic)', cur(hra)], ['Special Allowance', cur(spl)],
      ['PF (employee)', cur(pf)], ['Professional Tax', cur(v.pt || 0)], ['Income Tax / month', cur(tax)], ['Annual In-hand', cur(net * 12)]]);
  },
  note: 'Approximate only. Uses new tax regime slabs with ₹75,000 standard deduction & 87A rebate. Tax rules change – verify with your employer / latest Finance Act.'
}));

add('calc', 'loan', '💰', 'Loan Calculator', 'Compare reducing-balance and flat-rate loans', C({
  fields: [
    { id: 'P', label: 'Loan Amount (₹)', type: 'number', value: 500000 },
    { id: 'rate', label: 'Interest Rate (% p.a.)', type: 'number', value: 12 },
    { id: 'yrs', label: 'Tenure (years)', type: 'number', value: 3 },
    { id: 'type', label: 'Interest type', type: 'select', value: 'red', options: [['red', 'Reducing balance'], ['flat', 'Flat rate']] },
    { id: 'fee', label: 'Processing fee (%)', type: 'number', value: 1 }
  ],
  calc: v => {
    const n = Math.round(v.yrs * 12);
    if (!pos(v.P, n) || !(v.rate >= 0)) return bad('Enter valid values.');
    let emi, interest;
    if (v.type === 'flat') { interest = v.P * v.rate / 100 * v.yrs; emi = (v.P + interest) / n; }
    else { const e = emiCalc(v.P, v.rate, n); emi = e.emi; interest = e.interest; }
    const fee = v.P * (v.fee || 0) / 100, red = emiCalc(v.P, v.rate, n);
    return res([['Monthly EMI', cur(emi), 1], ['Total Interest', cur(interest)], ['Processing Fee', cur(fee)], ['Total Repayment', cur(v.P + interest)], ['Total Cost (incl. fee)', cur(v.P + interest + fee)],
      v.type === 'flat' ? ['Same loan on reducing balance', cur(red.emi) + ' /mo'] : ['Interest as % of loan', inr(interest / v.P * 100, 1) + ' %']]);
  }
}));

add('calc', 'datediff', '📅', 'Date Difference Calculator', 'Days, weeks, months & working days between two dates', C({
  fields: [{ id: 'a', label: 'From Date', type: 'date', value: todayStr() }, { id: 'b', label: 'To Date', type: 'date', value: new Date(Date.now() + 90 * 864e5 - new Date().getTimezoneOffset() * 6e4).toISOString().slice(0, 10) }],
  calc: v => {
    if (!v.a || !v.b) return bad('Select both dates.');
    let a = pd(v.a), b = pd(v.b); if (a > b) [a, b] = [b, a];
    const r = ymd(a, b), days = dayDiff(a, b);
    let wd = 0; for (let d = new Date(a); d < b; d.setDate(d.getDate() + 1)) { const w = d.getDay(); if (w && w < 6) wd++; }
    return res([['Difference', `${r.y} Years, ${r.m} Months, ${r.d} Days`, 1], ['Total Days', inr(days, 0)], ['Total Weeks', `${Math.floor(days / 7)} wk ${days % 7} d`], ['Total Months (approx.)', inr(r.y * 12 + r.m + r.d / 30, 1)], ['Working Days (Mon–Fri)', inr(wd, 0)], ['Total Hours', inr(days * 24, 0)]]);
  }
}));

/* ======================= HVAC ======================= */
const TR = 3.51685; // kW per TR
add('hvac', 'tr-to-kw', '❄️', 'TR to KW Calculator', 'Convert Tons of Refrigeration ↔ kW, BTU/h, kcal/h', C({
  fields: [{ id: 'val', label: 'Value', type: 'number', value: 1 }, { id: 'dir', label: 'Convert', type: 'select', value: 'tr', options: [['tr', 'TR → kW'], ['kw', 'kW → TR'], ['btu', 'BTU/h → TR']] }],
  calc: v => {
    if (!pos(v.val)) return bad('Enter a valid value.');
    const tr = v.dir === 'tr' ? v.val : v.dir === 'kw' ? v.val / TR : v.val / 12000;
    return res([['Tons of Refrigeration', inr(tr, 4) + ' TR', 1], ['Kilowatt (kW)', inr(tr * TR, 4)], ['BTU / hour', inr(tr * 12000, 1)], ['kcal / hour', inr(tr * 3024, 1)], ['Horsepower (approx., 1 TR≈1.2 HP)', inr(tr * 1.2, 2)]]);
  },
  note: '1 TR = 12,000 BTU/h = 3.517 kW = 3,024 kcal/h.'
}));

add('hvac', 'cfm', '🌬️', 'CFM Calculator', 'Airflow by duct velocity or by room air-changes (ACH)', M([
  { title: 'Method 1 – Duct area × velocity', fields: [{ id: 'a', label: 'Duct area (sq ft)', type: 'number', value: 2 }, { id: 'v', label: 'Velocity (FPM)', type: 'number', value: 1000 }],
    calc: v => pos(v.a, v.v) ? cfmRes(v.a * v.v) : bad('Enter valid values.'), note: 'CFM = Area (sq ft) × Velocity (FPM)' },
  { title: 'Method 2 – Room volume × Air Changes per Hour', fields: [{ id: 'l', label: 'Length (ft)', type: 'number', value: 20 }, { id: 'w', label: 'Width (ft)', type: 'number', value: 15 }, { id: 'h', label: 'Height (ft)', type: 'number', value: 10 }, { id: 'ach', label: 'ACH', type: 'number', value: 8 }],
    calc: v => pos(v.l, v.w, v.h, v.ach) ? cfmRes(v.l * v.w * v.h * v.ach / 60) : bad('Enter valid values.'), note: 'CFM = Volume (cu ft) × ACH ÷ 60. Typical ACH: office 6–10, kitchen 15–30, toilets 10–15.' }
]));
const cfmRes = c => res([['Airflow', inr(c, 1) + ' CFM', 1], ['m³ / hour', inr(c * 1.699, 1)], ['m³ / second', inr(c * 0.000472, 4)], ['Litres / second', inr(c * 0.4719, 1)]]);

add('hvac', 'duct-size', '📐', 'Duct Size Calculator', 'Round & rectangular duct size from CFM and velocity', C({
  fields: [{ id: 'cfm', label: 'Airflow (CFM)', type: 'number', value: 2000 }, { id: 'vel', label: 'Design velocity (FPM)', type: 'number', value: 1000, hint: 'Main duct 1000–1800, branch 600–1000' }, { id: 'w', label: 'Rectangular width (inch)', type: 'number', value: 20 }],
  calc: v => {
    if (!pos(v.cfm, v.vel)) return bad('Enter valid values.');
    const A = v.cfm / v.vel, d = Math.sqrt(4 * A / Math.PI) * 12, sq = A * 144;
    const rows = [['Duct area required', inr(A, 3) + ' sq ft', 1], ['Round duct diameter', inr(d, 1) + ' inch  (' + inr(d * 25.4, 0) + ' mm)'], ['Square duct side', inr(Math.sqrt(sq), 1) + ' inch']];
    if (pos(v.w)) { const h = sq / v.w, de = 1.3 * Math.pow(v.w * h, .625) / Math.pow(v.w + h, .25); rows.push([`Rectangular ${inr(v.w, 0)} in wide →`, `${inr(h, 1)} inch high  (${inr(v.w * 25.4, 0)} × ${inr(h * 25.4, 0)} mm)`], ['Equivalent round dia.', inr(de, 1) + ' inch']); }
    return res(rows);
  }
}));

add('hvac', 'air-velocity', '💨', 'Air Velocity Calculator', 'Velocity in duct from CFM and size', C({
  fields: [{ id: 'cfm', label: 'Airflow (CFM)', type: 'number', value: 1500 }, { id: 'shape', label: 'Duct shape', type: 'select', value: 'rect', options: [['rect', 'Rectangular'], ['round', 'Round']] }, { id: 'a', label: 'Width / Diameter (inch)', type: 'number', value: 20 }, { id: 'b', label: 'Height (inch, rectangular only)', type: 'number', value: 14 }],
  calc: v => {
    const A = v.shape === 'round' ? Math.PI * v.a * v.a / 4 / 144 : v.a * v.b / 144;
    if (!pos(v.cfm, A)) return bad('Enter valid values.');
    const f = v.cfm / A;
    return res([['Velocity', inr(f, 0) + ' FPM', 1], ['Velocity (m/s)', inr(f * 0.00508, 2)], ['Duct area', inr(A, 3) + ' sq ft'], ['Remark', f > 2000 ? 'Too high – noisy, consider larger duct' : f < 500 ? 'Low – duct may be oversized' : 'Within normal comfort-AC range']]);
  }
}));

add('hvac', 'btu', '🔥', 'BTU Calculator', 'Cooling load estimate & AC tonnage for a room', C({
  fields: [{ id: 'area', label: 'Room area (sq ft)', type: 'number', value: 200 }, { id: 'h', label: 'Ceiling height (ft)', type: 'number', value: 10 }, { id: 'ppl', label: 'Number of people', type: 'number', value: 3 }, { id: 'eq', label: 'Equipment load (Watts)', type: 'number', value: 400 }, { id: 'lt', label: 'Lighting load (Watts)', type: 'number', value: 100 },
    { id: 'sun', label: 'Sun exposure', type: 'select', value: '1', options: [['0.9', 'Shaded / interior room'], ['1', 'Normal'], ['1.15', 'Sunny / top floor / west wall']] }],
  calc: v => {
    if (!pos(v.area, v.h)) return bad('Enter valid values.');
    const base = v.area * 20 * (v.h / 8) * v.sun, extraP = Math.max(0, (v.ppl || 0) - 2) * 600, eq = (v.eq || 0) * 3.412, lt = (v.lt || 0) * 3.412;
    const tot = base + extraP + eq + lt, tr = tot / 12000, std = [0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10, 15, 20].find(x => x >= tr) || Math.ceil(tr);
    return res([['Required Cooling', inr(tot, 0) + ' BTU/h', 1], ['Tonnage', inr(tr, 2) + ' TR'], ['In kW', inr(tr * TR, 2)], ['Suggested AC size', std + ' TR'], ['Base (area & sun)', inr(base, 0) + ' BTU/h'], ['People + equipment + lights', inr(extraP + eq + lt, 0) + ' BTU/h']]);
  },
  note: 'Quick rule-of-thumb estimate (≈20 BTU/sq ft at 8 ft). For design work do a full heat-load calculation (HAP / E20).'
}));

/* ======================= OFFICE ======================= */
const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const two = n => n < 20 ? ONES[n] : TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
const three = n => (n >= 100 ? ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' : '') : '') + (n % 100 ? two(n % 100) : '');
function n2w(n) {
  n = Math.floor(n); if (n === 0) return 'Zero';
  const p = [], cr = Math.floor(n / 1e7); n %= 1e7;
  const la = Math.floor(n / 1e5); n %= 1e5; const th = Math.floor(n / 1e3); n %= 1e3;
  if (cr) p.push(n2w(cr) + ' Crore'); if (la) p.push(two(la) + ' Lakh'); if (th) p.push(two(th) + ' Thousand'); if (n) p.push(three(n));
  return p.join(' ');
}
function rupeesWords(x) {
  const paise = Math.round(x * 100), r = Math.floor(paise / 100), p = paise % 100;
  return 'Rupees ' + n2w(r) + (p ? ' and ' + two(p) + ' Paise' : '') + ' Only';
}
add('office', 'number-to-words', '🔤', 'Number to Words', 'Convert numbers to Indian-style words (Lakh / Crore)', C({
  fields: [{ id: 'n', label: 'Enter number', type: 'number', value: 1234567.5, wide: true }],
  calc: v => {
    if (!isFinite(v.n) || v.n < 0 || v.n >= 1e13) return bad('Enter a number between 0 and 9,99,99,99,99,999.');
    return res([['In Words', n2w(v.n) , 1], ['As Rupees (cheque style)', rupeesWords(v.n)], ['Indian format', inr(v.n, 2)], ['International format', (+v.n).toLocaleString('en-US', { maximumFractionDigits: 2 })]]) +
      `<div class="row"><button class="btn sm" onclick="copy(rupeesWords(${v.n}))">Copy rupees words</button></div>`;
  }
}));

add('office', 'attendance', '🗓️', 'Attendance Calculator', 'Attendance %, payable days & salary deduction', C({
  fields: [{ id: 'days', label: 'Days in month', type: 'number', value: 30 }, { id: 'off', label: 'Weekly offs', type: 'number', value: 4 }, { id: 'hol', label: 'Holidays', type: 'number', value: 1 }, { id: 'pr', label: 'Days present', type: 'number', value: 22 },
    { id: 'pl', label: 'Paid leaves taken', type: 'number', value: 1 }, { id: 'half', label: 'Half days', type: 'number', value: 2 }, { id: 'sal', label: 'Monthly salary (₹)', type: 'number', value: 30000 }],
  calc: v => {
    const work = v.days - v.off - (v.hol || 0);
    if (!pos(v.days) || work <= 0) return bad('Check days, offs and holidays.');
    const att = (v.pr || 0) + (v.pl || 0) + (v.half || 0) * .5, absent = Math.max(0, work - att), pay = v.days - absent;
    return res([['Attendance %', inr(Math.min(100, att / work * 100), 2) + ' %', 1], ['Working days', inr(work, 1)], ['Days attended (incl. leave)', inr(att, 1)], ['Absent days', inr(absent, 1)], ['Payable days', inr(pay, 1)],
      ['Salary deduction', cur(v.sal / v.days * absent)], ['Net payable salary', cur(v.sal / v.days * pay)]]);
  }
}));
