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

## Chorus of Precedent

**Commit:** `bb7991fd2e8d8548734da6ae69c07df799dc3ff9`

**File:** `leaf-law.js`

Makes contagious law legible without restoring diagnostic squares. Bodies inside the same lawful field gradually share a visible pulse; between permitted beats their existing momentum is held, then released on the beat. Stronger law produces tighter cadence while preserving direction and momentum rather than replacing them.

Revert phrase: `revert Chorus of Precedent`

## Jurisprudential Drift

**Commit:** `0abd41c2e7c0c421bbee107d860fb68933631bf4`

**File:** `leaf-jurisprudential-drift.js`

Replaces law's arbitrary two-sine orbit. The law origin is recentered on its settled body, and the body drifts toward the shared barycentre of Heart, Love, Power, stars, and what law has kept. Accumulated law supplies inertia, so established law becomes progressively harder to move. The drift state is included in saves.

Revert phrase: `revert Jurisprudential Drift`

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

## Star Temperance

**Commit:** `a5f5598f2cfe324a0d2316087a7405a305142bcf`

**File:** `leaf-star-temperance.js`

Makes newly born extreme stars markedly rarer and lowers the stellar maximum slightly. Existing stars and saved history are not rewritten.

Revert phrase: `revert Star Temperance`

## Retrograde Hunger

**Commits:** `0961e4ca7e844e8cf133a5745317a760a3ca10de`, `f6f769ca98238c4e5f9ace926916bcc9fbaed7cb`

**File:** `leaf-new-goddesses.js`

Adds the naturally arising HEART · POWER · ICE star-devourer. She enters only under exceptional giant-star pressure in a world that has already made ice, hunts the largest lights, holds their mass as turning, and deposits that turning as new ice. She is mortal, saved with the world, subject to contagious law, and has no command or announcement.

Revert phrase: `revert Retrograde Hunger`

## Scavenger's Hem

**Commits:** `0961e4ca7e844e8cf133a5745317a760a3ca10de`, `f6f769ca98238c4e5f9ace926916bcc9fbaed7cb`

**File:** `leaf-new-goddesses.js`

Adds the naturally arising LOVE · POWER scavenger. She appears when loose magenta relation and exhausted red fire accumulate, gathers them into a visible hem, and ferments overflow into quiet persistent traces rather than deleting it without remainder. She is mortal, saved with the world, subject to contagious law, and has no command or announcement.

Revert phrase: `revert Scavenger's Hem`

## Zettaitsune Trine

**Commits:** `a5f5598f2cfe324a0d2316087a7405a305142bcf`, `52ac357aab9cc18b0ffcb54f14b015adda68c27c`

**Files:** `leaf-star-temperance.js`, `leaf-crown.js`

Spells Zettaitsune as the syllable-true GREEN · BLUE · GREEN sequence `zet / tai / tsune` in both the world readout and the help litany.

Revert phrase: `revert Zettaitsune Trine`

## Predator's Winnowing

**Files:** `leaf-new-goddesses.js`, `leaf-systems.json`

Lets Retrograde Hunger wake not only for a concentration of giant stars, but also for a crowded bright sky. It selects only consequential bright lights and withdraws after the field is thinned, so sparse ordinary starlight is left alone.

Revert phrase: `revert Predator's Winnowing`

## Zettaitsune Quatrain

**Files:** `leaf-star-temperance.js`, `leaf-crown.js`, `leaf-systems.json`

Supersedes the Trine in the visible readout and litany. Zettaitsune is again rendered as GREEN · BLUE · GREEN · BLUE: `zet / tai / tsu / ne`.

Revert phrase: `revert Zettaitsune Quatrain`

## Dark Core of Aggression

**Files:** `index.html`, `leaf-systems.json`

Sets a dark, dense HEART centre inside Aggression. Her green and magenta bodies remain active around it, while wound seams no longer resolve to pale white.

Revert phrase: `revert Dark Core of Aggression`

## Root-Silk Restraint

**Files:** `index.html`, `leaf-systems.json`

Prevents the root gyre from drawing Quiet Silk into the persistent layer while it follows Power's path. Mortal gyres still leave local, fading silk; the existing root scar simply fades once the world runs on this revision.

Revert phrase: `revert Root-Silk Restraint`

## Round Horizon

**Commit:** `edde7d24009b21fb99ae1fabc82e12e889b57249`

**File:** `leaf-round-horizon.js`

Keeps one logical world rectangle for a loaded world and presents it with a single uniform scale. Window and fullscreen changes can reframe the cosmos but cannot squeeze circles into ovals. Extra aspect-ratio space remains black sky.

Revert phrase: `revert Round Horizon`

## Council Ledger

**Commit:** `55b1c29aa64488874ad128c9d66b82d2616615c4`

**File:** `council.html`

Adds a companion page containing open questions, proposed improvements, and a rendered inventory of Leaf. Checks and notes remain browser-local until Katherine explicitly dispatches them into a private `kt-bus` GitHub issue draft.

Revert phrase: `revert Council Ledger`

## Living Ledger

**Commits:** `75ffe6c7e079eae45bb25daff706b5f836dc5901`, `809d40748d61094a006b615225e45b0b87f1b54d`

**File:** `council-live.js`

Makes Council Ledger active. Inventory miniatures animate only while visible, cards report counts or presence from the latest local world, questions can be held or resolved, and a law audit records notes on every proposition governing law. The page also tracks active work and includes its notes in dispatch.

Revert phrase: `revert Living Ledger`

## Ecology Witness

**Commit:** `67ca9f8d301659550c40a9d106a66e2b7806184f`

**File:** `council-ecology.js`

Adds active inventory cards for the star-devourer and scavenger, animates their forms, reads their presence and work from the latest local world, and marks both ecological projects active in Council Ledger.

Revert phrase: `revert Ecology Witness`

## Lexicon Crown

**Original commit:** `d6460064662e9ea67158045e82122c8bbdcc286b`

**Current command-polish commit:** `eed1b2275d5ff661f624d83e5551924fa3d42793`

**Current file:** `leaf-crown.js`

Provides one declarative command registry for command words, aliases, syllable-coloured help, and execution. It owns the corrected backtick and Escape behaviour. The current litany uses `h`, omits the defunct `keep`, renders `load` green and `pace` pink, removes the ancestral panel opacity, and gives brightest yellow a white-hot glow.

Revert phrase: `revert Lexicon Crown`

## Silent Doctrine

**Commits:** `b366befa7ae127274ab5633780626a7d1a4439ff`, `a91c426bf883eb6a981b29013764a128654dfc1b`, `fb555844edfa4870d515ad53746bb8014496c42f`, `f532571bbca0d74a5c52abdfc5d3a946e4f1ff95`

**Files:** `leaf-slots.js`, `leaf-law.js`, `leaf-crown.js`, `leaf-veil.js`

Successful ritual commands and automatic discoveries do not narrate themselves. Explicit inquiries and failures may still speak.

Revert phrase: `revert Silent Doctrine`

## Integration Bridge

**Current commit:** `21853d5088cbd6c18cb009b124f3c99a32c97ab5`

**File:** `sw.js`

Loads the named simulation systems into Leaf world pages and the active ledger systems into the council page. It claims and reloads a first-time page once so a visitor is not asked to understand or manually refresh a service worker.

Revert phrase: `revert Integration Bridge`

## Reversion rule

Do not roll the repository back wholesale. Make a new, narrow revert commit that removes the named system's script and any corresponding loader entry while preserving later unrelated work and the visitor's saved world whenever possible.
