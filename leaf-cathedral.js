/* ========================================================================== 
   CATHEDRAL MIRROR
   Official change name: Cathedral Mirror

   NIGHT CATHEDRAL
   Official change name: Night Cathedral

   SACRED OPTICS
   Official change name: Sacred Optics

   DOCTRINE OF FORMS
   Official change name: Doctrine of Forms

   This page mirrors the real Leaf page in an iframe. It does not fork the
   simulation or alter index.html. A same-origin visual layer reads the living
   canvases, discovers the centroids of the kata colours, and builds bloom,
   atmosphere and architecture around the actual world beneath it.
   ========================================================================== */
(function () {
  'use strict';

  const source = document.getElementById('source');
  const bloom = document.getElementById('bloom');
  const doctrine = document.getElementById('doctrine');
  const grain = document.getElementById('grain');
  const name = document.getElementById('name');
  const hint = document.getElementById('hint');
  const failure = document.getElementById('failure');
  const bloomX = bloom.getContext('2d');
  const formX = doctrine.getContext('2d');
  const probe = document.createElement('canvas');
  const probeX = probe.getContext('2d', { willReadFrequently: true });
  probe.width = 96; probe.height = 54;

  const C = {
    red: '#ff0000', green: '#00ff00', pink: '#ff00ff', blue: '#00c8ff',
    yellow: '#ffff00', ice: '#c8f7ff'
  };
  const settings = { veil: true, architecture: true, optics: true, grain: true };
  const centers = {
    red: { x: .5, y: .56, mass: 0 }, green: { x: .36, y: .38, mass: 0 },
    pink: { x: .62, y: .42, mass: 0 }, blue: { x: .5, y: .5, mass: 0 },
    yellow: { x: .5, y: .36, mass: 0 }
  };
  let child = null;
  let canvases = [];
  let width = 1, height = 1, dpr = 1;
  let lastSample = 0;
  let lastCanvasScan = 0;
  let openedAt = performance.now();
  let hinted = false;
  let failed = false;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  const lerp = (a, b, t) => a + (b - a) * t;
  const rgba = (hex, a) => {
    const h = hex.replace('#', '');
    const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${a})`;
  };

  function resize() {
    width = innerWidth; height = innerHeight; dpr = Math.min(2, devicePixelRatio || 1);
    for (const canvas of [bloom, doctrine]) {
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = width + 'px'; canvas.style.height = height + 'px';
    }
    bloomX.setTransform(dpr, 0, 0, dpr, 0, 0);
    formX.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function scanCanvases() {
    if (!child || !child.document) return;
    canvases = [...child.document.querySelectorAll('canvas')].filter(c => {
      const r = c.getBoundingClientRect();
      const style = child.getComputedStyle(c);
      return c.width > 1 && c.height > 1 && r.width > 1 && r.height > 1 && style.display !== 'none' && style.visibility !== 'hidden';
    });
  }

  function childRect(canvas) {
    const r = canvas.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  }

  function drawSources(target, alpha, filter, operation) {
    target.save();
    target.globalCompositeOperation = operation || 'screen';
    target.globalAlpha = alpha;
    target.filter = filter || 'none';
    for (const canvas of canvases) {
      try {
        const r = childRect(canvas);
        target.drawImage(canvas, r.x, r.y, r.w, r.h);
      } catch (_) {}
    }
    target.restore();
  }

  function sampleColourCenters(now) {
    if (now - lastSample < 620 || !canvases.length) return;
    lastSample = now;
    probeX.setTransform(1, 0, 0, 1, 0, 0);
    probeX.clearRect(0, 0, probe.width, probe.height);
    probeX.fillStyle = '#000'; probeX.fillRect(0, 0, probe.width, probe.height);
    probeX.globalCompositeOperation = 'screen';
    for (const canvas of canvases) {
      try {
        const r = childRect(canvas);
        probeX.drawImage(canvas,
          r.x / width * probe.width, r.y / height * probe.height,
          r.w / width * probe.width, r.h / height * probe.height);
      } catch (_) {}
    }

    let data;
    try { data = probeX.getImageData(0, 0, probe.width, probe.height).data; }
    catch (_) { return; }
    const sums = {
      red: [0, 0, 0], green: [0, 0, 0], pink: [0, 0, 0], blue: [0, 0, 0], yellow: [0, 0, 0]
    };
    for (let y = 0; y < probe.height; y++) for (let x = 0; x < probe.width; x++) {
      const i = (y * probe.width + x) * 4;
      const r = data[i] / 255, g = data[i + 1] / 255, b = data[i + 2] / 255;
      const weights = {
        red: Math.max(0, r - g * .72 - b * .58),
        green: Math.max(0, g - r * .62 - b * .58),
        pink: Math.max(0, Math.min(r, b) - g * .58),
        blue: Math.max(0, b * .72 + g * .28 - r * .60),
        yellow: Math.max(0, Math.min(r, g) - b * .55)
      };
      for (const key of Object.keys(weights)) {
        const w = Math.pow(weights[key], 1.6);
        if (w < .018) continue;
        sums[key][0] += x * w; sums[key][1] += y * w; sums[key][2] += w;
      }
    }
    for (const key of Object.keys(sums)) {
      const [sx, sy, mass] = sums[key];
      if (mass < .08) continue;
      const nx = sx / mass / probe.width, ny = sy / mass / probe.height;
      centers[key].x = lerp(centers[key].x, nx, .32);
      centers[key].y = lerp(centers[key].y, ny, .32);
      centers[key].mass = lerp(centers[key].mass, clamp(mass / 70, 0, 1), .25);
    }
  }

  function point(key) { return { x: centers[key].x * width, y: centers[key].y * height }; }

  function radial(ctx, x, y, radius, color, alpha, inner) {
    const g = ctx.createRadialGradient(x, y, inner || 0, x, y, radius);
    g.addColorStop(0, rgba(color, alpha));
    g.addColorStop(.42, rgba(color, alpha * .32));
    g.addColorStop(1, rgba(color, 0));
    ctx.fillStyle = g; ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  function drawBloom() {
    bloomX.clearRect(0, 0, width, height);
    if (!settings.veil || !settings.optics) return;
    drawSources(bloomX, .27, 'blur(5px) saturate(1.55) brightness(1.18)', 'screen');
    drawSources(bloomX, .095, 'blur(17px) saturate(1.8) brightness(1.3)', 'screen');
  }

  function drawArchitecture(now) {
    if (!settings.architecture) return;
    const t = now / 1000;
    const law = point('blue'), heart = point('red');
    const vanishingX = lerp(width * .5, law.x, .28);
    const altarY = lerp(height * .57, heart.y, .25);

    formX.save();
    formX.globalCompositeOperation = 'screen';
    formX.lineWidth = 1;
    for (let i = 0; i < 9; i++) {
      const edgeX = width * (i + .5) / 9;
      const alpha = .018 + .015 * Math.sin(t * .17 + i * .8) ** 2;
      formX.strokeStyle = `rgba(155,220,245,${alpha})`;
      formX.beginPath(); formX.moveTo(edgeX, height * 1.04); formX.lineTo(lerp(vanishingX, edgeX, .08), height * .07); formX.stroke();
    }
    for (let i = 0; i < 7; i++) {
      const f = i / 6, y = lerp(height * .16, height * .91, f);
      const inset = width * (.07 + f * .07);
      formX.strokeStyle = `rgba(0,200,255,${.018 + f * .018})`;
      formX.beginPath();
      formX.moveTo(inset, y);
      formX.bezierCurveTo(width * .25, y - 50 * (1 - f), width * .39, altarY - 110 * (1 - f), vanishingX, altarY - 125 * (1 - f));
      formX.bezierCurveTo(width * .61, altarY - 110 * (1 - f), width * .75, y - 50 * (1 - f), width - inset, y);
      formX.stroke();
    }
    formX.restore();
  }

  function drawSemanticOptics(now) {
    if (!settings.optics) return;
    const t = now / 1000;
    const red = point('red'), green = point('green'), pink = point('pink'), blue = point('blue'), yellow = point('yellow');
    formX.save(); formX.globalCompositeOperation = 'screen';

    radial(formX, red.x, red.y, 130 + Math.sin(t * 2.1) * 10, C.red, .17 + centers.red.mass * .12, 8);
    for (let i = 0; i < 3; i++) {
      formX.strokeStyle = rgba(C.red, .06 + i * .025);
      formX.lineWidth = 1.2;
      formX.beginPath(); formX.arc(red.x, red.y, 38 + i * 17 + Math.sin(t * 2.4 + i) * 3, 0, Math.PI * 2); formX.stroke();
    }

    const gaze = Math.atan2(yellow.y - green.y, yellow.x - green.x);
    const spread = .18 + .09 * (1 - centers.green.mass);
    const length = Math.min(width, height) * .43;
    const cone = formX.createLinearGradient(green.x, green.y, green.x + Math.cos(gaze) * length, green.y + Math.sin(gaze) * length);
    cone.addColorStop(0, rgba(C.green, .14)); cone.addColorStop(1, rgba(C.green, 0));
    formX.fillStyle = cone; formX.beginPath(); formX.moveTo(green.x, green.y);
    formX.lineTo(green.x + Math.cos(gaze - spread) * length, green.y + Math.sin(gaze - spread) * length);
    formX.lineTo(green.x + Math.cos(gaze + spread) * length, green.y + Math.sin(gaze + spread) * length);
    formX.closePath(); formX.fill();
    radial(formX, green.x, green.y, 58, C.green, .16, 3);

    for (let i = 0; i < 4; i++) {
      const r = 26 + i * 16 + Math.sin(t * .8 + i) * 4;
      formX.strokeStyle = rgba(C.pink, .09 + i * .018);
      formX.lineWidth = 1.35;
      formX.beginPath(); formX.arc(pink.x, pink.y, r, t * (.16 + i * .025) + i, t * (.16 + i * .025) + i + 4.9); formX.stroke();
    }
    radial(formX, pink.x, pink.y, 92, C.pink, .095, 14);

    const cell = 18, range = 82;
    formX.strokeStyle = rgba(C.blue, .055); formX.lineWidth = 1;
    for (let x = -range; x <= range; x += cell) {
      formX.beginPath(); formX.moveTo(blue.x + x, blue.y - range); formX.lineTo(blue.x + x, blue.y + range); formX.stroke();
    }
    for (let y = -range; y <= range; y += cell) {
      formX.beginPath(); formX.moveTo(blue.x - range, blue.y + y); formX.lineTo(blue.x + range, blue.y + y); formX.stroke();
    }
    radial(formX, blue.x, blue.y, 120, C.blue, .075, 24);

    radial(formX, yellow.x, yellow.y, 72, C.yellow, .07 + centers.yellow.mass * .08, 2);
    for (let i = 0; i < 4; i++) {
      const a = t * .06 + i * Math.PI / 2;
      formX.strokeStyle = rgba(C.yellow, .08);
      formX.beginPath(); formX.moveTo(yellow.x + Math.cos(a) * 7, yellow.y + Math.sin(a) * 7);
      formX.lineTo(yellow.x + Math.cos(a) * 36, yellow.y + Math.sin(a) * 36); formX.stroke();
    }
    formX.restore();
  }

  function drawDepth(now) {
    const t = now / 1000;
    formX.save();
    const fog = formX.createRadialGradient(width * .5, height * .53, 0, width * .5, height * .53, Math.max(width, height) * .72);
    fog.addColorStop(0, 'rgba(5,18,26,.00)');
    fog.addColorStop(.48, 'rgba(0,15,24,.018)');
    fog.addColorStop(1, 'rgba(0,0,0,.54)');
    formX.fillStyle = fog; formX.fillRect(0, 0, width, height);
    formX.globalCompositeOperation = 'screen';
    for (let i = 0; i < 14; i++) {
      const y = ((i * 83 + t * (3 + i % 3)) % (height + 160)) - 80;
      const g = formX.createLinearGradient(0, y, width, y + 34);
      const color = [C.blue, C.green, C.pink][i % 3];
      g.addColorStop(0, rgba(color, 0)); g.addColorStop(.5, rgba(color, .008)); g.addColorStop(1, rgba(color, 0));
      formX.fillStyle = g; formX.fillRect(0, y, width, 38);
    }
    formX.restore();
  }

  function frame(now) {
    requestAnimationFrame(frame);
    if (!child || failed) return;
    if (now - lastCanvasScan > 1200) { lastCanvasScan = now; scanCanvases(); }
    sampleColourCenters(now);
    drawBloom();
    formX.clearRect(0, 0, width, height);
    if (settings.veil) {
      drawDepth(now);
      drawArchitecture(now);
      drawSemanticOptics(now);
    }
    if (now - openedAt > 4800) name.classList.add('sleep');
  }

  function recordPassage() {
    try {
      const chronicle = child && child.LEAF_CHRONICLE;
      if (chronicle && typeof chronicle.record === 'function') {
        chronicle.record('visual', 'a cathedral passage is marked', C.ice, { importance: 3, plate: true });
      }
    } catch (_) {}
  }

  function setToggle(name, value) {
    settings[name] = value == null ? !settings[name] : !!value;
    const button = document.getElementById(name);
    if (button) button.dataset.on = settings[name] ? '1' : '0';
    if (name === 'grain') grain.style.display = settings.grain ? 'block' : 'none';
    if (name === 'veil') source.style.filter = settings.veil ? 'brightness(1.03) contrast(1.08) saturate(1.12)' : 'none';
  }

  function keyboard(event) {
    const tag = event.target && event.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;
    if (event.key === '\\') { event.preventDefault(); setToggle('veil'); }
    else if (event.key === 'b' || event.key === 'B') setToggle('optics');
    else if (event.key === 'a' || event.key === 'A') setToggle('architecture');
    else if (event.key === 'g' || event.key === 'G') setToggle('grain');
    else if (event.key === 'm' || event.key === 'M') recordPassage();
  }

  function attach() {
    try {
      child = source.contentWindow;
      const doc = source.contentDocument;
      if (!child || !doc) throw new Error('world unavailable');
      scanCanvases();
      child.addEventListener('keydown', keyboard, true);
      doc.documentElement.style.background = '#000';
      try {
        if (child.LEAF_CHRONICLE && typeof child.LEAF_CHRONICLE.record === 'function') {
          child.LEAF_CHRONICLE.record('visual', 'cathedral mirror opens', C.ice, { importance: 1 });
        }
      } catch (_) {}
      setTimeout(() => { hint.classList.add('show'); hinted = true; }, 1800);
      setTimeout(() => hint.classList.remove('show'), 7200);
    } catch (_) {
      failed = true; failure.style.display = 'grid';
    }
  }

  source.addEventListener('load', attach);
  addEventListener('resize', resize);
  addEventListener('keydown', keyboard, true);
  document.getElementById('veil').onclick = () => setToggle('veil');
  document.getElementById('architecture').onclick = () => setToggle('architecture');
  document.getElementById('optics').onclick = () => setToggle('optics');
  document.getElementById('mark').onclick = recordPassage;
  for (const key of ['veil', 'architecture', 'optics']) document.getElementById(key).dataset.on = '1';
  resize(); requestAnimationFrame(frame);

  globalThis.LEAF_CATHEDRAL = {
    officialName: 'Cathedral Mirror',
    stageName: 'Night Cathedral',
    opticsName: 'Sacred Optics',
    formsName: 'Doctrine of Forms',
    settings,
    centers,
    mark: recordPassage
  };
})();
