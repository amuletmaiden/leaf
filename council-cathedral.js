/* CATHEDRAL MIRROR / LIVING ICONOGRAPHY — Council links and experiment records. */
(function(){
'use strict';
const nav=document.querySelector('nav');
function navLink(href,text,after){
  if(!nav||nav.querySelector('a[href="'+href+'"]'))return;
  const a=document.createElement('a');a.href=href;a.textContent=text;
  const anchor=after&&nav.querySelector('a[href="'+after+'"]');anchor?anchor.after(a):nav.appendChild(a);
}
navLink('cathedral.html','cathedral','index.html');
navLink('rework.html','rework','cathedral.html');

const work=document.querySelector('#work .work-grid');
if(work&&!document.getElementById('reworkWork')){
  const item=document.createElement('article');item.className='work-item';item.id='reworkWork';
  item.innerHTML='<div class="state">ACTIVE RENDERER FORK</div><h3>Living Iconography</h3><p>A separate page runs the real Leaf simulation while replacing its actual Heart, Love, Temple, gyre, law-skirt, kept-fire, and goddess drawing functions. The main page never loads the renderer.</p><p><a href="rework.html">enter the rework</a></p>';
  work.prepend(item);
}
if(work&&!document.getElementById('cathedralWork')){
  const item=document.createElement('article');item.className='work-item';item.id='cathedralWork';
  item.innerHTML='<div class="state">EXPERIMENTAL MIRROR</div><h3>Cathedral Mirror</h3><p>A separate atmospheric mirror over the living simulator.</p><p><a href="cathedral.html">enter the mirror</a></p>';
  work.appendChild(item);
}

function addCard(id,title,meta,href,draw){
  const inventoryGrid=document.getElementById('inventoryGrid');
  if(!inventoryGrid||document.querySelector('[data-element="'+id+'"]'))return;
  const card=document.createElement('div');card.className='card';card.dataset.element=id;card.dataset.open='0';
  const canvas=document.createElement('canvas'),body=document.createElement('div');
  const heading=document.createElement('h3');heading.textContent=title;
  const m=document.createElement('div');m.className='meta';m.textContent=meta;
  const link=document.createElement('a');link.href=href;link.textContent='enter';
  body.append(heading,m,link);card.append(canvas,body);inventoryGrid.appendChild(card);
  canvas.width=188;canvas.height=188;draw(canvas.getContext('2d'));
}
addCard('rework','LIVING ICONOGRAPHY','actual renderer fork','rework.html',x=>{
  x.fillStyle='#000';x.fillRect(0,0,188,188);x.globalCompositeOperation='lighter';
  const C={r:'#ff0000',g:'#00ff00',p:'#ff00ff',b:'#00c8ff'};
  function ring(cx,cy,rx,ry,c,a,rot){x.save();x.translate(cx,cy);x.rotate(rot);x.strokeStyle=c;x.globalAlpha=a;x.lineWidth=1.3;for(let i=0;i<3;i++){x.beginPath();x.ellipse(0,0,rx,ry,0,i*2.2,i*2.2+1.35);x.stroke()}x.restore()}
  ring(49,53,24,13,C.r,.75,.2);ring(49,53,17,25,'#ff6a32',.38,-.3);x.fillStyle=C.r;x.beginPath();x.arc(49,53,7,0,Math.PI*2);x.fill();
  x.strokeStyle=C.g;x.globalAlpha=.8;x.beginPath();x.moveTo(78,51);x.bezierCurveTo(89,39,111,39,122,51);x.bezierCurveTo(111,63,89,63,78,51);x.stroke();x.fillStyle=C.g;x.beginPath();x.ellipse(100,51,3,8,0,0,Math.PI*2);x.fill();
  for(let i=0;i<4;i++)ring(135,53,12+i*6,7+i*4,C.p,.28+i*.09,i*.7);
  for(let i=0;i<22;i++){const a=i*2.4,r=7+i*2.5,px=93+Math.cos(a)*r,py=125+Math.sin(a)*r*.72;x.strokeStyle=i%4===0?'#c8f7ff':C.b;x.globalAlpha=.35+(i%4===0?.35:0);x.save();x.translate(px,py);x.rotate(Math.PI/4);x.strokeRect(-2,-2,4,4);x.restore()}
});
addCard('cathedral','CATHEDRAL MIRROR','separate atmospheric mirror','cathedral.html',x=>{
  x.fillStyle='#000';x.fillRect(0,0,188,188);x.globalCompositeOperation='lighter';const C=['#ff0000','#00ff00','#ff00ff','#00c8ff','#ffff00'];
  for(let i=0;i<9;i++){const y=28+i*17;x.strokeStyle='rgba(100,190,230,'+(.05+i*.008)+')';x.beginPath();x.moveTo(14,y);x.quadraticCurveTo(94,y-30,174,y);x.stroke()}
  C.forEach((c,i)=>{const a=i*Math.PI*2/C.length-.5,r=38+(i%2)*18,px=94+Math.cos(a)*r,py=98+Math.sin(a)*r*.7,g=x.createRadialGradient(px,py,0,px,py,24);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');x.globalAlpha=.28;x.fillStyle=g;x.fillRect(px-24,py-24,48,48);x.globalAlpha=1;x.fillStyle=c;x.beginPath();x.arc(px,py,3,0,Math.PI*2);x.fill()});
});
globalThis.LEAF_COUNCIL_CATHEDRAL={mirrorName:'Cathedral Mirror',reworkName:'Living Iconography'};
})();