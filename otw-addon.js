/*!
 * Open-to-Work hiring form + Certificates section (owner upload)
 * Add this ONE line before </body> in index.html:
 *   <script src="otw-addon.js" defer></script>
 */
(function () {
  'use strict';

  /* ================= SETTINGS ================= */
  var CFG = {
    owner: 'peeyush-jangid',
    repo: 'peeyush-jangid.github.io',
    email: 'peeyush.jangid@outlook.com',
    whatsapp: '919928579369',
    // Optional: paste a Formspree endpoint (https://formspree.io/f/xxxx) so messages
    // arrive directly in your inbox without opening the recruiter's mail app.
    formEndpoint: '',
    maxFileMB: 10
  };

  /* ================= STYLES ================= */
  var css = '\
:root{--otw-bg:#071426;--otw-card:#0d2038;--otw-line:rgba(255,255,255,.12);--otw-text:#e8eefb;--otw-mute:#9fb0cc;--otw-acc:#f5b942;--otw-green:#22c55e}\
.otw-badge{position:fixed;left:16px;bottom:16px;z-index:9990;display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:999px;border:1px solid rgba(34,197,94,.5);background:#071426;color:#e8eefb;font:600 13px/1 system-ui,sans-serif;letter-spacing:.06em;cursor:pointer;box-shadow:0 8px 24px rgba(0,0,0,.35)}\
.otw-badge:hover{background:#0d2038}\
.otw-dot{width:9px;height:9px;border-radius:50%;background:var(--otw-green);box-shadow:0 0 0 0 rgba(34,197,94,.7);animation:otwPulse 1.8s infinite;display:inline-block}\
@keyframes otwPulse{70%{box-shadow:0 0 0 9px rgba(34,197,94,0)}100%{box-shadow:0 0 0 0 rgba(34,197,94,0)}}\
.otw-overlay{position:fixed;inset:0;z-index:10000;background:rgba(3,8,18,.78);backdrop-filter:blur(4px);display:flex;align-items:flex-start;justify-content:center;overflow-y:auto;padding:24px 14px}\
.otw-overlay[hidden]{display:none}\
.otw-modal{position:relative;width:100%;max-width:640px;margin:auto;background:var(--otw-bg);color:var(--otw-text);border:1px solid var(--otw-line);border-radius:18px;padding:28px 24px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}\
.otw-close{position:absolute;top:12px;right:14px;background:none;border:0;color:var(--otw-mute);font-size:20px;cursor:pointer}\
.otw-head{display:flex;align-items:center;gap:8px;font:700 12px/1 system-ui;letter-spacing:.14em;color:var(--otw-green);margin-bottom:10px}\
.otw-modal h2{margin:0 0 6px;font-size:26px;color:#fff}\
.otw-sub{margin:0 0 18px;color:var(--otw-mute);font-size:14px;line-height:1.55}\
.otw-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}\
.otw-grid .full{grid-column:1/-1}\
.otw-modal label{display:block;font-size:12px;color:var(--otw-mute);margin-bottom:4px;letter-spacing:.03em}\
.otw-modal input,.otw-modal select,.otw-modal textarea{width:100%;box-sizing:border-box;background:var(--otw-card);color:var(--otw-text);border:1px solid var(--otw-line);border-radius:10px;padding:10px 12px;font:14px system-ui,sans-serif}\
.otw-modal input:focus,.otw-modal select:focus,.otw-modal textarea:focus{outline:2px solid var(--otw-acc);outline-offset:0}\
.otw-modal textarea{resize:vertical;line-height:1.5}\
.otw-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}\
.otw-btn{border:0;border-radius:10px;padding:12px 18px;font:700 14px system-ui,sans-serif;cursor:pointer}\
.otw-btn.pri{background:var(--otw-acc);color:#1a1200}\
.otw-btn.wa{background:#25d366;color:#04230f}\
.otw-btn.ghost{background:transparent;color:var(--otw-text);border:1px solid var(--otw-line)}\
.otw-btn[disabled]{opacity:.6;cursor:wait}\
.otw-err{color:#ff8a8a;font-size:13px;margin-top:10px;min-height:1em}\
.otw-done{text-align:center;padding:30px 6px}\
.otw-done h3{color:#fff;margin:0 0 8px}\
.otw-note{font-size:12px;color:var(--otw-mute);margin-top:10px}\
.otw-sec{background:#071426;color:#e8eefb;padding:70px 18px;font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif}\
.otw-sec[hidden]{display:none}\
.otw-wrap{max-width:1100px;margin:0 auto}\
.otw-eyebrow{font:700 12px/1 system-ui;letter-spacing:.16em;color:var(--otw-acc)}\
.otw-sec h2{font-size:clamp(26px,4vw,40px);margin:10px 0 8px;color:#fff}\
.otw-sec p.lead{color:var(--otw-mute);margin:0 0 28px}\
.otw-certs{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:18px}\
.otw-cert{background:var(--otw-card);border:1px solid var(--otw-line);border-radius:14px;overflow:hidden;display:flex;flex-direction:column}\
.otw-cert .pv{height:170px;background:#0a1a2f;display:flex;align-items:center;justify-content:center;overflow:hidden}\
.otw-cert .pv img{width:100%;height:100%;object-fit:cover}\
.otw-cert .pv span{font:800 30px system-ui;color:var(--otw-acc);letter-spacing:.1em}\
.otw-cert .bd{padding:14px}\
.otw-cert h3{margin:0 0 4px;font-size:16px;color:#fff}\
.otw-cert small{color:var(--otw-mute);display:block;margin-bottom:10px}\
.otw-cert a.v{color:var(--otw-acc);font-weight:700;font-size:13px;text-decoration:none}\
.otw-cert button.del{float:right;background:none;border:0;color:#ff8a8a;cursor:pointer;font-size:12px}\
.otw-admin{position:fixed;right:14px;bottom:14px;z-index:9995;width:min(360px,calc(100vw - 28px));background:#071426;color:#e8eefb;border:1px solid var(--otw-acc);border-radius:14px;padding:16px;font:14px system-ui,sans-serif;box-shadow:0 12px 40px rgba(0,0,0,.5)}\
.otw-admin h4{margin:0 0 10px;color:var(--otw-acc)}\
.otw-admin input{width:100%;box-sizing:border-box;margin:0 0 8px;background:#0d2038;color:#e8eefb;border:1px solid var(--otw-line);border-radius:8px;padding:9px}\
.otw-admin .row{display:flex;gap:8px;align-items:center;font-size:12px;color:var(--otw-mute);margin-bottom:8px}\
.otw-admin .row input{width:auto;margin:0}\
.otw-admin .msg{font-size:12px;margin-top:8px;color:var(--otw-mute);min-height:1em}\
.otw-tabs{display:flex;gap:8px;margin:0 28px 18px 0}\
.otw-tab{flex:1;background:transparent;color:var(--otw-mute);border:1px solid var(--otw-line);border-radius:10px;padding:10px 8px;font:700 13px system-ui,sans-serif;cursor:pointer}\
.otw-tab.on{background:var(--otw-acc);color:#1a1200;border-color:var(--otw-acc)}\
.otw-modal input[type=file]{padding:8px}\
@media(max-width:560px){.otw-grid{grid-template-columns:1fr}.otw-modal{padding:24px 16px}}';

  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  /* ================= HELPERS ================= */
  function $(s, r) { return (r || document).querySelector(s); }
  function h(tag, cls, txt) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function enc(str) { return btoa(unescape(encodeURIComponent(str))); }
  function dec(b64) { return decodeURIComponent(escape(atob(b64.replace(/\n/g, '')))); }

  /* ================= HIRING MODAL ================= */
  var overlay = h('div', 'otw-overlay');
  overlay.hidden = true;
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.innerHTML = '\
<div class="otw-modal">\
 <button class="otw-close" type="button" aria-label="Close">✕</button>\
 <div class="otw-tabs" id="otwTabs">\
  <button type="button" class="otw-tab on" data-tab="offer">Offer me a job</button>\
  <button type="button" class="otw-tab" data-tab="apply">Apply for a job</button>\
 </div>\
 <div id="otwFormBox">\
  <div class="otw-head"><span class="otw-dot"></span>OPEN TO WORK</div>\
  <h2>Hire Peeyush Kumar Jangid</h2>\
  <p class="otw-sub">HVAC Project Engineer · Site Supervision · Pre-commissioning · AutoCAD 2D. Share the job details and your hiring message will reach me directly.</p>\
  <form id="otwForm" novalidate>\
   <div class="otw-grid">\
    <div><label>Your name *</label><input name="name" autocomplete="name" required></div>\
    <div><label>Designation</label><input name="designation" placeholder="HR Manager / Director"></div>\
    <div><label>Company *</label><input name="company" autocomplete="organization" required></div>\
    <div><label>Job title offered *</label><input name="job" placeholder="HVAC Project Engineer" required></div>\
    <div><label>Email *</label><input name="email" type="email" autocomplete="email" required></div>\
    <div><label>Phone / WhatsApp</label><input name="phone" type="tel" autocomplete="tel"></div>\
    <div><label>Job type</label><select name="type"><option>Full-time</option><option>Contract</option><option>Part-time</option><option>Internship</option></select></div>\
    <div><label>Job location</label><input name="location" placeholder="City, State"></div>\
    <div class="full"><label>Salary / CTC range (optional)</label><input name="salary"></div>\
    <div class="full"><label>Hiring message</label><textarea name="message" rows="8"></textarea></div>\
   </div>\
   <div class="otw-err" id="otwErr"></div>\
   <div class="otw-actions">\
    <button class="otw-btn pri" type="submit">Send Hiring Message</button>\
    <button class="otw-btn wa" type="button" id="otwWa">Send on WhatsApp</button>\
    <button class="otw-btn ghost" type="button" id="otwCancel">Cancel</button>\
   </div>\
   <p class="otw-note">The message above is a ready professional template — edit it freely before sending.</p>\
  </form>\
 </div>\
 <div id="otwApplyBox" hidden>\
  <div class="otw-head"><span class="otw-dot"></span>NOW HIRING</div>\
  <h2>Apply for a job</h2>\
  <p class="otw-sub">Looking for an opportunity? Fill in your details and add your resume. I will review your application and contact you if shortlisted.</p>\
  <form id="otwApply" novalidate>\
   <div class="otw-grid">\
    <div><label>Full name *</label><input name="aname" autocomplete="name"></div>\
    <div><label>Position applying for *</label><input name="arole" placeholder="e.g. HVAC Site Supervisor"></div>\
    <div><label>Email *</label><input name="aemail" type="email" autocomplete="email"></div>\
    <div><label>Phone / WhatsApp</label><input name="aphone" type="tel" autocomplete="tel"></div>\
    <div><label>Experience</label><input name="aexp" placeholder="e.g. 2 years"></div>\
    <div><label>Current location</label><input name="aloc"></div>\
    <div class="full"><label>Expected salary (optional)</label><input name="asalary"></div>\
    <div class="full"><label>Resume file (PDF / DOC / DOCX)</label><input name="afile" type="file" accept=".pdf,.doc,.docx,application/pdf"></div>\
    <div class="full"><label>OR resume link (Google Drive / LinkedIn)</label><input name="alink" type="url" placeholder="https://"></div>\
    <div class="full"><label>Message</label><textarea name="amsg" rows="4" placeholder="Tell me briefly about yourself"></textarea></div>\
   </div>\
   <div class="otw-err" id="otwAErr"></div>\
   <div class="otw-actions">\
    <button class="otw-btn pri" type="submit">Submit Application</button>\
    <button class="otw-btn ghost" type="button" id="otwACancel">Cancel</button>\
   </div>\
   <p class="otw-note">Resume is required: upload a file or paste a link.</p>\
  </form>\
 </div>\
 <div class="otw-done" id="otwDone" hidden>\
  <h3>✅ Thank you!</h3>\
  <p class="otw-sub" id="otwDoneMsg">Thank you. I will get back to you shortly.</p>\
  <button class="otw-btn ghost" type="button" id="otwDoneClose">Close</button>\
 </div>\
</div>';
  document.body.appendChild(overlay);

  var form = $('#otwForm', overlay);
  var DEFAULT_MSG =
    'Dear Mr. Peeyush,\n\n' +
    'We have reviewed your profile and are impressed with your experience in HVAC project engineering, site supervision and pre-commissioning. ' +
    'We would like to discuss a suitable opportunity with you.\n\n' +
    'Kindly let us know your availability for a call or interview at your earliest convenience.\n\n' +
    'Warm regards,';
  form.elements.message.value = DEFAULT_MSG;

  function showTab(tab) {
    var apply = tab === 'apply';
    $('#otwTabs', overlay).hidden = false;
    $('#otwFormBox', overlay).hidden = apply;
    $('#otwApplyBox', overlay).hidden = !apply;
    $('#otwDone', overlay).hidden = true;
    Array.prototype.forEach.call(overlay.querySelectorAll('.otw-tab'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-tab') === (apply ? 'apply' : 'offer'));
    });
  }
  function showDone(msg) {
    $('#otwTabs', overlay).hidden = true;
    $('#otwFormBox', overlay).hidden = true;
    $('#otwApplyBox', overlay).hidden = true;
    $('#otwDoneMsg', overlay).textContent = msg;
    $('#otwDone', overlay).hidden = false;
  }
  Array.prototype.forEach.call(overlay.querySelectorAll('.otw-tab'), function (b) {
    b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); });
  });

  function openModal(tab) {
    showTab(tab === 'apply' ? 'apply' : 'offer');
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(function () { form.elements.name.focus(); }, 50);
  }
  function closeModal() {
    overlay.hidden = true;
    document.body.style.overflow = '';
  }
  $('.otw-close', overlay).addEventListener('click', closeModal);
  $('#otwCancel', overlay).addEventListener('click', closeModal);
  $('#otwDoneClose', overlay).addEventListener('click', closeModal);
  overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) closeModal(); });

  function data() {
    var f = form.elements, d = {};
    ['name', 'designation', 'company', 'job', 'email', 'phone', 'type', 'location', 'salary', 'message']
      .forEach(function (k) { d[k] = (f[k].value || '').trim(); });
    return d;
  }
  function validate(d, needEmail) {
    if (!d.name || !d.company || !d.job) return 'Please fill name, company and job title.';
    if (needEmail && !/^\S+@\S+\.\S+$/.test(d.email)) return 'Please enter a valid email address.';
    if (!needEmail && !d.email && !d.phone) return 'Please add an email or phone number so I can reply.';
    return '';
  }
  function fullText(d) {
    return d.message + '\n' + d.name +
      (d.designation ? ', ' + d.designation : '') + '\n' + d.company +
      '\n\n— Job details —\nPosition: ' + d.job + '\nType: ' + d.type +
      (d.location ? '\nLocation: ' + d.location : '') +
      (d.salary ? '\nSalary: ' + d.salary : '') +
      '\nEmail: ' + d.email + (d.phone ? '\nPhone: ' + d.phone : '');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = data(), err = validate(d, true);
    $('#otwErr', overlay).textContent = err;
    if (err) return;
    var subject = 'Job Opportunity: ' + d.job + ' at ' + d.company;
    var body = fullText(d);
    var btn = form.querySelector('button[type=submit]');

    function finish() {
      showDone(CFG.formEndpoint
        ? 'Your hiring message has been sent. I will get back to you shortly.'
        : 'Your email app has opened with the message ready. Please press Send there to deliver it.');
    }
    if (CFG.formEndpoint) {
      btn.disabled = true;
      fetch(CFG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ _subject: subject, name: d.name, email: d.email, phone: d.phone, company: d.company, message: body })
      }).then(function (r) {
        if (!r.ok) throw new Error();
        form.reset(); form.elements.message.value = DEFAULT_MSG; finish();
      }).catch(function () {
        $('#otwErr', overlay).textContent = 'Could not send. Please use the WhatsApp button or email ' + CFG.email;
      }).then(function () { btn.disabled = false; });
    } else {
      window.location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      finish();
    }
  });

  $('#otwWa', overlay).addEventListener('click', function () {
    var d = data(), err = validate(d, false);
    $('#otwErr', overlay).textContent = err;
    if (err) return;
    window.open('https://wa.me/' + CFG.whatsapp + '?text=' + encodeURIComponent(fullText(d)), '_blank', 'noopener');
  });

  /* ---------- Job application form (candidate + resume) ---------- */
  var aform = $('#otwApply', overlay);
  $('#otwACancel', overlay).addEventListener('click', closeModal);

  aform.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = aform.elements, d = {}, errBox = $('#otwAErr', overlay);
    ['aname', 'arole', 'aemail', 'aphone', 'aexp', 'aloc', 'asalary', 'alink', 'amsg']
      .forEach(function (k) { d[k] = (f[k].value || '').trim(); });
    var file = f.afile.files[0];
    var err = '';
    if (!d.aname || !d.arole) err = 'Please fill your name and the position you are applying for.';
    else if (!/^\S+@\S+\.\S+$/.test(d.aemail)) err = 'Please enter a valid email address.';
    else if (!file && !d.alink) err = 'Please upload your resume or paste a resume link.';
    else if (file && !/\.(pdf|docx?)$/i.test(file.name)) err = 'Resume must be a PDF, DOC or DOCX file.';
    else if (file && file.size > CFG.maxFileMB * 1024 * 1024) err = 'Resume is larger than ' + CFG.maxFileMB + ' MB.';
    errBox.textContent = err;
    if (err) return;

    var subject = 'Job Application: ' + d.arole + ' - ' + d.aname;
    var body = 'New job application\n\n' +
      'Name: ' + d.aname + '\nPosition: ' + d.arole + '\nEmail: ' + d.aemail +
      (d.aphone ? '\nPhone: ' + d.aphone : '') +
      (d.aexp ? '\nExperience: ' + d.aexp : '') +
      (d.aloc ? '\nLocation: ' + d.aloc : '') +
      (d.asalary ? '\nExpected salary: ' + d.asalary : '') +
      (d.alink ? '\nResume link: ' + d.alink : '') +
      (file ? '\nResume file: ' + file.name : '') +
      (d.amsg ? '\n\nMessage:\n' + d.amsg : '');
    var btn = aform.querySelector('button[type=submit]');

    if (CFG.formEndpoint) {
      var fd = new FormData();
      fd.append('_subject', subject);
      fd.append('name', d.aname);
      fd.append('email', d.aemail);
      fd.append('message', body);
      if (file) fd.append('resume', file, file.name);
      btn.disabled = true;
      fetch(CFG.formEndpoint, { method: 'POST', headers: { 'Accept': 'application/json' }, body: fd })
        .then(function (r) {
          if (!r.ok) throw new Error();
          aform.reset();
          showDone('Your application has been submitted. Thank you, I will contact you if you are shortlisted.');
        })
        .catch(function () {
          errBox.textContent = 'Could not submit. Please email your resume to ' + CFG.email;
        })
        .then(function () { btn.disabled = false; });
    } else {
      window.location.href = 'mailto:' + CFG.email + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      showDone(file
        ? 'Your email app has opened with your details. Please attach your resume (' + file.name + ') to that email and press Send.'
        : 'Your email app has opened with your details and resume link. Please press Send there to submit.');
    }
  });

  /* Floating badge + hook existing "Open to work" links */
  var badge = h('button', 'otw-badge');
  badge.type = 'button';
  badge.innerHTML = '<span class="otw-dot"></span>OPEN TO WORK';
  badge.addEventListener('click', openModal);
  document.body.appendChild(badge);

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a');
    if (!a) return;
    var t = (a.textContent || '').toLowerCase();
    var href = a.getAttribute('href') || '';
    if (/open to work/.test(t) || /contact\.html/.test(href) || a.hasAttribute('data-open-to-work')) {
      e.preventDefault();
      openModal();
    }
  });

  /* ================= CERTIFICATES ================= */
  var certs = [];
  var token = '';
  try { token = localStorage.getItem('otw_gh_token') || ''; } catch (_) {}
  var isAdmin = false;

  var sec = h('section', 'otw-sec');
  sec.id = 'certificates';
  sec.hidden = true;
  var wrap = h('div', 'otw-wrap');
  wrap.appendChild(h('div', 'otw-eyebrow', 'CERTIFICATES'));
  wrap.appendChild(h('h2', null, 'Certifications & achievements.'));
  wrap.appendChild(h('p', 'lead', 'Certificates and credentials earned through training and professional work.'));
  var grid = h('div', 'otw-certs');
  wrap.appendChild(grid);
  sec.appendChild(wrap);

  var anchor = document.getElementById('contact');
  if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(sec, anchor);
  else document.body.insertBefore(sec, document.body.firstChild.nextSibling);

  function addNavLinks(show) {
    var links = document.querySelectorAll('a[href="#skills"]');
    Array.prototype.forEach.call(links, function (l) {
      var parent = l.parentNode;
      var existing = parent.querySelector('a[href="#certificates"]');
      if (show && !existing) {
        var c = l.cloneNode(false);
        c.setAttribute('href', '#certificates');
        c.textContent = 'Certificates';
        parent.insertBefore(c, l.nextSibling);
      } else if (!show && existing) {
        existing.remove();
      }
    });
  }

  function renderCerts() {
    grid.innerHTML = '';
    certs.forEach(function (c, i) {
      var card = h('div', 'otw-cert');
      var pv = h('div', 'pv');
      var isImg = /\.(png|jpe?g|webp|gif)$/i.test(c.file);
      if (isImg) {
        var im = document.createElement('img');
        im.loading = 'lazy'; im.alt = c.title; im.src = c.file;
        pv.appendChild(im);
      } else {
        pv.appendChild(h('span', null, 'PDF'));
      }
      var bd = h('div', 'bd');
      if (isAdmin) {
        var del = h('button', 'del', 'Delete');
        del.type = 'button';
        del.addEventListener('click', function () { removeCert(i); });
        bd.appendChild(del);
      }
      bd.appendChild(h('h3', null, c.title));
      bd.appendChild(h('small', null, c.issuer || ''));
      var v = h('a', 'v', 'View certificate ↗');
      v.href = c.file; v.target = '_blank'; v.rel = 'noopener';
      bd.appendChild(v);
      card.appendChild(pv); card.appendChild(bd);
      grid.appendChild(card);
    });
    // Empty = section stays hidden. Shows only after upload.
    var show = certs.length > 0;
    sec.hidden = !show;
    addNavLinks(show);
  }

  function loadCerts() {
    fetch('certificates.json?v=' + Date.now())
      .then(function (r) { return r.ok ? r.json() : []; })
      .catch(function () { return []; })
      .then(function (list) { certs = Array.isArray(list) ? list : []; renderCerts(); });
  }

  /* ---------- Owner upload (GitHub API) ---------- */
  function gh(path, opts) {
    opts = opts || {};
    opts.headers = Object.assign({
      'Accept': 'application/vnd.github+json',
      'Authorization': 'Bearer ' + token
    }, opts.headers || {});
    return fetch('https://api.github.com/repos/' + CFG.owner + '/' + CFG.repo + '/contents/' + path, opts);
  }
  function saveList(list) {
    return gh('certificates.json?t=' + Date.now()).then(function (r) {
      return r.status === 200 ? r.json() : null;
    }).then(function (cur) {
      var body = { message: 'Update certificates list', content: enc(JSON.stringify(list, null, 2)) };
      if (cur && cur.sha) body.sha = cur.sha;
      return gh('certificates.json', { method: 'PUT', body: JSON.stringify(body) });
    }).then(function (r) { if (!r.ok) throw new Error('Could not save list (' + r.status + ')'); });
  }
  function removeCert(i) {
    var c = certs[i];
    if (!c || !confirm('Delete "' + c.title + '"?')) return;
    var next = certs.slice(); next.splice(i, 1);
    saveList(next).then(function () {
      return gh(c.file + '?t=' + Date.now()).then(function (r) { return r.ok ? r.json() : null; });
    }).then(function (f) {
      if (f && f.sha) return gh(c.file, { method: 'DELETE', body: JSON.stringify({ message: 'Remove certificate', sha: f.sha }) });
    }).then(function () { certs = next; renderCerts(); })
      .catch(function (e) { alert(e.message || 'Delete failed'); });
  }

  function buildAdmin() {
    if ($('.otw-admin')) return;
    var p = h('div', 'otw-admin');
    p.innerHTML = '\
<h4>Owner: Upload certificate</h4>\
<input id="adTok" type="password" placeholder="GitHub token (one-time)" autocomplete="off">\
<div class="row"><input id="adRem" type="checkbox" checked><label for="adRem">Remember token on this device</label></div>\
<input id="adTitle" placeholder="Certificate title *">\
<input id="adIss" placeholder="Issuer / year (e.g. VMOU Kota · 2025)">\
<input id="adFile" type="file" accept="image/*,application/pdf">\
<button class="otw-btn pri" id="adGo" type="button" style="width:100%">Upload</button>\
<div class="msg" id="adMsg"></div>';
    document.body.appendChild(p);
    $('#adTok', p).value = token;
    $('#adGo', p).addEventListener('click', function () {
      var msg = $('#adMsg', p);
      var tok = $('#adTok', p).value.trim();
      var title = $('#adTitle', p).value.trim();
      var file = $('#adFile', p).files[0];
      if (!tok) { msg.textContent = 'Enter your GitHub token.'; return; }
      if (!title) { msg.textContent = 'Enter the certificate title.'; return; }
      if (!file) { msg.textContent = 'Choose an image or PDF file.'; return; }
      if (file.size > CFG.maxFileMB * 1024 * 1024) { msg.textContent = 'File larger than ' + CFG.maxFileMB + ' MB.'; return; }
      token = tok;
      try {
        if ($('#adRem', p).checked) localStorage.setItem('otw_gh_token', tok);
        else localStorage.removeItem('otw_gh_token');
      } catch (_) {}
      var btn = $('#adGo', p);
      btn.disabled = true; msg.textContent = 'Uploading…';
      var reader = new FileReader();
      reader.onload = function () {
        var b64 = String(reader.result).split(',')[1];
        var safe = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        var path = 'certificates/' + Date.now() + '-' + safe;
        gh(path, { method: 'PUT', body: JSON.stringify({ message: 'Add certificate: ' + title, content: b64 }) })
          .then(function (r) {
            if (r.status === 401 || r.status === 403) throw new Error('Token rejected. It needs Contents: Read & write on this repo.');
            if (!r.ok) throw new Error('Upload failed (' + r.status + ')');
            var next = certs.concat([{ title: title, issuer: $('#adIss', p).value.trim(), file: path, date: new Date().toISOString().slice(0, 10) }]);
            return saveList(next).then(function () { certs = next; renderCerts(); });
          })
          .then(function () {
            msg.textContent = '✅ Uploaded. Live for all visitors in ~1 minute.';
            $('#adTitle', p).value = ''; $('#adIss', p).value = ''; $('#adFile', p).value = '';
          })
          .catch(function (e) { msg.textContent = '❌ ' + (e.message || 'Failed'); })
          .then(function () { btn.disabled = false; });
      };
      reader.readAsDataURL(file);
    });
  }

  function checkAdmin() {
    var on = /(^|[#&?])admin$/.test(location.hash) || /[?&]admin(=|&|$)/.test(location.search);
    isAdmin = on;
    if (on) buildAdmin();
    else { var a = $('.otw-admin'); if (a) a.remove(); }
    renderCerts();
  }
  window.addEventListener('hashchange', checkAdmin);

  loadCerts();
  checkAdmin();
})();
