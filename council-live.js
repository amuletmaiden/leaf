/* ==========================================================================
   LIVING LEDGER
   Official change name: Living Ledger

   Council Ledger's inventory is active: each element moves, each card reports
   what exists in the latest locally saved world, and law receives an explicit
   audit of the rules governing its field and its own drift.
   ========================================================================== */
(function () {
  'use strict';

  const STYLE = document.createElement('style');
  STYLE.textContent = `
    .world-strip{display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:8px;margin-top:22px}
    .world-cell{border:1px solid #14232b;background:#030608;padding:10px 12px;min-height:58px}
    .world-cell b{display:block;color:#dbe8ee;font-weight:400;font-size:.92rem;overflow-wrap:anywhere}
    .world-cell span{display:block;color:#657780;font-size:.68rem;letter-spacing:.08em;margin-top:3px}
    .card{position:relative;cursor:pointer;transition:border-color .16s,transform .16s,background .16s}
    .card:hover{border-color:#28434f;background:#090f13;transform:translateY(-1px)}
    .card[data-open="1"]{grid-column:span 2;border-color:#00c8ff;background:#061016}
    .card[data-open="1"] canvas{width:150px;height:150px}
    .live-badge{display:inline-block;margin:0 0 8px;padding:2px 6px;border:1px solid #1a303a;color:#89a7b4;font-size:.64rem;letter-spacing:.08em}
    .live-badge.present{color:#bfffe0;border-color:#1d4938}
    .card-flash{position:absolute;inset:0;pointer-events:none;box-shadow:inset 0 0 24px rgba(0,200,255,.08)}
    .audit-grid{display:grid;grid-template-columns:minmax(260px,.72fr) minmax(300px,1.28fr);gap:14px}
    .audit-canvas{width:100%;aspect-ratio:16/10;border:1px solid #172832;background:#000;display:block}
    .audit-law{display:grid;gap:8px}
    .audit-rule{border:1px solid #172832;background:#05090c;padding:12px}
    .audit-rule b{display:block;color:#00c8ff;font-weight:400;margin-bottom:5px}
    .audit-rule p{font-size:.78rem;color:#8fa2ac;margin:0 0 8px}
    .audit-rule textarea{width:100%;min-height:48px;background:#010304;color:#b7c6cf;border:1px solid #14232b;padding:7px;font:11px/1.4 "Courier New",monospace;resize:vertical}
    .work-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:10px}
    .work-item{border:1px solid #172832;background:#05090c;padding:12px}
    .work-item .state{font-size:.64rem;letter-spacing:.11em;color:#72828b;margin-bottom:7px}
    .work-item h3{color:#dbe7ed}
    .work-item p{color:#82949e;font-size:.78rem}
    .row-state{border:1px solid #20313a;background:#030608;color:#71828b;padding:4px 7px;font:10px "Courier New",monospace;margin-top:8px;cursor:pointer}
    .row-state[data-state="held"]{color:#ffff00;border-color:#5a5500;text-shadow:0 0 5px #ffff00}
    .row-state[data-state="resolved"]{color:#00ff00;border-color:#164d2a}
    @media(max-width:760px){.audit-grid{grid-template-columns:1fr}.card[data-open="1"]{grid-column:span 1}}
  `;
  document.head.appendChild(STYLE);

  const LIVE_KEY = 'leaf_council_live_v1';
  let liveState = {};
  try { liveState = JSON.parse(localStorage.getItem(LIVE_KEY) || '{}') || {}; } catch (_) {}
  const persist = () => { try { localStorage.setItem(LIVE_KEY, JSON.stringify(liveState)); } catch (_) {} };

  function safeParse(key) {
    try { return JSON.parse(localStorage.getItem(key) || 'null'); } catch (_) { return null; }
  }

  const header = document.querySelector('header');
  const strip = document.createElement('div');
  strip.className = 'world-strip';
  strip.innerHTML = [
    ['worldSeed', 'seed'], ['worldAge', 'world-time'], ['worldPace', 'pace'],
    ['worldSize', 'logical field'], ['worldOrchard', 'fossils'], ['worldSlots', 'pocket worlds']
  ].map(([id, label]) => '<div class="world-cell"><b id="' + id + '">—</b><span>' + label + '</span></div>').join('');
  header.appendChild(strip);

  const work = document.createElement('section');
  work.id = 'work';
  work.innerHTML = `
    <h2>work now moving</h2>
    <div class="work-grid">
      <article class="work-item"><div class="state">OBSERVATION</div><h3>Star Temperance</h3><p>The largest new stars are rarer. Existing skies remain historically intact.</p></article>
      <article class="work-item"><div class="state">ACTIVE LAW</div><h3>Jurisprudential Drift</h3><p>Law no longer follows decorative sine waves. It follows the shared barycentre and resists motion according to accumulated law.</p></article>
      <article class="work-item"><div class="state">ACTIVE VIEW</div><h3>Round Horizon</h3><p>Window changes use one uniform scale. Circles may be reframed, never squeezed into ovals.</p></article>
      <article class="work-item"><div class="state">DESIGNING</div><h3>Star-Devourer ❤️🩷🩵</h3><p>Selective stellar predation rather than a numerical population cap.</p></article>
      <article class="work-item"><div class="state">DESIGNING</div><h3>Scavenger 💚🩷</h3><p>Sight seeks residue and ferments it into carried memory.</p></article>
      <article class="work-item"><div class="state">DESIGNING</div><h3>Bloom-Bringer 🩷💚</h3><p>Transformation proceeds until new sight and green growth are born.</p></article>
    </div>`;
  document.getElementById('questions').before(work);

  const audit = document.createElement('section');
  audit.id = 'law-audit';
  audit.innerHTML = `
    <h2>audit of law</h2>
    <p class="note">These are not implementation trivia. They are the propositions Leaf currently makes about law.</p>
    <div class="audit-grid">
      <canvas class="audit-canvas" id="lawAuditCanvas"></canvas>
      <div class="audit-law" id="lawAuditRules"></div>
    </div>`;
  document.getElementById('inventory').before(audit);

  const lawRules = [
    ['source', 'Settled law, ice, and a legislating goddess emit lawfulness. Unsettled law speaks weakly; ice speaks at seventy-two percent of plain law.', 'Law is carried by established form, while keeping light in ice slightly softens its outward authority.'],
    ['reach', 'Each source acts within 190 world units with exponential falloff. Overlapping sources add until the local field reaches one.', 'Law is local and cumulative: many nearby precedents can become stronger than one decree.'],
    ['threshold', 'Below 0.18, law does not alter a body. Stronger fields use periods 64, 40, then 24.', 'Rule begins as influence and becomes cadence before it becomes exact geometry.'],
    ['place', 'Affected positions are pulled toward grids of 18, 12, then 8 units.', 'More law means fewer permitted places. This is discrete permission, not tidiness.'],
    ['direction', 'Velocity is quantized into eight directions, then twelve under stronger law.', 'Law governs not only where a thing may be, but the directions by which it may proceed.'],
    ['drift', 'The law-body drifts toward the shared barycentre of Heart, Love, Power, stars, and what law has kept. Accumulated law increases inertia.', 'Jurisprudence changes because existing things have weight together; established law becomes harder to revise.']
  ];
  const rulesHost = document.getElementById('lawAuditRules');
  for (const [id, rule, why] of lawRules) {
    const item = document.createElement('div'); item.className = 'audit-rule';
    const note = liveState['law:' + id] || '';
    item.innerHTML = '<b>' + id + '</b><p>' + rule + '</p><p><em>' + why + '</em></p>';
    const ta = document.createElement('textarea'); ta.placeholder = 'notes on this law'; ta.value = note;
    ta.addEventListener('input', () => { liveState['law:' + id] = ta.value; persist(); });
    item.appendChild(ta); rulesHost.appendChild(item);
  }

  const rowStateKey = id => 'row:' + id;
  document.querySelectorAll('.list .row').forEach((row, i) => {
    const id = row.closest('section').id + ':' + i;
    const button = document.createElement('button');
    button.type = 'button'; button.className = 'row-state';
    let value = liveState[rowStateKey(id)] || 'open';
    const render = () => { button.dataset.state = value; button.textContent = value; };
    button.addEventListener('click', e => {
      e.preventDefault(); e.stopPropagation();
      value = value === 'open' ? 'held' : value === 'held' ? 'resolved' : 'open';
      liveState[rowStateKey(id)] = value; persist(); render();
    });
    render(); row.querySelector('div').appendChild(button);
  });

  const cards = Array.from(document.querySelectorAll('.inventory .card'));
  const visible = new Set();
  const cardById = new Map();
  cards.forEach((card, i) => {
    const id = inventory[i] && inventory[i][0];
    if (!id) return;
    card.dataset.element = id; card.dataset.open = '0'; cardById.set(id, card);
    const badge = document.createElement('div'); badge.className = 'live-badge'; badge.textContent = 'not read';
    card.querySelector('div').insertBefore(badge, card.querySelector('div').firstChild);
    const flash = document.createElement('div'); flash.className = 'card-flash'; card.appendChild(flash);
    card.addEventListener('click', event => {
      if (event.target.matches('textarea,input,label')) return;
      card.dataset.open = card.dataset.open === '1' ? '0' : '1';
    });
  });

  const observer = new IntersectionObserver(entries => {
    for (const e of entries) e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
  }, { rootMargin: '120px' });
  cards.forEach(c => observer.observe(c));

  function metric(id, d) {
    if (!d) return null;
    const pts = d.temple && Array.isArray(d.temple.pts) ? d.temple.pts : [];
    const emb = Array.isArray(d.embers) ? d.embers : [];
    const gy = Array.isArray(d.gyres) ? d.gyres : [];
    const map = {
      heart: () => 1 + (d.daughters || []).length,
      love: () => d.love && d.love.init ? 'awake' : 'unformed',
      law: () => pts.filter(p => p.kind !== 'ice').length,
      ice: () => pts.filter(p => p.kind === 'ice').length,
      power: () => gy.length,
      stars: () => (d.stars || []).length,
      gold: () => (d.golds || []).length,
      daughter: () => (d.daughters || []).length,
      vess: () => emb.filter(e => e.kind !== 'star').length,
      ahika: () => emb.filter(e => e.kind === 'star').length,
      zettaitsune: () => d.bride && d.bride.on ? 'standing' : 'absent',
      aggression: () => d.aggressor && d.aggressor.on ? 'standing' : 'absent',
      magenta: () => (d.magentas || []).length,
      starfall: () => (d.fallers || []).length,
      slots: () => liveState.slotCount == null ? 'local' : liveState.slotCount
    };
    if (id === 'orchard') {
      const g = safeParse('leaf_genealogy_v1'); return g && g.events ? Object.keys(g.events).length : 0;
    }
    if (id === 'contagion') {
      const p = safeParse('leaf_preferences_v1'); return p && p.lawEnabled === false ? 'sleeping' : 'awake';
    }
    return map[id] ? map[id]() : null;
  }

  function updateWorldReadout() {
    const d = safeParse('leaf_save_v1');
    const orchard = safeParse('leaf_genealogy_v1');
    document.getElementById('worldSeed').textContent = d && d.seed ? d.seed : 'no recent autosave';
    document.getElementById('worldAge').textContent = d ? Number(d.tick || 0).toLocaleString('en-US') + ' ticks' : '—';
    document.getElementById('worldPace').textContent = d && d.relations ? String(d.relations.pace == null ? 1 : d.relations.pace) : '—';
    document.getElementById('worldSize').textContent = d && d.world ? d.world.w + ' × ' + d.world.h : '—';
    document.getElementById('worldOrchard').textContent = orchard && orchard.events ? Object.keys(orchard.events).length : '0';
    document.getElementById('worldSlots').textContent = liveState.slotCount == null ? 'reading…' : String(liveState.slotCount);
    for (const [id, card] of cardById) {
      const badge = card.querySelector('.live-badge'), value = metric(id, d);
      badge.textContent = value == null ? 'not in autosave' : String(value);
      badge.classList.toggle('present', value === 'awake' || value === 'standing' || (typeof value === 'number' && value > 0));
    }
  }

  function countSlots() {
    try {
      const req = indexedDB.open('leaf-pocket-worlds', 1);
      req.onerror = () => { liveState.slotCount = '—'; persist(); updateWorldReadout(); };
      req.onsuccess = () => {
        const db = req.result;
        const names = Array.from(db.objectStoreNames);
        if (!names.length) { liveState.slotCount = 0; persist(); updateWorldReadout(); return; }
        const tx = db.transaction(names[0], 'readonly');
        const count = tx.objectStore(names[0]).count();
        count.onsuccess = () => { liveState.slotCount = count.result; persist(); updateWorldReadout(); };
      };
    } catch (_) { liveState.slotCount = '—'; }
  }

  function overlay(ctx, id, t) {
    const C = { r:'#ff0000', g:'#00ff00', p:'#ff00ff', b:'#00c8ff', y:'#ffff00', i:'#b8ffff' };
    const dot = (x,y,r,c,a=1) => { ctx.globalAlpha=a;ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill(); };
    const ring = (x,y,r,c,a=1,w=1) => { ctx.globalAlpha=a;ctx.strokeStyle=c;ctx.lineWidth=w;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.stroke(); };
    ctx.save(); ctx.globalCompositeOperation='lighter';
    if (id === 'heart') { for(let i=0;i<5;i++){const a=t*1.2+i*1.25;dot(94+Math.cos(a)*62,94+Math.sin(a)*36,2.2,C.r,.75)} ring(94,94,28+Math.sin(t*3)*5,C.r,.42,2); }
    else if (id === 'love') { const a=Math.sin(t*.7)*.65;ctx.fillStyle='rgba(0,255,100,.18)';ctx.beginPath();ctx.moveTo(58,108);ctx.lineTo(58+Math.cos(a-.38)*115,108+Math.sin(a-.38)*115);ctx.lineTo(58+Math.cos(a+.38)*115,108+Math.sin(a+.38)*115);ctx.closePath();ctx.fill(); }
    else if (id === 'law' || id === 'ice') { for(let i=0;i<9;i++){const a=i*.7+t*.12,r=18+i*6;dot(94+Math.cos(a)*r,94+Math.sin(a)*r,1.8+(i%3),id==='ice'?C.i:C.b,.38+.3*Math.sin(t*2+i))} }
    else if (id === 'power') { for(let i=0;i<4;i++){const r=24+i*13;ctx.strokeStyle=C.p;ctx.globalAlpha=.22+i*.08;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(94,94,r,t*(.2+i*.05)+i,t*(.2+i*.05)+i+4.8);ctx.stroke()} }
    else if (id === 'stars' || id === 'gold') { for(let i=0;i<10;i++){const a=i*2.31,r=20+(i*17)%65;dot(94+Math.cos(a)*r,94+Math.sin(a)*r,1.2+2*Math.max(0,Math.sin(t*2+i)),id==='stars'?C.y:'#fff2a0',.75)} }
    else if (id === 'daughter' || id === 'vess' || id === 'ahika') { for(let i=0;i<9;i++){const a=t*.35+i*.7;dot(94+Math.cos(a)*(34+(i%2)*10),106+Math.sin(a)*15,2.4,id==='ahika'?C.y:C.b,.72)} }
    else if (id === 'zettaitsune') { ring(94,94,38+Math.sin(t*1.7)*6,C.g,.48,2);ring(94,94,55+Math.sin(t*1.7+2)*6,C.b,.42,2);ring(94,94,70+Math.sin(t*1.7+4)*5,C.g,.34,1.5); }
    else if (id === 'aggression') { for(let i=0;i<3;i++){const a=t*1.2+i*Math.PI*2/3,c=[C.r,C.g,C.p][i];dot(94+Math.cos(a)*25,94+Math.sin(a)*25,8,c,.75);ctx.strokeStyle=c;ctx.globalAlpha=.42;ctx.beginPath();ctx.moveTo(94+Math.cos(a)*32,94+Math.sin(a)*32);ctx.lineTo(94+Math.cos(a)*78,94+Math.sin(a)*78);ctx.stroke()} }
    else if (id === 'magenta') { for(let i=0;i<12;i++){const a=t*.5+i*.55;dot(94+Math.cos(a)*(18+i*4),94+Math.sin(a)*(18+i*3),2,C.p,.45+.25*Math.sin(t*2+i))} }
    else if (id === 'starfall') { const q=(t*.15)%1,x=28+132*q,y=38+110*q*q;dot(x,y,5,C.y,.9);ctx.strokeStyle='rgba(255,255,80,.35)';ctx.beginPath();ctx.moveTo(25,35);ctx.quadraticCurveTo(100,10,160,150);ctx.stroke(); }
    else if (id === 'orchard') { for(let i=0;i<4;i++){const a=t*.4+i*1.7;dot([94,46,142,150][i],[128,48,58,110][i],4+2*Math.sin(a),[C.b,C.r,C.g,C.p][i],.65)} }
    else if (id === 'contagion') { const beat=Math.floor(t*2)%4;for(let x=40;x<=148;x+=18)for(let y=40;y<=148;y+=18){const phase=((x+y)/18|0)%4;dot(x,y,phase===beat?3.1:1.5,C.b,phase===beat?.7:.17)} }
    else if (id === 'slots') { for(let i=0;i<4;i++){ctx.strokeStyle=[C.r,C.g,C.p,C.b][i];ctx.globalAlpha=.35+.35*Math.sin(t+i);ctx.strokeRect(43+i*9,43+i*9,74,74)} }
    ctx.restore();
  }

  let lastFrame = 0;
  function animate(time) {
    requestAnimationFrame(animate);
    if (time - lastFrame < 42) return;
    lastFrame = time;
    const t = time / 1000;
    for (const card of visible) {
      const canvas = card.querySelector('canvas'), id = card.dataset.element;
      if (!canvas || !id) continue;
      drawIcon(canvas, id);
      overlay(canvas.getContext('2d'), id, t);
    }
    drawLawAudit(t);
  }

  const auditCanvas = document.getElementById('lawAuditCanvas');
  function drawLawAudit(t) {
    if (!auditCanvas) return;
    const box = auditCanvas.getBoundingClientRect();
    const dpr = Math.min(2, devicePixelRatio || 1), w=Math.max(1,Math.round(box.width*dpr)),h=Math.max(1,Math.round(box.height*dpr));
    if(auditCanvas.width!==w||auditCanvas.height!==h){auditCanvas.width=w;auditCanvas.height=h;}
    const x=auditCanvas.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);const W=box.width,H=box.height;x.fillStyle='#000';x.fillRect(0,0,W,H);x.globalCompositeOperation='lighter';
    const bodies=[{x:W*.18,y:H*.34,c:'#ff0000',m:8},{x:W*.76,y:H*.27,c:'#00ff00',m:7},{x:W*.70,y:H*.76,c:'#ff00ff',m:10}];
    let bx=W*.50,by=H*.50,tw=22;for(const b of bodies){bx+=b.x*b.m;by+=b.y*b.m;tw+=b.m;}bx/=tw;by/=tw;
    const lawMass=18+12*(.5+.5*Math.sin(t*.25));const lx=W*.43+Math.sin(t*.18)*20,ly=H*.56+Math.cos(t*.14)*13;bx=(bx*35+lx*lawMass)/(35+lawMass);by=(by*35+ly*lawMass)/(35+lawMass);
    for(const b of bodies){x.strokeStyle=b.c+'55';x.beginPath();x.moveTo(b.x,b.y);x.lineTo(bx,by);x.stroke();x.fillStyle=b.c;x.beginPath();x.arc(b.x,b.y,4+b.m*.35,0,Math.PI*2);x.fill();}
    for(let i=0;i<28;i++){const a=i*2.4,r=10+i*3.4;x.fillStyle='rgba(0,200,255,'+(.18+.25*(i%4===0))+')';x.beginPath();x.arc(lx+Math.cos(a+t*.04)*r,ly+Math.sin(a+t*.04)*r,1.5+(i%5===0?1.2:0),0,Math.PI*2);x.fill();}
    x.strokeStyle='rgba(255,255,255,.35)';x.setLineDash([3,5]);x.beginPath();x.moveTo(lx,ly);x.lineTo(bx,by);x.stroke();x.setLineDash([]);x.fillStyle='#ffff00';x.beginPath();x.arc(bx,by,3.5,0,Math.PI*2);x.fill();x.fillStyle='#6e838d';x.font='10px "Courier New",monospace';x.fillText('shared barycentre',bx+9,by+3);x.fillStyle='#00c8ff';x.fillText('law-body',lx+9,ly+3);
  }

  const ancestralLedger = ledger;
  ledger = function () {
    let out = ancestralLedger();
    out += '\n## Law audit notes\n';
    for (const [id, rule] of lawRules) {
      const note = (liveState['law:' + id] || '').trim();
      if (note) out += '- **' + id + '** — ' + rule + '\n  - ' + note.replace(/\n/g, '\n    ') + '\n';
    }
    out += '\n## Work states\n';
    document.querySelectorAll('.row-state').forEach((b, i) => { if (b.dataset.state !== 'open') out += '- item ' + (i+1) + ': ' + b.dataset.state + '\n'; });
    return out;
  };

  countSlots(); updateWorldReadout(); setInterval(updateWorldReadout, 5000); requestAnimationFrame(animate);

  globalThis.LEAF_COUNCIL = {
    officialName: 'Living Ledger',
    refresh: updateWorldReadout,
    activeCards: () => Array.from(cardById.keys())
  };
})();