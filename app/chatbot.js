/*!
 * Peeyush Jangid – AI Chat Assistant (24x7, Unlimited Questions)
 * Ek hi file website (/) aur app (/app/) dono mein use hoti hai.
 * Setup: API_URL mein apna Cloudflare Worker URL daalo (worker.js dekho).
 * API_URL khaali ho to widget FAQ mode mein chalta hai (bina AI ke bhi 24x7 jawab deta hai).
 */
(function () {
  "use strict";
  if (window.__peeyushChat) return;
  window.__peeyushChat = true;

  var CONFIG = {
    API_URL: "https://morning-union-c527.pusjangid123.workers.dev",
    WHATSAPP: "919928579369",
    PHONE_TEXT: "+91 99285 79369",
    EMAIL: "peeyush.jangid@outlook.com",
    CV: "https://peeyush-jangid.github.io/Peeyush_Kumar_Jangid_Resume.pdf",
    NAME: "Peeyush's Assistant",
    MAX_HISTORY: 12,   // sirf AI ko context bhejne ke liye; sawalon ki koi limit nahi
    MAX_INPUT: 500,    // ek message ki max length
    COOLDOWN_MS: 600   // sirf double-tap se bachne ke liye
  };

  var GREETING =
    "Namaste! 🙏\nMain Peeyush Kumar Jangid ka AI assistant hoon. Aap unke HVAC experience, projects, skills ya hiring ke baare mein kuch bhi pooch sakte hain, bina kisi limit ke. Main 24x7 available hoon. 😊";

  // ---- Icons ----
  function icon(paths) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + "</svg>";
  }
  var IC = {
    brief: icon('<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>'),
    folder: icon('<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>'),
    tools: icon('<circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.2 4.2l2.8 2.8M17 17l2.8 2.8M1 12h4M19 12h4M4.2 19.8 7 17M17 7l2.8-2.8"/>'),
    file: icon('<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>'),
    mail: icon('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>'),
    users: icon('<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>'),
    plane: icon('<path d="M22 2 11 13"/><path d="M22 2 15 22l-4-9-9-4z"/>'),
    min: icon('<path d="M5 12h14"/>'),
    close: icon('<path d="M18 6 6 18M6 6l12 12"/>'),
    bolt: '<svg viewBox="0 0 24 24" fill="#f59e0b"><path d="M13 2 4 14h7l-1 8 9-12h-7z"/></svg>',
    inf: '<svg viewBox="0 0 32 16" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M16 8c-2.5-3.5-4.5-5-7-5a5 5 0 0 0 0 10c2.5 0 4.5-1.500 7-5s4.500-5 7-5a5 5 0 0 1 0 10c-2.500 0-4.500-1.500-7-5z"/></svg>',
    verified: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#38bdf8"/><path d="m7 12.500 3.200 3.200L17 9" fill="none" stroke="#fff" stroke-width="2.600" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // ---- Professional robot logo (SVG) ----
  function robot(id) {
    return '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<defs><linearGradient id="pjg' + id + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#1d4ed8"/></linearGradient></defs>' +
      '<circle cx="50" cy="50" r="48" fill="url(#pjg' + id + ')"/>' +
      '<line x1="50" y1="14" x2="50" y2="23" stroke="#fff" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="50" cy="12" r="4.500" fill="#fff"/>' +
      '<rect x="19" y="40" width="8" height="17" rx="4" fill="#7dd3fc"/>' +
      '<rect x="73" y="40" width="8" height="17" rx="4" fill="#7dd3fc"/>' +
      '<rect x="25" y="22" width="50" height="42" rx="19" fill="#fff"/>' +
      '<rect x="31" y="30" width="38" height="26" rx="12" fill="#0b1b3a"/>' +
      '<path d="M37 43q4.500-6.500 9 0M54 43q4.500-6.500 9 0" stroke="#38bdf8" stroke-width="3.200" fill="none" stroke-linecap="round"/>' +
      '<path d="M44 49q6 5.500 12 0" stroke="#38bdf8" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<path d="M29 90q0-23 21-23t21 23z" fill="#fff"/>' +
      '<circle cx="50" cy="78" r="3.500" fill="#2563eb"/>' +
      "</svg>";
  }

  // Chips: label, icon, type (ask / link / contact)
  var CHIPS = [
    { t: "Experience", q: "Aapka experience kya hai?", i: IC.brief },
    { t: "Projects", q: "Kaun se projects kiye hain?", i: IC.folder },
    { t: "Skills & Tools", q: "Skills aur tools kaun se hain?", i: IC.tools },
    { t: "Download CV", link: CONFIG.CV, i: IC.file },
    { t: "Contact", contact: true, i: IC.mail },
    { t: "Job Offer", q: "Mujhe job offer bhejna hai", i: IC.users }
  ];

  var CONTACT_HTML =
    'Peeyush se seedha sampark karein:\n📞 <a href="tel:+' + CONFIG.WHATSAPP + '">' + CONFIG.PHONE_TEXT + "</a>\n" +
    '💬 <a href="https://wa.me/' + CONFIG.WHATSAPP + '" target="_blank" rel="noopener">WhatsApp par message karein</a>\n' +
    '✉️ <a href="mailto:' + CONFIG.EMAIL + '">' + CONFIG.EMAIL + "</a>";

  // ---- Offline FAQ (fallback jab API_URL set na ho ya server down ho) ----
  var FAQ = [
    { k: ["experience", "anubhav", "work", "company", "climatech"],
      a: "Peeyush ke paas Climatech Aircon Engineers Pvt Ltd, Jaipur mein Project Engineer (HVAC) ka lagbhag 10 mahine ka experience hai (Oct 2025 – Aug 2026).\n\nMain kaam: site supervision, HVAC installation support, AutoCAD 2D drawings aur pre-commissioning." },
    { k: ["project", "geetanjali", "jecrc", "hospital", "university"],
      a: "Major projects:\n1) Geetanjali Hospital, Jaipur: VRV, chiller, FCU, ducting aur AHU installation.\n2) JECRC University, Alwar: HVAC billing aur daily reports (MS Excel).\n3) Alag-alag sites par pre-commissioning documentation." },
    { k: ["skill", "tool", "autocad", "excel", "software", "tally", "vrv", "chiller", "ducting"],
      a: "Skills: HVAC installation, site supervision, VRV/VRF drawing, pre-commissioning documentation, billing.\nTools: AutoCAD 2D, MS Excel, Word, PowerPoint, Tally Prime.\nSystems: VRV/VRF, chilled water, ducting, AHU, FCU." },
    { k: ["cv", "resume", "download"],
      a: 'Aap CV yahan se download kar sakte hain: <a href="' + CONFIG.CV + '" target="_blank" rel="noopener">Download CV</a>' },
    { k: ["contact", "phone", "call", "number", "email", "mail", "whatsapp", "baat"],
      a: CONTACT_HTML },
    { k: ["job", "hire", "hiring", "offer", "vacancy", "opportunity", "interview", "salary"],
      a: "Peeyush suitable opportunities ke liye open hain (HVAC Project Engineer, Site Supervision, Project Coordination – Jaipur ya aas-paas).\n\nRole, company, location aur CTC ki details page ke 'Send job offer' form ya WhatsApp par bhej dijiye, wo jaldi sampark karenge." },
    { k: ["education", "study", "degree", "qualification", "padhai", "b.sc", "bsc"],
      a: "Education: B.Sc. (PCM), University of Rajasthan, Jaipur.\nCertifications: RS-CIT (VMOU Kota, 2025) aur BCBF (Parivartan Skills Academy, Jaipur)." },
    { k: ["location", "where", "kahan", "jaipur", "city"],
      a: "Peeyush Jaipur, Rajasthan mein based hain." },
    { k: ["language", "bhasha", "hindi", "english"],
      a: "Peeyush Hindi aur English dono mein comfortably kaam karte hain." },
    { k: ["hello", "hi", "hey", "namaste", "hii"],
      a: "Namaste! 🙏 Aap experience, projects, skills, CV ya hiring ke baare mein pooch sakte hain." }
  ];
  var FALLBACK =
    "Is sawal ka pakka jawab mere paas abhi nahi hai. Behtar hoga ki aap seedha Peeyush se WhatsApp ya email par baat karein, wo jaldi reply karenge.";

  function faqAnswer(q) {
    var t = q.toLowerCase();
    var best = null, score = 0;
    FAQ.forEach(function (f) {
      var s = 0;
      f.k.forEach(function (w) { if (t.indexOf(w) !== -1) s++; });
      if (s > score) { score = s; best = f; }
    });
    return best ? { html: best.a } : { text: FALLBACK };
  }

  // ---- Styles ----
  var css = [
    ".pjc-btn{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:2147483000;width:66px;height:66px;border-radius:50%;border:0;padding:0;cursor:pointer;background:transparent;box-shadow:0 0 0 3px rgba(56,189,248,.55),0 10px 28px rgba(37,99,235,.55);transition:transform .2s}",
    ".pjc-btn:hover{transform:scale(1.07)}",
    ".pjc-btn::after{content:'';position:absolute;inset:-6px;border-radius:50%;border:2px solid rgba(56,189,248,.6);animation:pjcPulse 2.2s infinite}",
    "@keyframes pjcPulse{0%{transform:scale(.92);opacity:.9}100%{transform:scale(1.25);opacity:0}}",
    ".pjc-btn>svg{width:100%;height:100%;display:block;border-radius:50%}",
    ".pjc-dot{position:absolute;top:2px;right:2px;width:14px;height:14px;border-radius:50%;background:#22c55e;border:2px solid #071426}",
    ".pjc-inf{position:absolute;left:-6px;bottom:-4px;display:flex;align-items:center;gap:3px;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;border-radius:999px;font:700 10px system-ui,sans-serif;padding:3px 7px 3px 5px;border:2px solid #071426;letter-spacing:.2px}",
    ".pjc-inf svg{width:15px;height:8px}",
    ".pjc-panel{position:fixed;right:18px;bottom:calc(98px + env(safe-area-inset-bottom,0px));z-index:2147483000;width:380px;max-width:calc(100vw - 24px);height:600px;max-height:calc(100vh - 124px);background:#f8faff;color:#0f1f3d;border-radius:22px;box-shadow:0 24px 70px rgba(2,12,40,.55);display:none;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:14.5px}",
    ".pjc-panel.open{display:flex;animation:pjcIn .25s ease}",
    "@keyframes pjcIn{from{opacity:0;transform:translateY(14px) scale(.98)}to{opacity:1;transform:none}}",
    ".pjc-head{display:flex;align-items:center;gap:12px;padding:14px 14px 16px 16px;background:linear-gradient(135deg,#0ea5e9 0%,#2563eb 55%,#3730a3 100%);color:#fff}",
    ".pjc-av{position:relative;width:46px;height:46px;flex:none;border-radius:50%;box-shadow:0 0 0 2px rgba(255,255,255,.55)}",
    ".pjc-av svg{width:100%;height:100%;display:block;border-radius:50%}",
    ".pjc-av i{position:absolute;right:-1px;bottom:0;width:12px;height:12px;border-radius:50%;background:#22c55e;border:2px solid #2563eb}",
    ".pjc-ht{flex:1;min-width:0}",
    ".pjc-ht b{display:flex;align-items:center;gap:6px;font-size:16px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
    ".pjc-ht b svg{width:17px;height:17px;flex:none}",
    ".pjc-ht span{display:block;font-size:12.5px;opacity:.92;margin-top:2px}",
    ".pjc-hb{background:rgba(255,255,255,.14);border:0;color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}",
    ".pjc-hb:hover{background:rgba(255,255,255,.28)}",
    ".pjc-hb svg{width:17px;height:17px}",
    ".pjc-body{flex:1;overflow-y:auto;padding:16px 14px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;background:#f8faff}",
    ".pjc-row{display:flex;gap:8px;align-items:flex-end}",
    ".pjc-mini{width:30px;height:30px;flex:none}",
    ".pjc-mini svg{width:100%;height:100%;display:block;border-radius:50%}",
    ".pjc-m{max-width:84%;padding:10px 14px;border-radius:16px;line-height:1.55;word-wrap:break-word;white-space:pre-wrap}",
    ".pjc-m a{color:#1d4ed8;font-weight:600}",
    ".pjc-bot{background:#e3ebfb;color:#0f1f3d;border-bottom-left-radius:5px}",
    ".pjc-user{align-self:flex-end;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;border-bottom-right-radius:5px}",
    ".pjc-user a{color:#fff}",
    ".pjc-ask{align-self:flex-start;display:inline-flex;align-items:center;gap:7px;background:#cfe0fb;color:#0b2a66;font-weight:700;border-radius:14px;padding:9px 14px;font-size:14px;margin-top:2px}",
    ".pjc-ask svg{width:16px;height:16px}",
    ".pjc-chips{display:flex;flex-wrap:wrap;gap:8px}",
    ".pjc-chip{display:inline-flex;align-items:center;gap:7px;background:#fff;border:1.5px solid #bcd3f7;color:#0f2a5e;border-radius:999px;padding:8px 13px;font-size:13.5px;font-weight:500;cursor:pointer;transition:all .15s}",
    ".pjc-chip svg{width:16px;height:16px;color:#2563eb;flex:none}",
    ".pjc-chip:hover{background:#eaf2ff;border-color:#2563eb}",
    ".pjc-typing{display:inline-flex;gap:4px;padding:3px 0}.pjc-typing i{width:7px;height:7px;border-radius:50%;background:#2563eb;animation:pjcB 1s infinite}.pjc-typing i:nth-child(2){animation-delay:.15s}.pjc-typing i:nth-child(3){animation-delay:.3s}",
    "@keyframes pjcB{0%,80%,100%{opacity:.25}40%{opacity:1}}",
    ".pjc-form{display:flex;align-items:center;gap:8px;margin:6px 12px 4px;padding:5px 5px 5px 14px;background:#fff;border:1.5px solid #d3e0f6;border-radius:999px}",
    ".pjc-form:focus-within{border-color:#2563eb;box-shadow:0 0 0 3px rgba(37,99,235,.12)}",
    ".pjc-in{flex:1;background:transparent;border:0;color:#0f1f3d;padding:8px 0;font-size:16px;outline:none;min-width:0}",
    ".pjc-in::placeholder{color:#7b8aa6}",
    ".pjc-send{width:42px;height:42px;flex:none;border-radius:50%;border:0;cursor:pointer;background:linear-gradient(135deg,#2563eb,#1d4ed8);color:#fff;display:flex;align-items:center;justify-content:center;padding:0;box-shadow:0 4px 12px rgba(37,99,235,.4)}",
    ".pjc-send svg{width:19px;height:19px}",
    ".pjc-send:disabled{opacity:.5;cursor:not-allowed}",
    ".pjc-note{display:flex;align-items:center;justify-content:center;gap:7px;font-size:12px;color:#334766;padding:6px 10px 12px;flex-wrap:wrap}",
    ".pjc-note b{color:#15803d;display:inline-flex;align-items:center;gap:5px}",
    ".pjc-note b svg{width:22px;height:11px}",
    ".pjc-note u{text-decoration:none;display:inline-flex;align-items:center;gap:3px}",
    ".pjc-note u svg{width:12px;height:12px}",
    "@media(max-width:480px){.pjc-panel{right:8px;left:8px;width:auto;bottom:calc(92px + env(safe-area-inset-bottom,0px));height:calc(100vh - 116px)}}"
  ].join("");

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // ---- DOM ----
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  var btn = el("button", "pjc-btn");
  btn.setAttribute("aria-label", "Chat with Peeyush's assistant – unlimited questions, 24x7");
  btn.innerHTML = robot("b");
  btn.appendChild(el("span", "pjc-dot"));
  var infBadge = el("span", "pjc-inf");
  infBadge.innerHTML = IC.inf + "<span>Unlimited</span>";
  btn.appendChild(infBadge);

  var panel = el("div", "pjc-panel");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", CONFIG.NAME);

  var head = el("div", "pjc-head");
  var av = el("div", "pjc-av");
  av.innerHTML = robot("h") + "<i></i>";
  head.appendChild(av);
  var ht = el("div", "pjc-ht");
  var title = el("b");
  title.appendChild(document.createTextNode(CONFIG.NAME));
  var vb = el("span");
  vb.style.cssText = "display:inline-flex;margin:0;opacity:1";
  vb.innerHTML = IC.verified;
  title.appendChild(vb);
  ht.appendChild(title);
  ht.appendChild(el("span", "", "Online • 24x7 Support"));
  head.appendChild(ht);
  var minBtn = el("button", "pjc-hb");
  minBtn.setAttribute("aria-label", "Minimize chat");
  minBtn.innerHTML = IC.min;
  var closeBtn = el("button", "pjc-hb");
  closeBtn.setAttribute("aria-label", "Close chat");
  closeBtn.innerHTML = IC.close;
  head.appendChild(minBtn); head.appendChild(closeBtn);

  var body = el("div", "pjc-body");
  body.setAttribute("aria-live", "polite");

  var form = el("form", "pjc-form");
  var input = el("input", "pjc-in");
  input.type = "text"; input.placeholder = "Apna sawal yahan likhiye…";
  input.maxLength = CONFIG.MAX_INPUT; input.autocomplete = "off";
  input.setAttribute("aria-label", "Type your message");
  var send = el("button", "pjc-send");
  send.type = "submit";
  send.setAttribute("aria-label", "Send message");
  send.innerHTML = IC.plane;
  form.appendChild(input); form.appendChild(send);

  var note = el("div", "pjc-note");
  note.innerHTML = "<b>" + IC.inf + "No Question Limit</b><span>•</span><u>Chat Anytime, Anywhere " + IC.bolt + "</u>";

  panel.appendChild(head); panel.appendChild(body);
  panel.appendChild(form); panel.appendChild(note);
  document.body.appendChild(btn); document.body.appendChild(panel);

  // ---- State ----
  var history = [];
  var busy = false, lastSent = 0, started = false;
  try { history = JSON.parse(sessionStorage.getItem("pjc_h") || "[]"); } catch (e) { history = []; }

  function save() {
    try { sessionStorage.setItem("pjc_h", JSON.stringify(history.slice(-CONFIG.MAX_HISTORY))); } catch (e) {}
  }
  function scroll() { body.scrollTop = body.scrollHeight; }

  function addMsg(role, content, isHtml) {
    var m = el("div", "pjc-m " + (role === "user" ? "pjc-user" : "pjc-bot"));
    if (isHtml) m.innerHTML = content; else m.textContent = content;
    if (role === "user") {
      body.appendChild(m);
    } else {
      var row = el("div", "pjc-row");
      var mini = el("div", "pjc-mini");
      mini.innerHTML = robot("m" + body.children.length);
      row.appendChild(mini); row.appendChild(m);
      body.appendChild(row);
    }
    scroll();
    return m;
  }

  // Safe linkify: text ko escape karke sirf URL ko link banata hai
  function linkify(t) {
    var s = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return s.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  function showChips() {
    var q = el("div", "pjc-ask");
    q.innerHTML = IC.bolt + "<span>Aap yahan kya pooch sakte hain?</span>";
    body.appendChild(q);
    var wrap = el("div", "pjc-chips");
    CHIPS.forEach(function (c) {
      var b = el("button", "pjc-chip");
      b.type = "button";
      b.innerHTML = c.i + "<span>" + c.t + "</span>";
      b.onclick = function () {
        if (c.link) { window.open(c.link, "_blank", "noopener"); return; }
        q.remove(); wrap.remove();
        if (c.contact) { showContact(c.t); return; }
        ask(c.q);
      };
      wrap.appendChild(b);
    });
    body.appendChild(wrap); scroll();
  }

  function showContact(label) {
    addMsg("user", label);
    history.push({ role: "user", content: label });
    addMsg("bot", CONTACT_HTML, true);
    history.push({ role: "assistant", content: "Contact: " + CONFIG.PHONE_TEXT + ", " + CONFIG.EMAIL });
    save();
  }

  function start() {
    if (started) return;
    started = true;
    if (history.length) {
      history.forEach(function (h) {
        if (h.role === "user") addMsg("user", h.content);
        else addMsg("bot", linkify(h.content), true);
      });
    } else {
      addMsg("bot", GREETING);
      showChips();
    }
  }

  function toggle(open) {
    var willOpen = typeof open === "boolean" ? open : !panel.classList.contains("open");
    panel.classList.toggle("open", willOpen);
    if (willOpen) { start(); setTimeout(function () { input.focus(); }, 150); }
  }
  btn.onclick = function () { toggle(); };
  closeBtn.onclick = function () { toggle(false); };
  minBtn.onclick = function () { toggle(false); };
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") toggle(false); });

  // ---- Ask ----
  function ask(text) {
    text = (text || "").trim().slice(0, CONFIG.MAX_INPUT);
    if (!text || busy) return;
    var now = Date.now();
    if (now - lastSent < CONFIG.COOLDOWN_MS) return;
    lastSent = now;

    addMsg("user", text);
    history.push({ role: "user", content: text });
    busy = true; send.disabled = true;

    var typingRow = el("div", "pjc-row");
    var mini = el("div", "pjc-mini");
    mini.innerHTML = robot("t");
    var typing = el("div", "pjc-m pjc-bot");
    var dots = el("span", "pjc-typing");
    dots.innerHTML = "<i></i><i></i><i></i>";
    typing.appendChild(dots);
    typingRow.appendChild(mini); typingRow.appendChild(typing);
    body.appendChild(typingRow); scroll();

    function done(reply, isHtml) {
      typingRow.remove();
      var plain = isHtml ? reply.replace(/<[^>]+>/g, "") : reply;
      addMsg("bot", isHtml ? reply : linkify(reply), true);
      history.push({ role: "assistant", content: plain });
      history = history.slice(-CONFIG.MAX_HISTORY);
      save();
      busy = false; send.disabled = false; input.focus();
    }

    function offline() {
      var r = faqAnswer(text);
      setTimeout(function () { r.html ? done(r.html, true) : done(r.text, false); }, 500);
    }

    if (!CONFIG.API_URL) return offline();

    var ctrl = new AbortController();
    var to = setTimeout(function () { ctrl.abort(); }, 20000);
    fetch(CONFIG.API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history.slice(-CONFIG.MAX_HISTORY) }),
      signal: ctrl.signal
    })
      .then(function (r) { if (!r.ok) throw new Error("bad status"); return r.json(); })
      .then(function (d) {
        clearTimeout(to);
        if (!d || !d.reply) throw new Error("empty");
        done(String(d.reply), false);
      })
      .catch(function () { clearTimeout(to); offline(); });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = input.value;
    input.value = "";
    ask(v);
  });
})();
