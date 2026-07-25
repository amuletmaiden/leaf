/* ==========================================================================
   STAR TEMPERANCE
   Official change name: Star Temperance

   The upper tail remains continuous, but the largest stars become markedly
   rarer and slightly less enormous. Existing stars are not rewritten; the
   changed law governs new stars.

   ZETTAITSUNE TRINE
   Official change name: Zettaitsune Trine

   Her spoken name is GREEN · BLUE · GREEN: zet / tai / tsune.
   ========================================================================== */
(function () {
  'use strict';

  try {
    if (typeof TUNE !== 'undefined') {
      TUNE.STAR_SZ_MAX = 3.10;
      TUNE.STAR_SZ_ALPHA = 1.90;
    }
  } catch (_) {}

  try {
    if (typeof ARRIVAL_NAMES !== 'undefined' && ARRIVAL_NAMES.bride) {
      ARRIVAL_NAMES.bride.label =
        '<span style="color:#00ff00">zet</span>' +
        '<span style="color:#00c8ff">tai</span>' +
        '<span style="color:#00ff00">tsune</span>';
    }
  } catch (_) {}

  globalThis.LEAF_STAR_TEMPERANCE = {
    officialName: 'Star Temperance',
    zettaitsuneName: 'Zettaitsune Trine'
  };
})();