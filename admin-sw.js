// Minimal service worker: makes admin.html installable and loads the admin shell fast.
// Network first, cache only as fallback. Never touches GitHub API, Firebase or uploaded documents.
var CACHE = 'owner-admin-v2';
var SHELL = ['admin.html', 'admin.css', 'admin.js', 'admin-certs.js', 'admin-lock.js', 'style.css', 'firebase-config.js', 'users.js', 'editor.js', 'manifest.webmanifest', 'admin-icon-192.png', 'admin-icon-512.png', 'admin-icon-maskable-512.png', 'apple-touch-icon.png', 'favicon.svg'];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) {
    return Promise.all(SHELL.map(function (u) { return c.add(u).catch(function () {}); }));
  }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  var file = url.pathname.split('/').pop();
  if (SHELL.indexOf(file) < 0) return;
  e.respondWith(fetch(req).then(function (res) {
    var copy = res.clone();
    caches.open(CACHE).then(function (c) { c.put(req, copy); });
    return res;
  }).catch(function () { return caches.match(req); }));
});
