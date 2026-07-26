/* ==========================================================================
   STAR TEMPERANCE
   Official change name: Star Temperance

   The upper tail remains continuous, but the largest stars become markedly
   rarer and slightly less enormous. Existing stars are not rewritten; the
   changed law governs new stars.

   ZETTAITSUNE QUATRAIN
   Official change name: Zettaitsune Quatrain

   Her visible name is GREEN · BLUE · GREEN · BLUE: zet / tai / tsu / ne.
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
        '<span style="color:#00ff00">tsu</span>' +
        '<span style="color:#00c8ff">ne</span>';
    }
  } catch (_) {}

  globalThis.LEAF_STAR_TEMPERANCE = {
    officialName: 'Star Temperance',
    zettaitsuneName: 'Zettaitsune Quatrain'
  };
})();
