/* ========================================================================== 
   LEXICON CROWN
   Official change name: Lexicon Crown

   SILENT DOCTRINE
   Official change name: Silent Doctrine

   VEILED ASCENSION
   Official change name: Veiled Ascension

   One registry owns command words, aliases, syllable-coloured help, and
   execution. The older terminal listener remains in the ancestral page but is
   intercepted before it can act, so there is one active source of truth.
   Successful ritual commands do not narrate themselves. Internal stages have
   no command, help entry, or public readout.
   ========================================================================== */
(function () {
  'use strict';

  const K = {
    red: '#ff0000', green: '#00ff00', pink: '#ff00ff', blue: '#00c8ff',
    gold: '#ffff00', violet: '#8a5cff', grey: '#7a8496', white: '#e8f4ff'
  };

  const registry = [];
  const byWord = new Map();

  function add(spec) {
    registry.push(spec);
    for (const word of [spec.word].concat(spec.aliases || [])) byWord.set(word.toLowerCase(), spec);
    return spec;
  }

  function kata() {
    return Array.from(arguments).map(part => {
      const isGold = String(part[1]).toLowerCase() === K.gold;
      const glow = isGold ? ';text-shadow:0 0 2px #fff,0 0 7px #ffff00' : '';
      return '<span style="color:' + part[1] + glow + '">' + part[0] + '</span>';
    }).join('');
  }

  function closeTerminal() {
    term.style.display = 'none';
    term.blur();
  }

  function closeOverlays() {
    try { hideHelp(); } catch (_) {}
    closeTerminal();
    if (globalThis.LEAF_GENEALOGY) LEAF_GENEALOGY.close();
  }

  function terminalOpen() {
    return term.style.display !== 'none';
  }

  function openTerminal() {
    term.style.display = 'block';
    term.value = '';
    term.placeholder = (typeof seedName === 'string' && seedName) ? ('· ' + seedName + ' ·  h') : 'h';
    term.focus();
  }

  function toggleTerminal() {
    if (terminalOpen()) closeTerminal();
    else openTerminal();
  }

  function helpOpen() {
    return helpBox.style.display !== 'none';
  }

  function renderHelp() {
    const rows = registry.filter(c => c.visible !== false).map(c => '<div>' + c.kata + '</div>');
    helpBox.innerHTML = rows.join('');
    helpBox.style.display = 'grid';
    helpBox.style.gridAutoFlow = 'column';
    helpBox.style.gridTemplateRows = 'repeat(10,auto)';
    helpBox.style.columnGap = '28px';
    helpBox.style.lineHeight = '1.9';
    helpBox.style.opacity = '1';
    helpBox.style.filter = 'none';
  }

  function say(text) {
    if (typeof notice === 'function') notice(text);
  }

  add({
    word: 'seed', aliases: ['sd'], kata: kata(['seed', K.red]),
    run(arg) { if (arg) resetWithSeed(arg); else say(typeof seedName === 'string' ? seedName : 'unnamed'); }
  });
  add({
    word: 'reset', aliases: ['rs'], kata: kata(['re', K.pink], ['set', K.blue]),
    run() { resetWithRandomSeed(); }
  });
  add({
    word: 'save', aliases: ['sv'], kata: kata(['save', K.blue]),
    run(arg) { if (globalThis.LEAF_SLOTS) LEAF_SLOTS.save(arg); }
  });
  add({
    word: 'load', aliases: ['ld'], kata: kata(['load', K.green]),
    run(arg) { if (globalThis.LEAF_SLOTS) LEAF_SLOTS.load(arg); }
  });
  add({
    word: 'pace', aliases: ['p', 'speed'], kata: kata(['pace', K.pink]),
    run(arg) {
      if (!arg) {
        const value = globalThis.LEAF_PACE ? LEAF_PACE.get() : pace;
        return say('pace ' + value);
      }
      const ok = globalThis.LEAF_PACE
        ? LEAF_PACE.set(arg)
        : Number.isFinite(Number(arg)) && Number(arg) > 0 && (pace = Math.max(0.1, Math.min(500, Number(arg))));
      if (!ok) return say('?');
    }
  });
  add({ word: 'fall', aliases: ['f'], kata: kata(['fall', K.gold]), run() { launchFall(); } });
  add({ word: 'meet', aliases: ['mt'], kata: kata(['meet', K.violet]), run() { meetT = 1100; } });
  add({ word: 'attend', aliases: ['at'], kata: kata(['at', K.green], ['tend', K.blue]), run() { toggleWheel(); } });
  add({
    word: 'mute', aliases: ['mu', 'hush', 'hs'], kata: kata(['mute', K.grey]),
    run() { sndOn = !sndOn; }
  });
  add({
    word: 'zettaitsune', aliases: ['zts', 'bride'],
    kata: kata(['zet', K.green], ['tai', K.blue], ['tsu', K.green], ['ne', K.blue]),
    run() { summon('zettaitsune'); }
  });
  add({
    word: 'aggression', aliases: ['agr', 'aggressor'],
    kata: kata(['a', K.red], ['gres', K.green], ['sion', K.pink]),
    run() { summon('aggression'); }
  });
  add({
    word: 'ahika', aliases: ['ahk', 'kept'],
    kata: kata(['a', K.blue], ['hi', K.gold], ['ka', K.blue]),
    run() { summon('ahika'); }
  });
  add({ word: 'star', aliases: ['st'], kata: kata(['star', K.gold]), run() { summon('star'); } });
  add({ word: 'stars', aliases: ['sts'], kata: kata(['stars', K.gold]), run() { summon('stars'); } });
  add({ word: 'gyre', aliases: ['gy'], kata: kata(['gyre', K.pink]), run() { summon('gyre'); } });
  add({
    word: 'tree', aliases: ['genealogy', 'orchard'], kata: kata(['tree', K.green]),
    run() { if (globalThis.LEAF_GENEALOGY) LEAF_GENEALOGY.toggle(); }
  });
  add({
    word: 'law', kata: kata(['law', K.blue]),
    run() { if (globalThis.LEAF_LAW) LEAF_LAW.toggle(); }
  });
  add({ word: 'h', aliases: ['help', '?'], visible: false, kata: '', run() { renderHelp(); } });

  function execute(raw) {
    const text = (raw || '').trim();
    if (!text) return;
    const firstSpace = text.search(/\s/);
    const head = (firstSpace < 0 ? text : text.slice(0, firstSpace)).toLowerCase();
    const arg = firstSpace < 0 ? '' : text.slice(firstSpace + 1).trim();

    if (head === 'summon' && arg) {
      const nestedSpace = arg.search(/\s/);
      const nestedHead = (nestedSpace < 0 ? arg : arg.slice(0, nestedSpace)).toLowerCase();
      const nested = byWord.get(nestedHead);
      if (nested) return nested.run(nestedSpace < 0 ? '' : arg.slice(nestedSpace + 1).trim());
    }

    const command = byWord.get(head);
    if (!command) return say('?');
    return command.run(arg, text);
  }

  try { showHelp = renderHelp; } catch (_) { globalThis.showHelp = renderHelp; }

  addEventListener('keydown', function (event) {
    const activeTerm = document.activeElement === term;

    if (event.key === '`') {
      event.preventDefault();
      event.stopImmediatePropagation();
      const anyNotice = helpOpen() ||
        (globalThis.LEAF_GENEALOGY && LEAF_GENEALOGY.isOpen());
      if (anyNotice) closeOverlays();
      else toggleTerminal();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopImmediatePropagation();
      closeOverlays();
      return;
    }

    if (event.key === 'Enter' && activeTerm) {
      event.preventDefault();
      event.stopImmediatePropagation();
      const text = term.value;
      closeTerminal();
      execute(text);
      return;
    }

    if ((event.key === 't' || event.key === 'T') && !activeTerm) {
      event.preventDefault();
      event.stopImmediatePropagation();
      if (globalThis.LEAF_GENEALOGY) LEAF_GENEALOGY.toggle();
    }
  }, true);

  globalThis.LEAF_COMMANDS = {
    officialName: 'Lexicon Crown',
    doctrineName: 'Silent Doctrine',
    veilName: 'Veiled Ascension',
    registry,
    execute,
    showHelp: renderHelp,
    closeOverlays
  };
})();
