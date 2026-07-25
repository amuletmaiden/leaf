/* ==========================================================================
   CLOCK OF POWER
   Official change name: Clock of Power

   PACE is POWER applied to duration. It must advance one world more quickly,
   not create several incompatible worlds whose births, journeys and deaths use
   different clocks.

   The ancestral engine used one rendered frame as its only real step. `pace`
   then modified selected intervals, probabilities and movements independently.
   Motion stopped accelerating at 40, path motion remained tied to screen
   frames, and save/load disagreed about the permitted range.

   Clock of Power keeps the public range 0.1–500. A requested pace above the
   collision-safe step is divided into several hidden world steps. The last step
   alone is painted to the display; persistent world-memory still receives the
   passage. The requested pace is restored between frames, so saves and explicit
   inquiry see the true setting rather than an internal subdivision.
   ========================================================================== */
(function () {
  'use strict';

  const MIN_PACE = 0.1;
  const MAX_PACE = 500;
  const MAX_STEP = 40;
  let requested = Number.isFinite(pace) ? pace : 1;
  let worldClock = Number.isFinite(tick) ? tick : 0;
  let currentStep = requested;
  let hidden = false;

  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  function normalize(value) {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? clamp(n, MIN_PACE, MAX_PACE) : null;
  }
  function set(value) {
    const n = normalize(value);
    if (n == null) return false;
    requested = n;
    pace = n;
    return true;
  }
  function get() { return requested; }
  function step() { return currentStep; }

  /* Probability over elapsed world-time. Repeating a 1% chance forty times is
     not a 40% chance; it is one minus the chance of forty consecutive misses. */
  chance = function (p) {
    p = clamp(Number(p) || 0, 0, 1);
    return 1 - Math.pow(1 - p, Math.max(0, pace));
  };

  /* Path motion belongs to world-time. Texture and visible pulse may still use
     rendered tick; the four great walkers may not lag hundreds of times behind
     the ecology they govern. */
  walker = function (cx, cy, rx, ry, sx, sy, ph) {
    return function () {
      return [
        cx + Math.sin(worldClock * sx + ph) * rx,
        cy + Math.sin(worldClock * sy + ph * 1.7) * ry
      ];
    };
  };
  try { setPaths(); } catch (_) {}

  /* Intermediate steps need state changes but not thirteen complete paintings
     of the same monitor frame. Suppress only the display context. The record
     and silk layers remain writable because their accumulation is world-memory. */
  const gradientStub = { addColorStop() {} };
  const mutedMethods = [
    'clearRect','fillRect','strokeRect','beginPath','closePath','moveTo','lineTo',
    'arc','arcTo','ellipse','rect','quadraticCurveTo','bezierCurveTo','fill','stroke',
    'clip','drawImage','fillText','strokeText','translate','rotate','scale',
    'transform','setTransform','resetTransform','setLineDash'
  ];
  const originals = new Map();
  for (const name of mutedMethods) {
    if (typeof X[name] !== 'function') continue;
    const fn = X[name].bind(X);
    originals.set(name, fn);
    try {
      X[name] = function () {
        if (!hidden) return fn.apply(null, arguments);
      };
    } catch (_) {}
  }
  for (const name of ['createLinearGradient','createRadialGradient','createConicGradient']) {
    if (typeof X[name] !== 'function') continue;
    const fn = X[name].bind(X);
    originals.set(name, fn);
    try {
      X[name] = function () {
        return hidden ? gradientStub : fn.apply(null, arguments);
      };
    } catch (_) {}
  }
  const realSave = typeof X.save === 'function' ? X.save.bind(X) : null;
  const realRestore = typeof X.restore === 'function' ? X.restore.bind(X) : null;
  if (realSave) {
    originals.set('save', realSave);
    try { X.save = function () { if (!hidden) return realSave(); }; } catch (_) {}
  }
  if (realRestore) {
    originals.set('restore', realRestore);
    try { X.restore = function () { if (!hidden) return realRestore(); }; } catch (_) {}
  }

  const worldFrame = frame;
  function oneStep(stepPace, conceal) {
    currentStep = stepPace;
    pace = stepPace;
    worldClock += stepPace;
    hidden = conceal;
    if (conceal && realSave) realSave();
    try { worldFrame(); }
    finally {
      if (conceal && realRestore) realRestore();
      hidden = false;
    }
  }

  runFrame = function () {
    if (inFrame) return;
    inFrame = true;
    try {
      requested = normalize(requested) || 1;
      const parts = requested > 1 ? Math.ceil(requested / MAX_STEP) : 1;
      const stepPace = requested / parts;
      for (let i = 0; i < parts; i++) oneStep(stepPace, document.hidden || i < parts - 1);
    } finally {
      pace = requested;
      currentStep = requested;
      inFrame = false;
    }
    if (!document.hidden) rafId = requestAnimationFrame(runFrame);
  };

  /* Preserve the clock's phase and public pace across every kind of save. */
  const ancestralSnapshot = snapshot;
  snapshot = function () {
    const prior = pace;
    pace = requested;
    try {
      const data = JSON.parse(ancestralSnapshot());
      data.clockOfPower = { pace: requested, worldClock };
      if (data.relations) data.relations.pace = requested;
      return JSON.stringify(data);
    } finally { pace = prior; }
  };

  const ancestralRestore = restore;
  restore = function (json) {
    let saved = null;
    try { saved = JSON.parse(json).clockOfPower || null; } catch (_) {}
    const ok = ancestralRestore(json);
    if (!ok) return false;
    const inherited = saved && Number.isFinite(saved.pace) ? saved.pace : pace;
    set(inherited);
    worldClock = saved && Number.isFinite(saved.worldClock) ? saved.worldClock : tick;
    try { setPaths(); } catch (_) {}
    return true;
  };

  const ancestralReset = resetWorld;
  resetWorld = function () {
    const result = ancestralReset();
    worldClock = 0;
    try { setPaths(); } catch (_) {}
    return result;
  };

  /* Replace the frame already queued by the ancestral boot sequence. */
  try { cancelAnimationFrame(rafId); } catch (_) {}
  if (!document.hidden) rafId = requestAnimationFrame(runFrame);

  globalThis.LEAF_PACE = {
    officialName: 'Clock of Power',
    min: MIN_PACE,
    max: MAX_PACE,
    maxStep: MAX_STEP,
    set,
    get,
    step,
    subdivisions() { return requested > 1 ? Math.ceil(requested / MAX_STEP) : 1; },
    worldClock() { return worldClock; }
  };
})();