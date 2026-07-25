/* ==========================================================================
   VEILED ASCENSION
   Official change name: Veiled Ascension

   SILENT DOCTRINE
   Official change name: Silent Doctrine

   Internal development names never leak into the cult surface. Old goddess-
   stage fossils are removed from local genealogy, and automatic branch/stage
   notices are swallowed. Failures and explicit inquiries may still speak.
   ========================================================================== */
(function () {
  'use strict';

  const GENEALOGY_KEY = 'leaf_genealogy_v1';

  try {
    const state = JSON.parse(localStorage.getItem(GENEALOGY_KEY) || '{}');
    if (state && state.events && typeof state.events === 'object') {
      let changed = false;
      for (const id of Object.keys(state.events)) {
        if (id.indexOf('mind-') === 0) {
          delete state.events[id];
          changed = true;
        }
      }
      if (changed) localStorage.setItem(GENEALOGY_KEY, JSON.stringify(state));
    }
  } catch (_) {}

  if (typeof notice === 'function' && !notice._leafVeiled) {
    const ancestralNotice = notice;
    const veiledNotice = function (text) {
      const message = String(text || '');
      if (message.indexOf('goddess · ') === 0) return;
      if (message.indexOf('a branch remembers · ') === 0) return;
      return ancestralNotice(text);
    };
    veiledNotice._leafVeiled = true;
    try { notice = veiledNotice; } catch (_) { globalThis.notice = veiledNotice; }
  }
})();
