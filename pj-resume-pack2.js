/* =====================================================================
   PJ Resume Template Pack 2 – 26 more PRO designs built from a layout generator
   (sidebar / top-band / centred layouts × heading styles × skill styles × decorations).
   Load BEFORE pj-tools-upgrade.js (after pj-resume-pack.js). Only html2canvas-safe CSS.
   ===================================================================== */
window.PJ_RS_PACK2 = function (H) {
  const { X, list, blocks, bl, jobs, ct, photo, parts, wrap, head, tint, shade, hexRgb } = H;
  const R = {}, TH = {}, LIST = [], REC = {}, FONT = {}, HFONT = {};
  const SANS = "Inter,'Segoe UI',Arial,sans-serif", SERIF = "'Playfair Display',Georgia,'Times New Roman',serif", MONO = "'JetBrains Mono',ui-monospace,Consolas,monospace";
  const lighten = (h, k) => 'rgb(' + hexRgb(h).map(x => Math.round(x + (255 - x) * k)).join(',') + ')';
  const levels = v => list(v.skills).map(s => { const m = s.match(/^(.*?)\s*[:|]\s*(\d{1,3})\s*%?$/); return m ? { n: m[1].trim(), p: Math.min(100, +m[2]) } : { n: s, p: null }; });
  const bars = v => levels(v).map(s => s.p == null ? '<div class="rs-sn">' + X(s.n) + '</div>' : '<div class="rs-sk"><div class="rs-skt"><span>' + X(s.n) + '</span><i>' + s.p + '%</i></div><div class="rs-trk"><b style="width:' + s.p + '%"></b></div></div>').join('');
  const dots = v => list(v.skills).length ? '<ul class="rs-dl">' + levels(v).map(s => '<li>' + X(s.n) + '</li>').join('') + '</ul>' : '';
  const ring = (p, col, track) => { const L = 2 * Math.PI * 18; return '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="' + track + '" stroke-width="4"/><circle cx="22" cy="22" r="18" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (L * p / 100).toFixed(1) + ' ' + L.toFixed(1) + '" transform="rotate(-90 22 22)"/></svg>'; };
  const rings = (v, col, track) => { const a = levels(v); return a.length ? '<div class="rs-rg">' + a.map(s => s.p == null ? '<div class="rs-rn">' + X(s.n) + '</div>' : '<div class="rs-ri"><div class="rs-rc">' + ring(s.p, col, track) + '<b>' + s.p + '</b></div><span>' + X(s.n) + '</span></div>').join('') + '</div>' : ''; };
  const initials = n => (String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'R';
  const jobsTL = s => blocks(s).map(b => {
    const L = b.split('\n').map(x => x.trim()).filter(Boolean); if (!L.length) return '';
    const m = L[0].match(/^(.*?)\s*[\(\[]\s*([^\)\]]+?)\s*[\)\]]\s*$/), hd = m ? m[1] : L[0], d = m ? m[2] : '';
    return '<div class="rs-tl rs-job"><div class="rs-tld">' + X(d) + '</div><div class="rs-tlc"><b>' + X(hd) + '</b>' + bl(L.slice(1)) + '</div></div>';
  }).join('');
  const DARK = { ink: 1, dark: 1, grad: 1, accent: 1, night: 1 };

  /* ---------- procedural thumbnails ---------- */
  const lines = (x, y, w, n, col) => { let o = ''; for (let i = 0; i < n; i++) o += '<rect x="' + x + '" y="' + (y + i * 5) + '" width="' + (i % 2 ? w * .8 : w) + '" height="2" fill="' + (col || '#cbd5e1') + '"/>'; return o; };
  const sbCol = (cfg, c) => ({ ink: '#1f2937', dark: shade(c, .42), grad: c, accent: c, night: shade(c, .35), tint: tint(c, .14), cream: '#f6f0e6' }[cfg.bg] || c);
  const thumb = (cfg, c) => {
    let o = '';
    if (cfg.L === 'sb') {
      const w = cfg.narrow ? 17 : 22, x = cfg.pos === 'r' ? 60 - w : 0, mx = cfg.pos === 'r' ? 5 : w + 6, dk = DARK[cfg.bg], tc = dk ? '#fff' : c;
      o += '<rect x="' + x + '" width="' + w + '" height="80" fill="' + sbCol(cfg, c) + '"/>' + '<circle cx="' + (x + w / 2) + '" cy="13" r="6" fill="' + (dk ? '#fff' : '#cbd5e1') + '" opacity=".9"/>';
      for (let i = 0; i < 3; i++) o += '<rect x="' + (x + 4) + '" y="' + (28 + i * 9) + '" width="' + (w - 8) + '" height="1.8" rx=".9" fill="' + tc + '" opacity="' + (i ? .7 : 1) + '"/>';
      o += '<rect x="' + (x + 4) + '" y="56" width="' + (w - 8) + '" height="2" fill="' + tc + '" opacity=".5"/>';
      o += '<rect x="' + mx + '" y="8" width="24" height="4.4" fill="#0f172a"/><rect x="' + mx + '" y="15" width="15" height="2" fill="' + c + '"/><rect x="' + mx + '" y="26" width="11" height="2.4" fill="' + c + '"/>' + lines(mx, 32, 30, 3) + '<rect x="' + mx + '" y="52" width="11" height="2.4" fill="' + c + '"/>' + lines(mx, 58, 30, 3);
    } else if (cfg.L === 'tb') {
      const hc = { accent: c, dark: '#111827', grad: shade(c, .6), light: tint(c, .14), line: '#fff' }[cfg.hd] || c, w = cfg.hd !== 'light' && cfg.hd !== 'line';
      o += '<rect width="60" height="26" fill="' + hc + '"/>' + (cfg.hd === 'line' ? '<rect y="25" width="60" height="1.6" fill="' + c + '"/>' : '') +
        '<rect x="' + (cfg.ph === 'l' ? 22 : 6) + '" y="8" width="24" height="4.4" fill="' + (w ? '#fff' : '#0f172a') + '"/><rect x="' + (cfg.ph === 'l' ? 22 : 6) + '" y="15" width="15" height="2" fill="' + (w ? '#fff' : c) + '" opacity=".8"/><circle cx="' + (cfg.ph === 'l' ? 12 : 49) + '" cy="13" r="6" fill="' + (w ? '#fff' : '#cbd5e1') + '" opacity=".9"/>';
      if (cfg.cols) { const ax = cfg.as === 'l' ? 4 : 40; o += '<rect x="' + ax + '" y="32" width="16" height="42" rx="2" fill="' + tint(c, .13) + '"/>' + lines(ax + 2, 36, 12, 4, c) + '<rect x="' + (cfg.as === 'l' ? 24 : 5) + '" y="32" width="12" height="2.4" fill="' + c + '"/>' + lines(cfg.as === 'l' ? 24 : 5, 38, 30, 3) + '<rect x="' + (cfg.as === 'l' ? 24 : 5) + '" y="56" width="12" height="2.4" fill="' + c + '"/>' + lines(cfg.as === 'l' ? 24 : 5, 62, 30, 2); }
      else o += '<rect x="6" y="33" width="14" height="2.6" fill="' + c + '"/>' + lines(6, 39, 48, 3) + '<rect x="6" y="57" width="14" height="2.6" fill="' + c + '"/>' + lines(6, 63, 48, 2);
    } else {
      o += (cfg.dc === 'frame' ? '<rect x="3" y="3" width="54" height="74" fill="none" stroke="' + c + '" stroke-width=".7"/>' : '') + (cfg.dc === 'stripe' ? '<rect width="60" height="3" fill="' + c + '"/>' : '') + (cfg.dc === 'blob' ? '<circle cx="54" cy="6" r="14" fill="' + tint(c, .16) + '"/>' : '') + (cfg.dc === 'corner' ? '<polygon points="60,0 60,16 44,0" fill="' + c + '"/>' : '') +
        '<circle cx="30" cy="12" r="6" fill="' + tint(c, .3) + '"/><rect x="16" y="22" width="28" height="3.4" fill="#0f172a"/><rect x="22" y="28" width="16" height="2" fill="' + c + '"/><rect x="8" y="35" width="44" height="1.4" fill="' + c + '" opacity=".6"/>' + lines(8, 40, 44, 3) + '<rect x="8" y="58" width="44" height="1.4" fill="' + c + '" opacity=".6"/>' + lines(8, 63, 44, 2);
    }
    return o;
  };

  /* ---------- generator ---------- */
  const add = (id, name, color, cfg) => {
    cfg.id = id; const font = cfg.font || SANS, hfont = cfg.hfont || font;
    const mods = ['g-' + cfg.L, 'g-h-' + (cfg.h || 'u'), 'g-j' + (cfg.j || 'p')];
    if (cfg.L === 'sb') { mods.push('g-bg-' + cfg.bg, cfg.pos === 'r' ? 'g-sbr' : 'g-sbl'); if (DARK[cfg.bg]) mods.push('g-dkc'); if (cfg.narrow) mods.push('g-sbn'); if (cfg.card) mods.push('g-sbcard'); }
    if (cfg.L === 'tb') { mods.push('g-hd-' + cfg.hd, cfg.as === 'l' ? 'g-asl' : 'g-asr'); if (cfg.hd !== 'light' && cfg.hd !== 'line') mods.push('g-hdw'); }
    if (cfg.dc) mods.push('g-dc-' + cfg.dc);
    if (cfg.rows) mods.push('g-rows');
    const cls = 'g gx-' + id + ' ' + mods.join(' ');
    FONT[cls] = font; HFONT[cls] = hfont; REC[id] = color; LIST.push([id, name, 'pro']);
    TH[id] = c => thumb(cfg, c);
    R[id] = v => {
      const P = parts(v), p = photo(v, cfg.ps || 128), dk = !!DARK[cfg.bg]; let n = 0;
      const S = (t, h) => !h ? '' : cfg.rows ? '<section class="rs-row"><h3>' + t + '</h3><div>' + h + '</div></section>' : '<section class="rs-s"><h3><em>' + ('0' + (++n)).slice(-2) + '</em>' + t + '</h3>' + h + '</section>';
      const side = (t, h) => h ? '<h4>' + t + '</h4>' + h : '';
      const exp = cfg.j === 'd' ? jobsTL(v.exp) : P.exp, edu = cfg.j === 'd' ? jobsTL(v.edu) : P.edu;
      const sk = cfg.sk === 'bars' ? bars(v) : cfg.sk === 'dots' ? dots(v) : cfg.sk === 'rings' ? rings(v, dk ? lighten(v.color, .4) : v.color, dk ? 'rgba(255,255,255,.2)' : tint(v.color, .18)) : (P.chips ? '<div class="rs-tgs">' + P.chips + '</div>' : '');
      const cts = '<div class="rs-ct col">' + ct(v) + '</div>';
      let inner;
      if (cfg.L === 'sb') {
        const sb = '<aside class="rs-sb">' + (p ? '<div class="rs-pw">' + p + '</div>' : '') + side('Contact', cts) + (cfg.narrow ? '' : side('Skills', sk) + side('Languages', P.langList)) + side('Personal', P.kv) + '</aside>';
        const mn = '<div class="rs-mn">' + head(v) + S('Profile', P.summary) + S('Experience', exp) + S('Education', edu) + (cfg.narrow ? S('Skills', sk) + S('Languages', P.lang) : '') + S('Projects / Certifications', P.extra) + S('Declaration', P.decl) + '</div>';
        inner = cfg.pos === 'r' ? mn + sb : sb + mn;
      } else if (cfg.L === 'tb') {
        const hd = '<div class="rs-hd">' + (cfg.ph === 'l' ? p : '') + '<div class="rs-hi">' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>' + (cfg.ph === 'l' ? '' : p) + '</div>';
        if (cfg.cols) {
          const mn = '<div class="rs-mn">' + S('Profile', P.summary) + S('Experience', exp) + S('Projects / Certifications', P.extra) + S('Declaration', P.decl) + '</div>';
          const sd = '<aside class="rs-sd">' + S('Education', edu) + S('Skills', sk) + S('Languages', P.lang) + S('Personal', P.kv) + '</aside>';
          inner = hd + '<div class="rs-cols">' + (cfg.as === 'l' ? sd + mn : mn + sd) + '</div>';
        } else inner = hd + '<div class="rs-body">' + S('Profile', P.summary) + S('Experience', exp) + S('Education', edu) + S('Skills', sk) + S('Projects / Certifications', P.extra) + S('Languages', P.lang) + S('Personal Details', P.kv) + S('Declaration', P.decl) + '</div>';
      } else {
        inner = '<div class="rs-hd">' + (p ? '<div class="rs-pw">' + p + '</div>' : '') + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>' +
          S('Profile', P.summary) + S('Experience', exp) + S('Education', edu) + S('Skills', sk) + S('Projects / Certifications', P.extra) + S('Languages', P.lang) + S('Personal Details', P.kv) + S('Declaration', P.decl);
      }
      return wrap(v, cls, inner);
    };
  };

  /* ---------- 26 designs ---------- */
  /* sidebar family */
  add('g1', 'Charcoal Left', '#f59e0b', { L: 'sb', bg: 'ink', pos: 'l', sk: 'bars', h: 'u', j: 'p' });
  add('g2', 'Right Panel', '#2563eb', { L: 'sb', bg: 'tint', pos: 'r', sk: 'dots', h: 'box', j: 'p', ps: 120 });
  add('g3', 'Teal Rings', '#0d9488', { L: 'sb', bg: 'grad', pos: 'l', sk: 'rings', h: 'flank', j: 'p' });
  add('g4', 'Rose Card', '#e11d48', { L: 'sb', bg: 'tint', pos: 'l', sk: 'bars', h: 'pill', j: 'p', card: 1 });
  add('g5', 'Navy Right', '#1e40af', { L: 'sb', bg: 'dark', pos: 'r', sk: 'bars', h: 'num', j: 'd' });
  add('g6', 'Violet Night', '#7c3aed', { L: 'sb', bg: 'night', pos: 'l', sk: 'chips', h: 'bar', j: 'p' });
  add('g7', 'Forest Right', '#166534', { L: 'sb', bg: 'accent', pos: 'r', sk: 'dots', h: 'u', j: 't' });
  add('g8', 'Cream Serif', '#92400e', { L: 'sb', bg: 'cream', pos: 'l', sk: 'dots', h: 'flank', j: 'p', font: SANS, hfont: SERIF });
  add('g9', 'Slate Timeline', '#0284c7', { L: 'sb', bg: 'ink', pos: 'l', sk: 'bars', h: 'dot', j: 't', ps: 140 });
  add('g10', 'Coral Edge', '#f43f5e', { L: 'sb', bg: 'accent', pos: 'l', sk: 'chips', h: 'num', j: 'p', narrow: 1 });
  /* top-band family */
  add('g11', 'Navy Banner', '#1d4ed8', { L: 'tb', hd: 'dark', ph: 'r', cols: 1, as: 'r', sk: 'bars', h: 'bar', j: 'p' });
  add('g12', 'Sunrise', '#f97316', { L: 'tb', hd: 'curve', ph: 'r', cols: 0, sk: 'chips', h: 'pill', j: 'p' });
  add('g13', 'Mint Fresh', '#10b981', { L: 'tb', hd: 'light', ph: 'l', cols: 1, as: 'l', sk: 'chips', h: 'u', j: 'p' });
  add('g14', 'Plum Header', '#9d174d', { L: 'tb', hd: 'accent', ph: 'l', cols: 0, sk: 'chips', h: 'num', j: 'd' });
  add('g15', 'Clean Line', '#0f766e', { L: 'tb', hd: 'line', ph: 'r', cols: 1, as: 'r', sk: 'dots', h: 'box', j: 'p' });
  add('g16', 'Sky Blue', '#0ea5e9', { L: 'tb', hd: 'curve', ph: 'l', cols: 1, as: 'r', sk: 'bars', h: 'flank', j: 'p' });
  add('g17', 'Ink & Gold', '#ca8a04', { L: 'tb', hd: 'dark', ph: 'r', cols: 0, sk: 'chips', h: 'caps', j: 'p', rows: 1, hfont: SERIF });
  add('g18', 'Berry Pop', '#be185d', { L: 'tb', hd: 'accent', ph: 'r', cols: 1, as: 'r', sk: 'chips', h: 'pill', j: 'p', dc: 'blob' });
  add('g19', 'Steel Grid', '#475569', { L: 'tb', hd: 'light', ph: 'l', cols: 0, sk: 'chips', h: 'caps', j: 'p', rows: 1 });
  add('g20', 'Leaf Green', '#16a34a', { L: 'tb', hd: 'grad', ph: 'r', cols: 1, as: 'l', sk: 'bars', h: 'bar', j: 't' });
  /* centred family */
  add('g21', 'Royal Centre', '#1e3a8a', { L: 'ct', h: 'flank', j: 'p', dc: 'frame', font: SANS, hfont: SERIF, sk: 'chips' });
  add('g22', 'Rose Letter', '#be123c', { L: 'ct', h: 'u', j: 'p', sk: 'chips', ps: 110 });
  add('g23', 'Mono Centre', '#111827', { L: 'ct', h: 'caps', j: 'p', sk: 'dots', dc: 'stripe' });
  add('g24', 'Copper Line', '#b45309', { L: 'ct', h: 'dot', j: 't', sk: 'chips', dc: 'stripe' });
  add('g25', 'Ocean Centre', '#0369a1', { L: 'ct', h: 'pill', j: 'p', sk: 'chips', dc: 'blob' });
  add('g26', 'Sage Centre', '#4d7c0f', { L: 'ct', h: 'num', j: 'd', sk: 'chips', dc: 'corner', hfont: SERIF });

  const css = `
.rs-pick{max-height:560px;overflow:auto;padding:2px 4px 2px 2px}
.t-g .rs-img{border:4px solid #fff;box-shadow:0 0 0 2px var(--rc)}.t-g .rs-s h3 em{display:none;font-style:normal}
.t-g .rs-tgs{display:flex;flex-wrap:wrap}.t-g .rs-chip{background:var(--rt);color:var(--rd)}
.t-g .rs-rg{display:grid;grid-template-columns:1fr 1fr;gap:12px 8px}.t-g .rs-ri{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;font-size:11px;line-height:1.25}
.t-g .rs-rc{position:relative;width:60px;height:60px}.t-g .rs-rc svg{width:60px;height:60px;display:block}.t-g .rs-rc b{position:absolute;left:0;top:0;width:60px;height:60px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700}.t-g .rs-rn{grid-column:1/-1;font-size:12.5px}
.t-g .rs-sub{color:var(--rd);font-weight:600;letter-spacing:1.5px;text-transform:uppercase;font-size:12.5px}.t-g h1{font-family:var(--rh);font-weight:800;letter-spacing:-.3px}
/* sidebar */
.g-sb{display:grid;grid-template-columns:268px 1fr}.g-sb.g-sbr{grid-template-columns:1fr 268px}.g-sb.g-sbn{grid-template-columns:222px 1fr}.g-sb.g-sbn.g-sbr{grid-template-columns:1fr 222px}
.g-sb .rs-sb{padding:38px 22px}.g-sb .rs-pw{display:flex;justify-content:center;margin-bottom:22px}.g-sb .rs-mn{padding:42px 38px 40px}.g-sb h1{font-size:34px;line-height:1.1}
.g-sb h4{font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:22px 0 11px;font-weight:700;padding-bottom:5px;color:var(--rd);border-bottom:1px solid var(--rt)}
.g-sb .rs-ct{font-size:12px}.g-sb .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}.g-sb .rs-kv span{min-width:0}
.g-bg-ink .rs-sb{background:#1f2937}.g-bg-dark .rs-sb{background:var(--rx)}.g-bg-grad .rs-sb{background:linear-gradient(170deg,var(--rc),var(--rx))}.g-bg-accent .rs-sb{background:var(--rc)}.g-bg-night .rs-sb{background:linear-gradient(180deg,var(--rx),#0b1020)}.g-bg-tint .rs-sb{background:var(--rt)}.g-bg-cream .rs-sb{background:#f6f0e6}
.g-dkc .rs-sb{color:#fff}.g-dkc h4{color:#fff;border-bottom-color:rgba(255,255,255,.3)}.g-dkc .rs-ct{color:#fff}.g-dkc .rs-kv span{color:rgba(255,255,255,.7)}.g-dkc .rs-trk{background:rgba(255,255,255,.22)}.g-dkc .rs-trk b{background:var(--rl)}
.g-bg-ink .rs-trk b{background:var(--rc)}.g-dkc .rs-sb .rs-chip{background:rgba(255,255,255,.16);color:#fff}.g-dkc .rs-dl li::before,.g-dkc .rs-sn::before{background:var(--rl)}.g-dkc .rs-img{border-color:rgba(255,255,255,.85);box-shadow:none}
.g-sbcard .rs-sb{margin:26px 0 26px 22px;border-radius:22px;height:auto;align-self:start}.g-sbcard.g-sbr .rs-sb{margin:26px 22px 26px 0}
.g-sb .rs-c svg{flex:none}.g-sbn .rs-sb{padding:34px 16px}.g-sbn h1{font-size:32px}
/* top band */
.g-tb .rs-hd{display:flex;align-items:center;gap:24px;padding:38px 44px}.g-tb .rs-hi{flex:1}.g-tb h1{font-size:36px;line-height:1.1}
.g-hd-accent .rs-hd{background:var(--rc)}.g-hd-dark .rs-hd{background:#111827;border-bottom:5px solid var(--rc)}.g-hd-grad .rs-hd{background:linear-gradient(120deg,var(--rx),var(--rc))}
.g-hd-curve .rs-hd{background:linear-gradient(120deg,var(--rx),var(--rc));border-radius:0 0 42px 42px;padding-bottom:46px}.g-hd-light .rs-hd{background:var(--rt)}.g-hd-line .rs-hd{border-bottom:4px solid var(--rc)}
.g-hdw h1,.g-hdw .rs-sub,.g-hdw .rs-ct{color:#fff}.g-hdw .rs-sub{opacity:.92}
.g-tb .rs-body{padding:8px 44px 40px}.g-tb .rs-cols{display:grid;grid-template-columns:1fr 244px;gap:30px;padding:2px 40px 40px 44px}.g-tb.g-asl .rs-cols{grid-template-columns:244px 1fr;padding:2px 44px 40px 40px}
.g-tb .rs-sd{background:var(--rt);border-radius:16px;padding:6px 18px 20px;align-self:start;margin-top:17px}.g-tb .rs-sd .rs-jh{flex-direction:column;gap:0}.g-tb .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}.g-tb .rs-sd .rs-chip{background:#fff}
/* centred */
.g-ct{padding:46px 54px}.g-ct .rs-hd{text-align:center;padding-bottom:10px}.g-ct .rs-ct{justify-content:center}.g-ct .rs-pw{display:flex;justify-content:center;margin-bottom:12px}.g-ct h1{font-size:36px}.g-ct .rs-s{margin-top:19px}
/* heading styles */
.g-h-u .rs-s h3{border-bottom:2px solid var(--rc);padding-bottom:4px;color:#0f172a}
.g-h-pill .rs-s h3{display:table;background:var(--rc);color:#fff;padding:3px 15px;border-radius:99px;font-size:11.5px;letter-spacing:1.6px;margin-bottom:10px}
.g-h-bar .rs-s h3{background:var(--rc);color:#fff;padding:5px 14px;letter-spacing:2px;margin-bottom:10px}
.g-h-box .rs-s h3{border-left:6px solid var(--rc);background:var(--rt);padding:4px 0 4px 11px;color:#0f172a}
.g-h-flank .rs-s h3{display:flex;align-items:center;gap:12px;color:#0f172a;font-family:var(--rh)}.g-h-flank .rs-s h3::before,.g-h-flank .rs-s h3::after{content:"";flex:1;border-top:1px solid var(--rc)}
.g-h-num .rs-s h3{display:flex;gap:10px;align-items:baseline;border-bottom:1px solid #e2e8f0;padding-bottom:5px;color:#0f172a;font-family:var(--rh)}.g-h-num .rs-s h3 em{display:inline;color:var(--rc)}
.g-h-dot .rs-s h3{display:flex;align-items:center;gap:9px;color:#0f172a}.g-h-dot .rs-s h3::before{content:"";width:11px;height:11px;border-radius:50%;background:var(--rc)}
.g-h-caps .rs-s h3{color:#111827;letter-spacing:3.2px;font-size:12px;font-family:var(--rh)}
.g-sb.g-h-flank .rs-s h3::before{display:none}
.g-rows .rs-row{display:grid;grid-template-columns:120px 1fr;gap:20px;padding:14px 0;border-top:1px solid #d1d5db;page-break-inside:avoid}.g-rows .rs-row h3{font-size:11.5px;text-transform:uppercase;letter-spacing:1.8px;color:var(--rc);font-weight:800;padding-top:2px;font-family:var(--rh)}
.g-rows.g-tb .rs-hd{margin-bottom:6px}.g-rows.g-ct{padding-bottom:40px}
/* jobs */
.g-jt .rs-job{border-left:2px solid var(--rt);padding-left:15px;position:relative}.g-jt .rs-job::before{content:"";position:absolute;left:-6px;top:5px;width:10px;height:10px;border-radius:50%;background:var(--rc);border:2px solid #fff}
.g-jd .rs-tl{display:grid;grid-template-columns:112px 1fr;margin:0}.g-jd .rs-tld{text-align:right;padding:2px 20px 0 0;font-size:11.5px;font-weight:600;color:var(--rc)}.g-jd .rs-tlc{position:relative;border-left:2px solid var(--rt);padding:0 0 13px 20px}.g-jd .rs-tlc::before{content:"";position:absolute;left:-7px;top:3px;width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid var(--rc)}
.g-jd .rs-sd .rs-tl{grid-template-columns:1fr}.g-jd .rs-sd .rs-tld{text-align:left;padding:0 0 0 20px;order:2}
/* decorations */
.g-dc-frame::before{content:"";position:absolute;left:16px;top:16px;right:16px;bottom:16px;border:1px solid var(--rc);pointer-events:none}.g-dc-frame{padding-top:56px}
.g-dc-stripe{border-top:12px solid var(--rc)}
.g-dc-blob::before{content:"";position:absolute;right:-80px;top:-90px;width:280px;height:280px;border-radius:50%;background:var(--rt)}.g-dc-blob>*{position:relative}
.g-dc-corner::after{content:"";position:absolute;right:0;top:0;border-style:solid;border-width:0 130px 130px 0;border-color:transparent var(--rc) transparent transparent}.g-dc-corner .rs-hd{position:relative;z-index:1}
.g-dc-blob.g-tb::before{background:rgba(255,255,255,.12)}
`;
  return { R, TH, list: LIST, rec: REC, font: FONT, hfont: HFONT, css };
};
