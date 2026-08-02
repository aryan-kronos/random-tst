/* Verbalis service worker — offline-capable PWA shell.
   Strategy: network-first for the app document, cache-first for identity
   assets, stale-while-revalidate for remote topic imagery. */
const APP_CACHE = 'verbalis-app-v4';
const IMG_CACHE = 'verbalis-img-v4';
const MEDIA_CACHE = 'verbalis-media-v4';



self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_CACHE)
      .then((cache) => cache.addAll([
        // the single-file shell is cached ONCE under its canonical key —
        // '/' and '/index.html' are the same 25MB document, caching both
        // doubles the storage bill on every device
        '/index.html', '/manifest.webmanifest',
        '/favicon.svg', '/favicon-16.png', '/favicon-32.png', '/apple-touch-icon.png',
        '/icons/icon-192.png', '/icons/icon-512.png', '/icons/icon-maskable-512.png',
      ]))
      .catch(() => {})
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k !== APP_CACHE && k !== IMG_CACHE && k !== MEDIA_CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // same-origin app document: network-first so deploys arrive instantly
  if (url.origin === self.location.origin) {
    // narrations + note art: cache-first so a played topic goes fully
    // offline; fetched on demand, never precached (phones stay light)
    if (url.pathname.startsWith('/media/')) {
      event.respondWith(
        caches.open(MEDIA_CACHE).then((cache) =>
          cache.match(req).then((cached) => cached || fetch(req).then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          }))
        )
      );
      return;
    }
    if (req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('.html')) {
      event.respondWith(
        fetch(req)
          .then((res) => {
            const copy = res.clone();
            caches.open(APP_CACHE).then((cache) => cache.put('/index.html', copy));
            return res;
          })
          .catch(() => caches.match('/index.html'))
      );
      return;
    }
    // identity assets: cache-first
    if (url.pathname.startsWith('/icons') || url.pathname.includes('favicon') ||
        url.pathname.includes('apple-touch') || url.pathname.endsWith('.webmanifest')) {
      event.respondWith(
        caches.match(req).then((cached) => cached || fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(APP_CACHE).then((cache) => cache.put(req, copy));
          return res;
        }))
      );
      return;
    }
  }

});
