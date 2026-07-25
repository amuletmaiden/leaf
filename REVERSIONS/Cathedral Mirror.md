# Cathedral Mirror

**Official change name:** Cathedral Mirror

**Primary commits:**

- `d8fc7e16db34b85dadc94009cd570422852ec57a` — separate page shell
- `aed0f26d58cd2458d1de803d749a3ad69600fec5` — live semantic visual layer
- `e530b0ca403bad0abc7fd23d3ee05b83aef67035` — Council Ledger entry
- `5242611dac2b2a8c863112d31ed5e73289b5c92d` — Integration Bridge
- `19e27b302a70604643cb93476b22eadf7c94f504` — System Atlas record

**Files:**

- `cathedral.html`
- `leaf-cathedral.js`
- `council-cathedral.js`
- `sw.js`
- `leaf-systems.json`

## What it does

Runs the real `index.html` world inside a same-origin iframe and places a separate experimental visual layer above it. The main simulator is not copied, overwritten, or restyled. Saves, Chronicle Loom, commands, ecology, law, and world state remain those of the real Leaf page underneath.

The mirror periodically samples the living canvases at low resolution and discovers the current centroids of red, green, magenta, blue, and yellow light. Its effects therefore follow the actual world rather than fixed decorative coordinates.

Revert phrase: `revert Cathedral Mirror`

A narrow revert removes `cathedral.html`, `leaf-cathedral.js`, and `council-cathedral.js`, removes their cache and Council loader entries from `sw.js`, and removes the corresponding System Atlas records. It does not touch `index.html` or saved worlds.

# Night Cathedral

**Official change name:** Night Cathedral

Builds atmospheric depth, a dark spatial chamber, perspective ribs, and changing arches around the living simulation. It never changes simulation geometry.

Revert phrase: `revert Night Cathedral`

A narrow revert disables or removes the architecture and depth passes in `leaf-cathedral.js` while preserving the separate mirror and other visual passes.

# Sacred Optics

**Official change name:** Sacred Optics

Adds two restrained screen-blended bloom passes and semantic halos based on the colours detected in the actual world. The bloom reads every visible Leaf canvas but does not write into any of them.

Revert phrase: `revert Sacred Optics`

A narrow revert removes bloom and semantic light from `leaf-cathedral.js` while preserving the page and architecture.

# Doctrine of Forms

**Official change name:** Doctrine of Forms

Uses distinct visual grammar for the detected kata forces: Heart receives furnace rings, Love receives directed sight, Power receives rotating incomplete gyres, Law receives a local lattice, and stars receive sparse radial rays.

Revert phrase: `revert Doctrine of Forms`

A narrow revert removes those force-specific overlays while preserving general Night Cathedral atmosphere and bloom.
