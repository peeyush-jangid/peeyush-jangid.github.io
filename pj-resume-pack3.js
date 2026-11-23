/* =====================================================================
   PJ Resume Template Pack 3 – 200 more designs (on top of the 52 earlier ones).
   Eight layout families (Sidebar / Header / Centered / Editorial / Cards / Arch / Overlap / Diagonal) combined with
   14 heading styles, 7 skill styles, 4 job styles, 11 header treatments, 8 decorations,
   light / cream / grey / tinted / dark page tones and 14 font pairings.
   Load BEFORE pj-tools-upgrade.js (after pj-resume-pack2.js). html2canvas-safe CSS only.
   ===================================================================== */
window.PJ_RS_PACK3 = function (H) {
  const { X, list, blocks, bl, ct, photo, parts, wrap, head, tint, shade, hexRgb } = H;
  const R = {}, TH = {}, LIST = [], REC = {}, FONT = {}, HFONT = {};
  const lighten = (h, k) => 'rgb(' + hexRgb(h).map(x => Math.round(x + (255 - x) * k)).join(',') + ')';
  const F = {
    inter: "Inter,'Segoe UI',Arial,sans-serif", play: "'Playfair Display',Georgia,serif", mont: "Montserrat,'Segoe UI',Arial,sans-serif", lora: "Lora,Georgia,serif",
    ral: "Raleway,'Segoe UI',Arial,sans-serif", nun: "Nunito,'Segoe UI',Arial,sans-serif", osw: "Oswald,'Arial Narrow',Arial,sans-serif", grot: "'Space Grotesk',Inter,Arial,sans-serif",
    merri: "Merriweather,Georgia,serif", corm: "'Cormorant Garamond',Georgia,serif", dmserif: "'DM Serif Display',Georgia,serif", mono: "'JetBrains Mono',ui-monospace,Consolas,monospace", pop: "Poppins,'Segoe UI',Arial,sans-serif"
  };
  const FP = [['inter', 'inter'], ['inter', 'play'], ['mont', 'mont'], ['lora', 'play'], ['ral', 'ral'], ['nun', 'nun'], ['inter', 'osw'], ['grot', 'grot'], ['merri', 'merri'], ['inter', 'corm'], ['mont', 'dmserif'], ['lora', 'lora'], ['pop', 'pop'], ['inter', 'mono']];
  const PAL = [['#2563eb', 'Cobalt'], ['#0ea5e9', 'Sky'], ['#0891b2', 'Lagoon'], ['#0d9488', 'Teal'], ['#059669', 'Emerald'], ['#16a34a', 'Fern'], ['#65a30d', 'Lime'], ['#ca8a04', 'Amber'], ['#ea580c', 'Tangerine'], ['#dc2626', 'Crimson'], ['#e11d48', 'Rose'], ['#db2777', 'Fuchsia'],
    ['#9333ea', 'Violet'], ['#7c3aed', 'Indigo'], ['#4f46e5', 'Iris'], ['#1e3a8a', 'Navy'], ['#0f766e', 'Pine'], ['#b45309', 'Copper'], ['#92400e', 'Cocoa'], ['#475569', 'Slate'], ['#334155', 'Graphite'], ['#be123c', 'Ruby'], ['#a21caf', 'Orchid'], ['#0369a1', 'Ocean'],
    ['#15803d', 'Moss'], ['#c2410c', 'Rust'], ['#7e22ce', 'Plum'], ['#1d4ed8', 'Royal'], ['#0e7490', 'Peacock'], ['#b91c1c', 'Brick'], ['#f43f5e', 'Coral'], ['#f59e0b', 'Gold'], ['#14b8a6', 'Aqua'], ['#8b5cf6', 'Lilac'], ['#ec4899', 'Blush'], ['#84cc16', 'Citrus']];
  const NOUN = ['Studio', 'Atelier', 'Metro', 'Prime', 'Nova', 'Edge', 'Pulse', 'Vertex', 'Haven', 'Summit', 'Horizon', 'Canvas', 'Folio', 'Zenith', 'Ember', 'Lumen', 'Orbit', 'Mosaic', 'Pinnacle', 'Cascade', 'Origin', 'Prism', 'Quill', 'Sterling', 'Vista', 'Apex', 'Bloom', 'Crest', 'Drift', 'Echo', 'Flux', 'Glow', 'Harbor', 'Iris', 'Kite', 'Lotus', 'Mist', 'Nimbus', 'Oasis', 'Pearl', 'Quest', 'Ridge', 'Spark', 'Tide', 'Unity', 'Vivid', 'Willow', 'Axis', 'Beacon', 'Cobalt', 'Dune', 'Elite', 'Fable', 'Grove', 'Halo', 'Ivory', 'Jewel', 'Karma', 'Linen', 'Maple'];
  const DARKP = { dark: '#0f172a', ink: '#0c0c0f', navy: '#0b1b3a', forest: '#0b2a21', wine: '#2a0f1c' };
  const PGC = { w: '#ffffff', cream: '#fbf6ec', grey: '#eef1f5', tint: null };
  const SBDARK = { ink: 1, dark: 1, grad: 1, accent: 1, night: 1 };
  const HDDARK = { accent: 1, dark: 1, grad: 1, curve: 1, diag: 1, wave: 1, split: 1, card: 1 };
  const HS = ['u', 'pill', 'bar', 'box', 'flank', 'num', 'dot', 'caps', 'short', 'dbl', 'slash', 'brk', 'side', 'band'];
  const SKS = ['chips', 'bars', 'dots', 'rings', 'list', 'outline', 'slim'];
  const JS = ['p', 't', 'd', 'c'];

  /* ---------- content helpers ---------- */
  const levels = v => list(v.skills).map(s => { const m = s.match(/^(.*?)\s*[:|]\s*(\d{1,3})\s*%?$/); return m ? { n: m[1].trim(), p: Math.min(100, +m[2]) } : { n: s, p: null }; });
  const ring = (p, col, track) => { const L = 2 * Math.PI * 18; return '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="' + track + '" stroke-width="4"/><circle cx="22" cy="22" r="18" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (L * p / 100).toFixed(1) + ' ' + L.toFixed(1) + '" transform="rotate(-90 22 22)"/></svg>'; };
  const skHtml = (v, kind, dark) => {
    const a = levels(v); if (!a.length) return '';
    const col = dark ? lighten(v.color, .4) : v.color, trk = dark ? 'rgba(255,255,255,.22)' : tint(v.color, .18);
    if (kind === 'chips') return '<div class="qs-w">' + a.map(s => '<span class="qs-c">' + X(s.n) + '</span>').join('') + '</div>';
    if (kind === 'outline') return '<div class="qs-w">' + a.map(s => '<span class="qs-o">' + X(s.n) + '</span>').join('') + '</div>';
    if (kind === 'list') return a.map(s => '<div class="qs-l">' + X(s.n) + '</div>').join('');
    if (kind === 'bars' || kind === 'slim') return a.map(s => s.p == null ? '<div class="qs-n">' + X(s.n) + '</div>' : '<div class="qs-b ' + (kind === 'slim' ? 'qs-slim' : '') + '"><div class="qs-bt"><span>' + X(s.n) + '</span>' + (kind === 'slim' ? '' : '<i>' + s.p + '%</i>') + '</div><div class="qs-tr"><b style="width:' + s.p + '%"></b></div></div>').join('');
    if (kind === 'dots') return a.map(s => { if (s.p == null) return '<div class="qs-n">' + X(s.n) + '</div>'; const n = Math.round(s.p / 20); let d = ''; for (let i = 0; i < 5; i++) d += '<u' + (i < n ? ' class="on"' : '') + '></u>'; return '<div class="qs-d"><span>' + X(s.n) + '</span><s>' + d + '</s></div>'; }).join('');
    if (kind === 'rings') return '<div class="qs-rg">' + a.map(s => s.p == null ? '<div class="qs-rn">' + X(s.n) + '</div>' : '<div class="qs-ri"><div class="qs-rc">' + ring(s.p, col, trk) + '<b>' + s.p + '</b></div><span>' + X(s.n) + '</span></div>').join('') + '</div>';
    return '';
  };
  const jobsTL = s => blocks(s).map(b => {
    const L = b.split('\n').map(x => x.trim()).filter(Boolean); if (!L.length) return '';
    const m = L[0].match(/^(.*?)\s*[\(\[]\s*([^\)\]]+?)\s*[\)\]]\s*$/), hd = m ? m[1] : L[0], d = m ? m[2] : '';
    return '<div class="qj-tl rs-job"><div class="qj-d">' + X(d) + '</div><div class="qj-c"><b>' + X(hd) + '</b>' + bl(L.slice(1)) + '</div></div>';
  }).join('');
  const initials = n => (String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'R';

  /* ---------- procedural thumbnails ---------- */
  const ln = (x, y, w, n, col) => { let o = ''; for (let i = 0; i < n; i++) o += '<rect x="' + x + '" y="' + (y + i * 4.4) + '" width="' + (i % 2 ? w * .78 : w) + '" height="1.7" fill="' + (col || '#cbd5e1') + '"/>'; return o; };
  const pgFill = (cfg, c) => DARKP[cfg.pg] || (cfg.pg === 'tint' ? tint(c, .13) : PGC[cfg.pg || 'w']);
  const thumb = (cfg, c) => {
    const dk = !!DARKP[cfg.pg], lc = dk ? 'rgba(255,255,255,.35)' : '#cbd5e1', nm = dk ? '#fff' : '#0f172a';
    const hd = (x, y, w) => {
      const h = cfg.h || 'u';
      if (h === 'pill') return '<rect x="' + x + '" y="' + y + '" width="13" height="3.4" rx="1.7" fill="' + c + '"/>';
      if (h === 'bar' || h === 'band') return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="3.6" fill="' + c + '" opacity="' + (h === 'band' ? .35 : 1) + '"/>';
      if (h === 'box' || h === 'side') return '<rect x="' + x + '" y="' + y + '" width="1.6" height="3.6" fill="' + c + '"/><rect x="' + (x + 3) + '" y="' + (y + .6) + '" width="11" height="2.4" fill="' + c + '"/>';
      if (h === 'flank' || h === 'dbl') return '<rect x="' + (x + w * .34) + '" y="' + y + '" width="' + w * .32 + '" height="2.4" fill="' + c + '"/><rect x="' + x + '" y="' + (y + 1) + '" width="' + w * .3 + '" height=".7" fill="' + c + '"/><rect x="' + (x + w * .7) + '" y="' + (y + 1) + '" width="' + w * .3 + '" height=".7" fill="' + c + '"/>';
      if (h === 'dot') return '<circle cx="' + (x + 1.6) + '" cy="' + (y + 1.4) + '" r="1.6" fill="' + c + '"/><rect x="' + (x + 5) + '" y="' + y + '" width="10" height="2.4" fill="' + c + '"/>';
      if (h === 'num') return '<rect x="' + x + '" y="' + y + '" width="3.4" height="2.4" fill="' + c + '"/><rect x="' + (x + 5) + '" y="' + y + '" width="10" height="2.4" fill="' + nm + '" opacity=".7"/><rect x="' + x + '" y="' + (y + 3.6) + '" width="' + w + '" height=".6" fill="' + lc + '"/>';
      if (h === 'caps' || h === 'slash' || h === 'brk') return '<rect x="' + x + '" y="' + y + '" width="14" height="2.2" fill="' + nm + '" opacity=".75"/>';
      return '<rect x="' + x + '" y="' + y + '" width="12" height="2.4" fill="' + c + '"/><rect x="' + x + '" y="' + (y + 3.6) + '" width="' + w + '" height=".8" fill="' + (h === 'short' ? 'none' : c) + '"/>';
    };
    const sks = (x, y, w, dark) => {
      const k = cfg.sk || 'chips', fc = dark ? '#fff' : c, tc = dark ? 'rgba(255,255,255,.3)' : lc; let o = '';
      if (k === 'bars' || k === 'slim') for (let i = 0; i < 3; i++) o += '<rect x="' + x + '" y="' + (y + i * 5) + '" width="' + w * .55 + '" height="1.4" fill="' + fc + '" opacity=".8"/><rect x="' + x + '" y="' + (y + i * 5 + 2.2) + '" width="' + w + '" height="1.4" fill="' + tc + '"/><rect x="' + x + '" y="' + (y + i * 5 + 2.2) + '" width="' + w * (.9 - i * .2) + '" height="1.4" fill="' + fc + '"/>';
      else if (k === 'dots') for (let i = 0; i < 3; i++) { o += '<rect x="' + x + '" y="' + (y + i * 5) + '" width="' + w * .5 + '" height="1.6" fill="' + fc + '" opacity=".8"/>'; for (let d = 0; d < 5; d++) o += '<circle cx="' + (x + w * .62 + d * 2.6) + '" cy="' + (y + i * 5 + .8) + '" r="1" fill="' + (d < 4 - i ? fc : tc) + '"/>'; }
      else if (k === 'rings') for (let i = 0; i < 3; i++) o += '<circle cx="' + (x + 3 + i * 7) + '" cy="' + (y + 3) + '" r="2.6" fill="none" stroke="' + tc + '" stroke-width="1"/><circle cx="' + (x + 3 + i * 7) + '" cy="' + (y + 3) + '" r="2.6" fill="none" stroke="' + fc + '" stroke-width="1" stroke-dasharray="' + (10 - i * 3) + ' 17" transform="rotate(-90 ' + (x + 3 + i * 7) + ' ' + (y + 3) + ')"/>';
      else if (k === 'list') for (let i = 0; i < 3; i++) o += '<rect x="' + x + '" y="' + (y + i * 4) + '" width="1.4" height="1.4" fill="' + fc + '"/><rect x="' + (x + 3) + '" y="' + (y + i * 4) + '" width="' + w * .7 + '" height="1.4" fill="' + tc + '"/>';
      else for (let i = 0; i < 3; i++) o += '<rect x="' + (x + (i % 2) * 4) + '" y="' + (y + Math.floor(i / 1) * 4.4) + '" width="' + (w * .5) + '" height="3" rx="' + (k === 'outline' ? 1 : 1.5) + '" fill="' + (k === 'outline' ? 'none' : (dark ? 'rgba(255,255,255,.25)' : tint(c, .2))) + '" ' + (k === 'outline' ? 'stroke="' + fc + '" stroke-width=".6"' : '') + '/>';
      return o;
    };
    const pic = (x, y, r) => cfg.pshape === 'arch' || cfg.L === 'ar' ? '<path d="M' + (x - r) + ' ' + (y + r) + 'V' + y + 'A' + r + ' ' + r + ' 0 0 1 ' + (x + r) + ' ' + y + 'V' + (y + r) + 'Z" fill="' + (dk ? '#475569' : '#cbd5e1') + '"/>' : '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + (dk ? '#475569' : '#cbd5e1') + '"/>';
    const body = (x, w, y0, n) => { let o = ''; for (let i = 0; i < n; i++) { const y = y0 + i * 17; o += hd(x, y, w) + ln(x, y + 7, w, 3, lc); } return o; };
    let o = '<rect width="60" height="80" fill="' + pgFill(cfg, c) + '"/>';
    if (cfg.L === 'sb') {
      const w = Math.round((cfg.sw || 262) * 0.0756), x = cfg.pos === 'r' ? 60 - w : 0, mx = cfg.pos === 'r' ? 5 : w + 5, mw = 60 - w - 10, sd = !!SBDARK[cfg.bg];
      const bgc = { ink: '#1f2937', dark: shade(c, .42), grad: c, accent: c, night: shade(c, .35), tint: tint(c, .16), cream: '#f6f0e6', white: 'none', stripe: 'none' }[cfg.bg];
      o += '<rect x="' + x + '" width="' + w + '" height="80" fill="' + bgc + '"/>' + (cfg.bg === 'stripe' ? '<rect x="' + (cfg.pos === 'r' ? 60 - 2 : 0) + '" width="2" height="80" fill="' + c + '"/>' : '') + (cfg.bg === 'white' ? '<rect x="' + (cfg.pos === 'r' ? x : w - .4) + '" width=".5" height="80" fill="' + lc + '"/>' : '');
      const sc = sd ? '#fff' : (dk ? '#fff' : c);
      if (cfg.ph === 'full') o += '<rect x="' + x + '" width="' + w + '" height="' + w + '" fill="' + (sd ? 'rgba(255,255,255,.4)' : '#cbd5e1') + '"/>'; else o += pic(x + w / 2, 12, 6).replace(/#cbd5e1|#475569/, sd ? 'rgba(255,255,255,.85)' : (dk ? '#475569' : '#cbd5e1'));
      let y = cfg.ph === 'full' ? w + 5 : 24;
      if (cfg.nm === 'sb') { o += '<rect x="' + (x + 3) + '" y="' + y + '" width="' + (w - 6) + '" height="3" fill="' + (sd || dk ? '#fff' : '#0f172a') + '"/><rect x="' + (x + 3) + '" y="' + (y + 5) + '" width="' + (w - 10) + '" height="1.6" fill="' + (sd ? 'rgba(255,255,255,.7)' : c) + '"/>'; y += 11; }
      for (let i = 0; i < 2; i++) o += '<rect x="' + (x + 3) + '" y="' + (y + i * 3.4) + '" width="' + (w - 6) + '" height="1.3" fill="' + (sd || dk ? 'rgba(255,255,255,.6)' : '#94a3b8') + '"/>';
      o += '<rect x="' + (x + 3) + '" y="' + (y + 9) + '" width="9" height="1.8" fill="' + sc + '"/>' + sks(x + 3, y + 14, w - 6, sd || dk);
      let my = 8;
      if (cfg.nm !== 'sb') { o += '<rect x="' + mx + '" y="8" width="26" height="4.4" fill="' + nm + '"/><rect x="' + mx + '" y="15" width="16" height="2" fill="' + c + '"/>'; my = 24; }
      o += body(mx, mw, my + (cfg.nm === 'sb' ? 4 : 0), cfg.nm === 'sb' ? 4 : 3);
    } else if (cfg.L === 'hb') {
      const hdc = { accent: c, dark: '#111827', grad: shade(c, .6), curve: c, diag: c, wave: c, split: c, card: c, light: tint(c, .16), line: 'none', outline: 'none' }[cfg.hd], w = !!HDDARK[cfg.hd], tx = w ? '#fff' : nm;
      if (cfg.hd === 'curve') o += '<path d="M0 0H60V24Q60 30 54 30H6Q0 30 0 24Z" fill="' + hdc + '"/>';
      else if (cfg.hd === 'diag') o += '<polygon points="0,0 60,0 60,22 0,32" fill="' + hdc + '"/>';
      else if (cfg.hd === 'wave') o += '<path d="M0 0H60V24Q45 32 30 25T0 27Z" fill="' + hdc + '"/>';
      else if (cfg.hd === 'card') o += '<rect x="4" y="4" width="52" height="24" rx="4" fill="' + hdc + '"/>';
      else if (cfg.hd === 'split') o += '<rect width="40" height="28" fill="' + hdc + '"/><rect x="40" width="20" height="28" fill="' + tint(c, .16) + '"/>';
      else if (cfg.hd === 'line') o += '<rect y="27" width="60" height="1.6" fill="' + c + '"/>';
      else if (cfg.hd === 'outline') o += '<rect x="4" y="4" width="52" height="22" fill="none" stroke="' + c + '" stroke-width="1"/>';
      else o += '<rect width="60" height="27" fill="' + hdc + '"/>' + (cfg.hd === 'dark' ? '<rect y="26" width="60" height="1.4" fill="' + c + '"/>' : '');
      const nx = cfg.ph === 'l' ? 22 : 7;
      o += '<rect x="' + nx + '" y="9" width="24" height="4.2" fill="' + tx + '"/><rect x="' + nx + '" y="16" width="15" height="1.8" fill="' + tx + '" opacity=".75"/>' + (cfg.ph === 'l' ? pic(12, 15, 5.4) : pic(49, 15, 5.4));
      if (cfg.cols) { const ax = cfg.as === 'l' ? 4 : 39, mx = cfg.as === 'l' ? 25 : 5; o += '<rect x="' + ax + '" y="34" width="17" height="42" rx="2" fill="' + (dk ? 'rgba(255,255,255,.08)' : tint(c, .13)) + '"/>' + sks(ax + 2, 40, 13, dk) + body(mx, 30, 35, 3); }
      else o += body(6, 48, 35, 2) + hd(6, 69, 48) + sks(6, 75, 30, dk).replace(/y="7[5-9]/g, 'y="76');
    } else if (cfg.L === 'ct') {
      const d = cfg.dc;
      o += (d === 'frame' ? '<rect x="3" y="3" width="54" height="74" fill="none" stroke="' + c + '" stroke-width=".7"/>' : '') + (d === 'stripe' ? '<rect width="60" height="3.4" fill="' + c + '"/>' : '') + (d === 'blob' ? '<circle cx="56" cy="2" r="16" fill="' + tint(c, .18) + '"/>' : '') + (d === 'corner' ? '<polygon points="60,0 60,17 43,0" fill="' + c + '"/>' : '') + (d === 'dbl' ? '<rect y="3" width="60" height="1" fill="' + c + '"/><rect y="5.6" width="60" height=".5" fill="' + c + '"/>' : '') + (d === 'sides' ? '<rect width="3" height="80" fill="' + c + '"/><rect x="57" width="3" height="80" fill="' + c + '"/>' : '') + (d === 'ribbon' ? '<rect width="60" height="24" fill="' + c + '"/>' : '');
      const rb = d === 'ribbon';
      o += (cfg.pshape === 'arch' ? pic(30, 15, 5.4) : (d === 'mono' && cfg.mono ? '<circle cx="30" cy="12" r="6" fill="' + c + '"/><rect x="27" y="10.6" width="6" height="2.6" fill="#fff"/>' : '<circle cx="30" cy="' + (rb ? 9 : 12) + '" r="5.4" fill="' + (rb ? '#fff' : (dk ? '#475569' : tint(c, .3))) + '"/>')) + '<rect x="16" y="' + (rb ? 16 : 21) + '" width="28" height="3.4" fill="' + (rb ? '#fff' : nm) + '"/><rect x="22" y="' + (rb ? 21 : 27) + '" width="16" height="1.8" fill="' + (rb ? '#fff' : c) + '" opacity="' + (rb ? .8 : 1) + '"/><rect x="10" y="34" width="40" height="1.2" fill="' + lc + '"/>' + body(8, 44, 38, 3).replace(/y="(\d+)"/g, (m, a) => m);
    } else if (cfg.L === 'ed') {
      const ac = cfg.acc;
      o += (ac === 'bar' ? '<rect width="60" height="4" fill="' + c + '"/>' : '') + (ac === 'side' ? '<rect width="3" height="80" fill="' + c + '"/>' : '') + (ac === 'block' ? '<rect x="6" y="6" width="14" height="2.6" fill="' + c + '"/>' : '') + (ac === 'corner' ? '<rect width="16" height="16" fill="' + c + '"/>' : '');
      o += '<rect x="' + (ac === 'corner' ? 20 : 6) + '" y="12" width="30" height="6" fill="' + nm + '"/><rect x="' + (ac === 'corner' ? 20 : 6) + '" y="21" width="18" height="2" fill="' + c + '"/><rect x="6" y="29" width="48" height=".8" fill="' + nm + '" opacity=".5"/>' + (cfg.ph === 'n' ? '' : pic(48, 14, 5));
      for (let i = 0; i < 4; i++) { const y = 33 + i * 11.5; o += '<rect x="6" y="' + y + '" width="11" height="2" fill="' + c + '"/>' + ln(22, y, 32, 2, lc); }
    } else if (cfg.L === 'cd') {
      o += '<rect x="4" y="4" width="52" height="20" rx="4" fill="' + c + '"/><rect x="10" y="9" width="22" height="3.6" fill="#fff"/><rect x="10" y="15" width="14" height="1.8" fill="#fff" opacity=".75"/>' + pic(46, 14, 5);
      const cf = dk ? 'rgba(255,255,255,.1)' : '#fff';
      o += '<rect x="4" y="28" width="33" height="22" rx="3" fill="' + cf + '"/>' + hd(7, 31, 26) + ln(7, 38, 26, 2, lc) + '<rect x="4" y="53" width="33" height="23" rx="3" fill="' + cf + '"/>' + hd(7, 56, 26) + ln(7, 63, 26, 2, lc) + '<rect x="40" y="28" width="16" height="22" rx="3" fill="' + cf + '"/>' + sks(42, 33, 12, dk) + '<rect x="40" y="53" width="16" height="23" rx="3" fill="' + cf + '"/>' + ln(42, 58, 12, 3, lc);
    } else if (cfg.L === 'ov') {
      const bc = { accent: c, grad: c, dark: '#111827', curve: c, duo: c, wave: c }[cfg.bd], cx = cfg.pp === 'c' ? 30 : 13;
      o += (cfg.bd === 'curve' ? '<path d="M0 0H60V20Q60 26 54 26H6Q0 26 0 20Z" fill="' + bc + '"/>' : '<rect width="60" height="24" fill="' + bc + '"/>') + (cfg.bd === 'duo' ? '<rect y="19" width="60" height="5" fill="' + shade(c, .55) + '"/>' : '') + (cfg.bd === 'wave' ? '<path d="M0 20Q15 28 30 21T60 22V26H0Z" fill="' + pgFill(cfg, c) + '"/>' : '') + (cfg.bd === 'dark' ? '<rect y="23" width="60" height="1.4" fill="' + c + '"/>' : '');
      o += '<circle cx="' + cx + '" cy="25" r="8" fill="' + pgFill(cfg, c) + '"/>' + pic(cx, 25, 6.4);
      if (cfg.pp === 'c') o += '<rect x="17" y="35" width="26" height="3.6" fill="' + nm + '"/><rect x="22" y="40.5" width="16" height="1.8" fill="' + c + '"/>';
      else o += '<rect x="25" y="29" width="26" height="3.6" fill="' + nm + '"/><rect x="25" y="34.5" width="16" height="1.8" fill="' + c + '"/>';
      if (cfg.cols) { const ax = cfg.as === 'l' ? 4 : 39, mx = cfg.as === 'l' ? 25 : 5; o += '<rect x="' + ax + '" y="46" width="17" height="30" rx="2" fill="' + (dk ? 'rgba(255,255,255,.08)' : tint(c, .13)) + '"/>' + sks(ax + 2, 50, 13, dk) + body(mx, 30, 46, 2); }
      else o += body(6, 48, 46, 2);
    } else if (cfg.L === 'dg') {
      const w = Math.round((cfg.sw || 262) * 0.0756), r = cfg.pos === 'r', sd = cfg.dgc !== 'tint', fl = !!cfg.fl, sl = 3;
      const fill = { solid: c, grad: c, dark: shade(c, .42), night: shade(c, .35), tint: tint(c, .16) }[cfg.dgc || 'solid'];
      const pts = r ? (fl ? (60 - w - sl) + ',0 60,0 60,80 ' + (60 - w) + ',80' : (60 - w) + ',0 60,0 60,80 ' + (60 - w - sl) + ',80') : (fl ? '0,0 ' + w + ',0 ' + (w + sl) + ',80 0,80' : '0,0 ' + (w + sl) + ',0 ' + w + ',80 0,80');
      const x = r ? 60 - w : 0, mx = r ? 5 : w + 7, tc = sd ? '#fff' : c;
      o += '<polygon points="' + pts + '" fill="' + fill + '"/>' + pic(x + w / 2 - (r ? 0 : 0), 13, 6).replace(/#cbd5e1|#475569/, sd ? 'rgba(255,255,255,.85)' : (dk ? '#475569' : '#cbd5e1'));
      for (let i = 0; i < 2; i++) o += '<rect x="' + (x + 3) + '" y="' + (24 + i * 3.4) + '" width="' + (w - 6) + '" height="1.3" fill="' + (sd ? 'rgba(255,255,255,.65)' : '#94a3b8') + '"/>';
      o += '<rect x="' + (x + 3) + '" y="34" width="9" height="1.8" fill="' + tc + '"/>' + sks(x + 3, 39, w - 6, sd);
      o += '<rect x="' + mx + '" y="8" width="26" height="4.4" fill="' + nm + '"/><rect x="' + mx + '" y="15" width="16" height="2" fill="' + c + '"/>' + body(mx, 60 - w - 12, 24, 3);
    } else {
      o += '<rect x="3" y="4" width="20" height="72" rx="6" fill="' + (dk ? 'rgba(255,255,255,.08)' : tint(c, .15)) + '"/><path d="M5 30V19A8 8 0 0 1 21 19V30Z" fill="' + c + '" opacity=".85"/><path d="M7.4 29V20A5.6 5.6 0 0 1 18.6 20V29Z" fill="' + (dk ? '#475569' : '#cbd5e1') + '"/>' + sks(6, 36, 14, dk) + ln(6, 56, 14, 3, lc);
      o += '<rect x="28" y="10" width="26" height="4.4" fill="' + nm + '"/><rect x="28" y="17" width="16" height="2" fill="' + c + '"/>' + body(28, 27, 28, 3);
    }
    return o;
  };

  /* ---------- generator ---------- */
  const add = (id, name, color, cfg, tags) => {
    cfg.id = id; const fp = FP[cfg.fp % FP.length], font = F[fp[0]], hfont = F[fp[1]];
    const dk = !!DARKP[cfg.pg];
    const mods = ['q', 'q-' + id, 'q-L-' + cfg.L, 'q-pg-' + (cfg.pg || 'w'), 'q-h-' + (cfg.h || 'u'), 'q-j-' + (cfg.j || 'p'), 'q-s-' + (cfg.sk || 'chips')];
    if (dk) mods.push('q-dk'); if (cfg.pshape) mods.push('q-p-' + cfg.pshape);
    if (cfg.L === 'sb') { mods.push('q-w' + cfg.sw, cfg.pos === 'r' ? 'q-r' : 'q-l'); if (cfg.card) mods.push('q-card'); }
    if (cfg.L === 'hb') mods.push('q-hd-' + cfg.hd, cfg.cols ? (cfg.as === 'l' ? 'q-asl' : 'q-asr') : 'q-c1');
    if (cfg.L === 'ct') mods.push('q-dc-' + cfg.dc);
    if (cfg.L === 'ed') mods.push('q-ac-' + cfg.acc, 'q-rw' + (cfg.rw || 120));
    if (cfg.L === 'ov') mods.push('q-bd-' + cfg.bd, 'q-pp-' + cfg.pp, cfg.cols ? (cfg.as === 'l' ? 'q-asl' : 'q-asr') : 'q-c1');
    if (cfg.L === 'dg') { mods.push('q-w' + cfg.sw, cfg.pos === 'r' ? 'q-r' : 'q-l', 'q-dg-' + cfg.dgc); }
    const cls = mods.join(' ');
    FONT[cls] = font; HFONT[cls] = hfont; REC[id] = color; LIST.push([id, name, 'free', tags]);
    TH[id] = c => thumb(cfg, c);
    R[id] = v => {
      const P = parts(v), p = photo(v, cfg.ps || 124); let n = 0;
      const rows = cfg.L === 'ed';
      const S = (t, h) => !h ? '' : rows ? '<section class="rs-row"><h3>' + t + '</h3><div>' + h + '</div></section>' : '<section class="rs-s"><h3><em>' + ('0' + (++n)).slice(-2) + '</em>' + t + '</h3>' + h + '</section>';
      const side = (t, h) => h ? '<h4>' + t + '</h4>' + h : '';
      const card = (t, h) => h ? '<section class="rs-s qd-card"><h3>' + t + '</h3>' + h + '</section>' : '';
      const exp = cfg.j === 'd' ? jobsTL(v.exp) : P.exp, edu = cfg.j === 'd' ? jobsTL(v.edu) : P.edu, extra = cfg.j === 'd' ? jobsTL(v.extra) : P.extra;
      const sbD = cfg.L === 'sb' && !!SBDARK[cfg.bg];
      const sk = (d) => skHtml(v, cfg.sk || 'chips', d);
      const cts = '<div class="rs-ct col">' + ct(v) + '</div>';
      const hi = '<div class="rs-hi">' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>';
      let inner;
      if (cfg.L === 'sb') {
        const full = cfg.ph === 'full' && photo(v, cfg.sw);
        const ph = full ? '<div class="qp-full">' + photo(v, cfg.sw) + '</div>' : (p ? '<div class="qp-c">' + photo(v, cfg.ps || 128) + '</div>' : '');
        const aside = '<aside class="rs-sb qa qb-' + cfg.bg + (sbD ? ' qa-d' : '') + '">' + ph + (cfg.nm === 'sb' ? '<div class="qa-name">' + head(v) + '</div>' : '') + side('Contact', cts) + side('Skills', sk(sbD || dk)) + side('Languages', P.langList) + side('Personal', P.kv) + '</aside>';
        const main = '<div class="rs-mn">' + (cfg.nm === 'sb' ? '' : head(v) + '<div class="qm-rule"></div>') + S('Profile', P.summary) + S('Experience', exp) + S('Education', edu) + S('Projects / Certifications', extra) + S('Declaration', P.decl) + '</div>';
        inner = cfg.pos === 'r' ? main + aside : aside + main;
      } else if (cfg.L === 'hb') {
        const hdd = !!HDDARK[cfg.hd] && cfg.hd !== 'card', cardd = cfg.hd === 'card';
        let bg = '';
        if (cfg.hd === 'diag' || cfg.hd === 'wave') {
          const c2 = v.gmode === 'grad' && v.color2 ? v.color2 : shade(v.color, .55), gid = 'qgd' + cfg.id;
          bg = '<svg class="qh-bg" viewBox="0 0 794 260" preserveAspectRatio="none"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + v.color + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient></defs>' +
            (cfg.hd === 'diag' ? '<polygon points="0,260 794,170 794,196 0,260" fill="' + lighten(v.color, .6) + '"/><polygon points="0,0 794,0 794,176 0,244" fill="url(#' + gid + ')"/>' : '<path d="M0 0H794V190C640 250 520 150 380 200C240 250 120 215 0 232Z" fill="' + lighten(v.color, .6) + '" opacity=".55"/><path d="M0 0H794V170C640 232 520 132 380 182C240 232 120 197 0 214Z" fill="url(#' + gid + ')"/>') + '</svg>';
        }
        const hdr = '<div class="rs-hd qh qh-' + cfg.hd + (hdd ? ' qh-d' : '') + (cardd ? ' qh-d' : '') + '">' + bg + (cfg.ph === 'l' ? '<div class="qh-p">' + p + '</div>' : '') + hi + (cfg.ph === 'r' ? '<div class="qh-p">' + p + '</div>' : '') + '</div>';
        if (cfg.cols) {
          const mn = '<div class="rs-mn">' + S('Profile', P.summary) + S('Experience', exp) + S('Projects / Certifications', extra) + S('Declaration', P.decl) + '</div>';
          const sd = '<aside class="rs-sd">' + S('Education', edu) + S('Skills', sk(dk)) + S('Languages', P.lang) + S('Personal', P.kv) + '</aside>';
          inner = hdr + '<div class="rs-cols">' + (cfg.as === 'l' ? sd + mn : mn + sd) + '</div>';
        } else inner = hdr + '<div class="rs-body">' + S('Profile', P.summary) + S('Experience', exp) + S('Education', edu) + S('Skills', sk(dk)) + S('Projects / Certifications', extra) + S('Languages', P.lang) + S('Personal Details', P.kv) + S('Declaration', P.decl) + '</div>';
      } else if (cfg.L === 'ct') {
        const top = cfg.dc === 'mono' && cfg.mono && !p ? '<div class="qc-mono">' + X(initials(v.name)) + '</div>' : (p ? '<div class="qc-pw">' + p + '</div>' : (cfg.dc === 'mono' ? '<div class="qc-mono">' + X(initials(v.name)) + '</div>' : ''));
        inner = '<div class="rs-hd qc-hd' + (cfg.dc === 'ribbon' ? ' qh-d' : '') + '">' + top + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>' +
          S('Profile', P.summary) + S('Experience', exp) + S('Education', edu) + S('Skills', sk(dk)) + S('Projects / Certifications', extra) + S('Languages', P.lang) + S('Personal Details', P.kv) + S('Declaration', P.decl);
      } else if (cfg.L === 'ed') {
        const ph = cfg.ph === 'n' ? '' : '<div class="qe-p">' + p + '</div>';
        inner = '<div class="qe-top">' + (cfg.ph === 'l' ? ph : '') + hi + (cfg.ph === 'l' ? '' : ph) + '</div>' + S('Profile', P.summary) + S('Experience', exp) + S('Education', edu) + S('Skills', sk(dk)) + S('Projects / Certifications', extra) + S('Languages', P.lang) + S('Personal Details', P.kv) + S('Declaration', P.decl);
      } else if (cfg.L === 'cd') {
        inner = '<div class="rs-hd qd-hd qh-d">' + hi + (p ? '<div class="qh-p">' + p + '</div>' : '') + '</div><div class="qd-g"><div class="qd-m">' + card('Profile', P.summary) + card('Experience', exp) + card('Projects / Certifications', extra) + card('Declaration', P.decl) + '</div><div class="qd-s">' + card('Education', edu) + card('Skills', sk(dk)) + card('Languages', P.lang) + card('Personal', P.kv) + '</div></div>';
      } else if (cfg.L === 'ov') {
        const pgl = DARKP[cfg.pg] || { w: '#ffffff', cream: '#fbf6ec', grey: '#eef1f5', tint: '#f3f6fb' }[cfg.pg || 'w'];
        const wv = cfg.bd === 'wave' ? '<svg class="qo-wv" viewBox="0 0 794 60" preserveAspectRatio="none"><path d="M0 24C130 64 260 -2 400 30S660 62 794 16V60H0Z" fill="' + pgl + '"/></svg>' : '';
        const pic2 = p ? '<div class="qo-ph">' + p + '</div>' : '';
        const hdr = '<div class="qo-band qo-b-' + cfg.bd + '">' + wv + '</div><div class="qo-hd qo-hd-' + cfg.pp + (p ? '' : ' qo-np') + '">' + pic2 + hi + '</div>';
        if (cfg.cols) {
          const mn = '<div class="rs-mn">' + S('Profile', P.summary) + S('Experience', exp) + S('Projects / Certifications', extra) + S('Declaration', P.decl) + '</div>';
          const sd = '<aside class="rs-sd">' + S('Education', edu) + S('Skills', sk(dk)) + S('Languages', P.lang) + S('Personal', P.kv) + '</aside>';
          inner = hdr + '<div class="rs-cols">' + (cfg.as === 'l' ? sd + mn : mn + sd) + '</div>';
        } else inner = hdr + '<div class="rs-body">' + S('Profile', P.summary) + S('Experience', exp) + S('Education', edu) + S('Skills', sk(dk)) + S('Projects / Certifications', extra) + S('Languages', P.lang) + S('Personal Details', P.kv) + S('Declaration', P.decl) + '</div>';
      } else if (cfg.L === 'dg') {
        const sdk = cfg.dgc !== 'tint', rgt = cfg.pos === 'r', gid = 'qdx' + cfg.id, c2 = v.gmode === 'grad' && v.color2 ? v.color2 : shade(v.color, .45);
        const fillv = { solid: v.color, grad: 'url(#' + gid + ')', dark: shade(v.color, .42), night: 'url(#' + gid + ')', tint: tint(v.color, .16) }[cfg.dgc || 'solid'];
        const stops = cfg.dgc === 'night' ? '<stop offset="0" stop-color="' + shade(v.color, .38) + '"/><stop offset="1" stop-color="#0b1020"/>' : '<stop offset="0" stop-color="' + v.color + '"/><stop offset="1" stop-color="' + c2 + '"/>';
        const poly = rgt ? (cfg.fl ? '30,0 300,0 300,1000 0,1000' : '0,0 300,0 300,1000 30,1000') : (cfg.fl ? '0,0 270,0 300,1000 0,1000' : '0,0 300,0 270,1000 0,1000');
        const bg = '<svg class="qx-bg" viewBox="0 0 300 1000" preserveAspectRatio="none"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="1" y2="1">' + stops + '</linearGradient></defs><polygon points="' + poly + '" fill="' + fillv + '"/></svg>';
        const ph = p ? '<div class="qp-c">' + photo(v, cfg.ps || 128) + '</div>' : '';
        const aside = '<aside class="rs-sb qa qb-dg' + (sdk ? ' qa-d' : '') + '">' + bg + ph + (cfg.nm === 'sb' ? '<div class="qa-name">' + head(v) + '</div>' : '') + side('Contact', cts) + side('Skills', sk(sdk || dk)) + side('Languages', P.langList) + side('Personal', P.kv) + '</aside>';
        const main = '<div class="rs-mn">' + (cfg.nm === 'sb' ? '' : head(v) + '<div class="qm-rule"></div>') + S('Profile', P.summary) + S('Experience', exp) + S('Education', edu) + S('Projects / Certifications', extra) + S('Declaration', P.decl) + '</div>';
        inner = rgt ? main + aside : aside + main;
      } else {
        const ph = p ? '<div class="qr-ph">' + photo(v, cfg.ps || 150) + '</div>' : '';
        inner = '<aside class="rs-sb qr-l">' + ph + side('Contact', cts) + side('Skills', sk(dk)) + side('Languages', P.langList) + side('Personal', P.kv) + '</aside><div class="rs-mn">' + head(v) + '<div class="qm-rule"></div>' + S('Profile', P.summary) + S('Experience', exp) + S('Education', edu) + S('Projects / Certifications', extra) + S('Declaration', P.decl) + '</div>';
      }
      return wrap(v, cls, inner);
    };
  };

  /* ---------- the 153 configs ---------- */
  const pick = (a, i) => a[((i % a.length) + a.length) % a.length];
  const used = new Set();
  const nameFor = (i, color, tag) => {
    const cn = PAL.find(x => x[0] === color)[1]; let k = (i * 7) % NOUN.length, nm = cn + ' ' + NOUN[k];
    while (used.has(nm)) { k = (k + 1) % NOUN.length; nm = cn + ' ' + NOUN[k]; } used.add(nm); return nm;
  };
  let N = 0;
  const reg = (cfg, ci, tags) => { N++; const col = PAL[ci % PAL.length][0]; add('q' + N, nameFor(N, col), col, cfg, tags); };
  const DKS = ['dark', 'ink', 'navy', 'forest', 'wine'];

  /* Sidebar family – 34 */
  const SBBG = ['ink', 'dark', 'grad', 'accent', 'night', 'tint', 'cream', 'white', 'stripe'], SW = [250, 270, 230, 290, 246];
  for (let i = 0; i < 34; i++) {
    let pg = i % 11 === 7 ? 'dark' : (i % 6 === 5 ? 'cream' : (i % 9 === 4 ? 'grey' : 'w')); if (i % 11 === 7) pg = pick(DKS, i);
    let bg = pick(SBBG, i); if (DARKP[pg] && !SBDARK[bg]) bg = 'night';
    reg({ L: 'sb', bg, pos: (i % 5 === 2 || i % 5 === 4) ? 'r' : 'l', sw: pick(SW, i * 2), sk: pick(SKS, i * 2 + 1), h: pick(HS, i * 5), j: pick(JS, i * 3), nm: i % 3 === 0 ? 'sb' : 'mn', ph: i % 4 === 1 ? 'full' : 'c', pshape: i % 7 === 3 ? 'arch' : null, pg, fp: i * 3, card: (bg === 'tint' || bg === 'cream') && i % 2 ? 1 : 0, ps: i % 3 === 0 ? 112 : 128 }, i * 7 + 1, ['Sidebar'].concat(DARKP[pg] ? ['Dark'] : [], ['bars', 'rings', 'dots', 'slim'].includes(pick(SKS, i * 2 + 1)) ? ['Skill bars / rings'] : []));
  }
  /* Header family – 50 */
  const HD = ['accent', 'dark', 'grad', 'light', 'line', 'curve', 'diag', 'wave', 'card', 'split', 'outline'];
  for (let i = 0; i < 50; i++) {
    let pg = i % 9 === 8 ? pick(DKS, i) : (i % 7 === 4 ? 'cream' : (i % 10 === 6 ? 'grey' : 'w')), hd = pick(HD, i * 3 + 1);
    if (DARKP[pg] && (hd === 'light' || hd === 'line' || hd === 'outline')) hd = 'grad';
    const cols = (i * 3) % 7 < 3 ? 1 : 0, sk = pick(SKS, i * 3 + 2);
    reg({ L: 'hb', hd, ph: i % 3 === 1 ? 'l' : 'r', cols, as: i % 4 < 2 ? 'r' : 'l', sk, h: pick(HS, i * 3 + 4), j: pick(JS, i * 5 + 1), pg, fp: i * 5 + 1, pshape: i % 8 === 5 ? 'arch' : null, ps: 116 }, i * 11 + 3, ['Header'].concat(DARKP[pg] ? ['Dark'] : [], ['bars', 'rings', 'dots', 'slim'].includes(sk) ? ['Skill bars / rings'] : []));
  }
  /* Centered family – 24 */
  const DC = ['frame', 'stripe', 'blob', 'corner', 'dbl', 'sides', 'ribbon', 'mono'];
  for (let i = 0; i < 24; i++) {
    let pg = i % 8 === 7 ? pick(DKS, i) : (i % 5 === 3 ? 'cream' : (i % 9 === 4 ? 'tint' : 'w')), sk = pick(SKS, i * 2 + 3);
    reg({ L: 'ct', dc: pick(DC, i), mono: i % 2, h: pick(HS, i * 7 + 2), j: pick(JS, i * 3 + 2), sk, pg, fp: i * 3 + 2, pshape: i % 6 === 4 ? 'arch' : null, ps: 108 }, i * 13 + 5, ['Centered'].concat(DARKP[pg] ? ['Dark'] : [], ['bars', 'rings', 'dots', 'slim'].includes(sk) ? ['Skill bars / rings'] : []));
  }
  /* Editorial family – 18 */
  const ACC = ['bar', 'side', 'block', 'corner', 'none'];
  for (let i = 0; i < 18; i++) {
    const pg = i % 6 === 5 ? pick(DKS, i) : (i % 3 === 1 ? 'cream' : (i % 7 === 2 ? 'grey' : 'w')), sk = pick(SKS, i + 4);
    reg({ L: 'ed', acc: pick(ACC, i), ph: i % 3 === 0 ? 'n' : (i % 3 === 1 ? 'r' : 'l'), rw: pick([110, 130, 150], i), sk, j: pick(JS, i + 1), pg, fp: i * 7 + 3, pshape: i % 5 === 2 ? 'arch' : null, ps: 100 }, i * 17 + 9, ['Editorial'].concat(DARKP[pg] ? ['Dark'] : [], ['bars', 'rings', 'dots', 'slim'].includes(sk) ? ['Skill bars / rings'] : []));
  }
  /* Cards family – 14 */
  for (let i = 0; i < 14; i++) {
    const pg = i % 5 === 4 ? pick(DKS, i) : pick(['grey', 'tint', 'cream', 'grey'], i), sk = pick(SKS, i * 2 + 1);
    reg({ L: 'cd', h: pick(HS, i * 3), sk, j: pick(JS, i), pg, fp: i * 5 + 4, ps: 96 }, i * 5 + 2, ['Cards'].concat(DARKP[pg] ? ['Dark'] : [], ['bars', 'rings', 'dots', 'slim'].includes(sk) ? ['Skill bars / rings'] : []));
  }
  /* Arch family – 13 */
  for (let i = 0; i < 13; i++) {
    const pg = i % 6 === 5 ? pick(DKS, i) : pick(['cream', 'w', 'tint', 'w', 'grey'], i), sk = pick(SKS, i * 3 + 1);
    reg({ L: 'ar', h: pick(HS, i * 5 + 3), sk, j: pick(JS, i * 3 + 1), pg, fp: i * 3 + 5, pshape: 'arch', ps: 150 }, i * 9 + 4, ['Arch'].concat(DARKP[pg] ? ['Dark'] : [], ['bars', 'rings', 'dots', 'slim'].includes(sk) ? ['Skill bars / rings'] : []));
  }

  /* Overlap-photo family – 26 */
  const OB = ['accent', 'grad', 'dark', 'curve', 'duo', 'wave'];
  for (let i = 0; i < 26; i++) {
    let pg = i % 8 === 6 ? pick(DKS, i) : (i % 5 === 3 ? 'cream' : (i % 7 === 4 ? 'grey' : 'w')), bd = pick(OB, i * 5 + 2);
    reg({ L: 'ov', bd, pp: i % 3 === 1 ? 'c' : 'l', cols: (i * 3) % 5 < 2 ? 1 : 0, as: i % 4 < 2 ? 'r' : 'l', h: pick(HS, i * 3 + 5), sk: pick(SKS, i * 3 + 4), j: pick(JS, i * 5 + 2), pg, fp: i * 5 + 6, pshape: i % 9 === 5 ? 'arch' : null, ps: 128 }, i * 7 + 1, ['Overlap'].concat(DARKP[pg] ? ['Dark'] : [], ['bars', 'rings', 'dots', 'slim'].includes(pick(SKS, i * 3 + 4)) ? ['Skill bars / rings'] : []));
  }
  /* Diagonal-sidebar family – 21 */
  const DGC = ['solid', 'grad', 'dark', 'night', 'tint'];
  for (let i = 0; i < 21; i++) {
    let pg = i % 7 === 5 ? pick(DKS, i) : (i % 5 === 2 ? 'cream' : 'w'), dgc = pick(DGC, i * 2 + 1);
    if (DARKP[pg] && dgc === 'tint') dgc = 'night';
    reg({ L: 'dg', dgc, pos: i % 4 === 3 ? 'r' : 'l', fl: i % 2, sw: pick([250, 270, 290], i), nm: i % 3 === 0 ? 'sb' : 'mn', h: pick(HS, i * 7 + 1), sk: pick(SKS, i * 2 + 5), j: pick(JS, i * 3 + 3), pg, fp: i * 3 + 7, pshape: i % 8 === 3 ? 'arch' : null, ps: 120 }, i * 5 + 8, ['Diagonal'].concat(DARKP[pg] ? ['Dark'] : [], ['bars', 'rings', 'dots', 'slim'].includes(pick(SKS, i * 2 + 5)) ? ['Skill bars / rings'] : []));
  }

  /* ---------- CSS ---------- */
  let css = `
.rs{-webkit-print-color-adjust:exact;print-color-adjust:exact}
.t-q{--pg:#fff;--tx:#1e293b;--mu:#64748b;--hh:#0f172a;--ln:#e2e8f0;--cd:#fff;--cb:var(--rt);--cf:var(--rd);--ac:var(--rc);--ds:rgba(100,116,139,.09);background:var(--pg);color:var(--tx)}
.t-q.q-pg-cream{--pg:#fbf6ec;--ln:#e8dcc4;--ds:rgba(146,112,40,.1)}.t-q.q-pg-grey{--pg:#eef1f5;--ln:#d9dee7}.t-q.q-pg-tint{--pg:#f3f6fb}
.t-q.q-dk{--tx:#d7deea;--mu:#9aa8be;--hh:#fff;--ln:rgba(255,255,255,.16);--cd:rgba(255,255,255,.07);--cb:rgba(255,255,255,.13);--cf:#fff;--ac:var(--rl);--ds:rgba(255,255,255,.07)}
.q-pg-dark{--pg:#0f172a}.q-pg-ink{--pg:#0c0c0f}.q-pg-navy{--pg:#0b1b3a}.q-pg-forest{--pg:#0b2a21}.q-pg-wine{--pg:#2a0f1c}
.qa-d,.qh-d{--tx:#fff;--mu:rgba(255,255,255,.78);--hh:#fff;--ln:rgba(255,255,255,.26);--cb:rgba(255,255,255,.17);--cf:#fff;--ac:var(--rl);color:#fff}
.t-q h1{color:var(--hh);font-family:var(--rh);font-weight:800;letter-spacing:-.3px}
.t-q .rs-sub{color:var(--ac);font-weight:600;letter-spacing:1.4px;text-transform:uppercase;font-size:12.5px}.qh-d .rs-sub,.qa-d .rs-sub{color:#fff;opacity:.9}
.t-q .rs-ct{color:var(--mu)}.t-q .rs-d{color:var(--mu)}.t-q .rs-jh b{color:var(--hh)}.t-q .rs-kv span{color:var(--mu)}.t-q .rs-kv b{color:var(--tx)}
.t-q .rs-chip{background:var(--cb);color:var(--cf)}
.t-q .rs-img{border:4px solid #fff;box-shadow:0 0 0 2px var(--rc)}.q-dk .rs-img{border-color:rgba(255,255,255,.85)}
.q-p-arch .rs-img{border-radius:999px 999px 0 0!important}
.t-q .rs-s h3{font-family:var(--rh);color:var(--hh)}.t-q .rs-s h3 em{display:none;font-style:normal}
/* heading styles */
.q-h-u .rs-s h3{border-bottom:2px solid var(--rc);padding-bottom:4px}
.q-h-pill .rs-s h3,.q-h-pill .qd-card h3{display:table;background:var(--rc);color:#fff;padding:3px 15px;border-radius:99px;font-size:11.5px;letter-spacing:1.6px;margin-bottom:10px}
.q-h-bar .rs-s h3{background:var(--rc);color:#fff;padding:5px 14px;letter-spacing:2px;margin-bottom:10px}
.q-h-box .rs-s h3{border-left:6px solid var(--rc);background:var(--ds);padding:4px 0 4px 11px}
.q-h-flank .rs-s h3{display:flex;align-items:center;gap:12px;justify-content:center}.q-h-flank .rs-s h3::before,.q-h-flank .rs-s h3::after{content:"";flex:1;border-top:1px solid var(--rc)}
.q-h-num .rs-s h3{display:flex;gap:10px;align-items:baseline;border-bottom:1px solid var(--ln);padding-bottom:5px}.q-h-num .rs-s h3 em{display:inline;color:var(--ac)}
.q-h-dot .rs-s h3{display:flex;align-items:center;gap:9px}.q-h-dot .rs-s h3::before{content:"";width:11px;height:11px;border-radius:50%;background:var(--rc)}
.q-h-caps .rs-s h3{letter-spacing:3.4px;font-size:12px}
.q-h-short .rs-s h3{position:relative;padding-bottom:9px}.q-h-short .rs-s h3::after{content:"";position:absolute;left:0;bottom:0;width:36px;height:4px;border-radius:2px;background:var(--rc)}
.q-h-dbl .rs-s h3{border-top:1px solid var(--rc);border-bottom:1px solid var(--rc);padding:4px 0;text-align:center;letter-spacing:3px}
.q-h-slash .rs-s h3::before{content:"// ";color:var(--ac)}
.q-h-brk .rs-s h3::before{content:"[ ";color:var(--ac)}.q-h-brk .rs-s h3::after{content:" ]";color:var(--ac)}
.q-h-side .rs-s h3{border-left:5px solid var(--rc);padding-left:10px;line-height:1.15}
.q-h-band .rs-s h3{background:var(--ds);border-top:2px solid var(--rc);padding:5px 10px}
/* sidebar headings */
.t-q .qa h4,.t-q .qr-l h4{font-family:var(--rh);font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:22px 0 11px;font-weight:700;padding-bottom:5px;color:var(--hh);border-bottom:1px solid var(--ln)}
.t-q .qa h4:first-child,.t-q .qr-l h4:first-child{margin-top:0}
/* skills */
.qs-w{display:flex;flex-wrap:wrap;gap:5px}
.qs-c{background:var(--cb);color:var(--cf);border-radius:99px;padding:2px 11px;font-size:12px;font-weight:500}
.qs-o{border:1.5px solid var(--ac);color:var(--tx);border-radius:6px;padding:1px 9px;font-size:12px}
.qs-n{font-size:12.5px;margin:0 0 5px;padding-left:12px;position:relative}.qs-n::before{content:"";position:absolute;left:0;top:7px;width:5px;height:5px;border-radius:50%;background:var(--ac)}
.qs-l{font-size:12.5px;margin:0 0 5px;padding-left:17px;position:relative}.qs-l::before{content:"✓";position:absolute;left:0;color:var(--ac);font-weight:700}
.qs-b{margin:0 0 9px}.qs-bt{display:flex;justify-content:space-between;font-size:12px;margin-bottom:3px}.qs-bt i{font-style:normal;color:var(--mu);font-size:11px}
.qs-tr{height:6px;border-radius:99px;background:var(--ln);overflow:hidden}.qs-tr b{display:block;height:100%;border-radius:99px;background:var(--rc)}.qs-slim .qs-tr{height:3px}.qs-slim{margin-bottom:8px}
.qa-d .qs-tr b,.q-dk .qs-tr b{background:var(--rl)}
.qs-d{display:flex;justify-content:space-between;align-items:center;font-size:12.5px;margin-bottom:6px;gap:8px}.qs-d s{text-decoration:none;display:flex;gap:3px;flex:none}.qs-d s u{width:8px;height:8px;border-radius:50%;background:var(--ln);display:block}.qs-d s u.on{background:var(--rc)}.qa-d .qs-d s u.on,.q-dk .qs-d s u.on{background:var(--rl)}
.qs-rg{display:grid;grid-template-columns:1fr 1fr;gap:12px 8px}.qs-ri{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;font-size:11px;line-height:1.25}.qs-rc{position:relative;width:58px;height:58px}.qs-rc svg{width:58px;height:58px;display:block}.qs-rc b{position:absolute;left:0;top:0;width:58px;height:58px;display:flex;align-items:center;justify-content:center;font-size:12.5px;font-weight:700}.qs-rn{grid-column:1/-1;font-size:12.5px}
.rs-sd .qs-rg{grid-template-columns:1fr 1fr 1fr}
/* jobs */
.q-j-t .rs-job{border-left:2px solid var(--ln);padding-left:15px;position:relative}.q-j-t .rs-job::before{content:"";position:absolute;left:-6px;top:5px;width:10px;height:10px;border-radius:50%;background:var(--rc);border:2px solid var(--pg)}
.q-j-c .rs-job{background:var(--ds);border-left:4px solid var(--rc);padding:8px 12px;border-radius:0 10px 10px 0}
.q-j-d .qj-tl{display:grid;grid-template-columns:104px 1fr;margin:0}.q-j-d .qj-d{text-align:right;padding:2px 18px 0 0;font-size:11.5px;font-weight:600;color:var(--ac)}.q-j-d .qj-c{position:relative;border-left:2px solid var(--ln);padding:0 0 13px 20px}.q-j-d .qj-c::before{content:"";position:absolute;left:-7px;top:3px;width:12px;height:12px;border-radius:50%;background:var(--pg);border:3px solid var(--rc)}.q-j-d .qj-c b{color:var(--hh)}
.q-j-d .rs-sd .qj-tl,.q-j-d .qd-s .qj-tl,.q-j-d .qr-l .qj-tl{grid-template-columns:1fr}.q-j-d .rs-sd .qj-d{text-align:left;padding:0 0 0 20px;order:2}
/* header / body base */
.qh-p{flex:none}.q-L-hb .rs-hd{display:flex;align-items:center;gap:24px;padding:38px 44px;position:relative}.q-L-hb .rs-hi{flex:1;position:relative}.q-L-hb .qh-p{position:relative}.q-L-hb h1{font-size:36px;line-height:1.1}
.qh-accent{background:var(--rc)}.qh-dark{background:#111827;border-bottom:5px solid var(--rc)}.qh-grad{background:linear-gradient(120deg,var(--rx),var(--rc))}
.qh-curve{background:linear-gradient(120deg,var(--rx),var(--rc));border-radius:0 0 46px 46px;padding-bottom:48px!important}
.qh-light{background:var(--ds)}.qh-line{border-bottom:4px solid var(--rc)}
.qh-diag,.qh-wave{min-height:250px;padding-bottom:70px!important}.qh-bg{position:absolute;left:0;top:0;width:100%;height:100%}
.qh-card{margin:26px 30px 6px;border-radius:22px;background:var(--rc);box-shadow:0 6px 18px rgba(15,23,42,.18);padding:30px 34px!important}
.qh-split{padding:0!important;gap:0!important;align-items:stretch!important}.qh-split .rs-hi{background:var(--rc);padding:38px 34px;flex:1.6}.qh-split .qh-p{flex:1;background:var(--ds);display:flex;align-items:center;justify-content:center;padding:20px}
.qh-outline{margin:30px 40px 4px;border:2px solid var(--rc);padding:26px 30px!important}
.q-L-hb .rs-body{padding:8px 44px 40px}.q-L-hb .rs-cols{display:grid;grid-template-columns:1fr 244px;gap:30px;padding:2px 40px 40px 44px}.q-L-hb.q-asl .rs-cols{grid-template-columns:244px 1fr;padding:2px 44px 40px 40px}
.q-L-hb .rs-sd{background:var(--ds);border-radius:16px;padding:6px 18px 20px;align-self:start;margin-top:17px}.q-L-hb .rs-sd .rs-jh{flex-direction:column;gap:0}.q-L-hb .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}.q-L-hb .rs-sd .rs-chip,.q-L-hb .rs-sd .qs-c{background:var(--cd)}
.q-hd-split .rs-hd .rs-img{box-shadow:0 0 0 2px var(--rc)}
/* sidebar */
.q-L-sb{display:grid}`;
  [230, 246, 250, 270, 290].forEach(w => { css += `.q-L-sb.q-w${w}{grid-template-columns:${w}px 1fr}.q-L-sb.q-w${w}.q-r{grid-template-columns:1fr ${w}px}`; });
  css += `
.q-L-sb .rs-sb{padding:36px 22px}.q-L-sb .rs-mn{padding:42px 38px 40px}.q-L-sb h1{font-size:34px;line-height:1.1}.qa-name{margin:6px 0 4px}.qa-name h1{font-size:27px}.qa-name .rs-sub{font-size:11.5px;margin-top:6px}
.qm-rule{width:46px;height:4px;border-radius:2px;background:var(--rc);margin:12px 0 4px}
.qp-c{display:flex;justify-content:center;margin-bottom:22px}.qp-full{margin:-36px -22px 22px}.qp-full .rs-img{border:0!important;box-shadow:none!important;border-radius:0!important;width:100%!important;height:auto!important;aspect-ratio:1/1}
.q-L-sb .rs-ct{font-size:12px}.q-L-sb .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}.q-L-sb .rs-kv span{min-width:0}
.qb-ink{background:#1f2937}.qb-dark{background:var(--rx)}.qb-grad{background:linear-gradient(170deg,var(--rc),var(--rx))}.qb-accent{background:var(--rc)}.qb-night{background:linear-gradient(180deg,var(--rx),#0b1020)}
.qb-tint{background:var(--rt);--ds:rgba(255,255,255,.55)}.qb-cream{background:#f6f0e6;--ln:#e0d5bb}.qb-white{border-right:1px solid var(--ln)}.q-r .qb-white{border-right:0;border-left:1px solid var(--ln)}
.qb-stripe{border-left:10px solid var(--rc)}.q-r .qb-stripe{border-left:0;border-right:10px solid var(--rc)}
.q-card .rs-sb{margin:26px 0 26px 20px;border-radius:22px;align-self:start}.q-card.q-r .rs-sb{margin:26px 20px 26px 0}
.q-dk .qb-tint,.q-dk .qb-cream,.q-dk .qb-white{--tx:#d7deea}
.q-dk .qb-tint,.q-dk .qb-cream{background:rgba(255,255,255,.08)}
.qa-d .rs-img{border-color:rgba(255,255,255,.85);box-shadow:none}.qa-d .rs-ct,.qa-d .rs-kv b{color:#fff}.qa-d .qs-o{color:#fff}
/* centred */
.q-L-ct{padding:46px 54px}.q-L-ct .rs-hd{text-align:center;padding-bottom:10px}.q-L-ct .rs-ct{justify-content:center}.q-L-ct h1{font-size:36px}.q-L-ct .rs-s{margin-top:19px}
.qc-pw{display:flex;justify-content:center;margin-bottom:12px}.qc-mono{width:78px;height:78px;border-radius:50%;background:var(--rc);color:#fff;font-family:var(--rh);font-size:28px;font-weight:700;display:flex;align-items:center;justify-content:center;margin:0 auto 12px;letter-spacing:1px}
.q-dc-frame::before{content:"";position:absolute;left:16px;top:16px;right:16px;bottom:16px;border:1px solid var(--rc);pointer-events:none}.q-dc-frame{padding-top:58px}
.q-dc-stripe{border-top:12px solid var(--rc)}
.q-dc-blob::before{content:"";position:absolute;right:-80px;top:-90px;width:290px;height:290px;border-radius:50%;background:var(--rt)}.q-dc-blob>*{position:relative}
.q-dc-corner::after{content:"";position:absolute;right:0;top:0;border-style:solid;border-width:0 130px 130px 0;border-color:transparent var(--rc) transparent transparent}.q-dc-corner .rs-hd{position:relative;z-index:1}
.q-dc-dbl{border-top:4px solid var(--rc);padding-top:56px}.q-dc-dbl::before{content:"";position:absolute;left:0;right:0;top:11px;border-top:1px solid var(--rc)}
.q-dc-sides{border-left:14px solid var(--rc);border-right:14px solid var(--rc)}
.q-dc-ribbon .rs-hd{background:var(--rc);margin:-46px -54px 14px;padding:36px 54px 28px}.q-dc-ribbon .qc-pw .rs-img{box-shadow:0 0 0 2px #fff}
/* editorial */
.q-L-ed{padding:46px 52px 40px}.q-ac-side{border-left:12px solid var(--rc)}.q-ac-bar{border-top:12px solid var(--rc)}.q-ac-corner::before{content:"";position:absolute;left:0;top:0;width:96px;height:96px;background:var(--rc)}
.qe-top{display:flex;justify-content:space-between;align-items:flex-start;gap:20px;padding-bottom:16px;border-bottom:2px solid var(--hh);margin-bottom:6px;position:relative}.qe-top .rs-hi{flex:1}.q-L-ed h1{font-size:44px;line-height:1.02;text-transform:uppercase;font-weight:800;letter-spacing:-.5px}
.q-ac-block .qe-top::before{content:"";display:block;position:absolute;left:0;top:-14px;width:64px;height:7px;background:var(--rc)}.q-ac-corner .qe-top{padding-left:84px}.q-ac-corner h1{font-size:40px}
.q-L-ed .rs-row{display:grid;gap:20px;padding:14px 0;border-top:1px solid var(--ln);page-break-inside:avoid}.q-rw110 .rs-row{grid-template-columns:110px 1fr}.q-rw130 .rs-row{grid-template-columns:130px 1fr}.q-rw150 .rs-row{grid-template-columns:150px 1fr}
.q-L-ed .rs-row h3{font-size:11.5px;text-transform:uppercase;letter-spacing:1.8px;color:var(--ac);font-weight:800;padding-top:2px;font-family:var(--rh)}.q-L-ed .rs-sub{margin-top:6px}
.q-L-ed .qe-top{border-bottom-color:var(--rc)}
/* cards */
.q-L-cd{padding:0 0 36px}.qd-hd{display:flex;align-items:center;gap:22px;margin:26px 26px 4px;padding:28px 32px;border-radius:22px;background:linear-gradient(120deg,var(--rx),var(--rc));box-shadow:0 6px 18px rgba(15,23,42,.18)}.qd-hd .rs-hi{flex:1}.q-L-cd h1{font-size:34px;line-height:1.1}
.qd-g{display:grid;grid-template-columns:1fr 236px;gap:16px;padding:14px 26px 0}.qd-card{background:var(--cd);border-radius:16px;padding:16px 18px;margin:0 0 14px!important;box-shadow:0 2px 10px rgba(15,23,42,.09)}.qd-card .rs-job:last-child{margin-bottom:0}.qd-card .rs-jh{flex-wrap:wrap}.qd-s .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}
.qd-card h3{margin-bottom:9px!important;color:var(--ac)!important}.q-h-u .qd-card h3,.q-h-short .qd-card h3,.q-h-box .qd-card h3,.q-h-side .qd-card h3,.q-h-band .qd-card h3,.q-h-dbl .qd-card h3,.q-h-num .qd-card h3,.q-h-dot .qd-card h3,.q-h-flank .qd-card h3,.q-h-slash .qd-card h3,.q-h-brk .qd-card h3,.q-h-bar .qd-card h3{border:0;background:none;padding:0;display:block}
.q-h-pill .qd-card h3,.q-h-bar .qd-card h3{color:#fff!important}.q-h-bar .qd-card h3{background:var(--rc);padding:3px 10px;margin:-4px 0 10px!important;border-radius:6px}
.q-h-pill .qd-card h3{margin-bottom:10px!important}.qd-card h3::before,.qd-card h3::after{display:none!important}.q-h-slash .qd-card h3::before{display:inline!important}
.q-j-c .qd-card .rs-job{background:var(--ds)}
/* arch */
.q-L-ar{display:grid;grid-template-columns:262px 1fr}.q-L-ar .qr-l{margin:26px 0 26px 22px;border-radius:30px;background:var(--ds);padding:30px 20px 28px;align-self:start}.q-L-ar .rs-mn{padding:42px 38px 40px}.q-L-ar h1{font-size:34px;line-height:1.1}
.qr-ph{width:178px;margin:0 auto 22px;padding:9px 9px 0;border-radius:999px 999px 0 0;background:var(--rc);display:flex;justify-content:center}.qr-ph .rs-img{border:0!important;box-shadow:none!important;border-radius:999px 999px 0 0!important}
.q-L-ar .rs-ct{font-size:12px}.q-L-ar .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}
.qh-d .rs-ct{color:#fff}.qh-d .rs-img{box-shadow:none;border-color:rgba(255,255,255,.8)}
.rs-cats{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 10px}.rs-cats button{border:1px solid var(--bd);background:#fff;border-radius:99px;padding:4px 12px;font:inherit;font-size:.74rem;font-weight:600;cursor:pointer;color:var(--ink)}.rs-cats button.on{background:var(--p);color:#fff;border-color:var(--p)}
`;
  [250, 270, 290].forEach(w => { css += `.q-L-dg.q-w${w}{grid-template-columns:${w}px 1fr}.q-L-dg.q-w${w}.q-r{grid-template-columns:1fr ${w}px}`; });
  css += `
/* diagonal sidebar */
.q-L-dg{display:grid}.q-L-dg .rs-sb{position:relative;padding:36px 28px 36px 22px}.q-L-dg.q-r .rs-sb{padding:36px 22px 36px 34px}.q-L-dg .rs-sb>*:not(svg){position:relative}
.qx-bg{position:absolute!important;left:0;top:0;width:100%;height:100%;display:block}
.q-L-dg .rs-mn{padding:42px 38px 40px}.q-L-dg h1{font-size:34px;line-height:1.1}.q-L-dg .rs-ct{font-size:12px}.q-L-dg .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}.q-L-dg .rs-kv span{min-width:0}
.qb-dg{background:none}
/* overlap photo */
.q-L-ov{padding:0}.qo-band{height:156px;position:relative;background:var(--rc);overflow:hidden}
.qo-b-grad{background:linear-gradient(120deg,var(--rx),var(--rc))}.qo-b-dark{background:#111827;border-bottom:5px solid var(--rc)}
.qo-b-curve{background:linear-gradient(120deg,var(--rx),var(--rc));border-radius:0 0 64px 64px}.qo-b-duo{background:var(--rc);border-bottom:22px solid var(--rx);height:178px}.qo-b-wave{height:170px}
.qo-wv{position:absolute;left:0;bottom:-1px;width:100%;height:46px;display:block}
.qo-hd{display:flex;gap:26px;align-items:flex-start;padding:0 44px}.qo-ph{flex:none;margin-top:-70px;position:relative;z-index:2}.qo-hd .rs-hi{flex:1;padding-top:16px}.q-L-ov h1{font-size:36px;line-height:1.1}
.qo-hd-c{flex-direction:column;align-items:center;text-align:center;gap:6px}.qo-hd-c .rs-hi{padding-top:0}.qo-hd-c .rs-ct{justify-content:center}.qo-np .rs-hi{padding-top:24px}
.q-L-ov .rs-body{padding:8px 44px 40px}.q-L-ov .rs-cols{display:grid;grid-template-columns:1fr 244px;gap:30px;padding:2px 40px 40px 44px}.q-L-ov.q-asl .rs-cols{grid-template-columns:244px 1fr;padding:2px 44px 40px 40px}
.q-L-ov .rs-sd{background:var(--ds);border-radius:16px;padding:6px 18px 20px;align-self:start;margin-top:17px}.q-L-ov .rs-sd .rs-jh{flex-direction:column;gap:0}.q-L-ov .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}.q-L-ov .rs-sd .rs-chip{background:var(--cd)}
.q-L-ov.q-dk .qo-band{border-bottom-color:var(--rc)}
`;
  return { R, TH, list: LIST, rec: REC, font: FONT, hfont: HFONT, css };
};
