import { renderHook, act } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { useAnteActions } from './useAnteActions.ts';
import type { Run } from '../types.ts';

function makeRun(overrides: Partial<Run> = {}): Run {
  return {
    id: 'run-1',
    name: 'Test Run',
    createdAt: new Date().toISOString(),
    status: 'active',
    currentAnte: 1,
    entries: [],
    ...overrides,
  };
}

describe('useAnteActions', () => {
  it('addEntry appends entry and auto-advances ante', () => {
    const run = makeRun({ currentAnte: 3 });
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(run, updateRun, endRun));

    act(() => {
      result.current.addEntry('the-hook', ['the-club']);
    });

    expect(updateRun).toHaveBeenCalledOnce();
    const updated = updateRun.mock.calls[0][0];
    expect(updated.entries).toHaveLength(1);
    expect(updated.entries[0]).toEqual({
      anteNumber: 3,
      facedBoss: 'the-hook',
      rerolledBosses: ['the-club'],
    });
    expect(updated.currentAnte).toBe(4);
    expect(endRun).not.toHaveBeenCalled();
  });

  it('addEntry auto-completes run at ante 39', () => {
    const run = makeRun({ currentAnte: 39 });
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(run, updateRun, endRun));

    act(() => {
      result.current.addEntry('the-hook', []);
    });

    expect(updateRun).toHaveBeenCalledOnce();
    const updated = updateRun.mock.calls[0][0];
    expect(updated.entries).toHaveLength(1);
    expect(updated.entries[0].anteNumber).toBe(39);
    expect(endRun).toHaveBeenCalledWith('run-1');
  });

  it('addEntry does nothing when run is null', () => {
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(null, updateRun, endRun));

    act(() => {
      result.current.addEntry('the-hook', []);
    });

    expect(updateRun).not.toHaveBeenCalled();
    expect(endRun).not.toHaveBeenCalled();
  });

  it('undoLastEntry removes last entry and restores ante', () => {
    const run = makeRun({
      currentAnte: 4,
      entries: [
        { anteNumber: 1, facedBoss: 'the-hook', rerolledBosses: [] },
        { anteNumber: 2, facedBoss: 'the-wall', rerolledBosses: [] },
        { anteNumber: 3, facedBoss: 'the-ox', rerolledBosses: [] },
      ],
    });
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(run, updateRun, endRun));

    act(() => {
      result.current.undoLastEntry();
    });

    expect(updateRun).toHaveBeenCalledOnce();
    const updated = updateRun.mock.calls[0][0];
    expect(updated.entries).toHaveLength(2);
    expect(updated.currentAnte).toBe(3);
  });

  it('undoLastEntry does nothing with no entries', () => {
    const run = makeRun();
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(run, updateRun, endRun));

    act(() => {
      result.current.undoLastEntry();
    });

    expect(updateRun).not.toHaveBeenCalled();
  });

  it('undoLastEntry does nothing when run is null', () => {
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(null, updateRun, endRun));

    act(() => {
      result.current.undoLastEntry();
    });

    expect(updateRun).not.toHaveBeenCalled();
  });

  it('editEntry replaces entry and recalculates currentAnte', () => {
    const run = makeRun({
      currentAnte: 4,
      entries: [
        { anteNumber: 1, facedBoss: 'the-hook', rerolledBosses: [] },
        { anteNumber: 2, facedBoss: 'the-wall', rerolledBosses: [] },
        { anteNumber: 3, facedBoss: 'the-ox', rerolledBosses: [] },
      ],
    });
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(run, updateRun, endRun));

    act(() => {
      result.current.editEntry(1, {
        anteNumber: 2,
        facedBoss: 'the-fish',
        rerolledBosses: ['the-wall'],
      });
    });

    expect(updateRun).toHaveBeenCalledOnce();
    const updated = updateRun.mock.calls[0][0];
    expect(updated.entries[1].facedBoss).toBe('the-fish');
    expect(updated.entries[1].rerolledBosses).toEqual(['the-wall']);
    expect(updated.currentAnte).toBe(4); // max ante 3 + 1
  });

  it('editEntry does nothing when run is null', () => {
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(null, updateRun, endRun));

    act(() => {
      result.current.editEntry(0, {
        anteNumber: 1,
        facedBoss: 'the-hook',
        rerolledBosses: [],
      });
    });

    expect(updateRun).not.toHaveBeenCalled();
  });

  it('editEntry caps currentAnte at MAX_ANTE', () => {
    const run = makeRun({
      currentAnte: 39,
      entries: [
        { anteNumber: 38, facedBoss: 'the-hook', rerolledBosses: [] },
        { anteNumber: 39, facedBoss: 'the-wall', rerolledBosses: [] },
      ],
    });
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(run, updateRun, endRun));

    act(() => {
      result.current.editEntry(1, {
        anteNumber: 39,
        facedBoss: 'the-fish',
        rerolledBosses: [],
      });
    });

    const updated = updateRun.mock.calls[0][0];
    expect(updated.currentAnte).toBe(39); // capped at MAX_ANTE
  });

  it('decrementAnte reduces currentAnte by 1', () => {
    const run = makeRun({ currentAnte: 5 });
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(run, updateRun, endRun));

    act(() => {
      result.current.decrementAnte();
    });

    expect(updateRun).toHaveBeenCalledOnce();
    const updated = updateRun.mock.calls[0][0];
    expect(updated.currentAnte).toBe(4);
  });

  it('decrementAnte does nothing at ante 1', () => {
    const run = makeRun({ currentAnte: 1 });
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(run, updateRun, endRun));

    act(() => {
      result.current.decrementAnte();
    });

    expect(updateRun).not.toHaveBeenCalled();
  });

  it('decrementAnte does nothing when run is null', () => {
    const updateRun = vi.fn();
    const endRun = vi.fn();

    const { result } = renderHook(() => useAnteActions(null, updateRun, endRun));

    act(() => {
      result.current.decrementAnte();
    });

    expect(updateRun).not.toHaveBeenCalled();
  });
});
