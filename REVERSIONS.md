# Leaf named changes

These names are stable control words for Katherine. A later assistant should treat `revert [name]` as an instruction to remove or undo exactly that named system without disturbing the others.

## Private Hearth

**Commit:** `f21d6aa9faa9f5cc48d5b5ab2148e0ed3e5e3b8c`

**File:** `leaf-hearth.js`

Keeps world history and preferences local to the visitor's browser, explains the storage plainly, and provides `forget world` for erasure. It creates no tracking cookie, visitor ID, account, analytics record, or server-side world save.

Revert phrase: `revert Private Hearth`

## Fossil Orchard

**Commit:** `c6b10c52ad5ef80d557a2fac44d4c4f1e94a3d6f`

**File:** `leaf-genealogy.js`

Records first relations as a persistent local genealogy and renders them as a tree. Open with `tree` or `t`.

Revert phrase: `revert Fossil Orchard`

## Law of Contagion

**Commit:** `e32eb7a9895670a2b55bfd75ee77036cdfbd00b8`

**File:** `leaf-law.js`

Adds local lawfulness fields. Matter in lawful regions begins snapping to grids, phase-locking, and moving on periodic beats. Toggle or inspect with `law`.

Revert phrase: `revert Law of Contagion`

## Legislative Ladder

**Commit:** `5c6e914ae620b07f518bd00d76b74163315ab9ba`

**File:** `leaf-mind.js`

Lets goddesses advance through impulse, tropism, memory, anticipation, and legislation according to accumulated law in their skirts. Inspect with `mind`.

Revert phrase: `revert Legislative Ladder`

## Lexicon Crown

**Commit:** `d6460064662e9ea67158045e82122c8bbdcc286b`

**File:** `leaf-crown.js`

Provides one declarative command registry for command words, aliases, syllable-coloured help, and execution. It also owns the corrected backtick and Escape behaviour.

Revert phrase: `revert Lexicon Crown`

## Integration Bridge

**Commit:** `745776fa1c37a8e56837ad173251547f70894a33`

**File:** `sw.js`

Loads the named systems into served HTML pages while keeping their logic in separate files. This is plumbing, not a metaphysical feature. Reverting any named feature should remove its script from the bridge as well as reverting its own file.

Revert phrase: `revert Integration Bridge`

## Reversion rule

Do not roll the repository back wholesale. Make a new, narrow revert commit that removes the named system's script and any corresponding loader entry while preserving later unrelated work and the visitor's saved world whenever possible.
