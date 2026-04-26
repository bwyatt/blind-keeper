import { describe, it, expect } from 'vitest';
import { getEligibleBosses } from './availability.ts';
import type { AnteEntry } from '../types.ts';
import { BOSSES } from '../data/bosses.ts';

const ante1BossIds = BOSSES.filter((b) => !b.isShowdown && b.minAnte <= 1).map((b) => b.id);
const showdownBossIds = BOSSES.filter((b) => b.isShowdown).map((b) => b.id);

function entry(anteNumber: number, facedBoss: string, rerolledBosses: string[] = []): AnteEntry {
  return { anteNumber, facedBoss, rerolledBosses };
}

describe('getEligibleBosses', () => {
  it('returns exactly 8 bosses for ante 1 with no history', () => {
    const result = getEligibleBosses([], 1);
    expect(result).toHaveLength(8);
    expect(result.every((b) => b.minAnte === 1 && !b.isShowdown)).toBe(true);
  });

  it('returns ante 1 bosses for ante 0', () => {
    const result = getEligibleBosses([], 0);
    expect(result).toHaveLength(8);
    expect(result.every((b) => b.minAnte === 1 && !b.isShowdown)).toBe(true);
  });

  it('returns ante 1 bosses for negative ante', () => {
    const result = getEligibleBosses([], -1);
    expect(result).toHaveLength(8);
    expect(result.every((b) => b.minAnte === 1 && !b.isShowdown)).toBe(true);
  });

  it('returns 13 bosses for ante 2 with no history', () => {
    const result = getEligibleBosses([], 2);
    expect(result).toHaveLength(13);
    expect(result.every((b) => !b.isShowdown && b.minAnte <= 2)).toBe(true);
  });

  it('returns all 23 regular bosses for ante 6 with no history', () => {
    const result = getEligibleBosses([], 6);
    expect(result).toHaveLength(23);
    expect(result.every((b) => !b.isShowdown)).toBe(true);
  });

  it('returns only 5 showdown bosses for ante 8', () => {
    const result = getEligibleBosses([], 8);
    expect(result).toHaveLength(5);
    expect(result.every((b) => b.isShowdown)).toBe(true);
  });

  it('returns only showdown bosses for ante 16', () => {
    const result = getEligibleBosses([], 16);
    expect(result).toHaveLength(5);
    expect(result.every((b) => b.isShowdown)).toBe(true);
  });

  it('sorts by minAnte ascending, then alphabetically', () => {
    const result = getEligibleBosses([], 5);
    for (let i = 1; i < result.length; i++) {
      const prev = result[i - 1];
      const curr = result[i];
      if (prev.minAnte === curr.minAnte) {
        expect(prev.name.localeCompare(curr.name)).toBeLessThanOrEqual(0);
      } else {
        expect(prev.minAnte).toBeLessThan(curr.minAnte);
      }
    }
  });

  it('removes faced bosses from eligible pool', () => {
    const entries: AnteEntry[] = [entry(1, 'the-hook')];
    const result = getEligibleBosses(entries, 2);
    expect(result.find((b) => b.id === 'the-hook')).toBeUndefined();
  });

  it('removes rerolled bosses from eligible pool', () => {
    const entries: AnteEntry[] = [
      entry(1, 'the-hook', ['the-club', 'the-psychic']),
    ];
    const result = getEligibleBosses(entries, 2);
    expect(result.find((b) => b.id === 'the-hook')).toBeUndefined();
    expect(result.find((b) => b.id === 'the-club')).toBeUndefined();
    expect(result.find((b) => b.id === 'the-psychic')).toBeUndefined();
  });

  it('resets cycle after all 8 ante-1 bosses have appeared', () => {
    // Use up all 8 ante-1 bosses across entries
    const entries: AnteEntry[] = ante1BossIds.map((id) => entry(1, id));
    // After a full cycle, all should be available again
    const result = getEligibleBosses(entries, 1);
    expect(result).toHaveLength(8);
    const resultIds = result.map((b) => b.id).sort();
    expect(resultIds).toEqual([...ante1BossIds].sort());
  });

  it('resets cycle when pool is larger than previously seen set', () => {
    // At ante 1, see all 8 bosses (full cycle for ante-1 pool)
    const entries: AnteEntry[] = ante1BossIds.map((id) => entry(1, id));
    // Now at ante 2 the pool is 13, and the cycle resets.
    // The 8 ante-1 appearances form a complete cycle of the 8-boss pool,
    // but the ante-2 pool has 13 bosses. Those 8 appearances are within
    // the current cycle for the 13-boss pool, so they should be excluded.
    const result = getEligibleBosses(entries, 2);
    // 13 - 8 = 5 remaining (the 5 ante-2 bosses haven't appeared)
    expect(result).toHaveLength(5);
    expect(result.every((b) => b.minAnte === 2)).toBe(true);
  });

  it('tracks showdown and regular cycles independently', () => {
    const entries: AnteEntry[] = [
      // Regular ante entries
      entry(1, 'the-hook'),
      entry(2, 'the-wall'),
      // Showdown ante entry
      entry(8, 'amber-acorn'),
    ];

    // Regular ante: the-hook and the-wall should be excluded
    const regular = getEligibleBosses(entries, 3);
    expect(regular.find((b) => b.id === 'the-hook')).toBeUndefined();
    expect(regular.find((b) => b.id === 'the-wall')).toBeUndefined();
    // amber-acorn should NOT affect regular pool
    expect(regular.find((b) => b.id === 'amber-acorn')).toBeUndefined(); // it's showdown

    // Showdown ante: only amber-acorn should be excluded
    const showdown = getEligibleBosses(entries, 16);
    expect(showdown.find((b) => b.id === 'amber-acorn')).toBeUndefined();
    expect(showdown).toHaveLength(4);
  });

  it('handles showdown cycle reset', () => {
    // See all 5 showdown bosses
    const entries: AnteEntry[] = showdownBossIds.map((id) => entry(8, id));
    const result = getEligibleBosses(entries, 16);
    expect(result).toHaveLength(5);
  });

  it('handles partial showdown cycle', () => {
    const entries: AnteEntry[] = [
      entry(8, 'amber-acorn', ['verdant-leaf']),
    ];
    const result = getEligibleBosses(entries, 16);
    expect(result).toHaveLength(3);
    expect(result.find((b) => b.id === 'amber-acorn')).toBeUndefined();
    expect(result.find((b) => b.id === 'verdant-leaf')).toBeUndefined();
  });

  it('counts rerolled bosses as appearances for cycle tracking', () => {
    // Reroll through 7 bosses and face 1 = all 8 ante-1 bosses seen
    const rerolled = ante1BossIds.slice(0, 7);
    const faced = ante1BossIds[7];
    const entries: AnteEntry[] = [entry(1, faced, rerolled)];
    // Full cycle complete, all should be available
    const result = getEligibleBosses(entries, 1);
    expect(result).toHaveLength(8);
  });

  it('empty entries returns all eligible bosses for the ante', () => {
    const result4 = getEligibleBosses([], 4);
    const expected = BOSSES.filter((b) => !b.isShowdown && b.minAnte <= 4);
    expect(result4).toHaveLength(expected.length);
    expect(result4).toHaveLength(18); // 8 + 5 + 2 + 3
  });

  it('regular ante after some appearances correctly filters', () => {
    const entries: AnteEntry[] = [
      entry(1, 'the-hook', ['the-club']),
      entry(2, 'the-wall'),
      entry(3, 'the-goad'),
    ];
    const result = getEligibleBosses(entries, 4);
    // Pool at ante 4 = 18 bosses, 4 have appeared
    expect(result).toHaveLength(14);
    expect(result.find((b) => b.id === 'the-hook')).toBeUndefined();
    expect(result.find((b) => b.id === 'the-club')).toBeUndefined();
    expect(result.find((b) => b.id === 'the-wall')).toBeUndefined();
    expect(result.find((b) => b.id === 'the-goad')).toBeUndefined();
  });

  it('handles multiple full cycles correctly', () => {
    // Two full cycles of ante-1 bosses + one more appearance
    const entries: AnteEntry[] = [
      ...ante1BossIds.map((id) => entry(1, id)),
      ...ante1BossIds.map((id) => entry(2, id)),
      entry(3, 'the-hook'),
    ];
    const result = getEligibleBosses(entries, 3);
    // After two full 8-boss cycles at ante 3 (pool=15), the second cycle of
    // 8 doesn't complete the 15-boss pool. So the-hook appears again and
    // is excluded.
    expect(result.find((b) => b.id === 'the-hook')).toBeUndefined();
  });

  it('ignores showdown entries when computing regular eligibility', () => {
    const entries: AnteEntry[] = [
      entry(8, 'amber-acorn'),
      entry(16, 'verdant-leaf'),
    ];
    // All regular bosses should be available for ante 5 (8+5+2+3+4 = 22)
    const result = getEligibleBosses(entries, 5);
    expect(result).toHaveLength(22);
  });

  it('ignores regular entries when computing showdown eligibility', () => {
    const entries: AnteEntry[] = [
      entry(1, 'the-hook'),
      entry(2, 'the-wall'),
      entry(3, 'the-ox'),
    ];
    const result = getEligibleBosses(entries, 8);
    expect(result).toHaveLength(5);
  });
});
