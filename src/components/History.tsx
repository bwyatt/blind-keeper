import { useState, useMemo } from 'preact/hooks';
import type { Run, AnteEntry } from '../types.ts';
import { BOSS_MAP } from '../data/bosses.ts';
import { getEligibleBosses } from '../engine/availability.ts';

interface HistoryProps {
  run: Run;
  onUndo: () => void;
  onEditEntry: (index: number, entry: AnteEntry) => void;
  editingIndex: number | null;
  onSetEditingIndex: (index: number | null) => void;
}

export function History({
  run,
  onUndo,
  onEditEntry,
  editingIndex,
  onSetEditingIndex,
}: HistoryProps) {
  const reversedEntries = [...run.entries].reverse();

  return (
    <div class="history">
      <div class="history__header">
        <h2>History</h2>
        {run.entries.length > 0 && (
          <button
            class="btn"
            onClick={onUndo}
            aria-label="Undo last entry"
          >
            Undo
          </button>
        )}
      </div>

      {reversedEntries.length === 0 && (
        <p class="history__empty">
          No entries yet. Select a boss to begin tracking.
        </p>
      )}

      <ul class="history__list">
        {reversedEntries.map((entry, revIdx) => {
          const originalIdx = run.entries.length - 1 - revIdx;
          const isEditing = editingIndex === originalIdx;
          const bossName = BOSS_MAP[entry.facedBoss]?.name ?? entry.facedBoss;
          const rerolledNames = entry.rerolledBosses.map(
            (id) => BOSS_MAP[id]?.name ?? id,
          );

          return (
            <li
              key={originalIdx}
              class={`history__entry${isEditing ? ' history__entry--editing' : ''}`}
            >
              <div
                class="history__entry-summary"
                onClick={() =>
                  onSetEditingIndex(isEditing ? null : originalIdx)
                }
                onKeyDown={(e: KeyboardEvent) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSetEditingIndex(isEditing ? null : originalIdx);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-label={`Ante ${entry.anteNumber}: ${bossName}${rerolledNames.length > 0 ? `, rerolled: ${rerolledNames.join(', ')}` : ''}`}
                aria-expanded={isEditing}
              >
                <strong>Ante {entry.anteNumber}:</strong> {bossName}
                {rerolledNames.length > 0 && (
                  <span class="history__rerolled">
                    {' '}
                    (rerolled: {rerolledNames.join(', ')})
                  </span>
                )}
              </div>

              {isEditing && (
                <EditEntryForm
                  run={run}
                  entryIndex={originalIdx}
                  entry={entry}
                  onSave={(newEntry) => {
                    onEditEntry(originalIdx, newEntry);
                    onSetEditingIndex(null);
                  }}
                  onCancel={() => onSetEditingIndex(null)}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

interface EditEntryFormProps {
  run: Run;
  entryIndex: number;
  entry: AnteEntry;
  onSave: (entry: AnteEntry) => void;
  onCancel: () => void;
}

function EditEntryForm({
  run,
  entryIndex,
  entry,
  onSave,
  onCancel,
}: EditEntryFormProps) {
  const entriesBefore = useMemo(
    () => run.entries.slice(0, entryIndex),
    [run.entries, entryIndex],
  );
  const eligible = useMemo(
    () => getEligibleBosses(entriesBefore, entry.anteNumber),
    [entriesBefore, entry.anteNumber],
  );

  const [facedBoss, setFacedBoss] = useState(entry.facedBoss);
  const [rerolled, setRerolled] = useState<string[]>(entry.rerolledBosses);

  const selectFaced = (id: string) => {
    setFacedBoss(id);
    setRerolled((prev) => prev.filter((x) => x !== id));
  };

  const toggleReroll = (id: string) => {
    if (id === facedBoss) return;
    setRerolled((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    onSave({
      ...entry,
      facedBoss,
      rerolledBosses: rerolled,
    });
  };

  return (
    <div class="edit-entry">
      <p class="edit-entry__label">
        Select faced boss and toggle rerolled (↻):
      </p>
      <div class="edit-entry__bosses">
        {eligible.map((boss) => (
          <div key={boss.id} class="edit-entry__boss-row">
            <button
              class={`edit-entry__face-btn${facedBoss === boss.id ? ' edit-entry__face-btn--active' : ''}`}
              onClick={() => selectFaced(boss.id)}
              aria-pressed={facedBoss === boss.id}
              aria-label={`Select ${boss.name} as faced`}
            >
              {boss.name}
            </button>
            <button
              class={`edit-entry__reroll-btn${rerolled.includes(boss.id) ? ' edit-entry__reroll-btn--active' : ''}`}
              onClick={() => toggleReroll(boss.id)}
              disabled={boss.id === facedBoss}
              aria-pressed={rerolled.includes(boss.id)}
              aria-label={`Toggle ${boss.name} as rerolled`}
            >
              ↻
            </button>
          </div>
        ))}
      </div>
      <div class="edit-entry__actions">
        <button
          class="btn btn--primary"
          onClick={handleSave}
          aria-label="Save changes"
        >
          Save
        </button>
        <button class="btn" onClick={onCancel} aria-label="Cancel editing">
          Cancel
        </button>
      </div>
    </div>
  );
}
