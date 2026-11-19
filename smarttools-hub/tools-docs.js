/* ===== Document tools: Invoice, Salary Slip, Resume, PDF ===== */

const val = (root, id) => { const e = $(`#${id}`, root); return e ? e.value : ''; };
const nz = x => (isFinite(parseFloat(x)) ? parseFloat(x) : 0);
const nl = s => esc(s).replace(/\n/g, '<br>');

/* ---------------- Invoice ---------------- */
function invoiceTool(el) {
  const F = [
    { id: 'seller', label: 'Your business name', value: 'Peeyush Services', wide: 1 },
    { id: 'saddr', label: 'Your address / phone', type: 'textarea', rows: 2, value: 'Jaipur, Rajasthan\nPhone: 98XXXXXXXX', wide: 1 },
    { id: 'sgst', label: 'Your GSTIN', value: '' },
    { id: 'inv', label: 'Invoice No.', value: 'INV-001' },
    { id: 'date', label: 'Date', type: 'date', value: todayStr() },
    { id: 'supply', label: 'Supply type', type: 'select', value: 'intra', options: [['intra', 'Within state (CGST + SGST)'], ['inter', 'Other state (IGST)']] },
    { id: 'buyer', label: 'Bill to (customer)', value: 'Customer Name', wide: 1 },
    { id: 'baddr', label: 'Customer address', type: 'textarea', rows: 2, value: '', wide: 1 },
    { id: 'bgst', label: 'Customer GSTIN', value: '' },
    { id: 'notes', label: 'Notes / bank details', type: 'textarea', rows: 2, value: 'Thank you for your business!', wide: 1 }
  ];
  el.innerHTML = `<div class="split"><div class="card noprint"><h3>Invoice details</h3><div class="form">${F.map(f => fld(f, 'iv_')).join('')}</div>
    <h4>Items</h4><div id="items"></div><button class="btn ghost sm" id="addItem">+ Add item</button>
    <div class="row"><button class="btn" id="pr">🖨 Print / Save as PDF</button></div></div>
    <div class="card print-area"><div class="doc paper" id="prev"></div></div></div>`;
  const items = $('#items', el);
  const addRow = (d = '', q = 1, r = 0, g = 18) => {
    const row = document.createElement('div'); row.className = 'itemrow';
    row.innerHTML = `<input class="d" placeholder="Description" value="${esc(d)}"><input class="q" type="number" placeholder="Qty" value="${q}"><input class="r" type="number" placeholder="Rate" value="${r}"><input class="g" type="number" placeholder="GST%" value="${g}"><button title="Remove">✕</button>`;
    row.querySelector('button').onclick = () => { row.remove(); draw(); };
    items.appendChild(row);
  };
  const draw = () => {
    const g = id => val(el, 'f_iv_' + id);
    const rows = $$('.itemrow', items).map(r => ({ d: $('.d', r).value, q: nz($('.q', r).value), r: nz($('.r', r).value), g: nz($('.g', r).value) })).filter(x => x.d || x.r);
    let sub = 0; const tax = {};
    const body = rows.map((x, i) => { const a = x.q * x.r; sub += a; tax[x.g] = (tax[x.g] || 0) + a * x.g / 100; return `<tr><td>${i + 1}</td><td>${esc(x.d)}</td><td class="r">${inr(x.q)}</td><td class="r">${inr(x.r)}</td><td class="r">${x.g}%</td><td class="r">${inr(a)}</td></tr>`; }).join('');
    let taxRows = '', taxTot = 0;
    Object.keys(tax).sort((a, b) => a - b).forEach(k => {
      const t = tax[k]; if (!t) return; taxTot += t;
      taxRows += g('supply') === 'intra' ? `<div><span>CGST @${k / 2}%</span><span>${inr(t / 2)}</span></div><div><span>SGST @${k / 2}%</span><span>${inr(t / 2)}</span></div>` : `<div><span>IGST @${k}%</span><span>${inr(t)}</span></div>`;
    });
    const total = Math.round((sub + taxTot) * 100) / 100;
    $('#prev', el).innerHTML = `<div class="inv-top"><div><div class="inv-title">TAX INVOICE</div><b>${esc(g('seller'))}</b><br>${nl(g('saddr'))}${g('sgst') ? '<br>GSTIN: ' + esc(g('sgst')) : ''}</div>
      <div style="text-align:right">Invoice No: <b>${esc(g('inv'))}</b><br>Date: <b>${esc(g('date'))}</b></div></div>
      <div style="margin-bottom:14px"><span style="color:#666">Bill To</span><br><b>${esc(g('buyer'))}</b><br>${nl(g('baddr'))}${g('bgst') ? '<br>GSTIN: ' + esc(g('bgst')) : ''}</div>
      <table><tr><th>#</th><th>Description</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">GST</th><th class="r">Amount (₹)</th></tr>${body}</table>
      <div class="tot"><div><span>Subtotal</span><span>${inr(sub)}</span></div>${taxRows}<div class="g"><span>Total (₹)</span><span>${inr(total)}</span></div></div>
      <p style="margin-top:16px"><b>Amount in words:</b> ${rupeesWords(total)}</p><p style="color:#555">${nl(g('notes'))}</p>`;
  };
  addRow('Service / Product', 1, 1000, 18);
  $('#addItem', el).onclick = () => { addRow(); draw(); };
  $$('input,select,textarea', el).forEach(x => x.addEventListener('input', draw));
  items.addEventListener('input', draw);
  $('#pr', el).onclick = () => window.print();
  draw();
}

/* ---------------- Salary slip ---------------- */
function slipTool(el) {
  const m = todayStr().slice(0, 7);
  const F = [
    { id: 'co', label: 'Company name', value: 'ABC Pvt. Ltd.', wide: 1 }, { id: 'ad', label: 'Company address', value: 'Jaipur, Rajasthan', wide: 1 },
    { id: 'name', label: 'Employee name', value: 'Employee Name' }, { id: 'eid', label: 'Employee ID', value: 'EMP001' },
    { id: 'des', label: 'Designation', value: 'Engineer' }, { id: 'mon', label: 'Salary month', type: 'month', value: m },
    { id: 'days', label: 'Total days', type: 'number', value: 30 }, { id: 'paid', label: 'Paid days', type: 'number', value: 30 },
    { id: 'basic', label: 'Basic (₹)', type: 'number', value: 20000 }, { id: 'hra', label: 'HRA (₹)', type: 'number', value: 8000 },
    { id: 'sp', label: 'Special / Other allowance (₹)', type: 'number', value: 7000 }, { id: 'bonus', label: 'Bonus / Incentive (₹)', type: 'number', value: 0 },
    { id: 'pf', label: 'PF (₹)', type: 'number', value: 1800 }, { id: 'pt', label: 'Professional Tax (₹)', type: 'number', value: 200 },
    { id: 'tds', label: 'TDS (₹)', type: 'number', value: 0 }, { id: 'od', label: 'Other deduction (₹)', type: 'number', value: 0 }
  ];
  el.innerHTML = `<div class="split"><div class="card noprint"><h3>Salary slip details</h3><div class="form">${F.map(f => fld(f, 'sl_')).join('')}</div>
    <p class="note">Amounts are the full monthly figures. They are pro-rated automatically by Paid days ÷ Total days.</p>
    <div class="row"><button class="btn" id="pr">🖨 Print / Save as PDF</button></div></div>
    <div class="card print-area"><div class="doc paper" id="prev"></div></div></div>`;
  const draw = () => {
    const g = id => val(el, 'f_sl_' + id), f = nz(g('paid')) / (nz(g('days')) || 1);
    const E = [['Basic', nz(g('basic')) * f], ['HRA', nz(g('hra')) * f], ['Special / Other Allowance', nz(g('sp')) * f], ['Bonus / Incentive', nz(g('bonus'))]];
    const D = [['Provident Fund', nz(g('pf'))], ['Professional Tax', nz(g('pt'))], ['TDS', nz(g('tds'))], ['Other Deduction', nz(g('od'))]];
    const te = E.reduce((a, b) => a + b[1], 0), td = D.reduce((a, b) => a + b[1], 0), net = te - td;
    const mon = g('mon') ? new Date(g('mon') + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '';
    $('#prev', el).innerHTML = `<div style="text-align:center;border-bottom:2px solid #111;padding-bottom:8px;margin-bottom:12px"><h2>${esc(g('co'))}</h2>${esc(g('ad'))}<br><b>Salary Slip – ${mon}</b></div>
      <table style="margin-bottom:12px"><tr><td><b>Employee:</b> ${esc(g('name'))}</td><td><b>Emp ID:</b> ${esc(g('eid'))}</td></tr><tr><td><b>Designation:</b> ${esc(g('des'))}</td><td><b>Paid days:</b> ${esc(g('paid'))} / ${esc(g('days'))}</td></tr></table>
      <table><tr><th>Earnings</th><th class="r">Amount (₹)</th><th>Deductions</th><th class="r">Amount (₹)</th></tr>
      ${E.map((e, i) => `<tr><td>${e[0]}</td><td class="r">${inr(e[1])}</td><td>${D[i][0]}</td><td class="r">${inr(D[i][1])}</td></tr>`).join('')}
      <tr><th>Total Earnings</th><th class="r">${inr(te)}</th><th>Total Deductions</th><th class="r">${inr(td)}</th></tr></table>
      <h3 style="margin:14px 0 4px">Net Pay: ₹ ${inr(net)}</h3><p>${rupeesWords(Math.max(0, net))}</p>
      <p style="margin-top:40px;color:#666;font-size:11px">This is a computer-generated salary slip.</p>`;
  };
  $$('input,select', el).forEach(x => x.addEventListener('input', draw));
  $('#pr', el).onclick = () => window.print();
  draw();
}

/* ---------------- Resume ---------------- */
function resumeHTML(v) {
  const blocks = s => s.trim() ? s.trim().split(/\n\s*\n/) : [];
  const bullets = L => L.length ? `<ul>${L.map(l => `<li>${esc(l.replace(/^[-•*]\s*/, ''))}</li>`).join('')}</ul>` : '';
  const sec = (t, h) => h ? `<section><h3>${t}</h3>${h}</section>` : '';
  const job = s => blocks(s).map(b => { const L = b.split('\n').filter(Boolean); return `<div class="job"><b>${esc(L[0])}</b>${bullets(L.slice(1))}</div>`; }).join('');
  const skills = v.skills.split(/[,\n]/).map(s => s.trim()).filter(Boolean).map(s => `<span class="chip">${esc(s)}</span>`).join('');
  const contact = [v.email, v.phone, v.loc, v.link].filter(Boolean).map(esc).join(' &nbsp;|&nbsp; ');
  const head = `<h1>${esc(v.name)}</h1><div class="sub">${esc(v.title)}</div><div class="contact">${contact}</div>`;
  return `<div class="doc paper r-${v.tpl}" style="--rc:${v.color}">${v.tpl === 'modern' ? `<div class="rh">${head}</div>` : head}
    ${sec('Professional Summary', v.summary.trim() ? `<p style="margin:0">${nl(v.summary)}</p>` : '')}${sec('Experience', job(v.exp))}${sec('Education', job(v.edu))}${sec('Skills', skills)}${sec('Projects / Certifications', job(v.extra))}</div>`;
}
function resumeTool(el) {
  let saved = {}; try { saved = JSON.parse(localStorage.getItem('pj_resume') || '{}'); } catch (e) { }
  const D = {
    name: 'Peeyush Kumar Jangid', title: 'HVAC Engineer', email: 'you@example.com', phone: '+91 98XXXXXXXX', loc: 'Jaipur, India', link: '',
    summary: 'Result-oriented professional with 5+ years of experience in HVAC design, estimation and project execution. Skilled at delivering projects on time while reducing cost.',
    skills: 'HVAC Design, AutoCAD, Heat Load Calculation, Estimation & BOQ, MS Excel, Project Management',
    exp: 'HVAC Engineer – ABC Pvt. Ltd. (2021 – Present)\n- Designed ducting and chilled-water systems for 20+ commercial projects\n- Reduced material wastage by 12% through accurate BOQ planning\n\nJunior Engineer – XYZ Co. (2019 – 2021)\n- Assisted in site execution and testing & commissioning',
    edu: 'B.Tech Mechanical Engineering – XYZ University (2015 – 2019)\n\nDiploma in HVAC – Institute Name (2019)', extra: 'Certified AutoCAD Professional', tpl: 'classic', color: '#2563eb', ...saved
  };
  const F = [
    { id: 'name', label: 'Full name', value: D.name }, { id: 'title', label: 'Job title', value: D.title }, { id: 'email', label: 'Email', value: D.email }, { id: 'phone', label: 'Phone', value: D.phone },
    { id: 'loc', label: 'Location', value: D.loc }, { id: 'link', label: 'LinkedIn / Website', value: D.link },
    { id: 'tpl', label: 'Template', type: 'select', value: D.tpl, options: [['classic', 'Classic'], ['modern', 'Modern (colour header)']] }, { id: 'color', label: 'Accent colour', type: 'color', value: D.color },
    { id: 'summary', label: 'Professional summary', type: 'textarea', rows: 3, value: D.summary, wide: 1 },
    { id: 'skills', label: 'Skills (comma separated)', type: 'textarea', rows: 2, value: D.skills, wide: 1 },
    { id: 'exp', label: 'Experience', type: 'textarea', rows: 8, value: D.exp, wide: 1, hint: 'First line of each block = Role – Company (dates). Next lines = bullets. Separate jobs with a blank line.' },
    { id: 'edu', label: 'Education', type: 'textarea', rows: 4, value: D.edu, wide: 1 },
    { id: 'extra', label: 'Projects / Certifications (optional)', type: 'textarea', rows: 3, value: D.extra, wide: 1 }
  ];
  el.innerHTML = `<div class="split"><div class="card noprint"><h3>Your details</h3><div class="form">${F.map(f => fld(f, 'rs_')).join('')}</div>
    <div class="row"><button class="btn" id="pr">🖨 Download PDF (Print)</button><button class="btn ghost" id="rst">Reset</button></div>
    <p class="note">In the print window choose "Save as PDF". Your data is saved only in this browser.</p></div>
    <div class="card print-area" id="prev"></div></div>`;
  const draw = () => {
    const v = {}; F.forEach(f => v[f.id] = val(el, 'f_rs_' + f.id));
    $('#prev', el).innerHTML = resumeHTML(v);
    try { localStorage.setItem('pj_resume', JSON.stringify(v)); } catch (e) { }
  };
  $$('input,select,textarea', el).forEach(x => x.addEventListener('input', draw));
  $('#pr', el).onclick = () => window.print();
  $('#rst', el).onclick = () => { try { localStorage.removeItem('pj_resume'); } catch (e) { } resumeTool(el); };
  draw();
}

/* ---------------- PDF tools (pdf-lib) ---------------- */
function loadPdfLib() {
  return window.PDFLib ? Promise.resolve() : new Promise((ok, no) => {
    const s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
    s.onload = ok; s.onerror = () => no(new Error('PDF library could not load. Please check your internet connection.'));
    document.head.appendChild(s);
  });
}
const readBuf = f => new Promise((ok, no) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = no; r.readAsArrayBuffer(f); });
function imgToPng(file) {
  return new Promise((ok, no) => {
    const u = URL.createObjectURL(file), im = new Image();
    im.onload = () => { const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight; c.getContext('2d').drawImage(im, 0, 0); c.toBlob(b => b.arrayBuffer().then(ok), 'image/png'); URL.revokeObjectURL(u); };
    im.onerror = () => no(new Error('Could not read image ' + file.name)); im.src = u;
  });
}
function parseRange(s, max) {
  const out = [];
  s.split(',').forEach(p => {
    p = p.trim(); if (!p) return;
    const m = p.match(/^(\d+)(?:\s*-\s*(\d+))?$/); if (!m) throw new Error('Invalid range: ' + p);
    let a = +m[1], b = m[2] ? +m[2] : a; if (a < 1 || b > max || a > b) throw new Error(`Page range ${p} is outside 1–${max}`);
    for (let i = a; i <= b; i++) out.push(i - 1);
  });
  if (!out.length) throw new Error('Enter pages, e.g. 1-3,5');
  return out;
}
function pdfTool(el) {
  el.innerHTML = `<div class="tabs"><button class="tab on" data-t="img">Images → PDF</button><button class="tab" data-t="merge">Merge PDFs</button><button class="tab" data-t="split">Split / Extract Pages</button></div>
  <div class="card"><div id="pane"></div><p id="pmsg" class="note"></p></div>`;
  const pane = $('#pane', el), msg = t => $('#pmsg', el).innerHTML = t;
  const panes = {
    img: `<h3>Convert images to a PDF</h3><div class="form"><label class="fld wide"><span>Select images (JPG, PNG, WebP…) – order = selection order</span><input type="file" id="files" accept="image/*" multiple></label>
      <label class="fld"><span>Page size</span><select id="size"><option value="a4">A4 (fit image)</option><option value="img">Same as image</option></select></label></div><div class="row"><button class="btn" id="go">Create PDF</button></div>`,
    merge: `<h3>Merge multiple PDFs</h3><div class="form"><label class="fld wide"><span>Select 2 or more PDF files (in the order to merge)</span><input type="file" id="files" accept="application/pdf" multiple></label></div><div class="row"><button class="btn" id="go">Merge PDFs</button></div>`,
    split: `<h3>Extract pages from a PDF</h3><div class="form"><label class="fld wide"><span>Select PDF file</span><input type="file" id="files" accept="application/pdf"></label>
      <label class="fld"><span>Pages to extract</span><input id="range" value="1-2" placeholder="e.g. 1-3,5,8-10"></label></div><div class="row"><button class="btn" id="go">Extract pages</button></div>`
  };
  const show = t => {
    $$('.tab', el).forEach(b => b.classList.toggle('on', b.dataset.t === t)); pane.innerHTML = panes[t]; msg('');
    $('#go', el).onclick = async () => {
      const files = [...$('#files', el).files];
      if (!files.length) return msg('<span class="err">Please select file(s) first.</span>');
      msg('Working…');
      try {
        await loadPdfLib(); const { PDFDocument } = PDFLib;
        const out = await PDFDocument.create();
        if (t === 'img') {
          for (const f of files) {
            const buf = await readBuf(f);
            const im = f.type === 'image/jpeg' ? await out.embedJpg(buf) : f.type === 'image/png' ? await out.embedPng(buf) : await out.embedPng(await imgToPng(f));
            if ($('#size', el).value === 'img') { out.addPage([im.width, im.height]).drawImage(im, { x: 0, y: 0, width: im.width, height: im.height }); }
            else { const W = 595.28, H = 841.89, mg = 24, s = Math.min((W - 2 * mg) / im.width, (H - 2 * mg) / im.height, 1 * 99), w = im.width * s, h = im.height * s; out.addPage([W, H]).drawImage(im, { x: (W - w) / 2, y: (H - h) / 2, width: w, height: h }); }
          }
        } else if (t === 'merge') {
          if (files.length < 2) throw new Error('Select at least 2 PDFs.');
          for (const f of files) { const d = await PDFDocument.load(await readBuf(f)); (await out.copyPages(d, d.getPageIndices())).forEach(p => out.addPage(p)); }
        } else {
          const d = await PDFDocument.load(await readBuf(files[0])), idx = parseRange($('#range', el).value, d.getPageCount());
          (await out.copyPages(d, idx)).forEach(p => out.addPage(p));
        }
        const bytes = await out.save();
        download(new Blob([bytes], { type: 'application/pdf' }), { img: 'images.pdf', merge: 'merged.pdf', split: 'extracted.pdf' }[t]);
        msg(`<span style="color:var(--ok)">✓ Done – ${out.getPageCount()} page(s). Your download has started.</span>`);
      } catch (e) { msg(`<span class="err">${esc(e.message)}</span>`); }
    };
  };
  $$('.tab', el).forEach(b => b.onclick = () => show(b.dataset.t));
  show('img');
}

add('calc', 'pdf-tools', '📄', 'PDF Tools', 'Images to PDF, merge PDFs, extract pages', pdfTool);
add('calc', 'resume-maker', '📝', 'Resume Maker', 'Build a professional resume and download as PDF', resumeTool);
add('office', 'invoice', '🧮', 'Invoice Generator', 'GST invoice with auto totals – print or save as PDF', invoiceTool);
add('office', 'salary-slip', '💵', 'Salary Slip Generator', 'Create a printable monthly salary slip', slipTool);
