/* Peeyush Tools Hub – Register / Login gate (Firebase Auth + Firestore, EmailJS OTP) */
(function () {
  'use strict';
  var C = window.PJ_AUTH || {};
  var FB_VER = '10.12.2', CDN = 'https://www.gstatic.com/firebasejs/' + FB_VER + '/';
  var CATS = ['Student', 'Teacher / Professor', 'Content Creator', 'Job Seeker', 'Employee / Professional', 'Business Owner', 'Freelancer', 'Developer', 'Engineer', 'Other'];
  var PURPOSES = ['Study / Learning', 'Office Work', 'Business', 'Content Creation', 'Resume / Job Search', 'Personal Use', 'Other'];
  var COUNTRIES = ['India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Singapore', 'Nepal', 'Bangladesh', 'Sri Lanka', 'Pakistan', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Japan', 'China', 'Malaysia', 'Indonesia', 'Philippines', 'South Africa', 'Nigeria', 'Kenya', 'Brazil', 'Mexico', 'Russia', 'Other'];
  var STATES_IN = ['Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry', 'Andaman and Nicobar Islands', 'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep'];

  var fb = null, user = null, profile = null, pendingHash = null, photoData = '';
  var otp = { hash: '', exp: 0, tries: 0, email: '', verified: false, last: 0 };

  function $(s, r) { return (r || document).querySelector(s); }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function opts(a, ph) { return (ph ? '<option value="">' + ph + '</option>' : '') + a.map(function (x) { return '<option>' + esc(x) + '</option>'; }).join(''); }
  function chips(name, a) { return a.map(function (x) { return '<label><input type="checkbox" name="' + name + '" value="' + esc(x) + '">' + esc(x) + '</label>'; }).join(''); }
  function toast(m) { var t = document.getElementById('toast'); if (!t) return; t.textContent = m; t.classList.add('on'); setTimeout(function () { t.classList.remove('on'); }, 2600); }

  /* ---------- Firebase ---------- */
  function cfg() {
    var c = C.firebase || {};
    if (c.apiKey) return c;
    return window.firebaseConfig || window.FIREBASE_CONFIG || (window.firebase && window.firebase.config) || null;
  }
  function loadFb() {
    if (fb) return Promise.resolve(fb);
    var conf = cfg();
    if (!conf) return Promise.reject(new Error('Firebase config missing (pj-auth-config.js bharein).'));
    return Promise.all([
      import(CDN + 'firebase-app.js'), import(CDN + 'firebase-auth.js'), import(CDN + 'firebase-firestore.js')
    ]).then(function (m) {
      var app = m[0].getApps().length ? m[0].getApp() : m[0].initializeApp(conf);
      fb = { app: app, A: m[1], F: m[2], auth: m[1].getAuth(app), db: m[2].getFirestore(app) };
      return fb;
    });
  }

  /* ---------- UI ---------- */
  var ov;
  function build() {
    ov = document.createElement('div');
    ov.className = 'pjA-ov'; ov.hidden = true;
    ov.innerHTML =
      '<div class="pjA-box" role="dialog" aria-modal="true">' +
      '<button class="pjA-x" type="button" id="pjAx" aria-label="Close">×</button>' +
      /* REGISTER */
      '<form id="pjAReg" novalidate>' +
      '<h2>Create Account</h2><p class="pjA-sub">Sabhi tools use karne ke liye pehle register kijiye.</p>' +
      '<div class="pjA-g">' +
      '<div><label>First Name <i>*</i></label><input type="text" id="rF" autocomplete="given-name"></div>' +
      '<div><label>Middle Name</label><input type="text" id="rM" autocomplete="additional-name"></div>' +
      '<div class="full"><label>Last Name <i>*</i></label><input type="text" id="rL" autocomplete="family-name"></div>' +
      '<div class="full"><label>Email ID <i>*</i></label><div class="pjA-row"><input type="email" id="rE" autocomplete="email"><button type="button" class="pjA-btn" id="rSend">Send OTP</button></div>' +
      '<div class="pjA-otp" id="rOtpBox"><div class="pjA-row" style="margin-top:8px"><input type="text" id="rOtp" inputmode="numeric" maxlength="6" placeholder="6-digit OTP"><button type="button" class="pjA-btn alt" id="rVer">Verify OTP</button></div></div>' +
      '<div class="pjA-msg" id="rOtpMsg"></div></div>' +
      '<div class="full"><label>Mobile Number <i>*</i></label><input type="tel" id="rMob" inputmode="tel" placeholder="e.g. 9876543210" autocomplete="tel"></div>' +
      '<div><label>Password <i>*</i></label><input type="password" id="rP" autocomplete="new-password" placeholder="Min 8 characters"></div>' +
      '<div><label>Confirm Password <i>*</i></label><input type="password" id="rP2" autocomplete="new-password"></div>' +
      '<div class="full"><label>Profile Photo</label><div class="pjA-photo"><img id="rImg" alt="" src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="><input type="file" id="rPh" accept="image/*"></div></div>' +
      '<div><label>Country <i>*</i></label><select id="rC">' + opts(COUNTRIES, 'Select country') + '</select></div>' +
      '<div><label>State <i>*</i></label><input type="text" id="rS" list="pjAStates" autocomplete="off"><datalist id="pjAStates"></datalist></div>' +
      '<div class="full"><label>City <i>*</i></label><input type="text" id="rCi" autocomplete="address-level2"></div>' +
      '<div class="full"><label>User Category <i>*</i> <small style="font-weight:400;color:#64748b">(ek se zyada chun sakte hain)</small></label><div class="pjA-chips" id="rCat">' + chips('cat', CATS) + '</div></div>' +
      '<div class="full"><label>Purpose of Using Tools <i>*</i> <small style="font-weight:400;color:#64748b">(ek se zyada chun sakte hain)</small></label><div class="pjA-chips" id="rPur">' + chips('pur', PURPOSES) + '</div></div>' +
      '<div class="full"><label class="pjA-terms"><input type="checkbox" id="rT"><span>I agree to the <a href="index.html#terms" target="_blank" rel="noopener">Terms &amp; Conditions</a> and <a href="index.html#privacy" target="_blank" rel="noopener">Privacy Policy</a></span></label></div>' +
      '</div>' +
      '<div class="pjA-msg" id="rMsg"></div>' +
      '<button type="submit" class="pjA-btn big" id="rGo" style="margin-top:10px">Create Account</button>' +
      '<p class="pjA-sw">Already have an account? <a id="toLogin">Sign In</a></p>' +
      '</form>' +
      /* LOGIN */
      '<form id="pjALog" novalidate hidden>' +
      '<h2>Sign In</h2><p class="pjA-sub">Tools use karne ke liye login kijiye.</p>' +
      '<div class="pjA-g"><div class="full"><label>Email ID</label><input type="email" id="lE" autocomplete="username"></div>' +
      '<div class="full"><label>Password</label><input type="password" id="lP" autocomplete="current-password"></div></div>' +
      '<div class="pjA-msg" id="lMsg"></div>' +
      '<button type="submit" class="pjA-btn big" id="lGo" style="margin-top:10px">Sign In</button>' +
      '<p class="pjA-sw"><a id="lForgot">Forgot password?</a></p>' +
      '<p class="pjA-sw">New here? <a id="toReg">Create Account</a></p>' +
      '</form></div>';
    document.body.appendChild(ov);

    $('#pjAx').onclick = hide;
    ov.addEventListener('mousedown', function (e) { if (e.target === ov) hide(); });
    $('#toLogin').onclick = function () { swap('log'); };
    $('#toReg').onclick = function () { swap('reg'); };
    $('#rC').onchange = onCountry;
    $('#rPh').onchange = onPhoto;
    $('#rSend').onclick = sendOtp;
    $('#rVer').onclick = verifyOtp;
    $('#rE').oninput = function () { if (otp.verified && $('#rE').value.trim().toLowerCase() !== otp.email) { otp.verified = false; setMsg('rOtpMsg', 'Email badla hai, dobara OTP verify karein.', 'err'); } };
    $('#pjAReg').onsubmit = register;
    $('#pjALog').onsubmit = login;
    $('#lForgot').onclick = forgot;
  }
  function show(mode) { if (!ov) build(); swap(mode || 'reg'); ov.hidden = false; document.body.style.overflow = 'hidden'; }
  function hide() { if (ov) ov.hidden = true; document.body.style.overflow = ''; pendingHash = null; }
  function swap(m) { $('#pjAReg').hidden = m !== 'reg'; $('#pjALog').hidden = m !== 'log'; }
  function setMsg(id, t, k) { var e = document.getElementById(id); e.textContent = t || ''; e.className = 'pjA-msg' + (k ? ' ' + k : ''); }
  function onCountry() {
    var dl = $('#pjAStates'), india = $('#rC').value === 'India';
    dl.innerHTML = india ? STATES_IN.map(function (s) { return '<option value="' + esc(s) + '">'; }).join('') : '';
  }
  function onPhoto() {
    var f = $('#rPh').files[0]; photoData = '';
    if (!f) { $('#rImg').src = 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='; return; }
    if (!/^image\//.test(f.type)) { setMsg('rMsg', 'Sirf image file chunein.', 'err'); return; }
    var img = new Image(), url = URL.createObjectURL(f);
    img.onload = function () {
      var s = 256, c = document.createElement('canvas'), w = img.width, h = img.height, m = Math.min(w, h);
      c.width = c.height = s;
      c.getContext('2d').drawImage(img, (w - m) / 2, (h - m) / 2, m, m, 0, 0, s, s);
      photoData = c.toDataURL('image/jpeg', .82); $('#rImg').src = photoData; URL.revokeObjectURL(url);
    };
    img.onerror = function () { setMsg('rMsg', 'Photo load nahi hui.', 'err'); };
    img.src = url;
  }

  /* ---------- OTP ---------- */
  function sha(t) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(t)).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join('');
    });
  }
  function validEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }
  function sendOtp() {
    var em = $('#rE').value.trim().toLowerCase();
    if (!validEmail(em)) return setMsg('rOtpMsg', 'Sahi email ID daaliye.', 'err');
    if (Date.now() - otp.last < 30000) return setMsg('rOtpMsg', 'Kripya 30 second baad dobara try karein.', 'err');
    var code = String(100000 + (crypto.getRandomValues(new Uint32Array(1))[0] % 900000));
    var E = C.emailjs || {}, btn = $('#rSend');
    btn.disabled = true; setMsg('rOtpMsg', 'OTP bheja ja raha hai…');
    sha(code + em).then(function (h) {
      otp = { hash: h, exp: Date.now() + 10 * 60000, tries: 0, email: em, verified: false, last: Date.now() };
      var name = $('#rF').value.trim() || 'User';
      if (E.publicKey && E.serviceId && E.templateId) {
        return fetch('https://api.emailjs.com/api/v1.0/email/send', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ service_id: E.serviceId, template_id: E.templateId, user_id: E.publicKey, template_params: { to_email: em, email: em, to_name: name, otp: code, passcode: code, code: code, time: new Date(Date.now() + 10 * 60000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) } })
        }).then(function (r) { if (!r.ok) return r.text().then(function (t) { throw new Error('Email send failed (' + r.status + '): ' + t.slice(0, 160)); }); setMsg('rOtpMsg', 'OTP ' + em + ' par bhej diya gaya hai (10 minute valid).', 'ok'); });
      }
      if (C.demoOtpWhenNoEmailJs) { setMsg('rOtpMsg', 'DEMO mode – aapka OTP: ' + code + ' (EmailJS keys bharne par email aayega)', 'ok'); return; }
      throw new Error('EmailJS configure nahi hai.');
    }).catch(function (e) { setMsg('rOtpMsg', e.message || 'OTP nahi bhej paaye.', 'err'); })
      .then(function () { btn.disabled = false; $('#rOtpBox').classList.add('on'); });
  }
  function verifyOtp() {
    var v = $('#rOtp').value.trim(), em = $('#rE').value.trim().toLowerCase();
    if (!otp.hash || em !== otp.email) return setMsg('rOtpMsg', 'Pehle OTP bhejein.', 'err');
    if (Date.now() > otp.exp) return setMsg('rOtpMsg', 'OTP expire ho gaya, naya bhejein.', 'err');
    if (otp.tries >= 5) return setMsg('rOtpMsg', 'Bahut zyada galat koshish. Naya OTP bhejein.', 'err');
    otp.tries++;
    sha(v + em).then(function (h) {
      if (h === otp.hash) { otp.verified = true; setMsg('rOtpMsg', '✔ Email verified', 'ok'); }
      else setMsg('rOtpMsg', 'Galat OTP.', 'err');
    });
  }

  /* ---------- Register ---------- */
  function checked(name) { return Array.prototype.map.call(document.querySelectorAll('input[name=' + name + ']:checked'), function (x) { return x.value; }); }
  function register(e) {
    e.preventDefault();
    var d = {
      firstName: $('#rF').value.trim(), middleName: $('#rM').value.trim(), lastName: $('#rL').value.trim(),
      email: $('#rE').value.trim().toLowerCase(), mobile: $('#rMob').value.replace(/[\s-]/g, ''),
      country: $('#rC').value, state: $('#rS').value.trim(), city: $('#rCi').value.trim(),
      categories: checked('cat'), purposes: checked('pur')
    }, p = $('#rP').value, p2 = $('#rP2').value, err = '';
    if (!d.firstName || !d.lastName) err = 'First aur Last name zaroori hai.';
    else if (!validEmail(d.email)) err = 'Sahi email ID daaliye.';
    else if (!otp.verified || otp.email !== d.email) err = 'Pehle email OTP verify kijiye.';
    else if (!/^\+?\d{7,15}$/.test(d.mobile)) err = 'Sahi mobile number daaliye (7–15 digits).';
    else if (p.length < 8) err = 'Password kam se kam 8 characters ka ho.';
    else if (p !== p2) err = 'Password aur Confirm Password match nahi karte.';
    else if (!d.country || !d.state || !d.city) err = 'Country, State aur City chuniye.';
    else if (!d.categories.length) err = 'Kam se kam ek User Category chuniye.';
    else if (!d.purposes.length) err = 'Kam se kam ek Purpose chuniye.';
    else if (!$('#rT').checked) err = 'Terms & Conditions aur Privacy Policy accept karna zaroori hai.';
    if (err) return setMsg('rMsg', err, 'err');
    var btn = $('#rGo'); btn.disabled = true; setMsg('rMsg', 'Account ban raha hai…');
    loadFb().then(function (f) {
      return f.A.createUserWithEmailAndPassword(f.auth, d.email, p).then(function (cr) {
        var name = [d.firstName, d.middleName, d.lastName].filter(Boolean).join(' ');
        d.fullName = name; d.photo = photoData; d.emailVerified = true; d.termsAccepted = true;
        d.uid = cr.user.uid; d.createdAt = f.F.serverTimestamp(); d.lastLogin = f.F.serverTimestamp();
        return f.A.updateProfile(cr.user, { displayName: name }).catch(function () { })
          .then(function () { return f.F.setDoc(f.F.doc(f.db, C.usersCollection || 'toolUsers', cr.user.uid), d); });
      });
    }).then(function () { toast('Account ban gaya! Welcome 🎉'); done(); })
      .catch(function (er) { setMsg('rMsg', nice(er), 'err'); })
      .then(function () { btn.disabled = false; });
  }

  /* ---------- Login ---------- */
  function login(e) {
    e.preventDefault();
    var em = $('#lE').value.trim().toLowerCase(), p = $('#lP').value;
    if (!validEmail(em) || !p) return setMsg('lMsg', 'Email aur password daaliye.', 'err');
    var btn = $('#lGo'); btn.disabled = true; setMsg('lMsg', 'Sign in ho raha hai…');
    loadFb().then(function (f) {
      return f.A.signInWithEmailAndPassword(f.auth, em, p).then(function (cr) {
        return f.F.setDoc(f.F.doc(f.db, C.usersCollection || 'toolUsers', cr.user.uid), { lastLogin: f.F.serverTimestamp() }, { merge: true }).catch(function () { });
      });
    }).then(function () { toast('Welcome back!'); done(); })
      .catch(function (er) { setMsg('lMsg', nice(er), 'err'); })
      .then(function () { btn.disabled = false; });
  }
  function forgot() {
    var em = $('#lE').value.trim().toLowerCase();
    if (!validEmail(em)) return setMsg('lMsg', 'Pehle apna email ID daaliye.', 'err');
    loadFb().then(function (f) { return f.A.sendPasswordResetEmail(f.auth, em); })
      .then(function () { setMsg('lMsg', 'Password reset link email par bhej diya.', 'ok'); })
      .catch(function (er) { setMsg('lMsg', nice(er), 'err'); });
  }
  function nice(er) {
    var c = (er && er.code) || '';
    var m = {
      'auth/email-already-in-use': 'Is email se account pehle se hai. Sign In kijiye.',
      'auth/invalid-credential': 'Email ya password galat hai.', 'auth/wrong-password': 'Password galat hai.',
      'auth/user-not-found': 'Is email se account nahi mila.', 'auth/weak-password': 'Password kamzor hai.',
      'auth/too-many-requests': 'Bahut koshish ho gayi, thodi der baad try karein.', 'auth/network-request-failed': 'Internet check kijiye.',
      'permission-denied': 'Firestore rules me permission nahi hai.'
    };
    return m[c] || (er && er.message) || 'Kuch galat hua.';
  }
  function done() {
    var h = pendingHash; hide();
    if (h) location.hash = h;
  }

  /* ---------- Gate + nav ---------- */
  function isToolHash(h) { return h && h.length > 2 && h.indexOf('#/') === 0; }
  function gate() {
    var h = location.hash;
    if (user || !isToolHash(h)) return;
    pendingHash = h; location.hash = '#/';
    show('log'); toast('Tool use karne ke liye pehle Sign In / Register kijiye');
  }
  function paintNav() {
    var box = $('.hub-actions'); if (!box) return;
    var el = document.getElementById('pjAnav');
    if (!el) { el = document.createElement('div'); el.id = 'pjAnav'; el.className = 'pjA-user'; box.insertBefore(el, box.firstChild); }
    if (user) {
      var n = (profile && profile.fullName) || user.displayName || user.email, ph = profile && profile.photo;
      el.innerHTML = '<button type="button" class="pjA-avbtn" id="pjAav" title="My Account" aria-label="My Account">' +
        (ph ? '<img src="' + esc(ph) + '" alt="">' : esc(n.charAt(0).toUpperCase())) + '</button>';
      $('#pjAav').onclick = function () { drShow('profile'); };
    } else {
      el.innerHTML = '<button type="button" class="pjA-navbtn" id="pjAin">Sign In</button>';
      $('#pjAin').onclick = function () { show('log'); };
    }
    if (dr && !dr.hidden) { if (user) drRender(); else drHide(); }
  }

  /* ---------- Profile sidebar ---------- */
  var dr, drView = 'profile', secTab = 'change';
  var MENU = [['profile', '👤', 'My Profile'], ['settings', '⚙️', 'Account Settings'], ['security', '🔒', 'Security & Password'], ['tools', '🧰', 'My Tools'], ['logout', '🚪', 'Logout']];
  function fmtDate(t) { try { return t && t.toDate ? t.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '–'; } catch (e) { return '–'; } }
  function chipsSel(name, a, sel) {
    sel = sel || [];
    return a.map(function (x) { return '<label><input type="checkbox" name="' + name + '" value="' + esc(x) + '"' + (sel.indexOf(x) > -1 ? ' checked' : '') + '>' + esc(x) + '</label>'; }).join('');
  }
  function drBuild() {
    dr = document.createElement('div'); dr.className = 'pjA-dov'; dr.hidden = true;
    dr.innerHTML = '<aside class="pjA-drawer pjA-box" role="dialog" aria-label="Account menu"><button class="pjA-x" id="pjDx" type="button" aria-label="Close">×</button><div class="pjA-dhead" id="pjDh"></div><nav class="pjA-dnav" id="pjDn"></nav><div class="pjA-dbody" id="pjDb"></div></aside>';
    document.body.appendChild(dr);
    dr.addEventListener('mousedown', function (e) { if (e.target === dr) drHide(); });
    $('#pjDx').onclick = drHide;
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dr && !dr.hidden) drHide(); });
  }
  function drShow(v) { if (!user) return show('log'); if (!dr) drBuild(); drView = v || 'profile'; drRender(); dr.hidden = false; document.body.style.overflow = 'hidden'; }
  function drHide() { if (dr) dr.hidden = true; document.body.style.overflow = ''; }
  function doLogout() {
    loadFb().then(function (f) { return f.A.signOut(f.auth); }).then(function () { drHide(); location.hash = '#/'; toast('Logout ho gaye'); });
  }
  function goTools() {
    drHide();
    var sc = function () { var e = document.getElementById('toolsGrid'); if (e) e.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
    var h = location.hash; if (h && h !== '#/' && h !== '#') { location.hash = '#/'; setTimeout(sc, 350); } else sc();
  }
  function drRender() {
    var p = profile || {}, nm = p.fullName || user.displayName || user.email;
    $('#pjDh').innerHTML = '<div class="pjA-dav">' + (p.photo ? '<img src="' + esc(p.photo) + '" alt="">' : esc(nm.charAt(0).toUpperCase())) + '</div><div><b>' + esc(nm) + '</b><small>' + esc(user.email) + '</small></div>';
    $('#pjDn').innerHTML = MENU.map(function (m) {
      return '<button type="button" data-m="' + m[0] + '" class="' + (m[0] === drView ? 'on' : '') + (m[0] === 'logout' ? ' out' : '') + '"><span>' + m[1] + '</span>' + m[2] + '</button>';
    }).join('');
    Array.prototype.forEach.call(document.querySelectorAll('#pjDn button'), function (b) {
      b.onclick = function () {
        var m = b.getAttribute('data-m');
        if (m === 'logout') return doLogout();
        if (m === 'tools') return goTools();
        drView = m; drRender();
      };
    });
    var body = $('#pjDb');
    if (drView === 'settings') drSettings(body, p);
    else if (drView === 'security') drSecurity(body);
    else drProfile(body, p);
  }
  function drProfile(body, p) {
    var rows = [['Full name', p.fullName || user.displayName], ['Email', user.email], ['Mobile', p.mobile], ['Country', p.country], ['State', p.state], ['City', p.city],
    ['User category', (p.categories || []).join(', ')], ['Purpose', (p.purposes || []).join(', ')], ['Member since', fmtDate(p.createdAt)]];
    body.innerHTML = '<h3>My Profile</h3>' + rows.map(function (r) { return '<div class="pjA-prow"><small>' + r[0] + '</small><span>' + esc(r[1] || '–') + '</span></div>'; }).join('') +
      '<button type="button" class="pjA-btn big" id="pjEdit" style="margin-top:14px">Edit Profile</button>';
    $('#pjEdit').onclick = function () { drView = 'settings'; drRender(); };
  }
  function drSettings(body, p) {
    var phNew = '';
    body.innerHTML = '<h3>Account Settings</h3><form id="pjSF" novalidate><div class="pjA-g">' +
      '<div><label>First Name <i>*</i></label><input type="text" id="sF" value="' + esc(p.firstName) + '"></div>' +
      '<div><label>Middle Name</label><input type="text" id="sM" value="' + esc(p.middleName) + '"></div>' +
      '<div class="full"><label>Last Name <i>*</i></label><input type="text" id="sL" value="' + esc(p.lastName) + '"></div>' +
      '<div class="full"><label>Email ID</label><input type="email" value="' + esc(user.email) + '" disabled></div>' +
      '<div class="full"><label>Mobile Number <i>*</i></label><input type="tel" id="sMob" value="' + esc(p.mobile) + '"></div>' +
      '<div class="full"><label>Profile Photo</label><div class="pjA-photo"><img id="sImg" alt="" src="' + esc(p.photo || 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==') + '"><input type="file" id="sPh" accept="image/*"></div></div>' +
      '<div><label>Country <i>*</i></label><select id="sC">' + opts(COUNTRIES, 'Select country') + '</select></div>' +
      '<div><label>State <i>*</i></label><input type="text" id="sS" list="pjAStates2" value="' + esc(p.state) + '"><datalist id="pjAStates2"></datalist></div>' +
      '<div class="full"><label>City <i>*</i></label><input type="text" id="sCi" value="' + esc(p.city) + '"></div>' +
      '<div class="full"><label>User Category <i>*</i></label><div class="pjA-chips">' + chipsSel('scat', CATS, p.categories) + '</div></div>' +
      '<div class="full"><label>Purpose of Using Tools <i>*</i></label><div class="pjA-chips">' + chipsSel('spur', PURPOSES, p.purposes) + '</div></div>' +
      '</div><div class="pjA-msg" id="pjSMsg"></div><button type="submit" class="pjA-btn big" id="pjSSave" style="margin-top:10px">Save Changes</button></form>';
    if (p.country) $('#sC').value = p.country;
    function fillStates() { $('#pjAStates2').innerHTML = $('#sC').value === 'India' ? STATES_IN.map(function (s) { return '<option value="' + esc(s) + '">'; }).join('') : ''; }
    fillStates(); $('#sC').onchange = fillStates;
    $('#sPh').onchange = function () {
      var f = $('#sPh').files[0]; phNew = ''; if (!f) return;
      if (!/^image\//.test(f.type)) return setMsg('pjSMsg', 'Sirf image file chunein.', 'err');
      var img = new Image(), url = URL.createObjectURL(f);
      img.onload = function () {
        var s = 256, c = document.createElement('canvas'), m = Math.min(img.width, img.height); c.width = c.height = s;
        c.getContext('2d').drawImage(img, (img.width - m) / 2, (img.height - m) / 2, m, m, 0, 0, s, s);
        phNew = c.toDataURL('image/jpeg', .82); $('#sImg').src = phNew; URL.revokeObjectURL(url);
      };
      img.src = url;
    };
    $('#pjSF').onsubmit = function (e) {
      e.preventDefault();
      var d = { firstName: $('#sF').value.trim(), middleName: $('#sM').value.trim(), lastName: $('#sL').value.trim(), mobile: $('#sMob').value.replace(/[\s-]/g, ''),
        country: $('#sC').value, state: $('#sS').value.trim(), city: $('#sCi').value.trim(), categories: checked('scat'), purposes: checked('spur') }, err = '';
      if (!d.firstName || !d.lastName) err = 'First aur Last name zaroori hai.';
      else if (!/^\+?\d{7,15}$/.test(d.mobile)) err = 'Sahi mobile number daaliye (7–15 digits).';
      else if (!d.country || !d.state || !d.city) err = 'Country, State aur City chuniye.';
      else if (!d.categories.length) err = 'Kam se kam ek User Category chuniye.';
      else if (!d.purposes.length) err = 'Kam se kam ek Purpose chuniye.';
      if (err) return setMsg('pjSMsg', err, 'err');
      d.fullName = [d.firstName, d.middleName, d.lastName].filter(Boolean).join(' ');
      if (phNew) d.photo = phNew;
      var btn = $('#pjSSave'); btn.disabled = true; setMsg('pjSMsg', 'Save ho raha hai…');
      loadFb().then(function (f) {
        return f.A.updateProfile(user, { displayName: d.fullName }).catch(function () { })
          .then(function () { return f.F.updateDoc(f.F.doc(f.db, C.usersCollection || 'toolUsers', user.uid), d); });
      }).then(function () {
        for (var k in d) profile = profile || {}, profile[k] = d[k];
        paintNav(); toast('Profile update ho gaya'); drView = 'profile'; drRender();
      }).catch(function (er) { setMsg('pjSMsg', nice(er), 'err'); btn.disabled = false; });
    };
  }
  function drSecurity(body) {
    body.innerHTML = '<h3>Security &amp; Password</h3>' +
      '<div class="pjA-tabs"><button type="button" data-t="change" class="' + (secTab === 'change' ? 'on' : '') + '">Change Password</button><button type="button" data-t="link" class="' + (secTab === 'link' ? 'on' : '') + '">Forgot Password</button></div>' +
      (secTab === 'change'
        ? '<form id="pjPF" novalidate><div class="pjA-g"><div class="full"><label>Current Password</label><input type="password" id="pC" autocomplete="current-password"></div>' +
        '<div class="full"><label>New Password</label><input type="password" id="pN" autocomplete="new-password" placeholder="Min 8 characters"></div>' +
        '<div class="full"><label>Confirm New Password</label><input type="password" id="pN2" autocomplete="new-password"></div></div>' +
        '<div class="pjA-msg" id="pjPMsg"></div><button type="submit" class="pjA-btn big" id="pjPGo" style="margin-top:10px">Update Password</button>' +
        '<p class="pjA-sw">Current password yaad nahi? <a id="pjToLink">Email par reset link bhejein</a></p></form>'
        : '<div class="pjA-prow"><small>Reset link is email par jayega</small><span>' + esc(user.email) + '</span></div>' +
        '<p class="pjA-sub" style="margin-top:12px">Link par click karke aap naya password set kar sakte hain.</p>' +
        '<div class="pjA-msg" id="pjPMsg"></div><button type="button" class="pjA-btn big" id="pjLinkGo">Send Reset Link</button>' +
        '<p class="pjA-sw"><a id="pjToChange">Current password se badlein</a></p>');
    Array.prototype.forEach.call(document.querySelectorAll('.pjA-tabs button'), function (b) { b.onclick = function () { secTab = b.getAttribute('data-t'); drRender(); }; });
    if (secTab === 'change') {
      $('#pjToLink').onclick = function () { secTab = 'link'; drRender(); };
      $('#pjPF').onsubmit = function (e) {
        e.preventDefault();
        var c = $('#pC').value, n = $('#pN').value, n2 = $('#pN2').value, err = '';
        if (!c) err = 'Current password daaliye.';
        else if (n.length < 8) err = 'Naya password kam se kam 8 characters ka ho.';
        else if (n !== n2) err = 'New aur Confirm password match nahi karte.';
        else if (n === c) err = 'Naya password purane se alag hona chahiye.';
        if (err) return setMsg('pjPMsg', err, 'err');
        var btn = $('#pjPGo'); btn.disabled = true; setMsg('pjPMsg', 'Update ho raha hai…');
        loadFb().then(function (f) {
          return f.A.reauthenticateWithCredential(user, f.A.EmailAuthProvider.credential(user.email, c)).then(function () { return f.A.updatePassword(user, n); });
        }).then(function () { setMsg('pjPMsg', '✔ Password badal gaya.', 'ok'); toast('Password update ho gaya'); $('#pjPF').reset(); btn.disabled = false; })
          .catch(function (er) {
            var code = (er && er.code) || '';
            setMsg('pjPMsg', (code === 'auth/wrong-password' || code === 'auth/invalid-credential') ? 'Current password galat hai.' : nice(er), 'err'); btn.disabled = false;
          });
      };
    } else {
      $('#pjToChange').onclick = function () { secTab = 'change'; drRender(); };
      $('#pjLinkGo').onclick = function () {
        var btn = $('#pjLinkGo'); btn.disabled = true; setMsg('pjPMsg', 'Link bheja ja raha hai…');
        loadFb().then(function (f) { return f.A.sendPasswordResetEmail(f.auth, user.email); })
          .then(function () { setMsg('pjPMsg', '✔ Reset link ' + user.email + ' par bhej diya. Inbox/Spam check karein.', 'ok'); })
          .catch(function (er) { setMsg('pjPMsg', nice(er), 'err'); }).then(function () { setTimeout(function () { btn.disabled = false; }, 30000); });
      };
    }
  }

  function init() {
    build(); paintNav(); gate();
    window.addEventListener('hashchange', gate);
    if (!cfg()) { console.warn('[pj-auth] Firebase config missing – fill pj-auth-config.js'); return; }
    loadFb().then(function (f) {
      f.A.onAuthStateChanged(f.auth, function (u) {
        user = u; profile = null;
        if (u) f.F.getDoc(f.F.doc(f.db, C.usersCollection || 'toolUsers', u.uid)).then(function (s) { profile = s.exists() ? s.data() : null; paintNav(); }).catch(function () { });
        paintNav(); if (!u) gate(); else if (pendingHash && ov && !ov.hidden) done();
      });
    }).catch(function (e) { console.warn('[pj-auth]', e); });
  }
  window.PJAuth = { show: show, isLoggedIn: function () { return !!user; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
