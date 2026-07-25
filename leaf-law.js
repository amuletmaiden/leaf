/* ========================================================================== 
   LAW OF CONTAGION
   Official change name: Law of Contagion

   DORMANT SIGILS
   Official change name: Dormant Sigils

   CHORUS OF PRECEDENT
   Official change name: Chorus of Precedent

   TEMPORAL CONCORD
   Official change name: Temporal Concord

   SILENT DOCTRINE
   Official change name: Silent Doctrine

   Temple is no longer only a place. Lawfulness is a local scalar that leaks
   from settled law, ice, and legislating goddesses. Things inside the field
   begin to snap, repeat, share phase, and move on a beat instead of pure drift.
   ========================================================================== */
(function () {
  'use strict';

  const PREF_KEY = 'leaf_preferences_v1';
  let enabled = true;
  let visible = false;
  let sources = [];
  let legislators = [];
  let canvas = null;
  let ctx = null;
  let firstInfection = false;

  const worldNow = () => {
    try { return globalThis.LEAF_PACE ? LEAF_PACE.worldClock() : (typeof tick === 'number' ? tick : 0); }
    catch (_) { return typeof tick === 'number' ? tick : 0; }
  };
  const worldDt = () => {
    try { return globalThis.LEAF_PACE ? LEAF_PACE.step() : Math.max(0.1, pace); }
    catch (_) { return 1; }
  };

  try {
    const pref = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
    if (typeof pref.lawEnabled === 'boolean') enabled = pref.lawEnabled;
  } catch (_) {}

  function savePref() {
    try {
      const pref = JSON.parse(localStorage.getItem(PREF_KEY) || '{}');
      pref.lawEnabled = enabled;
      delete pref.lawVisible;
      localStorage.setItem(PREF_KEY, JSON.stringify(pref));
    } catch (_) {}
  }

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'leaf-law-contagion';
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;z-index:3;pointer-events:none';
    document.body.appendChild(canvas);
    ctx = canvas.getContext('2d');
    resize();
    addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    const dpr = Math.min(2, devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(innerWidth * dpr));
    canvas.height = Math.max(1, Math.round(innerHeight * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rebuildSources() {
    const next = [];
    try {
      const origin = pTemple();
      const pts = temple && Array.isArray(temple.pts) ? temple.pts : [];
      const stride = Math.max(1, Math.floor(pts.length / 180));
      for (let i = 0; i < pts.length; i += stride) {
        const p = pts[i];
        if (!p || p.hermetic) continue;
        const settled = p.set == null ? 1 : Math.max(0, Math.min(1, p.set));
        const strength = (p.kind === 'ice' ? 0.72 : 1) * (0.28 + 0.72 * settled);
        next.push({ x: origin[0] + p.x, y: origin[1] + p.y, strength, kind: p.kind || 'law' });
      }
    } catch (_) {}
    for (const source of legislators) next.push(source);
    sources = next;
  }

  function lawfulnessAt(x, y) {
    let total = 0;
    for (const s of sources) {
      const dx = x - s.x, dy = y - s.y;
      const d2 = dx * dx + dy * dy;
      if (d2 > 190 * 190) continue;
      total += s.strength * Math.exp(-d2 / 9200);
      if (total >= 1.25) break;
    }
    return Math.max(0, Math.min(1, total));
  }

  function angleDifference(a, b) {
    let d = b - a;
    while (d > Math.PI) d -= Math.PI * 2;
    while (d < -Math.PI) d += Math.PI * 2;
    return d;
  }

  function infectObject(object, x, y, write, options) {
    if (!object || !Number.isFinite(x) || !Number.isFinite(y)) return 0;
    const law = lawfulnessAt(x, y), dt = Math.max(0.1, worldDt());
    object._leafLaw = law;
    if (law < 0.18) return law;

    if (!firstInfection && law > 0.42) {
      firstInfection = true;
      if (globalThis.LEAF_GENEALOGY) {
        LEAF_GENEALOGY.remember('law-contagion', {
          label: 'law becomes contagious', color: '#00c8ff', parent: 'law-awakens'
        });
      }
    }

    const period = law > 0.72 ? 24 : law > 0.45 ? 40 : 64;
    if (object._leafLawPhase == null) object._leafLawPhase = Math.floor(Math.random() * period);
    const clock = worldNow();
    const phase = (clock + object._leafLawPhase) % period;
    const open = phase <= Math.max(1, Math.sqrt(dt));
    object._leafLawBeat = phase / period;

    if (Number.isFinite(object.ph)) {
      const canonical = (clock % period) / period * Math.PI * 2;
      const base = 0.004 + law * 0.016;
      object.ph += angleDifference(object.ph, canonical) * (1 - Math.pow(1 - base, dt));
    }

    if (!open) {
      if (options && options.velocity && Number.isFinite(object.vx) && Number.isFinite(object.vy)) {
        const hold = 1 - (0.008 + law * 0.032);
        object.vx *= Math.pow(hold, dt);
        object.vy *= Math.pow(hold, dt);
      }
      return law;
    }

    const grid = law > 0.72 ? 8 : law > 0.45 ? 12 : 18;
    const basePull = 0.08 + law * 0.17;
    const pull = 1 - Math.pow(1 - basePull, dt);
    const nx = x + (Math.round(x / grid) * grid - x) * pull;
    const ny = y + (Math.round(y / grid) * grid - y) * pull;
    write(nx, ny, law);

    if (options && options.velocity && Number.isFinite(object.vx) && Number.isFinite(object.vy)) {
      const speed = Math.hypot(object.vx, object.vy);
      if (speed > 0.0001) {
        const steps = law > 0.65 ? 12 : 8;
        const a = Math.atan2(object.vy, object.vx);
        const qa = Math.round(a / (Math.PI * 2 / steps)) * (Math.PI * 2 / steps);
        const baseBlend = 0.10 + law * 0.16;
        const blend = 1 - Math.pow(1 - baseBlend, dt);
        const release = Math.pow(1 + law * 0.012, Math.min(dt, 4));
        object.vx = (object.vx + (Math.cos(qa) * speed - object.vx) * blend) * release;
        object.vy = (object.vy + (Math.sin(qa) * speed - object.vy) * blend) * release;
      }
    }
    return law;
  }

  function pruneLegislators() {
    const now = worldNow();
    legislators = legislators.filter(s => !s.expires || s.expires > now);
  }

  function apply() {
    if (!enabled) return;
    pruneLegislators();
    rebuildSources();

    try { for (const s of stars || []) infectObject(s, s.x, s.y, (x, y) => { s.x = x; s.y = y; }, { velocity: true }); } catch (_) {}
    try { for (const g of gyres || []) infectObject(g, g.x, g.y, (x, y) => { g.x = x; g.y = y; }, { velocity: true }); } catch (_) {}
    try { for (const h of daughters || []) infectObject(h, h.x, h.y, (x, y) => { h.x = x; h.y = y; }, { velocity: true }); } catch (_) {}
    try {
      if (love) {
        const law = infectObject(love, love.x, love.y, (x, y, amount) => {
          love.x = x; love.y = y;
          if (Number.isFinite(love.gazeA)) {
            const step = Math.PI / (amount > 0.68 ? 12 : 8);
            const base = 0.05 + amount * 0.08;
            const blend = 1 - Math.pow(1 - base, Math.max(0.1, worldDt()));
            love.gazeA += (Math.round(love.gazeA / step) * step - love.gazeA) * blend;
          }
        });
        love._leafLaw = law;
      }
    } catch (_) {}
    try {
      if (bride && bride.on) infectObject(bride, bride.x, bride.y, (x, y) => { bride.x = x; bride.y = y; }, { velocity: true });
      if (aggressor && aggressor.on) infectObject(aggressor, aggressor.x, aggressor.y, (x, y) => { aggressor.x = x; aggressor.y = y; }, { velocity: true });
    } catch (_) {}
  }

  function drawMark(object, x, y) {
    const law = object && object._leafLaw || 0;
    if (law < 0.26) return;
    const size = 2 + law * 4;
    ctx.strokeStyle = 'rgba(0,200,255,' + (0.08 + law * 0.32) + ')';
    ctx.lineWidth = law > 0.7 ? 1.2 : 0.7;
    ctx.strokeRect(Math.round(x / 4) * 4 - size, Math.round(y / 4) * 4 - size, size * 2, size * 2);
  }

  function draw() {
    if (!visible) return;
    ensureCanvas();
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (!enabled) return;
    try { for (const s of stars || []) drawMark(s, s.x, s.y); } catch (_) {}
    try { for (const g of gyres || []) drawMark(g, g.x, g.y); } catch (_) {}
    try { for (const h of daughters || []) drawMark(h, h.x, h.y); } catch (_) {}
    try { if (love) drawMark(love, love.x, love.y); } catch (_) {}
    try { if (bride && bride.on) drawMark(bride, bride.x, bride.y); } catch (_) {}
    try { if (aggressor && aggressor.on) drawMark(aggressor, aggressor.x, aggressor.y); } catch (_) {}
  }

  function toggle() { enabled = !enabled; savePref(); return enabled; }
  function command() { return toggle(); }

  function addLegislator(source) {
    if (!source || !Number.isFinite(source.x) || !Number.isFinite(source.y)) return;
    legislators.push({
      x: source.x, y: source.y,
      strength: Math.max(0.2, Math.min(1.4, source.strength || 0.7)),
      kind: 'legislation',
      expires: worldNow() + (source.life || 900)
    });
    if (legislators.length > 48) legislators.splice(0, legislators.length - 48);
  }

  const ancestralFrame = frame;
  frame = function () { ancestralFrame(); apply(); };

  function visualLoop() { draw(); requestAnimationFrame(visualLoop); }

  globalThis.LEAF_LAW = {
    officialName: 'Law of Contagion',
    visualChangeName: 'Dormant Sigils',
    chorusName: 'Chorus of Precedent',
    temporalName: 'Temporal Concord',
    doctrineName: 'Silent Doctrine',
    lawfulnessAt,
    addLegislator,
    apply,
    command,
    toggle,
    isEnabled: () => enabled,
    isVisible: () => visible,
    _setDiagnosticVisible(value) {
      visible = !!value;
      if (!visible && canvas && ctx) ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
  };

  requestAnimationFrame(visualLoop);
})();