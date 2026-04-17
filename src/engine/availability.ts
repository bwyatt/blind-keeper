import type { AnteEntry } from '../types.ts';
import type { BossBlind } from '../data/bosses.ts';
import { BOSSES } from '../data/bosses.ts';

function sortBosses(bosses: BossBlind[]): BossBlind[] {
  return [...bosses].sort((a, b) => {
    if (a.minAnte !== b.minAnte) return a.minAnte - b.minAnte;
    return a.name.localeCompare(b.name);
  });
}

/**
 * Returns the boss IDs that have appeared since the last full cycle reset.
 *
 * Walk through appearances in order. Whenever every boss in the eligible pool
 * has been seen, reset the tracking set and keep going. The remaining set after
 * the walk represents appearances in the current (incomplete) cycle.
 */
function getAppearancesSinceLastReset(
  appearances: string[],
  eligibleIds: Set<string>,
): Set<string> {
  let seen = new Set<string>();

  for (const id of appearances) {
    if (!eligibleIds.has(id)) continue;
    seen.add(id);
    // Full cycle: every eligible boss has appeared — reset
    if (seen.size === eligibleIds.size) {
      seen = new Set<string>();
    }
  }

  return seen;
}

export function getEligibleBosses(
  entries: AnteEntry[],
  currentAnte: number,
): BossBlind[] {
  const isShowdownAnte = currentAnte % 8 === 0;

  // Determine the pool based on ante type
  const pool = BOSSES.filter((boss) => {
    if (isShowdownAnte) return boss.isShowdown;
    return !boss.isShowdown && boss.minAnte <= currentAnte;
  });

  if (pool.length === 0) return [];

  const poolIds = new Set(pool.map((b) => b.id));

  // Gather ordered appearances from entries in the same category
  const appearances: string[] = [];
  for (const entry of entries) {
    const entryIsShowdown = entry.anteNumber % 8 === 0;
    if (entryIsShowdown !== isShowdownAnte) continue;

    for (const id of entry.rerolledBosses) {
      appearances.push(id);
    }
    appearances.push(entry.facedBoss);
  }

  const seenSinceReset = getAppearancesSinceLastReset(appearances, poolIds);

  // Remove bosses seen in the current cycle
  const eligible = pool.filter((boss) => !seenSinceReset.has(boss.id));

  // If all were filtered out (shouldn't happen with correct reset logic),
  // fall back to the full pool.
  if (eligible.length === 0) return sortBosses(pool);

  return sortBosses(eligible);
}
