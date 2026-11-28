/* ===== File to Text Extractor =====
   PDF / Word (.docx) / PowerPoint (.pptx) / Images (OCR) -> editable text -> Copy.
   Sab kuch browser me hota hai, file kahin upload nahi hoti.
   Libraries (pdf.js, mammoth, JSZip, Tesseract) tabhi load hoti hain jab tool use ho. */
(function () {
  const CDN = {
    pdf: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    pdfWorker: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    mammoth: 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js',
    zip: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
    ocr: 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.5/dist/tesseract.min.js'
  };
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

  const readBuf = f => f.arrayBuffer();
  const tidy = t => t.replace(/\r/g, '').replace(/[ \t]+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();
  const ext = n => (n.split('.').pop() || '').toLowerCase();

  /* ---------- OCR ---------- */
  async function ocr(src, lang, say) {
    await needOcr();
    const r = await Tesseract.recognize(src, lang, {
      logger: m => { if (m.status === 'recognizing text') say('Text padh raha hoon… ' + Math.round(m.progress * 100) + '%'); else if (m.status) say('OCR taiyaar ho raha hai… (pehli baar thoda time lagta hai)'); }
    });
    return r.data.text;
  }

  /* ---------- PDF ---------- */
  async function fromPdf(file, o) {
    await needPdf();
    const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await readBuf(file)) }).promise;
    const out = [];
    for (let p = 1; p <= pdf.numPages; p++) {
      o.say(`PDF page ${p}/${pdf.numPages}…`);
      const page = await pdf.getPage(p);
      const tc = await page.getTextContent();
      let txt = '', lastY = null;
      tc.items.forEach(it => {
        const y = it.transform[5];
        if (lastY !== null && Math.abs(y - lastY) > 3) txt += '\n'; else if (txt && !/\s$/.test(txt) && !/^\s/.test(it.str)) txt += ' ';
        txt += it.str; lastY = y;
        if (it.hasEOL) { txt += '\n'; lastY = null; }
      });
      txt = txt.trim();
      if (txt.length < 5 && o.scan) { // scanned page -> OCR
        o.say(`Page ${p} scanned lag raha hai, OCR chal raha hai…`);
        const vp = page.getViewport({ scale: 2.2 });
        const c = document.createElement('canvas'); c.width = vp.width; c.height = vp.height;
        await page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
        txt = (await ocr(c, o.lang, o.say)).trim();
      }
      out.push(o.labels ? `--- Page ${p} ---\n${txt}` : txt);
    }
    return out.join('\n\n');
  }

  /* ---------- Word ---------- */
  async function fromDocx(file) {
    await needDocx();
    return (await mammoth.extractRawText({ arrayBuffer: await readBuf(file) })).value;
  }

  /* ---------- PowerPoint ---------- */
  const xmlText = xml => {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    const paras = [...doc.getElementsByTagNameNS('*', 'p')];
    return paras.map(p => [...p.getElementsByTagNameNS('*', 't')].map(t => t.textContent).join('')).filter(s => s.trim()).join('\n');
  };
  async function fromPptx(file, o) {
    await needZip();
    const zip = await JSZip.loadAsync(await readBuf(file));
    const num = n => +(n.match(/(\d+)\.xml$/) || [0, 0])[1];
    const slides = Object.keys(zip.files).filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => num(a) - num(b));
    if (!slides.length) throw new Error('Is file me koi slide nahi mili.');
    const out = [];
    for (let i = 0; i < slides.length; i++) {
      o.say(`Slide ${i + 1}/${slides.length}…`);
      let t = xmlText(await zip.file(slides[i]).async('string'));
      const nf = zip.file(`ppt/notesSlides/notesSlide${num(slides[i])}.xml`);
      if (o.notes && nf) { const n = xmlText(await nf.async('string')).replace(/^\d+$/gm, '').trim(); if (n) t += '\n\n[Notes]\n' + n; }
      out.push(o.labels ? `--- Slide ${i + 1} ---\n${t}` : t);
    }
    return out.join('\n\n');
  }

  /* ---------- router ---------- */
  async function extract(file, o) {
    const e = ext(file.name), t = file.type || '';
    if (e === 'pdf' || t === 'application/pdf') return fromPdf(file, o);
    if (e === 'docx') return fromDocx(file);
    if (e === 'pptx') return fromPptx(file, o);
    if (e === 'doc' || e === 'ppt') throw new Error('Purana .' + e + ' format support nahi hai. File ko .' + e + 'x me "Save As" karke dobara upload karein.');
    if (t.startsWith('image/') || /^(jpe?g|png|webp|bmp|gif)$/.test(e)) return ocr(file, o.lang, o.say);
    if (e === 'txt' || t === 'text/plain') return file.text();
    throw new Error('Yeh file type support nahi hai. PDF, DOCX, PPTX ya image upload karein.');
  }

  const LANGS = [['eng', 'English'], ['hin', 'हिन्दी Hindi'], ['mar', 'मराठी Marathi'], ['guj', 'ગુજરાતી Gujarati'], ['pan', 'ਪੰਜਾਬੀ Punjabi'], ['ben', 'বাংলা Bengali'], ['tam', 'தமிழ் Tamil'], ['tel', 'తెలుగు Telugu'], ['kan', 'ಕನ್ನಡ Kannada'], ['mal', 'മലയാളം Malayalam'], ['urd', 'اردو Urdu'], ['san', 'संस्कृत Sanskrit'], ['nep', 'नेपाली Nepali'], ['ara', 'العربية Arabic'], ['chi_sim', '中文 Chinese (Simp.)'], ['chi_tra', '中文 Chinese (Trad.)'], ['jpn', '日本語 Japanese'], ['kor', '한국어 Korean'], ['rus', 'Русский Russian'], ['fra', 'Français French'], ['deu', 'Deutsch German'], ['spa', 'Español Spanish'], ['por', 'Português Portuguese'], ['ita', 'Italiano Italian'], ['tha', 'ไทย Thai']];
  const fmtSize = b => b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB';
  const counts = s => { const w = (s.match(/\S+/g) || []).length; return w + ' words · ' + s.length + ' characters'; };

  add('office', 'text-extractor', '📝', 'File to Text Extractor', 'PDF, Word, PowerPoint ya photo upload karein – poora text niche aayega, copy karke kahin bhi paste karein.', el => {
    el.innerHTML = `
    <div class="card">
      <label id="tx-drop" for="tx-file" style="display:block;border:2px dashed #93c5fd;border-radius:14px;padding:34px 16px;text-align:center;background:#f8faff;cursor:pointer">
        <div style="font-size:34px">📂</div>
        <b>File yahan drop karein ya click karke chunein</b>
        <div class="note" style="margin-top:6px">PDF · Word (.docx) · PowerPoint (.pptx) · Photo (JPG, PNG, WEBP) &nbsp;|&nbsp; Photo paste bhi kar sakte hain (Ctrl+V)</div>
        <input id="tx-file" type="file" multiple accept=".pdf,.docx,.pptx,.txt,image/*" hidden>
      </label>
      <div class="form" style="margin-top:16px">
        <div class="fld wide"><span>Photo / scanned PDF me kaun si language hai? (ek ya kai chunein – Hindi + English pehle se select hai)</span>
          <div id="tx-langs" style="display:flex;flex-wrap:wrap;gap:6px;font-weight:400">${LANGS.map(l => `<label class="chip" style="cursor:pointer;display:inline-flex;gap:5px;align-items:center;margin:0"><input type="checkbox" value="${l[0]}" style="width:auto" ${l[0] === 'eng' || l[0] === 'hin' ? 'checked' : ''}>${l[1]}</label>`).join('')}</div>
          <small>Jitni zyada languages chunenge, OCR utna slow hoga. Sirf wahi chunein jo image me hain. PDF / Word / PPT ka digital text har language me apne aap aata hai.</small></div>
        <label class="fld"><span>Options</span>
          <div style="display:flex;flex-direction:column;gap:6px;font-weight:400">
            <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="tx-lab" style="width:auto"> Page / Slide ke labels add karein</label>
            <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="tx-notes" style="width:auto"> PPT ke speaker notes bhi lein</label>
            <label style="display:flex;gap:8px;align-items:center"><input type="checkbox" id="tx-scan" style="width:auto" checked> Scanned PDF par automatic OCR</label>
          </div></label>
      </div>
      <p class="note" id="tx-status" style="font-weight:500"></p>
    </div>
    <div id="tx-out"></div>
    <p class="note">🔒 Aapki file kahin upload nahi hoti – sab kuch aapke browser me hota hai. Photo/OCR ka accuracy image ki quality par depend karta hai.</p>`;

    const $f = s => $(s, el), status = $f('#tx-status'), outBox = $f('#tx-out'), drop = $f('#tx-drop');
    const results = []; let busy = false;
    const say = m => status.textContent = m;

    async function run(files) {
      if (busy) return toast('Pehle wali file process ho rahi hai…');
      files = [...files]; if (!files.length) return;
      busy = true;
      const o = { say, lang: [...el.querySelectorAll('#tx-langs input:checked')].map(i => i.value).join('+') || 'eng', labels: $f('#tx-lab').checked, notes: $f('#tx-notes').checked, scan: $f('#tx-scan').checked };
      for (const f of files) {
        say(`"${f.name}" padh raha hoon…`);
        const card = document.createElement('div'); card.className = 'card';
        try {
          const text = tidy(await extract(f, o));
          const isImg = (f.type || '').startsWith('image/');
          const thumb = isImg ? `<img src="${URL.createObjectURL(f)}" alt="" style="max-height:60px;border-radius:8px;border:1px solid var(--bd)">` : '';
          results.push(card);
          card.innerHTML = `<div style="display:flex;justify-content:space-between;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:10px">
            <div style="display:flex;gap:12px;align-items:center">${thumb}<div><h3 style="margin:0">${esc(f.name)}</h3><small class="note" style="margin:0">${fmtSize(f.size)} · <span class="tx-c">${counts(text)}</span></small></div></div>
            <div class="row" style="margin:0"><button class="btn sm tx-copy">📋 Copy Text</button><button class="btn sm ghost tx-dl">⬇ .txt</button></div></div>
            <textarea rows="14" class="tx-area" placeholder="Is file me koi text nahi mila."></textarea>`;
          const ta = $('.tx-area', card); ta.value = text;
          if (!text) card.insertAdjacentHTML('afterbegin', '<p class="err">Koi text nahi mila. Agar yeh scanned PDF hai to "automatic OCR" on rakhein.</p>');
          ta.addEventListener('input', () => $('.tx-c', card).textContent = counts(ta.value));
          $('.tx-copy', card).onclick = () => copy(ta.value);
          $('.tx-dl', card).onclick = () => download(new Blob([ta.value], { type: 'text/plain;charset=utf-8' }), f.name.replace(/\.[^.]+$/, '') + '.txt');
        } catch (e) {
          console.error(e);
          card.innerHTML = `<h3>${esc(f.name)}</h3><p class="err">${esc(e.message || 'File padh nahi payi.')}</p>`;
        }
        outBox.prepend(card);
      }
      if (results.length > 1 && !$f('#tx-all')) {
        outBox.insertAdjacentHTML('afterbegin', '<div class="row" id="tx-all" style="margin:0 0 14px"><button class="btn">📋 Saari files ka text copy karein</button></div>');
        $f('#tx-all button').onclick = () => copy(results.slice().reverse().map(c => `===== ${$('h3', c).textContent} =====\n` + $('.tx-area', c).value).join('\n\n'));
      }
      say('✅ Ho gaya! Text neeche hai – Copy button dabayein.');
      busy = false;
    }

    $f('#tx-file').addEventListener('change', e => { run(e.target.files); e.target.value = ''; });
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.style.background = '#e0ecff'; }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.style.background = '#f8faff'; }));
    drop.addEventListener('drop', e => run(e.dataTransfer.files));

    const onPaste = e => {
      const imgs = [...(e.clipboardData?.files || [])].filter(f => f.type.startsWith('image/'));
      if (imgs.length) { e.preventDefault(); run(imgs.map((f, i) => new File([f], 'pasted-image-' + (i + 1) + '.png', { type: f.type }))); }
    };
    document.addEventListener('paste', onPaste);
    CLEANUP = () => document.removeEventListener('paste', onPaste);
  });
})();
