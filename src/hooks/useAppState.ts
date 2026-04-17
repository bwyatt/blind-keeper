import { useState, useCallback, useEffect } from 'preact/hooks';
import type { AppState, Run } from '../types.ts';

const STORAGE_KEY = 'blind-keeper-data';
const MAX_ACTIVE_RUNS = 10;
const MAX_COMPLETED_RUNS = 10;

const DEFAULT_STATE: AppState = { activeRunId: null, runs: [] };

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
  } catch {
    // Corrupt or missing data — fall back to default
  }
  return DEFAULT_STATE;
}

export function useAppState() {
  const [state, setState] = useState<AppState>(loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const createRun = useCallback((name: string) => {
    setState((prev) => {
      const activeCount = prev.runs.filter((r) => r.status === 'active').length;
      if (activeCount >= MAX_ACTIVE_RUNS) return prev;

      const newRun: Run = {
        id: crypto.randomUUID(),
        name,
        createdAt: new Date().toISOString(),
        status: 'active',
        currentAnte: 1,
        anteDecrements: 0,
        entries: [],
      };

      return {
        activeRunId: newRun.id,
        runs: [...prev.runs, newRun],
      };
    });
  }, []);

  const switchRun = useCallback((runId: string) => {
    setState((prev) => ({ ...prev, activeRunId: runId }));
  }, []);

  const endRun = useCallback((runId: string) => {
    setState((prev) => {
      let runs = prev.runs.map((r) =>
        r.id === runId ? { ...r, status: 'completed' as const } : r,
      );

      // Evict oldest completed runs beyond the limit
      const completed = runs.filter((r) => r.status === 'completed');
      if (completed.length > MAX_COMPLETED_RUNS) {
        const toEvict = completed
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
          .slice(0, completed.length - MAX_COMPLETED_RUNS);
        const evictIds = new Set(toEvict.map((r) => r.id));
        runs = runs.filter((r) => !evictIds.has(r.id));
      }

      return {
        activeRunId: prev.activeRunId === runId ? null : prev.activeRunId,
        runs,
      };
    });
  }, []);

  const deleteRun = useCallback((runId: string) => {
    setState((prev) => ({
      activeRunId: prev.activeRunId === runId ? null : prev.activeRunId,
      runs: prev.runs.filter((r) => r.id !== runId),
    }));
  }, []);

  const clearCompleted = useCallback(() => {
    setState((prev) => ({
      ...prev,
      runs: prev.runs.filter((r) => r.status !== 'completed'),
    }));
  }, []);

  const clearAll = useCallback(() => {
    setState({ activeRunId: null, runs: [] });
  }, []);

  const updateRun = useCallback((run: Run) => {
    setState((prev) => ({
      ...prev,
      runs: prev.runs.map((r) => (r.id === run.id ? run : r)),
    }));
  }, []);

  const activeRun = state.runs.find((r) => r.id === state.activeRunId) ?? null;

  return {
    state,
    activeRun,
    createRun,
    switchRun,
    endRun,
    deleteRun,
    clearCompleted,
    clearAll,
    updateRun,
  };
}
