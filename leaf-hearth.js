/* ==========================================================================
   PRIVATE HEARTH
   Official change name: Private Hearth

   Leaf keeps its world on the visitor's own device. No visitor identifier,
   analytics payload, cookie, account, or server-side save is created here.
   This file adds a plain explanation and one deliberate erasure gesture.
   ========================================================================== */
(function () {
  'use strict';

  const HEARTH_KEYS = [
    'leaf_genealogy_v1',
    'leaf_preferences_v1',
    'leaf_private_hearth_notice_v1'
  ];

  let panel = null;

  function makePanel() {
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'leaf-private-hearth';
    panel.style.cssText = [
      'position:fixed',
      'left:50%',
      'top:50%',
      'transform:translate(-50%,-50%)',
      'z-index:40',
      'display:none',
      'width:min(520px,calc(100vw - 32px))',
      'padding:22px 24px',
      'border:1px solid rgba(0,200,255,.42)',
      'border-radius:14px',
      'background:rgba(0,0,0,.94)',
      'box-shadow:0 20px 90px rgba(0,0,0,.8)',
      'font:12px/1.65 "Courier New",monospace',
      'color:#b9c8d8',
      'pointer-events:none'
    ].join(';');
    panel.innerHTML =
      '<div style="color:#00c8ff;letter-spacing:1.4px;margin-bottom:12px">PRIVATE HEARTH</div>' +
      '<div>Leaf remembers this world, its genealogy, and a few settings only in this browser.</div>' +
      '<div style="margin-top:9px">The site does not create a tracking cookie, visitor ID, account, or analytics record, and it does not send the saved world to Katherine.</div>' +
      '<div style="margin-top:9px;color:#7f8b99">GitHub still receives ordinary web requests needed to deliver the page.</div>' +
      '<div style="margin-top:14px;color:#ff00ff">type <span style="color:#fff">forget world</span> to erase Leaf from this browser</div>' +
      '<div style="margin-top:9px;color:#596574">escape or ` closes this notice</div>';
    document.body.appendChild(panel);
    return panel;
  }

  function show() {
    makePanel().style.display = 'block';
  }

  function hide() {
    if (panel) panel.style.display = 'none';
  }

  function isOpen() {
    return !!panel && panel.style.display !== 'none';
  }

  function clearLocalWorld() {
    try {
      if (typeof SAVE_KEY !== 'undefined') localStorage.removeItem(SAVE_KEY);
      if (typeof LOCK_KEY !== 'undefined') localStorage.removeItem(LOCK_KEY);
      for (const key of HEARTH_KEYS) localStorage.removeItem(key);
    } catch (_) {}
  }

  function forget(argument) {
    if ((argument || '').trim().toLowerCase() !== 'world') {
      if (typeof notice === 'function') notice('type: forget world');
      return false;
    }
    clearLocalWorld();
    try { sessionStorage.clear(); } catch (_) {}
    location.reload();
    return true;
  }

  function firstNotice() {
    try {
      if (localStorage.getItem('leaf_private_hearth_notice_v1')) return;
      localStorage.setItem('leaf_private_hearth_notice_v1', '1');
      setTimeout(function () {
        if (typeof notice === 'function') notice('this world stays in this browser · privacy');
      }, 1800);
    } catch (_) {}
  }

  globalThis.LEAF_HEARTH = {
    officialName: 'Private Hearth',
    show,
    hide,
    isOpen,
    forget,
    clearLocalWorld
  };

  firstNotice();
})();
