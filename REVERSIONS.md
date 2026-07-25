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

## Deep Pockets

**Commit:** `7b76865742039a28f9c25e1e1e1a02d06936be5b`

**File:** `leaf-slots.js`

Moves full numbered worlds from undersized `localStorage` into IndexedDB so their PNG memory layers fit. Slot operations are serialized, so an immediate `save 1` followed by `load 1` cannot race.

Revert phrase: `revert Deep Pockets`

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

**Original commit:** `5c6e914ae620b07f518bd00d76b74163315ab9ba`

**File:** `leaf-mind.js`

Lets goddesses change behavior as accumulated law in their skirts grows. Its internal stages are deliberately not exposed to the visitor.

Revert phrase: `revert Legislative Ladder`

## Veiled Ascension

**Commits:** `c7c3edba179471e97f9ef4057a2edfc521ca4630`, `a56804df3df9f82cf6ba92c548f3fc8d98702ee7`, `f532571bbca0d74a5c52abdfc5d3a946e4f1ff95`, `c3da23badc5ba56c843c88682a78b8eb1c2538e3`

**Files:** `leaf-mind.js`, `leaf-crown.js`, `leaf-veil.js`, `sw.js`

Removes all visible goddess-stage announcements, the `mind` command and help entry, and old `mind-*` genealogy fossils. Internal behavioral development remains, but the system never names it to the visitor.

Revert phrase: `revert Veiled Ascension`

## Lexicon Crown

**Original commit:** `d6460064662e9ea67158045e82122c8bbdcc286b`

**Current file:** `leaf-crown.js`

Provides one declarative command registry for command words, aliases, syllable-coloured help, and execution. It also owns the corrected backtick and Escape behaviour.

Revert phrase: `revert Lexicon Crown`

## Silent Doctrine

**Commits:** `b366befa7ae127274ab5633780626a7d1a4439ff`, `a91c426bf883eb6a981b29013764a128654dfc1b`, `fb555844edfa4870d515ad53746bb8014496c42f`, `f532571bbca0d74a5c52abdfc5d3a946e4f1ff95`

**Files:** `leaf-slots.js`, `leaf-law.js`, `leaf-crown.js`, `leaf-veil.js`

Successful ritual commands and automatic discoveries do not narrate themselves. Explicit inquiries and failures may still speak.

Revert phrase: `revert Silent Doctrine`

## Integration Bridge

**Current commit:** `c3da23badc5ba56c843c88682a78b8eb1c2538e3`

**File:** `sw.js`

Loads the named systems into served HTML pages while keeping their logic in separate files, including Pocket Worlds and Veiled Ascension. It claims and reloads a first-time page once so a visitor is not asked to understand or manually refresh a service worker. This is plumbing, not a metaphysical feature. Reverting any named feature should remove its script from the bridge as well as reverting its own file.

Revert phrase: `revert Integration Bridge`

## Reversion rule

Do not roll the repository back wholesale. Make a new, narrow revert commit that removes the named system's script and any corresponding loader entry while preserving later unrelated work and the visitor's saved world whenever possible.
