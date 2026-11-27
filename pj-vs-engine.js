/* =====================================================================
   PJ Studio Pro – ENGINE
   Multi-track timeline model, canvas renderer, animations, transitions, effects,
   filters, chroma key, text engine, audio (WebAudio), generated sounds, export.
   Runs 100% in the browser – nothing is uploaded.
   ===================================================================== */
(function () {
  'use strict';
  const VS = window.PJVS = window.PJVS || {};
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v, lerp = (a, b, t) => a + (b - a) * t, fr = x => x - Math.floor(x);
  const rnd = s => fr(Math.sin(s * 127.1 + 311.7) * 43758.5453);
  let _id = 0; const nid = p => (p || 'c') + (++_id).toString(36) + Math.floor(Math.random() * 46656).toString(36);
  VS.nid = nid; VS.clamp = clamp;
  const HAS_FILTER = typeof CanvasRenderingContext2D !== 'undefined' && 'filter' in CanvasRenderingContext2D.prototype;
  VS.HAS_FILTER = HAS_FILTER;
  const RATIOS = { '9:16': [1080, 1920], '16:9': [1920, 1080], '1:1': [1080, 1080], '4:5': [1080, 1350], '3:4': [1080, 1440], '4:3': [1440, 1080], '21:9': [2520, 1080] };
  VS.RATIOS = RATIOS;

  /* ------------------------------------------------------------------ state */
  const S = VS.S = { ratio: '9:16', bg: { type: 'blur', color: '#111111' }, fps: 30, lanes: [], clips: [], markers: [], t: 0, sel: null, playing: false };
  const MEDIA = VS.media = {};
  const ELS = new Map();
  const BB = VS.BB = {};
  VS.hooks = {};
  const hk = (n, a) => { try { VS.hooks[n] && VS.hooks[n](a); } catch (e) { console.error(e); } };
  const dims = VS.dims = () => RATIOS[S.ratio] || RATIOS['9:16'];
  const total = VS.total = () => S.clips.reduce((m, c) => Math.max(m, c.start + c.dur), 0);
  const clipById = VS.clipById = id => S.clips.find(c => c.id === id);
  const laneById = VS.laneById = id => S.lanes.find(l => l.id === id);
  const mainLane = VS.mainLane = () => S.lanes.find(l => l.main);
  const isV = c => c.kind !== 'audio';
  const hasMedia = c => c.kind === 'video' || c.kind === 'audio';

  VS.resetProject = function () {
    S.lanes = [{ id: 'Lmain', kind: 'v', main: true }, { id: nid('La'), kind: 'a' }];
    S.clips = []; S.markers = []; S.t = 0; S.sel = null;
    ELS.forEach(e => { try { e.pause(); e.removeAttribute('src'); e.load(); } catch (x) { } }); ELS.clear();
  };
  VS.resetProject();

  VS.newText = function (txt, style) {
    const T = {
      txt: txt == null ? 'Your text' : txt, font: 'Poppins', size: 96, color: '#ffffff', bold: true, italic: false, upper: false, align: 'center', ls: 0, lh: 1.2, w: 84,
      stroke: { on: false, c: '#000000', w: 8 }, shadow: { on: true, c: '#000000aa', b: 14, x: 0, y: 6 }, bg: { on: false, c: '#000000', a: .6, pad: 26, r: 22 },
      glow: { on: false, c: '#00e5ff', b: 30 }, grad: { on: false, c1: '#ff0080', c2: '#ffcc00' }, hl: '#ffd400'
    };
    if (style) Object.keys(style).forEach(k => { if (style[k] && typeof style[k] === 'object') Object.assign(T[k], style[k]); else T[k] = style[k]; });
    return T;
  };
  VS.newClip = function (kind, o) {
    const c = {
      id: nid('c'), kind, lane: null, start: 0, dur: 3, in: 0, speed: 1, media: null, vol: 1, fadeIn: 0, fadeOut: 0, name: '',
      tf: { x: 0, y: 0, s: 100, rot: 0, op: 100, fx: false, fy: false },
      adj: { br: 0, co: 0, sa: 0, hue: 0, temp: 0, bl: 0, fade: 0, vig: 0, grain: 0 }, preset: null, presetAmt: 100,
      fx: [], anim: { in: null, out: null, loop: null }, keys: {}, chroma: null, mask: null, blend: 'source-over', trans: null, fit: 'contain', text: null, sticker: null
    };
    return Object.assign(c, o || {});
  };

  /* ------------------------------------------------------------------ easing */
  const EASE = VS.EASE = {
    lin: t => t, in: t => t * t, out: t => 1 - (1 - t) * (1 - t), inOut: t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
    back: t => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); },
    bounce: t => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + .75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + .9375; return n * (t -= 2.625 / d) * t + .984375; },
    elastic: t => t === 0 || t === 1 ? t : Math.pow(2, -10 * t) * Math.sin((t * 10 - .75) * (2 * Math.PI) / 3) + 1
  };

  /* ------------------------------------------------------------------ keyframes */
  const propVal = VS.propVal = function (c, p, lt) {
    const k = c.keys && c.keys[p];
    if (!k || !k.length) return c.tf[p];
    if (lt <= k[0].t) return k[0].v;
    const L = k[k.length - 1]; if (lt >= L.t) return L.v;
    for (let i = 0; i < k.length - 1; i++) if (lt < k[i + 1].t) { const a = k[i], b = k[i + 1]; return lerp(a.v, b.v, (EASE[a.e || 'inOut'] || EASE.lin)((lt - a.t) / (b.t - a.t))); }
    return L.v;
  };
  VS.hasKey = (c, p, lt) => !!(c.keys[p] && c.keys[p].some(k => Math.abs(k.t - lt) < 0.04));
  VS.setProp = function (c, p, v, lt) {
    const k = c.keys[p];
    if (k && k.length) VS.upsertKey(c, p, v, lt); else c.tf[p] = v;
  };
  VS.upsertKey = function (c, p, v, lt) {
    const arr = c.keys[p] = c.keys[p] || [];
    const f = arr.find(k => Math.abs(k.t - lt) < 0.04);
    if (f) f.v = v; else { arr.push({ t: Math.max(0, +lt.toFixed(3)), v, e: 'inOut' }); arr.sort((a, b) => a.t - b.t); }
  };
  VS.toggleKey = function (c, p, lt) {
    const arr = c.keys[p] = c.keys[p] || [];
    const i = arr.findIndex(k => Math.abs(k.t - lt) < 0.04);
    if (i >= 0) { arr.splice(i, 1); if (!arr.length) { c.tf[p] = c.tf[p]; delete c.keys[p]; } }
    else VS.upsertKey(c, p, propVal(c, p, lt), lt);
  };

  /* ------------------------------------------------------------------ animation library */
  const DEF = () => ({ dx: 0, dy: 0, s: 1, sx: 1, sy: 1, rot: 0, op: 1, blur: 0, hue: 0, reveal: null });
  /* IN animations: p 0..1 (0 hidden/away, 1 normal). OUT uses the same functions reversed. */
  const IN = {
    fade: p => ({ op: p }),
    slideL: p => ({ dx: -(1 - EASE.out(p)) * 1.1 }), slideR: p => ({ dx: (1 - EASE.out(p)) * 1.1 }),
    slideU: p => ({ dy: -(1 - EASE.out(p)) * 1.1 }), slideD: p => ({ dy: (1 - EASE.out(p)) * 1.1 }),
    zoomIn: p => ({ s: lerp(.2, 1, EASE.out(p)), op: Math.min(1, p * 2.5) }),
    zoomOut: p => ({ s: lerp(2, 1, EASE.out(p)), op: Math.min(1, p * 2.5) }),
    spin: p => ({ rot: -(1 - EASE.out(p)) * 360, s: EASE.out(p), op: Math.min(1, p * 3) }),
    bounce: p => ({ dy: -(1 - EASE.bounce(p)) * 0.55, op: Math.min(1, p * 6) }),
    drop: p => ({ dy: -(1 - EASE.bounce(p)) * 1.0, op: Math.min(1, p * 8) }),
    pop: p => ({ s: Math.max(0, EASE.back(p)), op: Math.min(1, p * 5) }),
    rubber: p => ({ s: EASE.elastic(p), op: Math.min(1, p * 6) }),
    flipX: p => ({ sx: EASE.out(p) }), flipY: p => ({ sy: EASE.out(p) }),
    swing: p => ({ rot: -(1 - EASE.out(p)) * 28, dx: -(1 - EASE.out(p)) * .25, op: p }),
    rise: p => ({ dy: (1 - EASE.out(p)) * .25, op: p }),
    blur: p => ({ blur: (1 - p) * 34, op: Math.min(1, p * 1.6), s: 1 + (1 - p) * .12 }),
    glitch: p => { const q = Math.floor(p * 24); return p >= 1 ? {} : { dx: (rnd(q) - .5) * .12 * (1 - p), op: rnd(q + 7) > .35 || p > .85 ? 1 : 0, hue: (rnd(q + 3) - .5) * 160 * (1 - p) }; },
    wipeL: p => ({ reveal: { l: 0, t: 0, r: EASE.inOut(p), b: 1 } }), wipeR: p => ({ reveal: { l: 1 - EASE.inOut(p), t: 0, r: 1, b: 1 } }),
    wipeU: p => ({ reveal: { l: 0, t: 1 - EASE.inOut(p), r: 1, b: 1 } }), wipeD: p => ({ reveal: { l: 0, t: 0, r: 1, b: EASE.inOut(p) } }),
    circle: p => ({ reveal: { circle: EASE.inOut(p) } }),
    tilt: p => ({ rot: (1 - EASE.out(p)) * 18, dy: (1 - EASE.out(p)) * .15, op: p })
  };
  /* LOOP animations: u = cycles, lp = progress through clip 0..1 */
  const LOOP = {
    pulse: u => ({ s: 1 + .06 * Math.sin(u * 6.283) }), float: u => ({ dy: .02 * Math.sin(u * 6.283) }),
    shake: u => ({ dx: (rnd(Math.floor(u * 12)) - .5) * .025, dy: (rnd(Math.floor(u * 12) + 9) - .5) * .025 }),
    wobble: u => ({ rot: 4 * Math.sin(u * 6.283) }), spin: u => ({ rot: 360 * u }), swing: u => ({ rot: 12 * Math.sin(u * 6.283) }),
    heartbeat: u => ({ s: 1 + .13 * Math.pow(Math.abs(Math.sin(u * 3.1416 * 2)), 10) }),
    flicker: u => ({ op: rnd(Math.floor(u * 16)) > .25 ? 1 : .25 }), hop: u => ({ dy: -Math.abs(Math.sin(u * 3.1416 * 2)) * .05 }),
    rainbow: u => ({ hue: (u * 360) % 360 }), kenburns: (u, lp) => ({ s: 1 + .18 * lp }), kenburnsOut: (u, lp) => ({ s: 1.18 - .18 * lp }),
    panL: (u, lp) => ({ dx: -.06 * lp, s: 1.12 }), panR: (u, lp) => ({ dx: .06 * lp, s: 1.12 })
  };
  const CIN = { tw: 1, cfade: 1, crise: 1, cpop: 1, cspin: 1, cdrop: 1, karaoke: 1 };
  const CLOOP = { wave: 1, cbounce: 1, crainbow: 1, jitter: 1, cscale: 1 };
  VS.LIST = {
    animIn: [['fade', 'Fade', '🌫'], ['slideL', 'Slide from left', '⬅'], ['slideR', 'Slide from right', '➡'], ['slideU', 'Slide from top', '⬆'], ['slideD', 'Slide from bottom', '⬇'], ['zoomIn', 'Zoom in', '🔍'], ['zoomOut', 'Zoom out', '🔎'], ['spin', 'Spin', '🌀'], ['bounce', 'Bounce', '🏀'], ['drop', 'Drop', '⏬'], ['pop', 'Pop', '💥'], ['rubber', 'Rubber', '🧵'], ['flipX', 'Flip X', '↔'], ['flipY', 'Flip Y', '↕'], ['swing', 'Swing', '🪁'], ['rise', 'Rise', '🎈'], ['blur', 'Blur in', '🌁'], ['glitch', 'Glitch', '📺'], ['wipeL', 'Wipe right', '▶'], ['wipeR', 'Wipe left', '◀'], ['wipeU', 'Wipe up', '🔼'], ['wipeD', 'Wipe down', '🔽'], ['circle', 'Circle reveal', '⭕'], ['tilt', 'Tilt', '📐']],
    animLoop: [['pulse', 'Pulse', '💗'], ['float', 'Float', '☁'], ['shake', 'Shake', '📳'], ['wobble', 'Wobble', '🥴'], ['spin', 'Spin', '🌀'], ['swing', 'Swing', '🪁'], ['heartbeat', 'Heartbeat', '❤'], ['flicker', 'Flicker', '💡'], ['hop', 'Hop', '🐸'], ['rainbow', 'Rainbow', '🌈'], ['kenburns', 'Slow zoom in', '🎞'], ['kenburnsOut', 'Slow zoom out', '🎥'], ['panL', 'Pan left', '⏪'], ['panR', 'Pan right', '⏩']],
    charIn: [['tw', 'Typewriter', '⌨'], ['cfade', 'Letter fade', '🌫'], ['crise', 'Letter rise', '🎈'], ['cpop', 'Letter pop', '💥'], ['cspin', 'Letter spin', '🌀'], ['cdrop', 'Letter drop', '⏬'], ['karaoke', 'Karaoke', '🎤']],
    charLoop: [['wave', 'Wave', '🌊'], ['cbounce', 'Bounce', '🏀'], ['crainbow', 'Rainbow letters', '🌈'], ['jitter', 'Jitter', '📳'], ['cscale', 'Breathing', '🫁']]
  };

  /* ------------------------------------------------------------------ transitions (between two touching clips on one lane) */
  const TRANS = {
    fade: p => ({ B: { op: p } }),
    fadeblack: p => ({ A: { op: p < .5 ? 1 : 0 }, B: { op: p < .5 ? 0 : 1 }, over: { c: '#000', a: 1 - Math.abs(2 * p - 1) } }),
    fadewhite: p => ({ A: { op: p < .5 ? 1 : 0 }, B: { op: p < .5 ? 0 : 1 }, over: { c: '#fff', a: 1 - Math.abs(2 * p - 1) } }),
    slideL: p => { const e = EASE.inOut(p); return { A: { dx: -e }, B: { dx: 1 - e } }; },
    slideR: p => { const e = EASE.inOut(p); return { A: { dx: e }, B: { dx: -(1 - e) } }; },
    slideU: p => { const e = EASE.inOut(p); return { A: { dy: -e }, B: { dy: 1 - e } }; },
    slideD: p => { const e = EASE.inOut(p); return { A: { dy: e }, B: { dy: -(1 - e) } }; },
    wipeL: p => ({ B: { sreveal: { l: 0, t: 0, r: EASE.inOut(p), b: 1 } } }), wipeR: p => ({ B: { sreveal: { l: 1 - EASE.inOut(p), t: 0, r: 1, b: 1 } } }),
    wipeU: p => ({ B: { sreveal: { l: 0, t: 1 - EASE.inOut(p), r: 1, b: 1 } } }), wipeD: p => ({ B: { sreveal: { l: 0, t: 0, r: 1, b: EASE.inOut(p) } } }),
    circle: p => ({ B: { sreveal: { circle: EASE.inOut(p) } } }),
    blinds: p => ({ B: { sreveal: { blinds: { n: 9, p: EASE.inOut(p) } } } }),
    zoomIn: p => { const e = EASE.in(p); return { order: 'BA', A: { s: 1 + e * 1.6, op: 1 - e } }; },
    zoomOut: p => { const e = EASE.out(p); return { B: { s: .3 + .7 * e, op: e } }; },
    spin: p => { const e = EASE.out(p); return { B: { rot: -180 * (1 - e), s: e, op: Math.min(1, p * 3) } }; },
    blur: p => { const e = EASE.inOut(p); return { A: { blur: 26 * e }, B: { blur: 26 * (1 - e), op: e } }; },
    whip: p => { const e = EASE.inOut(p), b = 46 * Math.sin(p * Math.PI); return { A: { dx: -e * 1.3, blur: b }, B: { dx: (1 - e) * 1.3, blur: b } }; },
    flip: p => p < .5 ? { A: { sx: Math.max(.001, 1 - 2 * p) }, B: { op: 0 } } : { A: { op: 0 }, B: { sx: Math.max(.001, 2 * p - 1) } },
    glitch: p => { const q = Math.floor(p * 22); return { A: { dx: (rnd(q) - .5) * .08 }, B: { op: p > .5 ? 1 : 0, dx: (rnd(q + 4) - .5) * .08 }, post: { type: 'glitch', amt: 85 * Math.sin(p * Math.PI) } }; },
    pixel: p => ({ A: { op: p < .5 ? 1 : 0 }, B: { op: p < .5 ? 0 : 1 }, post: { type: 'pixelate', amt: 100 * Math.sin(p * Math.PI) } }),
    crosszoom: p => { const e = EASE.inOut(p); return { A: { s: 1 + e * 2, blur: 36 * e, op: 1 - e }, B: { s: 1.8 - .8 * e, blur: 36 * (1 - e), op: e } }; },
    shake: p => { const q = Math.floor(p * 26); return { B: { op: Math.min(1, p * 3), dx: (rnd(q) - .5) * .09 * (1 - p), dy: (rnd(q + 5) - .5) * .09 * (1 - p) }, post: { type: 'rgb', amt: 60 * Math.sin(p * Math.PI) } }; }
  };
  VS.LIST.trans = [['fade', 'Dissolve', '🌫'], ['fadeblack', 'Dip to black', '⚫'], ['fadewhite', 'Flash white', '⚪'], ['slideL', 'Push left', '⬅'], ['slideR', 'Push right', '➡'], ['slideU', 'Push up', '⬆'], ['slideD', 'Push down', '⬇'], ['wipeL', 'Wipe right', '▶'], ['wipeR', 'Wipe left', '◀'], ['wipeU', 'Wipe up', '🔼'], ['wipeD', 'Wipe down', '🔽'], ['circle', 'Circle open', '⭕'], ['blinds', 'Blinds', '🪟'], ['zoomIn', 'Zoom through', '🔍'], ['zoomOut', 'Zoom out', '🔎'], ['crosszoom', 'Cross zoom', '💫'], ['spin', 'Spin', '🌀'], ['blur', 'Blur', '🌁'], ['whip', 'Whip pan', '💨'], ['flip', 'Flip', '🔄'], ['glitch', 'Glitch', '📺'], ['pixel', 'Pixelate', '🟦'], ['shake', 'Shake', '📳']];

  /* ------------------------------------------------------------------ filters (colour presets) */
  const FILTERS = VS.FILTERS = [
    { id: 'vivid', n: 'Vivid', f: 'saturate(1.5) contrast(1.1)' },
    { id: 'warm', n: 'Warm', f: 'sepia(.25) saturate(1.3) brightness(1.05)', tint: ['#ff8a00', .12] },
    { id: 'cool', n: 'Cool', f: 'saturate(1.1) hue-rotate(-10deg)', tint: ['#0066ff', .14] },
    { id: 'cine', n: 'Cinematic', f: 'contrast(1.2) saturate(1.15) brightness(.95)', tint: ['#0a6a7a', .14], vig: .35 },
    { id: 'tealorange', n: 'Teal & Orange', f: 'contrast(1.15) saturate(1.35)', tint: ['#ff7a1a', .1], vig: .2 },
    { id: 'bw', n: 'B&W', f: 'grayscale(1) contrast(1.15)' },
    { id: 'noir', n: 'Noir', f: 'grayscale(1) contrast(1.6) brightness(.85)', vig: .5 },
    { id: 'vintage', n: 'Vintage', f: 'sepia(.55) contrast(.9) saturate(1.2)', vig: .3, grain: .25 },
    { id: 'fade', n: 'Faded', f: 'contrast(.85) brightness(1.1) saturate(.8)' },
    { id: 'moody', n: 'Moody', f: 'contrast(1.25) saturate(.8) brightness(.85)', vig: .4 },
    { id: 'sunny', n: 'Sunny', f: 'brightness(1.12) saturate(1.3)', tint: ['#ffd000', .12] },
    { id: 'golden', n: 'Golden hour', f: 'sepia(.3) saturate(1.5) brightness(1.05)', tint: ['#ff9500', .18] },
    { id: 'cyber', n: 'Cyberpunk', f: 'saturate(1.6) contrast(1.15) hue-rotate(-20deg)', tint: ['#ff00aa', .16] },
    { id: 'neon', n: 'Neon night', f: 'contrast(1.3) saturate(1.8) brightness(.9) hue-rotate(15deg)', tint: ['#4400ff', .15] },
    { id: 'pastel', n: 'Pastel', f: 'brightness(1.15) saturate(.7) contrast(.9)', tint: ['#ffc0e0', .1] },
    { id: 'rose', n: 'Rose', f: 'saturate(1.2) hue-rotate(-8deg)', tint: ['#ff3b70', .12] },
    { id: 'dream', n: 'Dreamy', f: 'brightness(1.12) saturate(1.2)', bl: 1.6, tint: ['#ffd6f0', .14] },
    { id: 'hdr', n: 'HDR', f: 'contrast(1.35) saturate(1.4) brightness(1.02)' },
    { id: 'matte', n: 'Matte', f: 'contrast(.9) saturate(.9) brightness(1.05)', tint: ['#223344', .08] },
    { id: 'drama', n: 'Drama', f: 'contrast(1.4) saturate(1.1) brightness(.9)', vig: .45 },
    { id: 'ink', n: 'Ink', f: 'grayscale(1) contrast(2) brightness(.9)' },
    { id: 'film', n: 'Film', f: 'contrast(1.1) saturate(1.1) sepia(.15)', grain: .3, vig: .25 }
  ];

  /* ------------------------------------------------------------------ effects */
  VS.LIST.fx = [
    ['Basic', [['glitch', 'Glitch', '📺'], ['rgb', 'RGB split', '🌈'], ['shake', 'Shake', '📳'], ['pulse', 'Beat zoom', '💓'], ['flash', 'Flash', '⚡'], ['strobe', 'Strobe', '🔦'], ['wave', 'Wave', '🌊'], ['blur', 'Blur', '🌁'], ['pixelate', 'Pixelate', '🟦'], ['mirror', 'Mirror', '🪞'], ['kaleido', 'Kaleidoscope', '🔮'], ['hue', 'Colour cycle', '🎨']]],
    ['Look', [['vignette', 'Vignette', '⚫'], ['grain', 'Film grain', '🎞'], ['vhs', 'VHS', '📼'], ['scan', 'Scan lines', '📟'], ['glow', 'Glow / bloom', '✨'], ['leak', 'Light leak', '🌅'], ['bars', 'Cinema bars', '🎬'], ['invert', 'Invert', '🔁'], ['bw', 'Black & white', '⬛']]],
    ['Particles', [['snow', 'Snow', '❄'], ['rain', 'Rain', '🌧'], ['confetti', 'Confetti', '🎉'], ['hearts', 'Hearts', '💖'], ['sparkle', 'Sparkles', '🌟'], ['bokeh', 'Bokeh', '🔆']]]
  ];

  const _noise = {};
  function noiseTile() {
    if (_noise.c) return _noise.c;
    const c = document.createElement('canvas'); c.width = c.height = 256; const x = c.getContext('2d'), d = x.createImageData(256, 256);
    for (let i = 0; i < d.data.length; i += 4) { const v = Math.random() * 255; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 255; }
    x.putImageData(d, 0, 0); return _noise.c = c;
  }

  /* ------------------------------------------------------------------ canvas pool */
  const ctx2 = cv => cv._c || (cv._c = cv.getContext('2d'));
  const mkRT = () => ({ pool: [], i: 0, w: 2, h: 2 });
  function acquire(rt) {
    let cv = rt.pool[rt.i++]; if (!cv) { cv = document.createElement('canvas'); rt.pool.push(cv); }
    if (cv.width !== rt.w || cv.height !== rt.h) { cv.width = rt.w; cv.height = rt.h; }
    const c = ctx2(cv); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
    c.shadowColor = 'rgba(0,0,0,0)'; c.shadowBlur = 0; c.shadowOffsetX = c.shadowOffsetY = 0; c.clearRect(0, 0, rt.w, rt.h); return cv;
  }
  function copyOf(rt, cv) { const t = acquire(rt); t._c.drawImage(cv, 0, 0); return t; }

  /* ------------------------------------------------------------------ shapes */
  function rrectPath(c, x, y, w, h, r) { r = Math.min(r, w / 2, h / 2); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }
  function poly(c, pts) { pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath(); }
  function shapePath(c, name, w, h) {
    const x = -w / 2, y = -h / 2; c.beginPath();
    switch (name) {
      case 'circle': c.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2); break;
      case 'round': rrectPath(c, x, y, w, h, Math.min(w, h) * .14); break;
      case 'tri': poly(c, [[0, y], [w / 2, y + h], [-w / 2, y + h]]); break;
      case 'diamond': poly(c, [[0, y], [w / 2, 0], [0, y + h], [-w / 2, 0]]); break;
      case 'hex': { const p = []; for (let i = 0; i < 6; i++) { const a = Math.PI / 3 * i; p.push([Math.cos(a) * w / 2, Math.sin(a) * h / 2]); } poly(c, p); break; }
      case 'star': { const p = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? .42 : 1; p.push([Math.cos(a) * r * w / 2, Math.sin(a) * r * h / 2]); } poly(c, p); break; }
      case 'heart': c.moveTo(0, y + h * .3); c.bezierCurveTo(0, y, x, y, x, y + h * .3); c.bezierCurveTo(x, y + h * .62, x * .15, y + h * .78, 0, y + h); c.bezierCurveTo(-x * .15, y + h * .78, -x, y + h * .62, -x, y + h * .3); c.bezierCurveTo(-x, y, 0, y, 0, y + h * .3); c.closePath(); break;
      case 'arrow': poly(c, [[x, -h * .2], [w * .15, -h * .2], [w * .15, y], [w / 2, 0], [w * .15, -y], [w * .15, h * .2], [x, h * .2]]); break;
      case 'cross': poly(c, [[-w * .17, y], [w * .17, y], [w * .17, -h * .17], [w / 2, -h * .17], [w / 2, h * .17], [w * .17, h * .17], [w * .17, -y], [-w * .17, -y], [-w * .17, h * .17], [x, h * .17], [x, -h * .17], [-w * .17, -h * .17]]); break;
      case 'bubble': rrectPath(c, x, y, w, h * .8, Math.min(w, h) * .2); c.moveTo(-w * .2, y + h * .78); c.lineTo(-w * .32, -y); c.lineTo(w * .05, y + h * .78); break;
      case 'line': c.rect(x, -h * .04, w, h * .08); break;
      case 'hline': c.rect(x, -h * .25, w, h * .5); break;
      case 'ring': c.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2); c.ellipse(0, 0, w * .36, h * .36, 0, 0, Math.PI * 2, true); break;
      default: c.rect(x, y, w, h);
    }
  }
  VS.SHAPES = [['rect', 'Square'], ['round', 'Rounded'], ['circle', 'Circle'], ['tri', 'Triangle'], ['diamond', 'Diamond'], ['hex', 'Hexagon'], ['star', 'Star'], ['heart', 'Heart'], ['arrow', 'Arrow'], ['cross', 'Plus'], ['bubble', 'Speech'], ['line', 'Line'], ['ring', 'Ring']];
  VS.MASKS = [['', 'None'], ['circle', 'Circle'], ['round', 'Rounded'], ['rect', 'Square'], ['heart', 'Heart'], ['star', 'Star'], ['diamond', 'Diamond'], ['hex', 'Hexagon'], ['tri', 'Triangle'], ['hline', 'Strip']];
  VS.BLENDS = [['source-over', 'Normal'], ['screen', 'Screen'], ['multiply', 'Multiply'], ['overlay', 'Overlay'], ['soft-light', 'Soft light'], ['hard-light', 'Hard light'], ['lighten', 'Lighten'], ['darken', 'Darken'], ['difference', 'Difference'], ['color-dodge', 'Colour dodge']];

  /* ------------------------------------------------------------------ text engine */
  const SEG = (typeof Intl !== 'undefined' && Intl.Segmenter) ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
  const graphemes = s => SEG ? Array.from(SEG.segment(s), x => x.segment) : Array.from(s);
  const fontStr = T => (T.italic ? 'italic ' : '') + (T.bold ? '700 ' : '400 ') + T.size + 'px "' + T.font + '", "Poppins", "Noto Sans Devanagari", "Hind", sans-serif';
  VS.fontStr = fontStr;
  function charState(ca, i, n, fs) {
    const s = { a: 1, dx: 0, dy: 0, s: 1, rot: 0, col: null }, p = ca.p, u = ca.u, ST = 1.1;
    const cp = clamp(p * (1 + ST) - (i / Math.max(1, n)) * ST, 0, 1);
    switch (ca.type) {
      case 'tw': s.a = cp > 0 ? 1 : 0; break;
      case 'cfade': s.a = cp; break;
      case 'crise': s.a = cp; s.dy = (1 - EASE.out(cp)) * .6 * fs; break;
      case 'cpop': s.a = cp > 0 ? 1 : 0; s.s = Math.max(0, EASE.back(cp)); break;
      case 'cspin': s.a = cp; s.rot = (1 - cp) * 360; s.s = cp; break;
      case 'cdrop': s.a = cp > 0 ? 1 : 0; s.dy = -(1 - EASE.bounce(cp)) * 1.6 * fs; break;
      case 'karaoke': s.col = cp >= 1 ? ca.hl : null; break;
      case 'wave': s.dy = Math.sin(u * 6.283 - i * .6) * fs * .13; break;
      case 'cbounce': s.dy = -Math.abs(Math.sin(u * 6.283 - i * .5)) * fs * .22; break;
      case 'crainbow': s.col = 'hsl(' + ((u * 360 + i * 28) % 360) + ',95%,62%)'; break;
      case 'jitter': s.dx = (rnd(Math.floor(u * 10) * 31 + i) - .5) * fs * .09; s.dy = (rnd(Math.floor(u * 10) * 17 + i + 5) - .5) * fs * .09; break;
      case 'cscale': s.s = 1 + .16 * Math.sin(u * 6.283 - i * .5); break;
    }
    return s;
  }
  function drawText(lc, c, DW, DH, k, ca) {
    const T = c.text; lc.save(); lc.translate(DW / 2, DH / 2);
    lc.font = fontStr(T); lc.textBaseline = 'middle'; lc.textAlign = 'left';
    const LS = 'letterSpacing' in lc; if (LS) lc.letterSpacing = (T.ls || 0) + 'px';
    const maxW = DW * (T.w || 80) / 100, txt = T.upper ? String(T.txt).toUpperCase() : String(T.txt), lines = [];
    txt.split('\n').forEach(par => { let cur = ''; par.split(' ').forEach(w => { const test = cur ? cur + ' ' + w : w; if (cur && lc.measureText(test).width > maxW) { lines.push(cur); cur = w; } else cur = test; }); lines.push(cur); });
    const lh = T.size * (T.lh || 1.2), widths = lines.map(l => lc.measureText(l).width), bw = Math.max(1, ...widths), bh = lh * lines.length, pad = T.bg.on ? T.bg.pad : 0;
    BB[c.id] = { w: bw + 2 * pad, h: bh + 2 * pad };
    if (T.bg.on) { lc.save(); lc.globalAlpha = T.bg.a; lc.fillStyle = T.bg.c; lc.beginPath(); rrectPath(lc, -bw / 2 - pad, -bh / 2 - pad, bw + 2 * pad, bh + 2 * pad, T.bg.r); lc.fill(); lc.restore(); }
    let fill = T.color; if (T.grad.on) { const g = lc.createLinearGradient(-bw / 2, -bh / 2, bw / 2, bh / 2); g.addColorStop(0, T.grad.c1); g.addColorStop(1, T.grad.c2); fill = g; }
    const shOn = T.shadow.on, sk = k;
    function paint(str, x, y, col, alpha) {
      if (T.glow.on) { lc.save(); lc.shadowColor = T.glow.c; lc.shadowBlur = T.glow.b * sk; lc.fillStyle = col || fill; if (alpha != null) lc.globalAlpha *= alpha; lc.fillText(str, x, y); lc.fillText(str, x, y); lc.restore(); }
      lc.save(); if (alpha != null) lc.globalAlpha *= alpha;
      if (shOn) { lc.shadowColor = T.shadow.c; lc.shadowBlur = T.shadow.b * sk; lc.shadowOffsetX = T.shadow.x * sk; lc.shadowOffsetY = T.shadow.y * sk; }
      if (T.stroke.on) { lc.lineWidth = T.stroke.w; lc.lineJoin = 'round'; lc.miterLimit = 2; lc.strokeStyle = T.stroke.c; lc.strokeText(str, x, y); lc.shadowColor = 'rgba(0,0,0,0)'; }
      lc.fillStyle = col || fill; lc.fillText(str, x, y); lc.restore();
    }
    let gi = 0; const nAll = lines.reduce((a, l) => a + graphemes(l).length, 0);
    lines.forEach((ln, li) => {
      const lw = widths[li], x0 = T.align === 'left' ? -bw / 2 : T.align === 'right' ? bw / 2 - lw : -lw / 2, y = -bh / 2 + lh * (li + .5);
      if (!ca) { paint(ln, x0, y); return; }
      const ch = graphemes(ln);
      ch.forEach((g, j) => {
        const pre = lc.measureText(ch.slice(0, j).join('')).width, cw = lc.measureText(g).width, st = charState(ca, gi++, nAll, T.size);
        if (st.a <= 0.002) return;
        lc.save(); lc.translate(x0 + pre + cw / 2 + st.dx, y + st.dy); if (st.rot) lc.rotate(st.rot * Math.PI / 180); if (st.s !== 1) lc.scale(st.s, st.s);
        paint(g, -cw / 2, 0, st.col, st.a); lc.restore();
      });
    });
    if (LS) lc.letterSpacing = '0px';
    lc.restore();
  }
  function drawSticker(lc, c, DW, DH) {
    const T = c.sticker; lc.save(); lc.translate(DW / 2, DH / 2);
    const sz = T.size || 300; BB[c.id] = { w: sz, h: sz };
    if (T.type === 'emoji') { lc.font = sz * .85 + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji","Twemoji Mozilla",sans-serif'; lc.textAlign = 'center'; lc.textBaseline = 'middle'; lc.fillText(T.v, 0, sz * .04); }
    else {
      shapePath(lc, T.shape, sz, T.shape === 'line' ? sz * .5 : sz); lc.fillStyle = T.color || '#ffffff';
      if (T.shape === 'ring') lc.fill('evenodd'); else lc.fill();
      if (T.stroke) { lc.lineWidth = T.stroke; lc.strokeStyle = T.strokeC || '#000'; lc.stroke(); }
    }
    lc.restore();
  }

  /* ------------------------------------------------------------------ media element handling */
  function getEl(c) {
    let el = ELS.get(c.id); if (el) return el;
    const m = MEDIA[c.media]; if (!m || !m.url) return null;
    el = document.createElement('video'); el.muted = true; el.playsInline = true; el.preload = 'auto'; el.src = m.url; el.setAttribute('playsinline', ''); el.crossOrigin = 'anonymous';
    el.addEventListener('seeked', () => VS.rq()); el.addEventListener('loadeddata', () => VS.rq());
    ELS.set(c.id, el); return el;
  }
  const srcTime = (c, t) => { const m = MEDIA[c.media]; const lt = clamp(t - c.start, 0, c.dur); return clamp(c.in + lt * c.speed, 0, Math.max(0, (m ? m.dur : 1e9) - 0.04)); };
  function syncVideo(c, t, playing, visible) {
    const el = getEl(c); if (!el) return;
    const st = srcTime(c, t), inR = t >= c.start && t < c.start + c.dur;
    if (visible && playing && inR) {
      const r = clamp(c.speed, 0.0625, 16); if (el.playbackRate !== r) el.playbackRate = r;
      if (el.paused) { if (Math.abs(el.currentTime - st) > .05) el.currentTime = st; const pr = el.play(); if (pr && pr.catch) pr.catch(() => { }); }
      else if (Math.abs(el.currentTime - st) > .35) el.currentTime = st;
    } else {
      if (!el.paused) el.pause();
      if (visible || Math.abs(c.start - t) < 1.5) { if (Math.abs(el.currentTime - st) > .03 && !el.seeking) el.currentTime = st; }
    }
  }

  /* ------------------------------------------------------------------ colour grading */
  function adjFilter(a, k) {
    let f = '';
    if (a.br) f += ' brightness(' + (1 + a.br / 100) + ')'; if (a.co) f += ' contrast(' + (1 + a.co / 100) + ')'; if (a.sa) f += ' saturate(' + (1 + a.sa / 100) + ')';
    if (a.hue) f += ' hue-rotate(' + a.hue + 'deg)'; if (a.bl) f += ' blur(' + (a.bl * k) + 'px)'; return f.trim();
  }
  function overlayFx(cx, w, h, spec, t) {
    cx.save(); cx.setTransform(1, 0, 0, 1, 0, 0); cx.globalCompositeOperation = 'source-atop';
    if (spec.tint) { cx.globalAlpha = spec.tint[1]; cx.fillStyle = spec.tint[0]; cx.fillRect(0, 0, w, h); }
    if (spec.vig) { cx.globalAlpha = 1; const g = cx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * .25, w / 2, h / 2, Math.hypot(w, h) * .55); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,' + clamp(spec.vig, 0, 1) + ')'); cx.fillStyle = g; cx.fillRect(0, 0, w, h); }
    if (spec.grain) { const q = Math.floor(t * 24); cx.globalAlpha = clamp(spec.grain, 0, 1) * .3; cx.translate(rnd(q) * 256, rnd(q + 5) * 256); cx.fillStyle = cx.createPattern(noiseTile(), 'repeat'); cx.fillRect(-256, -256, w + 256, h + 256); }
    cx.restore();
  }
  function colorGrade(rt, src, c, k, t) {
    const a = c.adj, P = c.preset && FILTERS.find(f => f.id === c.preset);
    const fa = adjFilter(a, k);
    if (!P && !fa && !a.temp && !a.vig && !a.grain && !a.fade) return src;
    const dst = acquire(rt), dc = dst._c, w = dst.width, h = dst.height;
    const pf = P ? (P.f + (P.bl ? ' blur(' + (P.bl * k) + 'px)' : '')) : '';
    if (HAS_FILTER) {
      if (P && c.presetAmt < 100) {
        dc.filter = fa || 'none'; dc.drawImage(src, 0, 0); dc.filter = 'none';
        dc.globalAlpha = c.presetAmt / 100; dc.filter = (pf + ' ' + fa).trim(); dc.drawImage(src, 0, 0); dc.filter = 'none'; dc.globalAlpha = 1;
      } else { dc.filter = (pf + ' ' + fa).trim() || 'none'; dc.drawImage(src, 0, 0); dc.filter = 'none'; }
    } else dc.drawImage(src, 0, 0);
    const am = P ? c.presetAmt / 100 : 0, sp = {};
    if (P && P.tint) sp.tint = [P.tint[0], P.tint[1] * am];
    if (P && P.vig) sp.vig = P.vig * am;
    if (P && P.grain) sp.grain = P.grain * am;
    if (a.vig) sp.vig = clamp((sp.vig || 0) + a.vig / 100, 0, 1);
    if (a.grain) sp.grain = clamp((sp.grain || 0) + a.grain / 100, 0, 1);
    if (sp.tint || sp.vig || sp.grain) overlayFx(dc, w, h, sp, t);
    if (a.temp) overlayFx(dc, w, h, { tint: [a.temp > 0 ? '#ff8c1a' : '#1a6bff', Math.abs(a.temp) / 100 * .3] }, t);
    if (a.fade) overlayFx(dc, w, h, { tint: ['#8a8a8a', a.fade / 100 * .4] }, t);
    return dst;
  }

  /* ------------------------------------------------------------------ chroma key */
  function chromaKey(cv, ck) {
    const c = ctx2(cv), w = cv.width, h = cv.height, id = c.getImageData(0, 0, w, h), d = id.data;
    const hx = ck.color.replace('#', ''), kr = parseInt(hx.substr(0, 2), 16), kg = parseInt(hx.substr(2, 2), 16), kb = parseInt(hx.substr(4, 2), 16);
    const cb = -.169 * kr - .331 * kg + .5 * kb, cr = .5 * kr - .419 * kg - .081 * kb;
    const t0 = ck.sim * 1.3, sm = Math.max(1, ck.sm * 1.3), dom = (kg >= kr && kg >= kb) ? 1 : (kb >= kr && kb >= kg) ? 2 : 0, spill = (ck.spill == null ? 50 : ck.spill) / 100;
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2], pcb = -.169 * r - .331 * g + .5 * b, pcr = .5 * r - .419 * g - .081 * b;
      const dist = Math.sqrt((pcb - cb) * (pcb - cb) + (pcr - cr) * (pcr - cr)), a = clamp((dist - t0) / sm, 0, 1);
      d[i + 3] = d[i + 3] * a;
      if (a > 0 && spill > 0) { const o = dom === 1 ? Math.max(r, b) : dom === 2 ? Math.max(r, g) : Math.max(g, b); if (dom === 1 && g > o) d[i + 1] = lerp(g, o, spill); else if (dom === 2 && b > o) d[i + 2] = lerp(b, o, spill); else if (dom === 0 && r > o) d[i] = lerp(r, o, spill); }
    }
    c.putImageData(id, 0, 0);
  }

  /* ------------------------------------------------------------------ effects renderer */
  function rgbSplit(rt, cv, off) {
    const c = cv._c, w = cv.width, h = cv.height, src = copyOf(rt, cv);
    c.clearRect(0, 0, w, h); c.globalCompositeOperation = 'lighter';
    [['#ff0000', -off], ['#00ff00', 0], ['#0000ff', off]].forEach(ch => {
      const L = acquire(rt), lc = L._c; lc.drawImage(src, 0, 0); lc.globalCompositeOperation = 'multiply'; lc.fillStyle = ch[0]; lc.fillRect(0, 0, w, h);
      lc.globalCompositeOperation = 'destination-in'; lc.drawImage(src, 0, 0); lc.globalCompositeOperation = 'source-over';
      c.drawImage(L, ch[1], 0);
    });
    c.globalCompositeOperation = 'source-over';
  }
  function particles(c, w, h, k, t, a, kind) {
    const n = Math.floor(30 + a * 90);
    for (let i = 0; i < n; i++) {
      const r1 = rnd(i + 1), r2 = rnd(i + 101), r3 = rnd(i + 211), r4 = rnd(i + 331);
      if (kind === 'snow') { const x = (r1 * w + Math.sin(t * 1.3 + i) * 24 * k) % w, y = (r2 * h + t * (50 + r3 * 90) * k) % h; c.globalAlpha = .55 + .4 * r4; c.fillStyle = '#fff'; c.beginPath(); c.arc(x, y, (1.5 + r3 * 4) * k, 0, 6.283); c.fill(); }
      else if (kind === 'rain') { const x = (r1 * w + t * 120 * k) % w, y = (r2 * h + t * (900 + r3 * 500) * k) % h; c.globalAlpha = .4; c.strokeStyle = '#cfe8ff'; c.lineWidth = Math.max(1, 1.5 * k); c.beginPath(); c.moveTo(x, y); c.lineTo(x - 10 * k, y + 38 * k); c.stroke(); }
      else if (kind === 'confetti') { const x = (r1 * w + Math.sin(t * 2 + i) * 40 * k + w) % w, y = (r2 * h + t * (160 + r3 * 220) * k) % h; c.save(); c.translate(x, y); c.rotate(t * (2 + r4 * 5) + i); c.globalAlpha = 1; c.fillStyle = 'hsl(' + Math.floor(r4 * 360) + ',90%,58%)'; c.fillRect(-6 * k, -3 * k, 12 * k, 6 * k); c.restore(); }
      else if (kind === 'hearts') { const x = (r1 * w + Math.sin(t * 1.5 + i) * 30 * k + w) % w, y = h - ((r2 * h + t * (70 + r3 * 110) * k) % h); c.globalAlpha = Math.min(1, y / (h * .3)) * .9; c.font = (22 + r4 * 38) * k + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; c.textAlign = 'center'; c.fillText(r4 > .5 ? '💖' : '❤️', x, y); }
      else if (kind === 'sparkle') { if (i > n * .6) continue; const x = r1 * w, y = r2 * h, ph = Math.sin(t * (2 + r3 * 4) + i * 3), s = Math.max(0, ph) * (6 + r4 * 14) * k; if (s < 1) continue; c.globalAlpha = Math.max(0, ph); c.fillStyle = '#fff6b0'; c.beginPath(); c.moveTo(x, y - s); c.quadraticCurveTo(x, y, x + s, y); c.quadraticCurveTo(x, y, x, y + s); c.quadraticCurveTo(x, y, x - s, y); c.quadraticCurveTo(x, y, x, y - s); c.fill(); }
      else if (kind === 'bokeh') { if (i > n * .35) continue; const x = (r1 * w + Math.sin(t * .4 + i) * 60 * k + w) % w, y = (r2 * h + Math.cos(t * .3 + i) * 50 * k + h) % h, r = (14 + r3 * 46) * k; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'hsla(' + Math.floor(r4 * 70 + 20) + ',100%,80%,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.globalAlpha = .55 + .4 * Math.sin(t + i); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); }
    }
    c.globalAlpha = 1;
  }
  function fxApply(rt, cv, f, t, k) {
    const c = cv._c, w = cv.width, h = cv.height, a = clamp((f.amt == null ? 50 : f.amt) / 100, 0, 1), q = Math.floor(t * 14);
    c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
    switch (f.type) {
      case 'blur': if (HAS_FILTER) { const tmp = copyOf(rt, cv); c.clearRect(0, 0, w, h); c.filter = 'blur(' + (a * 30 * k + .5) + 'px)'; c.drawImage(tmp, 0, 0); } break;
      case 'glitch': { const tmp = copyOf(rt, cv), n = Math.floor(4 + a * 12); for (let i = 0; i < n; i++) { const y = rnd(q * 13 + i) * h, hh = (rnd(q * 7 + i + 3) * .07 * h + 3 * k) * (.4 + a), dx = (rnd(q * 5 + i + 9) - .5) * w * .25 * a; c.clearRect(0, y, w, hh); c.drawImage(tmp, 0, y, w, hh, dx, y, w, hh); } if (a > .25) rgbSplit(rt, cv, a * 14 * k * (.5 + rnd(q))); break; }
      case 'rgb': rgbSplit(rt, cv, a * 30 * k * (1 + .3 * Math.sin(t * 9))); break;
      case 'shake': { const tmp = copyOf(rt, cv), m = a * .03 * w; c.clearRect(0, 0, w, h); c.translate(w / 2 + (rnd(q * 3) - .5) * 2 * m, h / 2 + (rnd(q * 3 + 1) - .5) * 2 * m); const s = 1 + a * .07; c.scale(s, s); c.drawImage(tmp, -w / 2, -h / 2); break; }
      case 'pulse': { const tmp = copyOf(rt, cv), s = 1 + a * .14 * Math.pow(1 - fr(t * 2), 3); c.clearRect(0, 0, w, h); c.translate(w / 2, h / 2); c.scale(s, s); c.drawImage(tmp, -w / 2, -h / 2); break; }
      case 'flash': c.globalAlpha = Math.pow(1 - fr(t * 1.5), 3) * a; c.fillStyle = '#fff'; c.fillRect(0, 0, w, h); break;
      case 'strobe': if (fr(t * 7) < .5) { c.globalAlpha = .55 * a + .1; c.fillStyle = '#000'; c.fillRect(0, 0, w, h); } break;
      case 'wave': { const tmp = copyOf(rt, cv), sh = Math.max(2, Math.round(4 * k)); c.clearRect(0, 0, w, h); for (let y = 0; y < h; y += sh) c.drawImage(tmp, 0, y, w, sh, Math.sin(y / (60 * k) + t * 4) * a * 26 * k, y, w, sh); break; }
      case 'pixelate': { const p = Math.max(2, Math.round((a * 40 + 2) * k)), tmp = copyOf(rt, cv), t2 = acquire(rt), sw = Math.ceil(w / p), sh = Math.ceil(h / p); t2._c.drawImage(tmp, 0, 0, w, h, 0, 0, sw, sh); c.clearRect(0, 0, w, h); c.imageSmoothingEnabled = false; c.drawImage(t2, 0, 0, sw, sh, 0, 0, sw * p, sh * p); break; }
      case 'mirror': { const tmp = copyOf(rt, cv); c.clearRect(0, 0, w, h); c.drawImage(tmp, 0, 0, w / 2, h, 0, 0, w / 2, h); c.translate(w, 0); c.scale(-1, 1); c.drawImage(tmp, 0, 0, w / 2, h, 0, 0, w / 2, h); break; }
      case 'kaleido': { const tmp = copyOf(rt, cv); c.clearRect(0, 0, w, h); [[1, 1, 0, 0], [-1, 1, w, 0], [1, -1, 0, h], [-1, -1, w, h]].forEach(m => { c.save(); c.translate(m[2], m[3]); c.scale(m[0], m[1]); c.drawImage(tmp, w / 4, h / 4, w / 2, h / 2, 0, 0, w / 2, h / 2); c.restore(); }); break; }
      case 'hue': if (HAS_FILTER) { const tmp = copyOf(rt, cv); c.clearRect(0, 0, w, h); c.filter = 'hue-rotate(' + ((t * 140 * (.3 + a)) % 360) + 'deg) saturate(1.3)'; c.drawImage(tmp, 0, 0); } break;
      case 'vignette': overlayFx(c, w, h, { vig: .25 + a * .75 }, t); break;
      case 'grain': overlayFx(c, w, h, { grain: .3 + a * .7 }, t); break;
      case 'vhs': { rgbSplit(rt, cv, (3 + a * 8) * k); const tmp = copyOf(rt, cv), y = (fr(t * .35) * h), hh = 14 * k + a * 30 * k; c.clearRect(0, y, w, hh); c.drawImage(tmp, 0, y, w, hh, (rnd(q) - .5) * 40 * k * a, y, w, hh); c.globalCompositeOperation = 'source-atop'; c.globalAlpha = .35 * a; c.fillStyle = '#000'; for (let yy = 0; yy < h; yy += 4 * k) c.fillRect(0, yy, w, 1.5 * k); c.globalAlpha = .12; c.fillStyle = '#7050ff'; c.fillRect(0, 0, w, h); break; }
      case 'scan': c.globalCompositeOperation = 'source-atop'; c.globalAlpha = .45 * a + .1; c.fillStyle = '#000'; for (let y = 0; y < h; y += 4 * k) c.fillRect(0, y, w, 1.6 * k); break;
      case 'glow': if (HAS_FILTER) { const tmp = copyOf(rt, cv); c.globalCompositeOperation = 'screen'; c.globalAlpha = .4 + a * .6; c.filter = 'blur(' + (10 + a * 24) * k + 'px) brightness(1.3)'; c.drawImage(tmp, 0, 0); } break;
      case 'leak': { c.globalCompositeOperation = 'screen'; const x = w * (.5 + .45 * Math.sin(t * .6)), g = c.createRadialGradient(x, h * .25, 0, x, h * .25, Math.max(w, h) * .6); g.addColorStop(0, 'rgba(255,140,40,' + (.55 * a + .1) + ')'); g.addColorStop(.5, 'rgba(255,40,120,' + (.25 * a) + ')'); g.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(0, 0, w, h); break; }
      case 'bars': { const bh = h * (.05 + a * .1); c.fillStyle = '#000'; c.fillRect(0, 0, w, bh); c.fillRect(0, h - bh, w, bh); break; }
      case 'invert': if (HAS_FILTER) { const tmp = copyOf(rt, cv); c.clearRect(0, 0, w, h); c.filter = 'invert(' + a + ')'; c.drawImage(tmp, 0, 0); } break;
      case 'bw': if (HAS_FILTER) { const tmp = copyOf(rt, cv); c.clearRect(0, 0, w, h); c.filter = 'grayscale(' + a + ')'; c.drawImage(tmp, 0, 0); } break;
      case 'snow': case 'rain': case 'confetti': case 'hearts': case 'sparkle': case 'bokeh': particles(c, w, h, k, t, a, f.type); break;
    }
    c.restore();
  }
  VS.fxApply = fxApply;

  /* ------------------------------------------------------------------ reveal / mask helpers */
  function applyReveal(c, rv, cx, cy, DW, DH) {
    c.beginPath();
    if (rv.circle != null) { c.arc(cx, cy, rv.circle * Math.hypot(DW, DH) / 2 + .01, 0, 6.283); }
    else if (rv.blinds) { const n = rv.blinds.n, sw = DW / n; for (let i = 0; i < n; i++) c.rect(cx - DW / 2 + i * sw, cy - DH / 2, sw * rv.blinds.p, DH); }
    else c.rect(cx - DW / 2 + rv.l * DW, cy - DH / 2 + rv.t * DH, (rv.r - rv.l) * DW, (rv.b - rv.t) * DH);
    c.clip();
  }

  /* ------------------------------------------------------------------ clip state (transform + animation) */
  function mix(st, a) {
    if (!a) return; st.dx += a.dx || 0; st.dy += a.dy || 0; if (a.s != null) st.s *= a.s; if (a.sx != null) st.sx *= a.sx; if (a.sy != null) st.sy *= a.sy;
    st.rot += a.rot || 0; if (a.op != null) st.op *= a.op; st.blur += a.blur || 0; st.hue += a.hue || 0; if (a.reveal) st.reveal = a.reveal; if (a.sreveal) st.sreveal = a.sreveal;
  }
  function baseState(c, t) {
    const lt = t - c.start;
    return Object.assign(DEF(), { dx: propVal(c, 'x', lt) / 100, dy: propVal(c, 'y', lt) / 100, s: propVal(c, 's', lt) / 100, rot: propVal(c, 'rot', lt), op: propVal(c, 'op', lt) / 100, sx: c.tf.fx ? -1 : 1, sy: c.tf.fy ? -1 : 1, sreveal: null });
  }
  VS.baseState = baseState;
  function charAnimFor(c, t) {
    const lt = t - c.start, A = c.anim; if (lt < 0 || lt > c.dur) return null;
    const ai = A.in && CIN[A.in.type] ? A.in : null, ao = A.out && CIN[A.out.type] ? A.out : null, al = A.loop && CLOOP[A.loop.type] ? A.loop : null;
    const hl = c.text && c.text.hl;
    if (ai) { const d = Math.min(ai.dur, c.dur * .6); if (lt < d) return { type: ai.type, p: lt / d, u: 0, hl }; }
    if (ao) { const d = Math.min(ao.dur, c.dur * .6); if (lt > c.dur - d) return { type: ao.type, p: 1 - (lt - (c.dur - d)) / d, u: 0, hl }; }
    if (al) return { type: al.type, p: 1, u: lt * (al.speed || 1), hl };
    if (ai && ai.type === 'karaoke') return { type: 'karaoke', p: 1, u: 0, hl };
    return null;
  }
  function clipState(c, t, extra) {
    const st = baseState(c, t), lt = t - c.start, A = c.anim;
    if (lt >= 0 && lt <= c.dur) {
      if (A.in && IN[A.in.type]) { const d = Math.max(.05, Math.min(A.in.dur, c.dur * .6)); if (lt < d) mix(st, IN[A.in.type](clamp(lt / d, 0, 1))); }
      if (A.out && IN[A.out.type]) { const d = Math.max(.05, Math.min(A.out.dur, c.dur * .6)); if (lt > c.dur - d) mix(st, IN[A.out.type](clamp(1 - (lt - (c.dur - d)) / d, 0, 1))); }
      if (A.loop && LOOP[A.loop.type]) mix(st, LOOP[A.loop.type](lt * (A.loop.speed || 1), clamp(lt / Math.max(.01, c.dur), 0, 1)));
    }
    if (c.trans === undefined) { }
    mix(st, extra); return st;
  }

  /* ------------------------------------------------------------------ build a clip layer */
  function drawFit(lc, src, sw, sh, DW, DH, mode, id) {
    if (!sw || !sh) return; let w, h;
    if (mode === 'stretch') { w = DW; h = DH; } else { const s = mode === 'cover' ? Math.max(DW / sw, DH / sh) : Math.min(DW / sw, DH / sh); w = sw * s; h = sh * s; }
    lc.drawImage(src, (DW - w) / 2, (DH - h) / 2, w, h);
    BB[id] = mode === 'cover' ? { w: Math.min(w, DW), h: Math.min(h, DH) } : { w, h };
  }
  function buildLayer(c, t, rt, k, DW, DH) {
    const L = acquire(rt), lc = L._c; lc.setTransform(k, 0, 0, k, 0, 0); let ok = true;
    if (c.kind === 'video') { const el = getEl(c); if (el && el.videoWidth && el.readyState >= 2) drawFit(lc, el, el.videoWidth, el.videoHeight, DW, DH, c.fit, c.id); else ok = false; }
    else if (c.kind === 'image') { const m = MEDIA[c.media]; if (m && m.img) drawFit(lc, m.img, m.w, m.h, DW, DH, c.fit, c.id); else ok = false; }
    else if (c.kind === 'text') drawText(lc, c, DW, DH, k, charAnimFor(c, t));
    else if (c.kind === 'sticker') drawSticker(lc, c, DW, DH);
    else ok = false;
    if (!ok) return null;
    let out = L;
    if (c.chroma && c.chroma.on) chromaKey(out, c.chroma);
    out = colorGrade(rt, out, c, k, t);
    for (const f of c.fx) { fxApply(rt, out, f, t, k); }
    return out;
  }
  function composite(c2d, layer, st, clip, DW, DH, k) {
    if (st.op <= .002) return;
    c2d.save(); c2d.globalAlpha = clamp(st.op, 0, 1); c2d.globalCompositeOperation = clip.blend || 'source-over';
    if (st.sreveal) applyReveal(c2d, st.sreveal, DW / 2, DH / 2, DW, DH);
    let f = ''; if (HAS_FILTER) { if (st.blur > .1) f += ' blur(' + (st.blur * k) + 'px)'; if (st.hue) f += ' hue-rotate(' + st.hue + 'deg)'; if (f) c2d.filter = f.trim(); }
    c2d.translate(DW / 2 + st.dx * DW, DH / 2 + st.dy * DH); c2d.rotate(st.rot * Math.PI / 180); c2d.scale(st.s * st.sx, st.s * st.sy);
    if (st.reveal) applyReveal(c2d, st.reveal, 0, 0, DW, DH);
    if (clip.mask) { const b = BB[clip.id] || { w: DW, h: DH }; shapePath(c2d, clip.mask, clip.mask === 'circle' ? Math.min(b.w, b.h) : b.w * .92, clip.mask === 'circle' ? Math.min(b.w, b.h) : b.h * .92); c2d.clip(clip.mask === 'ring' ? 'evenodd' : 'nonzero'); }
    c2d.drawImage(layer, -DW / 2, -DH / 2, DW, DH);
    c2d.restore();
  }

  /* ------------------------------------------------------------------ frame renderer */
  const laneClips = lid => S.clips.filter(c => c.lane === lid).sort((a, b) => a.start - b.start);
  VS.laneClips = laneClips;
  const adjPrev = (c, list) => { const p = list[list.indexOf(c) - 1]; return p && Math.abs(p.start + p.dur - c.start) < .03 ? p : null; };
  const transDur = (c, p) => c.trans && p ? Math.max(.1, Math.min(c.trans.dur, p.dur * 1.8, c.dur * 1.8)) : 0;
  VS.adjPrev = adjPrev;

  function renderTo(cv, rt, t) {
    const [DW, DH] = dims(), c = ctx2(cv), k = cv.width / DW; rt.w = cv.width; rt.h = cv.height; rt.i = 0;
    c.setTransform(1, 0, 0, 1, 0, 0); c.globalAlpha = 1; c.globalCompositeOperation = 'source-over'; c.filter = 'none';
    c.fillStyle = S.bg.color || '#000'; c.fillRect(0, 0, cv.width, cv.height);
    /* decide which video elements to drive */
    const vis = new Set();
    S.lanes.forEach(L => { if (L.kind !== 'v' || L.hidden) return; const list = laneClips(L.id);
      list.forEach((cl, i) => { const p = adjPrev(cl, list), d = transDur(cl, p), nx = list[i + 1], nd = nx ? transDur(nx, adjPrev(nx, list)) : 0;
        if (t >= cl.start - d / 2 - 1e-6 && t < cl.start + cl.dur + nd / 2) vis.add(cl.id); }); });
    S.clips.forEach(cl => { if (cl.kind === 'video') syncVideo(cl, t, S.playing, vis.has(cl.id)); });
    /* blurred background */
    if (S.bg.type === 'blur' && HAS_FILTER) {
      const ml = mainLane(); const base = ml && laneClips(ml.id).find(cl => (cl.kind === 'video' || cl.kind === 'image') && t >= cl.start && t < cl.start + cl.dur) || S.clips.find(cl => (cl.kind === 'video' || cl.kind === 'image') && vis.has(cl.id));
      if (base) { let src = null, sw = 0, sh = 0; if (base.kind === 'video') { const el = ELS.get(base.id); if (el && el.readyState >= 2) { src = el; sw = el.videoWidth; sh = el.videoHeight; } } else { const m = MEDIA[base.media]; if (m && m.img) { src = m.img; sw = m.w; sh = m.h; } }
        if (src && sw) { const s = Math.max(cv.width / sw, cv.height / sh) * 1.15; c.save(); c.filter = 'blur(' + (28 * k) + 'px) brightness(.55)'; c.drawImage(src, (cv.width - sw * s) / 2, (cv.height - sh * s) / 2, sw * s, sh * s); c.restore(); } }
    }
    c.setTransform(k, 0, 0, k, 0, 0);
    for (let li = S.lanes.length - 1; li >= 0; li--) {
      const L = S.lanes[li]; if (L.kind !== 'v' || L.hidden) continue;
      const list = laneClips(L.id), drawn = new Set();
      for (let i = 0; i < list.length; i++) {
        const cl = list[i]; if (drawn.has(cl.id)) continue;
        const nx = list[i + 1], nd = nx ? transDur(nx, adjPrev(nx, list)) : 0;
        if (nd > 0 && t >= nx.start - nd / 2 && t < nx.start + nd / 2) {
          drawn.add(nx.id); const p = clamp((t - (nx.start - nd / 2)) / nd, 0, 1), T = (TRANS[nx.trans.type] || TRANS.fade)(p);
          const first = T.order === 'BA' ? [nx, T.B] : [cl, T.A], second = T.order === 'BA' ? [cl, T.A] : [nx, T.B];
          drawItem(c, first[0], t, first[1], rt, k, DW, DH); drawItem(c, second[0], t, second[1], rt, k, DW, DH);
          if (T.over) { c.save(); c.globalAlpha = clamp(T.over.a, 0, 1); c.fillStyle = T.over.c; c.fillRect(0, 0, DW, DH); c.restore(); }
          if (T.post) { fxApply(rt, cv, T.post, t, k); c.setTransform(k, 0, 0, k, 0, 0); }
        } else if (t >= cl.start && t < cl.start + cl.dur) drawItem(c, cl, t, null, rt, k, DW, DH);
      }
    }
    c.setTransform(1, 0, 0, 1, 0, 0);
  }
  function drawItem(c, cl, t, extra, rt, k, DW, DH) {
    const cv = c.canvas;
    if (cl.kind === 'effect') { const lt = t - cl.start; cl.fx.forEach(f => fxApply(rt, cv, f, t, k)); c.setTransform(k, 0, 0, k, 0, 0); return; }
    if (cl.kind === 'adjust') { const g = colorGrade(rt, cv, cl, k, t); if (g !== cv) { c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, cv.width, cv.height); c.drawImage(g, 0, 0); c.restore(); } c.setTransform(k, 0, 0, k, 0, 0); return; }
    const layer = buildLayer(cl, t, rt, k, DW, DH); if (!layer) return;
    composite(c, layer, clipState(cl, t, extra), cl, DW, DH, k);
  }

  /* ------------------------------------------------------------------ preview canvas */
  VS.cv = null; const rtPrev = mkRT(); let rqPend = false;
  VS.renderPreview = function () { if (!VS.cv) return; renderTo(VS.cv, rtPrev, S.t); hk('onFrame'); };
  VS.rq = function () { if (rqPend) return; rqPend = true; requestAnimationFrame(() => { rqPend = false; if (!S.playing) VS.renderPreview(); }); };
  VS.renderToCanvas = (cv, t) => { const rt = mkRT(); renderTo(cv, rt, t); };

  /* ------------------------------------------------------------------ audio */
  let AC = null, master = null, AUD = [];
  VS.getAC = function () { if (!AC) { const C = window.AudioContext || window.webkitAudioContext; AC = new C(); master = AC.createGain(); master.connect(AC.destination); VS.master = master; } return AC; };
  function stopAudio() { AUD.forEach(n => { try { n.src.stop(); } catch (e) { } try { n.src.disconnect(); n.g.disconnect(); } catch (e) { } }); AUD = []; }
  function schedAudio(t0, a0) {
    stopAudio(); if (!AC) return;
    S.clips.forEach(c => {
      if (!hasMedia(c)) return; const L = laneById(c.lane); if (L && (L.muted || L.hidden && c.kind === 'video')) return;
      const m = MEDIA[c.media]; if (!m || !m.buf || c.vol <= 0) return;
      const ct0 = Math.max(c.start, t0), end = c.start + c.dur; if (ct0 >= end - .005) return;
      const off = c.in + (ct0 - c.start) * c.speed; if (off >= m.buf.duration) return;
      const when = a0 + (ct0 - t0), src = AC.createBufferSource(), g = AC.createGain(); src.buffer = m.buf; src.playbackRate.value = clamp(c.speed, .0625, 16);
      const gainAt = τ => c.vol * Math.min(1, c.fadeIn > 0 ? (τ - c.start) / c.fadeIn : 1) * Math.min(1, c.fadeOut > 0 ? (end - τ) / c.fadeOut : 1);
      g.gain.setValueAtTime(Math.max(0, gainAt(ct0)), when);
      if (c.fadeIn > 0 && c.start + c.fadeIn > ct0) g.gain.linearRampToValueAtTime(c.vol, a0 + (c.start + c.fadeIn - t0));
      if (c.fadeOut > 0) { const fo = end - c.fadeOut; if (fo > ct0) { g.gain.setValueAtTime(c.vol * Math.min(1, c.fadeIn > 0 ? Math.max(0, fo - c.start) / c.fadeIn : 1), a0 + (fo - t0)); } g.gain.linearRampToValueAtTime(0, a0 + (end - t0)); }
      src.connect(g); g.connect(master);
      try { src.start(Math.max(when, AC.currentTime), off, Math.min((end - ct0) * c.speed, m.buf.duration - off)); AUD.push({ src, g }); } catch (e) { }
    });
  }
  VS.restartAudio = function () { if (S.playing && AC) { P.a0 = AC.currentTime + .05; P.t0 = S.t; schedAudio(S.t, P.a0); } };

  /* ------------------------------------------------------------------ transport */
  const P = { a0: 0, t0: 0 };
  VS.play = function () {
    if (S.playing) return; const T = total(); if (T <= 0) return;
    if (S.t >= T - .03) S.t = 0;
    const ac = VS.getAC(); if (ac.state === 'suspended') ac.resume();
    S.playing = true; P.a0 = ac.currentTime + .06; P.t0 = S.t; schedAudio(S.t, P.a0); hk('onPlay'); loop();
  };
  VS.pause = function () {
    if (!S.playing) return; S.playing = false; stopAudio(); ELS.forEach(e => { try { e.pause(); } catch (x) { } }); hk('onPlay'); VS.rq();
  };
  VS.toggle = () => S.playing ? VS.pause() : VS.play();
  VS.seek = function (t) { S.t = clamp(t, 0, Math.max(total(), 0)); if (S.playing) VS.restartAudio(); else VS.rq(); hk('onTick'); };
  function loop() {
    if (!S.playing || EXP.running) return;
    const T = total(), nt = P.t0 + Math.max(0, AC.currentTime - P.a0);
    if (nt >= T) { S.t = T; VS.pause(); VS.renderPreview(); hk('onTick'); return; }
    S.t = nt; VS.renderPreview(); hk('onTick'); requestAnimationFrame(loop);
  }

  /* ------------------------------------------------------------------ history */
  const H = { a: [], i: -1 };
  const snap = () => JSON.stringify({ ratio: S.ratio, bg: S.bg, fps: S.fps, lanes: S.lanes, clips: S.clips, markers: S.markers });
  function pruneLanes() {
    const used = new Set(S.clips.map(c => c.lane)); let keptA = false;
    S.lanes = S.lanes.filter(l => { if (l.main) return true; if (l.kind === 'a') { if (used.has(l.id)) { keptA = true; return true; } return false; } return used.has(l.id); });
    if (!S.lanes.some(l => l.kind === 'a')) S.lanes.push({ id: nid('La'), kind: 'a' });
  }
  VS.commit = function (noPrune) { if (!noPrune) pruneLanes(); const s = snap(); if (H.a[H.i] === s) { hk('onChange'); return; } H.a = H.a.slice(0, H.i + 1); H.a.push(s); if (H.a.length > 100) H.a.shift(); H.i = H.a.length - 1; hk('onChange'); VS.rq(); if (S.playing) VS.restartAudio(); };
  function load(s) { const o = JSON.parse(s); S.ratio = o.ratio; S.bg = o.bg; S.fps = o.fps; S.lanes = o.lanes; S.clips = o.clips; S.markers = o.markers; if (S.sel && !clipById(S.sel)) S.sel = null; ELS.forEach((e, id) => { if (!clipById(id)) { try { e.pause(); e.removeAttribute('src'); e.load(); } catch (x) { } ELS.delete(id); } }); hk('onChange'); VS.rq(); if (S.playing) VS.restartAudio(); }
  VS.undo = function () { if (H.i > 0) { H.i--; load(H.a[H.i]); } };
  VS.redo = function () { if (H.i < H.a.length - 1) { H.i++; load(H.a[H.i]); } };
  VS.canUndo = () => H.i > 0; VS.canRedo = () => H.i < H.a.length - 1;
  VS.histInit = function () { H.a = [snap()]; H.i = 0; };
  VS.histInit();

  /* ------------------------------------------------------------------ timeline operations */
  VS.addLane = function (kind) { const l = { id: nid('L'), kind }; if (kind === 'v') S.lanes.unshift(l); else S.lanes.push(l); return l; };
  function fitStart(lid, start, dur, ex) {
    start = Math.max(0, start); const others = S.clips.filter(o => o.lane === lid && o.id !== ex), ok = s => others.every(o => s >= o.start + o.dur - 1e-6 || s + dur <= o.start + 1e-6);
    if (ok(start)) return start; const cand = [0]; others.forEach(o => { cand.push(o.start + o.dur, o.start - dur); });
    let best = null; cand.filter(s => s >= 0 && ok(s)).forEach(s => { if (best === null || Math.abs(s - start) < Math.abs(best - start)) best = s; }); return best === null ? start : best;
  }
  VS.fitStart = fitStart;
  function freeLane(kind, start, dur) {
    const cands = S.lanes.filter(l => l.kind === kind && !l.main);
    for (const l of cands) if (fitStart(l.id, start, dur) === Math.max(0, start)) return l.id;
    return VS.addLane(kind).id;
  }
  VS.mainEnd = function () { const ml = mainLane(); return S.clips.filter(c => c.lane === ml.id).reduce((m, c) => Math.max(m, c.start + c.dur), 0); };
  /* o: {main:true} append to main track | {lane,start} | {start} auto lane */
  VS.addClip = function (c, o) {
    o = o || {}; const kind = c.kind === 'audio' ? 'a' : 'v'; let lid = o.lane, start = o.start == null ? S.t : o.start;
    if (o.main && kind === 'v') { lid = mainLane().id; start = o.at != null ? o.at : VS.mainEnd(); }
    else if (!lid) { lid = kind === 'a' ? (S.lanes.find(l => l.kind === 'a' && fitStart(l.id, start, c.dur) === Math.max(0, start)) || VS.addLane('a')).id : freeLane('v', start, c.dur); }
    c.lane = lid; c.start = fitStart(lid, start, c.dur, c.id); S.clips.push(c); S.sel = c.id; VS.commit(); return c;
  };
  VS.delClip = function (id, ripple) {
    const c = clipById(id); if (!c) return; const L = laneById(c.lane);
    S.clips = S.clips.filter(x => x.id !== id);
    if (ripple !== false && L && L.main) S.clips.forEach(x => { if (x.lane === L.id && x.start >= c.start + c.dur - 1e-6) x.start = Math.max(0, x.start - c.dur); });
    const e = ELS.get(id); if (e) { try { e.pause(); e.removeAttribute('src'); e.load(); } catch (x) { } ELS.delete(id); }
    if (S.sel === id) S.sel = null; VS.commit();
  };
  VS.dupClip = function (id) {
    const c = clipById(id); if (!c) return; const d = JSON.parse(JSON.stringify(c)); d.id = nid('c'); d.start = fitStart(c.lane, c.start + c.dur, c.dur, d.id); d.trans = null; S.clips.push(d); S.sel = d.id; VS.commit(); return d;
  };
  VS.splitAt = function (id, t) {
    const c = clipById(id); t = t == null ? S.t : t; if (!c || t <= c.start + .08 || t >= c.start + c.dur - .08) return null;
    const lt = t - c.start, B = JSON.parse(JSON.stringify(c)); B.id = nid('c'); B.start = t; B.dur = c.dur - lt; B.in = c.in + lt * c.speed; B.trans = null; B.anim.in = null; c.anim.out = null; c.dur = lt; B.fadeIn = 0; c.fadeOut = 0;
    ['x', 'y', 's', 'rot', 'op'].forEach(p => { const ks = c.keys[p]; if (!ks) return; const v = propVal(c, p, lt); B.keys[p] = [{ t: 0, v, e: 'inOut' }].concat(ks.filter(k => k.t > lt).map(k => ({ t: k.t - lt, v: k.v, e: k.e }))); c.keys[p] = ks.filter(k => k.t < lt).concat([{ t: lt, v, e: 'inOut' }]); });
    S.clips.push(B); S.sel = B.id; VS.commit(); return B;
  };
  VS.detachAudio = function (id) {
    const c = clipById(id); if (!c || c.kind !== 'video') return null; const m = MEDIA[c.media]; if (!m || !m.buf) return null;
    const a = VS.newClip('audio', { media: c.media, start: c.start, dur: c.dur, in: c.in, speed: c.speed, vol: c.vol, name: (m.name || 'Audio') }); c.vol = 0;
    const lid = (S.lanes.find(l => l.kind === 'a' && fitStart(l.id, a.start, a.dur) === a.start) || VS.addLane('a')).id; a.lane = lid; S.clips.push(a); S.sel = a.id; VS.commit(); return a;
  };
  VS.freezeFrame = function (id) {
    const c = clipById(id), t = S.t; if (!c || c.kind !== 'video' || t <= c.start + .1 || t >= c.start + c.dur - .1) return null;
    const el = ELS.get(c.id); if (!el || !el.videoWidth) return null;
    const cv = document.createElement('canvas'); cv.width = el.videoWidth; cv.height = el.videoHeight; cv.getContext('2d').drawImage(el, 0, 0);
    const img = new Image(), url = cv.toDataURL('image/jpeg', .92), m = { id: nid('m'), name: 'Freeze frame', kind: 'image', url: '', dur: 5, w: cv.width, h: cv.height, img };
    img.src = url; MEDIA[m.id] = m; const B = VS.splitAt(id, t); if (!B) return null;
    const FD = 2, L = S.clips.filter(x => x.lane === c.lane && x.start >= B.start - 1e-6); L.forEach(x => x.start += FD);
    const fz = VS.newClip('image', { media: m.id, start: t, dur: FD, lane: c.lane, fit: c.fit, name: 'Freeze' }); S.clips.push(fz); S.sel = fz.id; VS.commit(); return fz;
  };
  VS.setSpeed = function (c, sp) { const old = c.speed; c.speed = sp; c.dur = Math.max(.1, c.dur * old / sp); const m = MEDIA[c.media]; if (m && hasMedia(c)) { const maxD = (m.dur - c.in) / sp; if (c.dur > maxD) c.dur = Math.max(.1, maxD); } };

  /* ------------------------------------------------------------------ media import */
  const kindOf = f => { const t = f.type || '', n = (f.name || '').toLowerCase(); if (/^video\//.test(t) || /\.(mp4|mov|webm|mkv|m4v|3gp|avi)$/.test(n)) return 'video'; if (/^image\//.test(t) || /\.(png|jpe?g|gif|webp|bmp|avif|heic)$/.test(n)) return 'image'; if (/^audio\//.test(t) || /\.(mp3|wav|m4a|aac|ogg|opus|flac)$/.test(n)) return 'audio'; return null; };
  function peaksOf(buf, n) { const ch = buf.getChannelData(0), step = Math.max(1, Math.floor(ch.length / n)), out = new Float32Array(n); for (let i = 0; i < n; i++) { let mx = 0; const s = i * step, e = Math.min(ch.length, s + step); for (let j = s; j < e; j += Math.max(1, step >> 5)) { const v = Math.abs(ch[j]); if (v > mx) mx = v; } out[i] = mx; } return out; }
  async function decodeFile(file) { const ab = await file.arrayBuffer(), ac = VS.getAC(); return await new Promise((ok, no) => { const p = ac.decodeAudioData(ab, ok, no); if (p && p.then) p.then(ok, no); }); }
  async function genThumbs(m) {
    try {
      const v = document.createElement('video'); v.muted = true; v.preload = 'auto'; v.src = m.url; await new Promise(r => { v.onloadeddata = r; v.onerror = r; setTimeout(r, 4000); });
      const n = Math.min(20, Math.max(2, Math.ceil(m.dur / 1.2))), h = 96, w = Math.max(40, Math.round(h * (m.w / m.h || 1.78))), cv = document.createElement('canvas'); cv.width = w; cv.height = h; const x = cv.getContext('2d'); m.thumbs = [];
      for (let i = 0; i < n; i++) { const tt = Math.min(m.dur - .05, (i + .5) / n * m.dur); await new Promise(r => { const d = () => { v.removeEventListener('seeked', d); r(); }; v.addEventListener('seeked', d); v.currentTime = tt; setTimeout(r, 1500); }); x.drawImage(v, 0, 0, w, h); m.thumbs.push(cv.toDataURL('image/jpeg', .55)); if (i === 0 || i === n - 1) hk('onMedia'); }
      m.tw = w; m.th = h; hk('onMedia'); v.removeAttribute('src'); v.load();
    } catch (e) { }
  }
  VS.importFile = async function (file) {
    const kind = kindOf(file); if (!kind) throw new Error('Unsupported file: ' + file.name);
    const m = { id: nid('m'), name: file.name, kind, url: URL.createObjectURL(file), dur: 0, w: 0, h: 0, buf: null, peaks: null, thumbs: null, img: null };
    if (kind === 'image') { const img = new Image(); img.src = m.url; await new Promise((ok, no) => { img.onload = ok; img.onerror = () => no(new Error('Cannot open image')); }); m.img = img; m.w = img.naturalWidth; m.h = img.naturalHeight; m.dur = 5; }
    else if (kind === 'video') {
      const v = document.createElement('video'); v.preload = 'metadata'; v.muted = true; v.src = m.url;
      await new Promise((ok, no) => { v.onloadedmetadata = ok; v.onerror = () => no(new Error('This video format cannot be opened in your browser (try MP4 H.264 / WebM)')); });
      if (!isFinite(v.duration)) { v.currentTime = 1e9; await new Promise(r => { v.ontimeupdate = r; setTimeout(r, 2000); }); }
      m.dur = isFinite(v.duration) ? v.duration : 10; m.w = v.videoWidth; m.h = v.videoHeight;
      if (file.size < 400 * 1048576) decodeFile(file).then(b => { m.buf = b; m.peaks = peaksOf(b, Math.min(6000, Math.ceil(m.dur * 40))); hk('onMedia'); VS.rq(); }).catch(() => { m.noAudio = true; hk('onMedia'); });
      genThumbs(m);
    } else { const b = await decodeFile(file).catch(() => { throw new Error('Cannot read this audio file'); }); m.buf = b; m.dur = b.duration; m.peaks = peaksOf(b, Math.min(6000, Math.ceil(m.dur * 40))); }
    MEDIA[m.id] = m; hk('onMedia'); return m;
  };
  VS.addMediaClip = function (mid, o) {
    const m = MEDIA[mid]; if (!m) return null; o = o || {};
    const c = VS.newClip(m.kind, { media: mid, dur: m.kind === 'image' ? 4 : m.dur, name: m.name });
    if (m.kind === 'audio') return VS.addClip(c, { start: o.start });
    if (o.pip) { c.fit = 'contain'; c.tf.s = 45; c.tf.x = 25; c.tf.y = -25; c.dur = Math.min(c.dur, 10); return VS.addClip(c, { start: o.start == null ? S.t : o.start }); }
    if (!mainLane() || !S.clips.some(x => x.lane === mainLane().id)) { c.fit = m.w && m.h && Math.abs(m.w / m.h - dims()[0] / dims()[1]) < .25 ? 'cover' : 'contain'; }
    return VS.addClip(c, { main: true });
  };

  /* ------------------------------------------------------------------ generated sounds & music (no copyright) */
  async function synth(dur, fn) { const sr = 44100, oc = new OfflineAudioContext(2, Math.ceil(dur * sr), sr); fn(oc); return await oc.startRendering(); }
  function noiseSrc(oc, d) { const b = oc.createBuffer(1, Math.ceil(oc.sampleRate * d), oc.sampleRate), x = b.getChannelData(0); for (let i = 0; i < x.length; i++) x[i] = Math.random() * 2 - 1; const s = oc.createBufferSource(); s.buffer = b; return s; }
  function env(oc, d, t0, dur, vol, a, rel) { const g = oc.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.linearRampToValueAtTime(vol, t0 + (a || .005)); g.gain.exponentialRampToValueAtTime(.0001, t0 + dur); g.connect(d); return g; }
  function tone(oc, d, type, f, t0, dur, vol, a, f2) { const o = oc.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t0); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t0 + dur); o.connect(env(oc, d, t0, dur, vol, a)); o.start(t0); o.stop(t0 + dur + .05); }
  function drum(oc, d, kind, t0, vol) {
    if (kind === 'k') tone(oc, d, 'sine', 160, t0, .28, vol, .002, 42);
    else { const n = noiseSrc(oc, .3), f = oc.createBiquadFilter(); f.type = kind === 's' ? 'bandpass' : 'highpass'; f.frequency.value = kind === 's' ? 1800 : 7000; n.connect(f); f.connect(env(oc, d, t0, kind === 's' ? .18 : .05, vol * (kind === 's' ? 1 : .5), .002)); n.start(t0); n.stop(t0 + .3); }
  }
  const nf = m => 440 * Math.pow(2, (m - 69) / 12);
  const SOUNDS = VS.SOUNDS = [
    { id: 'whoosh', n: 'Whoosh', i: '💨', k: 'sfx', d: 1.2, f: oc => { const s = noiseSrc(oc, 1.3), f = oc.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.2; f.frequency.setValueAtTime(300, 0); f.frequency.exponentialRampToValueAtTime(5000, .5); f.frequency.exponentialRampToValueAtTime(400, 1.1); const g = oc.createGain(); g.gain.setValueAtTime(.0001, 0); g.gain.linearRampToValueAtTime(1.2, .5); g.gain.linearRampToValueAtTime(.0001, 1.2); s.connect(f); f.connect(g); g.connect(oc.destination); s.start(0); } },
    { id: 'pop', n: 'Pop', i: '🫧', k: 'sfx', d: .35, f: oc => tone(oc, oc.destination, 'sine', 700, 0, .2, .9, .003, 140) },
    { id: 'ding', n: 'Ding', i: '🔔', k: 'sfx', d: 1.8, f: oc => { [[880, .5], [1760, .22], [2640, .12]].forEach(p => tone(oc, oc.destination, 'sine', p[0], 0, 1.6, p[1], .003)); } },
    { id: 'boom', n: 'Boom hit', i: '💥', k: 'sfx', d: 1.6, f: oc => { tone(oc, oc.destination, 'sine', 130, 0, 1.2, 1, .004, 32); const n = noiseSrc(oc, .4), f = oc.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500; n.connect(f); f.connect(env(oc, oc.destination, 0, .4, .8, .003)); n.start(0); } },
    { id: 'click', n: 'Click', i: '🖱', k: 'sfx', d: .12, f: oc => { tone(oc, oc.destination, 'square', 1800, 0, .03, .5, .001, 600); } },
    { id: 'riser', n: 'Riser', i: '📈', k: 'sfx', d: 3, f: oc => { const s = noiseSrc(oc, 3.1), f = oc.createBiquadFilter(); f.type = 'highpass'; f.frequency.setValueAtTime(200, 0); f.frequency.exponentialRampToValueAtTime(6000, 3); const g = oc.createGain(); g.gain.setValueAtTime(.0001, 0); g.gain.exponentialRampToValueAtTime(.9, 2.95); g.gain.linearRampToValueAtTime(0, 3); s.connect(f); f.connect(g); g.connect(oc.destination); s.start(0); const o = oc.createOscillator(); o.type = 'sawtooth'; o.frequency.setValueAtTime(100, 0); o.frequency.exponentialRampToValueAtTime(1200, 3); const g2 = oc.createGain(); g2.gain.setValueAtTime(.0001, 0); g2.gain.exponentialRampToValueAtTime(.25, 2.9); g2.gain.linearRampToValueAtTime(0, 3); o.connect(g2); g2.connect(oc.destination); o.start(0); } },
    { id: 'zap', n: 'Laser zap', i: '⚡', k: 'sfx', d: .5, f: oc => tone(oc, oc.destination, 'sawtooth', 2200, 0, .35, .5, .002, 120) },
    { id: 'coin', n: 'Coin', i: '🪙', k: 'sfx', d: .6, f: oc => { tone(oc, oc.destination, 'square', 988, 0, .09, .35, .002); tone(oc, oc.destination, 'square', 1319, .08, .45, .35, .002); } },
    { id: 'glitchs', n: 'Glitch', i: '📺', k: 'sfx', d: .7, f: oc => { for (let i = 0; i < 14; i++) tone(oc, oc.destination, i % 2 ? 'square' : 'sawtooth', 200 + Math.random() * 2400, i * .04, .035, .35, .001); } },
    { id: 'swoosh2', n: 'Swish', i: '🌬', k: 'sfx', d: .6, f: oc => { const s = noiseSrc(oc, .7), f = oc.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = .9; f.frequency.setValueAtTime(1200, 0); f.frequency.exponentialRampToValueAtTime(6000, .3); const g = oc.createGain(); g.gain.setValueAtTime(.0001, 0); g.gain.linearRampToValueAtTime(.9, .18); g.gain.linearRampToValueAtTime(.0001, .55); s.connect(f); f.connect(g); g.connect(oc.destination); s.start(0); } },
    { id: 'lofi', n: 'Chill lo-fi loop', i: '☕', k: 'music', d: 24.6, f: oc => {
      const bpm = 78, B = 60 / bpm, ch = [[57, 60, 64, 67], [53, 57, 60, 64], [48, 52, 55, 59], [55, 59, 62, 65]], lp = oc.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1400; const bus = oc.createGain(); bus.gain.value = .5; lp.connect(bus); bus.connect(oc.destination);
      for (let bar = 0; bar < 8; bar++) { const c = ch[bar % 4], t0 = bar * 4 * B; c.forEach((n, i) => { tone(oc, lp, 'triangle', nf(n), t0 + i * .02, 3.6 * B, .16, .02); tone(oc, lp, 'sine', nf(n + 12), t0 + i * .02, 3 * B, .06, .02); }); tone(oc, bus, 'sine', nf(c[0] - 12), t0, 1.8 * B, .4, .01); tone(oc, bus, 'sine', nf(c[0] - 12), t0 + 2 * B, 1.8 * B, .34, .01);
        for (let b = 0; b < 4; b++) { if (b % 2 === 0) drum(oc, bus, 'k', t0 + b * B, .55); else drum(oc, bus, 's', t0 + b * B, .22); drum(oc, bus, 'h', t0 + b * B + B / 2, .12); } } } },
    { id: 'upbeat', n: 'Upbeat pop beat', i: '🎉', k: 'music', d: 16, f: oc => {
      const bpm = 120, B = 60 / bpm, roots = [48, 55, 57, 53], bus = oc.createGain(); bus.gain.value = .55; bus.connect(oc.destination);
      for (let bar = 0; bar < 8; bar++) { const t0 = bar * 4 * B, r = roots[bar % 4]; for (let b = 0; b < 4; b++) { drum(oc, bus, 'k', t0 + b * B, .8); if (b % 2) drum(oc, bus, 's', t0 + b * B, .35); drum(oc, bus, 'h', t0 + b * B + B / 2, .22); drum(oc, bus, 'h', t0 + b * B, .1); }
        for (let i = 0; i < 8; i++) { tone(oc, bus, 'sawtooth', nf(r - 12 + (i % 4 === 3 ? 7 : 0)), t0 + i * B / 2, B / 2 * .9, .2, .005); tone(oc, bus, 'triangle', nf(r + 12 + [0, 4, 7, 12][i % 4]), t0 + i * B / 2, B / 2, .15, .004); } } } },
    { id: 'cinema', n: 'Cinematic drone', i: '🎬', k: 'music', d: 24, f: oc => {
      const bus = oc.createGain(); bus.gain.setValueAtTime(.0001, 0); bus.gain.linearRampToValueAtTime(.6, 10); bus.gain.linearRampToValueAtTime(.45, 20); bus.gain.linearRampToValueAtTime(.0001, 24); const lp = oc.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(300, 0); lp.frequency.exponentialRampToValueAtTime(2400, 12); lp.connect(bus); bus.connect(oc.destination);
      [45, 52, 57, 64].forEach((n, i) => { [-7, 0, 7].forEach(dt => { const o = oc.createOscillator(); o.type = 'sawtooth'; o.frequency.value = nf(n); o.detune.value = dt; const g = oc.createGain(); g.gain.value = .07; o.connect(g); g.connect(lp); o.start(0); o.stop(24); }); });
      tone(oc, bus, 'sine', nf(33), 0, 24, .5, 1); tone(oc, oc.destination, 'sine', 90, 12, 3, .5, .02, 28); } },
    { id: 'chip', n: '8-bit game loop', i: '🎮', k: 'music', d: 13.7, f: oc => {
      const bpm = 140, B = 60 / bpm, mel = [72, 76, 79, 76, 72, 79, 76, 74, 71, 74, 79, 74, 71, 76, 74, 72], bus = oc.createGain(); bus.gain.value = .35; bus.connect(oc.destination);
      for (let bar = 0; bar < 8; bar++) for (let i = 0; i < 8; i++) { const t0 = bar * 4 * B + i * B / 2; tone(oc, bus, 'square', nf(mel[(bar * 8 + i) % 16] - (bar % 2 ? 2 : 0)), t0, B / 2 * .85, .3, .003); if (i % 2 === 0) tone(oc, bus, 'triangle', nf(48 - (bar % 2 ? 2 : 0) + (i % 4 ? 7 : 0)), t0, B * .9, .5, .003); if (i % 4 === 0) drum(oc, bus, 'k', t0, .6); if (i % 4 === 2) drum(oc, bus, 'h', t0, .3); } } }
  ];
  VS.makeSound = async function (id) {
    const def = SOUNDS.find(s => s.id === id); if (!def) return null; VS.getAC();
    if (def._m && MEDIA[def._m]) return MEDIA[def._m];
    const b = await synth(def.d, def.f), m = { id: nid('m'), name: def.n, kind: 'audio', url: '', dur: b.duration, w: 0, h: 0, buf: b, peaks: peaksOf(b, Math.min(3000, Math.ceil(b.duration * 40))), gen: true };
    MEDIA[m.id] = m; def._m = m.id; hk('onMedia'); return m;
  };

  /* beat detection → markers */
  VS.detectBeats = function (id) {
    const c = clipById(id), m = c && MEDIA[c.media]; if (!m || !m.buf) return 0;
    const ch = m.buf.getChannelData(0), sr = m.buf.sampleRate, win = 1024, n = Math.floor(ch.length / win), e = new Float32Array(n);
    for (let i = 0; i < n; i++) { let s = 0; for (let j = 0; j < win; j += 2) { const v = ch[i * win + j]; s += v * v; } e[i] = s; }
    const flux = new Float32Array(n); for (let i = 1; i < n; i++) flux[i] = Math.max(0, e[i] - e[i - 1]);
    const out = []; let last = -1;
    for (let i = 4; i < n - 4; i++) { let mean = 0; for (let j = -4; j <= 4; j++) mean += flux[i + j]; mean /= 9; const tt = i * win / sr; if (flux[i] > mean * 2.2 + 1e-5 && flux[i] >= flux[i - 1] && flux[i] >= flux[i + 1] && tt - last > .28) { out.push(tt); last = tt; } }
    let added = 0; out.forEach(tt => { const x = c.start + (tt - c.in) / c.speed; if (x >= c.start && x <= c.start + c.dur && !S.markers.some(mm => Math.abs(mm - x) < .1)) { S.markers.push(+x.toFixed(3)); added++; } });
    S.markers.sort((a, b) => a - b); VS.commit(true); return added;
  };

  /* captions */
  VS.captionStyle = function () { return VS.newText('', { size: 74, bold: true, w: 86, stroke: { on: true, c: '#000000', w: 10 }, shadow: { on: false } }); };
  VS.makeCaptions = function (lines, t0, t1, style) {
    lines = lines.map(s => s.trim()).filter(Boolean); if (!lines.length) return 0; const wsum = lines.reduce((a, l) => a + Math.max(6, l.length), 0), span = Math.max(.5, t1 - t0); let t = t0, lane = null;
    const dur = lines.map(l => span * Math.max(6, l.length) / wsum); lane = VS.addLane('v').id;
    lines.forEach((l, i) => { const T = JSON.parse(JSON.stringify(style || VS.captionStyle())); T.txt = l; const c = VS.newClip('text', { text: T, start: t, dur: Math.max(.3, dur[i] - .04), lane, name: l.slice(0, 20) }); c.tf.y = 30; S.clips.push(c); t += dur[i]; });
    VS.commit(); return lines.length;
  };
  VS.parseSRT = function (txt) {
    const out = [], blocks = txt.replace(/\r/g, '').split(/\n\n+/); const tm = s => { const m = s.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/); return m ? (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) + (+m[4]) / 1000 : null; };
    blocks.forEach(b => { const ls = b.split('\n').filter(Boolean), i = ls.findIndex(l => /-->/.test(l)); if (i < 0) return; const [a, z] = ls[i].split('-->'), s = tm(a), e = tm(z); if (s == null || e == null) return; out.push({ s, e, txt: ls.slice(i + 1).join('\n') }); });
    return out;
  };
  VS.importSRT = function (txt, style) {
    const items = VS.parseSRT(txt); if (!items.length) return 0; const lane = VS.addLane('v').id;
    items.forEach(it => { const T = JSON.parse(JSON.stringify(style || VS.captionStyle())); T.txt = it.txt; const c = VS.newClip('text', { text: T, start: it.s, dur: Math.max(.2, it.e - it.s), lane, name: it.txt.slice(0, 20) }); c.tf.y = 30; S.clips.push(c); }); VS.commit(); return items.length;
  };

  /* ------------------------------------------------------------------ hit-testing (for on-canvas editing) */
  VS.selectable = function (c) { return c.kind === 'video' || c.kind === 'image' || c.kind === 'text' || c.kind === 'sticker'; };
  VS.boxOf = function (c, t) {
    const [DW, DH] = dims(), b = BB[c.id]; if (!b) return null; const st = baseState(c, t);
    return { cx: DW / 2 + st.dx * DW, cy: DH / 2 + st.dy * DH, w: b.w * st.s, h: b.h * st.s, rot: st.rot };
  };
  VS.hitTest = function (px, py, t) {
    for (let li = 0; li < S.lanes.length; li++) { const L = S.lanes[li]; if (L.kind !== 'v' || L.hidden) continue;
      const list = laneClips(L.id).filter(c => t >= c.start && t < c.start + c.dur && VS.selectable(c)).reverse();
      for (const c of list) { const b = VS.boxOf(c, t); if (!b) continue; const a = -b.rot * Math.PI / 180, dx = px - b.cx, dy = py - b.cy, lx = dx * Math.cos(a) - dy * Math.sin(a), ly = dx * Math.sin(a) + dy * Math.cos(a); if (Math.abs(lx) <= b.w / 2 && Math.abs(ly) <= b.h / 2) return c; } }
    return null;
  };

  /* ------------------------------------------------------------------ export */
  const EXP = VS.EXP = { running: false, cancel: false };
  VS.exportVideo = async function (opt, onProg) {
    if (typeof MediaRecorder === 'undefined') throw new Error('Your browser cannot export video. Please use Chrome, Edge or Firefox.');
    const T = total(); if (T <= 0) throw new Error('Timeline is empty – add a clip first.');
    VS.pause(); const ac = VS.getAC(); await ac.resume(); EXP.running = true; EXP.cancel = false;
    const [DW, DH] = dims(), sc = (opt.res || 1080) / Math.min(DW, DH), cw = Math.round(DW * sc / 2) * 2, ch = Math.round(DH * sc / 2) * 2, fps = opt.fps || 30;
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch; const stream = cv.captureStream(fps), dest = ac.createMediaStreamDestination(); master.connect(dest); dest.stream.getAudioTracks().forEach(t => stream.addTrack(t));
    const types = ['video/mp4;codecs=avc1.640028,mp4a.40.2', 'video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm;codecs=vp8,opus', 'video/webm']; let mime = ''; for (const ty of types) if (MediaRecorder.isTypeSupported(ty)) { mime = ty; break; }
    let rec; try { rec = new MediaRecorder(stream, mime ? { mimeType: mime, videoBitsPerSecond: opt.bitrate || 8e6, audioBitsPerSecond: 192000 } : undefined); } catch (e) { EXP.running = false; master.disconnect(dest); throw new Error('Could not start the recorder in this browser'); }
    const chunks = []; rec.ondataavailable = e => { if (e.data && e.data.size) chunks.push(e.data); }; const done = new Promise(r => rec.onstop = r);
    const rt = mkRT(); let wl = null; try { wl = await navigator.wakeLock.request('screen'); } catch (e) { }
    S.playing = true; S.t = 0; renderTo(cv, rt, 0); await new Promise(r => setTimeout(r, 450)); renderTo(cv, rt, 0);
    const a0 = ac.currentTime + .25; P.a0 = a0; P.t0 = 0; schedAudio(0, a0); let started = false;
    await new Promise(res => {
      (function frame() {
        const t = ac.currentTime - a0;
        if (EXP.cancel || t >= T + .05) return res();
        if (t >= 0 && !started) { rec.start(250); started = true; }
        const tt = clamp(t, 0, T); S.t = tt; renderTo(cv, rt, tt); VS.renderPreview(); if (onProg) onProg(tt / T); hk('onTick');
        requestAnimationFrame(frame);
      })();
    });
    stopAudio(); S.playing = false; ELS.forEach(e => { try { e.pause(); } catch (x) { } });
    if (started && rec.state !== 'inactive') rec.stop();
    if (started) await done;
    try { master.disconnect(dest); } catch (e) { } try { wl && wl.release(); } catch (e) { } EXP.running = false; S.t = 0; VS.rq(); hk('onTick');
    if (EXP.cancel || !chunks.length) return null;
    const type = (rec.mimeType || mime || 'video/webm').split(';')[0]; return { blob: new Blob(chunks, { type }), ext: /mp4/.test(type) ? 'mp4' : 'webm' };
  };
  VS.cancelExport = () => { EXP.cancel = true; };
  VS.snapshotPNG = function (t, res) { const [DW, DH] = dims(), sc = (res || 1080) / Math.min(DW, DH), cv = document.createElement('canvas'); cv.width = Math.round(DW * sc); cv.height = Math.round(DH * sc); renderTo(cv, mkRT(), t); return new Promise(r => cv.toBlob(r, 'image/png')); };
})();
