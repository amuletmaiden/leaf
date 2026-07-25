/* ==========================================================================
   POCKET WORLDS
   Official change name: Pocket Worlds

   DEEP POCKETS
   Official change name: Deep Pockets

   SILENT DOCTRINE
   Official change name: Silent Doctrine

   Numbered local slots. `save 1` keeps the present world in slot 1 inside this
   browser; `load 1` opens it. Full worlds include two PNG memory layers, so the
   slots live in IndexedDB rather than tiny localStorage. Nothing is uploaded and
   no file picker appears. Successful rites are silent. Only failure speaks.
   ========================================================================== */
(function () {
  'use strict';

  const DB_NAME = 'leaf-pocket-worlds';
  const DB_VERSION = 1;
  const STORE = 'worlds';
  const LEGACY_PREFIX = 'leaf_world_slot_v1_';
  let dbPromise = null;
  let queue = Promise.resolve();

  function parseSlot(argument) {
    const word = String(argument || '').trim();
    if (!/^\d{1,2}$/.test(word)) return null;
    const number = Number(word);
    if (!Number.isInteger(number) || number < 1 || number > 99) return null;
    return String(number);
  }

  function say(text) {
    if (typeof notice === 'function') notice(text);
  }

  function openDatabase() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!('indexedDB' in globalThis)) {
        reject(new Error('IndexedDB unavailable'));
        return;
      }
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE);
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error || new Error('database open failed'));
      request.onblocked = () => reject(new Error('database blocked'));
    });
    return dbPromise;
  }

  async function putWorld(slot, world) {
    const db = await openDatabase();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite');
      tx.objectStore(STORE).put(world, slot);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error || new Error('save failed'));
      tx.onabort = () => reject(tx.error || new Error('save aborted'));
    });
  }

  async function getWorld(slot) {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly');
      const request = tx.objectStore(STORE).get(slot);
      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error || new Error('load failed'));
    });
  }

  function enqueue(task) {
    const next = queue.then(task, task);
    queue = next.catch(() => {});
    return next;
  }

  function legacyWorld(slot) {
    try { return localStorage.getItem(LEGACY_PREFIX + slot); }
    catch (_) { return null; }
  }

  function removeLegacy(slot) {
    try { localStorage.removeItem(LEGACY_PREFIX + slot); }
    catch (_) {}
  }

  function save(argument) {
    const slot = parseSlot(argument);
    if (!slot) {
      say('save 1');
      return false;
    }

    let world;
    try {
      world = snapshot();
    } catch (_) {
      say('save failed');
      return false;
    }

    enqueue(async () => {
      try {
        await putWorld(slot, world);
        removeLegacy(slot);
      } catch (_) {
        say('save failed');
      }
    });
    return true;
  }

  function load(argument) {
    const slot = parseSlot(argument);
    if (!slot) {
      say('load 1');
      return false;
    }

    enqueue(async () => {
      try {
        let world = await getWorld(slot);
        if (!world) {
          world = legacyWorld(slot);
          if (world) {
            await putWorld(slot, world);
            removeLegacy(slot);
          }
        }
        if (!world) {
          say('empty ' + slot);
          return;
        }
        loadFromText(world);
      } catch (_) {
        say('load failed');
      }
    });
    return true;
  }

  function has(argument) {
    const slot = parseSlot(argument);
    if (!slot) return Promise.resolve(false);
    return enqueue(async () => {
      try { return !!(await getWorld(slot)) || !!legacyWorld(slot); }
      catch (_) { return false; }
    });
  }

  globalThis.LEAF_SLOTS = {
    officialName: 'Pocket Worlds',
    storageName: 'Deep Pockets',
    doctrineName: 'Silent Doctrine',
    save,
    load,
    has
  };
})();
