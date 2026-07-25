# System Atlas

**Official change name:** System Atlas

**Primary commits:**

- `4f222c6c8005687c5808cb944c237c1c7e68b0a4` — named-system registry
- `ba95a3cedce936c803a4ced8516552651c686452` — Council visualization and notes
- `a364f4a82c2ba5cc56c12cac0b565739d42740bc` — Integration Bridge
- `89963b0ee3d5e22159701fb2ffe88b27bf7181f5` — self-record

**Files:**

- `leaf-systems.json`
- `council-atlas.js`
- `sw.js`

## What it does

Keeps a machine-readable registry of named Leaf systems with category, status, color, purpose, files, dependencies, and exact revert phrase. Council Ledger renders the registry as a dependency map and an itemized card archive. Every system card has a browser-local notes field, and those notes are included when the Council ledger is copied or dispatched.

The atlas is deliberately separate from Chronicle Loom: Chronicle Loom records what worlds do, while System Atlas records what the project is made of.

Revert phrase: `revert System Atlas`

Make a narrow revert that:

1. removes `council-atlas.js` and `leaf-systems.json`;
2. removes both files from `sw.js` shell and Council injection order;
3. preserves Chronicle Loom, Council Ledger, and all world records;
4. leaves browser-local atlas notes harmlessly stored unless Katherine explicitly asks to erase them.
