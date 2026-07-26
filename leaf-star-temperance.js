/* ==========================================================================
   STAR TEMPERANCE
   Official change name: Star Temperance

   The upper tail remains continuous, but the largest stars stay comfortably
   point-like rather than blooming into yellow splotches. Existing stars keep
   their physical mass, while their drawn size is gently capped as well.

   ZETTAITSUNE QUATRAIN
   Official change name: Zettaitsune Quatrain

   Her visible name is GREEN · BLUE · GREEN · BLUE: zet / tai / tsu / ne.
   ========================================================================== */
(function () {
  'use strict';

  try {
    if (typeof TUNE !== 'undefined') {
      TUNE.STAR_SZ_MAX = 2.25;
      TUNE.STAR_SZ_ALPHA = 2.40;
    }
  } catch (_) {}

  /* Old saves may contain stars from before Star Temperance. Their mass still
     matters to the simulation, but no light needs to be drawn as a large,
     solid yellow disc. Temporarily cap only the presentation value while the
     original renderer runs, then restore it before physics or saving sees it. */
  try {
    const drawStars = globalThis.drawStars;
    const renderSizeCap = 1.85;
    if (typeof drawStars === 'function' && Array.isArray(stars)) {
      globalThis.drawStars = function () {
        const originalSizes = stars.map((star) => star.sz);
        try {
          for (const star of stars)
            star.sz = Math.min(star.sz, renderSizeCap);
          return drawStars();
        } finally {
          stars.forEach((star, index) => {
            star.sz = originalSizes[index];
          });
        }
      };
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
