/* ===== PJ Pro – Resume Editor Pro + Background Remover =====
   Adds two tools to the hub. Everything runs in the browser (files never leave the device).
   Load this file in pj-tools.html BEFORE pj-tools-app.js. */
(function () {
  if (!window.TOOLS) return;
  const q = (s, r) => (r || document).querySelector(s), qa = (s, r) => [...(r || document).querySelectorAll(s)];
  const E = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const say = m => { try { toast(m); } catch (e) { alert(m); } };
  const dl = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500); };
  const loadScript = src => new Promise((ok, no) => { const s = document.createElement('script'); s.src = src; s.onload = ok; s.onerror = () => no(new Error('Could not load ' + src + ' (check internet).')); document.head.appendChild(s); });
  const uid = () => Math.random().toString(36).slice(2, 8);
  const STYLE = `
.pe-grid{display:grid;grid-template-columns:minmax(300px,430px) 1fr;gap:14px;align-items:start}
@media(max-width:900px){.pe-grid{grid-template-columns:1fr}}
.pe-drop{border:2px dashed #94a3b8;border-radius:14px;padding:18px;text-align:center;cursor:pointer;background:#f8fafc}.pe-drop.on{border-color:#2563eb;background:#eff6ff}
.pe-tpls{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
.pe-tpl{border:2px solid #e2e8f0;border-radius:10px;padding:8px;background:#fff;cursor:pointer;text-align:left;font:inherit;color:inherit}.pe-tpl.on{border-color:#2563eb;background:#eff6ff}.pe-tpl i{display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:6px;vertical-align:middle}
.pe-f{display:grid;grid-template-columns:1fr 1fr;gap:8px}.pe-f label{display:block;font-size:.78rem;color:#64748b}.pe-f select,.pe-f input[type=text],.pe-f input[type=number],.pe-f input[type=range]{width:100%;box-sizing:border-box}
.pe-sec{border:1px solid #e2e8f0;border-radius:12px;padding:10px;margin-bottom:10px;background:#fff}.pe-sec.off{opacity:.55}
.pe-row{display:flex;gap:6px;align-items:center;flex-wrap:wrap}.pe-row input[type=text]{flex:1;min-width:120px}
.pe-tb button,.pe-mini{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:3px 9px;cursor:pointer;font:inherit;font-size:.8rem}
.pe-sec textarea,.pe-ta{width:100%;box-sizing:border-box;min-height:90px;font:inherit;font-size:.86rem;margin-top:6px;border:1px solid #cbd5e1;border-radius:8px;padding:8px}
.pe-fmt{position:sticky;top:0;z-index:5;background:#fff;border:1px solid #cbd5e1;border-radius:10px;padding:6px;align-items:center}.pe-fmt button{border:1px solid #cbd5e1;background:#fff;border-radius:8px;padding:4px 10px;cursor:pointer;font:inherit;font-size:.82rem}.pe-fmt input[type=color]{width:34px;height:30px;padding:0;border:0;background:none}.pe-ed{outline:none}.pe-ed:hover{outline:1px dashed #94a3b8}
.pe-modal{position:fixed;inset:0;background:#0008;z-index:9999;display:flex;align-items:center;justify-content:center;padding:14px}.pe-modal>div{background:#fff;border-radius:14px;padding:14px;width:min(760px,100%);max-height:92vh;display:flex;flex-direction:column;gap:8px}.pe-modal textarea{flex:1;min-height:55vh;font:inherit;font-size:.86rem;border:1px solid #cbd5e1;border-radius:8px;padding:8px}
.pe-prev{background:#cbd5e1;border-radius:12px;padding:10px;overflow:hidden;position:sticky;top:8px}.pe-prev .box{transform-origin:top left;box-shadow:0 4px 20px #0004}
.pe-bar{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0}
.bg-wrap{display:grid;grid-template-columns:minmax(260px,340px) 1fr;gap:14px;align-items:start}@media(max-width:900px){.bg-wrap{grid-template-columns:1fr}}
.bg-cv{max-width:100%;border-radius:10px;background:repeating-conic-gradient(#cbd5e1 0 25%,#f1f5f9 0 50%) 50%/18px 18px;touch-action:none;cursor:crosshair}
.bg-chips{display:flex;gap:6px;flex-wrap:wrap}.bg-chips button{width:30px;height:30px;border-radius:50%;border:2px solid #cbd5e1;cursor:pointer;padding:0}.bg-chips button.on{border-color:#2563eb;box-shadow:0 0 0 2px #bfdbfe}
`;
  const addStyle = () => { if (!q('#pe-style')) { const s = document.createElement('style'); s.id = 'pe-style'; s.textContent = STYLE; document.head.appendChild(s); } };

  /* ================= FILE → TEXT ================= */
  async function inflate(bytes) {
    if (!('DecompressionStream' in window)) throw new Error('This browser cannot open .docx – please use Chrome/Edge or upload a PDF.');
    const ds = new DecompressionStream('deflate-raw'), w = ds.writable.getWriter(); w.write(bytes); w.close();
    return new Uint8Array(await new Response(ds.readable).arrayBuffer());
  }
  async function docxText(buf) {
    const u = new Uint8Array(buf), v = new DataView(buf); let e = -1;
    for (let i = u.length - 22; i >= Math.max(0, u.length - 70000); i--) if (v.getUint32(i, true) === 0x06054b50) { e = i; break; }
    if (e < 0) throw new Error('This does not look like a valid .docx file.');
    let p = v.getUint32(e + 16, true); const n = v.getUint16(e + 10, true), dec = new TextDecoder();
    for (let k = 0; k < n; k++) {
      const meth = v.getUint16(p + 10, true), csz = v.getUint32(p + 20, true), nl = v.getUint16(p + 28, true), xl = v.getUint16(p + 30, true), cl = v.getUint16(p + 32, true), off = v.getUint32(p + 42, true), name = dec.decode(u.subarray(p + 46, p + 46 + nl));
      if (name === 'word/document.xml') {
        const lnl = v.getUint16(off + 26, true), lxl = v.getUint16(off + 28, true), start = off + 30 + lnl + lxl; let data = u.subarray(start, start + csz);
        if (meth === 8) data = await inflate(data);
        return dec.decode(data).replace(/<w:numPr>[\s\S]*?<\/w:numPr>/g, '<w:t>• </w:t>').replace(/<w:tab\/>/g, ' | ').replace(/<w:br[^>]*\/>/g, '\n').replace(/<\/w:p>/g, '\n').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'");
      }
      p += 46 + nl + xl + cl;
    }
    throw new Error('Could not find text inside the .docx file.');
  }
  async function pdfText(buf) {
    if (!window.pdfjsLib) { await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js'); pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }
    const doc = await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise; let out = '';
    for (let i = 1; i <= doc.numPages; i++) {
      const tc = await (await doc.getPage(i)).getTextContent(), it = tc.items.filter(x => x.str && x.str.trim()).map(x => ({ s: x.str, x: x.transform[4], y: x.transform[5] })).sort((a, b) => b.y - a.y || a.x - b.x), rows = [];
      it.forEach(x => { const r = rows[rows.length - 1]; if (r && Math.abs(r.y - x.y) < 3) r.t += (r.t.endsWith(' ') || x.s.startsWith(' ') ? '' : ' ') + x.s; else rows.push({ y: x.y, t: x.s }); });
      out += rows.map(r => r.t.trim()).join('\n') + '\n\n';
    }
    return out;
  }
  async function fileText(f) {
    const ext = f.name.split('.').pop().toLowerCase(), buf = await f.arrayBuffer();
    if (ext === 'txt' || f.type === 'text/plain') return new TextDecoder().decode(buf);
    if (ext === 'docx') return docxText(buf);
    if (ext === 'pdf') return pdfText(buf);
    throw new Error('Please upload a PDF, DOCX or TXT file (old .doc: save as DOCX or PDF first).');
  }

  /* ================= TEXT → MODEL ================= */
  const HEAD = /^(professional\s+|career\s+)?(summary|profile|objective|about me|skills?|technical skills|key skills|core competenc(?:y|ies)|work experience|professional experience|experience|employment(?: history)?|work history|education(?:al)?(?: qualifications?)?|academic(?: details| qualifications?| profile)?|qualifications?|projects?|academic projects?|certifications?|certificates?|courses|training|achievements|awards|languages?|interests|hobbies|strengths|declaration|personal (?:details|information|profile)|references?|tools(?: & software)?|software skills?)\s*:?$/i;
  const titleCase = s => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  const mkSec = (title, text) => ({ id: uid(), title, text: text || '', show: true });
  const isHead = l => { l = l.trim(); return HEAD.test(l) || (/^[A-Z][A-Z &/,\-]{2,38}$/.test(l) && !/\d/.test(l)); };
  const isContact = l => /@|\+?\d[\d\s\-()]{8,}|linkedin|github|https?:|www\.|\b\d{6}\b/i.test(l);
  function parse(text) {
    const L = text.replace(/\r/g, '').split('\n').map(x => x.replace(/\s+$/, '')); let i = 0;
    while (i < L.length && !L[i].trim()) i++;
    const m = { name: (L[i++] || '').trim().slice(0, 60), title: '', contact: [], photo: null, sections: [] }, pre = [];
    while (i < L.length && !isHead(L[i])) { if (L[i].trim()) pre.push(L[i].trim()); i++; }
    const rest = [];
    pre.forEach((l, k) => { if (isContact(l)) l.split(/\s*[|•·▪]\s*/).filter(Boolean).forEach(c => m.contact.push(c)); else if (!m.title && k === 0 && l.length < 70) m.title = l; else rest.push(l); });
    if (rest.length) m.sections.push(mkSec('Profile', rest.join('\n')));
    let cur = null;
    for (; i < L.length; i++) { const l = L[i]; if (isHead(l)) { cur = mkSec(titleCase(l.trim().replace(/:$/, '')), ''); m.sections.push(cur); } else if (cur) cur.text += (cur.text ? '\n' : '') + l.trim(); }
    m.sections.forEach(s => s.text = s.text.replace(/\n{3,}/g, '\n\n').trim());
    return m;
  }
  const SAMPLE = {
    name: 'Your Full Name', title: 'HVAC Project Engineer', contact: ['Jaipur, Rajasthan', '+91 98765 43210', 'yourname@gmail.com', 'linkedin.com/in/yourname'], photo: null,
    sections: [
      mkSec('Profile', 'Motivated professional with hands-on experience in site supervision, drawings and documentation. Looking for a role where I can deliver quality work on time.'),
      mkSec('Experience', '## Project Engineer | Oct 2025 – Present\nCompany Name, Jaipur\n• Supervised HVAC installation on 3 hospital and university sites\n• Prepared AutoCAD 2D drawings and daily progress reports\n• Coordinated with clients, vendors and site teams'),
      mkSec('Education', '## B.Sc. (PCM) | 2024\nUniversity of Rajasthan'),
      mkSec('Skills', '• AutoCAD 2D\n• MS Excel, Word, PowerPoint\n• Site supervision\n• Billing and documentation'),
      mkSec('Languages', 'Hindi, English')]
  };

  /* ================= TEMPLATES / RENDER ================= */
  const TPL = {
    classic: { n: 'Classic', f: 'Georgia', ac: '#1f2937', head: 'left', sec: 'line' },
    modern: { n: 'Modern', f: 'Poppins', ac: '#2563eb', head: 'band', sec: 'bar' },
    minimal: { n: 'Minimal', f: 'Lato', ac: '#475569', head: 'left', sec: 'plain' },
    corporate: { n: 'Corporate', f: 'Calibri', ac: '#0b3d91', head: 'center', sec: 'line' },
    executive: { n: 'Executive', f: 'Cambria', ac: '#111827', head: 'center', sec: 'box' },
    sidebar: { n: 'Creative Sidebar', f: 'Open Sans', ac: '#7c3aed', head: 'left', sec: 'line', side: 1 },
    ats: { n: 'ATS Plain', f: 'Arial', ac: '#000000', head: 'left', sec: 'caps' },
    compact: { n: 'Compact', f: 'Calibri', ac: '#0f766e', head: 'left', sec: 'dot' },
    elegant: { n: 'Elegant', f: 'Playfair Display', ac: '#a16207', head: 'center', sec: 'thin' },
    timeline: { n: 'Timeline', f: 'Roboto', ac: '#dc2626', head: 'left', sec: 'tl' }
  };
  const FONTS = ['Calibri', 'Arial', 'Georgia', 'Times New Roman', 'Cambria', 'Verdana', 'Tahoma', 'Garamond', 'Poppins', 'Roboto', 'Open Sans', 'Lato', 'Merriweather', 'Montserrat', 'Playfair Display', 'Source Sans 3', 'Mukta', 'Noto Sans Devanagari'];
  const GF = ['Poppins', 'Roboto', 'Open Sans', 'Lato', 'Merriweather', 'Montserrat', 'Playfair Display', 'Source Sans 3', 'Mukta', 'Noto Sans Devanagari'];
  const fontLink = f => GF.includes(f) ? `https://fonts.googleapis.com/css2?family=${encodeURIComponent(f).replace(/%20/g, '+')}:wght@400;600;700&display=swap` : '';
  const ensureFont = f => { const u = fontLink(f); if (u && !q('link[data-pef="' + f + '"]')) { const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = u; l.dataset.pef = f; document.head.appendChild(l); } };
  const SIDE_RE = /skill|language|interest|hobb|tool|certif|strength|software|course|award/i;
  const inline = s => E(s).replace(/\{c=(#[0-9a-fA-F]{3,8})\|(.+?)\}/g, '<span style="color:$1">$2</span>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/~~(.+?)~~/g, '<i>$1</i>').replace(/__(.+?)__/g, '<u>$1</u>');
  function body(text) {
    let o = '', ul = false; const cl = () => { if (ul) { o += '</ul>'; ul = false; } };
    text.split('\n').forEach(l => {
      const t = l.trim(); let m;
      if (!t) { cl(); o += '<div class="sp"></div>'; return; }
      if (m = t.match(/^[•\-–▪●*]\s+(.*)/)) { if (!ul) { o += '<ul>'; ul = true; } o += '<li>' + inline(m[1]) + '</li>'; return; }
      cl();
      if (m = t.match(/^##\s*(.*)/)) { const p = m[1].split(/\s+\|\s+/); o += `<div class="eh"><b>${inline(p[0])}</b>${p[1] ? `<span>${inline(p.slice(1).join(' | '))}</span>` : ''}</div>`; return; }
      o += '<p>' + inline(t) + '</p>';
    });
    cl(); return o;
  }
  function build(M, S) {
    const t = TPL[S.tpl] || TPL.classic, ac = S.accent || t.ac, side = !!t.side, secs = M.sections.filter(s => s.show && s.text.trim());
    const ph = (M.photo && S.photo) ? `<img class="ph" src="${M.photo}" alt="">` : '';
    const sec = s => `<section data-id="${s.id}"><h2>${E(s.title)}</h2>${body(s.text)}</section>`;
    const cj = M.contact.filter(Boolean);
    let html;
    if (side) {
      const L = secs.filter(s => SIDE_RE.test(s.title)), R = secs.filter(s => !SIDE_RE.test(s.title));
      html = `<table class="lay"><tr><td class="sb">${ph}<div class="ct">${cj.map(c => `<div>${E(c)}</div>`).join('')}</div>${L.map(sec).join('')}</td><td class="mn"><h1>${E(M.name)}</h1>${M.title ? `<div class="ttl">${E(M.title)}</div>` : ''}${R.map(sec).join('')}</td></tr></table>`;
    } else {
      html = `<header class="hd">${ph}<div class="hdt"><h1>${E(M.name)}</h1>${M.title ? `<div class="ttl">${E(M.title)}</div>` : ''}<div class="ct">${cj.map(c => `<span>${E(c)}</span>`).join('')}</div></div></header>${secs.map(sec).join('')}`;
    }
    const sz = S.size, c = t.head === 'center';
    const secCss = { line: `h2{border-bottom:1.5px solid ${ac};color:${ac};text-transform:uppercase;letter-spacing:.5px}`, bar: `h2{border-left:5px solid ${ac};padding-left:8px;background:${ac}14;text-transform:uppercase}`, plain: `h2{color:#334155;text-transform:uppercase;letter-spacing:3px;font-weight:600}`, box: `h2{background:${ac};color:#fff;padding:3px 8px;text-transform:uppercase;letter-spacing:1px}`, caps: `h2{border-bottom:1px solid #000;text-transform:uppercase}`, dot: `h2{color:${ac};text-transform:uppercase}h2:before{content:"■ ";font-size:.7em}`, thin: `h2{text-align:center;border-top:1px solid ${ac};border-bottom:1px solid ${ac};color:${ac};text-transform:uppercase;letter-spacing:3px;padding:2px 0}`, tl: `section{border-left:2px solid ${ac};padding-left:14px;margin-left:5px;position:relative}h2{color:${ac};text-transform:uppercase}h2:before{content:"";position:absolute;left:-6px;margin-top:5px;width:10px;height:10px;border-radius:50%;background:${ac}}` }[t.sec];
    const css = `.rs{font-family:'${S.font}',Arial,sans-serif;font-size:${sz}pt;line-height:${S.lh};color:#111;background:#fff}
.rs *{box-sizing:border-box}.rs h1{margin:0;font-size:${sz * 2.4}pt;line-height:1.1;color:${side ? ac : t.head === 'band' ? '#fff' : ac}}
.rs .ttl{font-size:${sz * 1.2}pt;color:${t.head === 'band' ? '#fff' : '#475569'};margin:2px 0 4px}
.rs .hd{display:flex;gap:16px;align-items:center;${c ? 'justify-content:center;text-align:center;' : ''}${t.head === 'band' ? `background:${ac};color:#fff;padding:18px 22px;margin:-0px 0 10px;` : 'margin-bottom:8px;'}}
.rs .ct span{display:inline-block;margin-right:12px;font-size:${sz * .95}pt}.rs .hd .ct{color:${t.head === 'band' ? '#fff' : '#334155'}}
.rs .ph{width:84px;height:84px;object-fit:cover;border-radius:50%}
.rs h2{font-size:${sz * 1.15}pt;margin:${t.cmp ? 7 : 12}px 0 4px;padding-bottom:2px;font-weight:700}${secCss}
.rs section{margin-bottom:${t.cmp ? 2 : 6}px;break-inside:avoid-page}
.rs p{margin:0 0 3px}.rs ul{margin:2px 0 4px;padding-left:18px}.rs li{margin:1px 0}.rs .sp{height:5px}
.rs .eh{display:flex;justify-content:space-between;gap:10px;margin-top:4px}.rs .eh span{color:#475569;white-space:nowrap}
.rs .lay{width:100%;border-collapse:collapse}.rs .sb{width:32%;vertical-align:top;background:${ac};color:#fff;padding:22px 16px}.rs .mn{vertical-align:top;padding:22px 24px}
.rs .sb h2{color:#fff;border-color:#fff8;background:none;padding-left:0;border-left:0}.rs .sb .ph{display:block;margin:0 auto 12px;width:110px;height:110px}.rs .sb .ct div{margin:3px 0;font-size:${sz * .95}pt;word-break:break-word}.rs .sb .eh span{color:#e2e8f0}
${t.head === 'center' ? '.rs .hd .ct{text-align:center}' : ''}`;
    return { css, html: `<div class="rs">${html}</div>`, side };
  }
  const PAGE = { A4: [794, 1123, '210mm 297mm'], Letter: [816, 1056, '8.5in 11in'] };
  function fullDoc(M, S, word) {
    const b = build(M, S), mm = b.side ? 0 : S.margin, pg = PAGE[S.page];
    const link = fontLink(S.font) ? `<link rel="stylesheet" href="${fontLink(S.font)}">` : '';
    return `<!doctype html><html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${E(M.name || 'Resume')}</title>${link}<style>${word ? `@page Section1{size:${pg[2]};margin:${mm}mm}div.Section1{page:Section1}` : `@page{size:${pg[2]};margin:${mm}mm}`}body{margin:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}${b.css}</style></head><body>${word ? '<div class="Section1">' : ''}${b.html}${word ? '</div>' : ''}</body></html>`;
  }
  function toText(M) {
    return [M.name, M.title, M.contact.join(' | '), ''].filter((x, i) => x || i === 3).join('\n') + '\n' + M.sections.filter(s => s.show).map(s => s.title.toUpperCase() + '\n' + s.text.replace(/^##\s*/gm, '').replace(/\*\*/g, '')).join('\n\n');
  }

  /* ================= RESUME EDITOR UI ================= */
  const KEY = 'pj_res_editor_v1';
  function renderResume(el) {
    addStyle();
    let M = null, S = { tpl: 'classic', font: 'Georgia', size: 10.5, lh: 1.35, accent: '', margin: 14, page: 'A4', photo: true };
    try { const d = JSON.parse(localStorage.getItem(KEY) || 'null'); if (d && d.M) { M = d.M; S = Object.assign(S, d.S); } } catch (e) { }
    if (!M) M = JSON.parse(JSON.stringify(SAMPLE));
    el.innerHTML = `
<div class="card"><b>✏️ Edit your own resume</b> – upload your existing PDF / Word resume (or start from the sample), then change the template, font, colours, text, sections and photo. Download as <b>PDF or Word</b>.
<p class="note" style="margin:6px 0 0">Your file is read on your device only. The text is rebuilt inside the chosen template (the original design of your file is not copied) – after that you can change <b>everything</b>: click on the resume itself and type, or use the forms on the left. Your work is auto-saved in this browser.</p></div>
<div class="pe-grid"><div id="pe-left">
 <div class="card"><h3 style="margin-top:0">1️⃣ Upload resume</h3>
  <div class="pe-drop" id="pe-dz"><b>📄 Click to upload</b> or drop PDF / DOCX / TXT<br><small class="note">Scanned (photo) PDFs cannot be read – use a text PDF or DOCX</small><input id="pe-fi" type="file" accept=".pdf,.docx,.txt" hidden></div>
  <div id="pe-fs" class="note" style="margin:6px 0"></div>
  <div class="pe-bar"><button class="btn ghost sm" id="pe-sample">Start with sample</button><button class="btn ghost sm" id="pe-json-s">💾 Save project</button><button class="btn ghost sm" id="pe-json-l">📂 Open project</button><input id="pe-jf" type="file" accept=".json" hidden></div></div>
 <div class="card"><h3 style="margin-top:0">2️⃣ Template</h3><div class="pe-tpls" id="pe-tpls"></div></div>
 <div class="card"><h3 style="margin-top:0">3️⃣ Font &amp; style</h3><div class="pe-f">
  <label>Font<select id="pe-font">${FONTS.map(f => `<option>${f}</option>`).join('')}</select></label>
  <label>Font size: <b id="pe-szv"></b> pt<input id="pe-sz" type="range" min="8.5" max="13" step=".5"></label>
  <label>Line spacing: <b id="pe-lhv"></b><input id="pe-lh" type="range" min="1.1" max="1.8" step=".05"></label>
  <label>Margin: <b id="pe-mgv"></b> mm<input id="pe-mg" type="range" min="6" max="25" step="1"></label>
  <label>Accent colour<input id="pe-ac" type="color" style="width:100%;height:34px"></label>
  <label>Page size<select id="pe-pg"><option>A4</option><option>Letter</option></select></label></div>
  <div class="pe-row" style="margin-top:8px"><label class="pp-opt"><input type="checkbox" id="pe-phon"> Show photo</label><button class="btn ghost sm" id="pe-phb">📷 Add / change photo</button><input id="pe-phf" type="file" accept="image/*" hidden><button class="btn ghost sm" id="pe-phx">Remove photo</button></div>
  <p class="note" id="pe-fnote" style="margin:6px 0 0"></p></div>
 <div class="card"><h3 style="margin-top:0">4️⃣ Content</h3>
  <label class="fld"><span>Full name</span><input type="text" id="pe-name"></label>
  <label class="fld"><span>Headline / job title</span><input type="text" id="pe-ttl"></label>
  <label class="fld"><span>Contact details (one per line: phone, email, city, LinkedIn…)</span><textarea id="pe-ct" class="pe-ta" style="min-height:70px"></textarea></label>
  <div id="pe-secs" style="margin-top:10px"></div>
  <div class="pe-row"><select id="pe-addsel"><option value="">+ Add section…</option>${['Summary', 'Experience', 'Education', 'Skills', 'Projects', 'Certifications', 'Achievements', 'Languages', 'Interests', 'Internship', 'Training', 'Declaration', 'Custom…'].map(x => `<option>${x}</option>`).join('')}</select></div>
  <p class="note" style="margin:8px 0 0">Tips: <b>• </b>starts a bullet · <b>## Job title | 2024–25</b> makes a heading with date on the right · <b>**bold**</b> makes text bold.</p></div>
</div>
<div><div class="card" style="padding:8px 12px"><b>👆 Click anywhere on the resume below and type</b> – change, add or delete any text, line, bullet or section directly.</div><div class="pe-fmt pe-bar" id="pe-fmt"><button data-c="bold" title="Bold"><b>B</b></button><button data-c="italic" title="Italic"><i>I</i></button><button data-c="underline" title="Underline"><u>U</u></button><input type="color" id="pe-fc" value="#dc2626" title="Text colour (select text first)"><button data-c="insertUnorderedList">• List</button><button data-c="head">## Heading line</button><button data-c="bar">| Date</button><button data-c="del">🗑 Delete line</button><button data-c="undo">↶</button><button data-c="redo">↷</button><button data-c="full">📝 Edit full text</button></div><div class="pe-bar"><button class="btn" id="pe-pdf">📄 Download PDF</button><button class="btn" id="pe-doc">📝 Download Word</button><button class="btn ghost" id="pe-txt">Text</button><button class="btn ghost" id="pe-cp">Copy text</button><button class="btn ghost" id="pe-reset">Reset</button></div>
<div class="pe-prev" id="pe-prev"><div class="box" id="pe-box"></div></div>
<p class="note">PDF: in the print window choose <b>“Save as PDF”</b>. Word: the file opens in MS Word / Google Docs and stays fully editable (Google fonts need to be installed on your PC to show exactly in Word).</p></div></div>`;
    const $e = s => q(s, el);
    /* template buttons */
    const drawTpls = () => $e('#pe-tpls').innerHTML = Object.entries(TPL).map(([k, t]) => `<button class="pe-tpl ${S.tpl === k ? 'on' : ''}" data-t="${k}"><i style="background:${t.ac}"></i><b>${t.n}</b></button>`).join('');
    /* section list */
    function drawSecs() {
      $e('#pe-secs').innerHTML = M.sections.map((s, i) => `<div class="pe-sec ${s.show ? '' : 'off'}" data-i="${i}"><div class="pe-row"><input type="text" class="pe-st" value="${E(s.title)}"><button class="pe-mini" data-a="up" title="Move up">▲</button><button class="pe-mini" data-a="dn" title="Move down">▼</button><button class="pe-mini" data-a="eye" title="Show / hide">${s.show ? '👁' : '🚫'}</button><button class="pe-mini" data-a="del" title="Delete">🗑</button></div>
      <div class="pe-tb pe-row" style="margin-top:6px"><button data-a="b"><b>B</b></button><button data-a="bl">• Bullet</button><button data-a="h">## Heading</button><button data-a="bar">| Date</button><button data-a="cl">Clear</button></div><textarea class="pe-tx" spellcheck="true">${E(s.text)}</textarea></div>`).join('') || '<p class="note">No sections yet. Add one below.</p>';
    }
    function fit() {
      const pg = PAGE[S.page], box = $e('#pe-box'), host = $e('#pe-prev'), w = host.clientWidth - 20, sc = Math.min(1, w / pg[0]);
      box.style.width = pg[0] + 'px'; box.style.transform = 'scale(' + sc + ')'; host.style.height = (box.offsetHeight * sc + 20) + 'px';
    }
    function preview() {
      ensureFont(S.font); const b = build(M, S), pg = PAGE[S.page], pad = b.side ? 0 : S.margin * 3.78;
      $e('#pe-box').innerHTML = `<style>${b.css}</style><div style="padding:${pad}px;min-height:${pg[1]}px;background:#fff;box-sizing:border-box">${b.html}</div>`;
      const rs = q('.rs', $e('#pe-box')); rs.contentEditable = 'true'; rs.spellcheck = false; rs.classList.add('pe-ed'); qa('.ph', rs).forEach(x => x.contentEditable = 'false');
      rendered = new Set(qa('section[data-id]', rs).map(x => x.dataset.id));
      fit();
    }
    let rendered = new Set(), savedRange = null, st; const save = () => { clearTimeout(st); st = setTimeout(() => { try { localStorage.setItem(KEY, JSON.stringify({ M, S })); } catch (e) { say('Auto-save is full – use “Save project”.'); } }, 400); };
    const change = () => { preview(); save(); };
    function syncUI() {
      $e('#pe-font').value = S.font; $e('#pe-sz').value = S.size; $e('#pe-lh').value = S.lh; $e('#pe-mg').value = S.margin; $e('#pe-ac').value = S.accent || TPL[S.tpl].ac; $e('#pe-pg').value = S.page; $e('#pe-phon').checked = !!S.photo;
      $e('#pe-szv').textContent = S.size; $e('#pe-lhv').textContent = S.lh; $e('#pe-mgv').textContent = S.margin;
      $e('#pe-name').value = M.name; $e('#pe-ttl').value = M.title; $e('#pe-ct').value = M.contact.join('\n');
      $e('#pe-fnote').textContent = GF.includes(S.font) ? '☁ This font loads from Google Fonts (internet needed).' : '';
      drawTpls(); drawSecs(); preview();
    }
    /* upload */
    const take = async f => {
      if (!f) return; const fs = $e('#pe-fs'); fs.textContent = '⏳ Reading ' + f.name + '…';
      try { const t = (await fileText(f)).trim(); if (t.length < 40) throw new Error('No readable text found (scanned PDF?). Upload a text PDF or DOCX.'); const keep = M.photo; M = parse(t); M.photo = keep; if (!M.sections.length) M.sections.push(mkSec('Profile', t)); fs.innerHTML = '✅ Loaded <b>' + E(f.name) + '</b> – check each section below and fix anything that looks wrong.'; syncUI(); save(); }
      catch (e) { fs.innerHTML = '<span style="color:#dc2626">' + E(e.message) + '</span>'; }
    };
    const dz = $e('#pe-dz'), fi = $e('#pe-fi');
    dz.onclick = () => fi.click(); fi.onchange = () => take(fi.files[0]);
    dz.ondragover = e => { e.preventDefault(); dz.classList.add('on'); }; dz.ondragleave = () => dz.classList.remove('on'); dz.ondrop = e => { e.preventDefault(); dz.classList.remove('on'); take(e.dataTransfer.files[0]); };
    $e('#pe-sample').onclick = () => { if (confirm('Replace current content with the sample resume?')) { const p = M.photo; M = JSON.parse(JSON.stringify(SAMPLE)); M.photo = p; syncUI(); save(); } };
    $e('#pe-json-s').onclick = () => (syncFromDom(), dl(new Blob([JSON.stringify({ M, S })], { type: 'application/json' }), 'resume-project.json'));
    $e('#pe-json-l').onclick = () => $e('#pe-jf').click();
    $e('#pe-jf').onchange = async e => { try { const d = JSON.parse(await e.target.files[0].text()); if (!d.M || !d.M.sections) throw 0; M = d.M; S = Object.assign(S, d.S); syncUI(); save(); say('Project opened ✅'); } catch (x) { say('This is not a valid project file'); } };
    /* template & style */
    $e('#pe-tpls').onclick = e => { const b = e.target.closest('[data-t]'); if (!b) return; S.tpl = b.dataset.t; S.font = TPL[S.tpl].f; S.accent = ''; syncUI(); save(); };
    $e('#pe-font').onchange = e => { S.font = e.target.value; syncUI(); save(); };
    [['sz', 'size'], ['lh', 'lh'], ['mg', 'margin']].forEach(([id, k]) => $e('#pe-' + id).oninput = e => { S[k] = +e.target.value; $e('#pe-' + id + 'v').textContent = S[k]; change(); });
    $e('#pe-ac').oninput = e => { S.accent = e.target.value; change(); };
    $e('#pe-pg').onchange = e => { S.page = e.target.value; change(); };
    $e('#pe-phon').onchange = e => { S.photo = e.target.checked; change(); };
    $e('#pe-phb').onclick = () => $e('#pe-phf').click();
    $e('#pe-phx').onclick = () => { M.photo = null; change(); };
    $e('#pe-phf').onchange = e => { const f = e.target.files[0]; if (!f) return; const im = new Image(); im.onload = () => { const c = document.createElement('canvas'), s = Math.min(1, 320 / Math.min(im.width, im.height)), w = im.width * s, h = im.height * s, sz = Math.min(w, h); c.width = c.height = sz; c.getContext('2d').drawImage(im, (w - sz) / 2 / s, (h - sz) / 2 / s, sz / s, sz / s, 0, 0, sz, sz); M.photo = c.toDataURL('image/jpeg', .88); S.photo = true; $e('#pe-phon').checked = true; change(); }; im.src = URL.createObjectURL(f); };
    /* content */
    $e('#pe-name').oninput = e => { M.name = e.target.value; change(); };
    $e('#pe-ttl').oninput = e => { M.title = e.target.value; change(); };
    $e('#pe-ct').oninput = e => { M.contact = e.target.value.split('\n').map(x => x.trim()).filter(Boolean); change(); };
    const secs = $e('#pe-secs');
    secs.addEventListener('input', e => { const box = e.target.closest('.pe-sec'); if (!box) return; const s = M.sections[+box.dataset.i]; if (e.target.classList.contains('pe-st')) s.title = e.target.value; else if (e.target.classList.contains('pe-tx')) s.text = e.target.value; change(); });
    secs.addEventListener('click', e => {
      const btn = e.target.closest('button[data-a]'); if (!btn) return; const box = btn.closest('.pe-sec'), i = +box.dataset.i, a = btn.dataset.a, A = M.sections;
      if (a === 'up' && i > 0) [A[i - 1], A[i]] = [A[i], A[i - 1]];
      else if (a === 'dn' && i < A.length - 1) [A[i + 1], A[i]] = [A[i], A[i + 1]];
      else if (a === 'eye') A[i].show = !A[i].show;
      else if (a === 'del') { if (!confirm('Delete section “' + A[i].title + '”?')) return; A.splice(i, 1); }
      else { /* text toolbar */
        const ta = q('.pe-tx', box), v = ta.value; let s = ta.selectionStart, en = ta.selectionEnd;
        const ls = v.lastIndexOf('\n', s - 1) + 1, le = (v.indexOf('\n', en) < 0 ? v.length : v.indexOf('\n', en)), blk = v.slice(ls, le);
        if (a === 'b') { const sel = v.slice(s, en) || 'text'; ta.value = v.slice(0, s) + '**' + sel + '**' + v.slice(en); }
        else if (a === 'bl') ta.value = v.slice(0, ls) + blk.split('\n').map(l => /^\s*[•\-–]\s/.test(l) ? l.replace(/^\s*[•\-–]\s/, '') : '• ' + l.replace(/^##\s*/, '')).join('\n') + v.slice(le);
        else if (a === 'h') ta.value = v.slice(0, ls) + blk.split('\n').map(l => /^##\s/.test(l) ? l.replace(/^##\s*/, '') : '## ' + l.replace(/^[•\-–]\s*/, '')).join('\n') + v.slice(le);
        else if (a === 'bar') ta.value = v.slice(0, en) + ' | ' + v.slice(en);
        else if (a === 'cl') ta.value = v.slice(0, ls) + blk.replace(/\*\*/g, '').replace(/^(##|[•\-–])\s*/gm, '') + v.slice(le);
        A[i].text = ta.value; ta.focus(); change(); return;
      }
      drawSecs(); change();
    });
    $e('#pe-addsel').onchange = e => { let n = e.target.value; if (!n) return; if (n === 'Custom…') n = prompt('Section name?') || ''; e.target.value = ''; if (!n.trim()) return; M.sections.push(mkSec(n.trim(), n === 'Skills' ? '• ' : n === 'Experience' ? '## Job title | Year – Year\nCompany, City\n• ' : '')); drawSecs(); change(); const t = qa('.pe-tx', secs).pop(); if (t) t.focus(); };

    /* ---- direct editing on the preview ---- */
    const hex = c => { const m = String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/); return m ? '#' + [m[1], m[2], m[3]].map(x => (+x).toString(16).padStart(2, '0')).join('') : (/^#/.test(c) ? c : ''); };
    function inl(n) {
      if (n.nodeType === 3) return n.textContent.replace(/\u00a0/g, ' ');
      if (n.nodeType !== 1) return '';
      if (n.nodeName === 'BR') return '\n';
      let t = inlKids(n); const s = n.style || {}, tag = n.nodeName;
      if (!t.trim()) return t;
      if (tag === 'U' || /underline/.test(s.textDecoration || s.textDecorationLine || '')) t = '__' + t + '__';
      if (tag === 'I' || tag === 'EM' || s.fontStyle === 'italic') t = '~~' + t + '~~';
      if (tag === 'B' || tag === 'STRONG' || s.fontWeight === 'bold' || +s.fontWeight >= 600) t = '**' + t + '**';
      const col = s.color ? hex(s.color) : (tag === 'FONT' && n.color ? n.color : '');
      if (col && !/^#(000000|111111|000)$/i.test(col)) t = '{c=' + col + '|' + t + '}';
      return t;
    }
    const inlKids = n => [...n.childNodes].map(inl).join('');
    function domText(se) {
      const L = [], push = t => { t = t.replace(/\s+$/, ''); L.push(t); };
      [...se.childNodes].forEach(n => {
        if (n.nodeName === 'H2') return;
        if (n.nodeType === 3) { const t = n.textContent.trim(); if (t) L.push(t); return; }
        if (n.nodeType !== 1) return;
        if (n.nodeName === 'UL' || n.nodeName === 'OL') { [...n.children].forEach(li => { const t = inl(li).replace(/\n+/g, ' ').trim(); if (t) L.push(/^##\s/.test(t) ? t : '• ' + t); }); return; }
        if (n.classList.contains('eh')) { const b = n.children[0], sp = n.children[1]; L.push('## ' + (b ? inlKids(b).trim() : '') + (sp && sp.textContent.trim() ? ' | ' + inlKids(sp).trim() : '')); return; }
        if (n.classList.contains('sp')) { L.push(''); return; }
        inl(n).split('\n').forEach(t => { t = t.trim(); if (/^[•\-–▪●]\s/.test(t) || /^##\s/.test(t)) L.push(t); else L.push(t); });
      });
      return L.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    }
    function syncFromDom() {
      const rs = q('.rs', $e('#pe-box')); if (!rs) return;
      const h1 = q('h1', rs); if (h1) M.name = h1.textContent.trim();
      const ttl = q('.ttl', rs); M.title = ttl ? ttl.textContent.trim() : '';
      const ct = q('.ct', rs); if (ct) M.contact = ct.children.length ? [...ct.children].map(x => x.textContent.trim()).filter(Boolean) : ct.textContent.split(/\s*[|\n]\s*/).map(x => x.trim()).filter(Boolean);
      const present = new Set();
      qa('section[data-id]', rs).forEach(se => { const s = M.sections.find(x => x.id === se.dataset.id); if (!s) return; present.add(s.id); const h = q('h2', se); if (h && h.textContent.trim()) s.title = h.textContent.trim(); s.text = domText(se); });
      M.sections = M.sections.filter(s => !(rendered.has(s.id) && !present.has(s.id)));
    }
    function fillForms() {
      $e('#pe-name').value = M.name; $e('#pe-ttl').value = M.title; $e('#pe-ct').value = M.contact.join('\n');
      const boxes = qa('.pe-sec', secs); if (boxes.length !== M.sections.length) return drawSecs();
      boxes.forEach((b, i) => { q('.pe-st', b).value = M.sections[i].title; q('.pe-tx', b).value = M.sections[i].text; });
    }
    const pv = $e('#pe-box');
    pv.addEventListener('input', () => { syncFromDom(); save(); });
    pv.addEventListener('focusout', e => {
      if (e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('#pe-fmt')) return;
      setTimeout(() => { if (pv.contains(document.activeElement)) return; syncFromDom(); fillForms(); preview(); save(); }, 60);
    });
    document.addEventListener('selectionchange', () => { const s = getSelection(); if (s.rangeCount && pv.contains(s.anchorNode)) savedRange = s.getRangeAt(0).cloneRange(); });
    const focusRs = () => { const rs = q('.rs', pv); rs.focus(); if (savedRange) { const s = getSelection(); s.removeAllRanges(); s.addRange(savedRange); } return rs; };
    const after = () => { syncFromDom(); save(); };
    const blockOf = () => { const s = getSelection(); if (!s.rangeCount) return null; let n = s.anchorNode; n = n && (n.nodeType === 1 ? n : n.parentNode); const b = n && n.closest('li,p,div'), se = b && b.closest('section'); return (b && se && se !== b && b.nodeName !== 'H2' && pv.contains(b)) ? b : null; };
    const fmt = $e('#pe-fmt');
    fmt.addEventListener('mousedown', e => { if (e.target.id !== 'pe-fc') e.preventDefault(); });
    fmt.addEventListener('click', e => {
      const b = e.target.closest('button[data-c]'); if (!b) return; const c = b.dataset.c;
      if (c === 'full') return fullText();
      focusRs();
      if (c === 'head') { const s = getSelection(); if (!s.rangeCount) return; s.collapseToStart(); if (s.modify) s.modify('move', 'backward', 'lineboundary'); document.execCommand('insertText', false, '## '); }
      else if (c === 'bar') document.execCommand('insertText', false, ' | ');
      else if (c === 'del') { const blk = blockOf(); if (!blk) return say('Click inside the line you want to delete'); const ul = blk.parentNode; blk.remove(); if (ul && ul.nodeName === 'UL' && !ul.children.length) ul.remove(); }
      else { document.execCommand('styleWithCSS', false, false); document.execCommand(c, false, null); }
      after();
    });
    $e('#pe-fc').addEventListener('input', e => { focusRs(); document.execCommand('styleWithCSS', false, true); document.execCommand('foreColor', false, e.target.value); after(); });
    function fullText() {
      syncFromDom(); const raw = [M.name, M.title, M.contact.join(' | ')].join('\n') + '\n\n' + M.sections.filter(s => s.show).map(s => s.title.toUpperCase() + '\n' + s.text).join('\n\n');
      const m = document.createElement('div'); m.className = 'pe-modal'; m.innerHTML = `<div><b>📝 Edit the whole resume as text</b><span class="note">Line 1 = name, line 2 = headline, line 3 = contact. Put each section title in CAPITAL LETTERS on its own line (e.g. EXPERIENCE).</span><textarea id="pe-raw"></textarea><div class="pe-row"><button class="btn" id="pe-rok">Apply</button><button class="btn ghost" id="pe-rno">Cancel</button></div></div>`;
      document.body.appendChild(m); q('#pe-raw', m).value = raw; q('#pe-rno', m).onclick = () => m.remove();
      q('#pe-rok', m).onclick = () => { const t = q('#pe-raw', m).value; if (t.trim().length < 5) return; const hidden = M.sections.filter(s => !s.show), ph = M.photo, n = parse(t); n.photo = ph; if (!n.sections.length) n.sections.push(mkSec('Profile', '')); n.sections.push(...hidden); M = n; m.remove(); syncUI(); save(); };
    }
    /* export */
    const wait = ms => new Promise(r => setTimeout(r, ms));
    $e('#pe-pdf').onclick = async () => {
      syncFromDom(); ensureFont(S.font); const f = document.createElement('iframe'); f.style.cssText = 'position:fixed;width:0;height:0;border:0;right:0;bottom:0'; document.body.appendChild(f);
      const d = f.contentDocument; d.open(); d.write(fullDoc(M, S, false)); d.close(); await wait(GF.includes(S.font) ? 1200 : 300);
      try { await f.contentDocument.fonts.ready; } catch (e) { } f.contentWindow.focus(); f.contentWindow.print(); setTimeout(() => f.remove(), 8000); say('Choose “Save as PDF” in the print window');
    };
    $e('#pe-doc').onclick = () => (syncFromDom(), dl(new Blob(['\ufeff' + fullDoc(M, S, true)], { type: 'application/msword' }), (M.name || 'resume').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') + '.doc'));
    $e('#pe-txt').onclick = () => (syncFromDom(), dl(new Blob([toText(M)], { type: 'text/plain' }), 'resume.txt'));
    $e('#pe-cp').onclick = () => { syncFromDom(); try { navigator.clipboard.writeText(toText(M)); say('Copied ✅'); } catch (e) { say('Copy failed'); } };
    $e('#pe-reset').onclick = () => { if (!confirm('Delete everything and start again?')) return; try { localStorage.removeItem(KEY); } catch (e) { } M = JSON.parse(JSON.stringify(SAMPLE)); S = { tpl: 'classic', font: 'Georgia', size: 10.5, lh: 1.35, accent: '', margin: 14, page: 'A4', photo: true }; syncUI(); };
    window.addEventListener('resize', fit);
    syncUI();
  }

  /* ================= BACKGROUND REMOVER ================= */
  const MP = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/';
  function blur1(src, w, h, r) {
    if (r < 1) return src;
    const tmp = new Float32Array(w * h), out = new Uint8ClampedArray(w * h), n = 2 * r + 1;
    for (let y = 0; y < h; y++) { let s = 0; const o = y * w; for (let x = -r; x <= r; x++) s += src[o + Math.min(w - 1, Math.max(0, x))]; for (let x = 0; x < w; x++) { tmp[o + x] = s / n; s += src[o + Math.min(w - 1, x + r + 1)] - src[o + Math.max(0, x - r)]; } }
    for (let x = 0; x < w; x++) { let s = 0; for (let y = -r; y <= r; y++) s += tmp[Math.min(h - 1, Math.max(0, y)) * w + x]; for (let y = 0; y < h; y++) { out[y * w + x] = s / n; s += tmp[Math.min(h - 1, y + r + 1) * w + x] - tmp[Math.max(0, y - r) * w + x]; } }
    return out;
  }
  function renderBg(el) {
    addStyle();
    const BGS = [['transparent', ''], ['white', '#ffffff'], ['blue', '#2b6cb0'], ['red', '#c53030'], ['green', '#2f855a'], ['grey', '#e2e8f0'], ['black', '#111111']];
    el.innerHTML = `<div class="card"><b>🪄 Remove or change the background of any photo</b><p class="note" style="margin:6px 0 0">Works on your device – the photo is never uploaded. <b>AI mode</b> is for photos of people (profile / passport photos). <b>Colour mode</b> works for any picture with a plain background. Then touch up with the Erase / Restore brush.</p></div>
<div class="bg-wrap"><div>
 <div class="card"><h3 style="margin-top:0">1️⃣ Photo</h3><div class="pe-drop" id="bg-dz"><b>🖼 Click to choose</b> or drop a photo<input id="bg-fi" type="file" accept="image/*" hidden></div><div id="bg-st" class="note" style="margin-top:6px"></div></div>
 <div class="card"><h3 style="margin-top:0">2️⃣ Remove background</h3>
  <div class="pe-bar"><button class="btn" id="bg-ai">🤖 AI remove (people)</button></div>
  <label class="fld"><span>Colour mode – sensitivity: <b id="bg-tv">40</b></span><input type="range" id="bg-tol" min="8" max="120" value="40"></label>
  <div class="pe-bar"><button class="btn ghost" id="bg-col">🎨 Remove plain background</button></div></div>
 <div class="card"><h3 style="margin-top:0">3️⃣ Touch up</h3>
  <div class="pe-row"><button class="btn sm" id="bg-er">🧽 Erase</button><button class="btn ghost sm" id="bg-rs">🖌 Restore</button><button class="btn ghost sm" id="bg-un">↩ Undo</button><button class="btn ghost sm" id="bg-rst">Reset</button></div>
  <label class="fld"><span>Brush size: <b id="bg-bv">30</b></span><input type="range" id="bg-br" min="4" max="140" value="30"></label>
  <label class="fld"><span>Edge smoothness: <b id="bg-sv">2</b></span><input type="range" id="bg-sm" min="0" max="8" value="2"></label></div>
 <div class="card"><h3 style="margin-top:0">4️⃣ New background</h3><div class="bg-chips" id="bg-chips">${BGS.map((b, i) => `<button data-i="${i}" title="${b[0]}" class="${i ? '' : 'on'}" style="background:${b[1] || 'repeating-conic-gradient(#ccc 0 25%,#fff 0 50%) 50%/10px 10px'}"></button>`).join('')}<input type="color" id="bg-cc" value="#ffd966" title="Custom colour" style="width:34px;height:30px;padding:0;border:0"></div>
  <div class="pe-row" style="margin-top:8px"><button class="btn ghost sm" id="bg-bi">🖼 Use a picture as background</button><input id="bg-bf" type="file" accept="image/*" hidden></div></div>
</div><div><div class="pe-bar"><button class="btn" id="bg-png">⬇ Download PNG</button><button class="btn ghost" id="bg-jpg">⬇ Download JPG</button><button class="btn ghost" id="bg-org">👁 Hold to see original</button></div>
 <canvas id="bg-cv" class="bg-cv" width="600" height="400"></canvas><p class="note">PNG keeps a transparent background. JPG fills it with the chosen colour (white if transparent).</p></div></div>`;
    const $e = s => q(s, el), cv = $e('#bg-cv'), cx = cv.getContext('2d', { willReadFrequently: true });
    let W = 0, H = 0, orig = null, raw = null, mask = null, bg = '', bgImg = null, tool = 'erase', hist = [], drawing = false, showOrig = false, tc = null, raf = 0;
    const MAXS = 1800;
    const smooth = () => { const r = +$e('#bg-sm').value; if (!raw) return; if (r < 1) { mask = raw; return; } const b = blur1(raw, W, H, r); mask = new Uint8ClampedArray(W * H); for (let i = 0; i < mask.length; i++) mask[i] = Math.max(0, Math.min(255, (b[i] - 128) * 1.8 + 128)); };
    function paint(fill) {
      const c = fill || cx;
      c.clearRect(0, 0, W, H);
      if (showOrig) { c.putImageData(orig, 0, 0); return; }
      if (fill && !bg && !bgImg) { c.fillStyle = '#fff'; c.fillRect(0, 0, W, H); }
      if (bgImg) { const s = Math.max(W / bgImg.width, H / bgImg.height), w = bgImg.width * s, h = bgImg.height * s; c.drawImage(bgImg, (W - w) / 2, (H - h) / 2, w, h); } else if (bg) { c.fillStyle = bg; c.fillRect(0, 0, W, H); }
      const m = (drawing || !mask) ? raw : mask, id = new ImageData(new Uint8ClampedArray(orig.data), W, H), d = id.data;
      for (let i = 0, j = 3; i < m.length; i++, j += 4) d[j] = m[i];
      if (!tc) { tc = document.createElement('canvas'); }
      tc.width = W; tc.height = H; tc.getContext('2d').putImageData(id, 0, 0); c.drawImage(tc, 0, 0);
    }
    const redraw = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => paint()); };
    const push = () => { hist.push(new Uint8ClampedArray(raw)); if (hist.length > 12) hist.shift(); };
    function setImage(im) {
      const s = Math.min(1, MAXS / Math.max(im.width, im.height)); W = Math.round(im.width * s); H = Math.round(im.height * s); cv.width = W; cv.height = H;
      cx.drawImage(im, 0, 0, W, H); orig = cx.getImageData(0, 0, W, H); raw = new Uint8ClampedArray(W * H).fill(255); mask = raw; hist = []; paint();
      $e('#bg-st').textContent = '✅ ' + W + '×' + H + ' px – now choose a remove method.';
    }
    const take = f => { if (!f || !f.type.startsWith('image/')) return say('Please choose an image file'); const im = new Image(); im.onload = () => setImage(im); im.onerror = () => say('Could not open this image'); im.src = URL.createObjectURL(f); };
    const dz = $e('#bg-dz'), fi = $e('#bg-fi'); dz.onclick = () => fi.click(); fi.onchange = () => take(fi.files[0]);
    dz.ondragover = e => { e.preventDefault(); dz.classList.add('on'); }; dz.ondragleave = () => dz.classList.remove('on'); dz.ondrop = e => { e.preventDefault(); dz.classList.remove('on'); take(e.dataTransfer.files[0]); };
    const need = () => { if (!orig) { say('Choose a photo first'); return false; } return true; };
    /* colour method */
    $e('#bg-tol').oninput = e => $e('#bg-tv').textContent = e.target.value;
    $e('#bg-col').onclick = () => {
      if (!need()) return; push(); const d = orig.data, tol = +$e('#bg-tol').value, pts = [];
      for (let x = 0; x < W; x += Math.max(1, W >> 5)) { pts.push(x, (H - 1) * W + x); } for (let y = 0; y < H; y += Math.max(1, H >> 5)) { pts.push(y * W, y * W + W - 1); }
      const med = ch => { const a = pts.map(k => d[k * 4 + ch]).sort((p, q2) => p - q2); return a[a.length >> 1]; }, bc = [med(0), med(1), med(2)];
      const ok = k => { const i = k * 4, dr = d[i] - bc[0], dg = d[i + 1] - bc[1], db = d[i + 2] - bc[2]; return Math.sqrt(dr * dr + dg * dg + db * db) < tol; };
      const out = new Uint8ClampedArray(W * H).fill(255), seen = new Uint8Array(W * H), st = [];
      for (let i = 0; i < W; i++) st.push(i, (H - 1) * W + i); for (let j = 0; j < H; j++) st.push(j * W, j * W + W - 1);
      while (st.length) { const k = st.pop(); if (seen[k] || !ok(k)) continue; seen[k] = 1; out[k] = 0; const x = k % W; if (x > 0) st.push(k - 1); if (x < W - 1) st.push(k + 1); if (k >= W) st.push(k - W); if (k < W * H - W) st.push(k + W); }
      raw = out; smooth(); paint(); say('Done – fine-tune with the brush');
    };
    /* AI method (people) */
    $e('#bg-ai').onclick = async () => {
      if (!need()) return; const b = $e('#bg-ai'), st = $e('#bg-st'); b.disabled = true; st.textContent = '⏳ Loading AI model (first time needs internet, ~5 MB)…';
      try {
        if (!window.SelfieSegmentation) await loadScript(MP + 'selfie_segmentation.js');
        const ss = new SelfieSegmentation({ locateFile: f => MP + f }); ss.setOptions({ modelSelection: 0 });
        const res = await new Promise(async (ok, no) => { ss.onResults(ok); try { const src = document.createElement('canvas'); src.width = W; src.height = H; src.getContext('2d').putImageData(orig, 0, 0); await ss.send({ image: src }); } catch (e) { no(e); } });
        const mc = document.createElement('canvas'); mc.width = W; mc.height = H; const mx = mc.getContext('2d', { willReadFrequently: true }); mx.drawImage(res.segmentationMask, 0, 0, W, H);
        const md = mx.getImageData(0, 0, W, H).data; let amin = 255; for (let i = 3; i < md.length; i += 4000) amin = Math.min(amin, md[i]);
        const useA = amin < 250, out = new Uint8ClampedArray(W * H);
        for (let i = 0; i < out.length; i++) { const c = (useA ? md[i * 4 + 3] : md[i * 4]) / 255, t = Math.max(0, Math.min(1, (c - .3) / .4)); out[i] = Math.round(255 * t * t * (3 - 2 * t)); }
        push(); raw = out; smooth(); paint(); st.textContent = '✅ Background removed. Use Erase / Restore to fix small mistakes.'; try { ss.close(); } catch (e) { }
      } catch (e) { st.innerHTML = '<span style="color:#dc2626">AI mode failed: ' + E(e.message || e) + '. Try “Remove plain background” instead.</span>'; }
      b.disabled = false;
    };
    /* brush */
    const setTool = t => { tool = t; $e('#bg-er').className = 'btn' + (t === 'erase' ? '' : ' ghost') + ' sm'; $e('#bg-rs').className = 'btn' + (t === 'restore' ? '' : ' ghost') + ' sm'; };
    $e('#bg-er').onclick = () => setTool('erase'); $e('#bg-rs').onclick = () => setTool('restore');
    $e('#bg-br').oninput = e => $e('#bg-bv').textContent = e.target.value;
    $e('#bg-sm').oninput = e => { $e('#bg-sv').textContent = e.target.value; if (raw) { smooth(); redraw(); } };
    $e('#bg-un').onclick = () => { if (hist.length) { raw = hist.pop(); smooth(); paint(); } };
    $e('#bg-rst').onclick = () => { if (!need()) return; push(); raw = new Uint8ClampedArray(W * H).fill(255); smooth(); paint(); };
    const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height, W / r.width]; };
    function stroke(e) {
      const [x, y, k] = pos(e), R = +$e('#bg-br').value * k / 2, x0 = Math.max(0, Math.floor(x - R)), x1 = Math.min(W - 1, Math.ceil(x + R)), y0 = Math.max(0, Math.floor(y - R)), y1 = Math.min(H - 1, Math.ceil(y + R));
      for (let j = y0; j <= y1; j++) for (let i = x0; i <= x1; i++) { const dd = Math.hypot(i - x, j - y); if (dd > R) continue; const w = Math.min(1, (R - dd) / (R * .35 + 1e-6)), p = j * W + i; raw[p] = tool === 'erase' ? raw[p] * (1 - w) : raw[p] + (255 - raw[p]) * w; }
      redraw();
    }
    cv.addEventListener('pointerdown', e => { if (!orig) return; drawing = true; push(); cv.setPointerCapture(e.pointerId); stroke(e); });
    cv.addEventListener('pointermove', e => { if (drawing) stroke(e); });
    const endS = () => { if (drawing) { drawing = false; smooth(); redraw(); } }; cv.addEventListener('pointerup', endS); cv.addEventListener('pointercancel', endS);
    /* background */
    $e('#bg-chips').onclick = e => { const b = e.target.closest('button[data-i]'); if (!b) return; qa('button', $e('#bg-chips')).forEach(x => x.classList.remove('on')); b.classList.add('on'); bg = BGS[+b.dataset.i][1]; bgImg = null; if (orig) paint(); };
    $e('#bg-cc').oninput = e => { qa('button', $e('#bg-chips')).forEach(x => x.classList.remove('on')); bg = e.target.value; bgImg = null; if (orig) paint(); };
    $e('#bg-bi').onclick = () => $e('#bg-bf').click();
    $e('#bg-bf').onchange = e => { const f = e.target.files[0]; if (!f) return; const im = new Image(); im.onload = () => { bgImg = im; if (orig) paint(); }; im.src = URL.createObjectURL(f); };
    const org = $e('#bg-org'); const so = v => { if (orig) { showOrig = v; paint(); } };
    org.onpointerdown = () => so(true); org.onpointerup = org.onpointerleave = () => so(false);
    /* download */
    function out(type) {
      if (!need()) return; const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d');
      if (type === 'image/jpeg') { x.fillStyle = '#fff'; x.fillRect(0, 0, W, H); } paint(x);
      c.toBlob(b => dl(b, 'background-removed.' + (type === 'image/png' ? 'png' : 'jpg')), type, .95);
    }
    $e('#bg-png').onclick = () => out('image/png'); $e('#bg-jpg').onclick = () => out('image/jpeg');
    setTool('erase');
  }

  /* ================= REGISTER ================= */
  const base = TOOLS.find(t => t.id === 'resume-improvement'), img = TOOLS.find(t => /image|photo|compress|resize|crop|bg/.test(t.id));
  const cat = base ? base.cat : (TOOLS[0] && TOOLS[0].cat) || 'office', icat = img ? img.cat : cat;
  if (!TOOLS.some(t => t.id === 'resume-editor')) TOOLS.push({ cat, id: 'resume-editor', ico: '✏️', name: 'Resume Editor Pro', desc: 'Upload your PDF/Word resume, change template, font & colours, edit everything, download PDF or Word', render: renderResume });
  if (!TOOLS.some(t => t.id === 'bg-remover')) TOOLS.push({ cat: icat, id: 'bg-remover', ico: '🪄', name: 'Background Remover', desc: 'Remove or change a photo background – AI for people, colour mode for plain backgrounds, brush touch-up', render: renderBg });
})();
