/* ==========================================================================
   ARCHIVE CONSTELLATION
   Official change name: Archive Constellation

   Council Ledger renders Chronicle Loom as seed-lanes, event records, and the
   small visual Memory Plates kept at important passages.
   ========================================================================== */
(function () {
  'use strict';

  const KEY = 'leaf_chronicle_v1';
  const DB_NAME = 'leaf-chronicle';
  const DB_VERSION = 1;
  const PLATES = 'plates';
  let chronicle = { events: [] };
  let activeKind = 'all';
  let hitRegions = [];
  let objectUrls = [];

  const STYLE = document.createElement('style');
  STYLE.textContent = `
    .chronicle-head{display:flex;justify-content:space-between;gap:18px;align-items:end;flex-wrap:wrap;margin-bottom:16px}
    .chronicle-filters{display:flex;gap:7px;flex-wrap:wrap}
    .chronicle-filter{padding:6px 9px;font-size:10px;color:#6f818b;border-color:#1a2d36}
    .chronicle-filter[data-active="1"]{color:#fff;border-color:#00c8ff;box-shadow:0 0 10px rgba(0,200,255,.12)}
    .chronicle-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:8px;margin:0 0 12px}
    .chronicle-stat{border:1px solid #162731;background:#030608;padding:9px 11px}
    .chronicle-stat b{display:block;font-weight:400;color:#d8e6ed;font-size:1rem}
    .chronicle-stat span{display:block;color:#647680;font-size:.66rem;letter-spacing:.08em;margin-top:2px}
    .chronicle-stage{position:relative;border:1px solid #172832;background:#000;min-height:280px}
    #chronicleCanvas{display:block;width:100%;height:320px}
    .chronicle-tip{position:absolute;display:none;pointer-events:none;max-width:280px;padding:8px 10px;border:1px solid #29434f;background:rgba(0,0,0,.94);color:#dbe8ee;font-size:11px;line-height:1.4;z-index:4}
    .chronicle-lower{display:grid;grid-template-columns:minmax(280px,.8fr) minmax(320px,1.2fr);gap:14px;margin-top:14px}
    .chronicle-panel{border:1px solid #172832;background:#030608;padding:12px;min-width:0}
    .chronicle-panel h3{color:#00c8ff;font-size:.8rem;letter-spacing:.08em;margin-bottom:10px}
    .chronicle-events{display:grid;gap:5px;max-height:430px;overflow:auto;padding-right:4px}
    .chronicle-event{display:grid;grid-template-columns:9px 1fr auto;gap:8px;align-items:start;padding:7px 4px;border-bottom:1px solid #101b21}
    .chronicle-dot{width:7px;height:7px;border-radius:50%;margin-top:5px;box-shadow:0 0 8px currentColor}
    .chronicle-event b{display:block;font-weight:400;color:#cbd9e0;font-size:.76rem}
    .chronicle-event small{display:block;color:#667983;font-size:.62rem;margin-top:2px;overflow-wrap:anywhere}
    .chronicle-event time{color:#53636c;font-size:.61rem;white-space:nowrap}
    .plate-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;max-height:430px;overflow:auto;padding-right:4px}
    .plate{border:1px solid #14242c;background:#000;overflow:hidden}
    .plate img{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;background:#000}
    .plate div{padding:7px 8px}
    .plate b{display:block;color:#c8d7de;font-size:.68rem;font-weight:400;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .plate span{display:block;color:#5f717b;font-size:.59rem;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    .chronicle-empty{color:#60717a;font-size:.76rem;padding:14px 4px}
    @media(max-width:760px){.chronicle-lower{grid-template-columns:1fr}#chronicleCanvas{height:380px}}
  `;
  document.head.appendChild(STYLE);

  const section = document.createElement('section');
  section.id = 'chronicle';
  section.innerHTML = `
    <div class="chronicle-head">
      <div><h2>chronicle loom</h2><p class="note">Consequences become records. Important passages retain a small visual plate.</p></div>
      <div class="chronicle-filters" id="chronicleFilters"></div>
    </div>
    <div class="chronicle-summary" id="chronicleSummary"></div>
    <div class="chronicle-stage"><canvas id="chronicleCanvas"></canvas><div class="chronicle-tip" id="chronicleTip"></div></div>
    <div class="chronicle-lower">
      <div class="chronicle-panel"><h3>recent records</h3><div class="chronicle-events" id="chronicleEvents"></div></div>
      <div class="chronicle-panel"><h3>memory plates</h3><div class="plate-grid" id="chroniclePlates"></div></div>
    </div>`;
  document.querySelector('header').after(section);

  const nav = document.querySelector('nav');
  if (nav) {
    const a = document.createElement('a'); a.href = '#chronicle'; a.textContent = 'chronicle';
    nav.insertBefore(a, nav.firstChild);
  }

  const strip = document.querySelector('.world-strip');
  if (strip) {
    const cell = document.createElement('div'); cell.className = 'world-cell';
    cell.innerHTML = '<b id="worldChronicle">0</b><span>chronicle records</span>';
    strip.appendChild(cell);
  }

  const chronicleInventory = ['chronicle','CHRONICLE LOOM','consequential records and visual memory plates'];
  if (!inventory.some(item => item[0] === 'chronicle')) inventory.push(chronicleInventory);
  const chronicleCard = (() => {
    const s = bind('chronicle','inventory'), card = document.createElement('div');
    card.className = 'card'; card.dataset.element = 'chronicle'; card.dataset.open = '0';
    const c = document.createElement('canvas'), body = document.createElement('div');
    const badge = document.createElement('div'); badge.className = 'live-badge'; badge.id = 'chronicleInventoryBadge'; badge.textContent = '0 records';
    const title = document.createElement('h3'); title.textContent = chronicleInventory[1];
    const meta = document.createElement('div'); meta.className = 'meta'; meta.textContent = chronicleInventory[2];
    const ta = document.createElement('textarea'); ta.placeholder = 'notes'; ta.value = s.note; ta.oninput = () => s.setNote(ta.value);
    const label = document.createElement('label'), check = document.createElement('input'); check.type = 'checkbox'; check.checked = s.done; check.onchange = () => s.setDone(check.checked);
    label.append(check,document.createTextNode('reviewed')); body.append(badge,title,meta,ta,label); card.append(c,body);
    card.onclick = e => { if (!e.target.matches('textarea,input,label')) card.dataset.open = card.dataset.open === '1' ? '0' : '1'; };
    document.getElementById('inventoryGrid').appendChild(card); return card;
  })();

  const workGrid = document.querySelector('#work .work-grid');
  if (workGrid) {
    const item = document.createElement('article'); item.className = 'work-item';
    item.innerHTML = '<div class="state">ACTIVE RECORD</div><h3>Chronicle Loom</h3><p>Consequences are preserved as world-time records and selected visual plates, then rendered as an archive rather than announced in the world.</p>';
    workGrid.prepend(item);
  }

  function readChronicle() {
    try {
      chronicle = JSON.parse(localStorage.getItem(KEY) || '{}') || {};
      if (!Array.isArray(chronicle.events)) chronicle.events = [];
    } catch (_) { chronicle = { events: [] }; }
  }

  function filteredEvents() {
    const all = chronicle.events || [];
    return activeKind === 'all' ? all : all.filter(e => e.kind === activeKind);
  }

  function formatWorld(value) {
    const n = Number(value) || 0;
    return n >= 1000000 ? (n / 1000000).toFixed(2) + 'm' : n >= 1000 ? (n / 1000).toFixed(1) + 'k' : Math.round(n).toLocaleString('en-US');
  }

  function renderFilters() {
    const host = document.getElementById('chronicleFilters');
    const kinds = [...new Set((chronicle.events || []).map(e => e.kind))].sort();
    const list = ['all'].concat(kinds);
    if (!list.includes(activeKind)) activeKind = 'all';
    host.innerHTML = '';
    for (const kind of list) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chronicle-filter'; b.dataset.active = kind === activeKind ? '1' : '0';
      b.textContent = kind;
      b.onclick = () => { activeKind = kind; render(); };
      host.appendChild(b);
    }
  }

  function drawChronicleIcon() {
    const canvas = chronicleCard.querySelector('canvas'), x = canvas.getContext('2d');
    canvas.width = 188; canvas.height = 188; x.fillStyle = '#000'; x.fillRect(0,0,188,188);
    const events = (chronicle.events || []).slice(-36), lanes = 4;
    x.lineWidth = 1;
    for (let lane=0; lane<lanes; lane++) {
      const y = 42 + lane*34; x.strokeStyle = 'rgba(70,100,112,.24)'; x.beginPath(); x.moveTo(20,y); x.lineTo(168,y); x.stroke();
    }
    events.forEach((e,i) => {
      const px = 24 + (events.length > 1 ? i/(events.length-1) : .5)*140;
      const y = 42 + (i%lanes)*34, r = 1.8 + (e.importance || 1)*.7;
      x.shadowColor = e.color || '#7a8496'; x.shadowBlur = 8; x.fillStyle = e.color || '#7a8496';
      x.beginPath(); x.arc(px,y,r,0,Math.PI*2); x.fill(); x.shadowBlur = 0;
    });
    x.fillStyle = '#60727c'; x.font = '9px "Courier New",monospace'; x.fillText('WORLD / RECORD',20,174);
  }

  function renderSummary() {
    const events = chronicle.events || [];
    const seeds = new Set(events.map(e => e.seed).filter(Boolean));
    const first = events[0], last = events[events.length - 1];
    const elapsed = first && last ? Math.max(0, last.at - first.at) : 0;
    const days = elapsed / 86400000;
    const important = events.filter(e => (e.importance || 1) >= 3).length;
    const data = [
      [events.length.toLocaleString('en-US'), 'records'],
      [seeds.size.toLocaleString('en-US'), 'worlds witnessed'],
      [important.toLocaleString('en-US'), 'major passages'],
      [days >= 1 ? days.toFixed(1) + 'd' : elapsed >= 3600000 ? (elapsed / 3600000).toFixed(1) + 'h' : elapsed >= 60000 ? Math.round(elapsed / 60000) + 'm' : 'new', 'archive span']
    ];
    document.getElementById('chronicleSummary').innerHTML = data.map(([v,l]) => '<div class="chronicle-stat"><b>' + v + '</b><span>' + l + '</span></div>').join('');
    const count = document.getElementById('worldChronicle'); if (count) count.textContent = events.length.toLocaleString('en-US');
    const badge = document.getElementById('chronicleInventoryBadge');
    if (badge) { badge.textContent = events.length.toLocaleString('en-US') + ' records'; badge.classList.toggle('present', events.length > 0); }
    drawChronicleIcon();
  }

  function seedLanes(events) {
    const map = new Map();
    for (const e of events) {
      const seed = e.seed || 'unnamed';
      if (!map.has(seed)) map.set(seed, []);
      map.get(seed).push(e);
    }
    return [...map.entries()].sort((a,b) => (b[1][b[1].length-1].at || 0) - (a[1][a[1].length-1].at || 0)).slice(0, 8).reverse();
  }

  function drawTimeline() {
    const canvas = document.getElementById('chronicleCanvas');
    const box = canvas.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1);
    const width = Math.max(1, Math.round(box.width * dpr));
    const height = Math.max(1, Math.round(box.height * dpr));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    const x = canvas.getContext('2d'); x.setTransform(dpr,0,0,dpr,0,0);
    const W = box.width, H = box.height; x.fillStyle = '#000'; x.fillRect(0,0,W,H);
    hitRegions = [];
    const events = filteredEvents();
    if (!events.length) {
      x.fillStyle = '#61727c'; x.font = '11px "Courier New",monospace'; x.fillText('no records in this view', 16, 26); return;
    }
    const lanes = seedLanes(events), left = 116, right = 22, top = 28, bottom = 24;
    const laneH = Math.max(34, (H - top - bottom) / Math.max(1, lanes.length));
    x.font = '10px "Courier New",monospace'; x.textBaseline = 'middle';
    lanes.forEach(([seed, lane], laneIndex) => {
      const y = top + laneH * (laneIndex + .5);
      const worlds = lane.map(e => Number(e.world) || 0), min = Math.min(...worlds), max = Math.max(...worlds);
      x.strokeStyle = 'rgba(70,100,112,.25)'; x.lineWidth = 1; x.beginPath(); x.moveTo(left,y); x.lineTo(W-right,y); x.stroke();
      x.fillStyle = '#647780'; x.textAlign = 'right';
      const label = seed.length > 16 ? seed.slice(0,13) + '…' : seed;
      x.fillText(label, left - 10, y);
      x.textAlign = 'left';
      let previous = null;
      lane.forEach((e, i) => {
        const ratio = max > min ? ((Number(e.world)||0) - min) / (max - min) : (lane.length > 1 ? i / (lane.length - 1) : .5);
        const px = left + ratio * (W - left - right);
        if (previous) {
          x.strokeStyle = 'rgba(90,125,138,.16)'; x.beginPath(); x.moveTo(previous.x,y); x.lineTo(px,y); x.stroke();
        }
        const r = 2.4 + (e.importance || 1) * 1.05;
        x.shadowColor = e.color || '#7a8496'; x.shadowBlur = 7 + (e.importance || 1) * 2;
        x.fillStyle = e.color || '#7a8496'; x.beginPath(); x.arc(px,y,r,0,Math.PI*2); x.fill(); x.shadowBlur = 0;
        hitRegions.push({ x:px, y, r:Math.max(8,r+3), event:e });
        previous = { x:px };
      });
      x.fillStyle = '#394951'; x.textAlign = 'left';
      x.fillText(formatWorld(min), left, y + Math.min(14,laneH*.32));
      x.textAlign = 'right'; x.fillText(formatWorld(max), W-right, y + Math.min(14,laneH*.32));
    });
  }

  function renderEvents() {
    const host = document.getElementById('chronicleEvents');
    const list = filteredEvents().slice().sort((a,b) => b.at - a.at).slice(0, 80);
    if (!list.length) { host.innerHTML = '<div class="chronicle-empty">no records in this view</div>'; return; }
    host.innerHTML = '';
    for (const e of list) {
      const row = document.createElement('div'); row.className = 'chronicle-event';
      const dot = document.createElement('span'); dot.className = 'chronicle-dot'; dot.style.color = e.color || '#7a8496'; dot.style.background = e.color || '#7a8496';
      const body = document.createElement('div');
      const title = document.createElement('b'); title.textContent = e.label;
      const meta = document.createElement('small'); meta.textContent = (e.seed || 'unnamed') + ' · world ' + formatWorld(e.world) + ' · ' + e.kind;
      body.append(title, meta);
      const time = document.createElement('time'); time.textContent = new Date(e.at).toLocaleDateString('en-US', { month:'short', day:'numeric' });
      row.append(dot, body, time); host.appendChild(row);
    }
  }

  function openDatabase() {
    return new Promise((resolve, reject) => {
      if (!('indexedDB' in globalThis)) return reject(new Error('IndexedDB unavailable'));
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(PLATES)) {
          const store = db.createObjectStore(PLATES, { keyPath: 'id' }); store.createIndex('at','at');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function renderPlates() {
    const host = document.getElementById('chroniclePlates');
    objectUrls.forEach(URL.revokeObjectURL); objectUrls = [];
    try {
      const db = await openDatabase();
      const plates = await new Promise((resolve, reject) => {
        const tx = db.transaction(PLATES, 'readonly');
        const request = tx.objectStore(PLATES).getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
      plates.sort((a,b) => b.at - a.at);
      host.innerHTML = '';
      if (!plates.length) { host.innerHTML = '<div class="chronicle-empty">no visual plates yet</div>'; return; }
      for (const p of plates.slice(0, 30)) {
        const card = document.createElement('div'); card.className = 'plate';
        const img = document.createElement('img'); const url = URL.createObjectURL(p.blob); objectUrls.push(url); img.src = url; img.alt = p.label || 'world record';
        const body = document.createElement('div'); const title = document.createElement('b'); title.textContent = p.label || 'passage';
        const meta = document.createElement('span'); meta.textContent = (p.seed || 'unnamed') + ' · world ' + formatWorld(p.world);
        body.append(title,meta); card.append(img,body); host.appendChild(card);
      }
    } catch (_) { host.innerHTML = '<div class="chronicle-empty">visual plates unavailable</div>'; }
  }

  function render() {
    readChronicle(); renderFilters(); renderSummary(); drawTimeline(); renderEvents();
  }

  const canvas = document.getElementById('chronicleCanvas'), tip = document.getElementById('chronicleTip');
  canvas.addEventListener('pointermove', event => {
    const r = canvas.getBoundingClientRect(), px = event.clientX-r.left, py = event.clientY-r.top;
    let hit = null, best = Infinity;
    for (const h of hitRegions) { const d = (h.x-px)**2+(h.y-py)**2; if (d < h.r*h.r && d < best) { best=d; hit=h; } }
    if (!hit) { tip.style.display='none'; return; }
    const e = hit.event; tip.innerHTML = '<b style="color:'+ (e.color||'#fff') +'">'+escapeHtml(e.label)+'</b><br>'+escapeHtml(e.seed||'unnamed')+' · world '+formatWorld(e.world)+'<br><span style="color:#70818a">'+escapeHtml(e.kind)+'</span>';
    tip.style.display='block'; tip.style.left=Math.min(r.width-285,px+14)+'px'; tip.style.top=Math.max(6,py-20)+'px';
  });
  canvas.addEventListener('pointerleave', () => { tip.style.display='none'; });
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  addEventListener('resize', drawTimeline);
  addEventListener('storage', e => { if (e.key === KEY) { render(); renderPlates(); } });
  setInterval(render, 15000);
  setInterval(renderPlates, 30000);
  render(); renderPlates();

  const ancestralLedger = ledger;
  ledger = function () {
    let out = ancestralLedger();
    const events = chronicle.events || [];
    if (!events.length) return out;
    const kinds = {};
    for (const e of events) kinds[e.kind] = (kinds[e.kind] || 0) + 1;
    out += '\n## Chronicle\n';
    out += '- records: ' + events.length + '\n';
    out += '- worlds witnessed: ' + new Set(events.map(e => e.seed)).size + '\n';
    out += '- kinds: ' + Object.entries(kinds).sort((a,b)=>b[1]-a[1]).map(([k,n])=>k+' '+n).join(', ') + '\n';
    out += '\n### Recent major passages\n';
    for (const e of events.filter(e => (e.importance || 1) >= 3).slice(-20).reverse()) out += '- **' + e.label + '** — ' + e.seed + ', world ' + formatWorld(e.world) + '\n';
    return out;
  };

  globalThis.LEAF_COUNCIL_CHRONICLE = { officialName: 'Archive Constellation', refresh: render };
})();