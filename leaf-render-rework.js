/* ========================================================================== 
   LIVING ICONOGRAPHY
   Official change name: Living Iconography

   This is not post-processing. On rework.html, the real Leaf simulation loads
   this script into its own document and the actual drawing functions are
   replaced. State, ecology, saves, law, pace and Chronicle Loom remain real.
   The main page never loads this file.
   ========================================================================== */
(function(){
'use strict';

const originals={
  drawHeartBody,drawHeart,drawLawSkirt,drawLoveSkirt,drawLove,
  drawLawGoddess,drawTemple,drawGyreTrails,drawGyres
};
let enabled=false;
const C={r:'#ff0000',g:'#00ff00',p:'#ff00ff',b:'#00c8ff',ice:'#c8f7ff',y:'#ffff00',white:'#f3ffff'};
const rgba=(hex,a)=>{const h=hex.replace('#',''),r=parseInt(h.slice(0,2),16),g=parseInt(h.slice(2,4),16),b=parseInt(h.slice(4,6),16);return `rgba(${r},${g},${b},${a})`};
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));

function glow(x,y,r,color,a,inner){
  const g=X.createRadialGradient(x,y,inner||0,x,y,r);g.addColorStop(0,rgba(color,a));g.addColorStop(.36,rgba(color,a*.36));g.addColorStop(1,rgba(color,0));
  X.fillStyle=g;X.fillRect(x-r,y-r,r*2,r*2);
}
function diamond(x,y,s,color,a,rot){
  X.save();X.translate(x,y);X.rotate((rot||0)+Math.PI/4);X.strokeStyle=rgba(color,a);X.lineWidth=Math.max(.45,s*.16);X.strokeRect(-s*.58,-s*.58,s*1.16,s*1.16);X.restore();
}
function star(x,y,r,points,color,a,rotation){
  X.save();X.translate(x,y);X.rotate(rotation||0);X.beginPath();
  for(let i=0;i<points*2;i++){const q=i%2?r:r*.34,an=-Math.PI/2+i*Math.PI/points;const px=Math.cos(an)*q,py=Math.sin(an)*q;if(i===0)X.moveTo(px,py);else X.lineTo(px,py)}
  X.closePath();X.fillStyle=rgba(color,a);X.fill();X.restore();
}
function curvedRing(x,y,rx,ry,phase,color,a,width,gaps){
  X.save();X.translate(x,y);X.rotate(phase*.17);X.strokeStyle=rgba(color,a);X.lineWidth=width;X.lineCap='round';
  const n=gaps||3;for(let i=0;i<n;i++){const start=phase+i*TAU/n+.18,end=start+TAU/n*.64;X.beginPath();X.ellipse(0,0,rx,ry,0,start,end);X.stroke()}
  X.restore();
}

function reworkLawSkirt(x,y,scale,skirt,bright){
  if(!skirt||!skirt.length)return;
  const pts=lawSkirtPositions(x,y,scale,skirt),b=bright==null?1:bright;
  X.save();X.globalCompositeOperation='lighter';X.lineCap='round';
  for(let ring=0;ring<3;ring++){
    const row=pts.filter(p=>p.n.ring===ring).sort((a,c)=>a.a-c.a);if(row.length<2)continue;
    const alpha=(.10+ring*.045)*(.55+b*.55);X.strokeStyle=rgba(ring===2?C.ice:C.b,alpha);X.lineWidth=Math.max(.45,(.75+ring*.12)*scale);
    X.beginPath();X.moveTo(row[0].x,row[0].y);for(let i=1;i<row.length;i++){const p=row[i-1],q=row[i],mx=(p.x+q.x)/2,my=(p.y+q.y)/2-(2+ring*2)*scale;X.quadraticCurveTo(mx,my,q.x,q.y)}if(row.length>3){const p=row[row.length-1],q=row[0];X.quadraticCurveTo((p.x+q.x)/2,(p.y+q.y)/2-(2+ring*2)*scale,q.x,q.y)}X.stroke();
  }
  for(const p of pts){const ice=p.n.ice||p.n.ring===2,sz=(1.6+p.n.ring*.25)*p.n.sz*scale;glow(p.x,p.y,sz*4,ice?C.ice:C.b,.12+.14*b,0);diamond(p.x,p.y,sz,ice?C.ice:C.b,.56+.34*b,p.a*.18)}
  X.restore();
}

function reworkLoveSkirt(x,y,scale,skirt,bright){
  if(!skirt||!skirt.length)return;
  const b=bright==null?1:bright,pts=[];
  for(const n of skirt){const a=n.a+tick*n.sp,rx=(19+n.ring*10)*scale,ry=(7+n.ring*4.5)*scale;pts.push({n,x:x+Math.cos(a)*rx,y:y+(12+n.ring*5.5)*scale+Math.sin(a)*ry,a})}
  X.save();X.globalCompositeOperation='lighter';
  const outer=pts.filter(p=>p.n.ring===2).sort((a,c)=>a.a-c.a);
  if(outer.length>2){const veil=X.createLinearGradient(x,y-2*scale,x,y+38*scale);veil.addColorStop(0,'rgba(0,105,255,.025)');veil.addColorStop(1,'rgba(155,250,255,.085)');X.fillStyle=veil;X.beginPath();X.moveTo(x-4*scale,y+3*scale);for(const p of outer)X.lineTo(p.x,p.y);X.lineTo(x+4*scale,y+3*scale);X.closePath();X.fill()}
  for(let ring=0;ring<3;ring++){
    const row=pts.filter(p=>p.n.ring===ring).sort((a,c)=>a.a-c.a);if(row.length<2)continue;
    const t=ring/2,col=t>.66?C.ice:C.b;X.strokeStyle=rgba(col,(.14+.09*t)*(.6+b*.55));X.lineWidth=Math.max(.45,(.62+t*.45)*scale);X.beginPath();X.moveTo(row[0].x,row[0].y);for(let i=1;i<row.length;i++){const p=row[i-1],q=row[i];X.quadraticCurveTo((p.x+q.x)/2,(p.y+q.y)/2-3*scale,q.x,q.y)}if(row.length>3)X.closePath();X.stroke();
  }
  for(const p of pts){const t=p.n.ring/2,col=t>.55?C.ice:C.b,sz=(1.7+.55*t)*p.n.sz*scale;glow(p.x,p.y,sz*4.5,col,.11+.13*b);diamond(p.x,p.y,sz,col,.64+.28*b,p.a*.12)}
  X.restore();
}

function reworkHeartBody(x,y,scale,ph,hot,shock){
  hot=hot||0;shock=shock||0;const amp=heartAmp(ph),R=(14+amp*7.5)*scale,t=tick*.018+ph*.01;
  X.save();X.globalCompositeOperation='lighter';
  glow(x,y,R*4.2,C.r,.24+amp*.24+hot*.1,R*.05);
  glow(x,y,R*2.1,'#ff5b23',.18+amp*.18,R*.1);
  curvedRing(x,y,R*1.58,R*.82,t,C.r,.24+amp*.18,Math.max(.55,1.25*scale),3);
  curvedRing(x,y,R*1.18,R*1.46,-t*.8,'#ff6b32',.17+amp*.14,Math.max(.45,.85*scale),4);
  X.save();X.translate(x,y);X.rotate(t*.34);X.beginPath();
  for(let i=0;i<16;i++){const an=i*TAU/16,q=i%2?R*.70:R*(1.00+.10*Math.sin(t*3+i));const px=Math.cos(an)*q,py=Math.sin(an)*q;if(i===0)X.moveTo(px,py);else X.lineTo(px,py)}
  X.closePath();const core=X.createRadialGradient(-R*.22,-R*.24,R*.08,0,0,R);core.addColorStop(0,'rgba(255,246,190,.98)');core.addColorStop(.20,'rgba(255,116,46,.98)');core.addColorStop(.64,'rgba(188,15,20,.96)');core.addColorStop(1,'rgba(78,2,12,.95)');X.fillStyle=core;X.fill();X.strokeStyle=rgba('#ff714c',.44+amp*.32);X.lineWidth=Math.max(.55,.9*scale);X.stroke();X.restore();
  X.fillStyle=rgba('#fff2c8',.70+amp*.26);X.beginPath();X.ellipse(x-R*.23,y-R*.27,R*.17,R*.10,-.55,0,TAU);X.fill();
  X.fillStyle=rgba('#fff8d2',.46+amp*.52+hot*.16);X.beginPath();X.arc(x,y,R*(.17+amp*.12+hot*.05),0,TAU);X.fill();
  if(shock>.02){curvedRing(x,y,R*(1.35+shock*.72),R*(1.35+shock*.72),t*2,'#ffd077',.64*shock,1+1.4*shock,2)}
  X.restore();
}

function reworkHeart(hx,hy){
  X.save();X.globalCompositeOperation='lighter';
  for(let i=0;i<heart.rings.length;i++){const r=heart.rings[i],ph=tick*.012+i*.7;curvedRing(hx,hy,r.r,r.r*(.78+.05*Math.sin(ph)),ph,C.r,.32*r.a,.45+1.15*r.a,3+i%2)}
  X.restore();
  reworkLawSkirt(hx,hy,1.05,heart.skirt,1);reworkHeartBody(hx,hy,1.05,0,bondAlone*.8,heart.shock);
  for(const h of daughters){reworkLawSkirt(h.x,h.y,.42,h.skirt,.75);reworkHeartBody(h.x,h.y,.36,h.ph,h.hot,h.shock)}
}

function eyePath(x,y,rx,ry,angle){
  X.save();X.translate(x,y);X.rotate(angle);X.beginPath();X.moveTo(-rx,0);X.bezierCurveTo(-rx*.48,-ry,rx*.48,-ry,rx,0);X.bezierCurveTo(rx*.48,ry,-rx*.48,ry,-rx,0);X.closePath();X.restore();
}
function reworkLove(){
  if(love.stun>0){originals.drawLove();return}
  const lx=love.x,ly=love.y,a=love.gazeA,att=Math.min(attSmooth,12),len=Math.max(W,H)*.62,spread=.12+.035*Math.sin(tick*.013);
  reworkLoveSkirt(lx,ly,.74,love.skirt,.58+.42*Math.sin(tick*.04));
  X.save();X.globalCompositeOperation='screen';
  const beam=X.createLinearGradient(lx,ly,lx+Math.cos(a)*len,ly+Math.sin(a)*len);beam.addColorStop(0,'rgba(0,255,95,.16)');beam.addColorStop(.24,'rgba(0,255,95,.075)');beam.addColorStop(1,'rgba(0,255,95,0)');X.fillStyle=beam;X.beginPath();X.moveTo(lx,ly);X.lineTo(lx+Math.cos(a-spread)*len,ly+Math.sin(a-spread)*len);X.lineTo(lx+Math.cos(a+spread)*len,ly+Math.sin(a+spread)*len);X.closePath();X.fill();
  X.strokeStyle='rgba(178,255,204,.34)';X.lineWidth=.7;X.beginPath();X.moveTo(lx+Math.cos(a)*8,ly+Math.sin(a)*8);X.lineTo(lx+Math.cos(a)*len*.72,ly+Math.sin(a)*len*.72);X.stroke();
  glow(lx,ly,58+att*2,C.g,.18+att*.006,4);
  X.save();X.translate(lx,ly);X.rotate(a);const rx=15+att*.28,ry=8.5+att*.10;X.fillStyle='rgba(0,18,8,.92)';X.beginPath();X.moveTo(-rx,0);X.bezierCurveTo(-rx*.42,-ry,rx*.42,-ry,rx,0);X.bezierCurveTo(rx*.42,ry,-rx*.42,ry,-rx,0);X.closePath();X.fill();X.strokeStyle='rgba(135,255,172,.82)';X.lineWidth=1.05;X.stroke();
  const iris=X.createRadialGradient(1,0,0,1,0,7);iris.addColorStop(0,'rgba(230,255,236,.95)');iris.addColorStop(.34,'rgba(35,255,105,.95)');iris.addColorStop(1,'rgba(0,95,28,.95)');X.fillStyle=iris;X.beginPath();X.arc(1,0,6.2,0,TAU);X.fill();X.fillStyle='rgba(0,5,1,.98)';X.beginPath();X.ellipse(2,0,1.25,5.1,0,0,TAU);X.fill();X.fillStyle='rgba(235,255,240,.78)';X.beginPath();X.arc(-.4,-2.2,1.25,0,TAU);X.fill();
  X.strokeStyle='rgba(85,255,130,.34)';X.lineWidth=.65;for(let i=0;i<5;i++){const q=-.65+i*.325;X.beginPath();X.moveTo(Math.cos(q)*rx*.82,Math.sin(q)*ry*.75);X.lineTo(Math.cos(q)*rx*1.34,Math.sin(q)*ry*1.62);X.stroke()}X.restore();
  if(love.shock>.02){glow(lx-Math.cos(a)*14*love.shock,ly-Math.sin(a)*14*love.shock,30+love.shock*34,C.g,.22*love.shock)}
  X.restore();
}

function reworkLawGoddess(e,pul){
  const s=e.scale||1;if(!e.skirt)e.skirt=[];
  X.save();X.globalCompositeOperation='lighter';
  reworkLawSkirt(e.x,e.y-1*s,.70*s,e.skirt,pul);
  const y=e.y-8*s;glow(e.x,y,28*s,C.b,.10+.10*pul);
  X.strokeStyle=rgba(C.ice,.18+.16*pul);X.lineWidth=Math.max(.45,.7*s);X.beginPath();X.moveTo(e.x,y-8*s);X.quadraticCurveTo(e.x-11*s,y+5*s,e.x-7*s,y+19*s);X.moveTo(e.x,y-8*s);X.quadraticCurveTo(e.x+11*s,y+5*s,e.x+7*s,y+19*s);X.stroke();
  X.strokeStyle=rgba(C.b,.20+.14*pul);X.beginPath();X.arc(e.x,y-4*s,8*s,Math.PI*.12,Math.PI*.88);X.stroke();
  reworkHeartBody(e.x,y,.25*s,e.ph,0,0);X.restore();
}

function reworkTemple(tx,ty){
  X.save();X.translate(tx,ty);X.globalCompositeOperation='lighter';
  const n=temple.pts.length,LINK2=820;if(templeGridN!==n)rebuildTempleGrid();
  X.lineWidth=.55;X.lineCap='round';
  for(let i=0;i<n;i++){
    const a=temple.pts[i],cx=(a.x/TCELL)|0,cy=(a.y/TCELL)|0,near=[];
    for(let gx=cx-1;gx<=cx+1;gx++)for(let gy=cy-1;gy<=cy+1;gy++){const bucket=templeGrid.get(gx+','+gy);if(!bucket)continue;for(const b of bucket){if(b===a)continue;const dx=a.x-b.x,dy=a.y-b.y,d=dx*dx+dy*dy;if(d<LINK2)near.push([d,b])}}
    near.sort((u,v)=>u[0]-v[0]);for(let k=0;k<Math.min(3,near.length);k++){const b=near[k][1];if(!(b.x>a.x||(b.x===a.x&&b.y>a.y)))continue;const ice=a.kind==='ice'&&b.kind==='ice',alpha=(ice?.24:.09)*Math.min(a.set,b.set);X.strokeStyle=rgba(ice?C.ice:C.b,alpha);X.beginPath();X.moveTo(a.x,a.y);X.lineTo(b.x,b.y);X.stroke()}
  }
  for(const p of temple.pts){const s=p.set,rot=p.rot||0;if(p.kind==='ice'){
      const q=2.4+s*1.5,pul=.68+.32*Math.sin(tick*.035+p.x*.08);glow(p.x,p.y,q*4,C.ice,.055*pul);X.strokeStyle=rgba(C.ice,.46+.42*pul);X.lineWidth=.65;X.save();X.translate(p.x,p.y);X.rotate(Math.PI/4);X.strokeRect(-q,-q,q*2,q*2);X.rotate(Math.PI/4);X.beginPath();X.moveTo(-q*1.3,0);X.lineTo(q*1.3,0);X.moveTo(0,-q*1.3);X.lineTo(0,q*1.3);X.stroke();X.restore();
    }else{
      const col=rot>0?C.p:C.b,alpha=(.42+.43*s)*(1-rot*.35),q=1.9+s*.8;diamond(p.x,p.y,q,col,alpha,tick*.0009+p.x*.003);if(s<1){X.strokeStyle=rgba(C.ice,.18*(1-s));X.beginPath();X.arc(p.x,p.y,5*(1-s)+2,0,TAU);X.stroke()}
    }}
  glow(0,0,22,C.b,.10);diamond(0,0,5.2,C.ice,.86,tick*.004);diamond(0,0,9.5,C.b,.28,-tick*.002);
  if(temple.shock>.02)glow(0,0,38+temple.shock*36,C.ice,.18*temple.shock);
  for(const e of embers){
    if(e.enthrone){const dx=e.enthrone.x-e.x,dy=e.enthrone.y-e.y;e.x+=dx*.012;e.y+=dy*.012;if(dx*dx+dy*dy<.36)delete e.enthrone}
    const pul=.55+.45*Math.sin(tick*.05+e.ph);
    if(e.kind==='goddess'){reworkLawGoddess(e,pul);continue}
    if(e.kind==='ember'&&e.skirt&&e.skirt.length)reworkLawSkirt(e.x,e.y+2,.43,e.skirt,pul*.8);
    if(e.kind==='star'){glow(e.x,e.y,14,C.y,.24*pul);star(e.x,e.y,4.2,4,C.y,.78+.18*pul,tick*.009+Math.PI/4);star(e.x,e.y,2.2,4,C.white,.65*pul,-tick*.012);continue}
    glow(e.x,e.y,12,C.r,.18*pul);star(e.x,e.y,3.4,4,'#ff7440',.72+.22*pul,Math.PI/4);star(e.x,e.y,1.7,4,'#fff0b5',.52*pul,-Math.PI/4);
  }
  X.restore();
}

function reworkGyreTrails(){
  X.save();X.globalCompositeOperation='lighter';X.lineCap='round';X.lineJoin='round';
  for(const G of gyres){const pf=Math.min(1,G.petrify||0);for(let oi=0;oi<G.orbiters.length;oi++){if(oi%2&&G.orbiters.length>28)continue;const o=G.orbiters[oi],h=o.trail||[],n=h.length;if(n<3)continue;const lit=(o.blessed||0)>.4;X.beginPath();for(let i=0;i<n;i++){const q=h[i],x=G.x+q.x,y=G.y+q.y;if(i===0)X.moveTo(x,y);else{const p=h[i-1],px=G.x+p.x,py=G.y+p.y;X.quadraticCurveTo(px,py,(px+x)/2,(py+y)/2)}}
      const end=h[n-1],depth=end.depth||0,fade=.16+.44*Math.min(1,n/30),width=(.75+depth*2.3)*G.scale;
      X.strokeStyle=pf?rgba('#b9d5ee',fade*(1-.4*pf)):lit?rgba('#9effc7',fade):rgba(C.p,fade*.78);X.lineWidth=width*2.6;X.globalAlpha=.12;X.stroke();X.globalAlpha=1;X.strokeStyle=pf?rgba(C.ice,fade*.72):lit?rgba('#b7ffd4',fade):rgba('#ff48ee',fade);X.lineWidth=width;X.stroke();
    }}
  X.restore();
}
function reworkGyres(){
  reworkGyreTrails();
  X.save();X.globalCompositeOperation='lighter';
  for(const G of gyres){const fade=G.root?1:Math.min(1,(G.life-G.age)/300,G.age/60),energy=Math.min(1.8,G.energy),r=(16+energy*5+(G.shock||0)*13)*G.scale,t=tick*.012+(G.age||0)*.002;
    if(G.lawGrip>.12){const q=lore.lattice*1.6;for(let rr=q;rr<=122*G.scale;rr+=q)curvedRing(G.x,G.y,rr,rr,t*.2,C.b,.035+.055*G.lawGrip,.5,6)}
    glow(G.x,G.y,r*3.4,C.p,.12*fade+.08*(G.shock||0),2);
    for(let i=0;i<4;i++){const rr=r*(.82+i*.58),ry=rr*(.58+.10*Math.sin(t+i));curvedRing(G.x,G.y,rr,ry,(i%2?-1:1)*t*(.75+i*.11)+i,C.p,(.15+i*.035)*fade,Math.max(.55,(1.35-i*.17)*G.scale),3+i%2)}
    X.fillStyle='rgba(10,0,16,.96)';X.beginPath();X.arc(G.x,G.y,r*.38,0,TAU);X.fill();star(G.x,G.y,r*.28,5,'#ff9bf5',.50*fade,t*.7);
    for(const q of G.out){const a=(1-q.age/q.life)*fade;glow(q.x,q.y,5,C.p,.11*a);diamond(q.x,q.y,1.7+.7*a,C.p,.54*a,Math.atan2(q.vy||0,q.vx||1))}
  }
  X.restore();
}

const reworked={
  drawHeartBody:reworkHeartBody,drawHeart:reworkHeart,drawLawSkirt:reworkLawSkirt,
  drawLoveSkirt:reworkLoveSkirt,drawLove:reworkLove,drawLawGoddess:reworkLawGoddess,
  drawTemple:reworkTemple,drawGyreTrails:reworkGyreTrails,drawGyres:reworkGyres
};
function install(map){for(const [name,fn] of Object.entries(map)){try{globalThis[name]=fn;eval(name+' = fn')}catch(_){try{eval(name+' = map[name]')}catch(__){}}}}
function setEnabled(on){enabled=!!on;install(enabled?reworked:originals);document.documentElement.dataset.livingIconography=enabled?'on':'off';return enabled}
setEnabled(true);

globalThis.LEAF_RENDER_REWORK={officialName:'Living Iconography',setEnabled,isEnabled:()=>enabled,originals,reworked};
})();