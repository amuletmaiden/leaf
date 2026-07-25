# Temporal Concord

**Official change name:** Temporal Concord

**Primary commits:**

- `e3ec63b9f4118306b2e86ab683bed2705346f6ba` — major ancestral counters and movement
- `19e89c84f8f886196c484304ea3d831268388f38` — star-devourer and scavenger world-time
- `9cc569488432a68b3646f33ec60fd2624873a7b1` — contagious law world-time
- `11397562f33396d2158e13ea276baf86762b7e6f` — goddess minds world-time
- `f00cf786b0173777078b89c75608184af157a40a` — integration

**Files:**

- `leaf-temporal-concord.js`
- `leaf-new-goddesses.js`
- `leaf-law.js`
- `leaf-mind.js`
- `sw.js`

## What it does

Separates consequential world-time from surface-time. Bodies, mortality, cooling, law settling, law contagion, goddess cognition, cooldowns and major travel advance according to the current Clock of Power step. Twinkle, short-lived particles, sparks, glints, trails and comparable visual texture remain tied to rendered frames rather than multiplying into a particle furnace at high pace.

The change also moves contagious-law application and the Legislative Ladder out of independent wall-clock timers and into the world frame, so leaving the tab hidden or raising pace no longer causes those systems to live on unrelated clocks.

## Downside deliberately accepted

A high pace performs more real state work and therefore consumes more CPU than a cosmetic speed-up. Clock of Power bounds collision-sensitive substeps, while Temporal Concord avoids multiplying display texture. The resulting fast-forward is intentionally closer to the same world advanced than to a cheap animation multiplier.

## Reversion

Revert phrase: `revert Temporal Concord`

Make a narrow revert that:

1. removes `leaf-temporal-concord.js` from `sw.js` shell and injection order;
2. deletes `leaf-temporal-concord.js`;
3. restores the immediately preceding versions of `leaf-new-goddesses.js`, `leaf-law.js`, and `leaf-mind.js` without disturbing later unrelated changes;
4. leaves unknown save fields intact, since older engines safely ignore them;
5. does not revert Clock of Power unless Katherine separately says `revert Clock of Power`.
