/* =====================================================================
   PJ Studio Pro – UI  (full-screen CapCut-style editor)
   ===================================================================== */
(function () {
  'use strict';
  const VS = window.PJVS; if (!VS) return;
  const S = VS.S, MEDIA = VS.media, clamp = VS.clamp;
  const E = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const say = m => { if (typeof toast === 'function') toast(m); else { const d = document.createElement('div'); d.textContent = m; d.style.cssText = 'position:fixed;left:50%;bottom:30px;transform:translateX(-50%);background:#000d;color:#fff;padding:10px 16px;border-radius:10px;z-index:3000;font:13px Poppins,sans-serif'; document.body.appendChild(d); setTimeout(() => d.remove(), 2200); } };
  const fmt = t => { t = Math.max(0, t || 0); const m = Math.floor(t / 60), s = t - m * 60; return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s.toFixed(1); };
  const ICON = { video: '🎬', image: '🖼', text: '🔤', sticker: '😀', effect: '✨', adjust: '🎨', audio: '🎵' };
  const KEYP = ['x', 'y', 's', 'rot', 'op'];
  const SYS = ['Arial', 'Impact', 'Georgia', 'Courier New', 'Comic Sans MS', 'Trebuchet MS', 'Verdana', 'Times New Roman'];
  const GF = ['Poppins', 'Montserrat', 'Oswald', 'Bebas Neue', 'Anton', 'Bangers', 'Pacifico', 'Lobster', 'Permanent Marker', 'Orbitron', 'Playfair Display', 'Dancing Script', 'Press Start 2P', 'Righteous', 'Hind', 'Mukta', 'Kalam', 'Yatra One', 'Noto Sans Devanagari', 'Rozha One'];
  const GF_URL = 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Anton&family=Bangers&family=Pacifico&family=Lobster&family=Oswald:wght@700&family=Montserrat:wght@400;700&family=Permanent+Marker&family=Orbitron:wght@700&family=Playfair+Display:wght@700&family=Dancing+Script:wght@700&family=Press+Start+2P&family=Righteous&family=Hind:wght@400;700&family=Mukta:wght@400;700&family=Kalam:wght@400;700&family=Yatra+One&family=Noto+Sans+Devanagari:wght@400;700&family=Rozha+One&display=swap';
  function ensureFont(name) { try { if (document.fonts && name) { document.fonts.load('700 40px "' + name + '"').then(() => VS.rq()).catch(() => { }); document.fonts.load('400 40px "' + name + '"').catch(() => { }); } } catch (e) { } }

  /* ---------- presets ---------- */
  const TP = [
    { n: 'Basic', s: {} },
    { n: 'Bold outline', s: { size: 112, stroke: { on: true, c: '#000000', w: 14 }, shadow: { on: false } }, a: { in: ['pop', .5] } },
    { n: 'Neon cyan', s: { color: '#e8ffff', glow: { on: true, c: '#00e5ff', b: 44 }, shadow: { on: false } }, a: { in: ['fade', .5], loop: ['flicker', .6] } },
    { n: 'Neon pink', s: { color: '#fff0fa', glow: { on: true, c: '#ff2bd6', b: 44 }, shadow: { on: false } }, a: { in: ['blur', .6] } },
    { n: 'Yellow caption', s: { font: 'Bangers', size: 118, color: '#ffe600', upper: true, stroke: { on: true, c: '#000000', w: 14 }, shadow: { on: false } }, a: { in: ['pop', .4] } },
    { n: 'Subtitle box', s: { size: 62, bold: false, bg: { on: true, c: '#000000', a: .66, pad: 20, r: 14 }, shadow: { on: false } }, y: 32 },
    { n: 'Sunset', s: { font: 'Anton', size: 130, grad: { on: true, c1: '#ff512f', c2: '#f9d423' }, shadow: { on: true, c: '#000000aa', b: 12, x: 0, y: 8 } }, a: { in: ['slideU', .6] } },
    { n: 'Ocean', s: { font: 'Montserrat', size: 112, grad: { on: true, c1: '#00c6ff', c2: '#7c5cff' }, shadow: { on: false } }, a: { in: ['zoomIn', .6] } },
    { n: 'Retro', s: { font: 'Pacifico', size: 120, bold: false, stroke: { on: true, c: '#ff2e63', w: 10 }, shadow: { on: true, c: '#08d9d6', b: 0, x: 8, y: 8 } }, a: { in: ['rubber', .8] } },
    { n: '3D shadow', s: { font: 'Bebas Neue', size: 150, color: '#fff700', shadow: { on: true, c: '#ff0055', b: 0, x: 9, y: 9 } }, a: { in: ['drop', .8] } },
    { n: 'Comic', s: { font: 'Bangers', size: 126, upper: true, stroke: { on: true, c: '#e11d48', w: 16 }, shadow: { on: true, c: '#000000', b: 0, x: 7, y: 7 } }, a: { in: ['bounce', .7], loop: ['wobble', .8] } },
    { n: 'Minimal', s: { font: 'Montserrat', size: 68, bold: false, ls: 14, upper: true, shadow: { on: false } }, a: { in: ['fade', .8] } },
    { n: 'Glitch', s: { font: 'Orbitron', size: 104, glow: { on: true, c: '#ff00aa', b: 22 }, shadow: { on: false } }, a: { in: ['glitch', .8] } },
    { n: 'Typewriter', s: { font: 'Courier New', size: 76, color: '#7CFF9B', bg: { on: true, c: '#000000', a: .75, pad: 22, r: 8 }, shadow: { on: false } }, a: { in: ['tw', 1.6] } },
    { n: 'Karaoke', s: { size: 84, stroke: { on: true, c: '#000000', w: 12 }, hl: '#ffd400', shadow: { on: false } }, a: { in: ['karaoke', 2] } },
    { n: 'Lower third', s: { size: 54, align: 'left', w: 60, bg: { on: true, c: '#e11d48', a: 1, pad: 22, r: 6 }, shadow: { on: false } }, x: -14, y: 32, a: { in: ['slideL', .5], out: ['slideL', .4] } },
    { n: 'Hindi bold', s: { font: 'Yatra One', size: 120, bold: false, stroke: { on: true, c: '#000000', w: 12 }, shadow: { on: false } }, a: { in: ['pop', .5] } },
    { n: 'Rainbow', s: { font: 'Righteous', size: 118, stroke: { on: true, c: '#000000', w: 8 }, shadow: { on: false } }, a: { loop: ['crainbow', .6] } },
    { n: 'Wavy', s: { font: 'Poppins', size: 110, stroke: { on: true, c: '#000000', w: 10 }, shadow: { on: false } }, a: { in: ['crise', 1], loop: ['wave', .9] } },
    { n: 'Handwritten', s: { font: 'Dancing Script', size: 130, shadow: { on: true, c: '#000000aa', b: 10, x: 0, y: 5 } }, a: { in: ['wipeL', .9] } },
    { n: 'Fire', s: { font: 'Anton', size: 140, grad: { on: true, c1: '#ff0000', c2: '#ffd000' }, glow: { on: true, c: '#ff6a00', b: 34 }, shadow: { on: false } }, a: { in: ['zoomIn', .5], loop: ['pulse', .8] } },
    { n: 'Letters pop', s: { font: 'Poppins', size: 110, stroke: { on: true, c: '#000000', w: 10 }, shadow: { on: false } }, a: { in: ['cpop', 1] } }
    ,{ n: 'Neon pink', s: { font: 'Poppins', size: 120, color: '#ffffff', glow: { on: true, c: '#ff2bd6', b: 40 }, shadow: { on: false } }, a: { in: ['neonOn', .9], loop: ['neon', .8] } },
    { n: 'Neon blue', s: { font: 'Orbitron', size: 104, color: '#e8fbff', glow: { on: true, c: '#00d0ff', b: 40 }, shadow: { on: false } }, a: { in: ['neonOn', .9], loop: ['neon', .8] } },
    { n: 'Gold luxury', s: { font: 'Playfair Display', size: 120, ls: 6, upper: true, grad: { on: true, c1: '#fff3b0', c2: '#c8921a' }, shadow: { on: true, c: '#000000aa', b: 14, x: 0, y: 6 } }, a: { in: ['zoomBlur', .9] } },
    { n: 'Chrome', s: { font: 'Anton', size: 140, grad: { on: true, c1: '#ffffff', c2: '#7b8794' }, stroke: { on: true, c: '#111111', w: 6 }, shadow: { on: true, c: '#000000cc', b: 10, x: 0, y: 8 } }, a: { in: ['pop', .5] } },
    { n: 'RGB glitch', s: { font: 'Orbitron', size: 110, color: '#ffffff', shadow: { on: true, c: '#00ffff', b: 0, x: 7, y: 0 }, glow: { on: true, c: '#ff0066', b: 8 } }, a: { in: ['cglitch', 1.2], loop: ['glitchLoop', .8] } },
    { n: 'Cinematic title', s: { font: 'Playfair Display', size: 96, ls: 18, upper: true, bold: false, shadow: { on: true, c: '#000000aa', b: 16, x: 0, y: 4 } }, a: { in: ['cblur', 1.6], out: ['fade', .6] } },
    { n: 'Sticker outline', s: { font: 'Bangers', size: 130, color: '#ffffff', upper: true, stroke: { on: true, c: '#7c3aed', w: 22 }, shadow: { on: true, c: '#000000aa', b: 0, x: 0, y: 9 } }, a: { in: ['jelly', .8], loop: ['wobble', 1] } },
    { n: 'Instagram', s: { font: 'Montserrat', size: 112, grad: { on: true, c1: '#f9ce34', c2: '#ee2a7b' }, shadow: { on: false } }, a: { in: ['slideU', .5], loop: ['float', 1.4] } },
    { n: 'Horror', s: { font: 'Permanent Marker', size: 124, color: '#e11d1d', bold: false, shadow: { on: true, c: '#000000', b: 18, x: 0, y: 8 }, glow: { on: true, c: '#ff0000', b: 26 } }, a: { in: ['cscatter', 1.1], loop: ['jitter', .6] } },
    { n: 'Hindi neon', s: { font: 'Noto Sans Devanagari', size: 120, color: '#ffffff', glow: { on: true, c: '#22ffb0', b: 36 }, shadow: { on: false } }, a: { in: ['neonOn', .9], loop: ['neon', .9] } },
    { n: 'Sale tag', s: { font: 'Anton', size: 96, color: '#ffffff', upper: true, bg: { on: true, c: '#e11d48', a: 1, pad: 26, r: 14 }, shadow: { on: false } }, a: { in: ['tada', .8], loop: ['tada', 2] } },
    { n: 'Bubble', s: { font: 'Righteous', size: 80, color: '#111111', bold: false, bg: { on: true, c: '#ffffff', a: 1, pad: 28, r: 40 }, shadow: { on: true, c: '#00000066', b: 14, x: 0, y: 8 } }, a: { in: ['squash', .6] } },
    { n: 'Highlight', s: { font: 'Poppins', size: 78, color: '#111111', bg: { on: true, c: '#ffe600', a: 1, pad: 16, r: 6 }, shadow: { on: false } }, a: { in: ['wipeL', .5] } },
    { n: 'Cyber', s: { font: 'Orbitron', size: 100, color: '#00fff0', upper: true, stroke: { on: true, c: '#0a0a2a', w: 8 }, glow: { on: true, c: '#00fff0', b: 22 }, shadow: { on: false } }, a: { in: ['cscatter', 1], loop: ['glitchLoop', .8] } },
    { n: 'Pixel game', s: { font: 'Press Start 2P', size: 62, bold: false, color: '#fff700', stroke: { on: true, c: '#000000', w: 10 }, shadow: { on: true, c: '#ff3b3b', b: 0, x: 6, y: 6 } }, a: { in: ['tw', 1.4], loop: ['cflicker', 1] } },
    { n: 'Subscribe pill', s: { font: 'Poppins', size: 64, color: '#ffffff', upper: true, bg: { on: true, c: '#ff0000', a: 1, pad: 24, r: 60 }, shadow: { on: true, c: '#00000055', b: 12, x: 0, y: 6 } }, y: 30, a: { in: ['elasticU', .9], loop: ['zoomPunch', 1.6] } },
    { n: 'Quote script', s: { font: 'Dancing Script', size: 110, color: '#fff6e0', shadow: { on: true, c: '#000000aa', b: 14, x: 0, y: 6 } }, a: { in: ['cslide', 1.4] } },
    { n: 'Blur reveal', s: { font: 'Montserrat', size: 100, ls: 8, upper: true, shadow: { on: false } }, a: { in: ['zoomBlur', .9], out: ['blur', .5] } },
    { n: 'Rainbow pop', s: { font: 'Bangers', size: 130, upper: true, stroke: { on: true, c: '#000000', w: 14 }, shadow: { on: false } }, a: { in: ['cpop', 1], loop: ['cneon', .7] } },
    { n: 'Flip title', s: { font: 'Bebas Neue', size: 160, ls: 8, color: '#ffffff', shadow: { on: true, c: '#ff0055', b: 0, x: 8, y: 8 } }, a: { in: ['cflip', 1.2], loop: ['cwobble', 1.6] } }
  ];
  const EMO = {
    'Smiles': '😀😂🤣😍🥰😎🤩😜🤪😇🥳😭😱🤯😡🥺😴🤔🙄😏🤗🤫🤭🥵🥶😈💀👻🤡', 'Love': '❤🧡💛💚💙💜🖤🤍💖💗💘💝💕💞💓💔❣💌🌹😘', 'Hands': '👍👎👏🙌🙏💪👊✌🤞🤟🤘👌👆👇👉👈🫶🤝✋🖐👋', 'Fun': '🔥⭐🌟✨💥💫🎉🎊🎈🎁🏆🥇👑💎💰💸🚀🌈⚡☀🌙❄💯✅❌⚠❗❓',
    'Objects': '🎬🎥📷🎤🎧🎵🎶📱💻⌚📺📢🔔💡📌📍🔒🔑🛒🏠🚗✈⚽🏀🎮', 'Animals': '🐶🐱🐭🐻🐼🦁🐯🐸🐵🦄🐔🐧🦋🐝🐢🐬', 'Food': '🍕🍔🍟🌭🍿🍩🍪🎂🍫🍎🍉🍓☕🍺🥤🍜', 'India': '🇮🇳🕉🪔🛕🙏🥭🏏🧿🪁🎆🚩', 'Festive': '🎉🎊🎆🎇✨🎈🎁🔥💥⚡🌟⭐🏆👑💎💯🎂🥳📣🔔'
  };
  const SH_COLORS = ['#ffffff', '#ff3366', '#ffcc00', '#00e0c6', '#4d7cff', '#a855f7', '#22c55e', '#000000'];

  let root = null, tab = 'media', zoom = 70, ZMAX = 400, fxMode = 'layer', filtMode = 'clip', recState = null, lastFrame = 0;
  const $ = (s, r) => (r || root).querySelector(s), $$ = (s, r) => [...(r || root).querySelectorAll(s)];
  const sel = () => VS.clipById(S.sel);
  const laneOfClip = c => VS.laneById(c.lane);
  const get = (o, p) => p.split('.').reduce((a, k) => a == null ? a : a[k], o);
  const setp = (o, p, v) => { const ks = p.split('.'); let t = o; for (let i = 0; i < ks.length - 1; i++) t = t[ks[i]]; t[ks[ks.length - 1]] = v; };
  const c6 = v => /^#[0-9a-f]{6}/i.test(v) ? v.slice(0, 7) : '#000000';

  /* ================================================================ open / close */
  VS.open = function () {
    if (root) return;
    if (!document.getElementById('pjvs-gf')) { const l = document.createElement('link'); l.id = 'pjvs-gf'; l.rel = 'stylesheet'; l.href = GF_URL; document.head.appendChild(l); }
    document.body.style.overflow = 'hidden';
    root = document.createElement('div'); root.id = 'pjvs';
    root.innerHTML =
      '<div class="vs-top"><span class="vs-logo">🎬 PJ Studio Pro</span>' +
      '<button data-act="import">➕ Import</button><select id="vs-ratio" title="Canvas ratio">' + Object.keys(VS.RATIOS).map(r => '<option>' + r + '</option>').join('') + '</select>' +
      '<button data-act="undo" id="vs-undo" title="Undo (Ctrl+Z)">↶</button><button data-act="redo" id="vs-redo" title="Redo (Ctrl+Y)">↷</button><span class="vs-sp"></span>' +
      '<button data-act="help" title="Shortcuts">⌨</button><button class="pri" data-act="export">⬇ Export</button><button data-act="close" title="Close studio">✕</button></div>' +
      '<div class="vs-body" data-m="lib"><div class="vs-main">' +
      '<div class="vs-left"><div class="vs-tabs" id="vs-tabs"></div><div class="vs-pan" id="vs-pan"></div></div>' +
      '<div class="vs-center"><div class="vs-stage" id="vs-stage"><div class="vs-wrap" id="vs-wrap"><canvas id="vs-cv"></canvas><div class="vs-sel" id="vs-selbox" hidden><i class="tl" data-h="tl"></i><i class="tr" data-h="tr"></i><i class="bl" data-h="bl"></i><i class="br" data-h="br"></i><i class="rot" data-h="rot"></i></div></div></div>' +
      '<div class="vs-ctl"><button class="vs-play pri" id="vs-play" data-act="play">▶</button><button data-act="tostart" title="Start">⏮</button><button data-act="toend" title="End">⏭</button><span class="tm" id="vs-tm">00:00.0 / 00:00.0</span><span class="vs-sp"></span><button data-act="snap" title="Save frame as PNG">📷</button><button data-act="full" title="Full screen preview">⛶</button></div></div>' +
      '<div class="vs-right" id="vs-insp"></div></div>' +
      '<div class="vs-tl"><div class="vs-tlbar">' +
      '<button data-act="split" title="Split at playhead (S)">✂ Split</button><button data-act="del" title="Delete (Del)">🗑 Delete</button><button data-act="dup" title="Duplicate (Ctrl+D)">⧉ Duplicate</button><button data-act="freeze" title="Freeze frame">❄ Freeze</button><button data-act="detach" title="Extract audio">🔊 Detach audio</button><button data-act="marker" title="Marker (M)">◆ Marker</button><button data-act="beats" title="Auto beat markers">🥁 Beats</button>' +
      '<span class="zm"><button data-act="zout">−</button><input type="range" id="vs-zoom" min="10" max="400" value="70"><button data-act="zin">＋</button><button data-act="zfit">Fit</button></span></div>' +
      '<div class="vs-tlbody" id="vs-tlb"><div class="vs-tlin" id="vs-tlin"></div></div></div></div>' +
      '<div class="vs-mtabs"><button data-act="m:lib" id="vs-m-lib" class="on">➕ Add</button><button data-act="m:edit" id="vs-m-edit">✎ Edit</button></div>' +
      '<div class="vs-drop" id="vs-drop">Drop videos, photos or music here</div>' +
      '<input type="file" id="vs-file" multiple accept="video/*,image/*,audio/*" hidden>';
    document.body.appendChild(root);
    VS.cv = $('#vs-cv');
    $('#vs-ratio').value = S.ratio; $('#vs-zoom').value = zoom;
    bind(); renderTabs(); renderPanel(); renderInsp(); renderTL(); fitPreview(); VS.renderPreview(); updBtns();
    VS.hooks.onChange = onChange; VS.hooks.onTick = onTick; VS.hooks.onFrame = onFrame; VS.hooks.onPlay = updPlay; VS.hooks.onMedia = () => { if (tab === 'media' || tab === 'audio') renderPanel(); renderTL(); };
    ['Poppins'].forEach(ensureFont);
  };
  VS.close = function () {
    if (!root) return; VS.pause(); VS.cancelExport(); window.removeEventListener('keydown', onKey, true); window.removeEventListener('resize', fitPreview); if (ro) ro.disconnect();
    root.remove(); root = null; VS.cv = null; document.body.style.overflow = ''; VS.hooks = {};
  };
  VS.isOpen = () => !!root;

  /* ================================================================ binding */
  let ro = null;
  function bind() {
    root.addEventListener('click', onClick);
    root.addEventListener('input', onInput);
    root.addEventListener('change', onChange2);
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('resize', fitPreview);
    ro = new ResizeObserver(fitPreview); ro.observe($('#vs-stage'));
    $('#vs-file').addEventListener('change', async e => { await importFiles(e.target.files); e.target.value = ''; });
    $('#vs-ratio').addEventListener('change', e => { S.ratio = e.target.value; VS.commit(true); fitPreview(); });
    $('#vs-zoom').addEventListener('input', e => { setZoom(+e.target.value); });
    $('#vs-tlb').addEventListener('pointerdown', tlDown);
    const stage = $('#vs-wrap'); stage.addEventListener('pointerdown', stageDown); stage.addEventListener('dblclick', () => { const c = sel(); if (c && c.kind === 'text') { const t = $('[data-p="text.txt"]'); if (t) { root.querySelector('.vs-main').parentNode.dataset.m = 'edit'; t.focus(); t.select(); } } });
    $$('[data-h]').forEach(h => h.addEventListener('pointerdown', handleDown));
    ['dragenter', 'dragover'].forEach(n => root.addEventListener(n, e => { if (e.dataTransfer && [...e.dataTransfer.types].some(x => x === 'Files' || x === 'text/pjvs')) { e.preventDefault(); if (e.dataTransfer.types.includes('Files')) $('#vs-drop').style.display = 'grid'; } }));
    ['dragleave', 'drop'].forEach(n => root.addEventListener(n, e => { if (n === 'drop' || e.target === root) $('#vs-drop').style.display = 'none'; }));
    root.addEventListener('drop', async e => {
      e.preventDefault(); $('#vs-drop').style.display = 'none';
      const mid = e.dataTransfer.getData('text/pjvs');
      if (mid) { dropMedia(mid, e); return; }
      if (e.dataTransfer.files && e.dataTransfer.files.length) await importFiles(e.dataTransfer.files);
    });
  }
  async function importFiles(files) {
    let n = 0; const first = !S.clips.length;
    for (const f of [...files]) {
      try { say('Importing ' + f.name + '…'); const m = await VS.importFile(f); n++; if (m.kind !== 'audio' || first) { /* add video/image to timeline immediately for the first import */ }
        if (first && n === 1 && m.kind !== 'audio') { VS.addMediaClip(m.id); S.ratio = ratioFor(m); $('#vs-ratio').value = S.ratio; fitPreview(); zoomFit(); } }
      catch (e) { say(e.message || 'Import failed'); }
    }
    if (n) { renderPanel(); say(n + ' file' + (n > 1 ? 's' : '') + ' imported ✓'); }
  }
  function ratioFor(m) { if (!m.w || !m.h) return S.ratio; const r = m.w / m.h; return r < .7 ? '9:16' : r < .9 ? '4:5' : r < 1.15 ? '1:1' : r < 1.5 ? '4:3' : '16:9'; }

  /* ================================================================ preview sizing + selection box */
  function fitPreview() {
    if (!root) return; const st = $('#vs-stage'), wrap = $('#vs-wrap'), [DW, DH] = VS.dims(); const aw = st.clientWidth - 20, ah = st.clientHeight - 20; if (aw < 40 || ah < 40) return;
    const k = Math.min(aw / DW, ah / DH), w = Math.floor(DW * k), h = Math.floor(DH * k); wrap.style.width = w + 'px'; wrap.style.height = h + 'px';
    const q = Math.min(window.devicePixelRatio || 1, 1.5), cap = 1000 / Math.max(DW, DH), sc = Math.min(w * q / DW, cap, 1.2);
    const cw = Math.max(2, Math.round(DW * sc)), ch = Math.max(2, Math.round(DH * sc)); if (VS.cv.width !== cw || VS.cv.height !== ch) { VS.cv.width = cw; VS.cv.height = ch; }
    VS.renderPreview();
  }
  function onFrame() {
    if (!root) return; const box = $('#vs-selbox'), c = sel();
    if (!c || !VS.selectable(c) || S.t < c.start - 1e-6 || S.t >= c.start + c.dur || VS.EXP.running) { box.hidden = true; return; }
    const b = VS.boxOf(c, S.t); if (!b) { box.hidden = true; return; }
    const wrap = $('#vs-wrap'), [DW] = VS.dims(), k = wrap.clientWidth / DW;
    box.hidden = false; box.style.width = b.w * k + 'px'; box.style.height = b.h * k + 'px'; box.style.left = (b.cx - b.w / 2) * k + 'px'; box.style.top = (b.cy - b.h / 2) * k + 'px'; box.style.transform = 'rotate(' + b.rot + 'deg)';
  }
  function stagePos(e) { const r = $('#vs-wrap').getBoundingClientRect(), [DW, DH] = VS.dims(); return { x: (e.clientX - r.left) / r.width * DW, y: (e.clientY - r.top) / r.height * DH, DW, DH }; }
  function stageDown(e) {
    if (e.target.dataset && e.target.dataset.h) return; e.preventDefault();
    const p = stagePos(e); let c = sel();
    const b = c && VS.selectable(c) ? VS.boxOf(c, S.t) : null; let inside = false;
    if (b && c && S.t >= c.start && S.t < c.start + c.dur) { const a = -b.rot * Math.PI / 180, dx = p.x - b.cx, dy = p.y - b.cy, lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a); inside = Math.abs(lx) <= b.w / 2 && Math.abs(ly) <= b.h / 2; }
    if (!inside) { const h = VS.hitTest(p.x, p.y, S.t); if (!h) { if (S.sel) { S.sel = null; renderTL(); renderInsp(); VS.renderPreview(); } return; } c = h; if (S.sel !== h.id) { S.sel = h.id; renderTL(); renderInsp(); VS.renderPreview(); mTab('edit', true); } }
    const lt = () => S.t - c.start, ox = VS.propVal(c, 'x', lt()), oy = VS.propVal(c, 'y', lt()), sx = e.clientX, sy = e.clientY; let moved = false;
    const mv = ev => { const r = $('#vs-wrap').getBoundingClientRect(), [DW, DH] = VS.dims(), dx = (ev.clientX - sx) / r.width * 100, dy = (ev.clientY - sy) / r.height * 100; if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 3) return; moved = true;
      let nx = ox + dx, ny = oy + dy; if (Math.abs(nx) < 1.6) nx = 0; if (Math.abs(ny) < 1.6) ny = 0; VS.setProp(c, 'x', +nx.toFixed(2), lt()); VS.setProp(c, 'y', +ny.toFixed(2), lt()); VS.renderPreview(); syncInsp(); };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); if (moved) VS.commit(); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  }
  function handleDown(e) {
    e.stopPropagation(); e.preventDefault(); const c = sel(); if (!c) return; const kind = e.target.dataset.h, lt = () => S.t - c.start, b = VS.boxOf(c, S.t); if (!b) return;
    const r = $('#vs-wrap').getBoundingClientRect(), [DW, DH] = VS.dims(), kx = r.width / DW, cx = r.left + b.cx * kx, cy = r.top + b.cy * kx, d0 = Math.hypot(e.clientX - cx, e.clientY - cy) || 1, s0 = VS.propVal(c, 's', lt()), r0 = VS.propVal(c, 'rot', lt()), a0 = Math.atan2(e.clientY - cy, e.clientX - cx);
    const mv = ev => {
      if (kind === 'rot') { let a = (Math.atan2(ev.clientY - cy, ev.clientX - cx) - a0) * 180 / Math.PI, nr = r0 + a; const sn = Math.round(nr / 45) * 45; if (Math.abs(nr - sn) < 3) nr = sn; VS.setProp(c, 'rot', +nr.toFixed(1), lt()); }
      else { const d = Math.hypot(ev.clientX - cx, ev.clientY - cy); VS.setProp(c, 's', +clamp(s0 * d / d0, 5, 600).toFixed(1), lt()); }
      VS.renderPreview(); syncInsp();
    };
    const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); VS.commit(); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  }

  /* ================================================================ tabs + panels */
  const TABS = [['media', '🎞', 'Media'], ['audio', '🎵', 'Audio'], ['text', '🔤', 'Text'], ['stick', '😀', 'Stickers'], ['fx', '✨', 'Effects'], ['trans', '🔀', 'Transitions'], ['filt', '🎨', 'Filters'], ['cap', '💬', 'Captions']];
  function renderTabs() { $('#vs-tabs').innerHTML = TABS.map(t => '<button data-tab="' + t[0] + '" class="' + (tab === t[0] ? 'on' : '') + '">' + t[1] + ' ' + t[2] + '</button>').join(''); }
  function chips(list, cur, act) { return '<div class="vs-grid">' + list.map(x => '<div class="vs-chip' + (cur === x[0] ? ' on' : '') + '" data-act="' + act + ':' + E(x[0]) + '"><b>' + (x[2] || '•') + '</b>' + E(x[1]) + '</div>').join('') + '</div>'; }
  function mediaCard(m) {
    const th = m.kind === 'image' ? '<img src="' + m.url + '" draggable="false">' : m.kind === 'video' && m.thumbs && m.thumbs[0] ? '<img src="' + m.thumbs[0] + '" draggable="false">' : '<div class="ph">' + (m.kind === 'audio' ? '🎵' : '🎬') + '</div>';
    return '<div class="vs-media" draggable="true" data-mid="' + m.id + '">' + th + (m.kind !== 'image' ? '<span class="du">' + fmt(m.dur) + '</span>' : '') + '<div class="ad"><button data-act="addm:' + m.id + '" title="Add to timeline">＋</button>' + (m.kind === 'video' || m.kind === 'image' ? '<button data-act="pip:' + m.id + '" title="Add as overlay (picture-in-picture)">PiP</button>' : '') + '</div><div class="nm">' + E(m.name) + '</div></div>';
  }
  function renderPanel() {
    if (!root) return; const p = $('#vs-pan'), ms = Object.values(MEDIA); let h = '';
    if (tab === 'media') {
      const vm = ms.filter(m => m.kind !== 'audio');
      h = '<button class="pri" style="width:100%;padding:12px" data-act="import">➕ Import videos & photos</button><p class="vs-note">Everything stays on your device. You can also drag & drop files here. Click ＋ to add to the main track, or <b>PiP</b> to put it on top as an overlay.</p><div class="vs-h">Your media</div>' + (vm.length ? '<div class="vs-grid">' + vm.map(mediaCard).join('') + '</div>' : '<p class="vs-note">No media yet.</p>');
    } else if (tab === 'audio') {
      const am = ms.filter(m => m.kind === 'audio' && !m.gen);
      h = '<div class="vs-row"><button class="pri" data-act="import">📁 Import audio</button><button id="vs-rec" data-act="rec">' + (recState ? '⏹ Stop recording' : '🎙 Record voice-over') + '</button></div><p class="vs-note">Voice-over records from your microphone at the playhead position. Sounds below are generated in your browser – free to use.</p>' +
        (am.length ? '<div class="vs-h">Your audio</div><div class="vs-grid">' + am.map(mediaCard).join('') + '</div>' : '') +
        '<div class="vs-h">Music loops</div>' + chips(VS.SOUNDS.filter(s => s.k === 'music').map(s => [s.id, s.n, s.i]), '', 'snd') + '<div class="vs-h">Sound effects</div>' + chips(VS.SOUNDS.filter(s => s.k === 'sfx').map(s => [s.id, s.n, s.i]), '', 'snd');
    } else if (tab === 'text') {
      h = '<button class="pri" style="width:100%;padding:12px" data-act="addtext">＋ Add default text</button><div class="vs-h">Text styles & animations</div><div class="vs-grid" style="grid-template-columns:repeat(2,1fr)">' + TP.map((t, i) => '<div class="vs-tp" data-act="tp:' + i + '" style="' + previewCss(t.s) + '">' + (t.s.upper ? 'TEXT' : /Yatra/.test(t.s.font || '') ? 'हिंदी' : 'Text') + '<div style="font:10px Poppins;color:#8b91a3;-webkit-text-stroke:0;text-shadow:none;background:none;-webkit-text-fill-color:#8b91a3">' + E(t.n) + '</div></div>').join('') + '</div>';
    } else if (tab === 'stick') {
      h = '<div class="vs-h">Shapes</div><div class="vs-row">' + SH_COLORS.map(c => '<button data-act="shcol:' + c + '" style="width:26px;height:26px;padding:0;background:' + c + ';' + (shapeColor === c ? 'outline:2px solid #00e0c6' : '') + '"></button>').join('') + '</div>' + chips(VS.SHAPES.map(s => [s[0], s[1], '◼']), '', 'shape') +
        Object.keys(EMO).map(k => '<div class="vs-h">' + k + '</div><div class="vs-grid" style="grid-template-columns:repeat(auto-fill,minmax(44px,1fr))">' + Array.from(EMO[k].replace(/️/g, '').match(/\p{Extended_Pictographic}(‍\p{Extended_Pictographic})*|\p{Regional_Indicator}{2}/gu) || []).map(e => '<div class="vs-chip" style="min-height:44px;font-size:24px;padding:4px" data-act="emo:' + e + '">' + e + '</div>').join('') + '</div>').join('');
    } else if (tab === 'fx') {
      h = '<div class="vs-row"><button data-act="fxmode:layer" class="' + (fxMode === 'layer' ? 'on' : '') + '">Effect layer</button><button data-act="fxmode:clip" class="' + (fxMode === 'clip' ? 'on' : '') + '">On selected clip</button></div><p class="vs-note">' + (fxMode === 'layer' ? 'Adds an effect on its own track at the playhead – it affects everything below it. Drag the edges to change how long it lasts.' : 'Applies the effect only to the selected clip.') + '</p>' +
        VS.LIST.fx.map(g => '<div class="vs-h">' + g[0] + '</div>' + chips(g[1], '', 'fx')).join('');
    } else if (tab === 'trans') {
      const c = sel(); h = '<p class="vs-note">Place two clips side by side on the same track, select the <b>second</b> clip, then tap a transition. Change its length in the Edit panel.</p>' + (c ? '<p class="vs-note">Selected: <b>' + E(c.name || c.kind) + '</b>' + (VS.adjPrev(c, VS.laneClips(c.lane)) ? ' ✓ has a clip before it' : ' – ⚠ no touching clip before it') + '</p>' : '<p class="vs-note">⚠ Select a clip first.</p>') +
        '<div class="vs-row"><button data-act="trans:" >✖ Remove</button><button data-act="transall">Apply selected style to all joints</button></div>' + chips(VS.LIST.trans, c && c.trans ? c.trans.type : '', 'trans');
    } else if (tab === 'filt') {
      const c = sel(); h = '<div class="vs-row"><button data-act="fmode:clip" class="' + (filtMode === 'clip' ? 'on' : '') + '">On selected clip</button><button data-act="fmode:layer" class="' + (filtMode === 'layer' ? 'on' : '') + '">Adjustment layer</button></div><p class="vs-note">' + (filtMode === 'layer' ? 'Adds a filter track that colours everything beneath it.' : 'Applies to the selected clip (select one first).') + '</p><div class="vs-grid" style="grid-template-columns:repeat(3,1fr)">' + VS.FILTERS.map(f => '<div class="vs-chip' + (c && c.preset === f.id ? ' on' : '') + '" data-act="filt:' + f.id + '" style="min-height:56px"><b style="font-size:14px;width:100%;height:20px;border-radius:5px;background:' + filtSwatch(f) + '"></b>' + E(f.n) + '</div>').join('') + '</div><div class="vs-row"><button data-act="filt:">✖ No filter</button></div>';
    } else if (tab === 'cap') {
      h = '<div class="vs-h">Captions from your script</div><textarea id="vs-script" rows="6" placeholder="Type or paste your script – one caption per line.\nExample:\nNamaste dosto!\nAaj hum seekhenge video editing"></textarea><div class="vs-row"><select id="vs-capscope" style="width:auto"><option value="all">Whole video</option><option value="clip">Selected clip only</option></select><select id="vs-capstyle" style="width:auto">' + [1, 4, 5, 14, 17, 20].map(i => '<option value="' + i + '">' + TP[i].n + '</option>').join('') + '</select></div><button class="pri" data-act="mkcap" style="width:100%">Create captions</button><p class="vs-note">Lines are timed by length. Fine-tune any caption by selecting it on the timeline. (Automatic speech-to-text is not possible offline in a browser – paste your script instead.)</p><div class="vs-h">Import subtitles (.srt)</div><button data-act="srt">📄 Choose .srt file</button><input type="file" id="vs-srt" accept=".srt,.txt" hidden>';
    }
    p.innerHTML = h; const sp = $('#vs-srt'); if (sp) sp.onchange = async e => { const f = e.target.files[0]; if (!f) return; const n = VS.importSRT(await f.text(), TP[+$('#vs-capstyle').value] && styleOf(TP[+$('#vs-capstyle').value])); say(n ? n + ' captions added ✓' : 'No subtitles found in that file'); e.target.value = ''; };
    $$('.vs-media', p).forEach(el => el.addEventListener('dragstart', e => { e.dataTransfer.setData('text/pjvs', el.dataset.mid); e.dataTransfer.effectAllowed = 'copy'; }));
  }
  let shapeColor = '#ffffff';
  function filtSwatch(f) { const t = f.tint ? f.tint[0] : '#888'; return f.f.indexOf('grayscale(1)') >= 0 ? 'linear-gradient(90deg,#111,#eee)' : 'linear-gradient(90deg,#4d7cff,' + t + ',#ffcf4d)'; }
  function previewCss(s) {
    let css = 'font-family:"' + (s.font || 'Poppins') + '",Poppins,sans-serif;font-weight:' + (s.bold === false ? 400 : 700) + ';'; if (s.ls) css += 'letter-spacing:' + Math.min(6, s.ls / 3) + 'px;';
    if (s.grad && s.grad.on) css += 'background:linear-gradient(90deg,' + s.grad.c1 + ',' + s.grad.c2 + ');-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;'; else css += 'color:' + (s.color || '#fff') + ';';
    if (s.stroke && s.stroke.on) css += '-webkit-text-stroke:2px ' + s.stroke.c + ';paint-order:stroke fill;'; const sh = [];
    if (s.glow && s.glow.on) sh.push('0 0 14px ' + s.glow.c, '0 0 4px ' + s.glow.c); if (s.shadow && s.shadow.on) sh.push(Math.min(5, (s.shadow.x || 0) / 2) + 'px ' + Math.min(5, (s.shadow.y || 0) / 2) + 'px ' + Math.min(6, s.shadow.b / 3) + 'px ' + s.shadow.c);
    if (sh.length) css += 'text-shadow:' + sh.join(',') + ';'; if (s.bg && s.bg.on) css += 'background:' + s.bg.c + ';-webkit-text-fill-color:initial;'; return css;
  }
  function styleOf(t) { return t ? JSON.parse(JSON.stringify(t.s)) : {}; }
  function addTextFromPreset(t) {
    const T = VS.newText('Your text', styleOf(t)), c = VS.newClip('text', { text: T, dur: 4, name: 'Text' }); c.tf.y = t.y || 0; c.tf.x = t.x || 0; ensureFont(T.font);
    if (t.a) Object.keys(t.a).forEach(k => c.anim[k] = k === 'loop' ? { type: t.a[k][0], speed: t.a[k][1] } : { type: t.a[k][0], dur: t.a[k][1] });
    VS.addClip(c, { start: S.t }); mTab('edit');
  }

  /* ================================================================ click delegation */
  async function onClick(e) {
    const tb = e.target.closest('[data-tab]'); if (tb) { tab = tb.dataset.tab; renderTabs(); renderPanel(); return; }
    const a = e.target.closest('[data-act]'); if (a) { await act(a.dataset.act, a); return; }
    const kf = e.target.closest('[data-kf]'); if (kf) { const c = sel(); if (!c) return; VS.toggleKey(c, kf.dataset.kf, S.t - c.start); VS.commit(); return; }
    const sw = e.target.closest('[data-set]'); if (sw) { const c = sel(); if (!c) return; const [p, v] = sw.dataset.set.split('='); let val = v === 'true' ? true : v === 'false' ? false : isNaN(+v) || v === '' ? v : +v; if (p.startsWith('toggle:')) { const q = p.slice(7); setp(c, q, !get(c, q)); } else setp(c, p, val); VS.commit(); return; }
    const lb = e.target.closest('[data-lane-act]'); if (lb) { const L = VS.laneById(lb.dataset.laneId); if (!L) return; const k = lb.dataset.laneAct; L[k] = !L[k]; VS.commit(true); if (S.playing) VS.restartAudio(); }
  }
  function mTab(m, only) { const b = root && root.querySelector('.vs-body'); if (!b) return; b.dataset.m = m; $('#vs-m-lib').className = m === 'lib' ? 'on' : ''; $('#vs-m-edit').className = m === 'edit' ? 'on' : ''; if (!only) { } setTimeout(fitPreview, 0); }
  async function act(a, el) {
    const [k, ...rest] = a.split(':'), v = rest.join(':'), c = sel();
    switch (k) {
      case 'close': if (S.clips.length && !confirm('Close the studio? Your project stays in memory until you refresh this page.')) return; VS.close(); return;
      case 'import': $('#vs-file').click(); return;
      case 'undo': VS.undo(); return; case 'redo': VS.redo(); return;
      case 'play': VS.toggle(); return;
      case 'tostart': VS.seek(0); return; case 'toend': VS.seek(VS.total()); return;
      case 'm': mTab(v); return;
      case 'zin': setZoom(zoom * 1.3); return; case 'zout': setZoom(zoom / 1.3); return; case 'zfit': zoomFit(); return;
      case 'split': { const t = c || S.clips.filter(x => S.t > x.start + .08 && S.t < x.start + x.dur - .08).pop(); if (!t || !VS.splitAt(t.id, S.t)) say('Move the playhead inside a clip, then tap Split'); return; }
      case 'del': if (c) VS.delClip(c.id, true); else say('Select a clip first'); return;
      case 'dup': if (c) VS.dupClip(c.id); else say('Select a clip first'); return;
      case 'freeze': if (!c || c.kind !== 'video' || !VS.freezeFrame(c.id)) say('Select a video clip and put the playhead inside it'); return;
      case 'detach': if (!c || c.kind !== 'video') return say('Select a video clip'); if (!VS.detachAudio(c.id)) say('This video has no decoded audio (yet)'); return;
      case 'marker': { const i = S.markers.findIndex(m => Math.abs(m - S.t) < .08); if (i >= 0) S.markers.splice(i, 1); else S.markers.push(+S.t.toFixed(3)); S.markers.sort((x, y) => x - y); VS.commit(true); return; }
      case 'beats': { if (!c || !VS.media[c.media] || !VS.media[c.media].buf) return say('Select a music / video clip with audio first'); const n = VS.detectBeats(c.id); say(n ? n + ' beat markers added – clips snap to them' : 'No clear beats found'); return; }
      case 'snap': { const b = await VS.snapshotPNG(S.t, 1080); dl(b, 'frame.png'); say('Frame saved ✓'); return; }
      case 'full': { const w = $('#vs-wrap'); (w.requestFullscreen || w.webkitRequestFullscreen || (() => { })).call(w); return; }
      case 'help': helpDlg(); return;
      case 'export': exportDlg(); return;
      case 'addm': { const m = MEDIA[v]; if (m) { VS.addMediaClip(v); mTab('edit', true); if (S.clips.length === 1) zoomFit(); } return; }
      case 'pip': VS.addMediaClip(v, { pip: true }); return;
      case 'snd': { say('Preparing sound…'); const m = await VS.makeSound(v); if (m) { VS.addMediaClip(m.id, { start: S.t }); } return; }
      case 'rec': return recToggle();
      case 'addtext': addTextFromPreset(TP[0]); return;
      case 'tp': addTextFromPreset(TP[+v]); return;
      case 'shcol': shapeColor = v; if (c && c.kind === 'sticker' && c.sticker.type === 'shape') { c.sticker.color = v; VS.commit(); } renderPanel(); return;
      case 'shape': { const s = VS.newClip('sticker', { sticker: { type: 'shape', shape: v, size: 300, color: shapeColor }, dur: 3, name: 'Shape' }); s.anim.in = { type: 'pop', dur: .4 }; VS.addClip(s, { start: S.t }); return; }
      case 'emo': { const s = VS.newClip('sticker', { sticker: { type: 'emoji', v, size: 300 }, dur: 3, name: v }); s.anim.in = { type: 'pop', dur: .4 }; VS.addClip(s, { start: S.t }); return; }
      case 'fxmode': fxMode = v; renderPanel(); return;
      case 'fx': {
        if (fxMode === 'clip' && c && c.kind !== 'audio' && c.kind !== 'effect') { const i = c.fx.findIndex(f => f.type === v); if (i >= 0) c.fx.splice(i, 1); else c.fx.push({ type: v, amt: 50 }); VS.commit(); }
        else { const nm = VS.LIST.fx.flatMap(g => g[1]).find(x => x[0] === v); const ec = VS.newClip('effect', { fx: [{ type: v, amt: 60 }], dur: Math.min(4, Math.max(1.5, VS.total() - S.t || 3)), name: nm ? nm[1] : v }); VS.addClip(ec, { start: S.t }); }
        return;
      }
      case 'trans': { if (!c || c.kind === 'audio' || c.kind === 'effect') return say('Select the second clip of a pair first'); const L = VS.laneClips(c.lane); if (!v) { c.trans = null; VS.commit(); return; } if (!VS.adjPrev(c, L)) return say('Drag this clip so it touches the clip before it on the same track'); c.trans = { type: v, dur: c.trans ? c.trans.dur : .8 }; VS.commit(); VS.seek(Math.max(0, c.start - .4)); VS.play(); return; }
      case 'transall': { if (!c || !c.trans) return say('Pick a transition on one clip first'); S.clips.forEach(x => { if (x.kind !== 'audio' && VS.adjPrev(x, VS.laneClips(x.lane))) x.trans = { type: c.trans.type, dur: c.trans.dur }; }); VS.commit(); return; }
      case 'fmode': filtMode = v; renderPanel(); return;
      case 'filt': {
        if (filtMode === 'layer' || !c || (c.kind === 'audio')) { if (!v) { if (c && c.kind === 'adjust') VS.delClip(c.id); return; } const ac = VS.newClip('adjust', { preset: v, dur: Math.max(2, VS.total() - S.t || 5), name: 'Filter' }); VS.addClip(ac, { start: S.t }); }
        else { c.preset = v || null; VS.commit(); } renderPanel(); return;
      }
      case 'adjlayer': { const ac = VS.newClip('adjust', { dur: Math.max(2, VS.total() - S.t || 5), name: 'Adjustment' }); VS.addClip(ac, { start: S.t }); return; }
      case 'mkcap': {
        const lines = ($('#vs-script').value || '').split('\n'); if (!lines.join('').trim()) return say('Type your script first'); let t0 = 0, t1 = VS.total();
        if ($('#vs-capscope').value === 'clip' && c) { t0 = c.start; t1 = c.start + c.dur; } if (t1 <= t0) t1 = t0 + lines.length * 2.5;
        const st = styleOf(TP[+$('#vs-capstyle').value]); const full = VS.newText('', st); say(VS.makeCaptions(lines, t0, t1, full) + ' captions added ✓'); return;
      }
      case 'srt': $('#vs-srt').click(); return;
      case 'fit': if (c) { c.fit = v; VS.commit(); } return;
      case 'tfreset': if (c) { c.tf = { x: 0, y: 0, s: 100, rot: 0, op: 100, fx: false, fy: false }; c.keys = {}; VS.commit(); } return;
      case 'adjreset': if (c) { c.adj = { br: 0, co: 0, sa: 0, hue: 0, temp: 0, bl: 0, fade: 0, vig: 0, grain: 0 }; c.preset = null; VS.commit(); } return;
      case 'fxdel': if (c) { c.fx.splice(+v, 1); VS.commit(); } return;
      case 'chroma': if (c) { c.chroma = c.chroma && c.chroma.on ? null : { on: true, color: '#00b140', sim: 40, sm: 20, spill: 50 }; VS.commit(); } return;
      case 'speed': if (c) { VS.setSpeed(c, +v); VS.commit(); } return;
      case 'bgblur': S.bg.type = 'blur'; VS.commit(true); renderInsp(); return;
      case 'bgcolor': S.bg.type = 'color'; VS.commit(true); renderInsp(); return;
      case 'ratio': S.ratio = v; $('#vs-ratio').value = v; VS.commit(true); fitPreview(); renderInsp(); return;
      case 'clear': if (confirm('Remove everything from the timeline?')) { VS.resetProject(); VS.commit(true); renderInsp(); } return;
      case 'keyease': if (c) { const [p, e2] = v.split('~'); (c.keys[p] || []).forEach(k => k.e = e2); VS.commit(); } return;
    }
  }
  function dl(blob, name) { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); }

  /* ---------- voice-over ---------- */
  async function recToggle() {
    if (recState) { recState.rec.stop(); return; }
    try {
      const st = await navigator.mediaDevices.getUserMedia({ audio: true }), rec = new MediaRecorder(st), ch = [], at = S.t; recState = { rec }; rec.ondataavailable = e => ch.push(e.data);
      rec.onstop = async () => { st.getTracks().forEach(t => t.stop()); recState = null; VS.pause(); try { const f = new File([new Blob(ch, { type: rec.mimeType })], 'Voice-over ' + fmt(at) + '.webm', { type: rec.mimeType }), m = await VS.importFile(f); VS.addMediaClip(m.id, { start: at }); say('Voice-over added ✓'); } catch (e) { say('Could not read the recording'); } renderPanel(); };
      rec.start(); VS.play(); say('Recording… tap again to stop'); renderPanel();
    } catch (e) { say('Microphone permission is needed for voice-over'); recState = null; }
  }

  /* ================================================================ inspector */
  const R = (label, path, min, max, step, unit, c, keyed) => {
    const prop = path.startsWith('tf.') ? path.slice(3) : null, isK = keyed && prop && KEYP.includes(prop), lt = S.t - c.start;
    const v = isK ? VS.propVal(c, prop, lt) : get(c, path), has = isK && VS.hasKey(c, prop, lt), anyK = isK && c.keys[prop] && c.keys[prop].length;
    return '<div class="vs-r' + (isK ? '' : ' nk') + '"><span>' + label + '</span><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + v + '" data-p="' + path + '" data-u="' + (unit || '') + '"><output>' + (+(+v).toFixed(2)) + (unit || '') + '</output>' + (isK ? '<button class="kf' + (has ? ' has' : anyK ? ' has' : '') + '" data-kf="' + prop + '" title="Keyframe (animate this value over time)">' + (has ? '◆' : '◇') + '</button>' : '') + '</div>';
  };
  const SEC = (t, body, open) => '<details class="vs-sec"' + (open ? ' open' : '') + '><summary>' + t + '</summary><div>' + body + '</div></details>';
  const SELECT = (path, opts, cur) => '<select data-p="' + path + '">' + opts.map(o => '<option value="' + E(o[0]) + '"' + (String(o[0]) === String(cur == null ? '' : cur) ? ' selected' : '') + '>' + E(o[1]) + '</option>').join('') + '</select>';
  const CK = (path, label, c) => '<label class="vs-row" style="margin:3px 0"><input type="checkbox" data-p="' + path + '" data-t="bool"' + (get(c, path) ? ' checked' : '') + '> ' + label + '</label>';
  const COL = (path, c) => '<input type="color" data-p="' + path + '" value="' + c6(get(c, path)) + '">';

  function renderInsp() {
    if (!root) return; const box = $('#vs-insp'), keep = box.scrollTop, c = sel(); let h = '';
    if (!c) {
      h = '<div class="vs-h">Project</div><div class="vs-row">' + ['9:16', '16:9', '1:1', '4:5', '3:4', '4:3', '21:9'].map(r => '<button data-act="ratio:' + r + '" class="' + (S.ratio === r ? 'on' : '') + '">' + r + '</button>').join('') + '</div>' +
        '<div class="vs-h">Canvas background</div><div class="vs-row"><button data-act="bgblur" class="' + (S.bg.type === 'blur' ? 'on' : '') + '">Blur</button><button data-act="bgcolor" class="' + (S.bg.type === 'color' ? 'on' : '') + '">Colour</button><input type="color" id="vs-bgc" value="' + c6(S.bg.color) + '"></div>' +
        '<div class="vs-h">Quick start</div><div class="vs-note">① Import clips → ＋ to add<br>② Tap a clip on the timeline to edit it: size, animation, filters, speed<br>③ Add text, stickers, effects & transitions from the left tabs<br>④ Press ⬇ Export</div>' +
        '<div class="vs-row"><button data-act="adjlayer">🎨 Add adjustment layer</button><button data-act="clear">🗑 New project</button></div><div class="vs-note">Total length: <b>' + fmt(VS.total()) + '</b>' + (VS.HAS_FILTER ? '' : '<br>⚠ This browser has limited filter support – use Chrome, Edge or Firefox for the full look.') + '</div>';
    } else {
      const k = c.kind, vis = k !== 'audio', media = k === 'video' || k === 'audio', m = MEDIA[c.media];
      h = '<div class="vs-row"><b style="flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + ICON[k] + ' ' + E(c.name || k) + '</b><button data-act="dup" title="Duplicate">⧉</button><button data-act="del" title="Delete">🗑</button></div>';
      if (k === 'text') h += SEC('🔤 Text', textInsp(c), true);
      if (k === 'sticker') h += SEC('😀 Sticker', (c.sticker.type === 'emoji' ? '<input type="text" data-p="sticker.v" value="' + E(c.sticker.v) + '">' : '<div class="vs-row">' + COL('sticker.color', c) + '</div>') + R('Size', 'sticker.size', 40, 900, 5, '', c) + (c.sticker.type === 'shape' ? R('Outline', 'sticker.stroke', 0, 40, 1, '', c) : ''), true);
      if (k === 'effect') h += SEC('✨ Effect', c.fx.map((f, i) => '<div class="vs-note">' + E(f.type) + '</div>' + R('Strength', 'fx.' + i + '.amt', 0, 100, 1, '%', c)).join(''), true);
      if (k === 'adjust') h += SEC('🎨 Filter & adjust', adjInsp(c), true);
      if (vis && k !== 'effect' && k !== 'adjust') {
        h += SEC('📐 Basic', R('Position X', 'tf.x', -150, 150, .5, '%', c, 1) + R('Position Y', 'tf.y', -150, 150, .5, '%', c, 1) + R('Scale', 'tf.s', 5, 500, 1, '%', c, 1) + R('Rotate', 'tf.rot', -360, 360, 1, '°', c, 1) + R('Opacity', 'tf.op', 0, 100, 1, '%', c, 1) +
          '<div class="vs-row">' + ((k === 'video' || k === 'image') ? '<button data-act="fit:contain" class="' + (c.fit === 'contain' ? 'on' : '') + '">Fit</button><button data-act="fit:cover" class="' + (c.fit === 'cover' ? 'on' : '') + '">Fill</button><button data-act="fit:stretch" class="' + (c.fit === 'stretch' ? 'on' : '') + '">Stretch</button>' : '') + '<button data-set="toggle:tf.fx" class="' + (c.tf.fx ? 'on' : '') + '">⇋ Flip H</button><button data-set="toggle:tf.fy" class="' + (c.tf.fy ? 'on' : '') + '">⇅ Flip V</button><button data-act="tfreset">Reset</button></div>' +
          '<div class="vs-r nk"><span>Blend</span>' + SELECT('blend', VS.BLENDS, c.blend) + '<span></span></div><div class="vs-r nk"><span>Mask</span>' + SELECT('mask', VS.MASKS, c.mask || '') + '<span></span></div>' + (Object.keys(c.keys).length ? '<div class="vs-note">◆ Keyframes: move the playhead, change a value and it is recorded. Easing: <a href="#" data-act="keyease:x~inOut" hidden></a><span style="cursor:pointer;color:#00e0c6" data-act="keyease:' + Object.keys(c.keys)[0] + '~lin">linear</span> · <span style="cursor:pointer;color:#00e0c6" data-act="keyease:' + Object.keys(c.keys)[0] + '~inOut">smooth</span> · <span style="cursor:pointer;color:#00e0c6" data-act="keyease:' + Object.keys(c.keys)[0] + '~bounce">bounce</span></div>' : '<div class="vs-note">Tap ◇ next to a value to add keyframes and animate it over time.</div>'), true);
        h += SEC('🎞 Animation', animInsp(c));
        h += SEC('🎨 Filters & adjust', adjInsp(c));
        h += SEC('✨ Effects on this clip (' + c.fx.length + ')', fxInsp(c));
        if (k === 'video' || k === 'image') h += SEC('🟩 Green screen (chroma key)', chromaInsp(c));
        const L = VS.laneClips(c.lane); if (VS.adjPrev(c, L)) h += SEC('🔀 Transition', '<div class="vs-r nk"><span>Type</span>' + SELECT('trans.type', [['', 'None']].concat(VS.LIST.trans.map(t => [t[0], t[2] + ' ' + t[1]])), c.trans ? c.trans.type : '') + '<span></span></div>' + (c.trans ? R('Length', 'trans.dur', .1, 3, .05, 's', c) : ''), !!c.trans);
      }
      if (media) h += SEC('⏩ Speed', '<div class="vs-row">' + [.25, .5, .75, 1, 1.5, 2, 3, 4, 8].map(s => '<button data-act="speed:' + s + '" class="' + (c.speed === s ? 'on' : '') + '">' + s + '×</button>').join('') + '</div><div class="vs-note">Current: ' + c.speed.toFixed(2) + '× – clip length changes automatically.</div>');
      if (media) h += SEC('🔊 Audio', R('Volume', 'vol', 0, 2, .01, '', c) + R('Fade in', 'fadeIn', 0, Math.max(.1, Math.min(10, c.dur / 2)), .1, 's', c) + R('Fade out', 'fadeOut', 0, Math.max(.1, Math.min(10, c.dur / 2)), .1, 's', c) + (m && !m.buf && k === 'video' ? '<div class="vs-note">' + (m.noAudio ? 'No audio could be read from this video.' : 'Reading audio…') + '</div>' : ''), k === 'audio');
      if (k === 'image' || k === 'text' || k === 'sticker' || k === 'effect' || k === 'adjust') h += SEC('⏱ Duration', R('Seconds', 'dur', .2, 60, .1, 's', c));
    }
    box.innerHTML = h; box.scrollTop = keep;
    const bc = $('#vs-bgc'); if (bc) bc.oninput = () => { S.bg.color = bc.value; VS.rq(); }, bc.onchange = () => VS.commit(true);
  }
  function syncInsp() {
    const c = sel(); if (!c || !root) return; const lt = S.t - c.start;
    $$('#vs-insp [data-p^="tf."]').forEach(i => { const p = i.dataset.p.slice(3); if (!KEYP.includes(p)) return; const v = VS.propVal(c, p, lt); if (document.activeElement !== i) i.value = v; const o = i.nextElementSibling; if (o && o.tagName === 'OUTPUT') o.textContent = (+(+v).toFixed(2)) + (i.dataset.u || ''); const kb = i.parentNode.querySelector('.kf'); if (kb) { const has = VS.hasKey(c, p, lt); kb.textContent = has ? '◆' : '◇'; kb.classList.toggle('has', has || !!(c.keys[p] && c.keys[p].length)); } });
  }
  function textInsp(c) {
    const T = c.text, fonts = [['', '— Google fonts —']].concat(GF.map(f => [f, f])).concat([['', '— System —']]).concat(SYS.map(f => [f, f])).filter(o => o[0] || true);
    return '<textarea data-p="text.txt" rows="3">' + E(T.txt) + '</textarea><div class="vs-r nk"><span>Font</span>' + SELECT('text.font', fonts, T.font) + '<span></span></div>' + R('Size', 'text.size', 20, 400, 1, '', c) +
      '<div class="vs-row">' + COL('text.color', c) + '<button data-set="toggle:text.bold" class="' + (T.bold ? 'on' : '') + '"><b>B</b></button><button data-set="toggle:text.italic" class="' + (T.italic ? 'on' : '') + '"><i>I</i></button><button data-set="toggle:text.upper" class="' + (T.upper ? 'on' : '') + '">AA</button>' + ['left', 'center', 'right'].map(a => '<button data-set="text.align=' + a + '" class="' + (T.align === a ? 'on' : '') + '">' + { left: '⬅', center: '↔', right: '➡' }[a] + '</button>').join('') + '</div>' +
      R('Letter gap', 'text.ls', -5, 60, 1, '', c) + R('Line height', 'text.lh', .8, 2.5, .05, '', c) + R('Max width', 'text.w', 20, 100, 1, '%', c) +
      CK('text.stroke.on', 'Outline', c) + (T.stroke.on ? '<div class="vs-row">' + COL('text.stroke.c', c) + '</div>' + R('Width', 'text.stroke.w', 1, 40, 1, '', c) : '') +
      CK('text.shadow.on', 'Shadow', c) + (T.shadow.on ? '<div class="vs-row">' + COL('text.shadow.c', c) + '</div>' + R('Blur', 'text.shadow.b', 0, 50, 1, '', c) + R('Offset X', 'text.shadow.x', -30, 30, 1, '', c) + R('Offset Y', 'text.shadow.y', -30, 30, 1, '', c) : '') +
      CK('text.glow.on', 'Neon glow', c) + (T.glow.on ? '<div class="vs-row">' + COL('text.glow.c', c) + '</div>' + R('Glow', 'text.glow.b', 4, 90, 1, '', c) : '') +
      CK('text.grad.on', 'Gradient colour', c) + (T.grad.on ? '<div class="vs-row">' + COL('text.grad.c1', c) + COL('text.grad.c2', c) + '</div>' : '') +
      CK('text.bg.on', 'Background box', c) + (T.bg.on ? '<div class="vs-row">' + COL('text.bg.c', c) + '</div>' + R('Opacity', 'text.bg.a', 0, 1, .05, '', c) + R('Padding', 'text.bg.pad', 0, 90, 1, '', c) + R('Rounding', 'text.bg.r', 0, 80, 1, '', c) : '') +
      '<div class="vs-row">Karaoke highlight ' + COL('text.hl', c) + '</div>';
  }
  function adjInsp(c) {
    return '<div class="vs-r nk"><span>Filter</span>' + SELECT('preset', [['', 'None']].concat(VS.FILTERS.map(f => [f.id, f.n])), c.preset || '') + '<span></span></div>' + (c.preset ? R('Intensity', 'presetAmt', 0, 100, 1, '%', c) : '') +
      R('Brightness', 'adj.br', -60, 60, 1, '', c) + R('Contrast', 'adj.co', -60, 80, 1, '', c) + R('Saturation', 'adj.sa', -100, 150, 1, '', c) + R('Hue', 'adj.hue', -180, 180, 1, '°', c) + R('Temperature', 'adj.temp', -100, 100, 1, '', c) + R('Fade', 'adj.fade', 0, 100, 1, '', c) + R('Blur', 'adj.bl', 0, 30, .5, '', c) + R('Vignette', 'adj.vig', 0, 100, 1, '', c) + R('Grain', 'adj.grain', 0, 100, 1, '', c) + '<div class="vs-row"><button data-act="adjreset">Reset</button></div>';
  }
  function fxInsp(c) {
    const nm = t => { const f = VS.LIST.fx.flatMap(g => g[1]).find(x => x[0] === t); return f ? f[2] + ' ' + f[1] : t; };
    return c.fx.length ? c.fx.map((f, i) => '<div class="vs-row" style="justify-content:space-between"><b>' + nm(f.type) + '</b><button data-act="fxdel:' + i + '">✖</button></div>' + R('Strength', 'fx.' + i + '.amt', 0, 100, 1, '%', c)).join('') : '<div class="vs-note">Open the <b>Effects</b> tab, switch to “On selected clip” and tap an effect.</div>';
  }
  function chromaInsp(c) {
    const ck = c.chroma; return '<div class="vs-row"><button data-act="chroma" class="' + (ck && ck.on ? 'on' : '') + '">' + (ck && ck.on ? '✓ Enabled' : 'Enable') + '</button>' + (ck ? COL('chroma.color', c) : '') + '</div>' + (ck ? R('Similarity', 'chroma.sim', 0, 100, 1, '', c) + R('Smoothness', 'chroma.sm', 0, 100, 1, '', c) + R('Spill fix', 'chroma.spill', 0, 100, 1, '', c) + '<div class="vs-note">Pick the colour of your green/blue screen, then raise Similarity until it disappears. Put a background clip on a lower track.</div>' : '<div class="vs-note">Removes a solid green/blue background so you can place yourself on any scene.</div>');
  }
  function animInsp(c) {
    const A = c.anim, isT = c.kind === 'text', inL = [['', 'None']].concat(VS.LIST.animIn.map(a => [a[0], a[2] + ' ' + a[1]])).concat(isT ? VS.LIST.charIn.map(a => [a[0], a[2] + ' ' + a[1]]) : []), lpL = [['', 'None']].concat(VS.LIST.animLoop.map(a => [a[0], a[2] + ' ' + a[1]])).concat(isT ? VS.LIST.charLoop.map(a => [a[0], a[2] + ' ' + a[1]]) : []);
    const row = (nm, key, list) => '<div class="vs-r nk"><span>' + nm + '</span><select data-anim="' + key + '">' + list.map(o => '<option value="' + o[0] + '"' + ((A[key] ? A[key].type : '') === o[0] ? ' selected' : '') + '>' + E(o[1]) + '</option>').join('') + '</select><span></span></div>' + (A[key] ? '<div class="vs-r nk"><span></span><input type="range" min="' + (key === 'loop' ? .2 : .1) + '" max="' + (key === 'loop' ? 4 : 3) + '" step=".05" value="' + (key === 'loop' ? (A[key].speed || 1) : A[key].dur) + '" data-animv="' + key + '"><output>' + (+(key === 'loop' ? (A[key].speed || 1) : A[key].dur).toFixed(2)) + (key === 'loop' ? '×' : 's') + '</output></div>' : '');
    return row('In', 'in', inL) + row('Out', 'out', inL) + row('Loop', 'loop', lpL) + '<div class="vs-note">In = how it appears · Out = how it leaves · Loop = keeps moving while on screen.</div>';
  }

  /* ---------- inspector inputs ---------- */
  function onInput(e) {
    const t = e.target, c = sel();
    if (t.id === 'vs-zoom') return;
    if (t.dataset.animv && c) { const k = t.dataset.animv, v = +t.value; if (c.anim[k]) { if (k === 'loop') c.anim[k].speed = v; else c.anim[k].dur = v; } const o = t.nextElementSibling; if (o) o.textContent = (+v.toFixed(2)) + (k === 'loop' ? '×' : 's'); VS.rq(); return; }
    if (!t.dataset.p || !c) return; const p = t.dataset.p;
    if (t.type === 'range' || t.type === 'color' || t.tagName === 'TEXTAREA' || (t.type === 'text')) {
      let v = t.type === 'range' ? +t.value : t.value;
      if (p.startsWith('tf.') && KEYP.includes(p.slice(3))) VS.setProp(c, p.slice(3), v, S.t - c.start); else if (p === 'dur') { c.dur = v; } else setp(c, p, v);
      if (p === 'text.font') ensureFont(v);
      const o = t.nextElementSibling; if (o && o.tagName === 'OUTPUT') o.textContent = (+(+v).toFixed(2)) + (t.dataset.u || '');
      if (t.tagName === 'TEXTAREA' || p === 'text.txt') c.name = String(v).slice(0, 24);
      VS.rq(); if (p === 'dur' || p === 'text.txt') renderTLSoft(); syncKeyBtn(t);
    }
  }
  function syncKeyBtn(t) { const c = sel(); if (!c) return; const p = t.dataset.p; if (p.startsWith('tf.') && KEYP.includes(p.slice(3))) { const kb = t.parentNode.querySelector('.kf'); if (kb) { const has = VS.hasKey(c, p.slice(3), S.t - c.start); kb.textContent = has ? '◆' : '◇'; if (has) kb.classList.add('has'); } } }
  function onChange2(e) {
    const t = e.target, c = sel(); if (t.id === 'vs-script' || t.id === 'vs-capscope' || t.id === 'vs-capstyle') return;
    if (t.dataset.anim && c) { const k = t.dataset.anim, v = t.value; c.anim[k] = v ? { type: v, dur: c.anim[k] && c.anim[k].dur || (k === 'loop' ? .6 : .6), speed: c.anim[k] && c.anim[k].speed || 1 } : null; if (v && k !== 'loop') { VS.seek(c.start); VS.play(); } VS.commit(); return; }
    if (!t.dataset.p || !c) return; const p = t.dataset.p;
    if (t.dataset.t === 'bool') { setp(c, p, t.checked); VS.commit(); return; }
    if (p === 'preset') { c.preset = t.value || null; VS.commit(); return; }
    if (p === 'mask') { c.mask = t.value || null; VS.commit(); return; }
    if (p === 'trans.type') { if (!t.value) c.trans = null; else c.trans = { type: t.value, dur: c.trans ? c.trans.dur : .8 }; VS.commit(); if (t.value) { VS.seek(Math.max(0, c.start - .4)); VS.play(); } return; }
    if (t.tagName === 'SELECT') { setp(c, p, t.value); if (p === 'text.font') ensureFont(t.value); VS.commit(); return; }
    if (p === 'text.font') { ensureFont(t.value); }
    VS.commit();
  }

  /* ================================================================ timeline */
  const LW = 64;
  function setZoom(z) { zoom = clamp(z, 10, ZMAX); const r = $('#vs-zoom'); if (r) r.value = zoom; renderTL(); }
  function zoomFit() { const w = $('#vs-tlb').clientWidth - LW - 40, T = Math.max(VS.total(), 3); setZoom(clamp(w / T, 10, ZMAX)); $('#vs-tlb').scrollLeft = 0; }
  function stepFor() { const s = [.5, 1, 2, 5, 10, 15, 30, 60, 120, 300]; return s.find(x => x * zoom >= 70) || 300; }
  function renderTLSoft() { renderTL(); }
  function renderTL() {
    if (!root) return; const body = $('#vs-tlb'), inn = $('#vs-tlin'), T = VS.total(), width = Math.max(body.clientWidth, LW + (T + 12) * zoom + 60), step = stepFor();
    inn.style.width = width + 'px'; let h = '<div class="vs-ruler" id="vs-ruler"><div style="margin-left:' + LW + 'px;position:relative">';
    for (let t = 0; t <= T + 12; t += step) h += '<span style="left:' + t * zoom + 'px">' + (t >= 60 ? Math.floor(t / 60) + ':' + ('0' + (t % 60)).slice(-2) : t + 's') + '</span>';
    S.markers.forEach(m => { h += '<em style="left:' + m * zoom + 'px"></em>'; }); h += '</div></div>';
    S.lanes.forEach(L => {
      const ic = L.main ? '🎬' : L.kind === 'a' ? '🎵' : '🧩';
      h += '<div class="vs-lane ' + (L.main ? 'main' : L.kind) + '" data-lane="' + L.id + '"><div class="vs-lbl"><span>' + ic + '</span>' + (L.kind === 'v' ? '<button data-lane-act="hidden" data-lane-id="' + L.id + '" title="Show / hide track">' + (L.hidden ? '🚫' : '👁') + '</button>' : '') + '<button data-lane-act="muted" data-lane-id="' + L.id + '" title="Mute track">' + (L.muted ? '🔇' : '🔊') + '</button></div><div class="cl-area">';
      VS.laneClips(L.id).forEach(c => { h += clipHtml(c, VS.laneClips(L.id)); }); h += '</div></div>';
    });
    S.markers.forEach(m => { h += '<div class="vs-mk" style="left:' + (LW + m * zoom) + 'px"></div>'; });
    h += '<div class="vs-play-head" id="vs-ph" style="left:' + (LW + S.t * zoom) + 'px"></div><div class="vs-snap" id="vs-snapl" hidden></div>';
    inn.innerHTML = h; $$('canvas[data-wave]', inn).forEach(cv => drawWave(cv)); updBtns();
  }
  function clipLabel(c) { const m = MEDIA[c.media]; return c.kind === 'text' ? c.text.txt.replace(/\n/g, ' ') : c.kind === 'sticker' ? (c.sticker.type === 'emoji' ? c.sticker.v : '◼ ' + c.sticker.shape) : c.kind === 'effect' ? '✨ ' + (c.name || 'Effect') : c.kind === 'adjust' ? '🎨 ' + (c.preset ? (VS.FILTERS.find(f => f.id === c.preset) || {}).n : 'Adjustment') : (m ? m.name : c.name) + (c.speed !== 1 ? ' · ' + c.speed + '×' : ''); }
  function clipHtml(c, list) {
    const w = Math.max(6, c.dur * zoom), m = MEDIA[c.media]; let inner = '';
    if (c.kind === 'video' && m && m.thumbs && m.thumbs.length) { const hgt = 56, tw = Math.max(30, hgt * (m.tw / m.th || 1.77)), n = Math.ceil(w / tw); inner += '<div class="th">'; for (let i = 0; i < n; i++) { const st = c.in + (i * tw / zoom) * c.speed, idx = clamp(Math.round(st / m.dur * (m.thumbs.length - 1)), 0, m.thumbs.length - 1); inner += '<img src="' + m.thumbs[idx] + '" style="width:' + tw + 'px" draggable="false">'; } inner += '</div>'; }
    else if (c.kind === 'image' && m) inner += '<div class="th"><img src="' + m.url + '" style="width:' + Math.max(40, 50 * (m.w / m.h || 1.5)) + 'px" draggable="false"></div>';
    else if (c.kind === 'audio' && m && m.peaks) inner += '<canvas data-wave="' + c.id + '"></canvas>';
    let kd = ''; Object.keys(c.keys || {}).forEach(p => c.keys[p].forEach(k => { kd += '<i class="kfd" style="left:' + k.t * zoom + 'px"></i>'; }));
    const tr = c.trans && VS.adjPrev(c, list) ? '<div class="tr" data-trid="' + c.id + '" title="Transition: ' + E(c.trans.type) + '">⇄</div>' : '';
    return '<div class="vs-clip k-' + c.kind + (S.sel === c.id ? ' sel' : '') + '" data-cid="' + c.id + '" style="left:' + c.start * zoom + 'px;width:' + w + 'px">' + inner + kd + '<span class="lb">' + E(clipLabel(c)) + '</span><div class="hl"></div><div class="hr"></div>' + tr + '</div>';
  }
  function drawWave(cv) {
    const c = VS.clipById(cv.dataset.wave), m = c && MEDIA[c.media]; if (!m || !m.peaks) return; const w = Math.min(4000, Math.max(2, Math.round(c.dur * zoom))), h = 36; cv.width = w; cv.height = h; const x = cv.getContext('2d'), n = m.peaks.length, i0 = c.in / m.dur * n, i1 = (c.in + c.dur * c.speed) / m.dur * n;
    x.fillStyle = 'rgba(255,255,255,.75)'; for (let px = 0; px < w; px++) { const a = Math.floor(i0 + (i1 - i0) * px / w), b = Math.max(a + 1, Math.floor(i0 + (i1 - i0) * (px + 1) / w)); let mx = 0; for (let j = a; j < b && j < n; j++) if (m.peaks[j] > mx) mx = m.peaks[j]; const bh = Math.max(1, mx * c.vol * h * .9); x.fillRect(px, (h - bh) / 2, 1, bh); }
  }
  function onChange() { renderTL(); renderInsp(); if (tab === 'trans' || tab === 'filt') renderPanel(); updBtns(); VS.renderPreview(); }
  function updBtns() { if (!root) return; const u = $('#vs-undo'), r = $('#vs-redo'); if (u) { u.disabled = !VS.canUndo(); r.disabled = !VS.canRedo(); } const c = sel(); ['split', 'del', 'dup'].forEach(a => { const b = $('[data-act="' + a + '"]'); }); $('#vs-tm').textContent = fmt(S.t) + ' / ' + fmt(VS.total()); }
  function updPlay() { const b = $('#vs-play'); if (b) b.textContent = S.playing ? '⏸' : '▶'; }
  function onTick() {
    if (!root) return; const ph = $('#vs-ph'); if (ph) ph.style.left = (LW + S.t * zoom) + 'px'; $('#vs-tm').textContent = fmt(S.t) + ' / ' + fmt(VS.total());
    if (S.playing) { const b = $('#vs-tlb'), x = LW + S.t * zoom; if (x > b.scrollLeft + b.clientWidth - 40 || x < b.scrollLeft + LW) b.scrollLeft = Math.max(0, x - b.clientWidth / 3); }
    const now = performance.now(); if (now - lastFrame > 120 || !S.playing) { lastFrame = now; syncInsp(); }
  }
  function timeFromX(clientX) { const b = $('#vs-tlb'), r = b.getBoundingClientRect(); return Math.max(0, (clientX - r.left + b.scrollLeft - LW) / zoom); }
  function snapPts(skip) { const pts = [0, S.t].concat(S.markers); S.clips.forEach(c => { if (c.id !== skip) { pts.push(c.start, c.start + c.dur); } }); return pts; }
  function snapTo(vals, skip) { const pts = snapPts(skip), th = 9 / zoom; let best = null; vals.forEach(v => pts.forEach(p => { const d = p - v.t; if (Math.abs(d) < th && (!best || Math.abs(d) < Math.abs(best.d))) best = { d, at: p }; })); return best; }
  function showSnap(x) { const s = $('#vs-snapl'); if (!s) return; if (x == null) { s.hidden = true; return; } s.hidden = false; s.style.left = (LW + x * zoom) + 'px'; }
  function laneAtY(y, kind, c) {
    const rows = $$('.vs-lane'); if (!rows.length) return null; const first = rows[0].getBoundingClientRect(), last = rows[rows.length - 1].getBoundingClientRect();
    if (kind === 'v' && y < first.top + 6 && !rows[0].classList.contains('main')) return 'NEW_TOP'; if (kind === 'a' && y > last.bottom - 4) return 'NEW_BOTTOM';
    let best = null, bd = 1e9; rows.forEach(r => { const b = r.getBoundingClientRect(), L = VS.laneById(r.dataset.lane); if (L.kind !== kind) return; if (L.main && !(c.kind === 'video' || c.kind === 'image')) return; const d = y < b.top ? b.top - y : y > b.bottom ? y - b.bottom : 0; if (d < bd) { bd = d; best = L.id; } }); return best;
  }
  function tlDown(e) {
    if (e.button && e.button !== 0) return; const rul = e.target.closest('#vs-ruler'), el = e.target.closest('.vs-clip'), lbl = e.target.closest('.vs-lbl');
    if (lbl) return;
    if (rul) { VS.pause(); const mv = ev => VS.seek(timeFromX(ev.clientX)); mv(e); const up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); }; window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); return; }
    if (!el) { if (e.target.closest('.cl-area')) { S.sel = null; renderTL(); renderInsp(); VS.seek(timeFromX(e.clientX)); } return; }
    const c = VS.clipById(el.dataset.cid); if (!c) return; if (e.target.closest('.tr')) { S.sel = c.id; renderTL(); renderInsp(); mTab('edit'); tab = 'trans'; renderTabs(); renderPanel(); return; }
    if (S.sel !== c.id) { S.sel = c.id; $$('.vs-clip.sel').forEach(x => x.classList.remove('sel')); el.classList.add('sel'); renderInsp(); if (tab === 'trans' || tab === 'filt') renderPanel(); VS.rq(); }
    const mode = e.target.classList.contains('hl') ? 'l' : e.target.classList.contains('hr') ? 'r' : 'm', x0 = e.clientX, y0 = e.clientY, o = { start: c.start, dur: c.dur, in: c.in, lane: c.lane }, kind = c.kind === 'audio' ? 'a' : 'v'; let moved = false, newLane = null;
    const L = VS.laneClips(c.lane), idx = L.findIndex(x => x.id === c.id), prev = L[idx - 1], next = L[idx + 1], m = MEDIA[c.media], lim = c.kind === 'video' || c.kind === 'audio';
    const mv = ev => {
      const dx = (ev.clientX - x0) / zoom; if (!moved && Math.hypot(ev.clientX - x0, ev.clientY - y0) < 4) return; moved = true; VS.pause();
      if (mode === 'm') {
        let ns = Math.max(0, o.start + dx); const sn = snapTo([{ t: ns }, { t: ns + c.dur }], c.id); if (sn) ns += sn.d; showSnap(sn ? sn.at : null);
        const tl = laneAtY(ev.clientY, kind, c); if (tl && tl !== c.lane && tl.indexOf('NEW') !== 0) { const area = $('[data-lane="' + tl + '"] .cl-area'); if (area && el.parentNode !== area) area.appendChild(el); } newLane = tl; el.style.left = ns * zoom + 'px'; el._ns = ns;
      } else if (mode === 'l') {
        let ns = o.start + dx; const minS = prev ? prev.start + prev.dur : 0; let lo = minS; if (lim && m) lo = Math.max(lo, o.start - o.in / c.speed); ns = clamp(ns, lo, o.start + o.dur - .15); const sn = snapTo([{ t: ns }], c.id); if (sn && sn.at >= lo && sn.at <= o.start + o.dur - .15) ns = sn.at; showSnap(sn ? sn.at : null);
        const d = ns - o.start; c.start = ns; c.dur = o.dur - d; if (lim) c.in = Math.max(0, o.in + d * c.speed); el.style.left = c.start * zoom + 'px'; el.style.width = Math.max(6, c.dur * zoom) + 'px';
      } else {
        let end = o.start + o.dur + dx; let hi = next ? next.start : 1e9; if (lim && m) hi = Math.min(hi, o.start + (m.dur - o.in) / c.speed); end = clamp(end, o.start + .15, hi); const sn = snapTo([{ t: end }], c.id); if (sn && sn.at <= hi && sn.at >= o.start + .15) end = sn.at; showSnap(sn ? sn.at : null);
        c.dur = end - o.start; el.style.width = Math.max(6, c.dur * zoom) + 'px';
      }
    };
    const up = () => {
      window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); showSnap(null);
      if (!moved) { VS.rq(); return; }
      if (mode === 'm') { let lid = c.lane; if (newLane === 'NEW_TOP') lid = VS.addLane('v').id; else if (newLane === 'NEW_BOTTOM') lid = VS.addLane('a').id; else if (newLane) lid = newLane; const ns = el._ns != null ? el._ns : c.start; c.lane = lid; c.start = VS.fitStart(lid, ns, c.dur, c.id); }
      VS.commit();
    };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
  }
  function dropMedia(mid, e) {
    const m = MEDIA[mid]; if (!m) return; const t = timeFromX(e.clientX), rows = $$('.vs-lane'); let lid = null;
    rows.forEach(r => { const b = r.getBoundingClientRect(); if (e.clientY >= b.top && e.clientY <= b.bottom) lid = r.dataset.lane; });
    const c = VS.newClip(m.kind, { media: mid, dur: m.kind === 'image' ? 4 : m.dur, name: m.name }), L = lid && VS.laneById(lid);
    if (m.kind === 'audio') VS.addClip(c, { start: t, lane: L && L.kind === 'a' ? lid : null }); else if (L && L.main) VS.addClip(c, { lane: lid, start: t }); else if (L && L.kind === 'v') VS.addClip(c, { lane: lid, start: t }); else VS.addClip(c, { main: true });
  }

  /* ================================================================ dialogs */
  function modal(html) { const d = document.createElement('div'); d.className = 'vs-exp'; d.innerHTML = '<div>' + html + '</div>'; root.appendChild(d); return d; }
  function helpDlg() {
    const d = modal('<h3 style="margin:0 0 8px">⌨ Shortcuts</h3><table style="width:100%;font-size:12px;border-collapse:collapse">' + [['Space', 'Play / pause'], ['S', 'Split at playhead'], ['Delete', 'Delete clip'], ['Ctrl + D', 'Duplicate'], ['Ctrl + Z / Y', 'Undo / redo'], ['← / →', 'Step 1 frame (Shift = 1 sec)'], ['M', 'Add marker'], ['+ / −', 'Zoom timeline'], ['Drag clip edge', 'Trim'], ['Drag on preview', 'Move; corner = resize; top dot = rotate']].map(r => '<tr><td style="padding:4px;border-top:1px solid #2a2e3b"><b>' + r[0] + '</b></td><td style="padding:4px;border-top:1px solid #2a2e3b">' + r[1] + '</td></tr>').join('') + '</table><div class="vs-row" style="margin-top:12px"><button class="pri" data-x>Close</button></div>');
    d.querySelector('[data-x]').onclick = () => d.remove();
  }
  function exportDlg() {
    if (!S.clips.length) return say('Add a clip to the timeline first');
    VS.pause(); const T = VS.total(), [DW, DH] = VS.dims();
    const d = modal('<h3 style="margin:0 0 8px">⬇ Export video</h3><div class="vs-row"><label style="flex:1">Resolution<select id="ex-res"><option value="480">480p</option><option value="720">720p (HD)</option><option value="1080" selected>1080p (Full HD)</option></select></label><label style="flex:1">Frame rate<select id="ex-fps"><option>24</option><option selected>30</option><option>60</option></select></label><label style="flex:1">Quality<select id="ex-q"><option value="0.06">Small</option><option value="0.1" selected>Good</option><option value="0.16">Best</option></select></label></div><p class="vs-note" id="ex-info"></p><div id="ex-prog" hidden><div class="vs-bar"><i id="ex-bar"></i></div><div class="vs-note" id="ex-pt">Starting…</div></div><div id="ex-out"></div><div class="vs-row" style="margin-top:10px"><button class="pri" id="ex-go">▶ Start export</button><button id="ex-png">📷 Current frame (PNG)</button><button id="ex-x">Close</button></div><p class="vs-note">Export records the video in real time, so a 1-minute video takes about 1 minute. Keep this tab open and visible. Works best in Chrome / Edge.</p>');
    const q = s => d.querySelector(s), info = () => { const r = +q('#ex-res').value, k = r / Math.min(DW, DH), w = Math.round(DW * k / 2) * 2, h = Math.round(DH * k / 2) * 2, br = w * h * +q('#ex-fps').value * +q('#ex-q').value; q('#ex-info').textContent = w + '×' + h + ' · ' + fmt(T) + ' · ≈ ' + (br * T / 8 / 1048576).toFixed(1) + ' MB'; };
    ['#ex-res', '#ex-fps', '#ex-q'].forEach(s => q(s).onchange = info); info();
    q('#ex-x').onclick = () => { if (VS.EXP.running) VS.cancelExport(); d.remove(); };
    q('#ex-png').onclick = async () => { dl(await VS.snapshotPNG(S.t, +q('#ex-res').value), 'frame.png'); };
    q('#ex-go').onclick = async () => {
      const r = +q('#ex-res').value, k = r / Math.min(DW, DH), w = Math.round(DW * k / 2) * 2, h = Math.round(DH * k / 2) * 2, fps = +q('#ex-fps').value, br = Math.round(w * h * fps * +q('#ex-q').value);
      q('#ex-go').disabled = true; q('#ex-prog').hidden = false; q('#ex-out').innerHTML = ''; q('#ex-x').textContent = 'Cancel';
      try {
        const res = await VS.exportVideo({ res: r, fps, bitrate: br }, p => { q('#ex-bar').style.width = Math.round(p * 100) + '%'; q('#ex-pt').textContent = '⏳ Exporting… ' + Math.round(p * 100) + '% – keep this tab open'; });
        if (!res) { q('#ex-pt').textContent = 'Export cancelled'; }
        else { const url = URL.createObjectURL(res.blob), name = 'my-video.' + res.ext; q('#ex-bar').style.width = '100%'; q('#ex-pt').textContent = '✓ Done – ' + (res.blob.size / 1048576).toFixed(1) + ' MB'; q('#ex-out').innerHTML = '<video controls playsinline src="' + url + '" style="width:100%;max-height:300px;background:#000;border-radius:10px"></video><div class="vs-row"><a class="pri" style="padding:9px 14px;border-radius:8px;text-decoration:none;color:#04201d;background:linear-gradient(90deg,#00e0c6,#19c3ff);font-weight:600" download="' + name + '" href="' + url + '">⬇ Download ' + name + '</a></div>'; }
      } catch (e) { q('#ex-pt').textContent = '⚠ ' + (e.message || 'Export failed'); }
      q('#ex-go').disabled = false; q('#ex-x').textContent = 'Close'; VS.rq();
    };
  }

  /* ================================================================ keyboard */
  function onKey(e) {
    if (!root) return; const tg = e.target, typing = tg && (tg.tagName === 'INPUT' && tg.type !== 'range' && tg.type !== 'checkbox' || tg.tagName === 'TEXTAREA' || tg.tagName === 'SELECT'); if (typing) { if (e.key === 'Escape') tg.blur(); return; }
    if (root.querySelector('.vs-exp')) { if (e.key === 'Escape' && !VS.EXP.running) root.querySelector('.vs-exp').remove(); return; }
    const k = e.key.toLowerCase(), c = sel(), ctrl = e.ctrlKey || e.metaKey;
    if (k === ' ') { e.preventDefault(); VS.toggle(); }
    else if (k === 's' && !ctrl) { e.preventDefault(); act('split'); }
    else if (k === 'delete' || k === 'backspace') { e.preventDefault(); if (c) VS.delClip(c.id, true); }
    else if (ctrl && k === 'z') { e.preventDefault(); e.shiftKey ? VS.redo() : VS.undo(); }
    else if (ctrl && k === 'y') { e.preventDefault(); VS.redo(); }
    else if (ctrl && k === 'd') { e.preventDefault(); if (c) VS.dupClip(c.id); }
    else if (k === 'arrowleft') { e.preventDefault(); VS.pause(); VS.seek(S.t - (e.shiftKey ? 1 : 1 / S.fps)); }
    else if (k === 'arrowright') { e.preventDefault(); VS.pause(); VS.seek(S.t + (e.shiftKey ? 1 : 1 / S.fps)); }
    else if (k === 'home') VS.seek(0); else if (k === 'end') VS.seek(VS.total());
    else if (k === 'm') act('marker'); else if (k === '+' || k === '=') setZoom(zoom * 1.25); else if (k === '-') setZoom(zoom / 1.25);
  }
})();
