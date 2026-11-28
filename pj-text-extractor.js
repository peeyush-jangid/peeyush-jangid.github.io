/* ===== File to Text Extractor – ADVANCED =====
   PDF / Word / PowerPoint / Images (OCR, 25 languages) -> editable text -> copy / export.
   Sab kuch browser me hota hai. Libraries tabhi load hoti hain jab tool use ho. */
(function () {
  const CDN = {
    pdf: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    pdfWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    mammoth: 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
    zip: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    ocr: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.5/dist/tesseract.min.js'
  };
  const LANGS = [['eng', 'English'], ['hin', 'हिन्दी Hindi'], ['mar', 'मराठी Marathi'], ['guj', 'ગુજરાતી Gujarati'], ['pan', 'ਪੰਜਾਬੀ Punjabi'], ['ben', 'বাংলা Bengali'], ['tam', 'தமிழ் Tamil'], ['tel', 'తెలుగు Telugu'], ['kan', 'ಕನ್ನಡ Kannada'], ['mal', 'മലയാളം Malayalam'], ['urd', 'اردو Urdu'], ['san', 'संस्कृत Sanskrit'], ['nep', 'नेपाली Nepali'], ['ara', 'العربية Arabic'], ['chi_sim', '中文 Chinese (Simp.)'], ['chi_tra', '中文 Chinese (Trad.)'], ['jpn', '日本語 Japanese'], ['kor', '한국어 Korean'], ['rus', 'Русский Russian'], ['fra', 'Français French'], ['deu', 'Deutsch German'], ['spa', 'Español Spanish'], ['por', 'Português Portuguese'], ['ita', 'Italiano Italian'], ['tha', 'ไทย Thai']];
  const SCRIPTS = [
    ['Latin / English', /[A-Za-z\u00C0-\u024F]/g, 'en-US'], ['Devanagari (Hindi/Marathi)', /[\u0900-\u097F]/g, 'hi-IN'], ['Bengali', /[\u0980-\u09FF]/g, 'bn-IN'],
    ['Gurmukhi (Punjabi)', /[\u0A00-\u0A7F]/g, 'pa-IN'], ['Gujarati', /[\u0A80-\u0AFF]/g, 'gu-IN'], ['Tamil', /[\u0B80-\u0BFF]/g, 'ta-IN'],
    ['Telugu', /[\u0C00-\u0C7F]/g, 'te-IN'], ['Kannada', /[\u0C80-\u0CFF]/g, 'kn-IN'], ['Malayalam', /[\u0D00-\u0D7F]/g, 'ml-IN'],
    ['Arabic / Urdu', /[\u0600-\u06FF]/g, 'ar-SA'], ['Cyrillic', /[\u0400-\u04FF]/g, 'ru-RU'], ['Chinese', /[\u4E00-\u9FFF]/g, 'zh-CN'],
    ['Japanese Kana', /[\u3040-\u30FF]/g, 'ja-JP'], ['Korean', /[\uAC00-\uD7AF]/g, 'ko-KR'], ['Thai', /[\u0E00-\u0E7F]/g, 'th-TH']
  ];
  const KEY = 'pj_txext_v2';
  const loadS = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const saveS = o => { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) { } };

  /* ---------- lazy library loader ---------- */
  const loading = {};
  function lib(url, test) {
    if (test()) return Promise.resolve();
    return loading[url] || (loading[url] = new Promise((ok, no) => {
      const s = document.createElement('script');
      s.src = url; s.onload = () => ok();
      s.onerror = () => { delete loading[url]; no(new Error('Library load nahi hui – internet check karein.')); };
      document.head.appendChild(s);
    }));
  }
  const needPdf = () => lib(CDN.pdf, () => window.pdfjsLib).then(() => { pdfjsLib.GlobalWorkerOptions.workerSrc = CDN.pdfWorker; });
  const needDocx = () => lib(CDN.mammoth, () => window.mammoth);
  const needZip = () => lib(CDN.zip, () => window.JSZip);
  const needOcr = () => lib(CDN.ocr, () => window.Tesseract);

  /* ---------- small helpers ---------- */
  const ext = n => (n.split('.').pop() || '').toLowerCase();
  const tidy = t => t.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const fmtSize = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  const baseName = n => n.replace(/\.[^.]+$/, '');
  const counts = s => `${(s.match(/\S+/g) || []).length} words · ${s.length} chars · ${s ? s.split('\n').length : 0} lines`;
  function detectScripts(text) {
    const r = SCRIPTS.map(s => ({ name: s[0], n: (text.match(s[1]) || []).length, voice: s[2] }));
    const tot = r.reduce((a, b) => a + b.n, 0) || 1;
    return r.filter(x => x.n / tot >= 0.02).map(x => ({ name: x.name, pct: Math.round(x.n / tot * 100), voice: x.voice })).sort((a, b) => b.pct - a.pct);
  }
  function parseRange(str, total) {
    if (!str) return null;
    const set = new Set();
    str.split(/[,\s]+/).filter(Boolean).forEach(p => {
      const m = p.match(/^(\d*)-(\d*)$/);
      if (m && (m[1] || m[2])) { const a = +m[1] || 1, b = +m[2] || total; for (let i = a; i <= Math.min(b, total); i++) set.add(i); }
      else if (/^\d+$/.test(p) && +p >= 1 && +p <= total) set.add(+p);
    });
    if (!set.size) throw new Error('Page range galat hai (is file me ' + total + ' pages hain). Example: 1-3, 5, 8-');
    return [...set].sort((a, b) => a - b);
  }

  /* ---------- image pre-processing (better OCR) ---------- */
  function prep(src, mode, rot) {
    const w = src.width, h = src.height;
    let sc = 1;
    if (mode !== 'none') sc = Math.min(3, Math.max(1, 2200 / Math.max(w, h)));
    if (Math.max(w, h) * sc > 4500) sc = 4500 / Math.max(w, h);
    const cw = Math.round(w * sc), ch = Math.round(h * sc), swap = rot % 180 !== 0;
    const c = document.createElement('canvas'); c.width = swap ? ch : cw; c.height = swap ? cw : ch;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
    g.translate(c.width / 2, c.height / 2); g.rotate(rot * Math.PI / 180);
    g.drawImage(src, -cw / 2, -ch / 2, cw, ch); g.setTransform(1, 0, 0, 1, 0, 0);
    if (mode === 'none') return c;
    const id = g.getImageData(0, 0, c.width, c.height), d = id.data, n = c.width * c.height;
    const gray = new Uint8ClampedArray(n), hist = new Uint32Array(256);
    for (let i = 0, j = 0; i < n; i++, j += 4) { const v = (d[j] * 0.299 + d[j + 1] * 0.587 + d[j + 2] * 0.114) | 0; gray[i] = v; hist[v]++; }
    let lo = 0, hi = 255, acc = 0;
    for (; lo < 255; lo++) { acc += hist[lo]; if (acc > n * 0.01) break; }
    acc = 0; for (hi = 255; hi > 0; hi--) { acc += hist[hi]; if (acc > n * 0.01) break; }
    if (hi <= lo + 10) { lo = 0; hi = 255; }
    const k = 255 / (hi - lo), h2 = new Uint32Array(256);
    for (let i = 0; i < n; i++) { const v = Math.max(0, Math.min(255, ((gray[i] - lo) * k) | 0)); gray[i] = v; h2[v]++; }
    let thr = -1;
    if (mode === 'strong') { // Otsu threshold -> pure black & white
      let sum = 0; for (let t = 0; t < 256; t++) sum += t * h2[t];
      let sB = 0, wB = 0, best = 0; thr = 127;
      for (let t = 0; t < 256; t++) { wB += h2[t]; if (!wB) continue; const wF = n - wB; if (!wF) break; sB += t * h2[t]; const mB = sB / wB, mF = (sum - sB) / wF, bt = wB * wF * (mB - mF) * (mB - mF); if (bt > best) { best = bt; thr = t; } }
      let white = 0; for (let i = 0; i < n; i++) if (gray[i] > thr) white++;
      if (white < n * 0.5) { for (let i = 0; i < n; i++) gray[i] = gray[i] > thr ? 0 : 255; } // dark background -> invert
      else for (let i = 0; i < n; i++) gray[i] = gray[i] > thr ? 255 : 0;
    }
    for (let i = 0, j = 0; i < n; i++, j += 4) { d[j] = d[j + 1] = d[j + 2] = gray[i]; d[j + 3] = 255; }
    g.putImageData(id, 0, 0);
    return c;
  }
  async function loadBitmap(file) {
    try { return await createImageBitmap(file, { imageOrientation: 'from-image' }); }
    catch (e) {
      return new Promise((ok, no) => { const u = URL.createObjectURL(file), im = new Image(); im.onload = () => ok(im); im.onerror = () => no(new Error('Image khul nahi payi.')); im.src = u; });
    }
  }

  /* ---------- OCR engine (worker is reused between pages / files) ---------- */
  let worker = null, workerLang = '', logFn = () => { };
  async function getWorker(o, ctx) {
    await needOcr();
    const key = o.lang + (o.hq ? '|hq' : '');
    if (worker && workerLang === key) return worker;
    if (worker) { try { await worker.terminate(); } catch (e) { } worker = null; }
    ctx.say('OCR engine + language data load ho raha hai… (pehli baar thoda time lagta hai)');
    const make = hq => Tesseract.createWorker(o.lang, 1, Object.assign({ logger: m => logFn(m) }, hq ? { langPath: 'https://tessdata.projectnaptha.com/4.0.0' } : {}));
    try { worker = await make(o.hq); }
    catch (e) { if (!o.hq) throw e; ctx.say('High-accuracy data load nahi hua, normal model use kar raha hoon…'); worker = await make(false); }
    workerLang = key; return worker;
  }
  async function ocrCanvas(c, o, ctx) {
    const w = await getWorker(o, ctx);
    await w.setParameters({ tessedit_pageseg_mode: o.psm, preserve_interword_spaces: '1' });
    logFn = m => { if (m.status === 'recognizing text') { ctx.sub(m.progress); ctx.say('Text padh raha hoon… ' + Math.round(m.progress * 100) + '%'); } };
    const r = await Promise.race([w.recognize(c), ctx.cancelP]);
    ctx.conf.push(r.data.confidence); ctx.ocr = true;
    return r.data.text;
  }

  /* ---------- extractors ---------- */
  async function fromImage(file, o, ctx) {
    ctx.check(); ctx.say('Image taiyaar kar raha hoon…');
    const bmp = await loadBitmap(file);
    const c = prep(bmp, o.enh, o.rot); if (bmp.close) bmp.close();
    ctx.pages = c.width + '×' + c.height + ' px';
    return ocrCanvas(c, o, ctx);
  }

  async function fromPdf(file, o, ctx) {
    await needPdf();
    let pwDenied = false;
    const task = pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) });
    task.onPassword = (update, reason) => {
      const pw = prompt(reason === 2 ? 'Password galat hai. Dobara daalein:' : 'Yeh PDF password-protected hai. Password daalein:');
      if (pw === null) { pwDenied = true; task.destroy(); } else update(pw);
    };
    let pdf;
    try { pdf = await task.promise; } catch (e) { throw new Error(pwDenied ? 'PDF ka password nahi diya gaya.' : (e.message || 'PDF khul nahi payi.')); }
    const list = parseRange(o.range, pdf.numPages) || Array.from({ length: pdf.numPages }, (_, i) => i + 1);
    ctx.pages = list.length + ' / ' + pdf.numPages + ' pages';
    const out = [];
    for (let i = 0; i < list.length; i++) {
      ctx.check(); const p = list[i];
      ctx.base = i / list.length; ctx.span = 1 / list.length; ctx.prog(ctx.base);
      ctx.say(`PDF page ${p} (${i + 1}/${list.length})…`);
      const page = await pdf.getPage(p);
      let txt = '';
      if (o.scan !== 'always') {
        const tc = await page.getTextContent();
        let lastY = null, lastEnd = null, lastX = null;
        for (const it of tc.items) {
          if (!it.str && !it.hasEOL) continue;
          const x = it.transform[4], y = it.transform[5], sz = Math.abs(it.transform[0]) || 10, wd = it.width || 0;
          if (lastY !== null && Math.abs(y - lastY) > sz * 0.5) { txt += '\n'; lastEnd = null; }
          else if (lastEnd !== null) {
            const gap = Math.max(x - lastEnd, lastX - (x + wd));
            if (o.layout && gap > sz * 1.5) txt += '\t';
            else if (gap > sz * 0.15 && !/\s$/.test(txt) && !/^\s/.test(it.str)) txt += ' ';
          }
          txt += it.str; lastY = y; lastEnd = x + wd; lastX = x;
          if (it.hasEOL) { txt += '\n'; lastY = null; lastEnd = null; }
        }
        txt = txt.replace(/[ \t]+\n/g, '\n').trim();
      }
      if (o.scan === 'always' || (o.scan === 'auto' && txt.replace(/\s/g, '').length < 5)) {
        ctx.say(`Page ${p} par OCR chal raha hai…`);
        const vp = page.getViewport({ scale: 2.2 });
        const raw = document.createElement('canvas'); raw.width = vp.width; raw.height = vp.height;
        await page.render({ canvasContext: raw.getContext('2d'), viewport: vp }).promise;
        const c = prep(raw, o.enh, o.rot); raw.width = raw.height = 0;
        txt = (await ocrCanvas(c, o, ctx)).trim();
      }
      out.push(o.labels ? `--- Page ${p} ---\n${txt}` : txt);
    }
    ctx.prog(1);
    return out.join('\n\n');
  }

  function htmlToText(html) {
    const doc = new DOMParser().parseFromString(html, 'text/html'), out = [];
    const walk = n => {
      for (const c of n.children) {
        const t = c.tagName;
        if (t === 'TABLE') { c.querySelectorAll('tr').forEach(r => out.push([...r.children].map(x => x.textContent.trim().replace(/\s+/g, ' ')).join('\t'))); out.push(''); }
        else if (t === 'UL' || t === 'OL') { [...c.children].forEach((li, i) => out.push((t === 'OL' ? (i + 1) + '. ' : '• ') + li.textContent.trim())); out.push(''); }
        else if (/^H[1-6]$/.test(t)) { out.push(c.textContent); out.push(''); }
        else if (t === 'P') out.push(c.textContent);
        else walk(c);
      }
    };
    walk(doc.body); return out.join('\n');
  }
  async function fromDocx(file, o, ctx) {
    await needDocx(); ctx.say('Word file padh raha hoon…');
    const r = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
    ctx.prog(1); return htmlToText(r.value);
  }

  const xmlText = xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    return [...doc.getElementsByTagNameNS('*', 'p')].map(p => [...p.getElementsByTagNameNS('*', 't')].map(t => t.textContent).join('')).filter(s => s.trim()).join('\n');
  };
  async function fromPptx(file, o, ctx) {
    await needZip();
    const zip = await JSZip.loadAsync(await file.arrayBuffer());
    const num = n => +(n.match(/(\d+)\.xml$/) || [0, 0])[1];
    let slides = [];
    try { // real presentation order (not just file-name order)
      const pres = await zip.file('ppt/presentation.xml').async('string'), rels = await zip.file('ppt/_rels/presentation.xml.rels').async('string');
      const map = {};
      [...rels.matchAll(/<Relationship\b[^>]*>/g)].forEach(m => { const id = /\bId="([^"]+)"/.exec(m[0]), t = /\bTarget="([^"]+)"/.exec(m[0]); if (id && t) map[id[1]] = t[1]; });
      slides = [...pres.matchAll(/<p:sldId\b[^>]*\br:id="([^"]+)"/g)].map(m => map[m[1]]).filter(Boolean).map(t => 'ppt/' + t.replace(/^\/?(ppt\/)?/, '')).filter(n => zip.file(n));
    } catch (e) { slides = []; }
    if (!slides.length) slides = Object.keys(zip.files).filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => num(a) - num(b));
    if (!slides.length) throw new Error('Is file me koi slide nahi mili.');
    ctx.pages = slides.length + ' slides';
    const out = [];
    for (let i = 0; i < slides.length; i++) {
      ctx.check(); ctx.prog(i / slides.length); ctx.say(`Slide ${i + 1}/${slides.length}…`);
      let t = xmlText(await zip.file(slides[i]).async('string'));
      if (o.notes) {
        const rf = zip.file(slides[i].replace('slides/', 'slides/_rels/') + '.rels');
        if (rf) {
          const m = /Target="[^"]*notesSlides\/([^"]+)"/.exec(await rf.async('string')), nf = m && zip.file('ppt/notesSlides/' + m[1]);
          if (nf) { const n = xmlText(await nf.async('string')).replace(/^\d+$/gm, '').trim(); if (n) t += '\n\n[Notes]\n' + n; }
        }
      }
      out.push(o.labels ? `--- Slide ${i + 1} ---\n${t}` : t);
    }
    ctx.prog(1); return out.join('\n\n');
  }

  async function extract(file, o, ctx) {
    const e = ext(file.name), t = file.type || '';
    if (e === 'pdf' || t === 'application/pdf') return fromPdf(file, o, ctx);
    if (e === 'docx') return fromDocx(file, o, ctx);
    if (e === 'pptx') return fromPptx(file, o, ctx);
    if (e === 'doc' || e === 'ppt') throw new Error('Purana .' + e + ' format support nahi hai. File ko .' + e + 'x me "Save As" karke dobara upload karein.');
    if (t.startsWith('image/') || /^(jpe?g|png|webp|bmp|gif)$/.test(e)) return fromImage(file, o, ctx);
    if (/^(html?|xhtml)$/.test(e)) { const d = new DOMParser().parseFromString(await file.text(), 'text/html'); d.querySelectorAll('script,style').forEach(x => x.remove()); return d.body.textContent; }
    if (/^(txt|md|csv|json|log|tsv)$/.test(e) || t.startsWith('text/')) return file.text();
    throw new Error('Yeh file type support nahi hai. PDF, DOCX, PPTX, image ya text file upload karein.');
  }

  /* ---------- text tools ---------- */
  const OPS = {
    spaces: t => t.replace(/[ \t]+/g, ' ').replace(/^ +| +$/gm, ''),
    blank: t => t.split('\n').filter(l => l.trim()).join('\n'),
    join: t => t.split(/\n{2,}/).map(par => {
      let o = ''; par.split('\n').map(s => s.trim()).filter(Boolean).forEach((l, i) => {
        if (!i) o = l; else if (/[.!?।:;]["”')\]]?$/.test(o) || /^([•\-*–▪●]|\d+[.)])\s/.test(l)) o += '\n' + l; else o += ' ' + l;
      }); return o;
    }).join('\n\n'),
    hyph: t => t.replace(/(\S)-\n\s*(\S)/g, '$1$2'),
    one: t => t.replace(/\s+/g, ' ').trim(),
    dedupe: t => { const s = new Set(); return t.split('\n').filter(l => { const k = l.trim(); if (!k) return true; if (s.has(k)) return false; s.add(k); return true; }).join('\n'); },
    sort: t => t.split('\n').filter(l => l.trim()).sort((a, b) => a.localeCompare(b)).join('\n'),
    upper: t => t.toUpperCase(), lower: t => t.toLowerCase(),
    title: t => t.toLowerCase().replace(/(^|\s)(\S)/g, (m, a, b) => a + b.toUpperCase())
  };
  const uniq = a => [...new Set(a)];
  const FIND = {
    'Email': t => uniq(t.match(/[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g) || []),
    'Phone': t => uniq((t.match(/\+?\d[\d\s().-]{8,16}\d/g) || []).map(s => s.trim()).filter(s => { const n = s.replace(/\D/g, '').length; return n >= 10 && n <= 13; })),
    'Links': t => uniq((t.match(/(?:https?:\/\/|www\.)[^\s<>"')]+/g) || []).map(s => s.replace(/[.,;]+$/, '')))
  };

  /* ---------- the tool ---------- */
  add('office', 'text-extractor', '📝', 'File to Text Extractor', 'PDF, Word, PowerPoint ya photo se poora text nikaalein (25 languages, OCR) – edit karein, copy ya download karein.', el => {
    const S = Object.assign({ langs: ['eng', 'hin'], enh: 'auto', rot: '0', psm: '3', scan: 'auto', range: '', labels: false, notes: false, layout: false, hyph: true, hq: true }, loadS());
    const sel = (id, label, opts, v) => `<label class="fld"><span>${label}</span><select id="${id}">${opts.map(o => `<option value="${o[0]}"${String(o[0]) === String(v) ? ' selected' : ''}>${o[1]}</option>`).join('')}</select></label>`;
    const chk = (id, label, v) => `<label style="display:flex;gap:8px;align-items:center;font-weight:400"><input type="checkbox" id="${id}" style="width:auto"${v ? ' checked' : ''}> ${label}</label>`;
    el.innerHTML = `
    <div class="card">
      <label id="tx-drop" for="tx-file" style="display:block;border:2px dashed #93c5fd;border-radius:14px;padding:34px 16px;text-align:center;background:#f8faff;cursor:pointer">
        <div style="font-size:34px">📂</div>
        <b>File yahan drop karein ya click karke chunein</b>
        <div class="note" style="margin-top:6px">PDF · Word (.docx) · PowerPoint (.pptx) · Photo (JPG, PNG, WEBP…) · TXT/HTML &nbsp;|&nbsp; kai files ek saath · Ctrl+V se screenshot paste</div>
        <input id="tx-file" type="file" multiple accept=".pdf,.docx,.pptx,.txt,.md,.csv,.json,.html,.htm,image/*" hidden>
      </label>
      <div id="tx-run" hidden style="margin-top:14px">
        <div class="bar" style="background:#e2e8f0"><i id="tx-pi" style="width:0%;transition:width .2s"></i></div>
        <div class="row" style="margin:6px 0 0;align-items:center"><span class="note" id="tx-status" style="margin:0;font-weight:500"></span><button class="btn sm red" id="tx-cancel">✕ Cancel</button></div>
      </div>
      <p class="note" id="tx-done" style="font-weight:500"></p>
    </div>

    <details open><summary>⚙️ Advanced settings (language, image quality, PDF options)</summary>
      <div class="fld wide" style="margin-bottom:14px"><span>Photo / scanned PDF me kaun si language hai? (ek ya kai chunein)</span>
        <div id="tx-langs" style="display:flex;flex-wrap:wrap;gap:6px;font-weight:400">${LANGS.map(l => `<label class="chip" style="cursor:pointer;display:inline-flex;gap:5px;align-items:center;margin:0"><input type="checkbox" value="${l[0]}" style="width:auto"${S.langs.includes(l[0]) ? ' checked' : ''}>${l[1]}</label>`).join('')}</div>
        <small>Hindi-zyada documents me kabhi-kabhi sirf <b>Hindi</b> tick karke (English untick) behtar result milta hai. Zyada languages = slow OCR. Sirf wahi chunein jo image me hain. Normal PDF / Word / PPT ka text kisi bhi language me apne aap aata hai.</small></div>
      <div class="form">
        ${sel('tx-enh', '🖼 Image enhancement (OCR se pehle)', [['auto', 'Auto enhance (recommended)'], ['strong', 'Strong – black & white (dhundhli / phaki photo)'], ['none', 'Original (koi change nahi)']], S.enh)}
        ${sel('tx-rot', '🔄 Image rotate (agar ulti / side me hai)', [['0', 'Normal'], ['90', '90° clockwise'], ['180', '180°'], ['270', '90° anti-clockwise']], S.rot)}
        ${sel('tx-psm', '📐 Text layout (OCR)', [['3', 'Auto'], ['6', 'Single block of text'], ['4', 'Single column'], ['11', 'Sparse / bikhra hua text'], ['7', 'Single line']], S.psm)}
        ${sel('tx-scan', '📄 Scanned PDF pages', [['auto', 'Auto – jahan text na ho wahan OCR'], ['always', 'Hamesha OCR (image-wali PDF)'], ['never', 'OCR kabhi nahi']], S.scan)}
        <label class="fld"><span>📑 PDF page range (khali = saare)</span><input id="tx-range" placeholder="e.g. 1-3, 5, 8-" value="${esc(S.range)}"></label>
        <div class="fld"><span>Options</span><div style="display:flex;flex-direction:column;gap:6px">
          ${chk('tx-lab', 'Page / Slide labels add karein', S.labels)}
          ${chk('tx-notes', 'PPT ke speaker notes bhi lein', S.notes)}
          ${chk('tx-layout', 'Columns / tables ko TAB se alag rakhein (PDF)', S.layout)}
          ${chk('tx-hyph', 'Line-end hyphen waale words jodein', S.hyph)}
          ${chk('tx-hq', '🎯 High accuracy OCR models (Hindi ke liye zaroori – zyada download, slow)', S.hq)}
        </div></div>
      </div>
    </details>

    <div id="tx-out"></div>
    <p class="note">🔒 Aapki file kahin upload nahi hoti – sab kuch aapke browser me hota hai. OCR ka accuracy image ki quality par depend karta hai: saaf, seedhi aur achhi roshni wali photo lein.</p>`;

    const $f = s => $(s, el), outBox = $f('#tx-out'), drop = $f('#tx-drop');
    let busy = false, cancelled = false, cancelNow = () => { };
    const say = m => $f('#tx-status').textContent = m;
    const setBar = f => $f('#tx-pi').style.width = Math.round(Math.min(1, f) * 100) + '%';

    const getO = () => ({
      lang: [...el.querySelectorAll('#tx-langs input:checked')].map(i => i.value).join('+') || 'eng',
      enh: $f('#tx-enh').value, rot: +$f('#tx-rot').value, psm: $f('#tx-psm').value, scan: $f('#tx-scan').value, range: $f('#tx-range').value.trim(),
      labels: $f('#tx-lab').checked, notes: $f('#tx-notes').checked, layout: $f('#tx-layout').checked, hyph: $f('#tx-hyph').checked, hq: $f('#tx-hq').checked
    });
    const persist = () => { const o = getO(); saveS({ langs: o.lang.split('+'), enh: o.enh, rot: String(o.rot), psm: o.psm, scan: o.scan, range: o.range, labels: o.labels, notes: o.notes, layout: o.layout, hyph: o.hyph, hq: o.hq }); };
    el.querySelectorAll('details input, details select').forEach(i => i.addEventListener('change', persist));

    /* ----- bulk bar (copy all / download all / clear) ----- */
    function refreshBar() {
      const cards = [...outBox.querySelectorAll('.tx-card')], has = cards.filter(c => c.querySelector('.tx-area'));
      let bar = $f('#tx-bar');
      if (!has.length) { if (bar) bar.remove(); return; }
      if (!bar) {
        outBox.insertAdjacentHTML('afterbegin', '<div class="row" id="tx-bar" style="margin:0 0 14px"><button class="btn" id="tx-ca">📋 Saara text copy karein</button><button class="btn ghost" id="tx-da">⬇ Sab ek .txt me</button><button class="btn ghost" id="tx-clr">🗑 Sab clear karein</button></div>');
        const all = () => [...outBox.querySelectorAll('.tx-card')].filter(c => c.querySelector('.tx-area')).map(c => (outBox.querySelectorAll('.tx-card').length > 1 ? `===== ${c.dataset.name} =====\n` : '') + c.querySelector('.tx-area').value).join('\n\n');
        $f('#tx-ca').onclick = () => copy(all());
        $f('#tx-da').onclick = () => download(new Blob([all()], { type: 'text/plain;charset=utf-8' }), 'extracted-text.txt');
        $f('#tx-clr').onclick = () => { if (busy) return toast('Pehle process rukne dein.'); outBox.innerHTML = ''; $f('#tx-done').textContent = ''; };
      }
    }

    /* ----- text-to-speech ----- */
    const stopSpeech = () => { try { speechSynthesis.cancel(); } catch (e) { } };
    function speak(text, voice, btn) {
      if (!('speechSynthesis' in window)) return toast('Aapka browser read-aloud support nahi karta.');
      if (speechSynthesis.speaking) { stopSpeech(); return; }
      const parts = []; let cur = '';
      text.split(/(?<=[.!?।\n])\s*/).forEach(s => { if ((cur + s).length > 200) { if (cur) parts.push(cur); cur = s; } else cur += (cur ? ' ' : '') + s; });
      if (cur) parts.push(cur);
      parts.forEach((p, i) => { const u = new SpeechSynthesisUtterance(p); u.lang = voice; if (i === parts.length - 1) u.onend = u.onerror = () => btn.textContent = '🔊 Sunein'; speechSynthesis.speak(u); });
      btn.textContent = '⏹ Stop';
    }

    /* ----- paint one result card ----- */
    function paint(card, f, text, meta, thumbUrl) {
      card.innerHTML = `
      <div style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start;flex-wrap:wrap;margin-bottom:8px">
        <div style="display:flex;gap:12px;align-items:center;min-width:0">${thumbUrl ? `<img src="${thumbUrl}" alt="" style="max-height:60px;border-radius:8px;border:1px solid var(--bd)">` : ''}<div style="min-width:0"><h3 style="margin:0;word-break:break-all">${esc(f.name)}</h3><small class="note" style="margin:0">${esc(meta)}</small></div></div>
        <div class="row" style="margin:0"><button class="btn sm tx-copy">📋 Copy</button><button class="btn sm ghost tx-txt">⬇ .txt</button><button class="btn sm ghost tx-doc">⬇ Word</button><button class="btn sm ghost tx-say">🔊 Sunein</button><button class="btn sm ghost tx-re">🔄 Re-scan</button><button class="btn sm ghost tx-x">✕</button></div>
      </div>
      <div class="tx-warn"></div>
      <div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:8px"><span class="tx-chips"></span><span class="note tx-c" style="margin:0"></span></div>
      <textarea class="tx-area" rows="14" placeholder="Is file me koi text nahi mila." style="font-family:inherit;line-height:1.6"></textarea>
      <details style="margin-top:10px"><summary>🛠 Edit tools (clean-up, find &amp; replace)</summary>
        <div class="row" style="margin:0 0 10px">
          <button class="btn sm ghost" data-op="spaces">Extra spaces hatayein</button><button class="btn sm ghost" data-op="blank">Khali lines hatayein</button>
          <button class="btn sm ghost" data-op="join">Lines jodein (paragraph)</button><button class="btn sm ghost" data-op="hyph">Hyphen breaks jodein</button>
          <button class="btn sm ghost" data-op="one">Ek hi line me</button><button class="btn sm ghost" data-op="dedupe">Duplicate lines hatayein</button>
          <button class="btn sm ghost" data-op="sort">A–Z sort</button><button class="btn sm ghost" data-op="upper">UPPERCASE</button>
          <button class="btn sm ghost" data-op="lower">lowercase</button><button class="btn sm ghost" data-op="title">Title Case</button>
          <button class="btn sm ghost tx-undo">↩ Undo</button><button class="btn sm ghost tx-reset">⟲ Original text</button>
        </div>
        <div class="row" style="margin:0 0 10px;align-items:center">
          <input class="tx-find" placeholder="Dhundhein…" style="width:180px"><input class="tx-repl" placeholder="Isse badlein…" style="width:180px">
          <label style="display:flex;gap:5px;align-items:center;font-size:.82rem"><input type="checkbox" class="tx-rx" style="width:auto"> Regex</label>
          <label style="display:flex;gap:5px;align-items:center;font-size:.82rem"><input type="checkbox" class="tx-ci" style="width:auto" checked> Aa=aa</label>
          <button class="btn sm tx-rep">Replace all</button>
        </div>
      </details>
      <details><summary>🔍 Smart extract (email, phone, links)</summary>
        <div class="row" style="margin:0 0 10px"><button class="btn sm tx-find-all">Text scan karein</button></div><div class="tx-found"></div>
      </details>`;
      const ta = $('.tx-area', card), chips = $('.tx-chips', card), cnt = $('.tx-c', card);
      let voice = 'en-US', orig = text; const undo = [];
      const upd = () => {
        const sc = detectScripts(ta.value); voice = sc[0] ? sc[0].voice : 'en-US';
        chips.innerHTML = sc.map(s => `<span class="chip">${esc(s.name)} ${s.pct}%</span>`).join('');
        cnt.textContent = counts(ta.value);
      };
      ta.value = text; upd(); ta.addEventListener('input', upd);
      if (!text.trim()) $('.tx-warn', card).innerHTML = '<p class="err">Koi text nahi mila. Scanned PDF / photo ho to "Scanned PDF pages" ko "Hamesha OCR" karke 🔄 Re-scan karein.</p>';
      const apply = fn => { undo.push(ta.value); ta.value = fn(ta.value); upd(); };
      card.querySelectorAll('[data-op]').forEach(b => b.onclick = () => apply(OPS[b.dataset.op]));
      $('.tx-undo', card).onclick = () => { if (undo.length) { ta.value = undo.pop(); upd(); } else toast('Undo ke liye kuch nahi hai'); };
      $('.tx-reset', card).onclick = () => { undo.push(ta.value); ta.value = orig; upd(); };
      $('.tx-rep', card).onclick = () => {
        const q = $('.tx-find', card).value; if (!q) return toast('Pehle "Dhundhein" box me likhein');
        try {
          const re = new RegExp($('.tx-rx', card).checked ? q : q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g' + ($('.tx-ci', card).checked ? 'i' : ''));
          const n = (ta.value.match(re) || []).length; if (!n) return toast('Kuch nahi mila');
          undo.push(ta.value); ta.value = ta.value.replace(re, $('.tx-repl', card).value); upd(); toast(n + ' jagah badla');
        } catch (e) { toast('Regex galat hai'); }
      };
      $('.tx-find-all', card).onclick = () => {
        const box = $('.tx-found', card); box.innerHTML = '';
        Object.entries(FIND).forEach(([k, fn]) => {
          const r = fn(ta.value);
          box.insertAdjacentHTML('beforeend', `<div style="margin-bottom:8px"><b style="font-size:.85rem">${k} (${r.length})</b> ${r.length ? '<button class="btn sm ghost" style="margin-left:6px">Copy all</button>' : ''}<div>${r.map(x => `<span class="chip">${esc(x)}</span>`).join('') || '<span class="note">Kuch nahi mila</span>'}</div></div>`);
          const b = box.lastElementChild.querySelector('button'); if (b) b.onclick = () => copy(r.join('\n'));
        });
      };
      $('.tx-copy', card).onclick = () => copy(ta.value);
      $('.tx-txt', card).onclick = () => download(new Blob([ta.value], { type: 'text/plain;charset=utf-8' }), baseName(f.name) + '.txt');
      $('.tx-doc', card).onclick = () => {
        const body = ta.value.split('\n').map(l => `<p style="margin:0 0 6pt">${esc(l).replace(/\t/g, '&emsp;') || '&nbsp;'}</p>`).join('');
        download(new Blob([`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${esc(baseName(f.name))}</title></head><body style="font-family:Calibri,'Nirmala UI',Arial;font-size:12pt;line-height:1.5">${body}</body></html>`], { type: 'application/msword' }), baseName(f.name) + '.doc');
      };
      const sayBtn = $('.tx-say', card); sayBtn.onclick = () => speak(ta.value, voice, sayBtn);
      $('.tx-re', card).onclick = () => runBatch([{ f, card }]);
      $('.tx-x', card).onclick = () => { if (busy) return toast('Pehle process rukne dein.'); if (thumbUrl) URL.revokeObjectURL(thumbUrl); card.remove(); refreshBar(); };
    }

    /* ----- batch runner ----- */
    async function runBatch(entries) {
      if (busy) return toast('Pehle wali file process ho rahi hai…');
      busy = true; cancelled = false; persist();
      let rej; const cancelP = new Promise((_, r) => rej = r); cancelP.catch(() => { });
      cancelNow = () => { cancelled = true; rej(new Error('Cancel kar diya gaya.')); if (worker) { const w = worker; worker = null; Promise.resolve(w.terminate()).catch(() => { }); } };
      $f('#tx-run').hidden = false; $f('#tx-done').textContent = ''; setBar(0);
      const o = getO(); let ok = 0;
      for (let i = 0; i < entries.length; i++) {
        const { f, card } = entries[i], t0 = Date.now();
        card.dataset.name = f.name;
        const ctx = { conf: [], ocr: false, pages: '', base: 0, span: 1, cancelP, say, check() { if (cancelled) throw new Error('Cancel kar diya gaya.'); }, prog(fr) { setBar((i + fr) / entries.length); }, sub(p) { ctx.prog(ctx.base + ctx.span * p); } };
        card.innerHTML = `<h3 style="margin:0 0 6px;word-break:break-all">${esc(f.name)}</h3><p class="note" style="margin:0">⏳ Processing…</p>`;
        say(`"${f.name}" (${i + 1}/${entries.length}) padh raha hoon…`);
        try {
          ctx.check();
          let text = await extract(f, o, ctx);
          text = tidy(text); if (o.hyph) text = OPS.hyph(text);
          const conf = ctx.conf.length ? Math.round(ctx.conf.reduce((a, b) => a + b, 0) / ctx.conf.length) : null;
          const meta = [fmtSize(f.size), ctx.pages, ctx.ocr ? 'OCR confidence ~' + conf + '%' : 'direct text', ((Date.now() - t0) / 1000).toFixed(1) + 's'].filter(Boolean).join(' · ');
          paint(card, f, text, meta, (f.type || '').startsWith('image/') ? URL.createObjectURL(f) : '');
          if (ctx.ocr && conf < 65 && text.trim()) $('.tx-warn', card).innerHTML = '<p class="note" style="color:#b45309;margin:0 0 8px">⚠ OCR confidence kam hai. Sahi language chunein, "Strong – black & white" enhancement try karein, ya image rotate karke 🔄 Re-scan dabayein.</p>';
          ok++;
        } catch (e) {
          console.error(e);
          card.innerHTML = `<h3 style="margin:0 0 6px;word-break:break-all">${esc(f.name)}</h3><p class="err">${esc(e.message || 'File padh nahi payi.')}</p><div class="row" style="margin:8px 0 0"><button class="btn sm tx-retry">🔄 Dobara try karein</button><button class="btn sm ghost tx-rm">✕ Hatayein</button></div>`;
          $('.tx-retry', card).onclick = () => runBatch([{ f, card }]);
          $('.tx-rm', card).onclick = () => { if (!busy) { card.remove(); refreshBar(); } };
        }
      }
      busy = false; $f('#tx-run').hidden = true; refreshBar();
      $f('#tx-done').textContent = cancelled ? '⏹ Cancel kiya gaya.' : (ok ? '✅ Ho gaya! Text neeche hai – edit karein ya Copy button dabayein.' : '⚠ Koi file process nahi ho payi.');
      const first = entries[0] && entries[0].card; if (first && !cancelled) first.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    function run(files) {
      files = [...files]; if (!files.length) return;
      if (busy) return toast('Pehle wali file process ho rahi hai…');
      const entries = files.map(f => { const card = document.createElement('div'); card.className = 'card tx-card'; card.dataset.name = f.name; outBox.appendChild(card); return { f, card }; });
      runBatch(entries);
    }

    $f('#tx-cancel').onclick = () => cancelNow();
    $f('#tx-file').addEventListener('change', e => { run(e.target.files); e.target.value = ''; });
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.style.background = '#e0ecff'; }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.style.background = '#f8faff'; }));
    drop.addEventListener('drop', e => run(e.dataTransfer.files));

    const onPaste = e => {
      const imgs = [...(e.clipboardData?.files || [])].filter(f => f.type.startsWith('image/'));
      if (imgs.length) { e.preventDefault(); run(imgs.map((f, i) => new File([f], 'pasted-image-' + (i + 1) + '.png', { type: f.type }))); }
    };
    document.addEventListener('paste', onPaste);
    CLEANUP = () => {
      document.removeEventListener('paste', onPaste); stopSpeech(); cancelNow();
      if (worker) { const w = worker; worker = null; Promise.resolve(w.terminate()).catch(() => { }); }
    };
  });
})();
