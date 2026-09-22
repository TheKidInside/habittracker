const CACHE = 'habits-v5';
const ASSETS = ['./index.html', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Never touch the Firebase Auth handler — the redirect sign-in flow navigates
  // through /__/auth/*, and serving a cached page there kills the round trip.
  if (new URL(e.request.url).pathname.startsWith('/__/auth/')) return;

  if (e.request.destination === 'document') {
    // Network-first for HTML — always try to get fresh content
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
  } else {
    // Cache-first for other assets
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
  }
});
