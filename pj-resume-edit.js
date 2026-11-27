/* ===== PJ – Upload & Edit your own resume (inside Resume Maker) =====
   PDF / DOCX / TXT → editable page → Word (.doc) or PDF. The file is not uploaded anywhere. */
(function () {
  if (typeof TOOLS === 'undefined') return;
  const T = TOOLS.find(t => t.id === 'resume-maker');
  if (!T || typeof T.render !== 'function') return;

  const KEY = 'pj-resume-edit-draft';
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  const MAMMOTH = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.13.0/mammoth.browser.min.js';
  const escHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const loadScript = src => new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = src; s.onload = ok;
    s.onerror = () => { s.remove(); no(new Error('Reader load nahi hua – internet check karein.')); };
    document.head.appendChild(s);
  });

  /* Keep only simple formatting tags (uploaded files and pasted text are untrusted). */
  const ALLOWED = new Set('H1 H2 H3 H4 P DIV BR UL OL LI B STRONG I EM U A TABLE THEAD TBODY TR TD TH IMG SPAN SUP SUB HR'.split(' '));
  function clean(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    doc.querySelectorAll('script,style,iframe,object,embed,link,meta,svg,math,form,template,noscript').forEach(n => n.remove());
    [...doc.body.querySelectorAll('*')].reverse().forEach(n => {
      if (!ALLOWED.has(n.tagName)) { n.replaceWith(...n.childNodes); return; }
      [...n.attributes].forEach(a => {
        const name = a.name.toLowerCase(), v = a.value.trim();
        const ok = (n.tagName === 'A' && name === 'href' && /^(https?:|mailto:|tel:)/i.test(v)) ||
          (n.tagName === 'IMG' && name === 'src' && /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(v)) ||
          ((name === 'colspan' || name === 'rowspan') && /^\d+$/.test(v));
        if (!ok) n.removeAttribute(a.name);
      });
    });
    return doc.body.innerHTML;
  }

  /* ---------- text lines → headings, paragraphs, bullet lists ---------- */
  const BULLET = /^\s*([•●▪■◦·\-–—*➢➤✓]|\d{1,2}[.)])\s+/;
  const HEAD = /^(professional |career |work |technical |key |core )?(summary|profile|objective|experience|employment|education|qualifications?|skills|projects?|certifications?|achievements?|awards|languages?|declaration|internships?|personal details)\s*:?$/i;
  function linesToHtml(lines) {
    let out = '', inList = false, first = true;
    const close = () => { if (inList) { out += '</ul>'; inList = false; } };
    lines.forEach(({ t, big }) => {
      const text = t.trim();
      if (!text) { close(); return; }
      if (BULLET.test(text)) {
        if (!inList) { out += '<ul>'; inList = true; }
        out += `<li>${escHtml(text.replace(BULLET, ''))}</li>`;
      } else {
        close();
        const caps = text.length <= 40 && /[A-Z]{3}/.test(text) && text === text.toUpperCase() && !/[@\d]/.test(text);
        const tag = first ? 'h1' : (HEAD.test(text) || caps || (big && text.length <= 60)) ? 'h2' : 'p';
        out += `<${tag}>${escHtml(text)}</${tag}>`;
      }
      first = false;
    });
    close();
    return out;
  }

  async function pdfToHtml(buf) {
    if (!window.pdfjsLib) await loadScript(PDFJS + 'pdf.min.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
    // isEvalSupported:false blocks script execution from a malicious PDF in this pdf.js version
    const doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise;
    const rows = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const tc = await (await doc.getPage(i)).getTextContent();
      const items = tc.items.filter(x => x.str && x.str.trim())
        .map(x => ({ s: x.str, x: x.transform[4], y: x.transform[5], w: x.width, h: Math.abs(x.transform[3]) || x.height }))
        .sort((a, b) => b.y - a.y || a.x - b.x);
      const page = [];
      items.forEach(it => {
        const r = page[page.length - 1];
        if (r && Math.abs(r.y - it.y) < 3) r.items.push(it); else page.push({ y: it.y, items: [it] });
      });
      page.forEach(r => {
        r.items.sort((a, b) => a.x - b.x);
        let t = '', end = null;
        r.items.forEach(it => {
          if (end !== null && it.x - end > it.h * 0.15 && !/\s$/.test(t) && !/^\s/.test(it.s)) t += ' ';
          t += it.s; end = it.x + it.w;
        });
        rows.push({ t, h: Math.max(...r.items.map(x => x.h)), x: r.items[0].x });
      });
    }
    const sizes = rows.map(r => r.h).sort((a, b) => a - b), mid = sizes[Math.floor(sizes.length / 2)] || 10;
    const merged = [];
    rows.forEach(r => {
      const prev = merged[merged.length - 1];
      // an indented line under a bullet is the rest of that bullet
      if (prev && BULLET.test(prev.t) && !BULLET.test(r.t) && r.x > prev.x + 4) prev.t += ' ' + r.t.trim();
      else merged.push({ t: r.t, x: r.x, big: r.h > mid * 1.18 });
    });
    return linesToHtml(merged);
  }

  async function fileToHtml(file) {
    if (file.size > 10 * 1024 * 1024) throw new Error('File 10 MB se chhoti honi chahiye.');
    const ext = file.name.split('.').pop().toLowerCase(), buf = await file.arrayBuffer();
    if (ext === 'docx') {
      if (!window.mammoth) await loadScript(MAMMOTH);
      return (await window.mammoth.convertToHtml({ arrayBuffer: buf })).value;
    }
    if (ext === 'pdf') return pdfToHtml(buf);
    if (ext === 'txt') return linesToHtml(new TextDecoder().decode(buf).split(/\r?\n/).map(t => ({ t })));
    throw new Error('Sirf PDF, DOCX ya TXT file chunein (purani .doc file ko pehle DOCX mein save karein).');
  }

  /* ---------- export ---------- */
  const docCss = (color, size, font) => `
    body{font-family:${font};font-size:${size}pt;line-height:1.4;color:#111;margin:0}
    h1{font-size:${size * 2}pt;margin:0 0 4pt;color:${color}}
    h2{font-size:${size * 1.15}pt;margin:12pt 0 5pt;color:${color};border-bottom:1.5pt solid ${color};text-transform:uppercase}
    h3,h4{font-size:${size * 1.05}pt;margin:8pt 0 3pt}
    p{margin:0 0 3pt} ul,ol{margin:2pt 0 6pt;padding-left:18pt} li{margin:0 0 2pt}
    table{width:100%;border-collapse:collapse} td,th{vertical-align:top;padding:2pt 4pt;text-align:left}
    img{max-width:140px;height:auto} a{color:${color}}`;
  const fullDoc = (body, css, title) => `<!doctype html><html><head><meta charset="utf-8"><title>${escHtml(title)}</title><style>@page{size:A4;margin:14mm}${css}</style></head><body>${body}</body></html>`;

  const css = document.createElement('style');
  css.textContent = `
  .pe-bar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;position:sticky;top:64px;background:#fff;padding:8px 0;z-index:5}
  .pe-bar select,.pe-bar input[type=color]{width:auto}
  .pe-bar input[type=color]{width:48px;padding:2px}
  .pe-paper{max-width:794px;min-height:600px;margin:12px auto;background:#fff;border:1px solid #cbd5e1;box-shadow:0 8px 24px #0f172a14;padding:40px;overflow-wrap:anywhere;outline:none}
  .pe-paper:focus{border-color:#2563eb}
  @media(max-width:600px){.pe-paper{padding:18px}.pe-bar{position:static}}`;
  document.head.appendChild(css);

  function editor(el) {
    el.innerHTML = `
      <div class="card noprint">
        <h3>📤 Apna purana resume upload karein</h3>
        <input type="file" data-file accept=".pdf,.docx,.txt">
        <p class="note" data-status role="status">Word (.docx) file se formatting sabse achhi aati hai. PDF ka text edit ho sakta hai, lekin uska design, photo aur columns waise nahi rahenge. Scan/photo wali PDF nahi chalegi.</p>
      </div>
      <div class="card" data-work hidden>
        <div class="pe-bar">
          <button type="button" class="btn ghost sm" data-cmd="bold"><b>B</b></button>
          <button type="button" class="btn ghost sm" data-cmd="italic"><i>I</i></button>
          <button type="button" class="btn ghost sm" data-cmd="underline"><u>U</u></button>
          <button type="button" class="btn ghost sm" data-cmd="formatBlock" data-val="H2">Heading</button>
          <button type="button" class="btn ghost sm" data-cmd="formatBlock" data-val="P">Normal</button>
          <button type="button" class="btn ghost sm" data-cmd="insertUnorderedList">• List</button>
          <button type="button" class="btn ghost sm" data-cmd="undo" title="Undo">↶</button>
          <button type="button" class="btn ghost sm" data-cmd="redo" title="Redo">↷</button>
          <select data-font title="Font">
            <option value="Calibri, Arial, sans-serif">Calibri</option>
            <option value="Arial, Helvetica, sans-serif">Arial</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', serif">Times New Roman</option>
          </select>
          <select data-size title="Text size"><option>10</option><option selected>11</option><option>12</option></select>
          <input type="color" data-color value="#1d4ed8" title="Heading colour">
        </div>
        <style data-style></style>
        <div class="pe-paper" data-paper contenteditable="true" spellcheck="true" aria-label="Resume editor"></div>
        <div class="row">
          <button type="button" class="btn" data-pdf>🖨️ PDF save karein</button>
          <button type="button" class="btn ghost" data-word>⬇ Word (.doc)</button>
          <button type="button" class="btn red" data-clear>🗑️ Saaf karein</button>
        </div>
        <p class="note">Draft isi browser mein save hota hai. Shared computer par kaam ke baad “Saaf karein” dabayein. PDF ke liye print window mein “Save as PDF” chunein.</p>
      </div>`;

    const q = s => el.querySelector(s);
    const file = q('[data-file]'), status = q('[data-status]'), work = q('[data-work]'), paper = q('[data-paper]'),
      styleTag = q('[data-style]'), font = q('[data-font]'), size = q('[data-size]'), color = q('[data-color]');

    const currentCss = () => docCss(color.value, Number(size.value), font.value);
    const restyle = () => {
      // same rules as the export, limited to the editor page
      styleTag.textContent = currentCss().replace(/(^|\})\s*([^{}]+)\{/g, (m, end, sel) =>
        end + sel.split(',').map(s => s.trim() === 'body' ? '.pe-paper' : '.pe-paper ' + s.trim()).join(',') + '{');
    };
    const store = () => {
      try { localStorage.setItem(KEY, JSON.stringify({ html: paper.innerHTML, font: font.value, size: size.value, color: color.value })); } catch (e) { /* storage full or blocked */ }
    };
    const show = html => { paper.innerHTML = clean(html); work.hidden = false; restyle(); };

    try {
      const d = JSON.parse(localStorage.getItem(KEY));
      if (d && d.html) { font.value = d.font; size.value = d.size; color.value = d.color; show(d.html); status.textContent = '📝 Aapka pichhla draft wapas khul gaya hai.'; }
    } catch (e) { /* no draft */ }

    file.onchange = async () => {
      const f = file.files[0]; if (!f) return;
      if (!work.hidden && !confirm('Maujooda draft hata kar nayi file kholein?')) { file.value = ''; return; }
      status.textContent = '⏳ File padh rahe hain…';
      try {
        const html = await fileToHtml(f);
        const probe = document.createElement('div'); probe.innerHTML = clean(html);
        if (probe.textContent.trim().length < 40) throw new Error('Is file mein text nahi mila (shayad scan ki hui hai).');
        show(html); store();
        status.textContent = '✅ File khul gayi. Neeche kahin bhi click karke badlein, phir poora resume ek baar check karein.';
      } catch (e) { status.textContent = '❌ ' + (e.message || 'File nahi khul payi'); }
      file.value = '';
    };

    el.querySelectorAll('[data-cmd]').forEach(b => {
      b.onmousedown = e => e.preventDefault(); // keep the text selection
      b.onclick = () => { paper.focus(); document.execCommand(b.dataset.cmd, false, b.dataset.val || null); store(); };
    });
    [font, size, color].forEach(c => c.oninput = () => { restyle(); store(); });
    paper.oninput = store;
    paper.onpaste = e => { // paste as plain text so outside styling does not break the layout
      e.preventDefault();
      document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
    };
    paper.ondrop = e => e.preventDefault();

    q('[data-word]').onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob(['\ufeff', fullDoc(clean(paper.innerHTML), currentCss(), 'Resume')], { type: 'application/msword' }));
      a.download = 'my-resume.doc'; document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 2000);
    };
    q('[data-pdf]').onclick = () => {
      const frame = document.createElement('iframe');
      frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
      frame.onload = () => {
        const w = frame.contentWindow;
        w.onafterprint = () => frame.remove();
        w.focus(); w.print();
      };
      frame.srcdoc = fullDoc(clean(paper.innerHTML), currentCss(), 'Resume');
      document.body.appendChild(frame);
      setTimeout(() => frame.remove(), 120000);
    };
    q('[data-clear]').onclick = () => {
      if (!confirm('Draft hamesha ke liye hata dein?')) return;
      try { localStorage.removeItem(KEY); } catch (e) { /* blocked */ }
      paper.innerHTML = ''; work.hidden = true; status.textContent = 'Draft hata diya gaya.';
    };
  }

  /* Add two tabs to Resume Maker: the original maker stays exactly as it was. */
  const original = T.render;
  T.render = function (el) {
    el.innerHTML = `<div class="tabs noprint">
        <button type="button" class="tab on" data-t="new">✍️ Naya resume banayein</button>
        <button type="button" class="tab" data-t="old">📤 Apna resume upload karke edit karein</button>
      </div><div data-p="new"></div><div data-p="old" hidden></div>`;
    const panes = { new: el.querySelector('[data-p="new"]'), old: el.querySelector('[data-p="old"]') };
    const tabs = el.querySelectorAll('[data-t]');
    tabs.forEach(b => b.onclick = () => {
      tabs.forEach(x => x.classList.toggle('on', x === b));
      Object.entries(panes).forEach(([k, p]) => { p.hidden = k !== b.dataset.t; });
    });
    const result = original.call(this, panes.new);
    editor(panes.old);
    return result;
  };
})();
