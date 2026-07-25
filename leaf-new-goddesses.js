/* ==========================================================================
   RETROGRADE HUNGER — HEART · POWER · ICE
   SCAVENGER'S HEM — LOVE · POWER
   Neither has a command or announcement. Both are conditions of the world.
   ========================================================================== */
(function(){
'use strict';
const eater={on:false,x:0,y:0,vx:0,vy:0,age:0,life:0,cool:0,turn:0,eaten:0,dying:0,trail:[]};
const scav={on:false,x:0,y:0,vx:0,vy:0,age:0,life:0,cool:0,dying:0,gathered:0,garment:[],target:null,trail:[]};
const num=(n,d=0)=>Number.isFinite(n)?n:d;
const cap=(n,a,b)=>Math.max(a,Math.min(b,n));
const span=(a,b)=>{try{return Math.max(900,slow(rand(a,b)))}catch(_){return(a+b)/2}};
const dt=()=>{try{return cap(Math.sqrt(Math.max(.1,num(pace,1))),.45,7)}catch(_){return 1}};
function lawful(o){
  try{return globalThis.LEAF_LAW&&LEAF_LAW.isEnabled()?LEAF_LAW.lawfulnessAt(o.x,o.y)||0:0}catch(_){return 0}
}
function move(o,t,acc,max){
  const m=dt();
  if(t){const dx=t.x-o.x,dy=t.y-o.y,d=Math.hypot(dx,dy)||1;o.vx+=dx/d*acc*m;o.vy+=dy/d*acc*m}
  const law=lawful(o),speed=Math.hypot(o.vx,o.vy);
  if(law>.18&&speed>.001){const n=law>.68?12:8,u=TAU/n,a=Math.atan2(o.vy,o.vx),q=Math.round(a/u)*u,k=.025+law*.07;o.vx+=(Math.cos(q)*speed-o.vx)*k;o.vy+=(Math.sin(q)*speed-o.vy)*k}
  o.vx*=Math.pow(.972,m);o.vy*=Math.pow(.972,m);
  const s=Math.hypot(o.vx,o.vy);if(s>max){o.vx*=max/s;o.vy*=max/s}
  o.x=cap(o.x+o.vx*m,-80,W+80);o.y=cap(o.y+o.vy*m,-80,H+80);
}
function trail(o,n){o.trail.push({x:o.x,y:o.y});if(o.trail.length>n)o.trail.shift()}
function giants(){
  try{return stars.filter(s=>num(s.sz)>=1.72).sort((a,b)=>(num(b.sz)+num(b.mass)*.22)-(num(a.sz)+num(a.mass)*.22))}catch(_){return[]}
}
function pressure(){let q=0;for(const s of giants())q+=Math.max(0,num(s.sz)-1.35)*num(s.mass,1);return q}
function spawnEater(s){
  eater.on=true;eater.age=0;eater.life=span(12000,21000);eater.dying=0;eater.turn=0;eater.eaten=0;eater.trail=[];
  const left=s.x>W/2;eater.x=left?-55:W+55;eater.y=cap(s.y+rand(-140,140),40,H-40);eater.vx=left?.15:-.15;eater.vy=0;
}
function eaterTarget(){
  const g=giants();if(g.length)return g[0];
  let b=null,v=-1;try{for(const s of stars){const q=num(s.sz)*1.4+num(s.mass,1)*.35;if(q>v){v=q;b=s}}}catch(_){}
  return b;
}
function iceAt(x,y,n){
  try{const t=pTemple();let made=0;for(let k=0;k<n*5&&made<n;k++){const a=rand(0,TAU),r=rand(10,42),nx=x-t[0]+Math.cos(a)*r,ny=y-t[1]+Math.sin(a)*r;if(seatFree(nx,ny,105)){addLawPoint(nx,ny,'ice');emitGlints(x,y,t[0],t[1],1);made++}}return made}catch(_){return 0}
}
function eat(s){
  const i=stars.indexOf(s);if(i<0)return;
  const mass=Math.max(.5,num(s.mass,1)),size=Math.max(.4,num(s.sz,1)),x=s.x,y=s.y;stars.splice(i,1);
  eater.turn+=mass*(.72+size*.28);eater.eaten++;
  try{addElementImpact('star',x,y,Math.min(1.7,.55+size*.35));addElementImpact('power',eater.x,eater.y,Math.min(1.3,.4+mass*.18));
    if(globalThis.LEAF_GENEALOGY&&eater.eaten===1)LEAF_GENEALOGY.remember('retrograde-hunger',{label:'a great star is eaten',color:'#ff00ff',parent:'stars-kindled'})}catch(_){}
}
function updateEater(){
  if(eater.cool>0)eater.cool-=Math.max(1,Math.round(dt()));
  if(!eater.on){const g=giants();if(eater.cool<=0&&g.length>=3&&pressure()>2.8&&temple.iceCount>=8&&every(3000,317)&&Math.random()<.52)spawnEater(g[0]);return}
  eater.age++;
  if(eater.dying){eater.dying-=Math.max(1,Math.round(dt()));if(eater.dying<=0){try{decompose(eater.x,eater.y,['red','pink','blue'],1.25)}catch(_){}eater.on=false;eater.cool=span(30000,52000);eater.turn=0;eater.trail=[]}return}
  const s=eaterTarget();if(s){move(eater,s,.017,1.05);if(Math.hypot(s.x-eater.x,s.y-eater.y)<18+num(s.sz,1)*4.8)eat(s)}else{const t=pTemple();move(eater,{x:t[0],y:t[1]},.006,.65)}
  trail(eater,34);
  while(eater.turn>=2.35){const n=iceAt(eater.x,eater.y,4);eater.turn-=n?2.35:.35;if(!n)break}
  if(eater.age>eater.life||(eater.eaten&&pressure()<.75&&eater.turn<.8))eater.dying=span(420,620);
}
function drawEater(){
  if(!eater.on)return;const a=eater.dying?cap(eater.dying/520,0,1):Math.min(1,eater.age/160);
  X.save();X.globalCompositeOperation='lighter';X.lineCap='round';
  for(let i=1;i<eater.trail.length;i++){const p=eater.trail[i-1],q=eater.trail[i],f=i/eater.trail.length;X.strokeStyle=`rgba(255,30,235,${(.03+f*.16)*a})`;X.lineWidth=.5+f;X.beginPath();X.moveTo(p.x,p.y);X.lineTo(q.x,q.y);X.stroke()}
  for(let k=0;k<3;k++){const r=22+k*10+Math.sin(tick*.035+k*2)*3+eater.turn;X.strokeStyle=`rgba(255,0,255,${(.18+k*.05)*a})`;X.beginPath();X.arc(eater.x,eater.y,r,tick*.024+k,tick*.024+k+4.8);X.stroke()}
  for(let k=0;k<2;k++){const r=45+k*11+Math.sin(tick*.022+k*2)*4;X.strokeStyle=`rgba(120,255,255,${(.13+k*.04)*a})`;X.beginPath();X.arc(eater.x,eater.y,r,-tick*.011+k,-tick*.011+k+5.1);X.stroke()}
  const g=X.createRadialGradient(eater.x,eater.y,0,eater.x,eater.y,40);g.addColorStop(0,`rgba(255,35,28,${.8*a})`);g.addColorStop(.38,`rgba(255,0,180,${.24*a})`);g.addColorStop(1,'rgba(0,200,255,0)');X.fillStyle=g;X.beginPath();X.arc(eater.x,eater.y,40,0,TAU);X.fill();X.restore();
}
function residue(){
  try{return magentas.length+heart.sparks.reduce((n,s)=>n+(!s.cap&&num(s.age)>num(s.life,1)*.62?.55:0),0)}catch(_){return 0}
}
function spawnScav(){
  scav.on=true;scav.age=0;scav.life=span(15000,26000);scav.dying=0;scav.gathered=0;scav.garment=[];scav.target=null;scav.trail=[];
  scav.x=num(love.x,W/2);scav.y=num(love.y,H/2);scav.vx=rand(-.2,.2);scav.vy=rand(-.2,.2);
}
function valid(t){if(!t)return false;try{return(t.kind==='pink'?magentas:heart.sparks)[t.index]===t.object}catch(_){return false}}
function chooseResidue(){
  let b=null,v=Infinity;
  try{
    for(let i=0;i<magentas.length;i++){const o=magentas[i],q=Math.hypot(o.x-scav.x,o.y-scav.y)*.62+num(o.age)*.05;if(q<v){v=q;b={kind:'pink',index:i,object:o}}}
    for(let i=0;i<heart.sparks.length;i++){const o=heart.sparks[i];if(o.cap||num(o.age)<num(o.life,1)*.62)continue;const q=Math.hypot(o.x-scav.x,o.y-scav.y)+90;if(q<v){v=q;b={kind:'red',index:i,object:o}}}
  }catch(_){}
  return b;
}
function compost(item){
  try{const a=rand(0,TAU),l=rand(5,14);PX.save();PX.lineCap='round';PX.strokeStyle=item.kind==='red'?'rgba(80,255,115,.09)':'rgba(255,0,255,.08)';PX.lineWidth=rand(.5,1.2);PX.beginPath();PX.moveTo(scav.x,scav.y);PX.lineTo(scav.x+Math.cos(a)*l,scav.y+Math.sin(a)*l);PX.stroke();PX.restore()}catch(_){}
}
function gather(t){
  if(!valid(t))return;const list=t.kind==='pink'?magentas:heart.sparks,o=t.object;list.splice(t.index,1);
  scav.garment.push({kind:t.kind,phase:rand(0,TAU),radius:rand(18,34),speed:rand(.004,.012)*(Math.random()<.5?-1:1)});scav.gathered++;
  if(scav.garment.length>26)compost(scav.garment.shift());
  try{addElementImpact(t.kind==='red'?'heart':'power',o.x,o.y,.24);if(globalThis.LEAF_GENEALOGY&&scav.gathered===1)LEAF_GENEALOGY.remember('scavengers-hem',{label:'residue enters a hem',color:'#00ff00',parent:'love-wears-law'})}catch(_){}
}
function updateScav(){
  if(scav.cool>0)scav.cool-=Math.max(1,Math.round(dt()));
  if(!scav.on){if(scav.cool<=0&&residue()>34&&every(2400,419)&&Math.random()<.64)spawnScav();return}
  scav.age++;
  if(scav.dying){scav.dying-=Math.max(1,Math.round(dt()));if(scav.dying<=0){for(const i of scav.garment)compost(i);try{decompose(scav.x,scav.y,['green','pink'],1.05)}catch(_){}scav.on=false;scav.cool=span(22000,40000);scav.garment=[];scav.target=null;scav.trail=[]}return}
  if(!valid(scav.target)||tick%90===0)scav.target=chooseResidue();
  const t=scav.target;
  if(t){move(scav,t.object,.013,.78);if(Math.hypot(t.object.x-scav.x,t.object.y-scav.y)<12){gather(t);scav.target=null}}
  else{const a=tick*.003+Math.sin(tick*.0007);move(scav,{x:num(love.x,W/2)+Math.cos(a)*110,y:num(love.y,H/2)+Math.sin(a*1.3)*80},.004,.46)}
  trail(scav,28);
  if(scav.age>scav.life||(scav.gathered>8&&residue()<8&&scav.age>scav.life*.35))scav.dying=span(360,560);
}
function drawScav(){
  if(!scav.on)return;const a=scav.dying?cap(scav.dying/480,0,1):Math.min(1,scav.age/140);
  X.save();X.globalCompositeOperation='lighter';X.lineCap='round';
  for(let i=1;i<scav.trail.length;i++){const p=scav.trail[i-1],q=scav.trail[i],f=i/scav.trail.length;X.strokeStyle=`rgba(70,255,110,${(.02+f*.1)*a})`;X.beginPath();X.moveTo(p.x,p.y);X.lineTo(q.x,q.y);X.stroke()}
  if(valid(scav.target)){X.strokeStyle=`rgba(90,255,130,${.13*a})`;X.setLineDash([2,8]);X.beginPath();X.moveTo(scav.x,scav.y);X.lineTo(scav.target.object.x,scav.target.object.y);X.stroke();X.setLineDash([])}
  for(let i=0;i<scav.garment.length;i++){const o=scav.garment[i],p=o.phase+tick*o.speed,r=o.radius+(1+Math.floor(i/9))*4,x=scav.x+Math.cos(p)*r,y=scav.y+10+Math.sin(p)*r*.42;X.fillStyle=o.kind==='red'?`rgba(255,45,30,${.55*a})`:`rgba(255,0,255,${.55*a})`;X.beginPath();X.arc(x,y,1.7+(i%4===0?.8:0),0,TAU);X.fill()}
  const g=X.createRadialGradient(scav.x,scav.y,0,scav.x,scav.y,34);g.addColorStop(0,`rgba(70,255,110,${.72*a})`);g.addColorStop(.45,`rgba(0,255,70,${.16*a})`);g.addColorStop(1,'rgba(0,255,0,0)');X.fillStyle=g;X.beginPath();X.arc(scav.x,scav.y,34,0,TAU);X.fill();X.strokeStyle=`rgba(255,0,255,${.42*a})`;X.beginPath();X.arc(scav.x,scav.y,10,-.8,.8);X.stroke();X.restore();
}
function clear(){
  Object.assign(eater,{on:false,x:0,y:0,vx:0,vy:0,age:0,life:0,cool:0,turn:0,eaten:0,dying:0,trail:[]});
  Object.assign(scav,{on:false,x:0,y:0,vx:0,vy:0,age:0,life:0,cool:0,dying:0,gathered:0,garment:[],target:null,trail:[]});
}
function copyInto(t,s){if(!s)return;for(const k of Object.keys(t))if(k!=='target'&&s[k]!==undefined)t[k]=s[k];t.target=null;if(!Array.isArray(t.trail))t.trail=[];if(t.garment&&!Array.isArray(t.garment))t.garment=[]}
const oldFrame=frame;frame=function(){oldFrame();updateEater();updateScav();drawEater();drawScav()};
const oldSnapshot=snapshot;snapshot=function(){const d=JSON.parse(oldSnapshot());d.newGoddesses={eater:JSON.parse(JSON.stringify(eater)),scavenger:{...JSON.parse(JSON.stringify(scav)),target:null}};return JSON.stringify(d)};
const oldRestore=restore;restore=function(json){let s=null;try{s=JSON.parse(json).newGoddesses}catch(_){}const ok=oldRestore(json);if(!ok)return false;clear();if(s){copyInto(eater,s.eater);copyInto(scav,s.scavenger)}return true};
const oldReset=resetWorld;resetWorld=function(){const r=oldReset();clear();return r};
globalThis.LEAF_NEW_GODDESSES={hungerName:'Retrograde Hunger',scavengerName:"Scavenger's Hem",eater:()=>({on:eater.on,eaten:eater.eaten,turn:eater.turn}),scavenger:()=>({on:scav.on,gathered:scav.gathered,garment:scav.garment.length})};
})();