import { useCallback } from 'preact/hooks';
import type { Run, AnteEntry } from '../types.ts';

const MAX_ANTE = 39;
const MAX_DECREMENTS = 2;

export function useAnteActions(
  run: Run | null,
  updateRun: (run: Run) => void,
  endRun: (runId: string) => void,
) {
  const addEntry = useCallback(
    (facedBossId: string, rerolledBossIds: string[]) => {
      if (!run) return;

      const entry: AnteEntry = {
        anteNumber: run.currentAnte,
        facedBoss: facedBossId,
        rerolledBosses: rerolledBossIds,
      };

      if (run.currentAnte >= MAX_ANTE) {
        // Auto-complete: add entry then end the run
        updateRun({ ...run, entries: [...run.entries, entry] });
        endRun(run.id);
      } else {
        updateRun({
          ...run,
          entries: [...run.entries, entry],
          currentAnte: run.currentAnte + 1,
        });
      }
    },
    [run, updateRun, endRun],
  );

  const undoLastEntry = useCallback(() => {
    if (!run || run.entries.length === 0) return;

    const lastEntry = run.entries[run.entries.length - 1];
    updateRun({
      ...run,
      entries: run.entries.slice(0, -1),
      currentAnte: lastEntry.anteNumber,
    });
  }, [run, updateRun]);

  const editEntry = useCallback(
    (index: number, entry: AnteEntry) => {
      if (!run) return;

      const newEntries = run.entries.map((e, i) => (i === index ? entry : e));
      const maxAnte = newEntries.reduce(
        (max, e) => Math.max(max, e.anteNumber),
        0,
      );
      const newCurrentAnte = Math.min(maxAnte + 1, MAX_ANTE);

      updateRun({
        ...run,
        entries: newEntries,
        currentAnte: newEntries.length === 0 ? 1 : newCurrentAnte,
      });
    },
    [run, updateRun],
  );

  const decrementAnte = useCallback(() => {
    if (!run) return;
    if ((run.anteDecrements ?? 0) >= MAX_DECREMENTS) return;
    if (!window.confirm(`Go back to Ante ${run.currentAnte - 1}?`)) return;
    updateRun({
      ...run,
      currentAnte: run.currentAnte - 1,
      anteDecrements: (run.anteDecrements ?? 0) + 1,
    });
  }, [run, updateRun]);

  return { addEntry, undoLastEntry, editEntry, decrementAnte };
}
