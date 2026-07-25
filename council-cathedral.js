/* CATHEDRAL MIRROR — Council Ledger link and active experiment record. */
(function(){
'use strict';
const nav=document.querySelector('nav');
if(nav&&!nav.querySelector('a[href="cathedral.html"]')){
  const a=document.createElement('a');a.href='cathedral.html';a.textContent='cathedral';
  const first=nav.querySelector('a');first?first.after(a):nav.appendChild(a);
}
const work=document.querySelector('#work .work-grid');
if(work&&!document.getElementById('cathedralWork')){
  const item=document.createElement('article');item.className='work-item';item.id='cathedralWork';
  item.innerHTML='<div class="state">EXPERIMENTAL WORLD</div><h3>Cathedral Mirror</h3><p>A separate visual laboratory mirrors the living simulator, discovers the centres of its kata colours, and builds atmosphere, bloom, architecture, and semantic light without altering the main page.</p><p><a href="cathedral.html">enter the mirror</a></p>';
  work.prepend(item);
}
const inventoryGrid=document.getElementById('inventoryGrid');
if(inventoryGrid&&!document.querySelector('[data-element="cathedral"]')){
  const card=document.createElement('div');card.className='card';card.dataset.element='cathedral';card.dataset.open='0';
  const canvas=document.createElement('canvas'),body=document.createElement('div');
  const title=document.createElement('h3');title.textContent='CATHEDRAL MIRROR';
  const meta=document.createElement('div');meta.className='meta';meta.textContent='separate live visual laboratory';
  const link=document.createElement('a');link.href='cathedral.html';link.textContent='enter';
  body.append(title,meta,link);card.append(canvas,body);inventoryGrid.appendChild(card);
  const x=canvas.getContext('2d');canvas.width=188;canvas.height=188;x.fillStyle='#000';x.fillRect(0,0,188,188);x.globalCompositeOperation='lighter';
  const C=['#ff0000','#00ff00','#ff00ff','#00c8ff','#ffff00'];
  for(let i=0;i<9;i++){const y=28+i*17;x.strokeStyle='rgba(100,190,230,'+(.05+i*.008)+')';x.beginPath();x.moveTo(14,y);x.quadraticCurveTo(94,y-30,174,y);x.stroke()}
  C.forEach((c,i)=>{const a=i*Math.PI*2/C.length-.5,r=38+(i%2)*18,px=94+Math.cos(a)*r,py=98+Math.sin(a)*r*.7;const g=x.createRadialGradient(px,py,0,px,py,24);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');x.globalAlpha=.28;x.fillStyle=g;x.fillRect(px-24,py-24,48,48);x.globalAlpha=1;x.fillStyle=c;x.beginPath();x.arc(px,py,3,0,Math.PI*2);x.fill()});
}
globalThis.LEAF_COUNCIL_CATHEDRAL={officialName:'Cathedral Mirror'};
})();