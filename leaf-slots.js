/* ==========================================================================
   POCKET WORLDS
   Official change name: Pocket Worlds

   SILENT DOCTRINE
   Official change name: Silent Doctrine

   Numbered local slots. `save 1` keeps the present world in slot 1 inside this
   browser; `load 1` opens it. Nothing is uploaded and no file picker appears.
   Successful rites are silent. Only failure speaks.
   ========================================================================== */
(function () {
  'use strict';

  const PREFIX = 'leaf_world_slot_v1_';

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

  function save(argument) {
    const slot = parseSlot(argument);
    if (!slot) {
      say('save 1');
      return false;
    }
    try {
      localStorage.setItem(PREFIX + slot, snapshot());
      return true;
    } catch (_) {
      say('save failed');
      return false;
    }
  }

  function load(argument) {
    const slot = parseSlot(argument);
    if (!slot) {
      say('load 1');
      return false;
    }
    try {
      const world = localStorage.getItem(PREFIX + slot);
      if (!world) {
        say('empty ' + slot);
        return false;
      }
      loadFromText(world);
      return true;
    } catch (_) {
      say('load failed');
      return false;
    }
  }

  function has(argument) {
    const slot = parseSlot(argument);
    if (!slot) return false;
    try { return localStorage.getItem(PREFIX + slot) != null; }
    catch (_) { return false; }
  }

  globalThis.LEAF_SLOTS = {
    officialName: 'Pocket Worlds',
    doctrineName: 'Silent Doctrine',
    save,
    load,
    has
  };
})();
