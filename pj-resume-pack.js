/* =====================================================================
   PJ Resume Template Pack – 5 new free templates + 13 PRO-level templates
   Load BEFORE pj-tools-upgrade.js. It exposes window.PJ_RS_PACK(helpers),
   which pj-tools-upgrade.js calls to merge these templates into Resume Maker.
   (Only html2canvas-safe CSS is used so "Download PDF" matches the preview.)
   ===================================================================== */
window.PJ_RS_PACK = function (H) {
  const { X, nl2, list, blocks, bl, jobs, kv, ct, sec, photo, parts, wrap, head, IC, tint, shade, hexRgb } = H;
  const R = {}, TH = {}, LIST = [], REC = {}, FONT = {}, HFONT = {};
  const SANS = "Inter,'Segoe UI',Arial,sans-serif", SERIF = "'Playfair Display',Georgia,'Times New Roman',serif", MONO = "'JetBrains Mono',ui-monospace,Consolas,monospace";
  const add = (id, name, tier, rec, font, hfont, fn, th) => { R[id] = fn; TH[id] = th; LIST.push([id, name, tier]); REC[id] = rec; if (font) FONT[id] = font; if (hfont) HFONT[id] = hfont; };

  /* ---------- helpers ---------- */
  const lighten = (h, k) => 'rgb(' + hexRgb(h).map(x => Math.round(x + (255 - x) * k)).join(',') + ')';
  const initials = n => (String(n || '').split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0].toUpperCase()).join('')) || 'R';
  const levels = v => list(v.skills).map(s => { const m = s.match(/^(.*?)\s*[:|]\s*(\d{1,3})\s*%?$/); return m ? { n: m[1].trim(), p: Math.min(100, +m[2]) } : { n: s, p: null }; });
  const bars = v => levels(v).map(s => s.p == null ? '<div class="rs-sn">' + X(s.n) + '</div>' : '<div class="rs-sk"><div class="rs-skt"><span>' + X(s.n) + '</span><i>' + s.p + '%</i></div><div class="rs-trk"><b style="width:' + s.p + '%"></b></div></div>').join('');
  const ring = (p, col, track) => { const L = 2 * Math.PI * 18; return '<svg viewBox="0 0 44 44"><circle cx="22" cy="22" r="18" fill="none" stroke="' + track + '" stroke-width="4"/><circle cx="22" cy="22" r="18" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + (L * p / 100).toFixed(1) + ' ' + L.toFixed(1) + '" transform="rotate(-90 22 22)"/></svg>'; };
  const rings = (v, col, track) => { const a = levels(v); if (!a.length) return ''; return '<div class="rs-rg">' + a.map(s => s.p == null ? '<div class="rs-rn">' + X(s.n) + '</div>' : '<div class="rs-ri"><div class="rs-rc">' + ring(s.p, col, track) + '<b>' + s.p + '</b></div><span>' + X(s.n) + '</span></div>').join('') + '</div>'; };
  const dots = v => { const a = list(v.skills); return a.length ? '<ul class="rs-dl">' + levels(v).map(s => '<li>' + X(s.n) + '</li>').join('') + '</ul>' : ''; };
  const monoBox = v => '<div class="rs-img rs-mono ' + v.shape + '">' + X(initials(v.name)) + '</div>';
  const pho = (v, s) => photo(v, s);
  const jobsTL = s => blocks(s).map(b => {
    const L = b.split('\n').map(x => x.trim()).filter(Boolean); if (!L.length) return '';
    const m = L[0].match(/^(.*?)\s*[\(\[]\s*([^\)\]]+?)\s*[\)\]]\s*$/), hd = m ? m[1] : L[0], d = m ? m[2] : '';
    return '<div class="rs-tl rs-job"><div class="rs-tld">' + X(d) + '</div><div class="rs-tlc"><b>' + X(hd) + '</b>' + bl(L.slice(1)) + '</div></div>';
  }).join('');
  const nameParts = n => { const w = String(n || '').trim().split(/\s+/); return w.length > 1 ? [w[0], w.slice(1).join(' ')] : [w[0] || '', '']; };
  const tail = (v, P) => sec('Languages', P.lang) + sec('Personal Details', P.kv) + sec('Declaration', P.decl);
  const side = (t, h) => h ? '<h4>' + t + '</h4>' + h : '';

  /* ================= FREE – new ================= */
  add('bold', 'Bold Banner', 'free', '#e11d48', 0, 0, v => {
    const P = parts(v), p = pho(v, 120);
    return wrap(v, 'bold', '<div class="rs-hd"><div class="rs-hl">' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>' + (p ? '<div class="rs-hr">' + p + '</div>' : '') + '</div><div class="rs-body">' +
      sec('Profile', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Skills', P.chips) + sec('Projects / Certifications', P.extra) + tail(v, P) + '</div>');
  }, c => '<rect width="60" height="24" fill="' + c + '"/><rect x="42" width="18" height="24" fill="#000" opacity=".18"/><circle cx="51" cy="12" r="6" fill="#fff" opacity=".8"/><rect x="6" y="8" width="28" height="4" fill="#fff"/><rect x="6" y="15" width="18" height="2" fill="#fff" opacity=".7"/><rect x="6" y="32" width="18" height="5" rx="2.5" fill="' + c + '"/><rect x="6" y="41" width="48" height="2" fill="#cbd5e1"/><rect x="6" y="46" width="38" height="2" fill="#cbd5e1"/><rect x="6" y="56" width="18" height="5" rx="2.5" fill="' + c + '"/><rect x="6" y="65" width="46" height="2" fill="#cbd5e1"/>');

  add('gradient', 'Gradient Card', 'free', '#7c3aed', 0, 0, v => {
    const P = parts(v), p = pho(v, 104);
    return wrap(v, 'gradient', '<div class="rs-hd"><div>' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>' + p + '</div><div class="rs-body">' +
      sec('About Me', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Skills', P.chips) + sec('Projects / Certifications', P.extra) + tail(v, P) + '</div>');
  }, c => '<defs><linearGradient id="g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c + '" stop-opacity=".6"/><stop offset="1" stop-color="' + c + '"/></linearGradient></defs><path d="M0 0H60V26Q60 32 54 32H6Q0 32 0 26Z" fill="url(#g1)"/><circle cx="46" cy="14" r="7" fill="#fff" opacity=".8"/><rect x="6" y="9" width="26" height="4" fill="#fff"/><rect x="6" y="17" width="16" height="2" fill="#fff" opacity=".7"/><rect x="5" y="38" width="50" height="14" rx="3" fill="#f1f5f9"/><rect x="9" y="42" width="18" height="2" fill="' + c + '"/><rect x="9" y="47" width="38" height="2" fill="#cbd5e1"/><rect x="5" y="56" width="50" height="14" rx="3" fill="#f1f5f9"/><rect x="9" y="60" width="18" height="2" fill="' + c + '"/><rect x="9" y="65" width="34" height="2" fill="#cbd5e1"/>');

  add('elegant', 'Elegant Serif', 'free', '#9a3412', SERIF, SERIF, v => {
    const P = parts(v), p = pho(v, 96);
    return wrap(v, 'elegant', '<div class="rs-hd">' + (p ? '<div class="rs-pw">' + p + '</div>' : '') + '<h1>' + X(v.name) + '</h1><div class="rs-sub">' + X(v.title) + '</div><div class="rs-orn"><i></i><em>◆</em><i></i></div><div class="rs-ct">' + ct(v) + '</div></div>' +
      sec('Profile', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Skills', P.plain ? '<p class="rs-cen">' + P.plain.replace(/, /g, '  ·  ') + '</p>' : '') + sec('Projects / Certifications', P.extra) + tail(v, P));
  }, c => '<circle cx="30" cy="12" r="6" fill="#e2e8f0"/><rect x="15" y="22" width="30" height="3" fill="#334155"/><rect x="22" y="28" width="16" height="2" fill="' + c + '"/><rect x="10" y="34" width="16" height="1" fill="' + c + '"/><rect x="34" y="34" width="16" height="1" fill="' + c + '"/><rect x="21" y="33" width="18" height="3" fill="none"/><rect x="20" y="42" width="20" height="2" fill="' + c + '"/><rect x="8" y="49" width="44" height="2" fill="#cbd5e1"/><rect x="8" y="54" width="36" height="2" fill="#cbd5e1"/><rect x="20" y="63" width="20" height="2" fill="' + c + '"/><rect x="8" y="69" width="44" height="2" fill="#cbd5e1"/>');

  add('profile', 'Profile Card', 'free', '#0d9488', 0, 0, v => {
    const P = parts(v), p = pho(v, 124);
    return wrap(v, 'profile', '<div class="rs-card">' + p + '<div class="rs-pi">' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div></div><div class="rs-cols"><div class="rs-mn">' +
      sec('Professional Summary', P.summary) + sec('Experience', P.exp) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) + '</div><aside class="rs-sd">' +
      sec('Education', P.edu) + sec('Skills', P.chips) + sec('Languages', P.lang) + sec('Personal', P.kv) + '</aside></div>');
  }, c => '<rect x="4" y="4" width="52" height="22" rx="5" fill="' + c + '" opacity=".16"/><rect x="9" y="8" width="14" height="14" rx="4" fill="' + c + '"/><rect x="28" y="10" width="22" height="3" fill="#334155"/><rect x="28" y="16" width="14" height="2" fill="' + c + '"/><rect x="6" y="34" width="30" height="2" fill="' + c + '"/><rect x="6" y="39" width="30" height="2" fill="#cbd5e1"/><rect x="6" y="44" width="26" height="2" fill="#cbd5e1"/><rect x="6" y="56" width="30" height="2" fill="#cbd5e1"/><rect x="42" y="31" width="12" height="1.5" fill="' + c + '"/><rect x="42" y="36" width="12" height="2" fill="#cbd5e1"/><rect x="42" y="50" width="12" height="1.5" fill="' + c + '"/><rect x="42" y="55" width="10" height="2" fill="#cbd5e1"/>');

  add('fresher', 'Fresher Focus', 'free', '#2563eb', 0, 0, v => {
    const P = parts(v), p = pho(v, 104), ck = P.plain ? '<ul class="rs-ck">' + levels(v).map(s => '<li>' + X(s.n) + '</li>').join('') + '</ul>' : '';
    return wrap(v, 'fresher', '<div class="rs-top"></div><div class="rs-hd"><div>' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>' + p + '</div><div class="rs-body">' +
      sec('Career Objective', P.summary) + sec('Education', P.edu) + sec('Projects / Internship', P.exp) + sec('Skills', ck) + sec('Certifications / Extra', P.extra) + tail(v, P) + '</div>');
  }, c => '<rect width="60" height="4" fill="' + c + '"/><rect x="6" y="10" width="26" height="4" fill="#334155"/><rect x="6" y="17" width="16" height="2" fill="' + c + '"/><rect x="44" y="8" width="10" height="12" rx="2" fill="#cbd5e1"/><rect x="6" y="30" width="3" height="3" fill="' + c + '"/><rect x="12" y="30" width="18" height="3" fill="#334155"/><rect x="6" y="37" width="48" height="2" fill="#cbd5e1"/><rect x="6" y="46" width="3" height="3" fill="' + c + '"/><rect x="12" y="46" width="18" height="3" fill="#334155"/><rect x="6" y="53" width="22" height="2" fill="#cbd5e1"/><rect x="32" y="53" width="22" height="2" fill="#cbd5e1"/><rect x="6" y="58" width="22" height="2" fill="#cbd5e1"/><rect x="32" y="58" width="22" height="2" fill="#cbd5e1"/>');

  /* ================= PRO ================= */
  /* 1 – Aurora Sidebar */
  add('p-aurora', 'Aurora', 'pro', '#1d4ed8', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 150);
    return wrap(v, 'aurora', '<aside class="rs-sb">' + (p ? '<div class="rs-pw"><div class="rs-ring">' + p + '</div></div>' : '') +
      side('Contact', '<div class="rs-ct col">' + ct(v) + '</div>') + side('Skills', bars(v)) + side('Languages', P.langList) + side('Personal', P.kv) + '</aside><div class="rs-mn">' + head(v) +
      sec('Profile', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) + '</div>');
  }, c => '<defs><linearGradient id="g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + shade(c, .45) + '"/><stop offset="1" stop-color="' + shade(c, .8) + '"/></linearGradient></defs><rect width="22" height="80" fill="url(#g2)"/><circle cx="11" cy="14" r="7" fill="#fff" opacity=".35"/><circle cx="11" cy="14" r="5.4" fill="#fff" opacity=".85"/><rect x="4" y="28" width="14" height="1.6" fill="#fff" opacity=".7"/><rect x="4" y="34" width="14" height="2" rx="1" fill="#fff" opacity=".25"/><rect x="4" y="34" width="10" height="2" rx="1" fill="#fff"/><rect x="4" y="40" width="14" height="2" rx="1" fill="#fff" opacity=".25"/><rect x="4" y="40" width="12" height="2" rx="1" fill="#fff"/><rect x="4" y="46" width="14" height="2" rx="1" fill="#fff" opacity=".25"/><rect x="4" y="46" width="8" height="2" rx="1" fill="#fff"/><rect x="28" y="8" width="26" height="5" fill="#0f172a"/><rect x="28" y="16" width="16" height="2" fill="' + c + '"/><rect x="28" y="27" width="10" height="2" fill="' + c + '"/><rect x="40" y="28" width="14" height=".8" fill="#cbd5e1"/><rect x="28" y="33" width="26" height="2" fill="#cbd5e1"/><rect x="28" y="38" width="22" height="2" fill="#cbd5e1"/><rect x="28" y="50" width="10" height="2" fill="' + c + '"/><rect x="28" y="56" width="26" height="2" fill="#cbd5e1"/>');

  /* 2 – Gold Executive */
  add('p-gold', 'Gold Executive', 'pro', '#b8892b', SANS, SERIF, v => {
    const P = parts(v), p = pho(v, 112);
    return wrap(v, 'gold', '<div class="rs-hd"><div class="rs-hl"><h1>' + X(v.name) + '</h1><div class="rs-sub">' + X(v.title) + '</div><div class="rs-gl"></div><div class="rs-ct">' + ct(v) + '</div></div>' + (p ? '<div class="rs-fr">' + p + '</div>' : '') + '</div><div class="rs-cols"><div class="rs-mn">' +
      sec('Executive Profile', P.summary) + sec('Professional Experience', P.exp) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) + '</div><aside class="rs-sd">' +
      sec('Education', P.edu) + sec('Core Skills', dots(v)) + sec('Languages', P.lang) + sec('Personal', P.kv) + '</aside></div>');
  }, c => '<rect width="60" height="26" fill="#15171c"/><rect y="26" width="60" height="1.8" fill="' + c + '"/><rect x="6" y="8" width="26" height="4" fill="#fff"/><rect x="6" y="15" width="18" height="2" fill="' + c + '"/><rect x="43" y="6" width="11" height="14" fill="none" stroke="' + c + '" stroke-width="1.2"/><rect x="38" y="28" width="22" height="52" fill="#faf7f0"/><rect x="6" y="35" width="14" height="2" fill="' + c + '"/><rect x="6" y="40" width="28" height="2" fill="#cbd5e1"/><rect x="6" y="45" width="24" height="2" fill="#cbd5e1"/><rect x="6" y="56" width="14" height="2" fill="' + c + '"/><rect x="6" y="61" width="28" height="2" fill="#cbd5e1"/><rect x="42" y="35" width="12" height="2" fill="' + c + '"/><rect x="42" y="40" width="12" height="2" fill="#cbd5e1"/><rect x="42" y="56" width="12" height="2" fill="' + c + '"/>');

  /* 3 – Split Studio */
  add('p-split', 'Split Studio', 'pro', '#0f766e', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 228), np = nameParts(v.name); let n = 0;
    const secN = (t, h) => h ? '<section class="rs-s"><h3><em>' + ('0' + (++n)).slice(-2) + '</em>' + t + '</h3>' + h + '</section>' : '';
    return wrap(v, 'split', '<aside class="rs-sb">' + (p ? '<div class="rs-pw">' + p + '</div>' : '<div class="rs-pw">' + monoBox(v) + '</div>') +
      side('Contact', '<div class="rs-ct col">' + ct(v) + '</div>') + side('Skills', bars(v)) + side('Languages', P.langList) + side('Personal', P.kv) + '</aside><div class="rs-mn"><h1><span>' + X(np[0]) + '</span> ' + X(np[1]) + '</h1><div class="rs-sub">' + X(v.title) + '</div>' +
      secN('Profile', P.summary) + secN('Experience', P.exp) + secN('Education', P.edu) + secN('Projects / Certifications', P.extra) + secN('Declaration', P.decl) + '</div>');
  }, c => '<rect width="24" height="80" fill="' + tint(c, .13) + '"/><rect x="3" y="4" width="18" height="18" rx="4" fill="' + c + '" opacity=".75"/><rect x="4" y="28" width="12" height="2" fill="' + c + '"/><rect x="4" y="34" width="16" height="1.6" rx=".8" fill="' + c + '" opacity=".2"/><rect x="4" y="34" width="11" height="1.6" rx=".8" fill="' + c + '"/><rect x="4" y="39" width="16" height="1.6" rx=".8" fill="' + c + '" opacity=".2"/><rect x="4" y="39" width="13" height="1.6" rx=".8" fill="' + c + '"/><rect x="4" y="50" width="12" height="2" fill="' + c + '"/><rect x="30" y="8" width="12" height="4" fill="#94a3b8"/><rect x="43" y="8" width="14" height="4" fill="#0f172a"/><rect x="30" y="16" width="20" height="2" fill="' + c + '"/><text x="30" y="30" font-size="4" font-weight="700" fill="' + c + '">01</text><rect x="37" y="28" width="20" height="1.6" fill="#334155"/><rect x="30" y="34" width="26" height="2" fill="#cbd5e1"/><text x="30" y="48" font-size="4" font-weight="700" fill="' + c + '">02</text><rect x="37" y="46" width="20" height="1.6" fill="#334155"/><rect x="30" y="52" width="26" height="2" fill="#cbd5e1"/>');

  /* 4 – Career Path (timeline) */
  add('p-path', 'Career Path', 'pro', '#7c3aed', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 118), c = v.color;
    const deco = '<svg class="rs-deco" viewBox="0 0 330 210" xmlns="http://www.w3.org/2000/svg"><polygon points="330,0 330,210 90,0" fill="' + c + '"/><polygon points="330,0 330,120 200,0" fill="' + shade(c, .6) + '"/><polygon points="330,210 330,150 260,210" fill="' + lighten(c, .55) + '"/></svg>';
    return wrap(v, 'path', '<div class="rs-hd">' + deco + '<div class="rs-hl">' + head(v) + '</div>' + (p ? '<div class="rs-hp">' + p + '</div>' : '') + '</div><div class="rs-strip">' + ct(v) + '</div><div class="rs-body">' +
      sec('About Me', P.summary) + sec('Experience', jobsTL(v.exp)) + sec('Education', jobsTL(v.edu)) + sec('Skills', P.chips) + sec('Projects / Certifications', P.extra) + tail(v, P) + '</div>');
  }, c => '<polygon points="60,0 60,28 30,0" fill="' + c + '"/><polygon points="60,0 60,16 44,0" fill="' + shade(c, .6) + '"/><rect x="6" y="9" width="26" height="4" fill="#0f172a"/><rect x="6" y="16" width="18" height="2" fill="' + c + '"/><circle cx="48" cy="12" r="5" fill="#fff"/><rect x="0" y="30" width="60" height="6" fill="' + tint(c, .1) + '"/><line x1="22" y1="42" x2="22" y2="74" stroke="' + c + '" opacity=".3" stroke-width="1.4"/><circle cx="22" cy="46" r="2.4" fill="' + c + '"/><circle cx="22" cy="64" r="2.4" fill="' + c + '"/><rect x="4" y="45" width="13" height="2" fill="' + c + '"/><rect x="4" y="63" width="13" height="2" fill="' + c + '"/><rect x="27" y="45" width="28" height="2" fill="#cbd5e1"/><rect x="27" y="50" width="22" height="2" fill="#cbd5e1"/><rect x="27" y="63" width="28" height="2" fill="#cbd5e1"/><rect x="27" y="68" width="20" height="2" fill="#cbd5e1"/>');

  /* 5 – Diagonal Hero */
  add('p-diagonal', 'Diagonal Hero', 'pro', '#e11d48', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 136), c = v.color;
    const bg = '<svg class="rs-bgsvg" viewBox="0 0 794 262" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + shade(c, .45) + '"/><stop offset="1" stop-color="' + c + '"/></linearGradient></defs><polygon points="0,262 794,170 794,196 0,262" fill="' + lighten(c, .55) + '"/><polygon points="0,0 794,0 794,176 0,244" fill="url(#gd)"/></svg>';
    return wrap(v, 'diagonal', '<div class="rs-hd">' + bg + '<div class="rs-hc">' + (p ? '<div class="rs-hpw">' + p + '</div>' : '') + '<div>' + head(v) + '</div></div></div><div class="rs-strip">' + ct(v) + '</div><div class="rs-cols"><div class="rs-mn">' +
      sec('Profile', P.summary) + sec('Experience', P.exp) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) + '</div><aside class="rs-sd">' +
      sec('Skills', bars(v)) + sec('Education', P.edu) + sec('Languages', P.lang) + sec('Personal', P.kv) + '</aside></div>');
  }, c => '<defs><linearGradient id="g5" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + shade(c, .45) + '"/><stop offset="1" stop-color="' + c + '"/></linearGradient></defs><polygon points="0,0 60,0 60,24 0,34" fill="url(#g5)"/><circle cx="14" cy="17" r="7" fill="#fff" opacity=".85"/><rect x="26" y="12" width="24" height="4" fill="#fff"/><rect x="26" y="19" width="16" height="2" fill="#fff" opacity=".7"/><rect x="6" y="38" width="48" height="4" rx="2" fill="' + tint(c, .12) + '"/><rect x="6" y="48" width="14" height="2" fill="' + c + '"/><rect x="6" y="53" width="26" height="2" fill="#cbd5e1"/><rect x="6" y="58" width="22" height="2" fill="#cbd5e1"/><rect x="38" y="46" width="16" height="30" rx="3" fill="' + tint(c, .1) + '"/><rect x="41" y="50" width="10" height="1.6" fill="' + c + '"/><rect x="41" y="55" width="10" height="1.6" rx=".8" fill="' + c + '"/><rect x="41" y="60" width="8" height="1.6" rx=".8" fill="' + c + '"/>');

  /* 6 – Skill Pulse (dark dashboard sidebar with rings) */
  add('p-pulse', 'Skill Pulse', 'pro', '#0ea5e9', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 112), c = v.color;
    return wrap(v, 'pulse', '<div class="rs-hd"><div>' + head(v) + '</div>' + p + '</div><div class="rs-cols"><div class="rs-mn">' +
      sec('Profile', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) + '</div><aside class="rs-sd">' +
      side('Contact', '<div class="rs-ct col">' + ct(v) + '</div>') + side('Skill Pulse', rings(v, lighten(c, .35), 'rgba(255,255,255,.16)')) + side('Languages', P.langList) + side('Personal', P.kv) + '</aside></div>');
  }, c => '<rect x="6" y="9" width="26" height="4" fill="#0f172a"/><rect x="6" y="16" width="16" height="2" fill="' + c + '"/><rect x="43" y="6" width="11" height="13" rx="3" fill="#cbd5e1"/><rect y="24" width="60" height="1.6" fill="' + c + '"/><rect x="40" y="25.6" width="20" height="54.4" fill="' + shade(c, .4) + '"/><circle cx="46" cy="36" r="3.4" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.4"/><circle cx="46" cy="36" r="3.4" fill="none" stroke="' + lighten(c, .4) + '" stroke-width="1.4" stroke-dasharray="14 22" transform="rotate(-90 46 36)"/><circle cx="55" cy="36" r="3.4" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.4"/><circle cx="55" cy="36" r="3.4" fill="none" stroke="' + lighten(c, .4) + '" stroke-width="1.4" stroke-dasharray="17 22" transform="rotate(-90 55 36)"/><circle cx="46" cy="47" r="3.4" fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="1.4"/><circle cx="46" cy="47" r="3.4" fill="none" stroke="' + lighten(c, .4) + '" stroke-width="1.4" stroke-dasharray="11 22" transform="rotate(-90 46 47)"/><rect x="6" y="32" width="14" height="2" fill="' + c + '"/><rect x="6" y="37" width="28" height="2" fill="#cbd5e1"/><rect x="6" y="42" width="24" height="2" fill="#cbd5e1"/><rect x="6" y="54" width="14" height="2" fill="' + c + '"/><rect x="6" y="59" width="28" height="2" fill="#cbd5e1"/>');

  /* 7 – Monogram Luxe */
  add('p-luxe', 'Monogram Luxe', 'pro', '#9a7b4f', SANS, SERIF, v => {
    const P = parts(v), p = pho(v, 110);
    const emb = p ? '<div class="rs-emb">' + p + '</div>' : '<div class="rs-emb"><div class="rs-mg">' + X(initials(v.name)) + '</div></div>';
    const sk = list(v.skills).length ? '<div class="rs-g3">' + levels(v).map(s => '<span>' + X(s.n) + '</span>').join('') + '</div>' : '';
    return wrap(v, 'luxe', '<div class="rs-frame"></div><div class="rs-in"><div class="rs-hd">' + emb + '<h1>' + X(v.name) + '</h1><div class="rs-sub">' + X(v.title) + '</div><div class="rs-orn"><i></i><em>◆</em><i></i></div><div class="rs-ct">' + ct(v) + '</div></div>' +
      sec('Profile', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Expertise', sk) + sec('Projects / Certifications', P.extra) + tail(v, P) + '</div>');
  }, c => '<rect width="60" height="80" fill="#fcfaf6"/><rect x="3" y="3" width="54" height="74" fill="none" stroke="' + c + '" stroke-width=".7"/><circle cx="30" cy="14" r="6.5" fill="none" stroke="' + c + '" stroke-width="1"/><text x="30" y="16.2" text-anchor="middle" font-size="5" fill="' + c + '" font-family="serif">AB</text><rect x="16" y="25" width="28" height="3" fill="#2b2b2b"/><rect x="22" y="31" width="16" height="1.6" fill="' + c + '"/><rect x="8" y="38" width="16" height=".8" fill="' + c + '"/><rect x="36" y="38" width="16" height=".8" fill="' + c + '"/><rect x="25" y="37" width="10" height="2" fill="' + c + '" opacity=".5"/><rect x="9" y="45" width="42" height="2" fill="#d6d0c4"/><rect x="9" y="50" width="34" height="2" fill="#d6d0c4"/><rect x="8" y="60" width="16" height=".8" fill="' + c + '"/><rect x="36" y="60" width="16" height=".8" fill="' + c + '"/><rect x="9" y="66" width="42" height="2" fill="#d6d0c4"/>');

  /* 8 – Tech Dark */
  add('p-tech', 'Tech Dark', 'pro', '#0891b2', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 112);
    const chips = list(v.skills).length ? '<div class="rs-tg">' + levels(v).map(s => '<span>' + X(s.n) + '</span>').join('') + '</div>' : '';
    const ts = (t, h) => h ? '<section class="rs-s"><h3><i>//</i> ' + t.toLowerCase() + '</h3>' + h + '</section>' : '';
    return wrap(v, 'tech', '<div class="rs-hd"><div class="rs-term"><i></i><i></i><i></i><span>~/resume</span></div><div class="rs-hr"><div>' + head(v).replace('rs-sub">', 'rs-sub"><s>&gt;</s> ') + '<div class="rs-ct">' + ct(v) + '</div></div>' + p + '</div></div><div class="rs-body">' +
      ts('Profile', P.summary) + ts('Experience', P.exp) + ts('Education', P.edu) + ts('Skills', chips) + ts('Projects / Certifications', P.extra) + ts('Languages', P.lang) + ts('Personal Details', P.kv) + ts('Declaration', P.decl) + '</div>');
  }, c => '<defs><radialGradient id="g8" cx=".85" cy="0" r=".8"><stop offset="0" stop-color="' + c + '" stop-opacity=".6"/><stop offset="1" stop-color="#0b1220" stop-opacity="0"/></radialGradient></defs><rect width="60" height="30" fill="#0b1220"/><rect width="60" height="30" fill="url(#g8)"/><circle cx="6" cy="5" r="1" fill="#f87171"/><circle cx="10" cy="5" r="1" fill="#fbbf24"/><circle cx="14" cy="5" r="1" fill="#4ade80"/><rect x="6" y="12" width="26" height="4" fill="#fff"/><rect x="6" y="19" width="18" height="2" fill="' + lighten(c, .35) + '"/><rect x="43" y="10" width="11" height="12" rx="2" fill="none" stroke="' + lighten(c, .35) + '"/><text x="6" y="40" font-size="3.4" font-family="monospace" fill="' + c + '">// experience</text><rect x="6" y="44" width="48" height="2" fill="#cbd5e1"/><rect x="6" y="49" width="38" height="2" fill="#cbd5e1"/><text x="6" y="60" font-size="3.4" font-family="monospace" fill="' + c + '">// skills</text><rect x="6" y="64" width="10" height="5" rx="2.5" fill="none" stroke="' + c + '" stroke-width=".6"/><rect x="19" y="64" width="12" height="5" rx="2.5" fill="none" stroke="' + c + '" stroke-width=".6"/><rect x="34" y="64" width="9" height="5" rx="2.5" fill="none" stroke="' + c + '" stroke-width=".6"/>');

  /* ================= PRO – Canva-style rich designs ================= */
  const labc = v => [['Mobile', v.phone], ['Email', v.email], ['Address', v.loc], ['Web', v.link]].filter(x => (x[1] || '').trim()).map(x => '<div class="rs-lb"><b>' + x[0] + ':</b> <span>' + X(x[1]) + '</span></div>').join('');

  /* 9 – Sage Arch */
  add('p-arch', 'Sage Arch', 'pro', '#5f8f72', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 138);
    return wrap(v, 'arch', '<div class="rs-hd"><div class="rs-blob"></div>' + (p ? '<div class="rs-ph2">' + p + '</div>' : '') + '<div class="rs-hi"><h1>' + X(v.name) + '</h1><div class="rs-sub">' + X(v.title) + '</div><div class="rs-ct">' + ct(v) + '</div></div></div><div class="rs-cols"><aside class="rs-sd"><div class="rs-arc">' +
      sec('Profile', P.summary) + sec('Skills', bars(v)) + sec('Languages', P.lang) + sec('Personal', P.kv) + '</div></aside><div class="rs-mn">' +
      sec('Education', P.edu) + sec('Experience', P.exp) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) + '</div></div>');
  }, c => '<circle cx="14" cy="16" r="15" fill="' + tint(c, .2) + '"/><circle cx="14" cy="16" r="8" fill="#fff" stroke="' + c + '" stroke-width="1"/><rect x="28" y="9" width="26" height="4" fill="#1f2937"/><rect x="28" y="16" width="16" height="2" fill="' + c + '"/><rect x="28" y="21" width="26" height="1" fill="#1f2937"/><path d="M4 80V50Q4 38 17 38Q30 38 30 50V80Z" fill="' + tint(c, .22) + '"/><rect x="8" y="46" width="16" height="2.4" fill="#1f2937"/><rect x="8" y="52" width="18" height="2" fill="#cbd5e1"/><rect x="8" y="57" width="14" height="2" fill="#cbd5e1"/><rect x="36" y="36" width="18" height="2.6" fill="#1f2937"/><rect x="36" y="42" width="1" height="12" fill="#1f2937"/><rect x="40" y="42" width="14" height="2" fill="#cbd5e1"/><rect x="40" y="47" width="12" height="2" fill="#cbd5e1"/><rect x="36" y="60" width="18" height="2.6" fill="#1f2937"/><rect x="40" y="66" width="14" height="2" fill="#cbd5e1"/>');

  /* 10 – Navy Panel */
  add('p-panel', 'Navy Panel', 'pro', '#1d6fd8', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 142), np = nameParts(v.name), c = v.color;
    const pf = (t, h) => h ? '<h4>' + t + '</h4>' + h : '';
    return wrap(v, 'panel', '<aside class="rs-sb"><div class="rs-card2" style="background:' + lighten(c, .9) + '">' + (p ? '<div class="rs-pf">' + p + '</div>' : '') +
      pf('Contact', '<div class="rs-ct col">' + ct(v) + '</div>') + pf('Education', P.edu) + pf('Skills', bars(v)) + pf('Languages', P.langList) + pf('Personal', P.kv) + '</div></aside><div class="rs-mn"><h1><span>' + X(np[0]) + '</span> ' + X(np[1]) + '</h1><div class="rs-sub">' + X(v.title) + '</div>' + (P.summary ? '<div class="rs-sm">' + P.summary + '</div>' : '') + '<div class="rs-dot"></div>' +
      sec('Experience', P.exp) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) + '</div>');
  }, c => '<rect width="22" height="80" fill="' + shade(c, .42) + '"/><rect x="3" y="24" width="17" height="52" rx="3" fill="' + lighten(c, .9) + '"/><circle cx="11.5" cy="22" r="8" fill="#fff"/><circle cx="11.5" cy="22" r="6.4" fill="#cbd5e1"/><rect x="5" y="36" width="12" height="3.4" fill="' + c + '"/><rect x="5" y="44" width="12" height="1.4" fill="' + c + '"/><rect x="5" y="50" width="12" height="1.4" fill="' + c + '"/><rect x="28" y="9" width="12" height="4" fill="' + c + '"/><rect x="41" y="9" width="14" height="4" fill="#1e293b"/><rect x="28" y="16" width="16" height="2" fill="#475569"/><rect x="28" y="24" width="27" height="1" fill="' + c + '" opacity=".5"/><rect x="28" y="30" width="14" height="4" fill="' + c + '"/><rect x="28" y="38" width="20" height="3.4" rx="1.7" fill="' + tint(c, .15) + '"/><rect x="28" y="45" width="26" height="2" fill="#cbd5e1"/><rect x="28" y="52" width="14" height="4" fill="' + c + '"/><rect x="28" y="60" width="26" height="2" fill="#cbd5e1"/>');

  /* 11 – Cocoa Hero */
  add('p-cocoa', 'Cocoa Hero', 'pro', '#8a6347', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 250);
    const lb = (t, h) => h ? '<h4>' + t + '</h4>' + h : '';
    return wrap(v, 'cocoa', '<div class="rs-hd"><div class="rs-hl">' + head(v) + (P.summary ? '<div class="rs-sm">' + P.summary + '</div>' : '') + '</div>' + (p ? '<div class="rs-hr">' + p + '</div>' : '') + '</div><div class="rs-cols"><aside class="rs-sd">' +
      lb('Contact', '<div class="rs-ct col">' + ct(v) + '</div>') + lb('Skills', dots(v)) + lb('Languages', P.langList) + lb('Personal', P.kv) + '</aside><div class="rs-mn">' +
      sec('Experience', P.exp) + sec('Education', P.edu) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) + '</div></div>');
  }, c => '<rect width="60" height="30" fill="' + shade(c, .7) + '"/><rect x="42" width="18" height="30" fill="#cbd5e1"/><circle cx="51" cy="12" r="4" fill="#94a3b8"/><rect x="6" y="9" width="26" height="4" fill="#fff"/><rect x="6" y="16" width="16" height="2" fill="' + lighten(c, .5) + '"/><rect x="6" y="22" width="30" height="1.4" fill="#fff" opacity=".6"/><rect y="30" width="24" height="50" fill="' + tint(c, .12) + '"/><rect x="3" y="36" width="18" height="4" fill="' + c + '"/><rect x="3" y="44" width="15" height="1.6" fill="#94a3b8"/><rect x="3" y="49" width="13" height="1.6" fill="#94a3b8"/><rect x="3" y="56" width="18" height="4" fill="' + c + '"/><rect x="29" y="36" width="26" height="3" fill="#1f2937"/><rect x="29" y="42" width="26" height="2" fill="#cbd5e1"/><rect x="29" y="47" width="22" height="2" fill="#cbd5e1"/><rect x="29" y="58" width="26" height="3" fill="#1f2937"/>');

  /* 12 – Olive Band */
  add('p-olive', 'Olive Band', 'pro', '#4d6b4a', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 150);
    return wrap(v, 'olive', '<div class="rs-hd"><div class="rs-hlc">' + (p ? '<div class="rs-ringp">' + p + '</div>' : '') + '</div><div class="rs-hr"><h1>' + X(v.name) + '</h1><div class="rs-sub">' + X(v.title) + '</div>' + (P.summary ? '<div class="rs-sm">' + P.summary + '</div>' : '') + '</div></div><div class="rs-cols"><aside class="rs-sd">' +
      sec('Contact', '<div class="rs-ct col">' + ct(v) + '</div>') + sec('Skills', bars(v)) + sec('Languages', P.lang) + sec('Personal', P.kv) + '</aside><div class="rs-mn">' +
      sec('Work Experience', P.exp) + sec('Education', P.edu) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) + '</div></div>');
  }, c => '<rect width="60" height="26" fill="' + c + '"/><rect y="26" width="22" height="54" fill="' + tint(c, .1) + '"/><circle cx="11" cy="24" r="9" fill="#fff"/><circle cx="11" cy="24" r="7.4" fill="#cbd5e1"/><rect x="27" y="8" width="26" height="4" fill="#fff"/><rect x="27" y="15" width="16" height="2" fill="#fff" opacity=".75"/><rect x="4" y="42" width="14" height="2" fill="' + c + '"/><rect x="4" y="48" width="14" height="1.6" rx=".8" fill="' + c + '"/><rect x="4" y="53" width="11" height="1.6" rx=".8" fill="' + c + '"/><rect x="26" y="33" width="30" height="4.4" fill="' + c + '"/><rect x="26" y="41" width="30" height="2" fill="#cbd5e1"/><rect x="26" y="46" width="24" height="2" fill="#cbd5e1"/><rect x="26" y="57" width="30" height="4.4" fill="' + c + '"/>');

  /* 13 – Label Classic */
  add('p-label', 'Label Classic', 'pro', '#111827', SANS, SANS, v => {
    const P = parts(v), p = pho(v, 128);
    const row = (t, h) => h ? '<section class="rs-row"><h3>' + t + '</h3><div>' + h + '</div></section>' : '';
    return wrap(v, 'label', '<div class="rs-hd">' + p + '<div class="rs-hi"><h1>' + X(v.name) + '</h1><div class="rs-sub">' + X(v.title) + '</div><div class="rs-lbg">' + labc(v) + '</div></div></div>' +
      row('Summary', P.summary) + row('Experience', P.exp) + row('Education', P.edu) + row('Skills', P.chips) + row('Projects', P.extra) + row('Languages', P.lang) + row('Personal', P.kv) + row('Declaration', P.decl));
  }, c => '<rect x="6" y="7" width="16" height="18" rx="2" fill="#cbd5e1"/><rect x="27" y="8" width="26" height="5" fill="#111"/><rect x="27" y="16" width="16" height="2" fill="' + c + '"/><rect x="27" y="21" width="12" height="1.4" fill="#94a3b8"/><rect x="42" y="21" width="12" height="1.4" fill="#94a3b8"/><rect x="6" y="30" width="48" height="1.4" fill="#111"/><rect x="6" y="35" width="11" height="2" fill="#111"/><rect x="22" y="35" width="32" height="2" fill="#cbd5e1"/><rect x="22" y="40" width="26" height="2" fill="#cbd5e1"/><rect x="6" y="48" width="48" height=".7" fill="#111"/><rect x="6" y="53" width="11" height="2" fill="#111"/><rect x="22" y="53" width="32" height="2" fill="#cbd5e1"/><rect x="6" y="66" width="48" height=".7" fill="#111"/>');

  /* ================= CSS ================= */
  const css = `
.rs-sk{margin:0 0 10px}.rs-skt{display:flex;justify-content:space-between;font-size:12px;font-weight:500;margin-bottom:4px}.rs-skt i{font-style:normal;opacity:.7;font-size:11px}
.rs-trk{height:5px;border-radius:9px;background:var(--rt)}.rs-trk b{display:block;height:100%;border-radius:9px;background:var(--rc)}
.rs-sn{font-size:12.5px;margin:0 0 7px;display:flex;gap:8px;align-items:center}.rs-sn::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--rc);flex:none}
.rs-dl{list-style:none;padding:0!important;margin:0}.rs-dl li{display:flex;gap:9px;align-items:center;margin:0 0 6px;font-size:12.5px}.rs-dl li::before{content:"";width:6px;height:6px;background:var(--rc);transform:rotate(45deg);flex:none}
.rs-mono{background:var(--rc);color:#fff;display:grid;place-items:center;font-weight:700;letter-spacing:2px}
.rs-cen{text-align:center}
.rs-orn{display:flex;align-items:center;justify-content:center;gap:12px;margin:12px auto 2px;width:230px;color:var(--rc)}.rs-orn i{flex:1;border-top:1px solid var(--rc)}.rs-orn em{font-style:normal;font-size:9px}
/* ---- bold ---- */
.t-bold .rs-hd{display:flex;align-items:stretch;border-bottom:6px solid var(--rd)}.t-bold .rs-hl{flex:1;background:var(--rc);color:#fff;padding:38px 40px}
.t-bold .rs-hl h1,.t-bold .rs-hl .rs-sub,.t-bold .rs-hl .rs-ct{color:#fff}.t-bold h1{font-size:34px;font-weight:800;letter-spacing:.5px}.t-bold .rs-sub{opacity:.92;letter-spacing:2px;text-transform:uppercase;font-size:13px;font-weight:600}
.t-bold .rs-hr{background:var(--rd);display:grid;place-items:center;padding:0 34px}.t-bold .rs-img{border:4px solid rgba(255,255,255,.75)}
.t-bold .rs-body{padding:10px 44px 40px}.t-bold .rs-s h3{display:table;background:var(--rc);color:#fff;padding:4px 16px;border-radius:99px;font-size:11.5px;letter-spacing:1.6px;margin-bottom:11px}
/* ---- gradient ---- */
.t-gradient .rs-hd{position:relative;overflow:hidden;display:flex;justify-content:space-between;align-items:center;gap:20px;background:linear-gradient(135deg,var(--rx),var(--rc));border-radius:0 0 42px 42px;padding:40px 46px 46px;color:#fff}
.t-gradient .rs-hd::before{content:"";position:absolute;right:-60px;top:-80px;width:240px;height:240px;border-radius:50%;background:rgba(255,255,255,.09)}
.t-gradient .rs-hd::after{content:"";position:absolute;left:36%;bottom:-90px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.07)}
.t-gradient .rs-hd>*{position:relative;z-index:1}.t-gradient h1,.t-gradient .rs-sub,.t-gradient .rs-ct{color:#fff}.t-gradient h1{font-size:33px}.t-gradient .rs-sub{opacity:.92}
.t-gradient .rs-img{border:5px solid rgba(255,255,255,.7)}.t-gradient .rs-body{padding:8px 34px 36px}
.t-gradient .rs-s{background:#f8fafc;border:1px solid #e6ebf2;border-radius:14px;padding:14px 20px 11px;margin-top:14px}
.t-gradient .rs-s h3{display:flex;align-items:center;gap:9px}.t-gradient .rs-s h3::before{content:"";width:9px;height:9px;border-radius:50%;background:var(--rc)}
.t-gradient .rs-chip{background:#fff;border:1px solid var(--rt)}
/* ---- elegant ---- */
.t-elegant{padding:46px 58px;background:#fff}.t-elegant .rs-hd{text-align:center;padding-bottom:6px}.t-elegant .rs-pw{display:flex;justify-content:center;margin-bottom:12px}
.t-elegant h1{font-family:var(--rh);font-size:34px;font-weight:700;letter-spacing:5px;text-transform:uppercase;color:#1c1917}.t-elegant .rs-sub{font-style:italic;letter-spacing:1.5px;font-size:15px}
.t-elegant .rs-ct{justify-content:center}.t-elegant .rs-s{margin-top:20px}
.t-elegant .rs-s h3{font-family:var(--rh);text-align:center;font-size:13px;letter-spacing:3px;color:#1c1917}.t-elegant .rs-s h3::after{content:"";display:block;width:38px;height:2px;background:var(--rc);margin:7px auto 0}
.t-elegant .rs-jh b{font-family:var(--rh)}.t-elegant .rs-chip{display:none}
/* ---- profile ---- */
.t-profile{padding:34px}.t-profile .rs-card{display:flex;gap:26px;align-items:center;background:var(--rt);border-radius:22px;padding:26px 30px}
.t-profile h1{font-size:31px}.t-profile .rs-img{border:5px solid #fff;box-shadow:0 4px 14px rgba(15,23,42,.15)}
.t-profile .rs-cols{display:grid;grid-template-columns:1fr 236px;gap:30px;margin-top:6px}.t-profile .rs-sd .rs-s{border-top:3px solid var(--rc);padding-top:10px;margin-top:20px}
.t-profile .rs-sd .rs-jh{flex-direction:column;gap:0}.t-profile .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}
/* ---- fresher ---- */
.t-fresher .rs-top{height:12px;background:linear-gradient(90deg,var(--rc),var(--rd))}.t-fresher .rs-hd{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:30px 46px 16px;border-bottom:1px solid #e2e8f0}
.t-fresher .rs-body{padding:6px 46px 40px}.t-fresher .rs-s h3{display:flex;align-items:center;gap:9px;font-size:13px;color:#0f172a}.t-fresher .rs-s h3::before{content:"";width:11px;height:11px;border-radius:3px;background:var(--rc)}
.t-fresher .rs-ck{list-style:none;padding:0!important;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:5px 20px}.t-fresher .rs-ck li{margin:0;font-size:12.5px;display:flex;gap:8px}.t-fresher .rs-ck li::before{content:"✓";color:var(--rc);font-weight:700}
/* ---- PRO: aurora ---- */
.t-aurora{display:grid;grid-template-columns:272px 1fr}.t-aurora .rs-sb{background:linear-gradient(170deg,var(--rx),var(--rd));color:#fff;padding:40px 24px}
.t-aurora .rs-pw{display:flex;justify-content:center;margin-bottom:24px}.t-aurora .rs-ring{padding:5px;border-radius:50%;background:linear-gradient(135deg,#fff,var(--rl))}.t-aurora .rs-img{border:4px solid var(--rx)}
.t-aurora h4{font-size:12px;letter-spacing:2.2px;text-transform:uppercase;margin:26px 0 12px;display:flex;align-items:center;gap:10px}.t-aurora h4::after{content:"";flex:1;height:1px;background:rgba(255,255,255,.3)}
.t-aurora .rs-ct{color:#fff;font-size:12px}.t-aurora .rs-c svg{width:26px;height:26px;padding:6px;border-radius:50%;background:rgba(255,255,255,.15)}.t-aurora .rs-c{gap:9px}
.t-aurora .rs-trk{background:rgba(255,255,255,.2)}.t-aurora .rs-trk b{background:linear-gradient(90deg,#fff,var(--rl))}.t-aurora .rs-sn::before{background:var(--rl)}.t-aurora .rs-sl li{opacity:.95}
.t-aurora .rs-kv{flex-direction:column;gap:0;margin-bottom:7px}.t-aurora .rs-kv span{color:rgba(255,255,255,.7);min-width:0}
.t-aurora .rs-mn{padding:42px 38px}.t-aurora .rs-mn h1{font-size:35px;font-weight:800;letter-spacing:-.3px}.t-aurora .rs-sub{font-size:14.5px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:var(--rc)}
.t-aurora .rs-s h3{display:flex;align-items:center;gap:12px;color:var(--rx);letter-spacing:1.8px}.t-aurora .rs-s h3::after{content:"";flex:1;height:2px;background:linear-gradient(90deg,var(--rc),transparent)}
/* ---- PRO: gold ---- */
.t-gold .rs-hd{display:flex;justify-content:space-between;align-items:center;gap:20px;background:#15171c;padding:40px 48px 36px;border-bottom:6px solid var(--rc)}
.t-gold .rs-hl h1{font-family:var(--rh);color:#fff;font-size:31px;letter-spacing:4px;text-transform:uppercase;font-weight:700}.t-gold .rs-sub{color:var(--rc);letter-spacing:3.5px;text-transform:uppercase;font-size:12.5px;font-weight:600;margin-top:8px}
.t-gold .rs-gl{width:60px;height:2px;background:var(--rc);margin:14px 0 2px}.t-gold .rs-ct{color:#cbd5e1}
.t-gold .rs-fr{padding:5px;border:2px solid var(--rc)}.t-gold .rs-img{display:block;border-radius:0!important}
.t-gold .rs-cols{display:grid;grid-template-columns:1fr 246px;min-height:900px}.t-gold .rs-mn{padding:10px 32px 38px 48px}.t-gold .rs-sd{background:#faf7f0;border-left:1px solid #e6dcc4;padding:10px 30px 38px 26px}
.t-gold .rs-s h3{font-family:var(--rh);font-size:13.5px;letter-spacing:2.2px;color:#15171c}.t-gold .rs-s h3::after{content:"";display:block;width:34px;height:2px;background:var(--rc);margin-top:6px}
.t-gold .rs-sd .rs-jh{flex-direction:column;gap:0}.t-gold .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}
/* ---- PRO: split ---- */
.t-split{display:grid;grid-template-columns:276px 1fr}.t-split .rs-sb{background:var(--rt);padding:30px 22px 36px}
.t-split .rs-pw{margin-bottom:22px}.t-split .rs-img{width:232px!important;height:232px!important;border-radius:26px;object-fit:cover}.t-split .rs-mono{font-size:64px}
.t-split h4{font-size:12px;letter-spacing:2px;text-transform:uppercase;color:var(--rd);margin:22px 0 10px;font-weight:700}
.t-split .rs-ct{color:#334155}.t-split .rs-c svg{color:var(--rc)}.t-split .rs-kv{flex-direction:column;gap:0;margin-bottom:7px}.t-split .rs-kv span{min-width:0}
.t-split .rs-trk{background:#fff}.t-split .rs-mn{padding:44px 40px 40px 36px}
.t-split h1{font-size:40px;font-weight:700;letter-spacing:-.5px;line-height:1.05}.t-split h1 span{font-weight:300}.t-split .rs-sub{letter-spacing:3.5px;text-transform:uppercase;font-size:12.5px;font-weight:600;color:var(--rc);margin-top:9px}
.t-split .rs-s{margin-top:22px}.t-split .rs-s h3{display:flex;align-items:baseline;gap:10px;color:#0f172a;font-size:13px;letter-spacing:1.8px;padding-bottom:6px;border-bottom:1px solid #e2e8f0}.t-split .rs-s h3 em{font-style:normal;color:var(--rc);font-size:14px}
/* ---- PRO: path ---- */
.t-path .rs-hd{position:relative;display:flex;justify-content:space-between;align-items:center;gap:20px;padding:42px 46px 34px;min-height:210px;overflow:hidden}
.t-path .rs-deco{position:absolute;right:0;top:0;width:330px;height:210px}.t-path .rs-hl,.t-path .rs-hp{position:relative;z-index:1}.t-path h1{font-size:36px;font-weight:800;letter-spacing:-.4px}.t-path .rs-sub{font-weight:600;text-transform:uppercase;letter-spacing:2.5px;font-size:13px;color:var(--rc)}
.t-path .rs-hp .rs-img{border:5px solid #fff;box-shadow:0 6px 18px rgba(15,23,42,.25)}
.t-path .rs-strip{display:flex;flex-wrap:wrap;gap:6px 22px;background:var(--rt);padding:11px 46px;font-size:12px;color:#334155}.t-path .rs-strip .rs-c svg{color:var(--rc)}
.t-path .rs-body{padding:6px 46px 40px}.t-path .rs-s h3{display:table;background:var(--rc);color:#fff;padding:3px 14px;border-radius:6px;font-size:11.5px;letter-spacing:1.6px}
.t-path .rs-s h3+.rs-tl{margin-top:4px}.t-path .rs-tl{display:grid;grid-template-columns:118px 1fr;margin:0}.t-path .rs-tld{text-align:right;padding:2px 22px 0 0;font-size:11.5px;font-weight:600;color:var(--rc)}
.t-path .rs-tlc{position:relative;border-left:2px solid var(--rt);padding:0 0 14px 22px}.t-path .rs-tlc::before{content:"";position:absolute;left:-7px;top:3px;width:12px;height:12px;border-radius:50%;background:#fff;border:3px solid var(--rc)}
.t-path .rs-chip{background:#fff;border:1.5px solid var(--rc);color:var(--rd)}
/* ---- PRO: diagonal ---- */
.t-diagonal .rs-hd{position:relative;height:262px}.t-diagonal .rs-bgsvg{position:absolute;left:0;top:0;width:100%;height:100%}
.t-diagonal .rs-hc{position:relative;display:flex;align-items:center;gap:26px;padding:36px 46px 0}.t-diagonal h1,.t-diagonal .rs-sub{color:#fff}.t-diagonal h1{font-size:37px;font-weight:800}.t-diagonal .rs-sub{font-size:15px;opacity:.95;letter-spacing:1px}
.t-diagonal .rs-hpw .rs-img{border:6px solid #fff;box-shadow:0 8px 22px rgba(0,0,0,.28)}
.t-diagonal .rs-strip{display:flex;flex-wrap:wrap;gap:8px 22px;padding:8px 46px 0;font-size:12px}.t-diagonal .rs-c svg{width:26px;height:26px;padding:6px;border-radius:50%;background:var(--rt);color:var(--rd)}.t-diagonal .rs-c{gap:8px}
.t-diagonal .rs-cols{display:grid;grid-template-columns:1fr 238px;gap:28px;padding:0 40px 40px 46px}
.t-diagonal .rs-sd{background:var(--rt);border-radius:18px;padding:6px 20px 20px;margin-top:17px;align-self:start}.t-diagonal .rs-sd .rs-jh{flex-direction:column;gap:0}.t-diagonal .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}
.t-diagonal .rs-s h3{color:var(--rd)}.t-diagonal .rs-mn .rs-s h3{display:flex;align-items:center;gap:10px}.t-diagonal .rs-mn .rs-s h3::before{content:"";width:22px;height:4px;border-radius:3px;background:var(--rc)}
.t-diagonal .rs-trk{background:#fff}
/* ---- PRO: pulse ---- */
.t-pulse .rs-hd{display:flex;justify-content:space-between;align-items:center;gap:20px;padding:38px 46px 24px;border-bottom:4px solid var(--rc)}.t-pulse h1{font-size:36px;font-weight:800;letter-spacing:-.4px}.t-pulse .rs-sub{font-weight:600;color:var(--rc);text-transform:uppercase;letter-spacing:2.5px;font-size:13px}
.t-pulse .rs-img{border:4px solid var(--rt)}
.t-pulse .rs-cols{display:grid;grid-template-columns:1fr 262px;min-height:940px}.t-pulse .rs-mn{padding:8px 34px 38px 46px}
.t-pulse .rs-sd{background:linear-gradient(180deg,var(--rx),var(--rd));color:#fff;padding:28px 24px 36px}
.t-pulse h4{font-size:12px;letter-spacing:2px;text-transform:uppercase;margin:24px 0 12px;padding-bottom:6px;border-bottom:1px solid rgba(255,255,255,.28)}.t-pulse .rs-sd h4:first-child{margin-top:0}
.t-pulse .rs-ct{color:#fff;font-size:12px}.t-pulse .rs-kv{flex-direction:column;gap:0;margin-bottom:7px}.t-pulse .rs-kv span{color:rgba(255,255,255,.7);min-width:0}
.t-pulse .rs-rg{display:grid;grid-template-columns:1fr 1fr;gap:14px 8px}.t-pulse .rs-ri{display:flex;flex-direction:column;align-items:center;text-align:center;gap:5px;font-size:11px;line-height:1.25}
.t-pulse .rs-rc{position:relative;width:62px;height:62px}.t-pulse .rs-rc svg{width:62px;height:62px;display:block}.t-pulse .rs-rc b{position:absolute;left:0;top:0;width:62px;height:62px;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700}
.t-pulse .rs-rn{grid-column:1/-1;font-size:12.5px}.t-pulse .rs-sl li{margin-bottom:5px}
.t-pulse .rs-s h3{display:flex;align-items:center;gap:10px;color:var(--rx)}.t-pulse .rs-s h3::before{content:"";width:8px;height:8px;border-radius:2px;background:var(--rc);transform:rotate(45deg)}
/* ---- PRO: luxe ---- */
.t-luxe{background:#fcfaf6;color:#2b2622}.t-luxe .rs-frame{position:absolute;left:16px;top:16px;right:16px;bottom:16px;border:1px solid var(--rc);pointer-events:none}.t-luxe .rs-frame::after{content:"";position:absolute;left:5px;top:5px;right:5px;bottom:5px;border:1px solid var(--rt)}
.t-luxe .rs-in{padding:50px 62px 46px}.t-luxe .rs-hd{text-align:center}.t-luxe .rs-emb{display:flex;justify-content:center;margin-bottom:14px}.t-luxe .rs-emb .rs-img{border:2px solid var(--rc);padding:4px;background:#fcfaf6}
.t-luxe .rs-mg{width:92px;height:92px;border-radius:50%;border:1.5px solid var(--rc);display:grid;place-items:center;font-family:var(--rh);font-size:34px;color:var(--rc);letter-spacing:3px;box-shadow:0 0 0 5px #fcfaf6,0 0 0 6px var(--rt)}
.t-luxe h1{font-family:var(--rh);font-size:34px;font-weight:600;letter-spacing:7px;text-transform:uppercase;color:#2b2622}.t-luxe .rs-sub{font-family:var(--rh);font-style:italic;letter-spacing:2.5px;font-size:15px;color:var(--rc)}.t-luxe .rs-ct{justify-content:center;color:#5a5249}
.t-luxe .rs-s{margin-top:22px}.t-luxe .rs-s h3{display:flex;align-items:center;gap:14px;font-family:var(--rh);font-style:italic;text-transform:none;letter-spacing:1.5px;font-size:16px;font-weight:500;color:#2b2622}
.t-luxe .rs-s h3::before,.t-luxe .rs-s h3::after{content:"";flex:1;border-top:1px solid var(--rc);opacity:.6}.t-luxe .rs-jh b{font-family:var(--rh);font-size:14px}
.t-luxe .rs-g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:6px 18px}.t-luxe .rs-g3 span{font-size:12.5px;display:flex;gap:8px;align-items:center}.t-luxe .rs-g3 span::before{content:"◆";color:var(--rc);font-size:7px}
/* ---- PRO: arch ---- */
.t-arch .rs-hd{position:relative;display:flex;align-items:center;gap:28px;padding:38px 44px 18px}.t-arch .rs-blob{position:absolute;left:-40px;top:-60px;width:270px;height:270px;border-radius:50%;background:var(--rt)}
.t-arch .rs-ph2,.t-arch .rs-hi{position:relative}.t-arch .rs-img{border:5px solid #fff;box-shadow:0 0 0 2px var(--rc)}
.t-arch h1{font-size:33px;font-weight:800;letter-spacing:1px;text-transform:uppercase;color:#1f2937}.t-arch .rs-sub{letter-spacing:3px;text-transform:uppercase;font-size:12.5px;color:var(--rd);font-weight:500;padding-bottom:7px;border-bottom:2px solid #1f2937;margin-bottom:2px}
.t-arch .rs-ct{display:grid;grid-template-columns:1fr 1fr;gap:5px 16px;margin-top:8px;font-size:11.5px}
.t-arch .rs-cols{display:grid;grid-template-columns:292px 1fr;gap:0;min-height:800px}.t-arch .rs-sd{padding:0 0 0 0}
.t-arch .rs-arc{background:var(--rt);border-radius:146px 146px 0 0;padding:70px 26px 30px 34px;min-height:800px;margin-left:26px}
.t-arch .rs-mn{padding:6px 40px 36px 34px}.t-arch .rs-s h3{font-size:18px;letter-spacing:.8px;color:#1f2937;margin-bottom:9px}
.t-arch .rs-mn .rs-s>:not(h3){border-left:2px solid #1f2937;padding-left:14px}.t-arch .rs-mn .rs-s .rs-job{margin-bottom:11px}
.t-arch .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}.t-arch .rs-trk{background:#fff}
/* ---- PRO: panel ---- */
.t-panel{display:grid;grid-template-columns:276px 1fr}.t-panel .rs-sb{background:var(--rx);padding:0 0 0 22px;position:relative}
.t-panel .rs-card2{margin:150px 0 30px;border-radius:18px 0 0 18px;padding:84px 20px 26px 20px;position:relative;color:#1e293b;min-height:760px}
.t-panel .rs-pf{position:absolute;left:50%;top:-72px;margin-left:-76px;border-radius:50%;background:#fff;padding:5px;box-shadow:0 4px 14px rgba(0,0,0,.3)}.t-panel .rs-pf .rs-img{display:block}
.t-panel h4{display:table;background:var(--rc);color:#fff;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;padding:4px 14px;margin:16px 0 10px;font-weight:700}.t-panel .rs-card2 h4:first-of-type{margin-top:0}
.t-panel .rs-ct{color:#1e293b;font-size:11.5px}.t-panel .rs-c svg{width:20px;height:20px;padding:4px;border-radius:50%;background:var(--rc);color:#fff;stroke:#fff}.t-panel .rs-c{gap:8px}
.t-panel .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}.t-panel .rs-card2 .rs-jh{flex-direction:column;gap:0}.t-panel .rs-trk{background:var(--rt)}
.t-panel .rs-mn{padding:46px 40px 40px 34px}.t-panel h1{font-size:36px;font-weight:800;color:#1e293b;letter-spacing:-.3px}.t-panel h1 span{color:var(--rc)}.t-panel .rs-sub{font-size:16px;color:#1e293b;font-weight:500;margin:2px 0 10px}
.t-panel .rs-sm{font-size:12.5px;color:#475569}.t-panel .rs-dot{border-top:2px dotted var(--rc);opacity:.6;margin:16px 0 4px}
.t-panel .rs-s h3{display:table;background:var(--rc);color:#fff;font-size:12.5px;padding:5px 16px;letter-spacing:1.4px;margin-bottom:12px}
.t-panel .rs-mn .rs-jh b{background:var(--rt);color:var(--rd);padding:3px 14px;border-radius:99px;display:inline-block}
.t-panel .rs-mn ul{list-style:none;padding-left:4px}.t-panel .rs-mn li{position:relative;padding-left:16px}.t-panel .rs-mn li::before{content:"";position:absolute;left:0;top:7px;width:7px;height:7px;border-radius:50%;background:var(--rc)}
/* ---- PRO: cocoa ---- */
.t-cocoa .rs-hd{display:flex;align-items:stretch;background:var(--rd);color:#fff}.t-cocoa .rs-hl{flex:1;padding:42px 36px 30px 44px}.t-cocoa h1{color:#fff;font-size:35px;font-weight:800;text-transform:uppercase;letter-spacing:2px}.t-cocoa .rs-sub{color:var(--rl);letter-spacing:4px;text-transform:uppercase;font-size:12.5px;font-weight:500}
.t-cocoa .rs-sm{margin-top:14px;font-size:12px;opacity:.92;line-height:1.6}.t-cocoa .rs-hr .rs-img{border-radius:0!important;display:block}
.t-cocoa .rs-cols{display:grid;grid-template-columns:262px 1fr;min-height:870px}.t-cocoa .rs-sd{background:var(--rt);padding:24px 0 30px}
.t-cocoa h4{background:var(--rc);color:#fff;padding:5px 22px;font-size:12.5px;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px;font-weight:600}.t-cocoa .rs-sd h4:not(:first-child){margin-top:22px}
.t-cocoa .rs-sd>:not(h4){margin-left:22px;margin-right:18px}.t-cocoa .rs-ct{color:#44403c;font-size:11.5px}.t-cocoa .rs-c svg{color:var(--rc)}.t-cocoa .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}
.t-cocoa .rs-mn{padding:12px 36px 38px 34px}.t-cocoa .rs-s h3{font-size:14px;color:#1c1917;letter-spacing:2px;padding-bottom:5px;border-bottom:2px solid var(--rc);margin-bottom:10px}
/* ---- PRO: olive ---- */
.t-olive .rs-hd{display:flex;background:var(--rc);color:#fff;min-height:196px}.t-olive .rs-hlc{width:276px;flex:none;display:flex;justify-content:center;align-items:flex-start;padding-top:40px;position:relative;z-index:2}
.t-olive .rs-ringp{margin-bottom:-90px;border-radius:50%;background:#fff;padding:6px;box-shadow:0 0 0 3px var(--rl)}.t-olive .rs-ringp .rs-img{display:block}
.t-olive .rs-hr{flex:1;padding:44px 40px 26px 8px}.t-olive h1{color:#fff;font-size:33px;font-weight:800;letter-spacing:2px;text-transform:uppercase}.t-olive .rs-sub{color:var(--rl);letter-spacing:3.5px;text-transform:uppercase;font-size:12.5px;font-weight:500}
.t-olive .rs-sm{margin-top:12px;font-size:12px;opacity:.92;line-height:1.6}
.t-olive .rs-cols{display:grid;grid-template-columns:276px 1fr;min-height:900px}.t-olive .rs-sd{background:var(--rt);padding:96px 24px 30px}.t-olive .rs-sd .rs-s:first-child{margin-top:0}
.t-olive .rs-sd .rs-s h3{color:#fff;background:var(--rc);padding:4px 12px;font-size:12px}.t-olive .rs-ct{color:#292524;font-size:11.5px}.t-olive .rs-c svg{color:var(--rc)}.t-olive .rs-kv{flex-direction:column;gap:0;margin-bottom:6px}.t-olive .rs-trk{background:#fff}
.t-olive .rs-mn{padding:18px 38px 38px 34px}.t-olive .rs-mn .rs-s h3{background:var(--rc);color:#fff;padding:5px 14px;letter-spacing:2.2px;font-size:12.5px;margin-bottom:11px}
/* ---- PRO: label ---- */
.t-label{padding:44px 48px}.t-label .rs-hd{display:flex;gap:26px;align-items:center;padding-bottom:18px;border-bottom:3px solid var(--rc)}.t-label .rs-img{border-radius:6px!important}
.t-label h1{font-size:42px;font-weight:800;letter-spacing:-.8px;color:#111827;line-height:1}.t-label .rs-sub{font-size:15px;font-weight:500;color:#374151;margin:6px 0 12px}
.t-label .rs-lbg{display:grid;grid-template-columns:1fr 1fr;gap:3px 22px;font-size:11.5px}.t-label .rs-lb b{font-weight:700;text-transform:uppercase;font-size:10.5px;letter-spacing:.8px}
.t-label .rs-row{display:grid;grid-template-columns:118px 1fr;gap:20px;padding:15px 0;border-bottom:1px solid #d1d5db;page-break-inside:avoid}.t-label .rs-row h3{font-size:11.5px;text-transform:uppercase;letter-spacing:1.8px;color:var(--rc);font-weight:800;padding-top:2px}
.t-label .rs-chip{background:#f3f4f6;color:#111827;border-radius:4px}
/* ---- PRO: tech ---- */
.t-tech{font-family:var(--rf)}.t-tech .rs-hd{background:radial-gradient(circle at 88% 0%,var(--rd) 0%,rgba(11,18,32,0) 58%),#0b1220;color:#e2e8f0;padding:20px 46px 34px}
.t-tech .rs-term{display:flex;align-items:center;gap:7px;margin-bottom:22px}.t-tech .rs-term i{width:10px;height:10px;border-radius:50%;background:#f87171}.t-tech .rs-term i:nth-child(2){background:#fbbf24}.t-tech .rs-term i:nth-child(3){background:#4ade80}.t-tech .rs-term span{font-family:${MONO};font-size:11px;color:#64748b;margin-left:8px}
.t-tech .rs-hr{display:flex;justify-content:space-between;align-items:center;gap:20px}.t-tech h1{color:#fff;font-size:38px;font-weight:800;letter-spacing:-.8px}.t-tech .rs-sub{font-family:${MONO};color:var(--rl);font-size:14px;font-weight:500}.t-tech .rs-sub s{text-decoration:none;opacity:.6}
.t-tech .rs-ct{color:#cbd5e1}.t-tech .rs-c{border:1px solid rgba(255,255,255,.22);border-radius:99px;padding:3px 11px}.t-tech .rs-ct{gap:7px}.t-tech .rs-img{border:2px solid var(--rl)}
.t-tech .rs-body{padding:10px 46px 40px}.t-tech .rs-s h3{font-family:${MONO};text-transform:lowercase;letter-spacing:.3px;font-size:13.5px;color:#0b1220;font-weight:700}.t-tech .rs-s h3 i{font-style:normal;color:var(--rc)}
.t-tech .rs-d{font-family:${MONO};font-size:11px;background:var(--rt);color:var(--rd);padding:1px 9px;border-radius:99px}
.t-tech .rs-tg{display:flex;flex-wrap:wrap;gap:7px}.t-tech .rs-tg span{font-family:${MONO};font-size:11.5px;border:1px solid var(--rc);color:var(--rd);border-radius:6px;padding:2px 10px}
.t-tech .rs-job{border-left:2px solid var(--rt);padding-left:14px}
`;
  return { R, TH, list: LIST, rec: REC, font: FONT, hfont: HFONT, css };
};
