const CACHE='lernfunke-shell-v3';
const FILES=['./','./index.html','./app.js','./model.js','./curriculum.js','./store.js','./execute.js','./runner.html','./styles.css','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(FILES);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('lernfunke-shell-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{const cached=await caches.match(event.request,{ignoreSearch:false});return cached||fetch(event.request);})());
});
