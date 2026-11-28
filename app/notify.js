/*! Peeyush App – Update notifications (new files / new tools)
 *  Kaam: naya file ya naya tool aate hi user ke phone/laptop par popup + system notification.
 *  Sources: files.json, GitHub documents/ & certificates/ folders, updates.json (tools etc.)
 */
(function () {
  "use strict";
  if (window.__pjNotify) return; window.__pjNotify = true;

  var REPO = "peeyush-jangid/peeyush-jangid.github.io", SITE = "https://peeyush-jangid.github.io/";
  var SEEN = "pj_seen_v1", ASKED = "pj_notif_asked", EVERY = 5 * 60 * 1000;
  var lsGet = function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } };
  var lsSet = function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };

  /* ---------- fetch current catalogue ---------- */
  function getJSON(u) { return fetch(u, { cache: "no-store" }).then(function (r) { if (!r.ok) throw 0; return r.json(); }); }
  function dir(d, kind) {
    return getJSON("https://api.github.com/repos/" + REPO + "/contents/" + d).then(function (a) {
      return a.filter(function (x) { return x.type === "file" && x.name.toLowerCase() !== "readme.txt"; }).map(function (x) {
        return { id: kind + ":" + d + "/" + x.name, kind: kind, title: x.name.replace(/\.[^.]+$/, "").replace(/_+/g, " "), url: SITE + d + "/" + encodeURIComponent(x.name), tab: "files" };
      });
    }).catch(function () { return []; });
  }
  function fromFilesJson() {
    return getJSON("files.json").then(function (d) {
      var out = [];
      (d.notes || []).forEach(function (n) { out.push({ id: "file:" + (n.url || n.title), kind: "file", title: n.title, url: n.url, tab: "files" }); });
      (d.certificates || []).forEach(function (n) { out.push({ id: "cert:" + (n.url || n.title), kind: "file", title: n.title, url: n.url, tab: "files" }); });
      return out;
    }).catch(function () { return []; });
  }
  function fromUpdates() {          // updates.json: [{id,type:"tool"|"file",title,note,tab,url}]
    return getJSON("updates.json").then(function (a) {
      return (Array.isArray(a) ? a : a.items || []).map(function (x) {
        return { id: (x.type || "tool") + ":" + (x.id || x.title), kind: x.type || "tool", title: x.title, note: x.note, url: x.url, tab: x.tab || (x.type === "file" ? "files" : "tools") };
      });
    }).catch(function () { return []; });
  }
  function catalogue() {
    return Promise.all([fromFilesJson(), dir("documents", "file"), dir("certificates", "file"), fromUpdates()]).then(function (r) {
      var seen = {}, all = [];
      [].concat.apply([], r).forEach(function (x) { if (x.id && !seen[x.id]) { seen[x.id] = 1; all.push(x); } });
      return all;
    });
  }

  /* ---------- show: in-app popup + system notification ---------- */
  function css() {
    if (document.getElementById("pjn-css")) return;
    var s = document.createElement("style"); s.id = "pjn-css";
    s.textContent = "#pjn-wrap{position:fixed;left:50%;transform:translateX(-50%);top:calc(12px + env(safe-area-inset-top,0px));z-index:99999;width:min(420px,calc(100vw - 24px));display:flex;flex-direction:column;gap:8px;pointer-events:none}" +
      ".pjn{pointer-events:auto;display:flex;gap:12px;align-items:flex-start;padding:13px 14px;border-radius:16px;background:var(--panel,#fff);color:var(--ink,#0f172a);border:1px solid var(--line,#dbe3f0);box-shadow:0 14px 40px rgba(0,0,0,.25);animation:pjnIn .35s cubic-bezier(.2,.8,.2,1)}" +
      ".pjn .e{font-size:22px;line-height:1}.pjn b{display:block;font-size:.9rem}.pjn small{display:block;color:var(--mute,#64748b);font-size:.78rem;margin-top:2px}" +
      ".pjn .go{margin-left:auto;border:0;border-radius:10px;background:var(--brand,#2563eb);color:#fff;font:inherit;font-weight:700;font-size:.78rem;padding:8px 12px;cursor:pointer}" +
      ".pjn .x{border:0;background:none;color:var(--mute,#64748b);font-size:18px;cursor:pointer;padding:0 2px}" +
      ".pjn.ask{align-items:center}.pjn.ask .alt{border:0;background:none;color:var(--mute,#64748b);font:inherit;font-size:.78rem;cursor:pointer}" +
      "@keyframes pjnIn{from{opacity:0;transform:translateY(-14px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:reduce){.pjn{animation:none}}";
    document.head.appendChild(s);
  }
  function wrap() { css(); var w = document.getElementById("pjn-wrap"); if (!w) { w = document.createElement("div"); w.id = "pjn-wrap"; w.setAttribute("aria-live", "polite"); document.body.appendChild(w); } return w; }
  function toast(html, onGo, goLabel, sticky) {
    var d = document.createElement("div"); d.className = "pjn" + (sticky ? " ask" : ""); d.innerHTML = html;
    var kill = function () { if (d.parentNode) d.parentNode.removeChild(d); };
    d.addEventListener("click", function (e) {
      if (e.target.classList.contains("x") || e.target.classList.contains("alt")) return kill();
      if (e.target.classList.contains("go")) { kill(); onGo && onGo(); }
    });
    wrap().appendChild(d); if (!sticky) setTimeout(kill, 9000); return d;
  }
  function openItem(it) { if (it.tab) location.hash = "#" + it.tab; else if (it.url) window.open(it.url, "_blank", "noopener"); }
  function label(items) {
    var tools = items.filter(function (i) { return i.kind === "tool"; }), files = items.filter(function (i) { return i.kind !== "tool"; });
    if (items.length === 1) { var i = items[0]; return { e: i.kind === "tool" ? "🧰" : "📄", t: i.kind === "tool" ? "Naya tool aaya: " + i.title : "Nayi file upload hui: " + i.title, s: i.note || "Dekhne ke liye tap karein", tab: i.tab }; }
    var p = []; if (tools.length) p.push(tools.length + " naye tools"); if (files.length) p.push(files.length + " nayi files");
    return { e: "🔔", t: p.join(" aur ") + " add hue", s: items.slice(0, 3).map(function (i) { return i.title; }).join(", ") + (items.length > 3 ? "…" : ""), tab: tools.length >= files.length ? "tools" : "files" };
  }
  function system(l) {
    if (!("Notification" in window) || Notification.permission !== "granted") return;
    var opt = { body: l.s, icon: "icons/apple-touch-icon.png", badge: "icons/apple-touch-icon.png", tag: "pj-update", renotify: true, data: { url: "./#" + l.tab } };
    if (navigator.serviceWorker && navigator.serviceWorker.getRegistration) {
      navigator.serviceWorker.getRegistration().then(function (reg) {
        if (reg && reg.showNotification) reg.showNotification("Peeyush App", Object.assign({}, opt, { body: l.t + "\n" + l.s }));
        else { var n = new Notification("Peeyush App", opt); n.onclick = function () { focus(); location.hash = "#" + l.tab; n.close(); }; }
      }).catch(function () {});
    } else { var n = new Notification("Peeyush App", opt); n.onclick = function () { focus(); location.hash = "#" + l.tab; n.close(); }; }
  }
  function focus() { try { window.focus(); } catch (e) {} }

  function announce(items) {
    if (!items.length) return;
    var l = label(items);
    toast('<span class="e">' + l.e + '</span><div><b>' + esc(l.t) + '</b><small>' + esc(l.s) + '</small></div><button class="go" type="button">Dekhein</button><button class="x" type="button" aria-label="Band karein">×</button>',
      function () { location.hash = "#" + l.tab; });
    system(l);
  }

  /* ---------- check ---------- */
  var busy = false;
  function check(force) {
    if (busy) return; busy = true;
    catalogue().then(function (all) {
      if (!all.length) return;
      var seen = lsGet(SEEN, null), ids = all.map(function (x) { return x.id; });
      if (!seen) { lsSet(SEEN, ids); return; }             // pehli baar: sirf baseline, purani files par notification nahi
      var set = {}; seen.forEach(function (i) { set[i] = 1; });
      var fresh = all.filter(function (x) { return !set[x.id]; });
      if (fresh.length) { lsSet(SEEN, seen.concat(fresh.map(function (x) { return x.id; }))); announce(fresh); }
    }).catch(function () {}).then(function () { busy = false; });
  }

  /* ---------- permission ---------- */
  function ask() {
    if (!("Notification" in window)) return;
    if (Notification.permission !== "default" || lsGet(ASKED, 0)) return;
    var d = toast('<span class="e">🔔</span><div><b>Notifications on karein?</b><small>Naya tool ya nayi file aate hi turant pata chal jayega.</small></div><button class="go" type="button">On karein</button><button class="alt" type="button">Baad me</button>',
      function () {
        lsSet(ASKED, 1);
        Notification.requestPermission().then(function (p) {
          if (p === "granted") { toast('<span class="e">✅</span><div><b>Notifications on ho gaye</b><small>Ab har update par alert milega.</small></div>'); registerBg(); }
        });
      }, "On karein", true);
    d.querySelector(".alt").addEventListener("click", function () { lsSet(ASKED, Date.now()); });
  }
  function registerBg() {   // Chrome/Android installed app: app band ho tab bhi periodically check
    if (!navigator.serviceWorker) return;
    navigator.serviceWorker.ready.then(function (reg) {
      if (reg.periodicSync && reg.periodicSync.register) reg.periodicSync.register("pj-updates", { minInterval: 6 * 3600 * 1000 }).catch(function () {});
    }).catch(function () {});
  }

  function start() {
    setTimeout(function () { check(); }, 2500);
    setTimeout(ask, 6000);
    setInterval(check, EVERY);
    document.addEventListener("visibilitychange", function () { if (!document.hidden) check(); });
    if (Notification && Notification.permission === "granted") registerBg();
    window.PeeyushNotify = { check: check, ask: function () { try { localStorage.removeItem(ASKED); } catch (e) {} ask(); }, reset: function () { try { localStorage.removeItem(SEEN); } catch (e) {} } };
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
