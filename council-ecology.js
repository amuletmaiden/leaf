/* ==========================================================================
   ECOLOGY WITNESS
   Council Ledger receives the two living compounds as active inventory.
   ========================================================================== */
(function(){
'use strict';
const extras=[
  ['devourer','STAR-DEVOURER','HEART · POWER · ICE; exceptional stars become turning, then ice'],
  ['scavenger','SCAVENGER','LOVE · POWER; loose relation and exhausted fire become a carried hem']
];
for(const item of extras)if(!inventory.some(x=>x[0]===item[0]))inventory.push(item);
const grid=document.getElementById('inventoryGrid'),cards=new Map(),visible=new Set();
function makeCard([id,name,meta]){
  const state=bind(id,'inventory'),card=document.createElement('div');card.className='card';card.dataset.element=id;card.dataset.open='0';
  const c=document.createElement('canvas'),body=document.createElement('div'),badge=document.createElement('div');badge.className='live-badge';badge.textContent='absent';
  const title=document.createElement('h3');title.textContent=name;const m=document.createElement('div');m.className='meta';m.textContent=meta;
  const ta=document.createElement('textarea');ta.placeholder='notes';ta.value=state.note;ta.oninput=()=>state.setNote(ta.value);
  const label=document.createElement('label'),check=document.createElement('input');check.type='checkbox';check.checked=state.done;check.onchange=()=>state.setDone(check.checked);
  label.append(check,document.createTextNode('reviewed'));body.append(badge,title,m,ta,label);card.append(c,body);
  card.onclick=e=>{if(!e.target.matches('textarea,input,label'))card.dataset.open=card.dataset.open==='1'?'0':'1'};
  grid.appendChild(card);cards.set(id,card);return card;
}
for(const item of extras)makeCard(item);
for(const article of document.querySelectorAll('.work-item')){
  const h=article.querySelector('h3');if(!h)continue;
  if(h.textContent.includes('Star-Devourer')||h.textContent.includes('Scavenger'))article.querySelector('.state').textContent='ACTIVE ECOLOGY';
}
const observer=new IntersectionObserver(es=>{for(const e of es)e.isIntersecting?visible.add(e.target):visible.delete(e.target)},{rootMargin:'120px'});
for(const c of cards.values())observer.observe(c);
function state(){
  try{return JSON.parse(localStorage.getItem('leaf_save_v1')||'null')}catch(_){return null}
}
function read(){
  const d=state(),g=d&&d.newGoddesses||{};
  const e=g.eater||{},s=g.scavenger||{};
  const eb=cards.get('devourer').querySelector('.live-badge'),sb=cards.get('scavenger').querySelector('.live-badge');
  eb.textContent=e.on?'standing · '+(e.eaten||0)+' stars eaten':'absent';
  sb.textContent=s.on?'standing · '+(s.gathered||0)+' gathered':'absent';
  eb.classList.toggle('present',!!e.on);sb.classList.toggle('present',!!s.on);
}
function draw(canvas,id,t){
  const x=canvas.getContext('2d');canvas.width=188;canvas.height=188;x.fillStyle='#000';x.fillRect(0,0,188,188);x.save();x.translate(94,94);x.globalCompositeOperation='lighter';x.lineCap='round';
  if(id==='devourer'){
    for(let i=0;i<3;i++){x.strokeStyle='rgba(255,0,255,'+(.28+i*.08)+')';x.lineWidth=1.6;x.beginPath();x.arc(0,0,28+i*15,t*(.5+i*.08)+i,t*(.5+i*.08)+i+4.8);x.stroke()}
    for(let i=0;i<2;i++){x.strokeStyle='rgba(120,255,255,'+(.25+i*.08)+')';x.beginPath();x.arc(0,0,65+i*12,-t*.25+i,-t*.25+i+5.1);x.stroke()}
    const g=x.createRadialGradient(0,0,0,0,0,45);g.addColorStop(0,'rgba(255,40,25,.9)');g.addColorStop(.38,'rgba(255,0,180,.34)');g.addColorStop(1,'rgba(0,200,255,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,45,0,Math.PI*2);x.fill();
    for(let i=0;i<5;i++){const a=t*.3+i*1.3,r=72-i*7;x.fillStyle='rgba(255,255,80,'+(.25+.3*Math.sin(t*2+i))+')';x.beginPath();x.arc(Math.cos(a)*r,Math.sin(a)*r,2+i*.35,0,Math.PI*2);x.fill()}
  }else{
    const targetA=t*.65;x.strokeStyle='rgba(90,255,130,.22)';x.setLineDash([3,8]);x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(targetA)*78,Math.sin(targetA)*50);x.stroke();x.setLineDash([]);
    for(let i=0;i<22;i++){const a=t*(i%2?-.22:.18)+i*.71,r=28+(i%3)*12;x.fillStyle=i%4===0?'rgba(255,45,30,.72)':'rgba(255,0,255,.62)';x.beginPath();x.arc(Math.cos(a)*r,12+Math.sin(a)*r*.43,1.8+(i%5===0?1:0),0,Math.PI*2);x.fill()}
    const g=x.createRadialGradient(0,0,0,0,0,38);g.addColorStop(0,'rgba(80,255,120,.85)');g.addColorStop(.45,'rgba(0,255,70,.18)');g.addColorStop(1,'rgba(0,255,0,0)');x.fillStyle=g;x.beginPath();x.arc(0,0,38,0,Math.PI*2);x.fill();x.strokeStyle='rgba(255,0,255,.55)';x.beginPath();x.arc(0,0,11,-.8,.8);x.stroke();
  }
  x.restore();
}
let last=0;function animate(ms){requestAnimationFrame(animate);if(ms-last<42)return;last=ms;for(const c of visible)draw(c.querySelector('canvas'),c.dataset.element,ms/1000)}
read();setInterval(read,15000);addEventListener('storage',e=>{if(e.key==='leaf_save_v1')read()});requestAnimationFrame(animate);
globalThis.LEAF_COUNCIL_ECOLOGY={officialName:'Ecology Witness'};
})();