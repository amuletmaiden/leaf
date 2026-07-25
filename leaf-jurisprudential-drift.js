/* ==========================================================================
   JURISPRUDENTIAL DRIFT
   Official change name: Jurisprudential Drift

   Law used to travel on a seeded Lissajous curve: two unrelated sine waves.
   That was a visual itinerary, not a law. In a metaphysics simulator the rule
   governing LAW's own motion must itself say something true.

   The new rule:
   - the apparent law origin is continually recentered on the settled body of
     law without moving that body in world-space;
   - the whole body then drifts toward the shared barycentre of HEART, LOVE,
     POWER, stars, and what law has kept;
   - accumulated law is inertia. The more rule exists, the harder it is to move.

   TEMPLE therefore moves as gravity and jurisprudence should: because existing
   things have weight together, and because established law resists revision.
   There is no hidden decorative orbit and no random wandering term.
   ========================================================================== */
(function () {
  'use strict';

  let naturalTemple = pTemple;
  const first = naturalTemple();
  const state = { x: first[0], y: first[1], vx: 0, vy: 0, lastTick: -1 };

  function finite(n, fallback) { return Number.isFinite(n) ? n : fallback; }

  function settledLawMass() {
    try {
      let mass = 0;
      for (const p of temple.pts || []) {
        if (!p || p.hermetic) continue;
        const settled = p.set == null ? 1 : Math.max(0, Math.min(1, p.set));
        mass += (p.kind === 'ice' ? 1.35 : 1) * (0.25 + 0.75 * settled);
      }
      return mass;
    } catch (_) { return 0; }
  }

  function recenterCoordinates() {
    let sx = 0, sy = 0, sw = 0;
    try {
      for (const p of temple.pts || []) {
        if (!p || p.hermetic) continue;
        const settled = p.set == null ? 1 : Math.max(0, Math.min(1, p.set));
        const w = (p.kind === 'ice' ? 1.35 : 1) * (0.2 + 0.8 * settled);
        sx += p.x * w; sy += p.y * w; sw += w;
      }
    } catch (_) { return; }
    if (sw < 1) return;

    const cx = sx / sw, cy = sy / sw;
    const reach = Math.hypot(cx, cy);
    if (reach < 0.25) return;

    /* Recenter gently. Moving the origin and subtracting the same displacement
       from every relative resident preserves every visible world position. */
    const amount = Math.min(1, 0.08 + reach / 900);
    const dx = cx * amount, dy = cy * amount;
    state.x += dx; state.y += dy;

    try { for (const p of temple.pts || []) { p.x -= dx; p.y -= dy; } } catch (_) {}
    try { for (const e of embers || []) { e.x -= dx; e.y -= dy; } } catch (_) {}
    try {
      if (typeof rebuildTempleGrid === 'function') rebuildTempleGrid();
    } catch (_) {}
  }

  function addBody(sum, x, y, weight) {
    if (!Number.isFinite(x) || !Number.isFinite(y) || !(weight > 0)) return;
    sum.x += x * weight;
    sum.y += y * weight;
    sum.w += weight;
  }

  function sharedBarycentre(lawMass) {
    const sum = { x: 0, y: 0, w: 0 };

    /* Law counts itself heavily. This is not a pull toward the screen centre;
       it is inertia represented inside the same barycentric equation. */
    addBody(sum, state.x, state.y, 14 + Math.sqrt(lawMass + 1) * 4.2);

    try {
      const h = pHeart();
      const heartWeight = 4 + Math.min(4, (daughters || []).length * 0.8) +
        Math.min(3, (heart.sparks || []).length / 80);
      addBody(sum, h[0], h[1], heartWeight);
    } catch (_) {}

    try { addBody(sum, love.x, love.y, 4.2); } catch (_) {}

    try {
      for (const g of gyres || []) {
        const w = 2.2 + finite(g.energy, 1) * finite(g.scale, 1) * 3.2;
        addBody(sum, g.x, g.y, w);
      }
    } catch (_) {}

    try {
      for (const e of embers || []) {
        const w = e.kind === 'goddess' ? 0.9 : e.kind === 'star' ? 0.55 : 0.4;
        addBody(sum, state.x + e.x, state.y + e.y, w);
      }
    } catch (_) {}

    /* The sky participates as a population, not as thousands of individual
       equal votes. Sample it, find its mass-centre, then give the whole sky one
       bounded weight so a crowded sky cannot drag law bodily off-screen. */
    try {
      const population = stars || [];
      if (population.length) {
        const stride = Math.max(1, Math.floor(population.length / 96));
        let sx = 0, sy = 0, sm = 0;
        for (let i = 0; i < population.length; i += stride) {
          const s = population[i], m = Math.max(0.2, finite(s.mass, 1));
          sx += s.x * m; sy += s.y * m; sm += m;
        }
        if (sm > 0) addBody(sum, sx / sm, sy / sm, Math.min(8, 0.65 + Math.sqrt(population.length) * 0.16));
      }
    } catch (_) {}

    return sum.w > 0 ? { x: sum.x / sum.w, y: sum.y / sum.w } : { x: state.x, y: state.y };
  }

  function step() {
    const now = Number.isFinite(tick) ? tick : state.lastTick + 1;
    if (now === state.lastTick) return;
    state.lastTick = now;

    if (now % 120 === 0) recenterCoordinates();

    const lawMass = settledLawMass();
    const target = sharedBarycentre(lawMass);
    const dt = Math.max(0.35, Math.min(5, Math.sqrt(Math.max(0.1, finite(pace, 1)))));
    const inertia = 1 + Math.sqrt(lawMass + 1) * 0.085;
    const gain = 0.000006 / inertia;

    state.vx += (target.x - state.x) * gain * dt;
    state.vy += (target.y - state.y) * gain * dt;

    /* The horizon is a soft constitutional boundary, not a collision wall. */
    const mx = W * 0.08, my = H * 0.08;
    if (state.x < mx) state.vx += (mx - state.x) * 0.000012 * dt;
    if (state.x > W - mx) state.vx -= (state.x - (W - mx)) * 0.000012 * dt;
    if (state.y < my) state.vy += (my - state.y) * 0.000012 * dt;
    if (state.y > H - my) state.vy -= (state.y - (H - my)) * 0.000012 * dt;

    const drag = Math.pow(0.994, dt);
    state.vx *= drag; state.vy *= drag;
    const speed = Math.hypot(state.vx, state.vy), limit = 0.24;
    if (speed > limit) { state.vx *= limit / speed; state.vy *= limit / speed; }

    state.x += state.vx * dt;
    state.y += state.vy * dt;
  }

  function jurisprudentialTemple() {
    step();
    return [state.x, state.y];
  }

  const ancestralSetPaths = setPaths;
  setPaths = function () {
    ancestralSetPaths();
    naturalTemple = pTemple;
    pTemple = jurisprudentialTemple;
  };
  pTemple = jurisprudentialTemple;

  const ancestralSnapshot = snapshot;
  snapshot = function () {
    const data = JSON.parse(ancestralSnapshot());
    data.jurisprudence = { x: state.x, y: state.y, vx: state.vx, vy: state.vy };
    return JSON.stringify(data);
  };

  const ancestralRestore = restore;
  restore = function (json) {
    let saved = null;
    try { saved = JSON.parse(json).jurisprudence || null; } catch (_) {}
    const ok = ancestralRestore(json);
    if (!ok) return false;
    if (saved && Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      state.x = saved.x; state.y = saved.y;
      state.vx = finite(saved.vx, 0); state.vy = finite(saved.vy, 0);
    } else {
      const p = naturalTemple();
      state.x = p[0]; state.y = p[1]; state.vx = 0; state.vy = 0;
    }
    state.lastTick = -1;
    pTemple = jurisprudentialTemple;
    return true;
  };

  const ancestralResetWithSeed = resetWithSeed;
  resetWithSeed = function (name) {
    const result = ancestralResetWithSeed(name);
    const p = naturalTemple();
    state.x = p[0]; state.y = p[1]; state.vx = 0; state.vy = 0; state.lastTick = -1;
    pTemple = jurisprudentialTemple;
    return result;
  };

  globalThis.LEAF_JURISPRUDENCE = {
    officialName: 'Jurisprudential Drift',
    position: () => ({ x: state.x, y: state.y }),
    velocity: () => ({ x: state.vx, y: state.vy }),
    lawMass: settledLawMass,
    rule: 'shared barycentre divided by accumulated-law inertia'
  };
})();