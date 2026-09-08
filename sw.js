const CACHE = 'ba-after-dark-v03';
const ASSETS = ['./','./index.html','./manifest.webmanifest','./icon-192.svg','./icon-512.svg'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))); self.skipWaiting(); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = event.request.url;
  if (url.includes('cdn.jsdelivr.net/npm/three@0.180.0/build/three.min.js')) {
    event.respondWith(fetch('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js', {mode:'cors'}));
    return;
  }
  event.respondWith(fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
});