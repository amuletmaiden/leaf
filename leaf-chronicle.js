/* ==========================================================================
   CHRONICLE LOOM
   Official change name: Chronicle Loom

   Significant consequences become a durable local chronicle. The chronicle is
   silent in the world and readable in Council Ledger. It records events, not
   every particle, and keeps small visual plates only for important passages.
   ========================================================================== */
(function () {
  'use strict';

  const KEY = 'leaf_chronicle_v1';
  const DB_NAME = 'leaf-chronicle';
  const DB_VERSION = 1;
  const PLATES = 'plates';
  const MAX_EVENTS = 1200;
  const MAX_PLATES = 48;
  const COLORS = {
    red: '#ff0000', green: '#00ff00', pink: '#ff00ff', blue: '#00c8ff',
    gold: '#ffff00', ice: '#b8ffff', violet: '#8a5cff', grey: '#7a8496'
  };

  function load() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (!parsed || typeof parsed !== 'object') return { version: 1, seq: 0, events: [], keys: {} };
      if (!Array.isArray(parsed.events)) parsed.events = [];
      if (!parsed.keys || typeof parsed.keys !== 'object') parsed.keys = {};
      parsed.seq = Number.isFinite(parsed.seq) ? parsed.seq : parsed.events.length;
      parsed.version = 1;
      return parsed;
    } catch (_) {
      return { version: 1, seq: 0, events: [], keys: {} };
    }
  }

  let state = load();
  let dbPromise = null;
  let capturePending = false;
  let lastPlateAt = 0;
  let baseline = null;

  const worldNow = () => {
    try { return globalThis.LEAF_PACE ? LEAF_PACE.worldClock() : (Number.isFinite(tick) ? tick : 0); }
    catch (_) { return 0; }
  };
  const seedNow = () => {
    try { return typeof seedName === 'string' && seedName ? seedName : 'unnamed'; }
    catch (_) { return 'unnamed'; }
  };
  const paceNow = () => {
    try { return globalThis.LEAF_PACE ? LEAF_PACE.get() : (Number.isFinite(pace) ? pace : 1); }
    catch (_) { return 1; }
  };

  function persist() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (_) {}
  }

  function trimEvents() {
    while (state.events.length > MAX_EVENTS) {
      let index = state.events.findIndex(e => (e.importance || 1) <= 1);
      if (index < 0) index = 0;
      state.events.splice(index, 1);
    }
  }

  function openDatabase() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in globalThis)) return reject(new Error('IndexedDB unavailable'));
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(PLATES)) {
          const store = db.createObjectStore(PLATES, { keyPath: 'id' });
          store.createIndex('at', 'at');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('chronicle database failed'));
    });
    return dbPromise;
  }

  async function storePlate(plate) {
    try {
      const db = await openDatabase();
      await new Promise((resolve, reject) => {
        const tx = db.transaction(PLATES, 'readwrite');
        tx.objectStore(PLATES).put(plate);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error || new Error('plate write failed'));
      });
      const all = await new Promise((resolve, reject) => {
        const tx = db.transaction(PLATES, 'readonly');
        const request = tx.objectStore(PLATES).getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
      if (all.length <= MAX_PLATES) return;
      all.sort((a, b) => a.at - b.at);
      const remove = all.slice(0, all.length - MAX_PLATES);
      await new Promise((resolve, reject) => {
        const tx = db.transaction(PLATES, 'readwrite');
        const store = tx.objectStore(PLATES);
        for (const p of remove) store.delete(p.id);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch (_) {}
  }

  function capturePlate(event) {
    if (capturePending || document.hidden || Date.now() - lastPlateAt < 1800) return;
    capturePending = true;
    const run = () => {
      requestAnimationFrame(() => {
        try {
          if (!cv || !cv.width || !cv.height) return;
          const plate = document.createElement('canvas');
          plate.width = 240; plate.height = 135;
          const x = plate.getContext('2d');
          x.fillStyle = '#000'; x.fillRect(0, 0, plate.width, plate.height);
          const scale = Math.min(plate.width / cv.width, plate.height / cv.height);
          const w = cv.width * scale, h = cv.height * scale;
          x.drawImage(cv, (plate.width - w) / 2, (plate.height - h) / 2, w, h);
          plate.toBlob(blob => {
            if (!blob) return;
            lastPlateAt = Date.now();
            storePlate({
              id: event.id,
              eventId: event.id,
              at: event.at,
              world: event.world,
              seed: event.seed,
              label: event.label,
              color: event.color,
              blob
            });
          }, 'image/webp', 0.72);
        } catch (_) {
        } finally {
          capturePending = false;
        }
      });
    };
    if ('requestIdleCallback' in globalThis) requestIdleCallback(run, { timeout: 1200 });
    else setTimeout(run, 120);
  }

  function record(kind, label, color, detail) {
    detail = detail || {};
    const key = detail.key || null;
    if (key && state.keys[key]) return false;
    const event = {
      id: 'c' + (++state.seq).toString(36) + '-' + Date.now().toString(36),
      kind: String(kind || 'world'),
      label: String(label || kind || 'event'),
      color: color || COLORS.grey,
      seed: detail.seed || seedNow(),
      world: Number.isFinite(detail.world) ? detail.world : Math.round(worldNow() * 100) / 100,
      at: Number.isFinite(detail.at) ? detail.at : Date.now(),
      importance: Math.max(1, Math.min(4, Number(detail.importance) || 1)),
      key,
      data: detail.data && typeof detail.data === 'object' ? detail.data : undefined
    };
    state.events.push(event);
    if (key) state.keys[key] = event.id;
    trimEvents();
    persist();
    try { dispatchEvent(new CustomEvent('leaf-chronicle', { detail: event })); } catch (_) {}
    if (detail.plate || event.importance >= 3) capturePlate(event);
    return event;
  }

  function importOrchard() {
    try {
      if (!globalThis.LEAF_GENEALOGY) return;
      const events = LEAF_GENEALOGY.events();
      for (const e of Object.values(events || {})) {
        record('relation', e.label, e.color, {
          key: 'fossil:' + e.id,
          seed: e.seed,
          world: e.tick,
          at: e.at,
          importance: 2,
          data: { parent: e.parent || null, fossil: e.id }
        });
      }
    } catch (_) {}
  }

  function counts() {
    let eater = {}, scavenger = {};
    try {
      if (globalThis.LEAF_NEW_GODDESSES) {
        eater = LEAF_NEW_GODDESSES.eater() || {};
        scavenger = LEAF_NEW_GODDESSES.scavenger() || {};
      }
    } catch (_) {}
    const pts = temple && Array.isArray(temple.pts) ? temple.pts : [];
    const kept = Array.isArray(embers) ? embers : [];
    return {
      seed: seedNow(), world: worldNow(), pace: paceNow(),
      law: pts.filter(p => p.kind !== 'ice').length,
      ice: pts.filter(p => p.kind === 'ice').length,
      stars: Array.isArray(stars) ? stars.length : 0,
      daughters: Array.isArray(daughters) ? daughters.length : 0,
      gyres: Array.isArray(gyres) ? gyres.length : 0,
      goddesses: kept.filter(e => e.kind === 'goddess').length,
      ahika: kept.filter(e => e.kind === 'star').length,
      bride: !!(bride && bride.on),
      aggression: !!(aggressor && aggressor.on),
      eater: !!eater.on,
      eaten: Number(eater.eaten) || 0,
      scavenger: !!scavenger.on,
      gathered: Number(scavenger.gathered) || 0,
      lawEnabled: !globalThis.LEAF_LAW || LEAF_LAW.isEnabled()
    };
  }

  const MILESTONES = {
    law: [12, 50, 150, 300, 600],
    ice: [1, 12, 30, 60, 120],
    stars: [1, 8, 24, 64, 128],
    daughters: [1, 3, 5],
    gyres: [2, 3, 4],
    goddesses: [1, 3, 6],
    ahika: [1, 4, 8]
  };
  const META = {
    law: ['law', COLORS.blue], ice: ['ice', COLORS.ice], stars: ['stars', COLORS.gold],
    daughters: ['hearts', COLORS.red], gyres: ['turnings', COLORS.pink],
    goddesses: ['law-clothed goddesses', COLORS.violet], ahika: ['kept lights', COLORS.gold]
  };

  function milestones(before, now) {
    for (const [name, marks] of Object.entries(MILESTONES)) {
      for (const mark of marks) {
        if (before[name] < mark && now[name] >= mark) {
          const [noun, color] = META[name];
          record('milestone', mark + ' ' + noun, color, {
            key: 'milestone:' + now.seed + ':' + name + ':' + mark,
            importance: mark === marks[0] ? 2 : 1,
            plate: mark === marks[0] || mark === marks[marks.length - 1],
            data: { measure: name, value: mark }
          });
        }
      }
    }
  }

  function transition(before, now, key, kind, labelOn, labelOff, color, importance) {
    if (!before[key] && now[key]) record(kind, labelOn, color, { importance, plate: importance >= 3 });
    if (before[key] && !now[key]) record(kind, labelOff, color, { importance: Math.max(1, importance - 1) });
  }

  function observe() {
    const now = counts();
    if (!baseline) { baseline = now; return; }

    if (now.seed !== baseline.seed || now.world + 1 < baseline.world) {
      record('world', 'a world begins', COLORS.red, { importance: 3, plate: true, data: { previous: baseline.seed } });
      baseline = now;
      return;
    }

    milestones(baseline, now);
    transition(baseline, now, 'bride', 'arrival', 'zettaitsune stands', 'zettaitsune departs', COLORS.green, 3);
    transition(baseline, now, 'aggression', 'arrival', 'aggression stands', 'aggression departs', COLORS.red, 3);
    transition(baseline, now, 'eater', 'ecology', 'retrograde hunger enters', 'retrograde hunger passes', COLORS.pink, 3);
    transition(baseline, now, 'scavenger', 'ecology', "the scavenger's hem enters", "the scavenger's hem passes", COLORS.green, 3);

    if (now.eaten > baseline.eaten) {
      for (let i = baseline.eaten + 1; i <= now.eaten; i++) {
        record('ecology', 'a great star is eaten', COLORS.pink, { importance: i === 1 ? 3 : 2, plate: i === 1, data: { eaten: i } });
      }
    }
    const gatherMarks = [1, 5, 12, 26];
    for (const mark of gatherMarks) {
      if (baseline.gathered < mark && now.gathered >= mark) {
        record('ecology', mark + ' remnants enter the hem', COLORS.green, {
          key: 'hem:' + now.seed + ':' + mark,
          importance: mark === 1 ? 2 : 1,
          data: { gathered: mark }
        });
      }
    }
    if (now.pace !== baseline.pace) {
      record('pace', 'pace becomes ' + now.pace, COLORS.pink, { importance: 1, data: { from: baseline.pace, to: now.pace } });
    }
    if (now.lawEnabled !== baseline.lawEnabled) {
      record('law', now.lawEnabled ? 'contagious law wakes' : 'contagious law sleeps', COLORS.blue, { importance: 2 });
    }
    baseline = now;
  }

  function events() { return state.events.slice(); }
  function summary() {
    const kinds = {};
    for (const e of state.events) kinds[e.kind] = (kinds[e.kind] || 0) + 1;
    return { count: state.events.length, kinds, first: state.events[0] || null, last: state.events[state.events.length - 1] || null };
  }

  importOrchard();
  baseline = counts();
  const ancestralFrame = frame;
  frame = function () { ancestralFrame(); observe(); };

  globalThis.LEAF_CHRONICLE = {
    officialName: 'Chronicle Loom',
    plateName: 'Memory Plates',
    record,
    events,
    summary,
    observe,
    colors: { ...COLORS }
  };
})();