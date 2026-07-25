# Clock of Power

**Official change name:** Clock of Power

**Primary commit:** `b3cc131471f1f3d1d7c76e43fbd5b80886bca663`

**Integration commits:** `183d3294d4c715688aa4e265a9922ae3a5c5cecc`, `cdaf37f904d0982b110fb84220e72fbc08526ed3`

**Files:**

- `leaf-clock-of-power.js`
- `leaf-crown.js` — routes the existing `pace` command through the clock
- `sw.js` — loads the clock after world-behaviour wrappers and before commands

## What it does

Unifies the former partial pace systems into one bounded public clock from 0.1 to 500. A requested pace above the collision-safe motion step of 40 is divided into hidden world substeps, with only the final substep painted to the display. The four great walker paths advance by world-time rather than rendered frames. Per-step probability uses compounded survival probability rather than linear multiplication. Requested pace and clock phase are preserved in saves and restored consistently.

## Reversion

Revert phrase: `revert Clock of Power`

Make a narrow revert that:

1. removes `leaf-clock-of-power.js` from `sw.js` shell and injection order;
2. deletes `leaf-clock-of-power.js`;
3. restores the `pace` command in `leaf-crown.js` to direct assignment, while preserving unrelated later command changes;
4. does not roll back worlds or erase `clockOfPower` fields from existing saves—older engines safely ignore unknown fields.
