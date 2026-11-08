const V='peeyush-app-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/icon.svg',
  '../profile-photo.jpg','../geetanjali-hospital.jpg','../jecrc-university.jpg'];
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n!==V).map(n=>caches.delete(n)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET')return;
  const u=new URL(r.url); if(u.origin!==location.origin)return;
  e.respondWith(fetch(r).then(res=>{
    if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}
    return res;
  }).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
});
