import { renderHook, act } from '@testing-library/preact';
import { describe, it, expect, beforeEach } from 'vitest';
import { useAppState } from './useAppState.ts';

describe('useAppState', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initial state loads empty', () => {
    const { result } = renderHook(() => useAppState());
    expect(result.current.state).toEqual({ activeRunId: null, runs: [] });
    expect(result.current.activeRun).toBeNull();
  });

  it('createRun creates a run and sets it active', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.createRun('Run 1');
    });

    expect(result.current.state.runs).toHaveLength(1);
    expect(result.current.state.runs[0].name).toBe('Run 1');
    expect(result.current.state.runs[0].status).toBe('active');
    expect(result.current.state.runs[0].currentAnte).toBe(1);
    expect(result.current.state.runs[0].entries).toEqual([]);
    expect(result.current.state.activeRunId).toBe(
      result.current.state.runs[0].id,
    );
    expect(result.current.activeRun).toEqual(result.current.state.runs[0]);
  });

  it('switchRun changes activeRunId', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.createRun('Run 1');
    });
    act(() => {
      result.current.createRun('Run 2');
    });

    const run1Id = result.current.state.runs[0].id;

    act(() => {
      result.current.switchRun(run1Id);
    });

    expect(result.current.state.activeRunId).toBe(run1Id);
  });

  it('endRun marks run completed', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.createRun('Run 1');
    });

    const runId = result.current.state.runs[0].id;

    act(() => {
      result.current.endRun(runId);
    });

    expect(result.current.state.runs[0].status).toBe('completed');
    expect(result.current.state.activeRunId).toBeNull();
  });

  it('deleteRun removes run', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.createRun('Run 1');
    });

    const runId = result.current.state.runs[0].id;

    act(() => {
      result.current.deleteRun(runId);
    });

    expect(result.current.state.runs).toHaveLength(0);
    expect(result.current.state.activeRunId).toBeNull();
  });

  it('clearAll clears everything', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.createRun('Run 1');
    });
    act(() => {
      result.current.createRun('Run 2');
    });

    act(() => {
      result.current.clearAll();
    });

    expect(result.current.state).toEqual({ activeRunId: null, runs: [] });
  });

  it('clearCompleted removes only completed runs', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.createRun('Run 1');
    });
    act(() => {
      result.current.createRun('Run 2');
    });

    const run1Id = result.current.state.runs[0].id;

    act(() => {
      result.current.endRun(run1Id);
    });

    act(() => {
      result.current.clearCompleted();
    });

    expect(result.current.state.runs).toHaveLength(1);
    expect(result.current.state.runs[0].name).toBe('Run 2');
  });

  it('max 10 active runs enforced', () => {
    const { result } = renderHook(() => useAppState());

    for (let i = 0; i < 12; i++) {
      act(() => {
        result.current.createRun(`Run ${i + 1}`);
      });
    }

    const activeRuns = result.current.state.runs.filter(
      (r) => r.status === 'active',
    );
    expect(activeRuns).toHaveLength(10);
  });

  it('max 10 completed runs evicts oldest', () => {
    const { result } = renderHook(() => useAppState());

    // Create and complete 10 runs
    for (let i = 0; i < 10; i++) {
      act(() => {
        result.current.createRun(`Run ${i + 1}`);
      });
      const runId =
        result.current.state.runs[result.current.state.runs.length - 1].id;
      act(() => {
        result.current.endRun(runId);
      });
    }

    expect(
      result.current.state.runs.filter((r) => r.status === 'completed'),
    ).toHaveLength(10);

    // Create and complete an 11th run — should evict the oldest
    act(() => {
      result.current.createRun('Run 11');
    });
    const run11Id =
      result.current.state.runs.find((r) => r.name === 'Run 11')!.id;
    act(() => {
      result.current.endRun(run11Id);
    });

    const completedRuns = result.current.state.runs.filter(
      (r) => r.status === 'completed',
    );
    expect(completedRuns).toHaveLength(10);
    // The first run should have been evicted
    expect(completedRuns.find((r) => r.name === 'Run 1')).toBeUndefined();
    expect(completedRuns.find((r) => r.name === 'Run 2')).toBeDefined();
    expect(completedRuns.find((r) => r.name === 'Run 11')).toBeDefined();
  });

  it('state persists to localStorage', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.createRun('Persisted Run');
    });

    const stored = JSON.parse(
      localStorage.getItem('blind-keeper-data') ?? '{}',
    );
    expect(stored.runs).toHaveLength(1);
    expect(stored.runs[0].name).toBe('Persisted Run');
  });

  it('loads state from localStorage on mount', () => {
    const preloadedState = {
      activeRunId: 'test-id',
      runs: [
        {
          id: 'test-id',
          name: 'Preloaded',
          createdAt: new Date().toISOString(),
          status: 'active',
          currentAnte: 5,
          anteDecrements: 0,
          entries: [],
        },
      ],
    };
    localStorage.setItem('blind-keeper-data', JSON.stringify(preloadedState));

    const { result } = renderHook(() => useAppState());

    expect(result.current.state.runs).toHaveLength(1);
    expect(result.current.state.runs[0].name).toBe('Preloaded');
    expect(result.current.activeRun?.name).toBe('Preloaded');
  });

  it('updateRun replaces a run by id', () => {
    const { result } = renderHook(() => useAppState());

    act(() => {
      result.current.createRun('Original');
    });

    const run = result.current.state.runs[0];

    act(() => {
      result.current.updateRun({ ...run, name: 'Updated' });
    });

    expect(result.current.state.runs[0].name).toBe('Updated');
  });
});
