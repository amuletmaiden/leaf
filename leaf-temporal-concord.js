/* ==========================================================================
   TEMPORAL CONCORD
   Official change name: Temporal Concord

   Consequential state follows world-time. Surface texture follows display-time.
   This prevents high pace from becoming a particle furnace while still making
   growth, mortality, cooling, law and travel advance coherently.
   ========================================================================== */
(function(){
'use strict';
const dt=()=>{try{return globalThis.LEAF_PACE?LEAF_PACE.step():Math.max(.1,pace)}catch(_){return 1}};
const pow=(k,t)=>Math.pow(k,Math.max(0,t));
function extraAge(list,amount){if(!list||!amount)return;for(const o of list)if(o&&Number.isFinite(o.age))o.age+=amount}
function priorMap(list,key){const m=new Map();for(const o of list||[])m.set(o,o&&o[key]);return m}
function normalizeAssigned(obj,key,before,step){
  if(!obj||!(step>1))return;const now=obj[key];
  if(Number.isFinite(now)&&now>0&&(!(before>0)||now>before+1))obj[key]=now*step;
}
function advanceAggressor(amount){
  if(!(amount>0)||!aggressor||!aggressor.on||!aggressor.target||!gyres.includes(aggressor.target))return;
  const T=aggressor.target,dx=T.x-aggressor.x,dy=T.y-aggressor.y,d=Math.hypot(dx,dy)||1;
  const ax=dx/d*.10,ay=dy/d*.10,drag=.94;
  const q=Math.pow(drag,amount),sum=(1-q)/(1-drag);
  aggressor.vx=aggressor.vx*q+ax*drag*sum;
  aggressor.vy=aggressor.vy*q+ay*drag*sum;
  aggressor.x+=aggressor.vx*amount;aggressor.y+=aggressor.vy*amount;
}
const ancestralFrame=frame;
frame=function(){
  const step=Math.max(.1,dt()),extra=step-1;
  const brideBefore={on:bride.on,life:bride.life,age:bride.age,dying:bride.dying,cool:bride.cool};
  const agBefore={on:aggressor.on,life:aggressor.life,age:aggressor.age,dying:aggressor.dying,cool:aggressor.cool};
  const stunBefore=love.stun||0,guardBefore=love.guard||0;
  const goddesses=(embers||[]).filter(e=>e&&e.kind==='goddess');
  const goddessLife=priorMap(goddesses,'life'),goddessCool=priorMap(goddesses,'judgmentCooldown');
  ancestralFrame();

  if(extra!==0){
    extraAge(daughters,extra);
    for(const G of gyres||[]){
      if(G&&!G.root&&Number.isFinite(G.age))G.age+=extra;
      if(G&&Number.isFinite(G.shock))G.shock*=pow(.90,extra);
      extraAge(G&&G.out,extra);
    }
    extraAge(golds,extra);extraAge(ferments,extra);
    for(const p of temple.pts||[]){
      if(p.set<1)p.set=Math.min(1,p.set+.02*extra);
      if(p.rot>0)p.rot=Math.min(1,p.rot+.015*extra);
      if(p.hermetic&&Number.isFinite(p.hermetic.age))p.hermetic.age+=extra;
    }
    for(const e of embers||[]){
      if(e.kind!=='goddess')continue;
      if(Number.isFinite(e.age))e.age+=extra;
      if((e.judgmentCooldown||0)>0&&goddessCool.get(e)>0)e.judgmentCooldown=Math.max(0,goddessCool.get(e)-step);
      if(e.enthrone){const k=1-Math.pow(1-.012,Math.max(0,extra));e.x=lerp(e.x,e.enthrone.x,k);e.y=lerp(e.y,e.enthrone.y,k)}
    }
    if(bride.on&&Number.isFinite(bride.age))bride.age+=extra;
    if(aggressor.on&&Number.isFinite(aggressor.age))aggressor.age+=extra;
    if(bride.on){const k=1-Math.pow(.98,Math.max(0,extra));bride.x=lerp(bride.x,(love.x+tPos.x)/2,k);bride.y=lerp(bride.y,(love.y+tPos.y)/2,k)}
    advanceAggressor(Math.max(0,extra));
    attSmooth=lerp(attSmooth,attendance,1-Math.pow(.95,Math.max(0,extra)));
  }

  if(!brideBefore.on&&bride.on)normalizeAssigned(bride,'life',brideBefore.life,step);
  if(bride.dying>brideBefore.dying)normalizeAssigned(bride,'dying',brideBefore.dying,step);
  if(bride.cool>brideBefore.cool+1)normalizeAssigned(bride,'cool',brideBefore.cool,step);
  else if(brideBefore.cool>0)bride.cool=Math.max(0,brideBefore.cool-step);

  if(!agBefore.on&&aggressor.on)normalizeAssigned(aggressor,'life',agBefore.life,step);
  if(aggressor.dying>agBefore.dying)normalizeAssigned(aggressor,'dying',agBefore.dying,step);
  if(aggressor.cool>agBefore.cool+1)normalizeAssigned(aggressor,'cool',agBefore.cool,step);
  else if(agBefore.cool>0)aggressor.cool=Math.max(0,agBefore.cool-step);

  if(love.stun>stunBefore)love.stun*=step;else if(stunBefore>0)love.stun=Math.max(0,stunBefore-step);
  if(love.guard>guardBefore)love.guard*=step;else if(guardBefore>0)love.guard=Math.max(0,guardBefore-step);

  for(const e of embers||[]){
    if(e.kind!=='goddess')continue;
    if(goddessLife.get(e)===undefined&&Number.isFinite(e.life)&&step>1)e.life*=step;
    const old=goddessCool.get(e);if(!(old>0)&&(e.judgmentCooldown||0)>1&&step>1)e.judgmentCooldown*=step;
  }
};

globalThis.LEAF_TEMPORAL_CONCORD={officialName:'Temporal Concord',worldDelta:dt,surfaceTime:'rendered frame',worldTime:'pace-scaled'};
})();