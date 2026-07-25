/* leaf service worker.
   Network-first so a new publish takes effect immediately when online;
   cache falls in behind so the site opens instantly on repeat visits and
   still opens offline. HTML responses receive three compatibility patches:
   syllable-true kata help, mute as the visible sound command, and backtick
   closing both help and terminal when help is open. */

const CACHE = 'leaf-v6';

const OLD_HELP_BLOCK = `const HELP_LINES=[
  ['seed','#68f'],['reset','#68f'],['save','#68f'],['keep','#68f'],['load','#68f'],
  ['pace','#d5d'],['fall','#ca2'],['meet','#d66'],['attend','#4dd'],['hush','#7a8496'],
  ['zettaitsune','#0f0'],['aggression','#f74'],
  ['ahika','#fd6'],['star','#ca2'],['stars','#ca2'],['gyre','#d5d'],
];`;

const NEW_HELP_BLOCK = `const HELP_LINES=[
  '<span style="color:#ff0000">seed</span>',
  '<span style="color:#ff00ff">re</span><span style="color:#00c8ff">set</span>',
  '<span style="color:#00c8ff">save</span>',
  '<span style="color:#00c8ff">keep</span>',
  '<span style="color:#00c8ff">load</span>',
  '<span style="color:#00ff00">pace</span>',
  '<span style="color:#ffd700">fall</span>',
  '<span style="color:#8a5cff">meet</span>',
  '<span style="color:#00ff00">at</span><span style="color:#00c8ff">tend</span>',
  '<span style="color:#7a8496">mute</span>',
  '<span style="color:#00ff00">zet</span><span style="color:#00c8ff">tai</span><span style="color:#00ff00">tsu</span><span style="color:#00c8ff">ne</span>',
  '<span style="color:#ff0000">a</span><span style="color:#00ff00">gres</span><span style="color:#ff00ff">sion</span>',
  '<span style="color:#00c8ff">a</span><span style="color:#ffd700">hi</span><span style="color:#00c8ff">ka</span>',
  '<span style="color:#ffd700">star</span>',
  '<span style="color:#ffd700">stars</span>',
  '<span style="color:#ff00ff">gyre</span>',
];`;

const OLD_SHOW_HELP = `function showHelp(){
  helpBox.innerHTML=HELP_LINES.map(([c,col])=>
    '<div style="color:'+col+'">'+c+'</div>').join('');
  helpBox.style.display='block';
}`;

const NEW_SHOW_HELP = `function showHelp(){
  helpBox.innerHTML=HELP_LINES.map(c=>'<div>'+c+'</div>').join('');
  helpBox.style.display='block';
}`;

const OLD_SOUND_HANDLER = "    else if(v==='hs'||v==='hush'){ sndOn=!sndOn; }";
const NEW_SOUND_HANDLER = "    else if(v==='mu'||v==='mute'||v==='hs'||v==='hush'){ sndOn=!sndOn; }";

const OLD_BACKTICK_HANDLER = "  if(e.key==='`'){\n    e.preventDefault();\n    term.style.display=term.style.display==='none'?'block':'none';";
const PREVIOUS_BACKTICK_HANDLER = "  if(e.key==='`'){\n    e.preventDefault();\n    hideHelp();\n    term.style.display=term.style.display==='none'?'block':'none';";
const NEW_BACKTICK_HANDLER = "  if(e.key==='`'){\n    e.preventDefault();\n    if(helpBox.style.display!=='none'){\n      hideHelp();\n      term.style.display='none';\n      term.blur();\n      return;\n    }\n    term.style.display=term.style.display==='none'?'block':'none';";

function patchLeafSource(text) {
  let patched = text;
  patched = patched.replace(OLD_HELP_BLOCK, NEW_HELP_BLOCK);
  patched = patched.replace(OLD_SHOW_HELP, NEW_SHOW_HELP);
  patched = patched.replace(OLD_SOUND_HANDLER, NEW_SOUND_HANDLER);
  if (!patched.includes(NEW_BACKTICK_HANDLER)) {
    patched = patched.includes(PREVIOUS_BACKTICK_HANDLER)
      ? patched.replace(PREVIOUS_BACKTICK_HANDLER, NEW_BACKTICK_HANDLER)
      : patched.replace(OLD_BACKTICK_HANDLER, NEW_BACKTICK_HANDLER);
  }
  return patched;
}

async function patchHtml(response) {
  if (!response || !response.ok) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;

  const text = await response.text();
  const patched = patchLeafSource(text);

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
