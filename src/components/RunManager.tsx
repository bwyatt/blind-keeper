import { useState } from 'preact/hooks';
import type { AppState, Run } from '../types.ts';

interface RunManagerProps {
  state: AppState;
  onCreateRun: (name: string) => void;
  onSwitchRun: (id: string) => void;
  onEndRun: (id: string) => void;
  onDeleteRun: (id: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  activeRunId: string | null;
}

export function RunManager({
  state,
  onCreateRun,
  onSwitchRun,
  onEndRun,
  onDeleteRun,
  onClearCompleted,
  onClearAll,
  activeRunId,
}: RunManagerProps) {
  const [newName, setNewName] = useState('');

  const activeRuns = state.runs.filter((r) => r.status === 'active');
  const completedRuns = state.runs.filter((r) => r.status === 'completed');

  const MAX_ACTIVE_RUNS = 10;

  const handleCreate = () => {
    if (activeRuns.length >= MAX_ACTIVE_RUNS) {
      const choice = window.confirm(
        `You have ${MAX_ACTIVE_RUNS} active runs (the maximum). Press OK to delete the oldest active run, or Cancel to go back.`,
      );
      if (!choice) return;
      // Delete the oldest active run (by creation date)
      const oldest = [...activeRuns].sort((a, b) =>
        a.createdAt.localeCompare(b.createdAt),
      )[0];
      if (oldest) onDeleteRun(oldest.id);
    }
    const name = newName.trim() || `Run ${state.runs.length + 1}`;
    onCreateRun(name);
    setNewName('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
  };

  const handleClearCompleted = () => {
    if (window.confirm('Delete all completed runs?')) {
      onClearCompleted();
    }
  };

  const handleEndRun = (run: Run) => {
    if (run.currentAnte < 39) {
      if (!window.confirm(`End "${run.name}" at Ante ${run.currentAnte}? This run hasn't reached Ante 39.`)) {
        return;
      }
    }
    onEndRun(run.id);
  };

  const handleClearAll = () => {
    if (window.confirm('Delete ALL runs? This cannot be undone.')) {
      onClearAll();
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  return (
    <div class="run-manager">
      <div class="run-manager__create">
        <input
          class="run-manager__input"
          type="text"
          value={newName}
          onInput={(e) => setNewName((e.target as HTMLInputElement).value)}
          onKeyDown={handleKeyDown}
          placeholder="Run name..."
          aria-label="New run name"
        />
        <button
          class="btn btn--primary"
          onClick={handleCreate}
          aria-label="Create new run"
        >
          New Run
        </button>
      </div>

      {activeRuns.length > 0 && (
        <div class="run-manager__section">
          <h3 class="run-manager__section-title">
            Active Runs ({activeRuns.length})
          </h3>
          <ul class="run-list">
            {activeRuns.map((run) => (
              <li
                key={run.id}
                class={`run-item${run.id === activeRunId ? ' run-item--active' : ''}`}
              >
                <div class="run-item__info">
                  <div class="run-item__name">{run.name}</div>
                  <div class="run-item__date">
                    Created {formatDate(run.createdAt)} · Ante{' '}
                    {run.currentAnte}
                  </div>
                </div>
                <div class="run-item__actions">
                  {run.id !== activeRunId && (
                    <button
                      class="btn"
                      onClick={() => onSwitchRun(run.id)}
                      aria-label={`Switch to ${run.name}`}
                    >
                      Switch
                    </button>
                  )}
                  <button
                    class="btn"
                    onClick={() => handleEndRun(run)}
                    aria-label={`End ${run.name}`}
                  >
                    End
                  </button>
                  <button
                    class="btn btn--danger"
                    onClick={() => onDeleteRun(run.id)}
                    aria-label={`Delete ${run.name}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {completedRuns.length > 0 && (
        <div class="run-manager__section">
          <h3 class="run-manager__section-title">
            Completed Runs ({completedRuns.length})
          </h3>
          <ul class="run-list">
            {completedRuns.map((run) => (
              <li key={run.id} class="run-item">
                <div class="run-item__info">
                  <div class="run-item__name">{run.name}</div>
                  <div class="run-item__date">
                    Created {formatDate(run.createdAt)} ·{' '}
                    {run.entries.length} entries
                  </div>
                </div>
                <div class="run-item__actions">
                  <button
                    class="btn btn--danger"
                    onClick={() => onDeleteRun(run.id)}
                    aria-label={`Delete ${run.name}`}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(completedRuns.length > 0 || activeRuns.length > 0) && (
        <div class="run-manager__bulk-actions">
          {completedRuns.length > 0 && (
            <button
              class="btn"
              onClick={handleClearCompleted}
              aria-label="Clear all completed runs"
            >
              Clear Completed
            </button>
          )}
          <button
            class="btn btn--danger"
            onClick={handleClearAll}
            aria-label="Clear all runs"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
}
