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

    box.innerHTML = `<div class="pe-two"><div><div class="pe-fields"></div></div><div><b>Preview (andaazan)</b><div class="pe-preview">Preview load ho raha hai…</div></div></div>
      <div data-photos></div>
      <div class="row"><button type="button" class="btn" data-down>⬇ Word (.docx) download</button></div>`;
    const replaced = new Map();
    const list = box.querySelector('.pe-fields'), view = box.querySelector('.pe-preview');
    const build = () => {
      const out = files.map(f => {
        const part = parts.find(p => p.f === f && p.dirty);
        const data = replaced.get(f) || (part && new TextEncoder().encode(new XMLSerializer().serializeToString(part.xml)));
        return data ? Object.assign({}, f, { method: 0, data, usize: data.length, crc: crc32(data) }) : f;
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
    const later = () => { clearTimeout(timer); timer = setTimeout(preview, 700); };
    const paraOf = n => { while (n.nodeName !== 'w:p') n = n.parentNode; return n; };
    const drawFields = () => {
      list.replaceChildren();
      // show lines in their current order in the document
      fields.sort((a, b) => parts.indexOf(a.part) - parts.indexOf(b.part) || (a.copies[0][0].compareDocumentPosition(b.copies[0][0]) & 4 ? -1 : 1));
      fields.forEach(fd => {
        const row = document.createElement('div'); row.className = 'pe-line';
        const t = document.createElement('textarea');
        const value = () => fd.copies[0].map(n => n.textContent).join('');
        t.rows = Math.max(1, Math.ceil(value().length / 40)); t.value = value();
        t.oninput = () => { fd.copies.forEach(g => setText(g, t.value.replace(/\n/g, ' '))); fd.part.dirty = true; later(); };
        row.appendChild(t);
        [['↑', 'Upar', -1], ['↓', 'Neeche', 1], ['✕', 'Hatayein', 0]].forEach(([label, title, dir]) => {
          const b = document.createElement('button'); b.type = 'button'; b.textContent = label; b.title = title;
          b.onclick = () => {
            if (!dir) { fd.copies.forEach(g => setText(g, '')); fd.part.dirty = true; fields.splice(fields.indexOf(fd), 1); }
            else fd.copies.forEach(g => {
              const p = paraOf(g[0]), other = dir < 0 ? p.previousElementSibling : p.nextElementSibling;
              if (!other || other.nodeName === 'w:sectPr') return;
              p.parentNode.insertBefore(p, dir < 0 ? other : other.nextSibling); fd.part.dirty = true;
            });
            drawFields(); later();
          };
          row.appendChild(b);
        });
        list.appendChild(row);
      });
    };
    drawFields();

    files.filter(f => /^word\/media\/.+\.(png|jpe?g)$/i.test(f.name)).forEach(f => {
      const label = document.createElement('label'); label.className = 'note';
      label.textContent = '🖼️ Photo badlein (' + f.name.split('/').pop() + '): ';
      const input = document.createElement('input'); input.type = 'file'; input.accept = 'image/png,image/jpeg,image/webp';
      input.onchange = async () => {
        if (!input.files[0]) return;
        try {
          const type = /png$/i.test(f.name) ? 'image/png' : 'image/jpeg';
          const raw = f.method === 0 ? new Blob([f.data]) : await new Response(new Blob([f.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).blob();
          const old = await createImageBitmap(raw), next = await createImageBitmap(input.files[0]);
          const c = document.createElement('canvas'); c.width = old.width; c.height = old.height;
          const k = Math.max(c.width / next.width, c.height / next.height);
          c.getContext('2d').drawImage(next, (c.width - next.width * k) / 2, (c.height - next.height * k) / 2, next.width * k, next.height * k);
          const blob = await new Promise(ok => c.toBlob(ok, type, 0.95));
          replaced.set(f, new Uint8Array(await blob.arrayBuffer())); later();
        } catch (e) { alert('Yeh photo nahi badal payi.'); }
      };
      label.appendChild(input); box.querySelector('[data-photos]').appendChild(label);
    });
    box.querySelector('[data-down]').onclick = () => save(build(), 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'my-resume.docx');
    preview();
  }

  /* ---------- PDF: every text line and photo is an object that can be edited and moved ----------
     Untouched parts keep their original pixels. */
  async function openPdf(buf, box) {
    if (!window.pdfjsLib) await loadScript(PDFJS + 'pdf.min.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
    const original = buf.slice(0);
    // isEvalSupported:false blocks script execution from a malicious PDF in this pdf.js version
    const doc = await window.pdfjsLib.getDocument({ data: new Uint8Array(buf), isEvalSupported: false }).promise;
    box.innerHTML = `<div class="pe-tools">
        <input type="text" data-text placeholder="Text ya photo chunein" disabled aria-label="Chuna hua text">
        <div class="pe-btns">
          <button type="button" data-a="left" title="Left">←</button><button type="button" data-a="up" title="Upar">↑</button>
          <button type="button" data-a="down" title="Neeche">↓</button><button type="button" data-a="right" title="Right">→</button>
          <button type="button" data-a="smaller" title="Chhota">−</button><button type="button" data-a="bigger" title="Bada">+</button>
          <button type="button" data-a="bold" title="Bold"><b>B</b></button><input type="color" data-color title="Text colour">
          <button type="button" data-a="photo">🖼️ Photo badlein</button><button type="button" data-a="delete">🗑️ Hatayein</button>
          <button type="button" data-a="reset">↺ Wapas</button>
          <button type="button" data-a="addtext">＋ Text</button><button type="button" data-a="addphoto">＋ Photo</button>
        </div></div>
      <div data-pages></div><input type="file" data-img accept="image/png,image/jpeg,image/webp" hidden>
      <div class="row"><button type="button" class="btn" data-down>⬇ PDF download</button></div>`;
    const q = s => box.querySelector(s);
    const textBox = q('[data-text]'), colorBox = q('[data-color]'), imgInput = q('[data-img]'), holder = q('[data-pages]');
    const pages = [], S = 2.5;
    let sel = null, active = null, imgMode = '';

    const make = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };

    /* Render a page; hide = 'text' or 'image' leaves that kind out. Also records where images are. */
    async function renderPage(page, vp, hide, images) {
      const c = make(vp.width, vp.height), ctx = c.getContext('2d', { willReadFrequently: true });
      const draw = ctx.drawImage;
      if (hide === 'text') ctx.fillText = ctx.strokeText = () => {};
      ctx.drawImage = function (...a) {
        if (images) {
          const m = this.getTransform(), n = a.length;
          const [dx, dy, dw, dh] = n === 9 ? a.slice(5) : n === 5 ? a.slice(1) : [a[1], a[2], a[0].width, a[0].height];
          const pts = [[dx, dy], [dx + dw, dy], [dx, dy + dh], [dx + dw, dy + dh]].map(([x, y]) => m.transformPoint({ x, y }));
          images.push([Math.min(...pts.map(p => p.x)), Math.min(...pts.map(p => p.y)), Math.max(...pts.map(p => p.x)), Math.max(...pts.map(p => p.y))]);
        }
        if (hide !== 'image') draw.apply(this, a);
      };
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      return c;
    }

    /* Cut one object out of the page: the pixels that differ from the page without it. */
    function cutOut(full, without, x, y, w, h, solid) {
      const sprite = make(w, h), sc = sprite.getContext('2d');
      const A = full.getContext('2d').getImageData(x, y, w, h), B = without.getContext('2d').getImageData(x, y, w, h).data, d = A.data;
      const far = i => Math.abs(d[i] - B[i]) + Math.abs(d[i + 1] - B[i + 1]) + Math.abs(d[i + 2] - B[i + 2]);
      let fg = null, best = 12;
      for (let row = 0; row < h; row++) {
        let first = -1, last = -1;
        for (let col = 0; col < w; col++) {
          const i = (row * w + col) * 4, f = far(i);
          if (f > best) { best = f; fg = [d[i], d[i + 1], d[i + 2]]; }
          if (f > 12) { if (first < 0) first = col; last = col; }
        }
        for (let col = 0; col < w; col++) {
          const i = (row * w + col) * 4;
          // a photo is filled edge to edge in each row, so dark clothes do not become holes
          const keep = solid ? col >= first && col <= last && first >= 0 : far(i) > 12;
          if (!keep) d[i + 3] = 0;
        }
      }
      sc.putImageData(A, 0, 0);
      return { sprite, fg };
    }

    const fontOf = o => `${o.italic ? 'italic ' : ''}${o.bold ? 'bold ' : ''}${o.size}px ${o.family}`;
    const measure = make(1, 1).getContext('2d');
    const redrawn = o => o.type === 'text' && (o.added || o.value !== o.first.value || o.bold !== o.first.bold || o.color !== o.first.color);
    const changed = o => o.added || o.deleted || o.x !== o.first.x || o.y !== o.first.y || o.scale !== 1 || o.src !== o.first.src || redrawn(o);
    function size(o) {
      if (o.type === 'text' && redrawn(o)) { measure.font = fontOf(o); return [(measure.measureText(o.value).width + 4) * o.scale, o.size * 1.15 * o.scale]; }
      return [o.w * o.scale, o.h * o.scale];
    }
    function compose(info) {
      const c = info.canvas.getContext('2d');
      c.drawImage(info.full, 0, 0);
      const moved = info.objects.filter(changed);
      moved.filter(o => !o.added).forEach(o => {
        const from = o.type === 'text' ? info.noText : info.noImage;
        c.drawImage(from, o.first.x, o.first.y, o.w, o.h, o.first.x, o.first.y, o.w, o.h);
      });
      moved.filter(o => !o.deleted).sort((a, b) => (a.type === 'text') - (b.type === 'text')).forEach(o => {
        const [w, h] = size(o);
        if (!redrawn(o)) { c.drawImage(o.src, o.x, o.y, w, h); return; }
        c.save(); c.translate(o.x, o.y); c.scale(o.scale, o.scale);
        c.font = fontOf(o); c.fillStyle = o.color; c.textBaseline = 'alphabetic';
        c.fillText(o.value, 2, o.size * 0.88); c.restore();
      });
    }
    function place(info, o) {
      const [w, h] = size(o), W = info.canvas.width, H = info.canvas.height;
      Object.assign(o.el.style, { left: o.x / W * 100 + '%', top: o.y / H * 100 + '%', width: w / W * 100 + '%', height: h / H * 100 + '%' });
      o.el.hidden = !!o.deleted;
    }
    const refresh = () => { if (!sel) return; compose(sel.info); place(sel.info, sel.o); };
    function select(info, o) {
      if (sel) sel.o.el.classList.remove('on');
      sel = o ? { info, o } : null;
      const isText = !!o && o.type === 'text';
      textBox.disabled = colorBox.disabled = !isText;
      textBox.value = isText ? o.value : '';
      if (isText) colorBox.value = o.color;
      if (o) { o.el.classList.add('on'); active = info; }
    }
    function move(dx, dy) {
      const { info, o } = sel, [w, h] = size(o);
      o.x = Math.max(0, Math.min(info.canvas.width - Math.min(w, 20), o.x + dx));
      o.y = Math.max(0, Math.min(info.canvas.height - Math.min(h, 20), o.y + dy));
      refresh();
    }
    function addObject(info, o) {
      o.scale = 1; o.src = o.src || null;
      o.first = { x: o.x, y: o.y, value: o.value, bold: o.bold, color: o.color, src: o.src };
      const el = document.createElement('div');
      el.className = 'pe-hit'; el.tabIndex = 0; el.setAttribute('aria-label', o.type === 'text' ? o.value : 'Photo');
      o.el = el; info.objects.push(o); info.wrap.appendChild(el);
      el.onfocus = () => select(info, o);
      el.onpointerdown = e => {
        e.preventDefault(); select(info, o); el.focus({ preventScroll: true }); el.setPointerCapture(e.pointerId);
        const k = info.canvas.width / info.canvas.getBoundingClientRect().width;
        let px = e.clientX, py = e.clientY, dragging = false;
        el.onpointermove = ev => {
          if (!dragging && Math.hypot(ev.clientX - px, ev.clientY - py) < 4) return;
          dragging = true; move((ev.clientX - px) * k, (ev.clientY - py) * k); px = ev.clientX; py = ev.clientY;
        };
        el.onpointerup = el.onpointercancel = () => { el.onpointermove = null; };
      };
      el.ondblclick = () => { if (o.type === 'text') textBox.focus(); };
      el.onkeydown = e => {
        const step = (e.shiftKey ? 10 : 1) * S, d = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
        if (d) { e.preventDefault(); move(...d); }
        if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); o.deleted = true; refresh(); }
      };
      place(info, o);
      return o;
    }

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i), vp = page.getViewport({ scale: S }), rects = [];
      const full = await renderPage(page, vp, '', rects);
      const noText = await renderPage(page, vp, 'text'), noImage = await renderPage(page, vp, 'image');
      const canvas = make(vp.width, vp.height); canvas.getContext('2d').drawImage(full, 0, 0);
      const wrap = document.createElement('div'); wrap.className = 'pe-page'; wrap.appendChild(canvas); holder.appendChild(wrap);
      const info = { canvas, full, noText, noImage, wrap, objects: [], page: i - 1 };
      pages.push(info); active = active || info;
      wrap.onpointerdown = e => { if (e.target === canvas) { active = info; select(info, null); } };

      rects.forEach(r => {
        const x = Math.max(0, Math.floor(r[0])), y = Math.max(0, Math.floor(r[1]));
        const w = Math.min(full.width, Math.ceil(r[2])) - x, h = Math.min(full.height, Math.ceil(r[3])) - y;
        if (w < 20 || h < 20 || w * h > full.width * full.height * 0.85) return;
        addObject(info, { type: 'image', x, y, w, h, src: cutOut(full, noImage, x, y, w, h, true).sprite });
      });

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
          // bold words stay in the same line; a wide gap or a bullet starts a new object
          if (g && gap < it.h * 0.9 && Math.abs(it.h - g.h) < 1 && !/^[•●▪]$/.test(g.s.trim())) {
            g.s += (gap > it.h * 0.15 && !/\s$/.test(g.s) ? ' ' : '') + it.s; g.w = it.x + it.w - g.x;
          } else { g = Object.assign({}, it); segs.push(g); }
        });
      });
      segs.forEach(g => {
        const x = Math.max(0, Math.floor(g.x - 2)), y = Math.max(0, Math.floor(g.y - g.h * 0.88));
        const w = Math.min(full.width - x, Math.ceil(g.w + 4)), h = Math.min(full.height - y, Math.ceil(g.h * 1.15));
        if (w < 2 || h < 2) return;
        const cut = cutOut(full, noText, x, y, w, h, false);
        if (!cut.fg) return;
        let real = '';
        try { real = page.commonObjs.get(g.font).name || ''; } catch (e) { /* font name not available */ }
        addObject(info, { type: 'text', x, y, w, h, src: cut.sprite, value: g.s, size: g.h,
          family: ((tc.styles[g.font] || {}).fontFamily) === 'serif' ? 'Georgia, serif' : 'Arial, Helvetica, sans-serif',
          bold: /bold|black|semi/i.test(real), italic: /italic|oblique/i.test(real),
          color: '#' + cut.fg.map(n => n.toString(16).padStart(2, '0')).join('') });
      });
    }
    if (!pages.some(p => p.objects.length)) throw new Error('Is PDF mein edit karne layak kuch nahi mila.');

    textBox.oninput = () => { if (sel) { sel.o.value = textBox.value; refresh(); } };
    colorBox.oninput = () => { if (sel) { sel.o.color = colorBox.value; refresh(); } };
    box.querySelectorAll('[data-a]').forEach(b => b.onclick = () => {
      const a = b.dataset.a;
      if (a === 'addtext') {
        const o = addObject(active, { type: 'text', added: true, x: active.canvas.width * 0.4, y: active.canvas.height * 0.05, w: 1, h: 1,
          value: 'Naya text', size: 11 * S, family: 'Arial, Helvetica, sans-serif', bold: false, italic: false, color: '#111111' });
        compose(active); select(active, o); textBox.focus(); textBox.select(); return;
      }
      if (a === 'addphoto') { imgMode = 'add'; imgInput.click(); return; }
      if (!sel) return alert('Pehle page par koi text ya photo chunein.');
      const o = sel.o, step = 3 * S;
      if (a === 'left') return move(-step, 0);
      if (a === 'right') return move(step, 0);
      if (a === 'up') return move(0, -step);
      if (a === 'down') return move(0, step);
      if (a === 'photo') { if (o.type !== 'image') return alert('Pehle photo par click karein.'); imgMode = 'replace'; imgInput.click(); return; }
      if (a === 'smaller') o.scale = Math.max(0.3, o.scale / 1.08);
      if (a === 'bigger') o.scale = Math.min(4, o.scale * 1.08);
      if (a === 'bold' && o.type === 'text') o.bold = !o.bold;
      if (a === 'delete') o.deleted = true;
      if (a === 'reset') { Object.assign(o, o.first, { scale: 1, deleted: false }); select(sel.info, o); }
      refresh();
    });
    imgInput.onchange = async () => {
      const f = imgInput.files[0]; imgInput.value = '';
      if (!f) return;
      try {
        const bmp = await createImageBitmap(f);
        if (imgMode === 'replace' && sel) {
          const o = sel.o, c = make(o.w, o.h), x = c.getContext('2d'), k = Math.max(o.w / bmp.width, o.h / bmp.height);
          x.drawImage(bmp, (o.w - bmp.width * k) / 2, (o.h - bmp.height * k) / 2, bmp.width * k, bmp.height * k);
          x.globalCompositeOperation = 'destination-in'; x.drawImage(o.first.src || o.src, 0, 0, o.w, o.h); // same shape (round stays round)
          o.src = c; o.deleted = false; refresh();
        } else {
          const w = active.canvas.width * 0.2, h = w * bmp.height / bmp.width, c = make(w, h);
          c.getContext('2d').drawImage(bmp, 0, 0, c.width, c.height);
          const o = addObject(active, { type: 'image', added: true, x: active.canvas.width * 0.4, y: active.canvas.height * 0.1, w: c.width, h: c.height, src: c });
          compose(active); select(active, o);
        }
      } catch (e) { alert('Yeh photo nahi khul payi.'); }
    };

    q('[data-down]').onclick = async function () {
      if (!pages.some(p => p.objects.some(changed))) return save(original, 'application/pdf', 'my-resume.pdf');
      this.disabled = true;
      try {
        if (!window.PDFLib) await loadScript(PDFLIB);
        const L = window.PDFLib, src = await L.PDFDocument.load(original), out = await L.PDFDocument.create();
        const font = await out.embedFont(L.StandardFonts.Helvetica);
        for (const info of pages) {
          if (!info.objects.some(changed)) { const [copy] = await out.copyPages(src, [info.page]); out.addPage(copy); continue; }
          const W = info.canvas.width / S, H = info.canvas.height / S, pg = out.addPage([W, H]);
          pg.drawImage(await out.embedJpg(info.canvas.toDataURL('image/jpeg', 0.95)), { x: 0, y: 0, width: W, height: H });
          // invisible text over the picture, so job portals read the NEW text
          info.objects.filter(o => o.type === 'text' && !o.deleted).sort((a, b) => a.y - b.y || a.x - b.x).forEach(o => {
            const text = o.value.replace(/₹/g, 'Rs ').replace(/[^\x20-\x7e\xa0-\xff•–—‘’“”]/g, '');
            if (!text.trim()) return;
            const [w] = size(o), size1 = o.size * o.scale / S;
            const fit = Math.min(size1, size1 * (w / S) / font.widthOfTextAtSize(text, size1));
            pg.drawText(text, { x: o.x / S, y: H - (o.y + o.size * 0.88 * o.scale) / S, size: fit, font, opacity: 0 });
          });
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
  .pe-preview{border:1px solid #cbd5e1;border-radius:10px;background:#f1f5f9}
  .pe-page{position:relative;max-width:850px;margin:12px auto;box-shadow:0 4px 18px #0f172a22}
  .pe-page canvas{width:100%;display:block}
  .pe-hit{position:absolute;border:1px dashed transparent;cursor:move;touch-action:none;outline:none}
  .pe-hit:hover{border-color:#93c5fd}
  .pe-hit.on{border:1px solid #2563eb;background:#2563eb14}
  .pe-tools{position:sticky;top:64px;z-index:6;background:#fff;padding:8px 0;border-bottom:1px solid #e2e8f0}
  .pe-btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}
  .pe-btns button,.pe-line button{border:1px solid #cbd5e1;background:#fff;color:#0f172a;border-radius:8px;padding:5px 11px;cursor:pointer;font:inherit;font-size:.82rem}
  .pe-btns input[type=color]{width:44px;padding:2px}
  .pe-line{display:flex;gap:4px;align-items:flex-start;margin-bottom:6px}
  .pe-line textarea{flex:1;min-width:0}`;
  document.head.appendChild(css);

  function editor(el) {
    el.innerHTML = `<div class="card"><h3>📤 Apna resume upload karein</h3>
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
