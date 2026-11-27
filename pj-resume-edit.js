/* ===== PJ – Upload & Edit your own resume (inside Resume Maker) =====
   DOCX / PDF → change the text, keep the original design. The file is not uploaded anywhere. */
(function () {
  if (typeof TOOLS === 'undefined') return;
  const T = TOOLS.find(t => t.id === 'resume-maker');
  if (!T || typeof T.render !== 'function') return;

  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  const PDFLIB = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
  const JSZIP = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
  const PREVIEW = 'https://cdn.jsdelivr.net/npm/docx-preview@0.3.5/dist/docx-preview.min.js';
  const escHtml = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  const loadScript = src => new Promise((ok, no) => {
    const s = document.createElement('script'); s.src = src; s.onload = ok;
    s.onerror = () => { s.remove(); no(new Error('Reader load nahi hua – internet check karein.')); };
    document.head.appendChild(s);
  });

  const save = (data, type, name) => {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([data], { type })); a.download = name;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };

  /* ---------- ZIP: untouched entries are copied byte for byte ---------- */
  const CRC = Array.from({ length: 256 }, (_, n) => { for (let k = 0; k < 8; k++) n = n & 1 ? 0xedb88320 ^ (n >>> 1) : n >>> 1; return n >>> 0; });
  const crc32 = b => { let c = ~0; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return ~c >>> 0; };
  function unzip(buf) {
    const u = new Uint8Array(buf), v = new DataView(buf); let e = u.length - 22;
    while (e >= 0 && v.getUint32(e, true) !== 0x06054b50) e--;
    if (e < 0) throw new Error('Yeh sahi .docx file nahi hai.');
    let p = v.getUint32(e + 16, true);
    return Array.from({ length: v.getUint16(e + 10, true) }, () => {
      const nl = v.getUint16(p + 28, true), off = v.getUint32(p + 42, true), size = v.getUint32(p + 20, true);
      const start = off + 30 + v.getUint16(off + 26, true) + v.getUint16(off + 28, true);
      const f = { nameBytes: u.slice(p + 46, p + 46 + nl), flag: v.getUint16(p + 8, true) & ~8, method: v.getUint16(p + 10, true), time: v.getUint32(p + 12, true), crc: v.getUint32(p + 16, true), usize: v.getUint32(p + 24, true), data: u.slice(start, start + size) };
      f.name = new TextDecoder().decode(f.nameBytes);
      p += 46 + nl + v.getUint16(p + 30, true) + v.getUint16(p + 32, true);
      return f;
    });
  }
  async function entryText(f) {
    if (f.method === 0) return new TextDecoder().decode(f.data);
    const stream = new Blob([f.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    return new Response(stream).text();
  }
  function zip(files) {
    const parts = [], central = []; let off = 0, csize = 0;
    files.forEach(f => {
      const head = (central_) => {
        const h = new Uint8Array(central_ ? 46 : 30), v = new DataView(h.buffer), o = central_ ? 2 : 0;
        v.setUint32(0, central_ ? 0x02014b50 : 0x04034b50, true);
        if (central_) v.setUint16(4, 20, true);
        v.setUint16(4 + o, 20, true); v.setUint16(6 + o, f.flag, true); v.setUint16(8 + o, f.method, true);
        v.setUint32(10 + o, f.time, true); v.setUint32(14 + o, f.crc, true); v.setUint32(18 + o, f.data.length, true);
        v.setUint32(22 + o, f.usize, true); v.setUint16(26 + o, f.nameBytes.length, true);
        if (central_) v.setUint32(42, off, true);
        return h;
      };
      const c = head(true), l = head(false);
      central.push(c, f.nameBytes); csize += c.length + f.nameBytes.length;
      parts.push(l, f.nameBytes, f.data); off += l.length + f.nameBytes.length + f.data.length;
    });
    const end = new Uint8Array(22), v = new DataView(end.buffer);
    v.setUint32(0, 0x06054b50, true); v.setUint16(8, files.length, true); v.setUint16(10, files.length, true);
    v.setUint32(12, csize, true); v.setUint32(16, off, true);
    return new Blob([...parts, ...central, end]);
  }

  /* ---------- DOCX: change only the text inside the original file ---------- */
  /* Replace only the changed part, so bold / colour of the other words stays. */
  function setText(nodes, value) {
    const old = nodes.map(n => n.textContent).join('');
    if (old === value) return;
    let a = 0, z = 0;
    while (a < old.length && a < value.length && old[a] === value[a]) a++;
    while (z < old.length - a && z < value.length - a && old[old.length - 1 - z] === value[value.length - 1 - z]) z++;
    const end = old.length - z, insert = value.slice(a, value.length - z);
    let pos = 0, done = false;
    nodes.forEach((n, i) => {
      const t = n.textContent, from = pos, to = pos + t.length; pos = to;
      const here = !done && (a < to || i === nodes.length - 1);
      if (!here && (to <= a || from >= end)) return;
      n.textContent = t.slice(0, Math.max(0, a - from)) + (here ? insert : '') + t.slice(Math.max(0, end - from));
      n.setAttribute('xml:space', 'preserve');
      if (here) done = true;
    });
  }
  /* One field = the text of a paragraph between tabs / line breaks. */
  function groupsOf(xml) {
    const groups = [];
    [...xml.getElementsByTagName('w:p')].forEach(p => {
      let g = [];
      const flush = () => { if (g.map(n => n.textContent).join('').trim()) groups.push(g); g = []; };
      [...p.getElementsByTagName('*')].forEach(n => {
        let up = n.parentNode; while (up && up.nodeName !== 'w:p') up = up.parentNode;
        if (up !== p) return;
        if (n.nodeName === 'w:t') g.push(n);
        else if ((n.nodeName === 'w:tab' && n.parentNode.nodeName === 'w:r') || n.nodeName === 'w:br') flush();
      });
      flush();
    });
    return groups;
  }
  const inFallback = n => { for (; n; n = n.parentNode) if (n.nodeName === 'mc:Fallback') return true; return false; };

  async function openDocx(buf, box) {
    const files = unzip(buf), parts = [], fields = [];
    for (const f of files.filter(x => /^word\/(document|header\d*|footer\d*)\.xml$/.test(x.name))) {
      const xml = new DOMParser().parseFromString(await entryText(f), 'application/xml');
      const all = groupsOf(xml), text = g => g.map(n => n.textContent).join('');
      const spare = all.filter(g => inFallback(g[0])), part = { f, xml, dirty: false };
      parts.push(part);
      all.filter(g => !inFallback(g[0])).forEach(g => {
        // text boxes are stored twice in Word files; update both copies
        const i = spare.findIndex(s => text(s) === text(g));
        fields.push({ part, copies: i < 0 ? [g] : [g, spare.splice(i, 1)[0]], value: text(g) });
      });
    }
    if (!fields.length) throw new Error('Is file mein text nahi mila.');

    box.innerHTML = `<p class="note">Neeche har line ka text badlein. Font, colour, layout aur photo asli file wale hi rahenge.</p>
      <div class="pe-two"><div class="pe-fields"></div><div><b>Preview (andaazan)</b><div class="pe-preview">Preview load ho raha hai…</div></div></div>
      <div class="row"><button type="button" class="btn" data-down>⬇ Word (.docx) download – same design</button></div>
      <p class="note">PDF chahiye to download ki hui file Word ya Google Docs mein kholkar “Save as PDF” karein.</p>`;
    const list = box.querySelector('.pe-fields'), view = box.querySelector('.pe-preview');
    const build = () => {
      const out = files.map(f => {
        const part = parts.find(p => p.f === f && p.dirty);
        if (!part) return f;
        const data = new TextEncoder().encode(new XMLSerializer().serializeToString(part.xml));
        return Object.assign({}, f, { method: 0, data, usize: data.length, crc: crc32(data) });
      });
      return zip(out);
    };
    const preview = async () => {
      try {
        if (!window.JSZip) await loadScript(JSZIP);
        if (!window.docx || !window.docx.renderAsync) await loadScript(PREVIEW);
        const next = document.createElement('div');
        await window.docx.renderAsync(build(), next);
        next.querySelectorAll('a[href]').forEach(a => { if (!/^(https?:|mailto:|tel:|#)/i.test(a.getAttribute('href'))) a.removeAttribute('href'); });
        view.replaceChildren(next);
      } catch (e) { view.textContent = 'Preview nahi ban paya, lekin editing aur download chalega.'; }
    };
    let timer;
    fields.forEach(fd => {
      const t = document.createElement('textarea');
      t.rows = Math.max(1, Math.ceil(fd.value.length / 45)); t.value = fd.value;
      t.oninput = () => {
        const value = t.value.replace(/\n/g, ' ');
        fd.copies.forEach(g => setText(g, value)); fd.part.dirty = true;
        clearTimeout(timer); timer = setTimeout(preview, 700);
      };
      list.appendChild(t);
    });
    box.querySelector('[data-down]').onclick = () => save(build(), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'my-resume.docx');
    preview();
  }

  /* ---------- PDF: keep the original pages, redraw only the edited lines ---------- */
  async function openPdf(buf, box) {
    if (!window.pdfjsLib) await loadScript(PDFJS + 'pdf.min.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
    const original = buf.slice(0);
    // isEvalSupported:false blocks script execution from a malicious PDF in this pdf.js version
    const doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise;
    box.innerHTML = `<p class="note">Page par jis line ko badalna hai us par click karein. Baaki design waisa hi rahega.</p><div data-pages></div>
      <label class="note"><input type="checkbox" data-flat style="width:auto"> Purana text file se poori tarah hatayein (PDF photo jaisi banegi, job portal/ATS use padh nahi payega)</label>
      <div class="row"><button type="button" class="btn" data-down>⬇ PDF download – same design</button></div>
      <p class="note">Badli hui line ka font milta-julta hoga, hubahu nahi. Dhyan dein: badli hui line photo ki tarah judti hai. Upar wala box tick na karne par job portal/ATS abhi bhi PURANA text padhega. Job apply karne ke liye Word file se edit karna behtar hai.</p>`;
    const holder = box.querySelector('[data-pages]'), pages = [], S = 2;
    let count = 0;

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i), vp = page.getViewport({ scale: S });
      const canvas = document.createElement('canvas'); canvas.width = vp.width; canvas.height = vp.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      const base = document.createElement('canvas'); base.width = canvas.width; base.height = canvas.height;
      base.getContext('2d').drawImage(canvas, 0, 0);
      const wrap = document.createElement('div'); wrap.className = 'pe-page'; wrap.appendChild(canvas); holder.appendChild(wrap);
      const info = { canvas, base, lines: [] }; pages.push(info);

      const tc = await page.getTextContent(), segs = [];
      const items = tc.items.filter(x => x.str && x.str.trim()).map(x => {
        const m = window.pdfjsLib.Util.transform(vp.transform, x.transform);
        return { s: x.str, x: m[4], y: m[5], w: x.width * S, h: Math.hypot(m[2], m[3]), font: x.fontName, flat: Math.abs(m[1]) < 0.01 };
      }).filter(x => x.flat).sort((a, b) => a.y - b.y || a.x - b.x);
      const rows = [];
      items.forEach(it => { const r = rows[rows.length - 1]; if (r && Math.abs(r[0].y - it.y) < 4) r.push(it); else rows.push([it]); });
      rows.forEach(r => {
        let g = null;
        r.sort((a, b) => a.x - b.x).forEach(it => {
          const gap = g ? it.x - (g.x + g.w) : 0;
          // a wide gap or a different size / font means another column or style
          if (g && gap < it.h * 1.2 && it.font === g.font && Math.abs(it.h - g.h) < 1) {
            g.s += (gap > it.h * 0.15 && !/\s$/.test(g.s) ? ' ' : '') + it.s; g.w = it.x + it.w - g.x;
          } else { g = Object.assign({}, it); segs.push(g); }
        });
      });

      segs.forEach(g => {
        const x = Math.max(0, Math.floor(g.x - 2)), y = Math.max(0, Math.floor(g.y - g.h)), w = Math.ceil(g.w + 4), h = Math.ceil(g.h * 1.3);
        const px = ctx.getImageData(x, y, w, h).data, bg = [px[0], px[1], px[2]];
        let fg = bg, far = 0;
        for (let k = 0; k < px.length; k += 4) {
          const d = Math.abs(px[k] - bg[0]) + Math.abs(px[k + 1] - bg[1]) + Math.abs(px[k + 2] - bg[2]);
          if (d > far) { far = d; fg = [px[k], px[k + 1], px[k + 2]]; }
        }
        let real = '';
        try { real = page.commonObjs.get(g.font).name || ''; } catch (e) { /* font name not available */ }
        const family = ((tc.styles[g.font] || {}).fontFamily) === 'serif' ? 'Georgia, serif' : 'Arial, Helvetica, sans-serif';
        const line = { x, y, w, h, tx: g.x, ty: g.y, size: g.h, old: g.s, value: g.s, bg: `rgb(${bg})`, fg: `rgb(${fg})`,
          font: `${/italic|oblique/i.test(real) ? 'italic ' : ''}${/bold|black|semi/i.test(real) ? 'bold ' : ''}${g.h}px ${family}` };
        info.lines.push(line);

        const hit = document.createElement('button');
        hit.type = 'button'; hit.className = 'pe-hit'; hit.title = 'Badalne ke liye click karein'; hit.setAttribute('aria-label', g.s);
        Object.assign(hit.style, { left: x / canvas.width * 100 + '%', top: y / canvas.height * 100 + '%', width: w / canvas.width * 100 + '%', height: h / canvas.height * 100 + '%' });
        hit.onclick = () => {
          const value = prompt('Naya text likhein:', line.value);
          if (value === null) return;
          count += (value !== line.old) - (line.value !== line.old);
          line.value = value; redraw(info);
        };
        wrap.appendChild(hit);
      });
    }
    if (!pages.some(p => p.lines.length)) throw new Error('Is PDF mein text nahi mila (shayad scan/photo wali hai). Iski Word file upload karein.');

    function redraw(info) {
      const c = info.canvas.getContext('2d');
      c.drawImage(info.base, 0, 0);
      info.lines.filter(l => l.value !== l.old).forEach(l => paintLine(c, l));
    }
    function paintLine(c, l) {
      c.fillStyle = l.bg; c.fillRect(l.x, l.y, l.w, l.h);
      c.font = l.font; c.fillStyle = l.fg; c.textBaseline = 'alphabetic';
      const room = c.canvas.width - l.tx - 4;
      c.fillText(l.value, l.tx, l.ty, Math.min(room, Math.max(l.w * 1.15, c.measureText(l.old).width * 1.15)));
    }

    box.querySelector('[data-down]').onclick = async function () {
      const flat = box.querySelector('[data-flat]').checked;
      if (!count && !flat) return save(original, 'application/pdf', 'my-resume.pdf');
      this.disabled = true;
      try {
        if (!window.PDFLib) await loadScript(PDFLIB);
        const src = await window.PDFLib.PDFDocument.load(original);
        const out = flat ? await window.PDFLib.PDFDocument.create() : src;
        for (let i = 0; i < pages.length; i++) {
          const info = pages[i], page = await doc.getPage(i + 1), vp = page.getViewport({ scale: S });
          if (flat) {
            const img = await out.embedJpg(info.canvas.toDataURL('image/jpeg', 0.95));
            const w = vp.width / S, h = vp.height / S;
            out.addPage([w, h]).drawImage(img, { x: 0, y: 0, width: w, height: h });
            continue;
          }
          // each edited line is placed as a small sharp image (works for ₹ and Hindi too)
          for (const l of info.lines.filter(x => x.value !== x.old)) {
            const c = document.createElement('canvas').getContext('2d');
            c.font = l.font;
            const width = Math.ceil(Math.min(info.canvas.width - l.x, Math.max(l.w, c.measureText(l.value).width + 6)));
            c.canvas.width = width * 2; c.canvas.height = l.h * 2;
            c.scale(2, 2); c.translate(-l.x, -l.y);
            c.drawImage(info.canvas, 0, 0);
            const img = await out.embedPng(c.canvas.toDataURL('image/png'));
            const [x0, y0] = vp.convertToPdfPoint(l.x, l.y + l.h);
            out.getPage(i).drawImage(img, { x: x0, y: y0, width: width / S, height: l.h / S, rotate: window.PDFLib.degrees(page.rotate) });
          }
        }
        save(await out.save(), 'application/pdf', 'my-resume.pdf');
      } catch (e) { alert('PDF nahi ban payi: ' + e.message); }
      this.disabled = false;
    };
  }

  const css = document.createElement('style');
  css.textContent = `
  .pe-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;margin-top:12px}
  .pe-fields,.pe-preview{max-height:70vh;overflow:auto}
  .pe-fields textarea{margin-bottom:6px}
  .pe-preview{border:1px solid #cbd5e1;border-radius:10px;background:#f1f5f9}
  .pe-page{position:relative;max-width:850px;margin:12px auto;box-shadow:0 4px 18px #0f172a22}
  .pe-page canvas{width:100%;display:block}
  .pe-hit{position:absolute;border:1px dashed transparent;background:transparent;cursor:text;padding:0}
  .pe-hit:hover,.pe-hit:focus-visible{border-color:#2563eb;background:#2563eb1a}`;
  document.head.appendChild(css);

  function editor(el) {
    el.innerHTML = `<div class="card"><h3>📤 Apna resume upload karein – design wahi rahega</h3>
        <input type="file" data-file accept=".pdf,.docx">
        <p class="note" data-status role="status">DOCX ya PDF (10 MB tak). Sabse sahi result Word (.docx) file se aata hai. Page band karne se pehle download kar lein, changes save nahi rehte.</p></div>
      <div class="card" data-work hidden></div>`;
    const file = el.querySelector('[data-file]'), status = el.querySelector('[data-status]'), work = el.querySelector('[data-work]');
    try { localStorage.removeItem('pj-resume-edit-draft'); } catch (e) { /* blocked */ }
    file.onchange = async () => {
      const f = file.files[0]; if (!f) return;
      if (!work.hidden && !confirm('Maujooda changes hata kar nayi file kholein?')) { file.value = ''; return; }
      status.textContent = '⏳ File khul rahi hai…'; work.hidden = true; file.disabled = true;
      try {
        if (f.size > 10 * 1024 * 1024) throw new Error('File 10 MB se chhoti honi chahiye.');
        const ext = f.name.split('.').pop().toLowerCase();
        if (ext !== 'pdf' && ext !== 'docx') throw new Error('Sirf PDF ya DOCX file chunein.');
        const buf = await f.arrayBuffer(), box = document.createElement('div');
        work.replaceChildren(box);
        await (ext === 'pdf' ? openPdf : openDocx)(buf, box);
        work.hidden = false; status.textContent = '✅ File khul gayi.';
      } catch (e) { status.textContent = '❌ ' + (e.message || 'File nahi khul payi'); }
      file.value = ''; file.disabled = false;
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
