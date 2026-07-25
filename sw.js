/* leaf service worker.
   Network-first so a new publish takes effect immediately when online;
   cache falls in behind so the site opens instantly on repeat visits and
   still opens offline. HTML responses receive one compatibility patch:
   backtick dismisses the help menu before toggling the terminal. */

const CACHE = 'leaf-v3';
const OLD_BACKTICK_HANDLER = "  if(e.key==='`'){\n    e.preventDefault();\n    term.style.display=term.style.display==='none'?'block':'none';";
const NEW_BACKTICK_HANDLER = "  if(e.key==='`'){\n    e.preventDefault();\n    hideHelp();\n    term.style.display=term.style.display==='none'?'block':'none';";

async function patchHtml(response) {
  if (!response || !response.ok) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const text = await response.text();
  const patched = text.includes(NEW_BACKTICK_HANDLER)
    ? text
    : text.replace(OLD_BACKTICK_HANDLER, NEW_BACKTICK_HANDLER);

  const headers = new Headers(response.headers);
  headers.delete('content-length');
  return new Response(patched, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

self.addEventListener('install', (event) => { event.waitUntil(self.skipWaiting()); });
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
      fresh = await patchHtml(fresh);
      if (fresh && fresh.ok && fresh.type !== 'opaque') {
        const clone = fresh.clone();
        caches.open(CACHE).then((cache) => cache.put(request, clone)).catch(() => {});
      }
      return fresh;
    } catch (error) {
      const hit = await caches.match(request);
      if (hit) return patchHtml(hit);
      if (request.mode === 'navigate') {
        const shell = await caches.match('./');
        if (shell) return patchHtml(shell);
      }
      throw error;
    }
  })());
});
