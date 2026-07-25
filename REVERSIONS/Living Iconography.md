# Living Iconography

**Official change name:** Living Iconography

**Primary commits:**

- `1a17e419b96271a6a1ebbc41f89e6ac72c7eda1f` — separate renderer-fork page
- `5bd94f8f396859ee5977c1be2a2c1707dde33deb` — actual canvas renderer replacements
- `67ff9a673c6208d946bed861d03d1f9d377b6213` — service-worker caching
- `faf018502ca1b21980a6e34227fc606a4ece97a5` — Council link and inventory record
- `158e6d76c99e76ffaf4ade475d33edb771e9f2d5` — System Atlas record

**Files:**

- `rework.html`
- `leaf-render-rework.js`
- `council-cathedral.js`
- `leaf-systems.json`
- `sw.js`

## What it does

Runs the real Leaf simulation inside a separate same-origin page and injects a renderer script into that world. The script replaces the actual drawing functions for Heart, Love, Temple, Power gyres, law and ice skirts, kept fires, and law-dressed goddesses. It does not place a post-processing overlay over the world and does not fork simulation state. Saves, ecology, law, pace, Chronicle Loom, and all behavioral systems remain the same as the main page.

The backslash key toggles between the ancestral functions and the reworked functions for direct comparison.

## Safety boundary

`index.html` does not load `leaf-render-rework.js`. The renderer is loaded only by `rework.html`, so experimental iconography cannot alter the main page.

## Reversion

Revert phrase: `revert Living Iconography`

Make a narrow revert that:

1. deletes `rework.html` and `leaf-render-rework.js`;
2. removes their shell entries from `sw.js` and increments the cache name;
3. removes the rework link/card from `council-cathedral.js` while preserving Cathedral Mirror;
4. removes only the `living-iconography` entry from `leaf-systems.json`;
5. leaves all worlds, saves, Chronicle records, and the main simulator untouched.
