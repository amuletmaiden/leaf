# Chronicle Loom

**Official change name:** Chronicle Loom

**Primary commits:**

- `b39b66f4bd808c1ec340592ae780728c090029d7` — consequential event archive
- `bf8ab66326ec287de8ad8fa832af2a287df94726` — Fossil Orchard integration
- `68ee07a2c4b610b19041bf190e25c6aec9a8f90f` — successful pocket save/load records
- `82c50ccca7d2f3cd19fe1cae20507e25ca142767` — Integration Bridge

**Files:**

- `leaf-chronicle.js`
- `leaf-genealogy.js`
- `leaf-slots.js`
- `sw.js`

## What it does

Keeps a silent browser-local journal of consequential changes: world beginnings, count milestones, arrivals and departures, ecological appearances, great stars eaten, scavenged-garment milestones, pace changes, law waking or sleeping, first relations, and successful numbered saves or loads. Events carry seed, world-time, wall-clock time, kind, color, importance, and compact structured details. Low-importance records are pruned first after 1,200 events; deduplication keys for first occurrences remain.

Fossil Orchard now scans on world-time rather than an unrelated wall-clock interval and no longer announces new branches onscreen.

Revert phrase: `revert Chronicle Loom`

A narrow revert removes `leaf-chronicle.js`, removes its loader entries, and removes Chronicle calls from Fossil Orchard and Pocket Worlds while preserving those systems themselves. Existing local chronicle data may remain harmlessly stored unless Katherine explicitly asks to erase it.

# Memory Plates

**Official change name:** Memory Plates

**Primary commit:** `b39b66f4bd808c1ec340592ae780728c090029d7`

Important chronicle passages may retain a 240×135 WebP plate of the visible world. Plates live in IndexedDB, are captured only while the world is visible, are rate-limited, and are capped at 48 with the oldest removed first. They are visual records, not additional world saves.

Revert phrase: `revert Memory Plates`

A narrow revert disables plate capture and removes the plates panel from Council Ledger while preserving Chronicle Loom's textual event archive.

# Archive Constellation

**Official change name:** Archive Constellation

**Primary commits:**

- `926f1df3a990e7baaf98a383ddf3de5fedba4d42` — Council Ledger visualization
- `82c50ccca7d2f3cd19fe1cae20507e25ca142767` — Integration Bridge

**File:** `council-chronicle.js`

Renders Chronicle Loom as filterable seed-lanes, colored event points, hover details, recent-record lists, archive statistics, and Memory Plates. Chronicle summaries and recent major passages are included when Council Ledger is copied or dispatched.

Revert phrase: `revert Archive Constellation`

A narrow revert removes `council-chronicle.js` and its service-worker loader entries while leaving Chronicle Loom and all local records intact.
