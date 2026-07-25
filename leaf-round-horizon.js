/* ==========================================================================
   ROUND HORIZON
   Official change name: Round Horizon

   A change of window shape may reframe the cosmos, but it may not rewrite its
   geometry. The ancestral resize path assigned W=viewport width and H=viewport
   height, then painted the old record into that new rectangle. A circle could
   therefore become an oval merely because the browser changed shape.

   Round Horizon keeps one logical world rectangle for the life of the loaded
   world and presents it with one uniform scale. Extra viewport area is black
   sky; a narrow viewport sees the same world reduced, never squeezed. Saved
   worlds may establish their own logical rectangle when loaded.
   ========================================================================== */
(function () {
  'use strict';

  let logicalW = Math.max(1, W || innerWidth || 1);
  let logicalH = Math.max(1, H || innerHeight || 1);
  const ancestralAdopt = adoptLogicalWorld;

  function fitWorld() {
    const nw = Math.max(1, Math.round(innerWidth));
    const nh = Math.max(1, Math.round(innerHeight));
    if (VW !== nw || VH !== nh || cv.width !== nw || cv.height !== nh) {
      VW = nw;
      VH = nh;
      cv.width = VW;
      cv.height = VH;
    }

    const scale = Math.min(VW / logicalW, VH / logicalH);
    viewScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
    viewDx = (VW - logicalW * viewScale) * 0.5;
    viewDy = (VH - logicalH * viewScale) * 0.5;

    X.setTransform(1, 0, 0, 1, 0, 0);
    X.fillStyle = '#000';
    X.fillRect(0, 0, VW, VH);
  }

  updateView = function () {
    const scale = Math.min(VW / logicalW, VH / logicalH);
    viewScale = Number.isFinite(scale) && scale > 0 ? scale : 1;
    viewDx = (VW - logicalW * viewScale) * 0.5;
    viewDy = (VH - logicalH * viewScale) * 0.5;
  };

  rs = function () {
    fitWorld();
  };

  adoptLogicalWorld = function (w, h) {
    ancestralAdopt(w, h);
    logicalW = Math.max(1, W);
    logicalH = Math.max(1, H);
    fitWorld();
  };

  fitWorld();

  globalThis.LEAF_ROUND_HORIZON = {
    officialName: 'Round Horizon',
    logicalSize: () => ({ width: logicalW, height: logicalH }),
    viewportSize: () => ({ width: VW, height: VH }),
    scale: () => viewScale
  };
})();