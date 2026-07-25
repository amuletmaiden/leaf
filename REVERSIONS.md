# Leaf named changes

These names are stable control words for Katherine. A later assistant should treat `revert [name]` as an instruction to remove or undo exactly that named system without disturbing the others.

## Private Hearth

**Original commit:** `f21d6aa9faa9f5cc48d5b5ab2148e0ed3e5e3b8c`

**File:** `leaf-hearth.js`

Originally added local-only storage explanation and erasure UI. Its visible interface was subsequently abolished by **Mystery Veil**. The underlying rule remains: no tracking cookie, visitor ID, account, analytics record, or server-side world save.

Revert phrase: `revert Private Hearth`

## Mystery Veil

**Commit:** `1bf5fbd261bdffcb4ed10f088b9f36ea57208019`

**File:** `leaf-hearth.js`

Removes every visible privacy notice, privacy panel, privacy command, and `forget world` command. Local persistence remains silent and immersive.

Revert phrase: `revert Mystery Veil`

## Pocket Worlds

**Commits:** `e37002ab3aadc4653ef01d10150d7f0ba6e81454`, `e91c611886b1daf3e3d34e0d948bc11eb38c5a53`

**Files:** `leaf-slots.js`, `leaf-crown.js`

Adds numbered browser-local world slots. `save 1`, `load 1`, `save 2`, `load 2`, through slot 99. No download, upload, file picker, account, or server storage.

Revert phrase: `revert Pocket Worlds`

## Fossil Orchard

**Commit:** `c6b10c52ad5ef80d557a2fac44d4c4f1e94a3d6f`

**File:** `leaf-genealogy.js`

Records first relations as a persistent local genealogy and renders them as a tree. Open with `tree` or `t`.

Revert phrase: `revert Fossil Orchard`

## Law of Contagion

**Commit:** `e32eb7a9895670a2b55bfd75ee77036cdfbd00b8`

**File:** `leaf-law.js`

Adds local lawfulness fields. Matter in lawful regions begins snapping to grids, phase-locking, and moving on periodic beats. The single command `law` wakes or sleeps the field.

Revert phrase: `revert Law of Contagion`

## Dormant Sigils

**Commit:** `12da9d9a68102f96bf15ff78a76b9070094e8fc5`

**File:** `leaf-law.js`

Keeps the diagnostic square marks hidden by default and removes public show/hide commands. The law can act without diagramming itself across the world.

Revert phrase: `revert Dormant Sigils`

## Legislative Ladder

**Commit:** `5c6e914ae620b07f518bd00d76b74163315ab9ba`

**File:** `leaf-mind.js`

Lets goddesses advance through impulse, tropism, memory, anticipation, and legislation according to accumulated law in their skirts. Inspect with `mind`.

Revert phrase: `revert Legislative Ladder`

## Lexicon Crown

**Original commit:** `d6460064662e9ea67158045e82122c8bbdcc286b`

**Current file:** `leaf-crown.js`

Provides one declarative command registry for command words, aliases, syllable-coloured help, and execution. It also owns the corrected backtick and Escape behaviour.

Revert phrase: `revert Lexicon Crown`

## Silent Doctrine

**Commits:** `b366befa7ae127274ab5633780626a7d1a4439ff`, `a91c426bf883eb6a981b29013764a128654dfc1b`, `fb555844edfa4870d515ad53746bb8014496c42f`

**Files:** `leaf-slots.js`, `leaf-law.js`, `leaf-crown.js`

Successful ritual commands do not narrate themselves. Law toggles, numbered saves and loads, mute, and pace changes are silent. Explicit inquiries and failures may still speak.

Revert phrase: `revert Silent Doctrine`

## Integration Bridge

**Current commit:** `0e4312130a567c30079478a250ec5d5c761edca9`

**File:** `sw.js`

Loads the named systems into served HTML pages while keeping their logic in separate files, including Pocket Worlds. It claims and reloads a first-time page once so a visitor is not asked to understand or manually refresh a service worker. This is plumbing, not a metaphysical feature. Reverting any named feature should remove its script from the bridge as well as reverting its own file.

Revert phrase: `revert Integration Bridge`

## Reversion rule

Do not roll the repository back wholesale. Make a new, narrow revert commit that removes the named system's script and any corresponding loader entry while preserving later unrelated work and the visitor's saved world whenever possible.
