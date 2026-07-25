/* leaf service worker.
   Network-first so a new publish takes effect immediately when online;
   cache falls in behind so the site opens instantly on repeat visits and
   still opens offline. Cache is intentionally per-URL and unversioned:
   the network wins every time it can, and stale entries get replaced by
   whatever the network returned. */

const CACHE = 'leaf';

self.addEventListener('install', (e) => { self.skipWaiting(); });
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok && fresh.type !== 'opaque') {
        const clone = fresh.clone();
        caches.open(CACHE).then((c) => c.put(req, clone)).catch(() => {});
      }
      return fresh;
    } catch (_) {
      const hit = await caches.match(req);
      if (hit) return hit;
      if (req.mode === 'navigate') {
        const shell = await caches.match('./');
        if (shell) return shell;
      }
      throw _;
    }
  })());
});
