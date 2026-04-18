import { render, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { History } from './History.tsx';
import type { Run } from '../types.ts';

function makeRun(overrides: Partial<Run> = {}): Run {
  return {
    id: 'run-1',
    name: 'Test Run',
    createdAt: new Date().toISOString(),
    status: 'active',
    currentAnte: 3,
    anteDecrements: 0,
    entries: [
      { anteNumber: 1, facedBoss: 'the-hook', rerolledBosses: ['the-club'] },
      { anteNumber: 2, facedBoss: 'the-wall', rerolledBosses: [] },
    ],
    ...overrides,
  };
}

describe('History', () => {
  it('renders entries in reverse order', () => {
    const run = makeRun();
    const { getAllByRole } = render(
      <History
        run={run}
        onUndo={() => {}}
        onEditEntry={() => {}}
        editingIndex={null}
        onSetEditingIndex={() => {}}
      />,
    );

    const items = getAllByRole('button', { name: /^Ante/ });
    expect(items[0]).toHaveAccessibleName(expect.stringContaining('Ante 2'));
    expect(items[1]).toHaveAccessibleName(
      expect.stringContaining('Ante 1'),
    );
  });

  it('shows empty message when there are no entries', () => {
    const run = makeRun({ entries: [] });
    const { getByText } = render(
      <History
        run={run}
        onUndo={() => {}}
        onEditEntry={() => {}}
        editingIndex={null}
        onSetEditingIndex={() => {}}
      />,
    );

    expect(
      getByText('No entries yet. Select a boss to begin tracking.'),
    ).toBeInTheDocument();
  });

  it('calls onUndo when Undo button is clicked', () => {
    const onUndo = vi.fn();
    const run = makeRun();
    const { getByLabelText } = render(
      <History
        run={run}
        onUndo={onUndo}
        onEditEntry={() => {}}
        editingIndex={null}
        onSetEditingIndex={() => {}}
      />,
    );

    fireEvent.click(getByLabelText('Undo last entry'));
    expect(onUndo).toHaveBeenCalled();
  });

  it('does not show Undo button when there are no entries', () => {
    const run = makeRun({ entries: [] });
    const { queryByLabelText } = render(
      <History
        run={run}
        onUndo={() => {}}
        onEditEntry={() => {}}
        editingIndex={null}
        onSetEditingIndex={() => {}}
      />,
    );

    expect(queryByLabelText('Undo last entry')).toBeNull();
  });

  it('calls onSetEditingIndex when an entry is clicked', () => {
    const onSetEditingIndex = vi.fn();
    const run = makeRun();
    const { getByLabelText } = render(
      <History
        run={run}
        onUndo={() => {}}
        onEditEntry={() => {}}
        editingIndex={null}
        onSetEditingIndex={onSetEditingIndex}
      />,
    );

    // Click the first displayed entry (Ante 2, which is originalIdx 1)
    fireEvent.click(getByLabelText(/^Ante 2/));
    expect(onSetEditingIndex).toHaveBeenCalledWith(1);
  });

  it('shows edit form when editingIndex matches an entry', () => {
    const run = makeRun();
    const { getByLabelText } = render(
      <History
        run={run}
        onUndo={() => {}}
        onEditEntry={() => {}}
        editingIndex={0}
        onSetEditingIndex={() => {}}
      />,
    );

    expect(getByLabelText('Save changes')).toBeInTheDocument();
    expect(getByLabelText('Cancel editing')).toBeInTheDocument();
  });

  it('displays rerolled bosses in the summary', () => {
    const run = makeRun();
    const { getByText } = render(
      <History
        run={run}
        onUndo={() => {}}
        onEditEntry={() => {}}
        editingIndex={null}
        onSetEditingIndex={() => {}}
      />,
    );

    expect(getByText(/rerolled: The Club/)).toBeInTheDocument();
  });
});
