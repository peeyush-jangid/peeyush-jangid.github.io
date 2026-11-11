/*!
 * Peeyush Jangid – AI Chat Assistant (24x7)
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
    EMAIL: "peeyush.jangid@outlook.com",
    CV: "https://peeyush-jangid.github.io/Peeyush_Kumar_Jangid_Resume.pdf",
    NAME: "Peeyush's Assistant",
    MAX_HISTORY: 12,
    MAX_INPUT: 500,
    COOLDOWN_MS: 1500
  };

  var GREETING =
    "Namaste! 👋 Main Peeyush Kumar Jangid ka AI assistant hoon. Aap unke HVAC experience, projects, skills ya hiring ke baare mein kuch bhi pooch sakte hain. Main 24x7 available hoon.";

  var CHIPS = [
    "Aapka experience kya hai?",
    "Kaun se projects kiye hain?",
    "Skills aur tools?",
    "CV download karna hai",
    "Job offer bhejna hai"
  ];

  // ---- Offline FAQ (fallback jab API_URL set na ho ya server down ho) ----
  var FAQ = [
    { k: ["experience", "anubhav", "work", "company", "climatech"],
      a: "Peeyush ke paas Climatech Aircon Engineers Pvt Ltd, Jaipur mein Project Engineer (HVAC) ka lagbhag 10 mahine ka experience hai (Oct 2025 – Aug 2026). Site supervision, HVAC installation support, AutoCAD 2D drawings aur pre-commissioning unke main kaam rahe." },
    { k: ["project", "geetanjali", "jecrc", "hospital", "university"],
      a: "Major projects: (1) Geetanjali Hospital, Jaipur – VRV, chiller, FCU, ducting aur AHU installation. (2) JECRC University, Alwar – HVAC billing aur daily reports MS Excel mein. (3) Alag-alag sites par pre-commissioning documentation." },
    { k: ["skill", "tool", "autocad", "excel", "software", "tally", "vrv", "chiller", "ducting"],
      a: "Skills: HVAC installation & site supervision, VRV/VRF drawing (AutoCAD 2D), pre-commissioning documentation, billing. Tools: AutoCAD 2D, MS Excel, Word, PowerPoint, Tally Prime. Systems: VRV/VRF, chilled water, ducting, AHU, FCU." },
    { k: ["cv", "resume", "download"],
      a: 'Aap CV yahan se download kar sakte hain: <a href="' + CONFIG.CV + '" target="_blank" rel="noopener">Download CV</a>' },
    { k: ["contact", "phone", "call", "number", "email", "mail", "whatsapp", "baat"],
      a: 'Peeyush se sampark: WhatsApp / Call +91 99285 79369, Email ' + CONFIG.EMAIL + '. Neeche "WhatsApp par baat karein" button bhi use kar sakte hain.' },
    { k: ["job", "hire", "hiring", "offer", "vacancy", "opportunity", "interview", "salary"],
      a: "Peeyush abhi suitable opportunities ke liye open hain (HVAC Project Engineer, Site Supervision, Project Coordination – Jaipur ya aas-paas). Role, company, location aur CTC ki details page ke 'Send job offer' form ya WhatsApp par bhej dijiye, wo jaldi sampark karenge." },
    { k: ["education", "study", "degree", "qualification", "padhai", "b.sc", "bsc"],
      a: "Education: B.Sc. (PCM), University of Rajasthan, Jaipur. RS-CIT (VMOU Kota, 2025) aur BCBF (Parivartan Skills Academy, Jaipur)." },
    { k: ["location", "where", "kahan", "jaipur", "city"],
      a: "Peeyush Jaipur, Rajasthan mein based hain." },
    { k: ["language", "bhasha", "hindi", "english"],
      a: "Peeyush Hindi aur English dono mein kaam karte hain." },
    { k: ["hello", "hi", "hey", "namaste", "hii"],
      a: "Namaste! Aap experience, projects, skills, CV ya hiring ke baare mein pooch sakte hain." }
  ];
  var FALLBACK =
    "Is sawal ka pakka jawab mere paas nahi hai. Behtar hoga ki aap seedha Peeyush se WhatsApp ya email par baat karein, wo jaldi reply karenge.";

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
  var css =
    ".pjc-btn{position:fixed;right:18px;bottom:calc(18px + env(safe-area-inset-bottom,0px));z-index:2147483000;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;background:linear-gradient(135deg,#0ea5e9,#2563eb);color:#fff;box-shadow:0 8px 24px rgba(37,99,235,.45);display:flex;align-items:center;justify-content:center;transition:transform .2s}" +
    ".pjc-btn:hover{transform:scale(1.07)}" +
    ".pjc-btn svg{width:28px;height:28px}" +
    ".pjc-dot{position:absolute;top:6px;right:6px;width:12px;height:12px;border-radius:50%;background:#22c55e;border:2px solid #071426}" +
    ".pjc-panel{position:fixed;right:18px;bottom:calc(92px + env(safe-area-inset-bottom,0px));z-index:2147483000;width:372px;max-width:calc(100vw - 24px);height:560px;max-height:calc(100vh - 120px);background:#0b1b33;color:#e6edf7;border:1px solid rgba(255,255,255,.1);border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.5);display:none;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif;font-size:14px}" +
    ".pjc-panel.open{display:flex;animation:pjcIn .22s ease}" +
    "@keyframes pjcIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}" +
    ".pjc-head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:linear-gradient(135deg,#0f2a52,#0b1b33);border-bottom:1px solid rgba(255,255,255,.08)}" +
    ".pjc-av{width:38px;height:38px;border-radius:50%;background:#0ea5e9;display:flex;align-items:center;justify-content:center;font-weight:700;color:#fff;flex:none}" +
    ".pjc-ht{flex:1;min-width:0}.pjc-ht b{display:block;font-size:15px}.pjc-ht span{font-size:12px;color:#86efac}" +
    ".pjc-x{background:none;border:0;color:#9fb3cf;font-size:22px;cursor:pointer;line-height:1;padding:4px 8px}" +
    ".pjc-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}" +
    ".pjc-m{max-width:86%;padding:10px 13px;border-radius:14px;line-height:1.5;word-wrap:break-word;white-space:pre-wrap}" +
    ".pjc-m a{color:#7dd3fc}" +
    ".pjc-bot{align-self:flex-start;background:#13294a;border-bottom-left-radius:4px}" +
    ".pjc-user{align-self:flex-end;background:#2563eb;color:#fff;border-bottom-right-radius:4px}" +
    ".pjc-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:2px}" +
    ".pjc-chip{background:transparent;border:1px solid rgba(125,211,252,.45);color:#7dd3fc;border-radius:999px;padding:6px 11px;font-size:12.5px;cursor:pointer}" +
    ".pjc-chip:hover{background:rgba(125,211,252,.12)}" +
    ".pjc-typing{display:inline-flex;gap:4px}.pjc-typing i{width:6px;height:6px;border-radius:50%;background:#7dd3fc;animation:pjcB 1s infinite}.pjc-typing i:nth-child(2){animation-delay:.15s}.pjc-typing i:nth-child(3){animation-delay:.3s}" +
    "@keyframes pjcB{0%,80%,100%{opacity:.25}40%{opacity:1}}" +
    ".pjc-cta{display:flex;gap:8px;padding:0 14px 8px}" +
    ".pjc-cta a{flex:1;text-align:center;text-decoration:none;font-size:12.5px;padding:8px;border-radius:10px;background:#16a34a;color:#fff}" +
    ".pjc-cta a.alt{background:#1e3a66}" +
    ".pjc-form{display:flex;gap:8px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.08);background:#0a1830}" +
    ".pjc-in{flex:1;background:#13294a;border:1px solid rgba(255,255,255,.1);color:#fff;border-radius:12px;padding:10px 12px;font-size:16px;outline:none;min-width:0}" +
    ".pjc-in:focus{border-color:#38bdf8}" +
    ".pjc-send{background:#2563eb;border:0;color:#fff;border-radius:12px;padding:0 16px;cursor:pointer;font-weight:600}" +
    ".pjc-send:disabled{opacity:.5;cursor:not-allowed}" +
    ".pjc-note{font-size:10.5px;text-align:center;color:#7f93b0;padding:0 10px 8px}" +
    "@media(max-width:480px){.pjc-panel{right:8px;left:8px;width:auto;bottom:calc(84px + env(safe-area-inset-bottom,0px));height:calc(100vh - 110px)}}";

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
  btn.setAttribute("aria-label", "Chat with Peeyush's assistant");
  btn.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>';
  btn.appendChild(el("span", "pjc-dot"));

  var panel = el("div", "pjc-panel");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", CONFIG.NAME);

  var head = el("div", "pjc-head");
  head.appendChild(el("div", "pjc-av", "P"));
  var ht = el("div", "pjc-ht");
  ht.appendChild(el("b", "", CONFIG.NAME));
  ht.appendChild(el("span", "", "● Online 24x7"));
  head.appendChild(ht);
  var closeBtn = el("button", "pjc-x", "×");
  closeBtn.setAttribute("aria-label", "Close chat");
  head.appendChild(closeBtn);

  var body = el("div", "pjc-body");
  body.setAttribute("aria-live", "polite");

  var cta = el("div", "pjc-cta");
  var wa = el("a", "", "WhatsApp par baat karein");
  wa.href = "https://wa.me/" + CONFIG.WHATSAPP + "?text=" + encodeURIComponent("Hello Peeyush, I chatted with your assistant.");
  wa.target = "_blank"; wa.rel = "noopener";
  var cv = el("a", "alt", "CV Download");
  cv.href = CONFIG.CV; cv.target = "_blank"; cv.rel = "noopener";
  cta.appendChild(wa); cta.appendChild(cv);

  var form = el("form", "pjc-form");
  var input = el("input", "pjc-in");
  input.type = "text"; input.placeholder = "Apna sawal likhiye…";
  input.maxLength = CONFIG.MAX_INPUT; input.autocomplete = "off";
  input.setAttribute("aria-label", "Type your message");
  var send = el("button", "pjc-send", "Send");
  send.type = "submit";
  form.appendChild(input); form.appendChild(send);

  var note = el("div", "pjc-note", "AI assistant hai, galti ho sakti hai. Zaroori baat ke liye seedha Peeyush se contact karein.");

  panel.appendChild(head); panel.appendChild(body); panel.appendChild(cta);
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
    body.appendChild(m); scroll();
    return m;
  }

  // Safe linkify: text ko escape karke sirf URL ko link banata hai
  function linkify(t) {
    var s = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return s.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  function showChips() {
    var wrap = el("div", "pjc-chips");
    CHIPS.forEach(function (c) {
      var b = el("button", "pjc-chip", c);
      b.type = "button";
      b.onclick = function () { wrap.remove(); ask(c); };
      wrap.appendChild(b);
    });
    body.appendChild(wrap); scroll();
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

    var typing = el("div", "pjc-m pjc-bot");
    var dots = el("span", "pjc-typing");
    dots.innerHTML = "<i></i><i></i><i></i>";
    typing.appendChild(dots); body.appendChild(typing); scroll();

    function done(reply, isHtml) {
      typing.remove();
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
