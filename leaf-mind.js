/* ==========================================================================
   LEGISLATIVE LADDER
   Official change name: Legislative Ladder

   VEILED ASCENSION
   Official change name: Veiled Ascension

   TEMPORAL CONCORD
   Official change name: Temporal Concord

   A goddess does not receive a generic intelligence score. Accumulated law in
   her skirt changes the kind of mind she is capable of. Those stages remain
   entirely internal: no notices, help entries, genealogy labels, or public
   readouts announce them. The initiate learns only from changed behaviour.
   ========================================================================== */
(function () {
  'use strict';

  const STAGES = [
    { name: 'impulse', min: 0 },
    { name: 'tropism', min: 2 },
    { name: 'memory', min: 5 },
    { name: 'anticipation', min: 9 },
    { name: 'legislation', min: 14 }
  ];

  const worldNow = () => {
    try { return globalThis.LEAF_PACE ? LEAF_PACE.worldClock() : (typeof tick === 'number' ? tick : 0); }
    catch (_) { return typeof tick === 'number' ? tick : 0; }
  };
  const worldDt = () => {
    try { return globalThis.LEAF_PACE ? LEAF_PACE.step() : Math.max(0.1, pace); }
    catch (_) { return 1; }
  };

  function stageFor(goddess) {
    const skirt = Array.isArray(goddess.skirt) ? goddess.skirt.length : 0;
    let stage = 0;
    for (let i = 1; i < STAGES.length; i++) if (skirt >= STAGES[i].min) stage = i;
    return stage;
  }

  function ensureMind(goddess) {
    if (!goddess._leafMind || typeof goddess._leafMind !== 'object') {
      goddess._leafMind = { stage: 0, memories: [], target: null, lawGiven: 0, born: worldNow() };
    }
    if (!Array.isArray(goddess._leafMind.memories)) goddess._leafMind.memories = [];
    return goddess._leafMind;
  }

  function worldPosition(goddess) {
    try {
      const origin = pTemple();
      return [origin[0] + (goddess.x || 0), origin[1] + (goddess.y || 0), origin];
    } catch (_) {
      return [goddess.x || 0, goddess.y || 0, [0, 0]];
    }
  }

  function nearestLaw(x, y, memories) {
    let best = null, bestD = Infinity;
    try {
      const origin = pTemple();
      const pts = temple && Array.isArray(temple.pts) ? temple.pts : [];
      const stride = Math.max(1, Math.floor(pts.length / 260));
      const now = worldNow();
      for (let i = 0; i < pts.length; i += stride) {
        const p = pts[i];
        if (!p || p.hermetic) continue;
        const wx = origin[0] + p.x, wy = origin[1] + p.y;
        const key = Math.round(wx / 24) + ':' + Math.round(wy / 24);
        if (memories && memories.some(m => m.key === key && now - m.tick < 1800)) continue;
        const d = (wx - x) ** 2 + (wy - y) ** 2;
        if (d < bestD) { bestD = d; best = { x: wx, y: wy, key }; }
      }
    } catch (_) {}
    return best;
  }

  function drift(goddess, origin, tx, ty, speed) {
    const wx = origin[0] + (goddess.x || 0);
    const wy = origin[1] + (goddess.y || 0);
    const dx = tx - wx, dy = ty - wy;
    const d = Math.hypot(dx, dy) || 1;
    const amount = Math.min(d, speed * Math.max(0.1, worldDt()));
    goddess.x = (goddess.x || 0) + dx / d * amount;
    goddess.y = (goddess.y || 0) + dy / d * amount;
  }

  function rememberContact(mind, point) {
    if (!point) return;
    const now = worldNow();
    const existing = mind.memories.find(m => m.key === point.key);
    if (existing) existing.tick = now;
    else mind.memories.push({ key: point.key, x: point.x, y: point.y, tick: now });
    if (mind.memories.length > 12) mind.memories.splice(0, mind.memories.length - 12);
  }

  function updateGoddess(goddess, index) {
    if (!goddess || typeof goddess !== 'object' || goddess.kind !== 'goddess') return;
    const mind = ensureMind(goddess);
    const nextStage = stageFor(goddess);
    if (nextStage !== mind.stage) { mind.stage = nextStage; mind.stageAt = worldNow(); }

    const [wx, wy, origin] = worldPosition(goddess);

    if (mind.stage >= 1) {
      const target = nearestLaw(wx, wy, mind.stage >= 2 ? mind.memories : null);
      if (target) {
        mind.target = target;
        drift(goddess, origin, target.x, target.y, 0.018 + mind.stage * 0.006);
        if (Math.hypot(target.x - wx, target.y - wy) < 34 && mind.stage >= 2) rememberContact(mind, target);
      }
    }

    if (mind.stage >= 3) {
      try {
        const ahead = 42 + mind.stage * 18;
        const vx = Number.isFinite(love.hitVx) ? love.hitVx : 0;
        const vy = Number.isFinite(love.hitVy) ? love.hitVy : 0;
        const tx = love.x + vx * ahead + Math.cos(love.gazeA || 0) * 26;
        const ty = love.y + vy * ahead + Math.sin(love.gazeA || 0) * 26;
        drift(goddess, origin, tx, ty, 0.008 + mind.stage * 0.003);
        mind.anticipated = { x: tx, y: ty, tick: worldNow() };
      } catch (_) {}
    }

    if (mind.stage >= 4 && globalThis.LEAF_LAW) {
      const now = worldNow();
      if (!mind.nextLegislation || now >= mind.nextLegislation) {
        LEAF_LAW.addLegislator({
          x: wx,
          y: wy,
          strength: 0.58 + Math.min(0.42, (goddess.skirt || []).length * 0.025),
          life: 900 + index * 17
        });
        mind.lawGiven = (mind.lawGiven || 0) + 1;
        mind.nextLegislation = now + 260 + (index * 31 % 140);
      }
    }
  }

  function update() {
    try {
      if (!Array.isArray(embers)) return;
      for (let i = 0; i < embers.length; i++) updateGoddess(embers[i], i);
    } catch (_) {}
  }

  const ancestralFrame = frame;
  frame = function () { ancestralFrame(); update(); };

  globalThis.LEAF_MIND = {
    officialName: 'Legislative Ladder',
    veilName: 'Veiled Ascension',
    temporalName: 'Temporal Concord'
  };
})();