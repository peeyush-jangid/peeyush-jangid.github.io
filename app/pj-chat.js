/*! Peeyush AI launcher: floating button + popup. Purane chatbot.js ki jagah.
 *  Asli chat ai.html me hai (site ke root me). Website aur app dono me yahi file use hoti hai. */
(function () {
  "use strict";
  if (window.__peeyushChat) return;
  window.__peeyushChat = true;

  var AI_URL = "https://peeyush-jangid.github.io/ai.html";
  var wrap, frame, btn, isOpen = false;

  var css = document.createElement("style");
  css.textContent =
    "#pjai-btn{position:fixed;right:18px;bottom:18px;z-index:99990;width:62px;height:62px;border:0;border-radius:50%;cursor:pointer;" +
    "background:linear-gradient(135deg,#2563eb,#7c3aed);box-shadow:0 6px 26px #7c3aed99;display:grid;place-items:center;padding:0;transition:transform .2s}" +
    "#pjai-btn:hover{transform:scale(1.07)}#pjai-btn svg{width:40px;height:40px}" +
    "#pjai-box{position:fixed;right:18px;bottom:92px;z-index:99991;width:min(410px,calc(100vw - 24px));height:min(680px,calc(100vh - 112px));" +
    "border-radius:22px;overflow:hidden;border:1.5px solid #4c3bd6;background:#03030f;box-shadow:0 12px 48px #000b;display:none;flex-direction:column}" +
    "#pjai-box.on{display:flex}#pjai-bar{display:flex;align-items:center;gap:8px;padding:6px 10px;background:#07061f;color:#c7ccff;font:600 12px Poppins,system-ui,sans-serif}" +
    "#pjai-bar span{flex:1}#pjai-bar button,#pjai-bar a{background:none;border:0;color:#c7ccff;cursor:pointer;font-size:15px;text-decoration:none;padding:2px 6px}" +
    "#pjai-box iframe{flex:1;width:100%;border:0;background:#03030f}" +
    "#pjai-box.full{inset:0;width:100vw;height:100vh;height:100dvh;border-radius:0;border:0}" +
    "@media(max-width:640px){#pjai-box{inset:0;width:100vw;height:100vh;height:100dvh;border-radius:0;border:0}}";
  document.head.appendChild(css);

  function build() {
    btn = document.createElement("button");
    btn.id = "pjai-btn"; btn.type = "button"; btn.setAttribute("aria-label", "Peeyush AI chat kholein");
    btn.innerHTML = '<svg viewBox="0 0 100 100"><path d="M17 50Q50-8 83 50" stroke="#22d3ee" stroke-width="5" fill="none"/><circle cx="13" cy="54" r="9" fill="#22d3ee"/><circle cx="87" cy="54" r="9" fill="#22d3ee"/><rect x="18" y="20" width="64" height="62" rx="28" fill="#eaf1ff"/><rect x="25" y="31" width="50" height="40" rx="18" fill="#0a0a22"/><path d="M33 53q6-10 13 0M54 53q6-10 13 0" stroke="#22d3ee" stroke-width="4.5" fill="none" stroke-linecap="round"/><path d="M43 62q7 5 14 0" stroke="#22d3ee" stroke-width="3" fill="none" stroke-linecap="round"/></svg>';
    btn.onclick = function () { isOpen ? close() : open(); };

    wrap = document.createElement("div");
    wrap.id = "pjai-box"; wrap.setAttribute("role", "dialog"); wrap.setAttribute("aria-label", "Peeyush AI");
    wrap.innerHTML = '<div id="pjai-bar"><span>🤖 Peeyush AI</span><button type="button" id="pjai-fs" title="Full screen">⛶</button><a href="' + AI_URL + '" target="_blank" rel="noopener" title="Naye tab me kholein">↗</a><button type="button" id="pjai-x" title="Band karein">✕</button></div>';
    document.body.appendChild(wrap);
    document.body.appendChild(btn);
    wrap.querySelector("#pjai-x").onclick = close;
    wrap.querySelector("#pjai-fs").onclick = function () { wrap.classList.toggle("full"); };
    document.addEventListener("keydown", function (e) { if (e.key === "Escape" && isOpen) close(); });
  }
  function open() {
    if (!frame) {
      frame = document.createElement("iframe");
      frame.title = "Peeyush AI"; frame.src = AI_URL;
      frame.allow = "microphone; clipboard-write; web-share";
      wrap.appendChild(frame);
    }
    wrap.classList.add("on"); isOpen = true;
  }
  function close() { wrap.classList.remove("on", "full"); isOpen = false; }

  if (document.body) build(); else document.addEventListener("DOMContentLoaded", build);

  function sync() { var on = (location.hash || "").slice(1) === "ai"; if (btn) btn.style.display = on ? "none" : ""; if (on && isOpen) close(); }
  window.addEventListener("hashchange", sync); setTimeout(sync, 0);
  window.PeeyushChat = { open: function () { if (!wrap) build(); open(); }, close: close };
})();
