/* ===== PJ – Background Remover =====
   Runs in the browser: the photo is not uploaded. The AI library and model are downloaded on first use.
   Library: @imgly/background-removal (AGPL-3.0 licence). */
(function () {
  if (typeof TOOLS === 'undefined') return;
  const base = TOOLS.find(t => t.id === 'resume-improvement') || TOOLS[0];
  if (!base || TOOLS.some(t => t.id === 'bg-remover')) return;

  const VER = '1.7.0';
  const SOURCES = [
    `https://cdn.jsdelivr.net/npm/@imgly/background-removal@${VER}/+esm`,
    `https://esm.sh/@imgly/background-removal@${VER}`
  ];
  let libPromise = null;
  const loadLib = () => libPromise || (libPromise = (async () => {
    let last;
    for (const src of SOURCES) {
      try {
        const m = await import(src), fn = m.removeBackground || m.default;
        if (typeof fn === 'function') return fn;
      } catch (e) { last = e; }
    }
    libPromise = null;
    throw last || new Error('Library load nahi hui');
  })());

  const css = document.createElement('style');
  css.textContent = `
  .px-drop{border:2px dashed #93c5fd;border-radius:14px;padding:30px 16px;text-align:center;cursor:pointer;background:#f8faff}
  .px-drop.on{background:#e0e7ff}
  .px-two{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:16px}
  .px-two img,.px-two canvas{max-width:100%;max-height:460px;display:block;margin:0 auto;border-radius:10px}
  .px-check{background:repeating-conic-gradient(#e2e8f0 0 25%,#fff 0 50%) 0 0/20px 20px;border-radius:10px}
  .px-sw{width:34px;height:34px;border-radius:50%;border:2px solid #cbd5e1;cursor:pointer;padding:0}
  .px-sw.on{outline:3px solid #2563eb}`;
  document.head.appendChild(css);

  function render(el) {
    el.innerHTML = `
      <div class="card">
        <div class="px-drop" tabindex="0"><b>🖼️ Photo upload karein</b> – click, drag-drop ya Ctrl+V<br>
          <small class="note">JPG · PNG · WEBP — photo aapke device par hi process hoti hai</small></div>
        <input type="file" accept="image/png,image/jpeg,image/webp" hidden>
        <p class="note" data-status role="status">Pehli baar AI model download hota hai, isliye thoda time aur data lagega.</p>
      </div>
      <div class="card" data-result hidden>
        <div class="px-two">
          <div><h4>Original</h4><img data-before alt="Original photo"></div>
          <div><h4>Result</h4><div class="px-check"><canvas data-after></canvas></div></div>
        </div>
        <div class="row" style="align-items:center">
          <span>Background:</span>
          <button type="button" class="tab on" data-bg="">Transparent</button>
          <button type="button" class="px-sw" data-bg="#ffffff" style="background:#ffffff" title="White"></button>
          <button type="button" class="px-sw" data-bg="#3b82f6" style="background:#3b82f6" title="Blue"></button>
          <button type="button" class="px-sw" data-bg="#dc2626" style="background:#dc2626" title="Red"></button>
          <input type="color" data-color value="#22c55e" title="Apna colour" style="width:52px;padding:2px">
        </div>
        <div class="row">
          <button type="button" class="btn" data-png>⬇ PNG download</button>
          <button type="button" class="btn ghost" data-jpg>⬇ JPG download</button>
        </div>
      </div>`;

    const q = s => el.querySelector(s);
    const drop = q('.px-drop'), input = q('input[type=file]'), status = q('[data-status]'),
      result = q('[data-result]'), before = q('[data-before]'), canvas = q('[data-after]');
    let cut = null, bg = '', job = 0, beforeUrl = '';

    const paint = (target, color) => {
      target.width = cut.naturalWidth; target.height = cut.naturalHeight;
      const c = target.getContext('2d');
      if (color) { c.fillStyle = color; c.fillRect(0, 0, target.width, target.height); }
      c.drawImage(cut, 0, 0);
    };

    async function take(file) {
      if (!file) return;
      if (!/^image\/(png|jpeg|webp)$/.test(file.type)) { status.textContent = '❌ Sirf JPG, PNG ya WEBP photo chunein.'; return; }
      if (file.size > 15 * 1024 * 1024) { status.textContent = '❌ Photo 15 MB se chhoti honi chahiye.'; return; }
      const my = ++job;
      result.hidden = true; cut = null;
      status.textContent = '⏳ AI load ho raha hai…';
      try {
        const removeBackground = await loadLib();
        const blob = await removeBackground(file, {
          progress: (key, cur, total) => {
            if (my !== job) return;
            status.textContent = String(key).startsWith('fetch') && total
              ? `⏳ Model download: ${Math.round(cur / total * 100)}%` : '⏳ Background hat raha hai…';
          }
        });
        if (my !== job) return;
        const img = new Image(), url = URL.createObjectURL(blob);
        img.src = url; await img.decode(); URL.revokeObjectURL(url);
        if (my !== job) return;
        cut = img;
        if (beforeUrl) URL.revokeObjectURL(beforeUrl);
        beforeUrl = URL.createObjectURL(file); before.src = beforeUrl;
        paint(canvas, bg); result.hidden = false;
        status.textContent = '✅ Ho gaya! Background colour chunein aur download karein.';
      } catch (e) {
        console.error(e);
        if (my === job) status.textContent = '❌ Background remove nahi ho paya. Internet check karein, ya chhoti photo se dobara try karein. (' + (e.message || e) + ')';
      }
    }

    const save = (type, ext, color) => {
      if (!cut) return;
      const out = document.createElement('canvas'); paint(out, color);
      out.toBlob(b => {
        const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'no-background.' + ext;
        document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
      }, type, 0.92);
    };
    const setBg = (color, btn) => {
      bg = color;
      el.querySelectorAll('[data-bg]').forEach(b => b.classList.toggle('on', b === btn));
      if (cut) paint(canvas, bg);
    };

    drop.onclick = () => input.click();
    drop.onkeydown = e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); input.click(); } };
    input.onchange = () => { take(input.files[0]); input.value = ''; };
    drop.ondragover = e => { e.preventDefault(); drop.classList.add('on'); };
    drop.ondragleave = () => drop.classList.remove('on');
    drop.ondrop = e => { e.preventDefault(); drop.classList.remove('on'); take(e.dataTransfer.files[0]); };
    const onPaste = e => {
      if (!drop.isConnected) return document.removeEventListener('paste', onPaste);
      const f = [...(e.clipboardData?.files || [])].find(x => x.type.startsWith('image/'));
      if (f) take(f);
    };
    document.addEventListener('paste', onPaste);
    el.querySelectorAll('[data-bg]').forEach(b => b.onclick = () => setBg(b.dataset.bg, b));
    q('[data-color]').oninput = e => setBg(e.target.value, null);
    q('[data-png]').onclick = () => save('image/png', 'png', bg);
    q('[data-jpg]').onclick = () => save('image/jpeg', 'jpg', bg || '#ffffff'); // JPG has no transparency
  }

  /* Copy the shape of an existing tool entry, then swap in this tool's name and icon. */
  const NAME = 'Background Remover', DESC = 'Photo ka background hatayein – free, aapke browser mein';
  const tool = Object.assign({}, base, { id: 'bg-remover', desc: DESC, render });
  Object.keys(base).forEach(k => {
    const v = base[k];
    if (typeof v !== 'string' || k === 'id' || k === 'desc') return;
    if (/^(name|title|label|n|t)$/i.test(k) || /resume.*improv/i.test(v)) tool[k] = NAME;
    else if (v.length <= 8 && /\p{Extended_Pictographic}/u.test(v)) tool[k] = '🪄';
  });
  TOOLS.push(tool);
})();
