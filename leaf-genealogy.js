/* ==========================================================================
   FOSSIL ORCHARD
   Official change name: Fossil Orchard

   The record layer remembers by sediment. Fossil Orchard gives that memory a
   readable shape: the first time a relation becomes true, the world grows one
   permanent branch. The orchard is local to this browser and never transmitted.
   ========================================================================== */
(function () {
  'use strict';

  const KEY = 'leaf_genealogy_v1';
  const COLORS = {
    red: '#ff0000', green: '#00ff00', pink: '#ff00ff', blue: '#00c8ff',
    gold: '#ffd700', violet: '#8a5cff', grey: '#7a8496', white: '#e8f4ff'
  };

  const EVENTS = [
    { id: 'law-awakens', parent: null, label: 'law awakens', color: COLORS.blue,
      test: () => temple && temple.pts && temple.pts.length >= 12 },
    { id: 'ice-born', parent: 'law-awakens', label: 'ice is born', color: '#73f5ff',
      test: () => temple && temple.pts && temple.pts.some(p => p.kind === 'ice') },
    { id: 'stars-kindled', parent: null, label: 'stars are kindled', color: COLORS.gold,
      test: () => stars && stars.length > 0 },
    { id: 'first-fall', parent: 'stars-kindled', label: 'a star falls', color: '#ffb321',
      test: () => fallers && fallers.length > 0 },
    { id: 'gyre-multiplies', parent: null, label: 'the turning multiplies', color: COLORS.pink,
      test: () => gyres && gyres.length > 1 },
    { id: 'hearts-multiply', parent: null, label: 'heart becomes daughters', color: COLORS.red,
      test: () => daughters && daughters.length > 0 },
    { id: 'love-wears-law', parent: 'ice-born', label: 'love wears law', color: COLORS.green,
      test: () => love && Array.isArray(love.skirt) && love.skirt.length > 0 },
    { id: 'kept-light', parent: 'ice-born', label: 'law keeps light', color: COLORS.gold,
      test: () => embers && embers.some(e => e.kind === 'star') },
    { id: 'zettaitsune-arrives', parent: 'love-wears-law', label: 'zettaitsune arrives', color: COLORS.green,
      test: () => bride && bride.on },
    { id: 'aggression-arrives', parent: 'hearts-multiply', label: 'aggression arrives', color: '#ff5a35',
      test: () => aggressor && aggressor.on },
    { id: 'arrivals-meet', parent: 'zettaitsune-arrives', label: 'the arrivals meet', color: COLORS.violet,
      test: () => bride && aggressor && bride.on && aggressor.on &&
        Math.hypot((bride.x || 0) - (aggressor.x || 0), (bride.y || 0) - (aggressor.y || 0)) < 150 },
    { id: 'petrification', parent: 'gyre-multiplies', label: 'turning becomes stone', color: COLORS.blue,
      test: () => typeof petrifying !== 'undefined' && !!petrifying }
  ];

  let state = load();
  let canvas = null;
  let ctx = null;
  let open = false;
  let pulse = 0;

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (!parsed || typeof parsed !== 'object') return { events: {} };
      if (!parsed.events || typeof parsed.events !== 'object') parsed.events = {};
      return parsed;
    } catch (_) {
      return { events: {} };
    }
  }

  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }

  function currentSeed() {
    try { return typeof seedName === 'string' ? seedName : ''; } catch (_) { return ''; }
  }

  function currentTick() {
    try { return Number.isFinite(tick) ? tick : 0; } catch (_) { return 0; }
  }

  function remember(id, detail) {
    if (!id || state.events[id]) return false;
    const def = EVENTS.find(e => e.id === id);
    state.events[id] = {
      id,
      label: (detail && detail.label) || (def && def.label) || id,
      color: (detail && detail.color) || (def && def.color) || COLORS.white,
      parent: (detail && detail.parent) || (def && def.parent) || null,
      tick: currentTick(),
      at: Date.now(),
      seed: currentSeed()
    };
    save();
    pulse = 1;
    if (typeof notice === 'function') notice('a branch remembers · ' + state.events[id].label);
    if (open) draw();
    return true;
  }

  function scan() {
    for (const def of EVENTS) {
      if (state.events[def.id]) continue;
      try { if (def.test()) remember(def.id); } catch (_) {}
    }
  }

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement('canvas');
    canvas.id = 'leaf-fossil-orchard';
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;display:none;z-index:25;pointer-events:none;background:rgba(0,0,0,.88)';
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
    if (open) draw();
  }

  function layout(nodes) {
    const byDepth = new Map();
    const map = new Map(nodes.map(n => [n.id, n]));
    function depth(n, seen) {
      if (!n.parent || !map.has(n.parent)) return 0;
      if (seen.has(n.id)) return 0;
      seen.add(n.id);
      return 1 + depth(map.get(n.parent), seen);
    }
    for (const n of nodes) {
      const d = depth(n, new Set());
      if (!byDepth.has(d)) byDepth.set(d, []);
      byDepth.get(d).push(n);
    }
    const w = innerWidth, h = innerHeight;
    const top = 118, bottom = h - 92;
    const depths = [...byDepth.keys()].sort((a, b) => a - b);
    const maxDepth = Math.max(1, ...depths);
    const positions = new Map();
    for (const d of depths) {
      const row = byDepth.get(d).sort((a, b) => a.at - b.at);
      row.forEach((n, i) => {
        const x = 80 + (w - 160) * ((i + 1) / (row.length + 1));
        const y = bottom - (bottom - top) * (d / maxDepth);
        positions.set(n.id, { x, y });
      });
    }
    return positions;
  }

  function draw() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = 'rgba(0,0,0,.90)';
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    const nodes = Object.values(state.events).sort((a, b) => a.at - b.at);
    const pos = layout(nodes);

    ctx.font = '11px "Courier New",monospace';
    ctx.textAlign = 'left';
    ctx.fillStyle = '#00c8ff';
    ctx.fillText('FOSSIL ORCHARD', 18, 28);
    ctx.fillStyle = '#596574';
    ctx.fillText('the first occurrence becomes a permanent branch · ` or escape closes', 18, 48);

    if (!nodes.length) {
      ctx.fillStyle = '#7a8496';
      ctx.fillText('the world has not yet named a first relation', 18, 84);
      return;
    }

    ctx.lineWidth = 1;
    for (const n of nodes) {
      const p = pos.get(n.id);
      if (!p || !n.parent || !pos.has(n.parent)) continue;
      const q = pos.get(n.parent);
      ctx.strokeStyle = 'rgba(130,180,195,.28)';
      ctx.beginPath();
      ctx.moveTo(q.x, q.y);
      const mid = (q.y + p.y) / 2;
      ctx.bezierCurveTo(q.x, mid, p.x, mid, p.x, p.y);
      ctx.stroke();
    }

    const now = Date.now();
    for (const n of nodes) {
      const p = pos.get(n.id);
      if (!p) continue;
      const recent = Math.max(0, 1 - (now - n.at) / 5000);
      const radius = 4.5 + recent * 5 + pulse * 1.5;
      ctx.shadowColor = n.color;
      ctx.shadowBlur = 12 + recent * 18;
      ctx.fillStyle = n.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#c7d1dd';
      ctx.fillText(n.label, p.x + 10, p.y + 4);
    }
  }

  function toggle(force) {
    ensureCanvas();
    open = typeof force === 'boolean' ? force : !open;
    canvas.style.display = open ? 'block' : 'none';
    if (open) draw();
    return open;
  }

  function close() { return toggle(false); }
  function isOpen() { return open; }

  function clear() {
    state = { events: {} };
    save();
    if (open) draw();
  }

  globalThis.LEAF_GENEALOGY = {
    officialName: 'Fossil Orchard',
    remember,
    toggle,
    close,
    isOpen,
    clear,
    events: () => ({ ...state.events })
  };

  setInterval(scan, 1400);
  setInterval(function () {
    if (!open) return;
    pulse *= 0.84;
    draw();
  }, 120);
  setTimeout(scan, 500);
})();
