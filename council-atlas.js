/* ==========================================================================
   SYSTEM ATLAS
   Official change name: System Atlas

   The named architecture is itself a record. Council Ledger renders systems,
   dependencies, status, files, revert phrases, and local notes as one map.
   ========================================================================== */
(function () {
  'use strict';

  const STORE = 'leaf_system_atlas_v1';
  const CATEGORY_ORDER = ['foundation','world','law','ecology','time','records','interface'];
  let data = { systems: [] };
  let notes = {};
  let activeCategory = 'all';
  let hits = [];

  try { notes = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (_) { notes = {}; }
  const saveNotes = () => { try { localStorage.setItem(STORE, JSON.stringify(notes)); } catch (_) {} };

  const STYLE = document.createElement('style');
  STYLE.textContent = `
    .atlas-head{display:flex;justify-content:space-between;gap:18px;align-items:end;flex-wrap:wrap;margin-bottom:14px}
    .atlas-filters{display:flex;gap:7px;flex-wrap:wrap}
    .atlas-filter{padding:6px 9px;font-size:10px;color:#6e8089;border-color:#1b2d36}
    .atlas-filter[data-active="1"]{color:#fff;border-color:#00c8ff;box-shadow:0 0 10px rgba(0,200,255,.12)}
    .atlas-summary{display:grid;grid-template-columns:repeat(auto-fit,minmax(125px,1fr));gap:8px;margin-bottom:12px}
    .atlas-stat{border:1px solid #162731;background:#030608;padding:9px 11px}
    .atlas-stat b{display:block;color:#d8e6ed;font-size:1rem;font-weight:400}
    .atlas-stat span{display:block;color:#647680;font-size:.65rem;letter-spacing:.08em;margin-top:2px}
    .atlas-stage{position:relative;overflow-x:auto;border:1px solid #172832;background:#000}
    #systemAtlasCanvas{display:block;height:540px;min-width:1000px}
    .atlas-tip{position:absolute;display:none;pointer-events:none;max-width:300px;padding:8px 10px;border:1px solid #29434f;background:rgba(0,0,0,.95);color:#dbe8ee;font-size:11px;line-height:1.42;z-index:4}
    .atlas-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(270px,1fr));gap:10px;margin-top:14px}
    .atlas-card{border:1px solid #172832;background:#05090c;padding:12px;scroll-margin-top:20px}
    .atlas-card[data-hidden="1"]{display:none}
    .atlas-card h3{color:#dbe7ed;margin:0 0 5px}
    .atlas-card .atlas-meta{display:flex;gap:7px;flex-wrap:wrap;margin-bottom:8px}
    .atlas-pill{border:1px solid #20313a;padding:2px 6px;color:#71838d;font-size:.61rem;letter-spacing:.07em}
    .atlas-pill.active{color:#00ff00;border-color:#15452a}
    .atlas-pill.observing{color:#ffff00;border-color:#514b00}
    .atlas-card p{color:#8597a0;font-size:.76rem;margin-bottom:8px}
    .atlas-files{color:#60727c;font-size:.65rem;overflow-wrap:anywhere;margin-bottom:8px}
    .atlas-revert{color:#00c8ff;font-size:.67rem;margin-bottom:8px}
    .atlas-card textarea{width:100%;min-height:52px;background:#010304;color:#b7c6cf;border:1px solid #14232b;padding:7px;font:11px/1.4 "Courier New",monospace;resize:vertical}
    .atlas-empty{color:#60717a;padding:14px;font-size:.76rem}
  `;
  document.head.appendChild(STYLE);

  const section = document.createElement('section');
  section.id = 'system-atlas';
  section.innerHTML = `
    <div class="atlas-head">
      <div><h2>system atlas</h2><p class="note">Named changes, dependencies, files, status, and exact reversion phrases.</p></div>
      <div class="atlas-filters" id="atlasFilters"></div>
    </div>
    <div class="atlas-summary" id="atlasSummary"></div>
    <div class="atlas-stage" id="atlasStage"><canvas id="systemAtlasCanvas"></canvas><div class="atlas-tip" id="atlasTip"></div></div>
    <div class="atlas-grid" id="atlasGrid"></div>`;
  const work = document.getElementById('work');
  if (work) work.after(section); else document.getElementById('questions').before(section);

  const nav = document.querySelector('nav');
  if (nav) {
    const a = document.createElement('a'); a.href = '#system-atlas'; a.textContent = 'systems';
    const chronicleLink = [...nav.querySelectorAll('a')].find(x => x.getAttribute('href') === '#chronicle');
    if (chronicleLink) chronicleLink.after(a); else nav.prepend(a);
  }

  function filtered() {
    return activeCategory === 'all' ? data.systems : data.systems.filter(s => s.category === activeCategory);
  }

  function renderFilters() {
    const host = document.getElementById('atlasFilters');
    const categories = CATEGORY_ORDER.filter(c => data.systems.some(s => s.category === c));
    host.innerHTML = '';
    for (const category of ['all'].concat(categories)) {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'atlas-filter';
      b.dataset.active = category === activeCategory ? '1' : '0'; b.textContent = category;
      b.onclick = () => { activeCategory = category; render(); };
      host.appendChild(b);
    }
  }

  function renderSummary() {
    const systems = data.systems || [];
    const active = systems.filter(s => s.status === 'active').length;
    const observing = systems.filter(s => s.status === 'observing').length;
    const edges = systems.reduce((n,s) => n + (s.depends || []).length, 0);
    const values = [[systems.length,'named systems'],[active,'active'],[observing,'under observation'],[edges,'recorded dependencies']];
    document.getElementById('atlasSummary').innerHTML = values.map(([v,l]) => '<div class="atlas-stat"><b>'+v+'</b><span>'+l+'</span></div>').join('');
  }

  function layoutSystems(systems, width, height) {
    const byCategory = new Map();
    for (const c of CATEGORY_ORDER) byCategory.set(c, []);
    for (const s of systems) {
      if (!byCategory.has(s.category)) byCategory.set(s.category, []);
      byCategory.get(s.category).push(s);
    }
    const categories = CATEGORY_ORDER.filter(c => byCategory.get(c).length);
    const positions = new Map(), left = 90, right = 90, top = 66, bottom = 38;
    categories.forEach((category, ci) => {
      const column = byCategory.get(category).sort((a,b) => a.name.localeCompare(b.name));
      const x = categories.length > 1 ? left + (width-left-right)*(ci/(categories.length-1)) : width/2;
      column.forEach((system, i) => {
        const y = top + (height-top-bottom)*((i+1)/(column.length+1));
        positions.set(system.id,{x,y,system});
      });
    });
    return { positions, categories };
  }

  function roundRect(ctx,x,y,w,h,r){
    const rr=Math.min(r,w/2,h/2);ctx.beginPath();ctx.moveTo(x+rr,y);ctx.arcTo(x+w,y,x+w,y+h,rr);ctx.arcTo(x+w,y+h,x,y+h,rr);ctx.arcTo(x,y+h,x,y,rr);ctx.arcTo(x,y,x+w,y,rr);ctx.closePath();
  }

  function drawAtlas() {
    const canvas = document.getElementById('systemAtlasCanvas'), stage = document.getElementById('atlasStage');
    const systems = filtered(), cssWidth = Math.max(1000, stage.clientWidth), cssHeight = 540;
    canvas.style.width = cssWidth+'px'; canvas.style.height = cssHeight+'px';
    const dpr = Math.min(2,devicePixelRatio||1); canvas.width=Math.round(cssWidth*dpr);canvas.height=Math.round(cssHeight*dpr);
    const x=canvas.getContext('2d');x.setTransform(dpr,0,0,dpr,0,0);x.fillStyle='#000';x.fillRect(0,0,cssWidth,cssHeight);hits=[];
    if(!systems.length){x.fillStyle='#60717a';x.font='11px "Courier New",monospace';x.fillText('no systems in this view',16,26);return;}
    const {positions,categories}=layoutSystems(systems,cssWidth,cssHeight),visibleIds=new Set(systems.map(s=>s.id));
    x.font='10px "Courier New",monospace';x.textAlign='center';x.textBaseline='middle';
    categories.forEach(c=>{const nodes=[...positions.values()].filter(p=>p.system.category===c);if(!nodes.length)return;const cx=nodes[0].x;x.fillStyle='#40515a';x.fillText(c.toUpperCase(),cx,22);});
    for(const system of systems){
      const to=positions.get(system.id);if(!to)continue;
      for(const dep of system.depends||[]){
        if(!visibleIds.has(dep))continue;const from=positions.get(dep);if(!from)continue;
        x.strokeStyle='rgba(75,112,127,.25)';x.lineWidth=1;x.beginPath();x.moveTo(from.x,from.y);const mx=(from.x+to.x)/2;x.bezierCurveTo(mx,from.y,mx,to.y,to.x,to.y);x.stroke();
        const a=Math.atan2(to.y-from.y,to.x-from.x);x.fillStyle='rgba(110,150,165,.34)';x.beginPath();x.moveTo(to.x,to.y);x.lineTo(to.x-Math.cos(a-.45)*7,to.y-Math.sin(a-.45)*7);x.lineTo(to.x-Math.cos(a+.45)*7,to.y-Math.sin(a+.45)*7);x.closePath();x.fill();
      }
    }
    for(const system of systems){
      const p=positions.get(system.id);if(!p)continue;const w=124,h=34,left=p.x-w/2,top=p.y-h/2;
      x.shadowColor=system.color||'#7a8496';x.shadowBlur=system.status==='observing'?10:6;x.fillStyle='rgba(4,8,11,.96)';roundRect(x,left,top,w,h,5);x.fill();x.shadowBlur=0;
      x.strokeStyle=system.color||'#263b46';x.globalAlpha=system.status==='observing'?.8:.55;roundRect(x,left,top,w,h,5);x.stroke();x.globalAlpha=1;
      x.fillStyle=system.color||'#b9c8d0';x.beginPath();x.arc(left+11,p.y,3.6,0,Math.PI*2);x.fill();
      x.fillStyle='#c8d6dd';x.textAlign='left';const label=system.name.length>18?system.name.slice(0,16)+'…':system.name;x.fillText(label,left+20,p.y);
      hits.push({x:left,y:top,w,h,system});
    }
  }

  function renderCards() {
    const host=document.getElementById('atlasGrid');host.innerHTML='';
    for(const system of data.systems){
      const card=document.createElement('article');card.className='atlas-card';card.id='system-'+system.id;card.dataset.hidden=activeCategory==='all'||system.category===activeCategory?'0':'1';
      const status=system.status||'active';
      card.innerHTML='<h3 style="color:'+escapeHtml(system.color||'#dbe7ed')+'">'+escapeHtml(system.name)+'</h3><div class="atlas-meta"><span class="atlas-pill '+escapeHtml(status)+'">'+escapeHtml(status)+'</span><span class="atlas-pill">'+escapeHtml(system.category)+'</span></div><p>'+escapeHtml(system.purpose)+'</p><div class="atlas-files">'+escapeHtml((system.files||[]).join(' · '))+'</div><div class="atlas-revert">'+escapeHtml(system.revert||('revert '+system.name))+'</div>';
      const ta=document.createElement('textarea');ta.placeholder='notes on this system';ta.value=notes[system.id]||'';ta.oninput=()=>{notes[system.id]=ta.value;saveNotes()};card.appendChild(ta);host.appendChild(card);
    }
  }

  function render(){renderFilters();renderSummary();drawAtlas();renderCards()}
  function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

  const canvas=document.getElementById('systemAtlasCanvas'),tip=document.getElementById('atlasTip'),stage=document.getElementById('atlasStage');
  canvas.addEventListener('pointermove',e=>{
    const r=canvas.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;const hit=hits.find(h=>px>=h.x&&px<=h.x+h.w&&py>=h.y&&py<=h.y+h.h);
    if(!hit){tip.style.display='none';return}const s=hit.system;tip.innerHTML='<b style="color:'+escapeHtml(s.color||'#fff')+'">'+escapeHtml(s.name)+'</b><br>'+escapeHtml(s.purpose)+'<br><span style="color:#667983">'+escapeHtml((s.depends||[]).length+' dependencies · '+s.status)+'</span>';
    tip.style.display='block';tip.style.left=Math.max(6,Math.min(stage.clientWidth-310,e.clientX-stage.getBoundingClientRect().left+12))+'px';tip.style.top=Math.max(6,e.clientY-stage.getBoundingClientRect().top-18)+'px';
  });
  canvas.addEventListener('pointerleave',()=>{tip.style.display='none'});
  canvas.addEventListener('click',e=>{const r=canvas.getBoundingClientRect(),px=e.clientX-r.left,py=e.clientY-r.top;const hit=hits.find(h=>px>=h.x&&px<=h.x+h.w&&py>=h.y&&py<=h.y+h.h);if(hit)document.getElementById('system-'+hit.system.id)?.scrollIntoView({behavior:'smooth',block:'center'})});
  addEventListener('resize',drawAtlas);

  fetch('leaf-systems.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('atlas unavailable');return r.json()}).then(json=>{data=json&&Array.isArray(json.systems)?json:{systems:[]};render()}).catch(()=>{document.getElementById('atlasGrid').innerHTML='<div class="atlas-empty">system record unavailable</div>';drawAtlas()});

  const previousLedger=ledger;
  ledger=function(){let out=previousLedger();if(!data.systems.length)return out;out+='\n## System Atlas\n';for(const s of data.systems){const note=(notes[s.id]||'').trim();if(note)out+='- **'+s.name+'** ('+s.status+')\n  - '+note.replace(/\n/g,'\n    ')+'\n'}return out};

  globalThis.LEAF_SYSTEM_ATLAS={officialName:'System Atlas',systems:()=>data.systems.slice(),refresh:render};
})();