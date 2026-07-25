/* Leaf service worker: network first, local fallback.
   The temporary Integration Bridge injects the named-system scripts into HTML
   until the canonical pages contain their script tags directly. It does not
   rewrite Leaf's source logic. */

const CACHE = 'leaf-v8';
const NAMED_SYSTEMS = `<!-- LEAF NAMED SYSTEMS -->
<script src="leaf-hearth.js"></script>
<script src="leaf-genealogy.js"></script>
<script src="leaf-law.js"></script>
<script src="leaf-mind.js"></script>
<script src="leaf-crown.js"></script>
<!-- /LEAF NAMED SYSTEMS -->`;

async function installNamedSystems(response) {
  if (!response || !response.ok) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const text = await response.text();
  const patched = text.includes('<!-- LEAF NAMED SYSTEMS -->')
    ? text
    : text.replace('</body>', NAMED_SYSTEMS + '\n</body>');

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(patched, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) => name !== CACHE).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    try {
      let fresh = await fetch(request);
      fresh = await installNamedSystems(fresh);
      if (fresh && fresh.ok && fresh.type !== 'opaque') {
        const clone = fresh.clone();
        caches.open(CACHE).then((cache) => cache.put(request, clone)).catch(() => {});
      }
      return fresh;
    } catch (error) {
      const hit = await caches.match(request);
      if (hit) return installNamedSystems(hit);
      if (request.mode === 'navigate') {
        const shell = await caches.match('./index.html') || await caches.match('./');
        if (shell) return installNamedSystems(shell);
      }
      throw error;
    }
  })());
});
