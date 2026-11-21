/* =====================================================================
   PART 1 – Resume Maker v2: 8 professional templates, with / without photo
   ===================================================================== */
(function () {
  try {
    const ids = ['resume-maker', 'resume-builder'];
    const tools = TOOLS.filter(t => ids.includes(t.id));
    if (!tools.length) return;

    const TPL = [['classic', 'Classic'], ['modern', 'Modern Header'], ['sidebar', 'Left Sidebar'], ['executive', 'Executive'], ['minimal', 'Clean Minimal'], ['timeline', 'Timeline'], ['corporate', 'Corporate'], ['ats', 'ATS Plain']];
    const FONTS = { sans: "Poppins,'Segoe UI',Arial,sans-serif", serif: "Georgia,'Times New Roman',serif", arial: 'Arial,Helvetica,sans-serif', calibri: "Calibri,Carlito,Arial,sans-serif" };
    const X = s => esc(s || '');
    const nl2 = s => esc(s || '').replace(/\n/g, '<br>');
    const hexRgb = h => { h = String(h || '#2563eb').replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); const n = parseInt(h, 16) || 0; return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
    const shade = (h, k) => 'rgb(' + hexRgb(h).map(x => Math.round(x * k)).join(',') + ')';
    const tint = (h, a) => 'rgba(' + hexRgb(h).join(',') + ',' + a + ')';

    const IC = {
      mail: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>',
      phone: '<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
      pin: '<svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      link: '<svg viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>'
    };
    const PH = '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.5"/><path d="M3.5 22c0-5 4-8 8.5-8s8.5 3 8.5 8z"/></svg>';

    /* ---------- parsing helpers ---------- */
    const blocks = s => s && s.trim() ? s.trim().split(/\n\s*\n/) : [];
    const bl = a => a.length ? '<ul>' + a.map(l => '<li>' + X(l.replace(/^[-•*]\s*/, '')) + '</li>').join('') + '</ul>' : '';
    const jobs = s => blocks(s).map(b => {
      const L = b.split('\n').map(x => x.trim()).filter(Boolean); if (!L.length) return '';
      const m = L[0].match(/^(.*?)\s*[\(\[]\s*([^\)\]]+?)\s*[\)\]]\s*$/);
      const head = m ? m[1] : L[0], d = m ? m[2] : '';
      return '<div class="rs-job"><div class="rs-jh"><b>' + X(head) + '</b>' + (d ? '<span class="rs-d">' + X(d) + '</span>' : '') + '</div>' + bl(L.slice(1)) + '</div>';
    }).join('');
    const list = s => String(s || '').split(/[,\n]/).map(x => x.trim()).filter(Boolean);
    const kv = s => String(s || '').split('\n').map(x => x.trim()).filter(Boolean).map(l => {
      const i = l.indexOf(':'); return i > 0 ? '<div class="rs-kv"><span>' + X(l.slice(0, i)) + '</span><b>' + X(l.slice(i + 1).trim()) + '</b></div>' : '<div class="rs-kv"><b>' + X(l) + '</b></div>';
    }).join('');
    const CT = [['mail', 'email'], ['phone', 'phone'], ['pin', 'loc'], ['link', 'link']];
    const ct = v => CT.filter(c => (v[c[1]] || '').trim()).map(c => '<span class="rs-c">' + IC[c[0]] + '<span>' + X(v[c[1]]) + '</span></span>').join('');
    const sec = (t, h) => h ? '<section class="rs-s"><h3>' + t + '</h3>' + h + '</section>' : '';
    const photo = (v, size) => {
      if (v.photoOn !== 'yes') return '';
      const st = 'width:' + size + 'px;height:' + size + 'px';
      return v.photo ? '<img class="rs-img ' + v.shape + '" style="' + st + '" src="' + v.photo + '" alt="">'
        : '<div class="rs-img rs-ph ' + v.shape + '" style="' + st + '">' + PH + '</div>';
    };
    function parts(v) {
      const sk = list(v.skills);
      return {
        summary: v.summary.trim() ? '<p>' + nl2(v.summary) + '</p>' : '',
        exp: jobs(v.exp), edu: jobs(v.edu), extra: jobs(v.extra),
        chips: sk.map(s => '<span class="rs-chip">' + X(s) + '</span>').join(''),
        plain: sk.map(X).join(', '),
        sklist: sk.length ? '<ul class="rs-sl">' + sk.map(s => '<li>' + X(s) + '</li>').join('') + '</ul>' : '',
        lang: list(v.lang).map(X).join(', '),
        langList: list(v.lang).length ? '<ul class="rs-sl">' + list(v.lang).map(s => '<li>' + X(s) + '</li>').join('') + '</ul>' : '',
        kv: kv(v.personal), decl: v.decl.trim() ? '<p>' + nl2(v.decl) + '</p>' : ''
      };
    }
    const wrap = (v, cls, inner) => '<div class="rs t-' + cls + '" translate="no" style="--rc:' + v.color + ';--rt:' + tint(v.color, .13) + ';--rd:' + shade(v.color, .72) + ';--rf:' + (FONTS[v.font] || FONTS.sans) + '">' + inner + '</div>';
    const head = v => '<h1>' + X(v.name) + '</h1><div class="rs-sub">' + X(v.title) + '</div>';

    /* ---------- the 8 templates ---------- */
    const R = {
      classic(v) {
        const P = parts(v);
        return wrap(v, 'classic', '<div class="rs-hd"><div>' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>' + photo(v, 104) + '</div>' +
          sec('Professional Summary', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Skills', P.chips) + sec('Projects / Certifications', P.extra) + sec('Languages', P.lang) + sec('Personal Details', P.kv) + sec('Declaration', P.decl));
      },
      modern(v) {
        const P = parts(v);
        return wrap(v, 'modern', '<div class="rs-band">' + photo(v, 108) + '<div>' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div></div><div class="rs-body">' +
          sec('Professional Summary', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Skills', P.chips) + sec('Projects / Certifications', P.extra) + sec('Languages', P.lang) + sec('Personal Details', P.kv) + sec('Declaration', P.decl) + '</div>');
      },
      sidebar(v) {
        const P = parts(v), side = (t, h) => h ? '<h4>' + t + '</h4>' + h : '';
        return wrap(v, 'sidebar', '<aside class="rs-sb">' + (photo(v, 148) ? '<div class="rs-pw">' + photo(v, 148) + '</div>' : '') +
          side('Contact', '<div class="rs-ct col">' + ct(v) + '</div>') + side('Skills', P.sklist) + side('Languages', P.langList) + side('Personal', P.kv) + '</aside>' +
          '<div class="rs-mn">' + head(v) + sec('Professional Summary', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) + '</div>');
      },
      executive(v) {
        const P = parts(v);
        return wrap(v, 'executive', '<div class="rs-hd">' + (photo(v, 100) ? '<div class="rs-pw">' + photo(v, 100) + '</div>' : '') + '<h1>' + X(v.name) + '</h1><div class="rs-sub">' + X(v.title) + '</div><div class="rs-ct">' + ct(v) + '</div></div><div class="rs-body">' +
          sec('Profile', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Skills', P.chips) + sec('Projects / Certifications', P.extra) + sec('Languages', P.lang) + sec('Personal Details', P.kv) + sec('Declaration', P.decl) + '</div>');
      },
      minimal(v) {
        const P = parts(v), row = (t, h) => h ? '<section class="rs-row"><h3>' + t + '</h3><div>' + h + '</div></section>' : '';
        return wrap(v, 'minimal', '<div class="rs-hd"><div>' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>' + photo(v, 96) + '</div>' +
          row('Summary', P.summary) + row('Experience', P.exp) + row('Education', P.edu) + row('Skills', P.chips) + row('Projects', P.extra) + row('Languages', P.lang) + row('Personal', P.kv) + row('Declaration', P.decl));
      },
      timeline(v) {
        const P = parts(v);
        return wrap(v, 'timeline', '<div class="rs-hd"><div>' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>' + photo(v, 100) + '</div><div class="rs-body">' +
          sec('About Me', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Skills', P.chips) + sec('Projects / Certifications', P.extra) + sec('Languages', P.lang) + sec('Personal Details', P.kv) + sec('Declaration', P.decl) + '</div>');
      },
      corporate(v) {
        const P = parts(v), side = (t, h) => h ? '<h4>' + t + '</h4>' + h : '';
        return wrap(v, 'corporate', '<div class="rs-bar"><div>' + head(v) + '</div>' + photo(v, 100) + '</div><div class="rs-cols"><div class="rs-mn">' +
          sec('Professional Summary', P.summary) + sec('Experience', P.exp) + sec('Projects / Certifications', P.extra) + sec('Declaration', P.decl) +
          '</div><aside class="rs-sd">' + side('Contact', '<div class="rs-ct col">' + ct(v) + '</div>') + side('Education', P.edu) + side('Skills', P.sklist) + side('Languages', P.langList) + side('Personal', P.kv) + '</aside></div>');
      },
      ats(v) {
        const P = parts(v);
        return wrap(v, 'ats', '<div class="rs-hd">' + head(v) + '<div class="rs-ct">' + ct(v) + '</div></div>' +
          sec('Summary', P.summary) + sec('Experience', P.exp) + sec('Education', P.edu) + sec('Skills', P.plain ? '<p>' + P.plain + '</p>' : '') + sec('Projects / Certifications', P.extra) + sec('Languages', P.lang ? '<p>' + P.lang + '</p>' : '') + sec('Personal Details', P.kv) + sec('Declaration', P.decl));
      }
    };

    /* ---------- thumbnails for the template picker ---------- */
    const TH = {
      classic: c => '<rect x="6" y="8" width="24" height="4" fill="#334155"/><rect x="6" y="15" width="16" height="2" fill="#94a3b8"/><rect x="42" y="7" width="12" height="12" rx="2" fill="#cbd5e1"/><rect x="6" y="25" width="48" height="1.5" fill="' + c + '"/><rect x="6" y="30" width="48" height="2" fill="#cbd5e1"/><rect x="6" y="35" width="38" height="2" fill="#cbd5e1"/><rect x="6" y="46" width="48" height="1.5" fill="' + c + '"/><rect x="6" y="51" width="48" height="2" fill="#cbd5e1"/><rect x="6" y="56" width="34" height="2" fill="#cbd5e1"/>',
      modern: c => '<rect width="60" height="26" fill="' + c + '"/><circle cx="14" cy="13" r="7" fill="#fff" opacity=".8"/><rect x="26" y="9" width="26" height="4" fill="#fff"/><rect x="26" y="16" width="18" height="2" fill="#fff" opacity=".7"/><rect x="6" y="33" width="20" height="2" fill="' + c + '"/><rect x="6" y="38" width="48" height="2" fill="#cbd5e1"/><rect x="6" y="43" width="40" height="2" fill="#cbd5e1"/><rect x="6" y="53" width="20" height="2" fill="' + c + '"/><rect x="6" y="58" width="44" height="2" fill="#cbd5e1"/>',
      sidebar: c => '<rect width="22" height="80" fill="' + c + '"/><circle cx="11" cy="14" r="6" fill="#fff" opacity=".8"/><rect x="4" y="27" width="14" height="2" fill="#fff" opacity=".8"/><rect x="4" y="32" width="12" height="2" fill="#fff" opacity=".5"/><rect x="4" y="44" width="14" height="2" fill="#fff" opacity=".8"/><rect x="4" y="49" width="10" height="2" fill="#fff" opacity=".5"/><rect x="28" y="8" width="26" height="4" fill="#334155"/><rect x="28" y="15" width="16" height="2" fill="' + c + '"/><rect x="28" y="26" width="28" height="2" fill="#cbd5e1"/><rect x="28" y="31" width="24" height="2" fill="#cbd5e1"/><rect x="28" y="42" width="28" height="2" fill="#cbd5e1"/><rect x="28" y="47" width="22" height="2" fill="#cbd5e1"/>',
      executive: c => '<rect width="60" height="3" fill="' + c + '"/><circle cx="30" cy="14" r="6" fill="#cbd5e1"/><rect x="16" y="24" width="28" height="3" fill="#334155"/><rect x="21" y="30" width="18" height="2" fill="#94a3b8"/><rect x="6" y="40" width="14" height="1.5" fill="' + c + '"/><rect x="40" y="40" width="14" height="1.5" fill="' + c + '"/><rect x="6" y="47" width="48" height="2" fill="#cbd5e1"/><rect x="6" y="52" width="40" height="2" fill="#cbd5e1"/><rect x="6" y="62" width="48" height="2" fill="#cbd5e1"/>',
      minimal: c => '<rect x="6" y="8" width="22" height="4" fill="#334155"/><rect x="6" y="15" width="14" height="2" fill="' + c + '"/><rect x="44" y="7" width="10" height="10" fill="#e2e8f0"/><rect x="6" y="28" width="10" height="2" fill="#94a3b8"/><rect x="22" y="28" width="32" height="2" fill="#cbd5e1"/><rect x="22" y="33" width="26" height="2" fill="#cbd5e1"/><rect x="6" y="46" width="10" height="2" fill="#94a3b8"/><rect x="22" y="46" width="32" height="2" fill="#cbd5e1"/><rect x="22" y="51" width="28" height="2" fill="#cbd5e1"/><rect x="6" y="64" width="10" height="2" fill="#94a3b8"/><rect x="22" y="64" width="30" height="2" fill="#cbd5e1"/>',
      timeline: c => '<rect x="6" y="8" width="24" height="4" fill="#334155"/><rect x="6" y="15" width="16" height="2" fill="' + c + '"/><circle cx="48" cy="13" r="6" fill="#cbd5e1"/><rect x="6" y="24" width="48" height="1.5" fill="' + c + '"/><line x1="10" y1="32" x2="10" y2="66" stroke="' + c + '" opacity=".4" stroke-width="1.5"/><circle cx="10" cy="35" r="2.5" fill="' + c + '"/><circle cx="10" cy="54" r="2.5" fill="' + c + '"/><rect x="17" y="33" width="36" height="2" fill="#cbd5e1"/><rect x="17" y="38" width="28" height="2" fill="#cbd5e1"/><rect x="17" y="52" width="36" height="2" fill="#cbd5e1"/><rect x="17" y="57" width="26" height="2" fill="#cbd5e1"/>',
      corporate: c => '<rect width="60" height="20" fill="' + c + '"/><rect x="6" y="6" width="24" height="4" fill="#fff"/><rect x="6" y="13" width="16" height="2" fill="#fff" opacity=".7"/><rect x="46" y="4" width="10" height="12" fill="#fff" opacity=".8"/><rect x="40" y="20" width="20" height="60" fill="#f1f5f9"/><rect x="6" y="28" width="28" height="2" fill="#cbd5e1"/><rect x="6" y="33" width="24" height="2" fill="#cbd5e1"/><rect x="6" y="44" width="28" height="2" fill="#cbd5e1"/><rect x="43" y="28" width="14" height="2" fill="' + c + '"/><rect x="43" y="34" width="12" height="2" fill="#94a3b8"/><rect x="43" y="46" width="14" height="2" fill="' + c + '"/>',
      ats: c => '<rect x="6" y="8" width="26" height="4" fill="#111"/><rect x="6" y="15" width="40" height="2" fill="#94a3b8"/><rect x="6" y="26" width="16" height="2" fill="#111"/><rect x="6" y="30" width="48" height="1" fill="#111"/><rect x="6" y="35" width="48" height="2" fill="#cbd5e1"/><rect x="6" y="40" width="40" height="2" fill="#cbd5e1"/><rect x="6" y="52" width="16" height="2" fill="#111"/><rect x="6" y="56" width="48" height="1" fill="#111"/><rect x="6" y="61" width="44" height="2" fill="#cbd5e1"/>'
    };
    const thumb = (id, c) => '<svg viewBox="0 0 60 80" xmlns="http://www.w3.org/2000/svg">' + TH[id](c) + '</svg>';

    /* ---------- styles (injected once) ---------- */
    if (!document.getElementById('pj-rs-css')) {
      const s = document.createElement('style'); s.id = 'pj-rs-css';
      s.textContent = `
.rs-pick{display:grid;grid-template-columns:repeat(auto-fill,minmax(82px,1fr));gap:10px;margin:0 0 6px}
.rs-pk{border:2px solid var(--bd);background:#fff;border-radius:10px;padding:5px 4px 5px;cursor:pointer;font:inherit;font-size:.7rem;font-weight:600;color:var(--ink);text-align:center}
.rs-pk.on{border-color:var(--p);box-shadow:0 0 0 3px #2563eb22}
.rs-pk svg{width:100%;height:auto;display:block;margin-bottom:3px;border:1px solid #e2e8f0;border-radius:4px;background:#fff}
.rs-wrap{width:100%;overflow:hidden}.rs-fit{width:794px}
.rs-pg{font-size:.8rem;font-weight:600;margin:0 0 8px}
.rs-photo-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.rs-photo-row input[type=file]{flex:1;min-width:180px}
.rs{width:794px;min-height:1120px;background:#fff;color:#1e293b;font-family:var(--rf);font-size:13px;line-height:1.5;box-sizing:border-box;position:relative;overflow:hidden;text-align:left}
.rs *{box-sizing:border-box}.rs h1,.rs h2,.rs h3,.rs h4,.rs p{margin:0}
.rs ul{margin:3px 0 0;padding-left:17px}.rs li{margin:0 0 2px}
.rs h1{font-size:30px;line-height:1.15;font-weight:700;color:#0f172a}
.rs-sub{font-size:15px;color:var(--rd);font-weight:500;margin-top:3px}
.rs-ct{display:flex;flex-wrap:wrap;gap:5px 18px;font-size:12px;color:#475569;margin-top:9px}
.rs-ct.col{flex-direction:column;gap:7px}
.rs-c{display:inline-flex;align-items:center;gap:6px}
.rs-c svg{width:13px;height:13px;flex:none;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.rs-c span{overflow-wrap:anywhere}
.rs-img{object-fit:cover;flex:none;display:block}
.rs-img.circle{border-radius:50%}.rs-img.rounded{border-radius:14px}.rs-img.square{border-radius:0}
.rs-ph{background:#e2e8f0;color:#94a3b8;display:grid;place-items:center}.rs-ph svg{width:55%;height:55%;fill:currentColor}
.rs-job{margin:0 0 11px;page-break-inside:avoid}.rs-jh{display:flex;justify-content:space-between;gap:10px;align-items:baseline}
.rs-jh b{font-weight:600}.rs-d{font-size:12px;color:#64748b;white-space:nowrap}
.rs-chip{display:inline-block;background:var(--rt);color:var(--rd);border-radius:99px;padding:2px 11px;margin:0 5px 5px 0;font-size:12px;font-weight:500}
.rs-kv{display:flex;gap:8px;font-size:12.5px;margin:0 0 3px}.rs-kv span{color:#64748b;min-width:96px;flex:none}.rs-kv b{font-weight:500}
.rs-s{margin-top:17px;page-break-inside:avoid}.rs-s h3{font-size:12.5px;text-transform:uppercase;letter-spacing:1.3px;color:var(--rc);margin-bottom:8px;font-weight:700}
.rs-sl{list-style:none;padding:0!important}.rs-sl li{margin:0 0 5px}
/* classic */
.t-classic{padding:42px 48px}.t-classic .rs-hd{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;padding-bottom:14px;border-bottom:3px solid var(--rc)}
.t-classic .rs-s h3{border-bottom:1.5px solid var(--rc);padding-bottom:3px}
/* modern */
.t-modern .rs-band{background:var(--rc);color:#fff;padding:34px 44px;display:flex;gap:22px;align-items:center}
.t-modern .rs-band h1,.t-modern .rs-band .rs-sub,.t-modern .rs-band .rs-ct{color:#fff}.t-modern .rs-sub{opacity:.92}
.t-modern .rs-img{border:4px solid rgba(255,255,255,.6)}.t-modern .rs-body{padding:12px 44px 40px}
.t-modern .rs-s h3{padding-left:10px;border-left:4px solid var(--rc)}
/* sidebar */
.t-sidebar{display:grid;grid-template-columns:262px 1fr}.t-sidebar .rs-sb{background:var(--rc);color:#fff;padding:36px 22px}
.t-sidebar .rs-pw{display:flex;justify-content:center;margin-bottom:22px}.t-sidebar .rs-img{border:4px solid rgba(255,255,255,.45)}
.t-sidebar h4{font-size:12.5px;text-transform:uppercase;letter-spacing:1.4px;margin:20px 0 9px;padding-bottom:5px;border-bottom:1px solid rgba(255,255,255,.4)}
.t-sidebar .rs-ct{color:#fff;font-size:12px}.t-sidebar .rs-kv span{color:rgba(255,255,255,.75);min-width:70px}.t-sidebar .rs-kv{flex-direction:column;gap:0;margin-bottom:7px}
.t-sidebar .rs-mn{padding:40px 38px}.t-sidebar .rs-mn h1{font-size:32px}
/* executive */
.t-executive{border-top:8px solid var(--rc);padding:34px 54px 40px}.t-executive .rs-hd{text-align:center;padding-bottom:16px;border-bottom:1px solid #cbd5e1}
.t-executive .rs-pw{display:flex;justify-content:center;margin-bottom:12px}.t-executive h1{font-family:Georgia,'Times New Roman',serif;letter-spacing:3px;text-transform:uppercase;font-size:28px;font-weight:700}
.t-executive .rs-ct{justify-content:center}.t-executive .rs-s h3{display:flex;align-items:center;gap:12px;font-family:Georgia,serif;color:#0f172a}
.t-executive .rs-s h3::before,.t-executive .rs-s h3::after{content:"";flex:1;border-top:1px solid var(--rc)}
/* minimal */
.t-minimal{padding:46px 52px}.t-minimal .rs-hd{display:flex;justify-content:space-between;gap:20px;align-items:flex-start;margin-bottom:10px}
.t-minimal h1{font-weight:300;font-size:34px;letter-spacing:.5px}.t-minimal .rs-row{display:grid;grid-template-columns:140px 1fr;gap:18px;padding:16px 0;border-top:1px solid #e2e8f0;page-break-inside:avoid}
.t-minimal .rs-row h3{font-size:11.5px;text-transform:uppercase;letter-spacing:1.6px;color:var(--rc);font-weight:600;padding-top:2px}
/* timeline */
.t-timeline .rs-hd{display:flex;justify-content:space-between;gap:20px;align-items:center;padding:36px 46px 18px;border-bottom:4px solid var(--rc)}.t-timeline .rs-body{padding:6px 46px 40px}
.t-timeline .rs-job{border-left:2px solid var(--rt);padding-left:18px;margin-left:5px;position:relative}
.t-timeline .rs-job::before{content:"";position:absolute;left:-7px;top:5px;width:12px;height:12px;border-radius:50%;background:var(--rc);border:2px solid #fff}
/* corporate */
.t-corporate{display:flex;flex-direction:column}.t-corporate .rs-bar{background:var(--rd);color:#fff;padding:30px 40px;display:flex;justify-content:space-between;align-items:center;gap:20px}
.t-corporate .rs-bar h1,.t-corporate .rs-bar .rs-sub{color:#fff}.t-corporate .rs-sub{opacity:.9}
.t-corporate .rs-cols{display:grid;grid-template-columns:1fr 262px;flex:1;min-height:980px}.t-corporate .rs-mn{padding:10px 34px 36px 40px}
.t-corporate .rs-sd{background:#f1f5f9;padding:26px 22px}.t-corporate h4{font-size:12.5px;text-transform:uppercase;letter-spacing:1.4px;color:var(--rd);margin:0 0 9px;padding-bottom:5px;border-bottom:2px solid var(--rc)}
.t-corporate .rs-sd h4:not(:first-child){margin-top:20px}.t-corporate .rs-sd .rs-job{margin-bottom:9px}.t-corporate .rs-sd .rs-jh{flex-direction:column;gap:0}
.t-corporate .rs-kv{flex-direction:column;gap:0;margin-bottom:7px}
/* ATS */
.t-ats{padding:40px 50px;color:#000}.t-ats h1{font-size:26px;color:#000}.t-ats .rs-sub{color:#000;font-weight:400}.t-ats .rs-ct{color:#000}
.t-ats .rs-s h3{color:#000;border-bottom:1px solid #000;padding-bottom:2px}
@media print{.rs-fit{transform:none!important;width:auto!important}.rs-wrap{height:auto!important;overflow:visible!important}.rs-ph{visibility:hidden}.rs{min-height:296mm}}
@media(max-width:820px){.rs-pick{grid-template-columns:repeat(4,1fr)}}`;
      document.head.appendChild(s);
    }

    /* ---------- helpers ---------- */
    const loadH2P = () => window.html2pdf ? Promise.resolve() : new Promise((ok, no) => {
      const s = document.createElement('script'); s.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      s.onload = ok; s.onerror = () => no(new Error('lib')); document.head.appendChild(s);
    });
    const procPhoto = file => new Promise((ok, no) => {
      const u = URL.createObjectURL(file), im = new Image();
      im.onload = () => {
        const s = Math.min(im.naturalWidth, im.naturalHeight), c = document.createElement('canvas'); c.width = c.height = 480;
        c.getContext('2d').drawImage(im, (im.naturalWidth - s) / 2, (im.naturalHeight - s) * .3, s, s, 0, 0, 480, 480);
        URL.revokeObjectURL(u); ok(c.toDataURL('image/jpeg', .88));
      };
      im.onerror = () => { URL.revokeObjectURL(u); no(new Error('img')); }; im.src = u;
    });

    function resumeV2(el) {
      let saved = {}; try { saved = JSON.parse(localStorage.getItem('pj_resume2') || '{}') || {}; } catch (e) { }
      const D = Object.assign({
        name: 'Rahul Sharma', title: 'Mechanical Engineer', email: 'rahul.sharma@example.com', phone: '+91 98765 43210', loc: 'Jaipur, Rajasthan', link: 'linkedin.com/in/yourname',
        summary: 'Result-oriented engineer with 5+ years of experience in design, estimation and project execution. Known for delivering projects on time, reducing cost and working well with teams and clients.',
        skills: 'AutoCAD, Project Management, MS Excel, Estimation & BOQ, Team Leadership, Communication',
        exp: 'Senior Engineer – ABC Pvt. Ltd. (2021 – Present)\n- Designed and executed 20+ commercial projects\n- Reduced material wastage by 12% through accurate planning\n\nJunior Engineer – XYZ Co. (2019 – 2021)\n- Assisted in site execution, testing and commissioning',
        edu: 'B.Tech Mechanical Engineering – XYZ University (2015 – 2019)\n\nSenior Secondary (12th) – ABC School (2015)', extra: 'Certified AutoCAD Professional\nSafety & Quality Training (2022)',
        lang: 'Hindi, English', personal: 'Date of Birth: 01 Jan 1996\nNationality: Indian', decl: '', font: 'sans', tpl: 'sidebar', color: '#2563eb', photoOn: 'yes', shape: 'circle', photo: ''
      }, saved);
      const ST = { tpl: R[D.tpl] ? D.tpl : 'classic', photo: D.photo || '' };
      const F = [
        { id: 'name', label: 'Full name', value: D.name }, { id: 'title', label: 'Job title', value: D.title }, { id: 'email', label: 'Email', value: D.email }, { id: 'phone', label: 'Phone', value: D.phone },
        { id: 'loc', label: 'Location', value: D.loc }, { id: 'link', label: 'LinkedIn / Website', value: D.link },
        { id: 'photoOn', label: 'Photo', type: 'select', value: D.photoOn, options: [['yes', 'With photo'], ['no', 'Without photo']], hint: 'Photo is common in India / Gulf / Europe. For online (ATS) or US / UK jobs choose “Without photo”.' },
        { id: 'shape', label: 'Photo shape', type: 'select', value: D.shape, options: [['circle', 'Round'], ['rounded', 'Rounded square'], ['square', 'Square']] },
        { id: 'color', label: 'Accent colour', type: 'color', value: D.color }, { id: 'font', label: 'Font style', type: 'select', value: D.font, options: [['sans', 'Modern (Poppins)'], ['serif', 'Classic (Georgia)'], ['arial', 'Simple (Arial)'], ['calibri', 'Office (Calibri)']] },
        { id: 'summary', label: 'Professional summary', type: 'textarea', rows: 3, value: D.summary, wide: 1 },
        { id: 'skills', label: 'Skills (comma separated)', type: 'textarea', rows: 2, value: D.skills, wide: 1 },
        { id: 'exp', label: 'Experience', type: 'textarea', rows: 8, value: D.exp, wide: 1, hint: 'First line of each block = Role – Company (dates). Next lines = bullet points. Leave a blank line between jobs. Freshers: put internships / projects here.' },
        { id: 'edu', label: 'Education', type: 'textarea', rows: 4, value: D.edu, wide: 1, hint: 'Degree – College (years). Blank line between entries.' },
        { id: 'extra', label: 'Projects / Certifications (optional)', type: 'textarea', rows: 3, value: D.extra, wide: 1 },
        { id: 'lang', label: 'Languages (optional, comma separated)', value: D.lang, wide: 1 },
        { id: 'personal', label: 'Personal details (optional)', type: 'textarea', rows: 3, value: D.personal, wide: 1, hint: 'One per line as  Label: value  (e.g. Date of Birth: 01 Jan 1996). Clear this box to hide the section.' },
        { id: 'decl', label: 'Declaration (optional)', type: 'textarea', rows: 2, value: D.decl, wide: 1, hint: 'e.g. I hereby declare that the above information is true to the best of my knowledge.' }
      ];
      el.innerHTML = `<div class="split"><div class="card noprint"><h3>1. Choose a template</h3><div class="rs-pick" id="rs-pick"></div>
        <h3 style="margin-top:16px">2. Your details</h3><div class="form">${F.map(f => fld(f, 'rs2_')).join('')}
        <div class="fld wide"><span>Your photo (optional)</span><div class="rs-photo-row"><input type="file" id="rs-file" accept="image/*"><button class="btn ghost sm" type="button" id="rs-rmph">Remove photo</button></div>
        <small>The photo is cropped to a square on your device. It is never uploaded anywhere.</small></div></div>
        <div class="row"><button class="btn" id="rs-pdf" type="button">⬇ Download PDF</button><button class="btn ghost" id="rs-pr" type="button">🖨 Print / Save as PDF</button><button class="btn ghost" id="rs-rst" type="button">Reset</button></div>
        <p class="note"><b>Download PDF</b> is quick (one A4 page picture). <b>Print / Save as PDF</b> keeps real selectable text, which is better for ATS and online job portals. Your data is saved only in this browser.</p></div>
        <div class="card print-area" id="prev"><div class="noprint rs-pg" id="rs-pg"></div><div class="rs-wrap" id="rs-wrap"><div class="rs-fit" id="rs-fit"></div></div></div></div>`;
      const g = id => { const e = $('#f_rs2_' + id, el); return e ? e.value : ''; };
      const fit = $('#rs-fit', el), wr = $('#rs-wrap', el), pick = $('#rs-pick', el);
      const vals = () => { const v = {}; F.forEach(f => v[f.id] = g(f.id)); v.tpl = ST.tpl; v.photo = ST.photo; return v; };
      const scale = () => {
        const root = fit.firstElementChild; if (!root) return;
        const s = Math.min(1, wr.clientWidth / 794 || 1);
        fit.style.transform = 'scale(' + s + ')'; fit.style.transformOrigin = 'top left'; wr.style.height = Math.ceil(root.offsetHeight * s) + 'px';
      };
      const pickUI = () => {
        const c = g('color') || '#2563eb';
        pick.innerHTML = TPL.map(t => '<button type="button" class="rs-pk ' + (t[0] === ST.tpl ? 'on' : '') + '" data-t="' + t[0] + '">' + thumb(t[0], c) + t[1] + '</button>').join('');
      };
      const draw = () => {
        const v = vals();
        fit.innerHTML = R[v.tpl](v);
        const photoRow = $('#rs-file', el).closest('.fld');
        photoRow.style.display = v.photoOn === 'yes' ? '' : 'none';
        const sh = $('#f_rs2_shape', el).closest('.fld'); if (sh) sh.style.display = v.photoOn === 'yes' ? '' : 'none';
        scale();
        const root = fit.firstElementChild, pages = Math.max(1, Math.ceil((root.offsetHeight - 6) / 1123));
        $('#rs-pg', el).innerHTML = pages === 1 ? '<span style="color:var(--ok)">✓ Fits on 1 page (A4)</span>' : (pages === 2 ? '<span style="color:#b45309">2 pages – fine for experienced candidates; freshers should keep 1 page.</span>' : '<span class="err">' + pages + ' pages – please shorten the content (2 pages maximum is recommended).</span>');
        if (v.tpl === 'ats' && v.photoOn === 'yes') $('#rs-pg', el).innerHTML += ' <span style="color:var(--mut)">· ATS Plain never shows a photo.</span>';
        try { localStorage.setItem('pj_resume2', JSON.stringify(Object.assign({}, v))); } catch (e) { try { v.photo = ''; localStorage.setItem('pj_resume2', JSON.stringify(v)); } catch (e2) { } }
      };
      pickUI(); draw();
      $$('input,select,textarea', el).forEach(x => { if (x.type !== 'file') x.addEventListener('input', () => { if (x.id === 'f_rs2_color') pickUI(); draw(); }); });
      pick.addEventListener('click', e => { const b = e.target.closest('.rs-pk'); if (!b) return; ST.tpl = b.dataset.t; pickUI(); draw(); });
      $('#rs-file', el).addEventListener('change', async e => {
        const f = e.target.files[0]; if (!f) return;
        try { ST.photo = await procPhoto(f); $('#f_rs2_photoOn', el).value = 'yes'; draw(); toast('Photo added ✓'); } catch (er) { toast('Could not read this image. Please use JPG or PNG.'); }
      });
      $('#rs-rmph', el).onclick = () => { ST.photo = ''; $('#rs-file', el).value = ''; draw(); };
      const onResize = () => scale(); window.addEventListener('resize', onResize);
      CLEANUP = () => { window.removeEventListener('resize', onResize); const p = document.getElementById('rs-page'); if (p) p.remove(); };

      $('#rs-pr', el).onclick = () => {
        const st = document.createElement('style'); st.id = 'rs-page'; st.textContent = '@page{size:A4;margin:0}'; document.head.appendChild(st);
        const done = () => { st.remove(); window.removeEventListener('afterprint', done); };
        window.addEventListener('afterprint', done); setTimeout(done, 120000); window.print();
      };
      $('#rs-pdf', el).onclick = async () => {
        const btn = $('#rs-pdf', el), label = btn.textContent; btn.disabled = true; btn.textContent = '⏳ Preparing PDF…';
        try {
          await loadH2P();
          const clone = fit.firstElementChild.cloneNode(true); clone.querySelectorAll('.rs-ph').forEach(e => e.style.visibility = 'hidden');
          const nm = (g('name') || 'Resume').trim().replace(/[^\w\u0900-\u097F]+/g, '-');
          await html2pdf().set({ margin: 0, filename: nm + '-Resume.pdf', image: { type: 'jpeg', quality: .98 }, html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff', windowWidth: 794 }, jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }, pagebreak: { mode: ['css', 'legacy'], avoid: ['.rs-job'] } }).from(clone).save();
          toast('PDF downloaded ✓');
        } catch (e) { toast('Opening print dialog – choose “Save as PDF”'); $('#rs-pr', el).click(); }
        btn.disabled = false; btn.textContent = label;
      };
      $('#rs-rst', el).onclick = () => { try { localStorage.removeItem('pj_resume2'); } catch (e) { } resumeV2(el); };
    }

    tools.forEach(t => {
      t.render = resumeV2;
      t.desc = 'Professional resumes with or without photo – 8 ready templates, download as PDF';
    });
  } catch (e) { console.error('Resume upgrade failed', e); }
})();
/* =====================================================================
   PART 2 – PDF Tools v2: PDF→Word, PDF→Excel, Compress, Set size (KB / MB)
   Everything runs inside the browser. Files are never uploaded.
   ===================================================================== */
(function () {
  try {
    const T = TOOLS.find(x => x.id === 'pdf-tools');
    if (!T || T._v2) return; T._v2 = 1;
    const orig = T.render;
    T.desc = 'PDF to Word, PDF to Excel, compress PDF, increase / decrease size in KB or MB, images to PDF, merge, split';

    const PJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js', PWK = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    const loadScript = u => new Promise((ok, no) => { const s = document.createElement('script'); s.src = u; s.onload = ok; s.onerror = () => no(new Error('Could not load a required library. Please check your internet connection.')); document.head.appendChild(s); });
    const loadPdfJs = () => (window.pdfjsLib ? Promise.resolve() : loadScript(PJS)).then(() => { pdfjsLib.GlobalWorkerOptions.workerSrc = PWK; });
    const fs = b => b >= 1048576 ? (b / 1048576).toFixed(2) + ' MB' : (b / 1024).toFixed(1) + ' KB';
    const baseName = f => f.name.replace(/\.pdf$/i, '');
    const wait = () => new Promise(r => setTimeout(r, 16));

    async function openPdf(file) {
      await loadPdfJs();
      const buf = await file.arrayBuffer();
      try { return await pdfjsLib.getDocument({ data: new Uint8Array(buf) }).promise; }
      catch (e) {
        if (e && e.name === 'PasswordException') throw new Error('This PDF is password-protected. Remove the password first, then try again.');
        throw new Error('Could not read this PDF. The file may be damaged.');
      }
    }
    function pageNums(str, max) {
      if (!str || !str.trim()) return Array.from({ length: max }, (_, i) => i + 1);
      return parseRange(str, max).map(i => i + 1);
    }

    /* ---------- tiny ZIP writer (no compression) – enough for .docx / .xlsx ---------- */
    const CRC = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
    const crc32 = u => { let c = 0xFFFFFFFF; for (let i = 0; i < u.length; i++) c = CRC[(c ^ u[i]) & 255] ^ (c >>> 8); return (c ^ 0xFFFFFFFF) >>> 0; };
    function zip(files) {
      const enc = new TextEncoder(), loc = [], cen = []; let off = 0;
      files.forEach(f => {
        const nb = enc.encode(f.name), d = typeof f.data === 'string' ? enc.encode(f.data) : f.data, crc = crc32(d);
        const h = new DataView(new ArrayBuffer(30)); h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(8, 0, true); h.setUint16(10, 0, true); h.setUint16(12, 33, true);
        h.setUint32(14, crc, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true); h.setUint16(26, nb.length, true); h.setUint16(28, 0, true);
        const c = new DataView(new ArrayBuffer(46)); c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(10, 0, true); c.setUint16(12, 0, true); c.setUint16(14, 33, true);
        c.setUint32(16, crc, true); c.setUint32(20, d.length, true); c.setUint32(24, d.length, true); c.setUint16(28, nb.length, true); c.setUint32(42, off, true);
        loc.push(new Uint8Array(h.buffer), nb, d); cen.push(new Uint8Array(c.buffer), nb); off += 30 + nb.length + d.length;
      });
      const cs = cen.reduce((a, b) => a + b.length, 0), e = new DataView(new ArrayBuffer(22));
      e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, cs, true); e.setUint32(16, off, true);
      return new Blob([...loc, ...cen, new Uint8Array(e.buffer)]);
    }
    const xe = s => String(s).replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    /* ---------- text extraction ---------- */
    async function pageData(page) {
      const tc = await page.getTextContent(), vp = page.getViewport({ scale: 1 }), it = [];
      tc.items.forEach(i => { if (!i.str || !i.str.trim()) return; it.push({ s: i.str, x: i.transform[4], y: i.transform[5], w: i.width || 0, h: Math.abs(i.transform[3]) || i.height || 10 }); });
      return { it, W: vp.width, H: vp.height };
    }
    function toRows(it) {
      const s = it.slice().sort((a, b) => b.y - a.y || a.x - b.x), R = [];
      s.forEach(i => { const L = R[R.length - 1]; if (L && Math.abs(L.y - i.y) <= Math.max(2, i.h * .4)) { L.items.push(i); L.h = Math.max(L.h, i.h); } else R.push({ y: i.y, h: i.h, items: [i] }); });
      R.forEach(r => r.items.sort((a, b) => a.x - b.x));
      return R;
    }
    function rowText(r) {
      let t = '', end = null;
      r.items.forEach(i => {
        if (end != null) { const g = i.x - end; if (g > i.h * 1.2) t += '\t'; else if (g > i.h * .18 && !/\s$/.test(t) && !/^\s/.test(i.s)) t += ' '; }
        t += i.s; end = i.x + i.w;
      });
      return t.replace(/[ ]+/g, ' ').replace(/ ?\t ?/g, '\t').trim();
    }
    const median = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[s.length >> 1] : 10; };

    /* ---------- PDF -> Word (.docx) ---------- */
    function wordParas(P) {
      const R = toRows(P.it); if (!R.length) return [];
      const med = median(R.map(r => r.h)), maxRight = Math.max(...P.it.map(i => i.x + i.w)), out = [];
      let prev = null;
      R.forEach(r => {
        const t = rowText(r); if (!t) return;
        const right = Math.max(...r.items.map(i => i.x + i.w)), big = r.h >= med * 1.3, hasTab = t.indexOf('\t') >= 0;
        if (prev && !big && !prev.big && !hasTab && !prev.hasTab && (prev.y - r.y) < prev.h * 1.7 && prev.right >= maxRight - P.W * .07) {
          prev.p.t += ' ' + t; prev.y = r.y; prev.right = right; return;
        }
        const p = { t, b: big, sz: big ? Math.min(40, Math.max(24, Math.round(r.h * 2))) : 22 };
        out.push(p); prev = { p, y: r.y, h: r.h, right, big, hasTab };
      });
      return out;
    }
    function buildDocx(pages) {
      let b = '';
      pages.forEach((P, pi) => {
        if (pi) b += '<w:p><w:r><w:br w:type="page"/></w:r></w:p>';
        if (!P.length) b += '<w:p><w:r><w:rPr><w:i/><w:color w:val="888888"/></w:rPr><w:t>[This page has no selectable text – it is probably a scanned image.]</w:t></w:r></w:p>';
        P.forEach(p => {
          const rp = '<w:rPr>' + (p.b ? '<w:b/>' : '') + '<w:sz w:val="' + p.sz + '"/></w:rPr>';
          const runs = p.t.split('\t').map(x => '<w:r>' + rp + '<w:t xml:space="preserve">' + xe(x) + '</w:t></w:r>').join('<w:r><w:tab/></w:r>');
          b += '<w:p><w:pPr><w:spacing w:after="' + (p.b ? 160 : 100) + '"/></w:pPr>' + runs + '</w:p>';
        });
      });
      const doc = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>' + b + '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="708" w:footer="708" w:gutter="0"/></w:sectPr></w:body></w:document>';
      return zip([
        { name: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>' },
        { name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>' },
        { name: 'word/document.xml', data: doc }
      ]);
    }

    /* ---------- PDF -> Excel (.xlsx) ---------- */
    function gridFromRows(R, W) {
      const cells = R.map(r => {
        const c = []; let cur = null;
        r.items.forEach(i => {
          if (cur && i.x - cur.end <= Math.max(4, i.h * .8)) { cur.t += (i.x - cur.end > i.h * .18 && !/\s$/.test(cur.t) && !/^\s/.test(i.s) ? ' ' : '') + i.s; cur.end = i.x + i.w; }
          else { cur = { x: i.x, end: i.x + i.w, t: i.s }; c.push(cur); }
        });
        c.forEach(x => x.t = x.t.replace(/\s+/g, ' ').trim()); return c.filter(x => x.t);
      }).filter(r => r.length);
      const iv = []; cells.forEach(r => { if (r.length > 1) r.forEach(c => { if (c.end - c.x < W * .6) iv.push([c.x, c.end]); }); });
      iv.sort((a, b) => a[0] - b[0]);
      const cols = [];
      iv.forEach(i => { const L = cols[cols.length - 1]; if (L) { const ov = Math.min(L[1], i[1]) - Math.max(L[0], i[0]), mn = Math.min(L[1] - L[0], i[1] - i[0]); if (ov > .4 * mn || i[0] <= L[1] - 1) { L[1] = Math.max(L[1], i[1]); L[0] = Math.min(L[0], i[0]); return; } } cols.push([i[0], i[1]]); });
      const colOf = c => {
        if (!cols.length) return -1; let best = -1, bo = 0;
        cols.forEach((k, ix) => { const ov = Math.min(k[1], c.end) - Math.max(k[0], c.x); if (ov > bo) { bo = ov; best = ix; } });
        if (best >= 0) return best;
        let d = 1e9; cols.forEach((k, ix) => { const dd = Math.abs(k[0] - c.x); if (dd < d) { d = dd; best = ix; } }); return best;
      };
      const colLeft = c => { let best = -1, d = 1e9; cols.forEach((k, ix) => { const dd = Math.abs(k[0] - c.x); if (dd < d) { d = dd; best = ix; } }); return best; };
      const grid = cells.map(r => {
        const row = []; let seq = 0;
        r.forEach(c => { let ix = r.length === 1 ? colLeft(c) : colOf(c); if (ix < 0) ix = seq++; row[ix] = row[ix] ? row[ix] + ' ' + c.t : c.t; });
        return Array.from(row, x => x == null ? '' : x);
      });
      const used = []; grid.forEach(r => r.forEach((c, i) => { if (c) used[i] = 1; }));
      const keep = []; used.forEach((u, i) => { if (u) keep.push(i); });
      return grid.map(r => keep.map(i => r[i] || ''));
    }
    const colL = n => { let s = ''; n++; while (n > 0) { const m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; };
    const toNum = c => { const t = String(c).replace(/[₹$€£,\s]/g, ''); return /^-?\d+(\.\d+)?$/.test(t) && !/^-?0\d/.test(t) && t.replace(/[-.]/g, '').length <= 15 ? t : null; };
    const sheetXml = g => '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>' +
      g.map((r, ri) => '<row r="' + (ri + 1) + '">' + r.map((c, ci) => { if (c === '' || c == null) return ''; const ref = colL(ci) + (ri + 1), n = toNum(c); return n != null ? '<c r="' + ref + '"><v>' + n + '</v></c>' : '<c r="' + ref + '" t="inlineStr"><is><t xml:space="preserve">' + xe(c) + '</t></is></c>'; }).join('') + '</row>').join('') + '</sheetData></worksheet>';
    function buildXlsx(sheets) {
      const f = [], n = sheets.length;
      f.push({ name: '[Content_Types].xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' + sheets.map((s, i) => '<Override PartName="/xl/worksheets/sheet' + (i + 1) + '.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('') + '</Types>' });
      f.push({ name: '_rels/.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>' });
      f.push({ name: 'xl/workbook.xml', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>' + sheets.map((s, i) => '<sheet name="' + xe(s.name) + '" sheetId="' + (i + 1) + '" r:id="rId' + (i + 1) + '"/>').join('') + '</sheets></workbook>' });
      f.push({ name: 'xl/_rels/workbook.xml.rels', data: '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + sheets.map((s, i) => '<Relationship Id="rId' + (i + 1) + '" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet' + (i + 1) + '.xml"/>').join('') + '</Relationships>' });
      sheets.forEach((s, i) => f.push({ name: 'xl/worksheets/sheet' + (i + 1) + '.xml', data: sheetXml(s.grid) }));
      return zip(f);
    }

    /* ---------- compress / resize engine ---------- */
    async function rasterize(pdf, scale, q, onp) {
      await loadPdfLib(); const { PDFDocument } = PDFLib, out = await PDFDocument.create();
      for (let n = 1; n <= pdf.numPages; n++) {
        const page = await pdf.getPage(n), v1 = page.getViewport({ scale: 1 }), sc = Math.min(scale, 3200 / Math.max(v1.width, v1.height)), vp = page.getViewport({ scale: sc });
        const c = document.createElement('canvas'); c.width = Math.ceil(vp.width); c.height = Math.ceil(vp.height);
        const ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        await page.render({ canvasContext: ctx, viewport: vp }).promise;
        const blob = await new Promise(r => c.toBlob(r, 'image/jpeg', q)), im = await out.embedJpg(await blob.arrayBuffer());
        out.addPage([v1.width, v1.height]).drawImage(im, { x: 0, y: 0, width: v1.width, height: v1.height });
        c.width = c.height = 0; page.cleanup(); if (onp) onp(n, pdf.numPages); await wait();
      }
      return out.save({ useObjectStreams: true });
    }
    const LAD = [[2.2, .9], [2, .8], [1.7, .7], [1.5, .62], [1.3, .55], [1.15, .48], [1, .42], [.85, .36], [.7, .3], [.55, .25]];
    async function toTarget(pdf, target, onp, note) {
      let lo = 0, hi = LAD.length - 1, best = null;
      while (lo <= hi) {
        const mid = (lo + hi) >> 1; note('Trying quality level ' + (mid + 1) + ' of ' + LAD.length + '…');
        const b = await rasterize(pdf, LAD[mid][0], LAD[mid][1], onp);
        if (b.length <= target) { best = b; hi = mid - 1; } else lo = mid + 1;
      }
      if (best) return { bytes: best, ok: true };
      note('Trying the smallest possible size…');
      return { bytes: await rasterize(pdf, LAD[LAD.length - 1][0], LAD[LAD.length - 1][1], onp), ok: false };
    }
    async function inflate(file, target) {
      await loadPdfLib(); const { PDFDocument } = PDFLib, buf = await file.arrayBuffer();
      const base = (await (await PDFDocument.load(buf, { ignoreEncryption: true })).save()).length;
      if (target <= base) throw new Error('Your PDF is already ' + fs(base) + '. Enter a bigger size than that.');
      const rnd = n => { const u = new Uint8Array(n); for (let o = 0; o < n; o += 65536) crypto.getRandomValues(u.subarray(o, Math.min(n, o + 65536))); return u; };
      let pad = Math.max(1, target - base - 90), bytes;
      for (let k = 0; k < 4; k++) {
        const d = await PDFDocument.load(buf, { ignoreEncryption: true }); d.context.register(d.context.stream(rnd(pad)));
        bytes = await d.save(); const diff = target - bytes.length;
        if (diff <= 0 && diff >= -64) break; pad = Math.max(1, pad + diff + 20);
      }
      return bytes;
    }

    /* ---------- UI ---------- */
    const SIZEHINT = 'KB / MB here means 1 KB = 1000 bytes for reducing (so the result is safely under the limit) and 1024 bytes for increasing.';
    const PANES = {
      word: { h: '📝 Convert PDF to Word (.docx)', f: '<label class="fld"><span>Pages (optional)</span><input id="p-range" placeholder="All pages, or e.g. 1-3,5"></label>', b: 'Convert to Word', n: 'Best for PDFs made from Word / websites (text can be selected). Layout is simplified – headings, paragraphs and tab-spaced columns are kept; images are not. Scanned PDFs (photos of paper) contain no text and need OCR software.' },
      excel: { h: '📊 Convert PDF to Excel (.xlsx)', f: '<label class="fld"><span>Pages (optional)</span><input id="p-range" placeholder="All pages, or e.g. 1-3,5"></label><label class="fld"><span>Sheets</span><select id="p-sheet"><option value="one">All pages in one sheet</option><option value="each">One sheet per page</option></select></label>', b: 'Convert to Excel', n: 'Works best on PDFs with real tables (bank statements, price lists, reports). Numbers become real Excel numbers. Always check the result against your PDF.' },
      comp: { h: '🗜 Compress PDF (reduce size)', f: '<label class="fld"><span>Compression level</span><select id="p-lvl"><option value="1">Light – keeps text selectable (small saving)</option><option value="2" selected>Medium – good quality, much smaller</option><option value="3">High – smaller, a little softer</option><option value="4">Extreme – smallest, lower quality</option></select></label>', b: 'Compress PDF', n: 'Medium / High / Extreme turn each page into a compressed picture, so text can no longer be selected or searched (it still looks the same). Use Light if you need selectable text. If the file cannot be made smaller, your original is kept.' },
      size: { h: '📏 Set exact PDF size in KB / MB', f: '<label class="fld"><span>What do you want?</span><select id="p-mode"><option value="dec">Decrease – make it smaller than…</option><option value="inc">Increase – make it at least…</option></select></label><label class="fld"><span>Target size</span><input id="p-val" type="number" min="1" step="any" value="200"></label><label class="fld"><span>Unit</span><select id="p-unit"><option value="KB">KB</option><option value="MB">MB</option></select></label>', b: 'Change PDF size', n: 'Decrease: pages are converted to pictures of the best quality that fits under your limit (text becomes non-selectable). Increase: invisible filler data is added, so the pages look exactly the same – useful for portals that ask for a minimum file size. ' + SIZEHINT }
    };

    function build(el) {
      el.innerHTML = '<div class="tabs" id="p2-tabs"></div><div id="p2-pane"></div>';
      const tabs = [['word', '📝 PDF → Word'], ['excel', '📊 PDF → Excel'], ['comp', '🗜 Compress'], ['size', '📏 Size in KB/MB'], ['basic', '🖼 Images · Merge · Split']];
      const tb = $('#p2-tabs', el), pane = $('#p2-pane', el);
      tb.innerHTML = tabs.map(t => '<button class="tab" data-t="' + t[0] + '">' + t[1] + '</button>').join('');
      function show(t) {
        $$('.tab', tb).forEach(b => b.classList.toggle('on', b.dataset.t === t));
        if (t === 'basic') { pane.innerHTML = ''; orig(pane); return; }
        const P = PANES[t];
        pane.innerHTML = '<div class="card"><h3>' + P.h + '</h3><div class="form"><label class="fld wide"><span>Select PDF file</span><input type="file" id="p-file" accept="application/pdf"><small id="p-info"></small></label>' + P.f + '</div>' +
          '<div class="row"><button class="btn" id="p-go" type="button">' + P.b + '</button></div><p id="p-msg" class="note"></p><div id="p-out"></div><p class="note">' + P.n + ' Your file never leaves your device.</p></div>';
        const msg = h => $('#p-msg', pane).innerHTML = h, out = $('#p-out', pane), go = $('#p-go', pane);
        $('#p-file', pane).addEventListener('change', e => { const f = e.target.files[0]; $('#p-info', pane).textContent = f ? 'Current size: ' + fs(f.size) : ''; out.innerHTML = ''; msg(''); });
        go.onclick = async () => {
          const f = $('#p-file', pane).files[0]; out.innerHTML = '';
          if (!f) return msg('<span class="err">Please select a PDF file first.</span>');
          go.disabled = true; msg('Working… please keep this tab open.');
          const done = (blob, name, extra) => {
            download(blob, name);
            out.innerHTML = '<div class="dl"><div><b>' + esc(name) + '</b><small>' + (extra || '') + 'Size: ' + fs(blob.size) + '</small></div><a class="btn sm" download="' + esc(name) + '" href="' + URL.createObjectURL(blob) + '">⬇ Download again</a></div>';
          };
          try {
            if (t === 'word' || t === 'excel') {
              const pdf = await openPdf(f), nums = pageNums($('#p-range', pane).value, pdf.numPages), pages = [];
              let chars = 0;
              for (let i = 0; i < nums.length; i++) { msg('Reading page ' + (i + 1) + ' of ' + nums.length + '…'); pages.push(await pageData(await pdf.getPage(nums[i]))); pages[i].it.forEach(x => chars += x.s.length); await wait(); }
              if (chars < 20 * nums.length) throw new Error('No readable text found. This PDF looks like a scanned image, so it cannot be converted without OCR. Try a PDF that was saved directly from Word, Excel or a website.');
              if (t === 'word') done(buildDocx(pages.map(wordParas)), baseName(f) + '.docx', nums.length + ' page(s) converted · ');
              else {
                const grids = pages.map(P => gridFromRows(toRows(P.it), P.W)), sheets = [];
                if ($('#p-sheet', pane).value === 'each') grids.forEach((g, i) => sheets.push({ name: 'Page ' + nums[i], grid: g }));
                else { const all = []; grids.forEach((g, i) => { if (i && all.length) all.push([]); g.forEach(r => all.push(r)); }); sheets.push({ name: 'PDF Data', grid: all }); }
                done(buildXlsx(sheets), baseName(f) + '.xlsx', nums.length + ' page(s) converted · ');
              }
              msg('<span style="color:var(--ok)">✓ Done – your download has started. Open it and check the data.</span>');
            } else if (t === 'comp') {
              const lvl = +$('#p-lvl', pane).value;
              let bytes;
              if (lvl === 1) {
                await loadPdfLib(); const d = await PDFLib.PDFDocument.load(await f.arrayBuffer(), { ignoreEncryption: true }); bytes = await d.save({ useObjectStreams: true });
              } else {
                const pdf = await openPdf(f), q = { 2: [1.5, .62], 3: [1.2, .5], 4: [.9, .38] }[lvl];
                bytes = await rasterize(pdf, q[0], q[1], (n, N) => msg('Compressing page ' + n + ' of ' + N + '…'));
              }
              if (bytes.length >= f.size) { msg('<span style="color:#b45309">This PDF is already well compressed – a smaller file was not possible' + (lvl === 1 ? ' with Light. Try Medium or High.' : '.') + ' Your original size is ' + fs(f.size) + '.</span>'); }
              else {
                const blob = new Blob([bytes], { type: 'application/pdf' });
                done(blob, baseName(f) + '-compressed.pdf', fs(f.size) + ' → ' + fs(blob.size) + ' (' + Math.round((1 - blob.size / f.size) * 100) + '% smaller) · ');
                msg('<span style="color:var(--ok)">✓ Compressed – your download has started.</span>');
              }
            } else {
              const val = parseFloat($('#p-val', pane).value), mb = $('#p-unit', pane).value === 'MB';
              if (!(val > 0)) throw new Error('Enter a size greater than 0.');
              if ($('#p-mode', pane).value === 'inc') {
                const target = Math.round(val * (mb ? 1048576 : 1024)), bytes = await inflate(f, target);
                const blob = new Blob([bytes], { type: 'application/pdf' });
                done(blob, baseName(f) + '-' + val + (mb ? 'MB' : 'KB') + '.pdf', fs(f.size) + ' → ' + fs(blob.size) + ' · ');
                msg('<span style="color:var(--ok)">✓ Size increased – your download has started. The pages look exactly the same.</span>');
              } else {
                const limit = Math.round(val * (mb ? 1e6 : 1e3)), target = Math.floor(limit * .97);
                if (f.size <= target) throw new Error('Your PDF is already ' + fs(f.size) + ', which is under your limit. Nothing to reduce.');
                const pdf = await openPdf(f), r = await toTarget(pdf, target, (n, N) => { }, s => msg(s + ' This can take a while for big files.'));
                if (r.bytes.length >= f.size) throw new Error('This PDF cannot be made smaller than ' + fs(f.size) + ' without losing too much quality.');
                const blob = new Blob([r.bytes], { type: 'application/pdf' });
                done(blob, baseName(f) + '-' + val + (mb ? 'MB' : 'KB') + '.pdf', fs(f.size) + ' → ' + fs(blob.size) + ' · ');
                msg(r.ok ? '<span style="color:var(--ok)">✓ Done – the file is under ' + val + ' ' + (mb ? 'MB' : 'KB') + '. Download has started.</span>' : '<span style="color:#b45309">Could not reach ' + val + ' ' + (mb ? 'MB' : 'KB') + ' – this is the smallest possible result (' + fs(blob.size) + '). Try splitting the PDF into fewer pages first.</span>');
              }
            }
          } catch (e) { msg('<span class="err">' + esc(e.message || 'Something went wrong.') + '</span>'); }
          go.disabled = false;
        };
        if (t === 'size') { const m = $('#p-mode', pane); m.addEventListener('change', () => { $('#p-val', pane).value = m.value === 'inc' ? 500 : 200; }); }
      }
      tb.addEventListener('click', e => { const b = e.target.closest('.tab'); if (b) show(b.dataset.t); });
      show('word');
    }
    T.render = build;
  } catch (e) { console.error('PDF upgrade failed', e); }
})();
/* =====================================================================
   PART 3 – Video Editing "Pro Guide": pictures, app-wise Beginner→Advanced steps,
   Windows + Mac shortcuts, export presets, fixes, 30-day plan, glossary
   Added as a 3rd button inside the existing Video Editor tool (nothing old is removed).
   ===================================================================== */
(function () {
  try {
    const T = TOOLS.find(x => x.id === 'video-editor');
    if (!T || T._guide) return; T._guide = 1;
    const orig = T.render;
    const E = s => esc(s);

    /* ---------------- PICTURES (inline SVG – always load, work offline) ---------------- */
    const S0 = '<svg viewBox="0 0 640 ', S1 = '" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:680px;height:auto;display:block;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;background:#f8fafc;font-family:system-ui,Arial,sans-serif" role="img" aria-label="';
    const tx = (x, y, t, o) => '<text x="' + x + '" y="' + y + '" font-size="' + ((o && o.s) || 12) + '" fill="' + ((o && o.c) || '#0f172a') + '"' + ((o && o.b) ? ' font-weight="700"' : '') + ((o && o.a) ? ' text-anchor="' + o.a + '"' : '') + '>' + t + '</text>';
    const rc = (x, y, w, h, f, o) => '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + ((o && o.r) || 6) + '" fill="' + f + '"' + ((o && o.st) ? ' stroke="' + o.st + '" stroke-width="' + (o.sw || 1.5) + '"' + (o.d ? ' stroke-dasharray="5 4"' : '') : '') + '/>';
    const PIC = {
      layout: S0 + '370' + S1 + 'Editor screen layout">' +
        rc(10, 10, 180, 200, '#e0e7ff', { st: '#6366f1' }) + tx(100, 35, '1  MEDIA / LIBRARY', { b: 1, a: 'middle' }) + tx(100, 58, 'Your clips, music,', { a: 'middle', s: 11 }) + tx(100, 74, 'photos, effects,', { a: 'middle', s: 11 }) + tx(100, 90, 'text, transitions', { a: 'middle', s: 11 }) +
        rc(205, 10, 250, 200, '#111827') + rc(230, 40, 200, 112, '#374151') + tx(330, 100, '▶ PREVIEW', { c: '#fff', b: 1, a: 'middle', s: 14 }) + tx(330, 28, '2  PREVIEW (what viewers see)', { c: '#fff', a: 'middle', s: 11, b: 1 }) + tx(330, 185, 'Play · full screen · ratio', { c: '#cbd5e1', a: 'middle', s: 11 }) +
        rc(470, 10, 160, 200, '#fef3c7', { st: '#f59e0b' }) + tx(550, 35, '3  INSPECTOR', { b: 1, a: 'middle' }) + tx(550, 58, 'Settings of the', { a: 'middle', s: 11 }) + tx(550, 74, 'selected clip:', { a: 'middle', s: 11 }) + tx(550, 90, 'size · speed · volume', { a: 'middle', s: 11 }) + tx(550, 106, 'colour · keyframes', { a: 'middle', s: 11 }) +
        rc(10, 222, 620, 138, '#ecfdf5', { st: '#10b981' }) + tx(20, 242, '4  TIMELINE (you build the video here, left → right)', { b: 1 }) +
        rc(20, 252, 60, 22, '#fde68a') + rc(100, 252, 90, 22, '#fde68a') + tx(24, 267, 'Text', { s: 11 }) + tx(104, 267, 'Title / caption', { s: 11 }) +
        rc(20, 280, 120, 26, '#93c5fd') + rc(144, 280, 150, 26, '#60a5fa') + rc(298, 280, 130, 26, '#93c5fd') + rc(432, 280, 90, 26, '#60a5fa') + tx(26, 297, 'Clip 1', { s: 11 }) + tx(150, 297, 'Clip 2', { s: 11 }) + tx(304, 297, 'Clip 3', { s: 11 }) + tx(438, 297, 'Clip 4', { s: 11 }) +
        rc(20, 312, 500, 24, '#86efac') + tx(26, 328, '♪ Music / voice-over (audio track)', { s: 11 }) +
        '<line x1="330" y1="248" x2="330" y2="345" stroke="#ef4437" stroke-width="2.5"/><polygon points="322,244 338,244 330,256" fill="#ef4437"/>' + tx(338, 346, 'PLAYHEAD = “now”', { c: '#ef4437', s: 11, b: 1 }) + '</svg>',
      split: S0 + '250' + S1 + 'Split and trim">' +
        tx(14, 22, 'SPLIT = cut one clip into two pieces at the playhead', { b: 1, s: 13 }) +
        rc(20, 36, 600, 36, '#93c5fd') + tx(30, 59, 'One long clip', { s: 12 }) + '<line x1="250" y1="30" x2="250" y2="80" stroke="#ef4437" stroke-width="2.5"/>' + tx(256, 92, '✂ Split here (playhead)', { c: '#ef4437', s: 11, b: 1 }) +
        tx(14, 125, 'Split again where the bad part ends → delete the middle piece → close the gap', { b: 1, s: 13 }) +
        rc(20, 138, 230, 34, '#93c5fd') + rc(250, 138, 140, 34, '#fecaca', { st: '#ef4437', d: 1 }) + rc(390, 138, 230, 34, '#93c5fd') + tx(268, 160, 'DELETE this', { c: '#b91c1c', s: 11, b: 1 }) +
        tx(14, 205, 'TRIM = drag the edge of a clip to make it shorter or longer', { b: 1, s: 13 }) +
        rc(20, 215, 300, 26, '#93c5fd') + '<polygon points="330,228 312,218 312,238" fill="#0f172a"/>' + tx(345, 233, '← drag the edge', { s: 11 }) + '</svg>',
      jl: S0 + '270' + S1 + 'J-cut and L-cut">' +
        tx(14, 22, 'J-CUT: you HEAR the next clip before you SEE it', { b: 1, s: 13 }) +
        tx(14, 48, 'Video', { s: 11, c: '#64748b' }) + rc(60, 36, 220, 20, '#93c5fd') + rc(280, 36, 260, 20, '#60a5fa') + tx(66, 51, 'Clip A', { s: 11 }) + tx(286, 51, 'Clip B', { s: 11 }) +
        tx(14, 78, 'Audio', { s: 11, c: '#64748b' }) + rc(60, 66, 190, 20, '#86efac') + rc(210, 66, 330, 20, '#4ade80') + tx(66, 81, 'Audio A', { s: 11 }) + tx(216, 81, 'Audio B starts early ↩', { s: 11 }) +
        '<line x1="280" y1="30" x2="280" y2="95" stroke="#ef4437" stroke-dasharray="4 3"/>' +
        tx(14, 135, 'L-CUT: you keep HEARING the first clip while the next picture appears', { b: 1, s: 13 }) +
        tx(14, 161, 'Video', { s: 11, c: '#64748b' }) + rc(60, 149, 220, 20, '#93c5fd') + rc(280, 149, 260, 20, '#60a5fa') + tx(66, 164, 'Clip A', { s: 11 }) + tx(286, 164, 'Clip B', { s: 11 }) +
        tx(14, 191, 'Audio', { s: 11, c: '#64748b' }) + rc(60, 179, 290, 20, '#4ade80') + rc(350, 179, 190, 20, '#86efac') + tx(66, 194, 'Audio A continues →', { s: 11 }) + tx(356, 194, 'Audio B', { s: 11 }) +
        '<line x1="280" y1="143" x2="280" y2="208" stroke="#ef4437" stroke-dasharray="4 3"/>' + tx(286, 225, 'Red line = where the picture cuts', { c: '#ef4437', s: 11 }) + tx(14, 250, 'Use it for interviews, vlogs, stories – the cut feels smooth and natural.', { s: 12, c: '#475569' }) + '</svg>',
      key: S0 + '260' + S1 + 'Keyframes zoom">' +
        tx(14, 22, 'KEYFRAMES: set a value at two moments → the app animates between them', { b: 1, s: 13 }) +
        rc(20, 40, 600, 34, '#e2e8f0') + '<polygon points="80,57 90,47 100,57 90,67" fill="#2563eb"/><polygon points="520,57 530,47 540,57 530,67" fill="#2563eb"/>' +
        tx(90, 92, 'Keyframe 1', { a: 'middle', s: 11, b: 1 }) + tx(530, 92, 'Keyframe 2', { a: 'middle', s: 11, b: 1 }) + '<line x1="92" y1="57" x2="528" y2="57" stroke="#2563eb" stroke-dasharray="4 3"/>' +
        rc(60, 112, 110, 62, '#cbd5e1', { st: '#475569' }) + tx(115, 148, 'Scale 100%', { a: 'middle', s: 11 }) + '<text x="205" y="150" font-size="28" fill="#2563eb">➜</text>' + rc(250, 104, 140, 78, '#cbd5e1', { st: '#475569' }) + tx(320, 148, 'Scale 115%', { a: 'middle', s: 11 }) +
        tx(60, 205, 'Result: a slow “push-in” zoom. Same idea works for', { s: 12 }) + tx(60, 222, 'position (pan), rotation and opacity (fade).', { s: 12 }) +
        '<path d="M430 190 C 470 190, 480 120, 520 120 S 570 175, 610 125" fill="none" stroke="#10b981" stroke-width="3"/>' + tx(520, 205, 'Ease in / out = smooth start & stop', { a: 'middle', s: 11, c: '#047857', b: 1 }) + tx(14, 250, 'Always turn on Ease In / Ease Out so the movement does not look robotic.', { s: 12, c: '#475569' }) + '</svg>',
      ratio: S0 + '290' + S1 + 'Aspect ratios">' +
        tx(14, 22, 'Pick the shape that matches where you will post', { b: 1, s: 13 }) +
        rc(30, 40, 90, 160, '#bfdbfe', { st: '#2563eb' }) + rc(30, 40, 90, 24, '#fecaca', { r: 0 }) + rc(30, 176, 90, 24, '#fecaca', { r: 0 }) + tx(75, 125, '9:16', { a: 'middle', b: 1, s: 15 }) +
        tx(75, 218, 'Reels · Shorts', { a: 'middle', s: 11 }) + tx(75, 232, 'TikTok · Status', { a: 'middle', s: 11 }) + tx(75, 250, '1080×1920', { a: 'middle', s: 11, c: '#475569' }) +
        rc(160, 80, 160, 90, '#bbf7d0', { st: '#16a34a' }) + tx(240, 130, '16:9', { a: 'middle', b: 1, s: 15 }) + tx(240, 218, 'YouTube · TV · Laptop', { a: 'middle', s: 11 }) + tx(240, 250, '1920×1080', { a: 'middle', s: 11, c: '#475569' }) +
        rc(360, 70, 100, 100, '#fde68a', { st: '#d97706' }) + tx(410, 125, '1:1', { a: 'middle', b: 1, s: 15 }) + tx(410, 218, 'Square post', { a: 'middle', s: 11 }) + tx(410, 250, '1080×1080', { a: 'middle', s: 11, c: '#475569' }) +
        rc(500, 55, 100, 125, '#e9d5ff', { st: '#9333ea' }) + tx(550, 125, '4:5', { a: 'middle', b: 1, s: 15 }) + tx(550, 218, 'Instagram feed', { a: 'middle', s: 11 }) + tx(550, 250, '1080×1350', { a: 'middle', s: 11, c: '#475569' }) +
        tx(14, 280, 'Red areas on 9:16 = app buttons & captions cover them. Keep your text in the middle.', { s: 11, c: '#b91c1c' }) + '</svg>',
      audio: S0 + '260' + S1 + 'Audio balance and ducking">' +
        tx(14, 22, 'VOICE must be louder than MUSIC – music goes down while someone talks (ducking)', { b: 1, s: 13 }) +
        tx(14, 52, 'Voice', { s: 11, c: '#64748b' }) + '<g fill="#2563eb">' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => '<rect x="' + (70 + i * 13) + '" y="' + (46 - [10, 22, 14, 26, 18, 24, 12, 20, 26, 16, 22, 12, 18, 8][i] / 2) + '" width="8" height="' + [10, 22, 14, 26, 18, 24, 12, 20, 26, 16, 22, 12, 18, 8][i] + '" rx="2"/>').join('') + '</g>' +
        tx(14, 112, 'Music', { s: 11, c: '#64748b' }) + '<path d="M70 118 L70 100 L250 100 L270 80 L420 80 L440 100 L620 100 L620 118 Z" fill="#86efac" stroke="#16a34a"/>' +
        tx(345, 76, 'music volume goes DOWN while voice plays', { a: 'middle', s: 11, c: '#047857', b: 1 }) +
        rc(40, 140, 560, 60, '#fff', { st: '#cbd5e1' }) + tx(60, 162, 'Voice: peaks around  −12 to −6 dB', { s: 12 }) + tx(60, 182, 'Music under speech: about 12–20 dB lower than the voice', { s: 12 }) + tx(60, 232, 'Fade the music in at the start and out at the end (1–2 seconds).', { s: 12, c: '#475569' }) + '</svg>',
      colour: S0 + '250' + S1 + 'Colour correction basics">' +
        tx(14, 22, 'COLOUR: first FIX the picture, then add a LOOK', { b: 1, s: 13 }) +
        '<defs><linearGradient id="g1" x1="0" x2="1"><stop offset="0" stop-color="#1e293b"/><stop offset="1" stop-color="#94a3b8"/></linearGradient><linearGradient id="g2" x1="0" x2="1"><stop offset="0" stop-color="#000"/><stop offset="1" stop-color="#fff"/></linearGradient></defs>' +
        rc(30, 40, 170, 80, 'url(#g1)') + tx(115, 140, 'Before: flat & dull', { a: 'middle', s: 11 }) + '<text x="222" y="88" font-size="26" fill="#2563eb">➜</text>' + rc(260, 40, 170, 80, 'url(#g2)') + tx(345, 140, 'After: real black → real white', { a: 'middle', s: 11 }) +
        rc(470, 40, 140, 80, '#fff', { st: '#cbd5e1' }) + tx(540, 58, 'WAVEFORM scale', { a: 'middle', s: 11, b: 1 }) + tx(480, 78, '100  whites (not above)', { s: 10 }) + tx(480, 94, '60–70 skin tones', { s: 10 }) + tx(480, 110, '0–5  blacks', { s: 10 }) +
        tx(30, 175, '1  Exposure / brightness   2  Contrast   3  White balance   4  Saturation', { s: 12 }) + tx(30, 195, '5  Match all clips   6  Add filter / LUT at 30–60% strength', { s: 12 }) + tx(30, 228, 'Do not over-saturate – skin should look natural, not orange.', { s: 12, c: '#475569' }) + '</svg>',
      speed: S0 + '250' + S1 + 'Speed ramp curve">' +
        tx(14, 22, 'SPEED RAMP: slow → fast → slow inside one clip (the “velocity” edit)', { b: 1, s: 13 }) +
        '<line x1="60" y1="200" x2="600" y2="200" stroke="#94a3b8"/><line x1="60" y1="40" x2="60" y2="200" stroke="#94a3b8"/>' + tx(330, 225, 'Time in the clip →', { a: 'middle', s: 11, c: '#64748b' }) + tx(14, 120, 'Speed', { s: 11, c: '#64748b' }) +
        '<path d="M60 170 C 150 170, 190 170, 240 120 S 330 55, 400 55 S 470 120, 540 170 L 600 170" fill="none" stroke="#2563eb" stroke-width="3.5"/>' +
        '<circle cx="60" cy="170" r="5" fill="#ef4437"/><circle cx="240" cy="120" r="5" fill="#ef4437"/><circle cx="400" cy="55" r="5" fill="#ef4437"/><circle cx="540" cy="170" r="5" fill="#ef4437"/>' +
        tx(120, 190, '0.5x slow', { a: 'middle', s: 11 }) + tx(400, 45, '3x fast (action peak)', { a: 'middle', s: 11, b: 1 }) + tx(580, 190, '0.5x', { a: 'middle', s: 11 }) +
        tx(14, 245, 'Put the fast part on the big action or the music beat. Menu: Speed → Curve (CapCut / VN), Time Remapping (Premiere), Retime Curve (DaVinci).', { s: 10.5, c: '#475569' }) + '</svg>'
    };
    const PICS = [
      ['layout', 'Know your screen (same in every editor)', ['Every editor – CapCut, VN, Premiere, DaVinci, Filmora – has these 4 parts. Only the names change a little.', 'Drag the red playhead: the Preview shows that exact moment.', 'Click a clip on the timeline and the Inspector shows its settings.']],
      ['split', 'Split, delete and trim', ['Most of editing is simply removing the boring parts.', 'Split at the start of the bad part, split again at its end, delete the middle, close the gap.', 'To only shorten a clip, drag its edge (trim).']],
      ['ratio', 'Aspect ratio – choose before you start', ['Set the ratio in the project settings or Canvas / Ratio menu first, otherwise you will get black bars.', 'Keep faces and text away from the red zones on 9:16 videos.']],
      ['audio', 'Audio: voice first, music second', ['Bad audio makes people leave faster than bad video.', 'Use Auto-ducking if your app has it, or lower the music with volume keyframes.']],
      ['jl', 'J-cut and L-cut – the “professional” cut', ['Detach / unlink the audio from the video, then slide the audio slightly earlier (J) or later (L).', 'Add a tiny fade on the audio join so it does not click.']],
      ['key', 'Keyframes – animation without effort', ['Create keyframe 1, move the playhead, change the value → keyframe 2 is created.', 'Use for zoom-in, text sliding in, picture-in-picture movement and fades.']],
      ['speed', 'Speed ramp (slow-motion to fast-motion)', ['Works best on clips with clear movement (jump, walk, car, sports).', 'Match the fast part to a beat in the music.']],
      ['colour', 'Colour correction', ['Correct first (exposure, contrast, white balance), then add a creative filter or LUT.', 'Match clips shot at different times so the video looks like one piece.']]
    ];

    /* ---------------- APP GUIDES: Beginner → Intermediate → Advanced ---------------- */
    const APPS = [
      { n: 'CapCut', i: '✂', pl: 'Android · iPhone · Windows · Mac · Web', pr: 'Free (some Pro features paid)', lv: 'Beginner → Intermediate', best: 'Reels, Shorts, TikTok, captions, quick trending edits', url: 'https://www.capcut.com', q: 'capcut video editing full tutorial hindi',
        b: ['Open CapCut → New project → tap your clips in the order you want → Add. (On PC: Import, then drag clips onto the timeline.)', 'Drag the white playhead to where you want to cut → select the clip → Split (PC: Ctrl+B / Mac: Cmd+B). Tap the unwanted piece → Delete.', 'Add music: Audio → Sounds (or Extracted to take audio from another video). Select the audio and lower the Volume.', 'Add words: Text → Add text. Type, choose a font, drag it on the preview. For subtitles use Text → Auto captions → Generate, then read and correct every line.', 'Add a transition: tap the small white square between two clips → pick one → keep it 0.3–0.5 seconds.', 'Choose Ratio (9:16 for Reels) → Export (PC: Ctrl+E / Mac: Cmd+E) → 1080p, 30 fps.'],
        m: ['Speed → Curve: choose a ready preset or Custom and drag the dots for a speed ramp (see picture).', 'Keyframes: select the clip, tap the ◇ diamond at the start, move the playhead, change Scale/Position – the second keyframe is made for you.', 'Audio → Beats → Auto beat: cut your clips on the beat markers for rhythm.', 'Overlay → Add overlay for picture-in-picture; use Mask and blend mode “Screen” for light/fire/glitch overlays.', 'Cutout / Remove background on a person to put text behind them.'],
        a: ['Layer several overlays with masks and keyframes to reveal scenes; use Freeze frame for dramatic stops.', 'Colour: Adjust → use HSL, Curves, Highlights/Shadows first; add a filter at 30–60% strength last.', 'Audio clean-up: select voice → Audio → Reduce noise / Enhance voice, then add music ducking.', 'Save your text style and effects as presets/templates to keep a consistent channel look.', 'For long videos on PC use Proxy/lower preview quality so editing stays smooth; export 1080p or 4K at 30/60 fps.'] },
      { n: 'VN Video Editor', i: '🎞', pl: 'Android · iPhone · Windows · Mac', pr: 'Free, no watermark', lv: 'Beginner → Advanced', best: 'Clean multi-track editing on phone with keyframes and curves', url: 'https://www.vlognow.me', q: 'vn video editor full tutorial hindi',
        b: ['Tap the + button → Create project → select clips → Next.', 'Tap a clip, move the playhead, tap Split. Select the extra part → Delete.', 'Audio → Music or Extract to add sound. Tap the audio to change volume and add Fade in/out.', 'Use Text, Stickers, Filters and Effects from the bottom menu. Transitions appear when you tap the small square between clips.', 'Tap the ratio icon (9:16 / 16:9 / 1:1), then the export arrow at the top-right → 1080p, 30 fps → Export.'],
        m: ['Speed → Curve for slow-motion and speed ramps.', 'Keyframe button (◇): add one keyframe, move on the timeline, change Scale/Position/Rotation for zoom and movement.', 'Beats: place markers on the music and cut on them.', 'Chroma key (green screen) and Mask: remove a colour or reveal only part of the picture.', 'Use multiple video tracks (PIP) for split-screen and overlays.'],
        a: ['Colour: Adjust → curves, HSL, and import LUT files for a cinematic look.', 'Use Voice noise reduction before adding music; then reduce music under speech.', 'Keep projects organised – duplicate a finished project and change only text/clips for series content.', 'On PC/Mac VN gives big-screen precision: use it for longer edits.'] },
      { n: 'InShot', i: '📱', pl: 'Android · iPhone', pr: 'Free with ads / Pro', lv: 'Beginner', best: 'Very fast edits, canvas & background for Instagram, photo + music videos', url: 'https://inshot.com', q: 'inshot video editing tutorial hindi',
        b: ['Tap Video → New → choose clips → tick.', 'Tap the clip → Trim or Split (scissors) and set start/end.', 'Canvas switches the ratio; Background adds blur or colour instead of black bars.', 'Add Music, Text, Sticker and Filter from the bottom bar; Speed for slow/fast; the small icon between clips for Transition.', 'Tap Save → 1080p, 30 fps.'],
        m: ['Keyframes (◇) for zoom and movement; Voiceover to record narration; Effects like glitch/shake.', 'Use Adjust to correct brightness, contrast, saturation before adding a filter.'],
        a: ['InShot is made for speed. When you need multi-layer edits, colour grading or long videos, move the same project style to CapCut, VN or DaVinci Resolve.'] },
      { n: 'Adobe Premiere Pro', i: '🎬', pl: 'Windows · Mac', pr: 'Paid subscription', lv: 'Intermediate → Pro', best: 'YouTube, clients, films, long videos, team workflows', url: 'https://www.adobe.com/products/premiere.html', q: 'premiere pro full course hindi',
        b: ['File → New → Project. Press Ctrl+I (Mac: Cmd+I) to Import. Drag a clip onto the timeline – a sequence is created that matches your footage.', 'Space = play/pause. V = selection tool, C = razor tool. Cut at the playhead with Ctrl+K (Mac: Cmd+K). Select the piece and press Shift+Delete to delete and close the gap (ripple delete).', 'Audio: Window → Essential Sound. Select the voice clip → Dialogue → Repair → Reduce noise. Select music → Music → Ducking.', 'Titles: Type tool (T) in the Program monitor, or Window → Essential Graphics → New layer → Text.', 'Transitions: Effects panel → Video Transitions → Cross Dissolve → drag between two clips (or press Ctrl+D / Cmd+D on a cut).', 'Export: Ctrl+M (Mac: Cmd+M) → Format H.264 → Preset “YouTube 1080p Full HD” → Export.'],
        m: ['Effect Controls → Position/Scale/Rotation/Opacity. Click the stopwatch to add keyframes; right-click a keyframe → Ease In / Ease Out.', 'Speed ramp: right-click the clip’s fx badge → Time Remapping → Speed, add keyframes and drag them. Or press Ctrl+R / Cmd+R for constant speed.', 'Lumetri Color panel: Basic Correction (white balance, exposure, contrast) → then Creative (Look/LUT) → Curves.', 'Nest clips (right-click → Nest) to treat many layers as one; use Adjustment Layers to apply one effect to many clips.', 'J-cut / L-cut: unlink audio (Ctrl+L / Cmd+L), then drag the audio edge earlier or later.'],
        a: ['Use Lumetri Scopes (Window → Lumetri Scopes) – keep whites below 100 and skin around 60–70 on the waveform.', 'Edit with Proxies for 4K: Project panel → Ingest settings → Create proxies. Toggle proxy button in the Program monitor.', 'Text-based editing: Window → Text → Transcribe sequence; edit captions and export subtitle files.', 'Sequence → Auto Reframe Sequence converts 16:9 into 9:16/1:1 automatically.', 'Dynamic Link to After Effects for motion graphics; Adobe Media Encoder to queue many exports; set Bitrate manually (YouTube 1080p ≈ 8–12 Mbps).'] },
      { n: 'DaVinci Resolve', i: '🎨', pl: 'Windows · Mac · Linux', pr: 'Free version is very powerful; Studio paid', lv: 'Beginner → Pro', best: 'Best colour grading, audio (Fairlight), VFX (Fusion) – all free', url: 'https://www.blackmagicdesign.com/products/davinciresolve', q: 'davinci resolve full course hindi',
        b: ['Create a new project. Go to the Media page and import clips (Ctrl+I / Cmd+I), or drag them in. Switch to the Cut page (quick) or Edit page (full control).', 'Drag clips to the timeline. Move the playhead and press Ctrl+B (Mac: Cmd+B) to split. Select the piece → Delete; Shift+Delete removes it and closes the gap.', 'Effects Library (top-left): Titles → drag Text above the video; Video Transitions → drag between two clips.', 'Add music to an audio track; drag the little white volume line down to lower it; drag the fade handles at the clip corners.', 'Deliver page: choose the preset YouTube 1080p (or H.264 Master) → Add to Render Queue → Render All. For a quick file use Quick Export (Ctrl+Shift+E / Cmd+Shift+E).'],
        m: ['Inspector → Transform: click the ◇ keyframe diamonds next to Zoom/Position; right-click the keyframe → Ease.', 'Speed: right-click clip → Change Clip Speed (Ctrl+R / Cmd+R) or Retime Controls for ramps.', 'Colour page: Primaries wheels (Lift = shadows, Gamma = mid, Gain = highlights), then Auto Color or LUTs.', 'Fairlight page (or Edit): use Dialogue Leveler and noise reduction on voice.', 'Use Compound Clips to group layers; use Markers (M) to mark beats and mistakes.'],
        a: ['Colour: use serial & parallel nodes, Qualifier (pick a colour), Power Windows (masks) and tracking; watch the Waveform, Parade and Vectorscope.', 'Fusion page: motion graphics, tracking, screen replacement. Magic Mask & noise reduction are in the Studio version.', 'Proxy workflow: Playback → Proxy Mode, and Media Pool → Generate Proxy Media for 4K+.', 'Use the Deliver page presets and set Quality / bitrate; render in the right codec (H.264 for web, ProRes for archive).', 'Switch pages with Shift+2 … Shift+8 (Media, Cut, Edit, Fusion, Color, Fairlight, Deliver) on Windows and Mac.'] },
      { n: 'Filmora', i: '🪄', pl: 'Windows · Mac · Phone', pr: 'Free with watermark / paid', lv: 'Beginner → Intermediate', best: 'Easy drag-and-drop, lots of effects, titles and AI helpers', url: 'https://filmora.wondershare.com', q: 'filmora video editing tutorial hindi',
        b: ['New Project → Import media → drag clips onto the timeline.', 'Move the playhead and click the scissors icon (Ctrl+B / Cmd+B) to split. Select the extra piece → Delete (Shift+Delete ripples).', 'Titles, Audio, Effects and Transitions are in the top library tabs – drag them onto the timeline.', 'Double-click a clip to change Speed, Rotate, Crop and Colour in the panel.', 'Export (Ctrl+E / Cmd+E) → Local → MP4 → 1080p → Export.'],
        m: ['Keyframes: clip panel → Animation → Customize; add keyframes for zoom and movement.', 'Speed Ramping: Speed → Speed Ramping presets or Customize.', 'Chroma key: Video → Chroma Key for green screen; Auto Beat Sync to cut on music; Silence detection to remove pauses.'],
        a: ['Motion tracking to stick text/blur to an object; masks for reveal effects.', 'Audio ducking and denoise for clear voice; Colour match to make clips look alike.', 'Group repeat items as presets and use Proxy to keep playback smooth.'] },
      { n: 'Final Cut Pro · iMovie', i: '🍎', pl: 'Mac (iMovie also iPhone / iPad)', pr: 'iMovie free · Final Cut Pro paid (one time)', lv: 'Beginner (iMovie) → Pro (FCP)', best: 'Smooth fast editing on Mac with great colour and audio tools', url: 'https://www.apple.com/final-cut-pro/', q: 'final cut pro tutorial for beginners',
        b: ['iMovie: Create New → Movie → Import Media. Final Cut Pro: File → New → Library, then Import (Cmd+I).', 'Drag clips into the main storyline. Press Space to play. Press Cmd+B to split at the playhead (B = Blade tool). Select the piece → Delete.', 'Titles & Generators sidebar → drag a title above your clip. Transitions: select a cut and press Cmd+T.', 'Share (iMovie) / File → Share → Export File (Final Cut Pro, Cmd+E) → 1080p → Save.'],
        m: ['Retime menu (speedometer) → Slow / Fast, or Retime Editor (Cmd+R) for ramps.', 'Animate with keyframes in the Inspector (video animation) and Transform tool.', 'Connect B-roll above the main story with Q; audio fades with the handles at clip edges.', 'Colour Board / Colour Wheels to fix exposure and colour.'],
        a: ['Multicam clips for several cameras, Compound Clips (Option+G), Roles to organise dialogue/music/effects.', 'Proxy media for 4K+ footage; Colour scopes (Waveform/Vectorscope) for exact grading.', 'Use Motion templates for repeatable lower thirds and titles.'] }
    ];

    /* ---------------- SHORTCUTS: Windows | Mac ---------------- */
    const SC = [
      ['Adobe Premiere Pro', [
        ['Play / Pause', 'Space', 'Space'], ['Play backwards / pause / forward', 'J / K / L', 'J / K / L'], ['Selection tool', 'V', 'V'], ['Razor tool', 'C', 'C'],
        ['Split (add edit) at playhead', 'Ctrl+K', 'Cmd+K'], ['Split all tracks at playhead', 'Ctrl+Shift+K', 'Cmd+Shift+K'], ['Delete', 'Delete', 'Delete'], ['Ripple delete (close gap)', 'Shift+Delete', 'Shift+Delete'],
        ['Undo', 'Ctrl+Z', 'Cmd+Z'], ['Redo', 'Ctrl+Shift+Z', 'Cmd+Shift+Z'], ['Copy / Paste', 'Ctrl+C / Ctrl+V', 'Cmd+C / Cmd+V'], ['Paste attributes (effects)', 'Ctrl+Alt+V', 'Cmd+Option+V'],
        ['Import media', 'Ctrl+I', 'Cmd+I'], ['Save', 'Ctrl+S', 'Cmd+S'], ['Export media', 'Ctrl+M', 'Cmd+M'], ['Mark In / Mark Out', 'I / O', 'I / O'], ['Add marker', 'M', 'M'],
        ['Speed / Duration', 'Ctrl+R', 'Cmd+R'], ['Add default transition', 'Ctrl+D', 'Cmd+D'], ['Link / Unlink clips', 'Ctrl+L', 'Cmd+L'], ['Group', 'Ctrl+G', 'Cmd+G'], ['Snap on / off', 'S', 'S'],
        ['Zoom timeline in / out', '= / −', '= / −'], ['Zoom to fit sequence', '\\', '\\'], ['Previous / Next frame', '← / →', '← / →'], ['Jump to previous / next cut', '↑ / ↓', '↑ / ↓'], ['Type (text) tool', 'T', 'T'], ['Slip tool', 'Y', 'Y'], ['Rate stretch tool', 'R', 'R'], ['Enable / disable clip', 'Shift+E', 'Shift+E'], ['Maximize panel under cursor', '` (backtick)', '` (backtick)']
      ]],
      ['DaVinci Resolve', [
        ['Play / Pause', 'Space', 'Space'], ['Play backwards / pause / forward', 'J / K / L', 'J / K / L'], ['Selection mode', 'A', 'A'], ['Blade mode', 'B', 'B'], ['Trim edit mode', 'T', 'T'],
        ['Split clip at playhead', 'Ctrl+B  (or Ctrl+\\)', 'Cmd+B  (or Cmd+\\)'], ['Delete', 'Delete', 'Delete'], ['Ripple delete (close gap)', 'Shift+Delete', 'Shift+Delete'],
        ['Undo', 'Ctrl+Z', 'Cmd+Z'], ['Redo', 'Ctrl+Shift+Z', 'Cmd+Shift+Z'], ['Import media', 'Ctrl+I', 'Cmd+I'], ['Save project', 'Ctrl+S', 'Cmd+S'], ['Quick Export', 'Ctrl+Shift+E', 'Cmd+Shift+E'],
        ['Mark In / Mark Out', 'I / O', 'I / O'], ['Add marker', 'M', 'M'], ['Change clip speed', 'Ctrl+R', 'Cmd+R'], ['Add default transition', 'Ctrl+T', 'Cmd+T'], ['Snapping on / off', 'N', 'N'],
        ['Zoom timeline in / out', 'Ctrl+= / Ctrl+−', 'Cmd+= / Cmd+−'], ['Fit timeline to window', 'Shift+Z', 'Shift+Z'], ['Previous / Next frame', '← / →', '← / →'], ['Previous / Next cut', '↑ / ↓', '↑ / ↓'],
        ['Go to Media / Cut / Edit page', 'Shift+2 / 3 / 4', 'Shift+2 / 3 / 4'], ['Go to Fusion / Color / Fairlight / Deliver', 'Shift+5 / 6 / 7 / 8', 'Shift+5 / 6 / 7 / 8'], ['Full-screen playback', 'Ctrl+F', 'Cmd+F']
      ]],
      ['CapCut (PC / Mac desktop)', [
        ['Play / Pause', 'Space', 'Space'], ['Split at playhead', 'Ctrl+B', 'Cmd+B'], ['Delete', 'Delete', 'Delete'], ['Delete left of playhead (trim start)', 'Q', 'Q'], ['Delete right of playhead (trim end)', 'W', 'W'],
        ['Undo', 'Ctrl+Z', 'Cmd+Z'], ['Redo', 'Ctrl+Shift+Z', 'Cmd+Shift+Z'], ['Copy / Paste', 'Ctrl+C / Ctrl+V', 'Cmd+C / Cmd+V'], ['Import media', 'Ctrl+I', 'Cmd+I'], ['Export', 'Ctrl+E', 'Cmd+E'],
        ['Add marker', 'M', 'M'], ['Snapping on / off', 'S', 'S'], ['Zoom timeline in / out', 'Ctrl+= / Ctrl+−', 'Cmd+= / Cmd+−'], ['Previous / Next frame', '← / →', '← / →']
      ]],
      ['Filmora (PC / Mac)', [
        ['Play / Pause', 'Space', 'Space'], ['Split at playhead', 'Ctrl+B', 'Cmd+B'], ['Delete', 'Delete', 'Delete'], ['Ripple delete', 'Shift+Delete', 'Shift+Delete'],
        ['Undo', 'Ctrl+Z', 'Cmd+Z'], ['Redo', 'Ctrl+Shift+Z', 'Cmd+Shift+Z'], ['Import media', 'Ctrl+I', 'Cmd+I'], ['Save project', 'Ctrl+S', 'Cmd+S'], ['Export', 'Ctrl+E', 'Cmd+E'],
        ['Speed', 'Ctrl+R', 'Cmd+R'], ['Detach audio', 'Ctrl+Alt+D', 'Cmd+Option+D'], ['Freeze frame', 'Alt+F', 'Option+F'], ['Group clips', 'Alt+G', 'Option+G'], ['Add marker', 'M', 'M'], ['Zoom timeline in / out', 'Ctrl+= / Ctrl+−', 'Cmd+= / Cmd+−']
      ]],
      ['Final Cut Pro (Mac only)', [
        ['Play / Pause', '—', 'Space'], ['Play backwards / pause / forward', '—', 'J / K / L'], ['Select tool / Blade tool / Trim tool', '—', 'A / B / T'], ['Split at playhead', '—', 'Cmd+B'],
        ['Delete', '—', 'Delete'], ['Replace with gap', '—', 'Shift+Delete'], ['Undo / Redo', '—', 'Cmd+Z / Cmd+Shift+Z'], ['Import media', '—', 'Cmd+I'], ['Export file', '—', 'Cmd+E'],
        ['Add default transition', '—', 'Cmd+T'], ['Retime editor', '—', 'Cmd+R'], ['Add marker', '—', 'M'], ['Range In / Out', '—', 'I / O'], ['Connect clip above story', '—', 'Q'], ['Insert / Append / Overwrite', '—', 'W / E / D'],
        ['Snapping', '—', 'N'], ['Zoom in / out', '—', 'Cmd+= / Cmd+−'], ['Zoom to fit', '—', 'Shift+Z'], ['Compound clip', '—', 'Option+G']
      ]],
      ['iMovie (Mac)', [
        ['Play / Pause', '—', 'Space'], ['Split clip', '—', 'Cmd+B'], ['Undo / Redo', '—', 'Cmd+Z / Cmd+Shift+Z'], ['Import media', '—', 'Cmd+I'], ['Share / Export', '—', 'Cmd+E'], ['Detach audio', '—', 'Option+Cmd+B'], ['Freeze frame', '—', 'Shift+F'], ['Zoom timeline in / out', '—', 'Cmd+= / Cmd+−']
      ]],
      ['Phone apps (CapCut · VN · InShot) – touch gestures', [
        ['Zoom the timeline', 'Pinch two fingers', 'Pinch two fingers'], ['Select a clip', 'Tap it', 'Tap it'], ['Move a clip to another place', 'Long-press, then drag', 'Long-press, then drag'], ['Fine frame-by-frame cut', 'Zoom the timeline fully, then drag slowly', 'Same'],
        ['Preview full screen', 'Tap the full-screen icon', 'Same'], ['Undo / Redo', 'Curved arrow icons above the timeline', 'Same'], ['Reorder clips (CapCut)', 'Long-press a clip until the timeline shrinks, then drag', 'Same']
      ]]
    ];

    const EXPORT = [
      ['YouTube video', '16:9', '1920×1080 (4K: 3840×2160)', '24 / 30 (60 for gaming/sports)', 'MP4, H.264, AAC audio', '8–12 Mbps (1080p) · 35–45 Mbps (4K)'],
      ['YouTube Shorts · Instagram Reels · TikTok', '9:16', '1080×1920', '30', 'MP4, H.264', '8–10 Mbps'],
      ['WhatsApp Status', '9:16', '1080×1920', '30', 'MP4, H.264', '5–8 Mbps; keep clips short'],
      ['Instagram / Facebook feed', '4:5 or 1:1', '1080×1350 or 1080×1080', '30', 'MP4, H.264', '6–8 Mbps'],
      ['LinkedIn', '16:9, 1:1 or 4:5', '1920×1080 or 1080×1080', '30', 'MP4, H.264', '6–8 Mbps; add captions'],
      ['Archive / hand over to another editor', 'Same as project', 'Same as project', 'Same as project', 'ProRes or DNxHR', 'Very large files']
    ];
    const FIX = [
      ['Editing is laggy / jerky', 'Heavy 4K or phone H.265 footage', 'Use Proxy media, lower preview quality (Half / Quarter), close other apps, export later.'],
      ['Exported video looks blurry', 'Low resolution or low bitrate', 'Export at 1080p or higher with a higher bitrate; do not upload a screen-recorded copy again.'],
      ['Audio goes out of sync', 'Phone footage with variable frame rate', 'Convert to constant frame rate (e.g. HandBrake) before editing, and match project fps to the footage.'],
      ['Black bars around the video', 'Project ratio differs from the clip', 'Change the ratio first, then use Scale to fill / Crop, or use blurred background.'],
      ['File size is too large', 'Very high bitrate or 4K', 'Export 1080p at 6–8 Mbps, or use H.265 where the platform allows.'],
      ['Text is cut off on Reels / Shorts', 'Text is inside the app’s button area', 'Keep text in the centre safe zone (see the aspect ratio picture).'],
      ['No sound after export', 'Track muted, or audio disabled in export', 'Unmute all tracks and tick “Export audio” in the export window.'],
      ['Watermark on the video', 'Free version of the app', 'Remove the end-clip/watermark in settings if allowed, or use VN / DaVinci Resolve, which have none.']
    ];
    const PLAN = [
      ['Week 1 – Basics', 'Learn the screen, import, split, trim, delete, music, text, export. Make three 15-second videos.'],
      ['Week 2 – Sound & titles', 'Voice vs music volume, fades, captions, simple transitions. Edit a 30-second reel with captions.'],
      ['Week 3 – Motion & colour', 'Speed ramp, keyframe zoom, J/L cuts, basic colour correction. Re-edit an old video and compare.'],
      ['Week 4 – Story & polish', 'Hook in 3 seconds, B-roll, sound effects, correct export. Publish one finished video and note what viewers like.']
    ];
    const WORDS = [['Timeline', 'The strip where clips are arranged in time.'], ['Playhead', 'The line that shows the current moment.'], ['Track', 'A row on the timeline (video, audio, text).'], ['A-roll / B-roll', 'Main footage (person talking) / extra cover footage.'], ['Keyframe', 'A saved setting at one moment, used to animate.'], ['Ripple delete', 'Delete a piece and close the gap automatically.'], ['Proxy', 'A light copy of big footage for smooth editing.'], ['Codec', 'The method used to compress video (H.264, H.265, ProRes).'], ['Bitrate', 'How much data per second – more means better quality and bigger file.'], ['FPS', 'Frames per second: 24 cinema, 30 normal, 60 smooth.'], ['LUT', 'A colour “look” file you apply to footage.'], ['Render / Export', 'Creating the final video file.'], ['Nest / Compound clip', 'Grouping many clips into one block.'], ['Safe zone', 'Area that is not covered by app buttons or screen edges.']];

    /* ---------------- build the guide HTML ---------------- */
    const card = h => '<div class="card">' + h + '</div>';
    const tbl = (head, rows) => '<div class="scroll"><table><tr>' + head.map(h => '<th>' + E(h) + '</th>').join('') + '</tr>' + rows.map(r => '<tr>' + r.map((c, i) => '<td>' + (i ? c : '<b>' + c + '</b>') + '</td>').join('') + '</tr>').join('') + '</table></div>';
    const lvl = (t, a) => a && a.length ? '<h4 style="margin:12px 0 6px">' + t + '</h4><ol style="margin:0 0 6px 18px;padding:0">' + a.map(x => '<li style="margin:0 0 6px">' + E(x) + '</li>').join('') + '</ol>' : '';

    function secPictures() {
      return card('<h3>🖼 Learn with pictures</h3><p style="margin:0">These pictures explain the main ideas used in <b>every</b> video editing app. Read the picture, then try the same thing in your app.</p>') +
        PICS.map((p, i) => card('<h3 style="margin:0 0 10px">' + (i + 1) + '. ' + E(p[1]) + '</h3>' + PIC[p[0]] + '<ul style="margin:12px 0 0;padding-left:20px">' + p[2].map(x => '<li style="margin:0 0 5px">' + E(x) + '</li>').join('') + '</ul>')).join('');
    }
    function secApps() {
      return card('<h3>📱 Which app should I use?</h3>' + tbl(['App', 'Works on', 'Price', 'Level', 'Best for'], APPS.map(a => [a.i + ' ' + E(a.n), E(a.pl), E(a.pr), E(a.lv), E(a.best)])) +
        '<p class="note">Beginner on phone: start with <b>CapCut</b> or <b>VN</b>. Beginner on PC: <b>CapCut</b>, <b>Filmora</b> or <b>DaVinci Resolve</b> (free). Professional work: <b>Premiere Pro</b> or <b>DaVinci Resolve</b> (Mac: <b>Final Cut Pro</b>). Menus can change slightly when the apps update.</p>') +
        APPS.map(a => '<div class="card"><details><summary style="font-size:1.02rem">' + a.i + ' ' + E(a.n) + ' – step by step (Beginner → Advanced)</summary>' +
          '<p style="margin:4px 0 6px"><span class="chip">' + E(a.pl) + '</span><span class="chip">' + E(a.pr) + '</span></p>' +
          lvl('🌱 Beginner – make your first video', a.b) + lvl('🚀 Intermediate – smooth and professional', a.m) + lvl('🏆 Advanced – pro techniques', a.a) +
          '<div class="row noprint"><a class="btn sm" target="_blank" rel="noopener" href="' + a.url + '">⬇ Official website</a><a class="btn sm ghost" target="_blank" rel="noopener" href="https://www.youtube.com/results?search_query=' + encodeURIComponent(a.q) + '">▶ Watch tutorials</a></div></details></div>').join('');
    }
    function secShort() {
      return card('<h3>⌨ Shortcut keys – Windows & Mac</h3><p style="margin:0 0 10px">Learning only 8 shortcuts (play, split, delete, undo, zoom, mark in/out, export, save) makes editing 2–3 times faster. <b>Ctrl</b> on Windows = <b>Cmd</b> on Mac, <b>Alt</b> = <b>Option</b>.</p>' +
        '<input id="vg-sc" type="search" placeholder="Search a shortcut, e.g. split, export, speed…" style="max-width:420px">' +
        '<p class="note">Shortcuts can change between app versions. In Premiere / DaVinci / CapCut you can see and change them in the Keyboard Shortcuts settings.</p>') +
        SC.map((s, i) => '<div class="card vg-scc"><details' + (i === 0 ? ' open' : '') + '><summary style="font-size:1.02rem">' + E(s[0]) + '</summary>' + tbl(['Action', '🪟 Windows', '🍎 Mac'], s[1].map(r => [E(r[0]), '<code>' + E(r[1]) + '</code>', '<code>' + E(r[2]) + '</code>'])) + '</details></div>').join('');
    }
    function secExport() {
      return card('<h3>📤 Best export settings</h3>' + tbl(['Where', 'Ratio', 'Resolution', 'FPS', 'Format', 'Bitrate'], EXPORT.map(r => r.map(E))) + '<p class="note">Always watch the exported file fully on your phone before uploading.</p>') +
        card('<h3>🛠 Common problems and fixes</h3>' + tbl(['Problem', 'Reason', 'Fix'], FIX.map(r => r.map(E)))) +
        card('<h3>🗓 30-day learning plan</h3>' + PLAN.map(p => '<p style="margin:0 0 8px"><b>' + E(p[0]) + ':</b> ' + E(p[1]) + '</p>').join('')) +
        card('<h3>📖 Words you will hear</h3><dl style="margin:0">' + WORDS.map(w => '<dt style="font-weight:600;margin-top:8px">' + E(w[0]) + '</dt><dd style="margin:0 0 0 14px;color:#334155">' + E(w[1]) + '</dd>').join('') + '</dl>') +
        card('<h3>✅ Habits of good editors</h3><ul style="margin:0;padding-left:20px"><li>Hook the viewer in the first 3 seconds.</li><li>Cut the boring parts – every second must earn its place.</li><li>Clear voice first, then music, then effects.</li><li>Use few fonts and few colours; keep text readable.</li><li>Use only music, images and clips you have the right to use.</li><li>Save your project and keep a backup of raw clips.</li></ul>');
    }
    const SECT = [['pic', '🖼 Pictures', secPictures], ['app', '📱 Apps A–Z', secApps], ['sc', '⌨ Shortcuts', secShort], ['ex', '📤 Export & Fixes', secExport]];

    T.render = function (el) {
      orig.call(T, el);
      try {
        const bL = el.querySelector('#ve-t-learn'), bE = el.querySelector('#ve-t-edit'); if (!bL || !bE) return;
        const b = document.createElement('button'); b.className = 'btn ghost'; b.type = 'button'; b.id = 've-t-guide'; b.textContent = '📖 Pro Guide: Apps · Pictures · Shortcuts'; bL.parentNode.appendChild(b);
        const pane = document.createElement('div'); pane.id = 've-pane-guide'; pane.hidden = true; el.appendChild(pane);
        const eP = el.querySelector('#ve-pane-edit'), lP = el.querySelector('#ve-pane-learn');
        pane.innerHTML = '<div class="tabs noprint" id="vg-tabs">' + SECT.map((s, i) => '<button class="tab' + (i ? '' : ' on') + '" data-g="' + s[0] + '">' + s[1] + '</button>').join('') + '</div>' + SECT.map((s, i) => '<div data-gp="' + s[0] + '"' + (i ? ' hidden' : '') + '></div>').join('');
        const filled = {};
        const showSec = id => {
          $$('#vg-tabs .tab', pane).forEach(t => t.classList.toggle('on', t.dataset.g === id));
          $$('[data-gp]', pane).forEach(d => { d.hidden = d.dataset.gp !== id; if (d.dataset.gp === id && !filled[id]) { d.innerHTML = SECT.find(s => s[0] === id)[2](); filled[id] = 1; if (id === 'sc') wireSearch(); } });
        };
        const wireSearch = () => {
          const inp = pane.querySelector('#vg-sc'); if (!inp) return;
          inp.addEventListener('input', () => {
            const q = inp.value.trim().toLowerCase();
            $$('.vg-scc', pane).forEach(c => {
              let any = false;
              $$('tr', c).forEach((r, i) => { if (!i) return; const m = !q || r.textContent.toLowerCase().includes(q); r.style.display = m ? '' : 'none'; if (m) any = true; });
              c.style.display = any || !q ? '' : 'none'; const d = c.querySelector('details'); if (q && any) d.open = true;
            });
          });
        };
        $('#vg-tabs', pane).addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) showSec(t.dataset.g); });
        b.onclick = () => { if (eP) eP.hidden = true; if (lP) lP.hidden = true; pane.hidden = false; bE.className = 'btn ghost'; bL.className = 'btn ghost'; b.className = 'btn'; showSec('pic'); window.scrollTo({ top: 0, behavior: 'smooth' }); };
        [bE, bL].forEach(x => x.addEventListener('click', () => { pane.hidden = true; b.className = 'btn ghost'; }));
      } catch (e) { console.error('Video guide failed', e); }
    };
    T.desc = 'Trim, speed, rotate, filters and export – plus a full guide: CapCut, VN, Premiere, DaVinci & more with pictures and Windows / Mac shortcuts';
  } catch (e) { console.error('Video guide upgrade failed', e); }
})();
