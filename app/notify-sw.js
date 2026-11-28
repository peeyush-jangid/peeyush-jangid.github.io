/* Peeyush App – notification support for the Service Worker.
 * Apni sw.js ki PEHLI line me ye add karein:   importScripts('notify-sw.js');
 */
var PJ_REPO = "peeyush-jangid/peeyush-jangid.github.io", PJ_SITE = "https://peeyush-jangid.github.io/";

self.addEventListener("notificationclick", function (e) {
  e.notification.close();
  var url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (cl) {
    for (var i = 0; i < cl.length; i++) {
      if ("focus" in cl[i]) { cl[i].navigate && cl[i].navigate(url).catch(function () {}); return cl[i].focus(); }
    }
    return self.clients.openWindow(url);
  }));
});

/* Server push (future: Firebase Cloud Messaging / Web Push) */
self.addEventListener("push", function (e) {
  var d = {}; try { d = e.data ? e.data.json() : {}; } catch (x) { d = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || "Peeyush App", {
    body: d.body || "Naya update available hai", icon: "icons/apple-touch-icon.png", badge: "icons/apple-touch-icon.png",
    tag: "pj-update", renotify: true, data: { url: d.url || "./" }
  }));
});

/* Background check (installed app, Chrome/Android) – app band ho tab bhi */
function pjJSON(u) { return fetch(u, { cache: "no-store" }).then(function (r) { return r.ok ? r.json() : Promise.reject(); }); }
function pjCatalogue() {
  var out = [];
  var add = function (id, title, tab) { out.push({ id: id, title: title, tab: tab }); };
  return Promise.all([
    pjJSON("files.json").then(function (d) { (d.notes || []).concat(d.certificates || []).forEach(function (n) { add("file:" + (n.url || n.title), n.title, "files"); }); }).catch(function () {}),
    pjJSON("updates.json").then(function (a) { (Array.isArray(a) ? a : a.items || []).forEach(function (x) { add((x.type || "tool") + ":" + (x.id || x.title), x.title, x.tab || (x.type === "file" ? "files" : "tools")); }); }).catch(function () {}),
    ["documents", "certificates"].map(function (d) {
      return pjJSON("https://api.github.com/repos/" + PJ_REPO + "/contents/" + d).then(function (a) {
        a.filter(function (x) { return x.type === "file" && x.name.toLowerCase() !== "readme.txt"; }).forEach(function (x) { add("file:" + d + "/" + x.name, x.name.replace(/\.[^.]+$/, "").replace(/_+/g, " "), "files"); });
      }).catch(function () {});
    })
  ].flat()).then(function () { return out; });
}
self.addEventListener("periodicsync", function (e) {
  if (e.tag !== "pj-updates") return;
  e.waitUntil(caches.open("pj-seen").then(function (c) {
    return c.match("seen").then(function (r) { return r ? r.json() : null; }).then(function (seen) {
      return pjCatalogue().then(function (all) {
        var ids = all.map(function (x) { return x.id; });
        if (!seen) return c.put("seen", new Response(JSON.stringify(ids)));
        var fresh = all.filter(function (x) { return seen.indexOf(x.id) < 0; });
        if (!fresh.length) return;
        return c.put("seen", new Response(JSON.stringify(seen.concat(fresh.map(function (x) { return x.id; }))))).then(function () {
          var one = fresh.length === 1;
          return self.registration.showNotification("Peeyush App", {
            body: one ? (fresh[0].tab === "tools" ? "Naya tool: " : "Nayi file: ") + fresh[0].title : fresh.length + " naye updates add hue",
            icon: "icons/apple-touch-icon.png", badge: "icons/apple-touch-icon.png", tag: "pj-update", renotify: true, data: { url: "./#" + fresh[0].tab }
          });
        });
      });
    });
  }));
});
