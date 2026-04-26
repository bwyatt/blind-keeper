import { render, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RunManager } from './RunManager.tsx';
import type { AppState, Run } from '../types.ts';

function makeRun(overrides: Partial<Run> = {}): Run {
  return {
    id: crypto.randomUUID(),
    name: 'Test Run',
    createdAt: new Date().toISOString(),
    status: 'active',
    currentAnte: 1,
    anteDecrements: 0,
    entries: [],
    ...overrides,
  };
}

describe('RunManager', () => {
  const defaultProps = () => ({
    onCreateRun: vi.fn(),
    onSwitchRun: vi.fn(),
    onEndRun: vi.fn(),
    onDeleteRun: vi.fn(),
    onClearCompleted: vi.fn(),
    onClearAll: vi.fn(),
  });

  it('creates a run when New Run button is clicked', () => {
    const props = defaultProps();
    const state: AppState = { activeRunId: null, runs: [] };
    const { getByLabelText, getByPlaceholderText } = render(
      <RunManager state={state} activeRunId={null} {...props} />,
    );

    const input = getByPlaceholderText('Run name...');
    fireEvent.input(input, { target: { value: 'My Run' } });
    fireEvent.click(getByLabelText('Create new run'));

    expect(props.onCreateRun).toHaveBeenCalledWith('My Run');
  });

  it('creates a run with default name when input is empty', () => {
    const props = defaultProps();
    const state: AppState = { activeRunId: null, runs: [] };
    const { getByLabelText } = render(
      <RunManager state={state} activeRunId={null} {...props} />,
    );

    fireEvent.click(getByLabelText('Create new run'));

    expect(props.onCreateRun).toHaveBeenCalledWith('Run 1');
  });

  it('creates a run on Enter key in input', () => {
    const props = defaultProps();
    const state: AppState = { activeRunId: null, runs: [] };
    const { getByPlaceholderText } = render(
      <RunManager state={state} activeRunId={null} {...props} />,
    );

    const input = getByPlaceholderText('Run name...');
    fireEvent.input(input, { target: { value: 'Key Run' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(props.onCreateRun).toHaveBeenCalledWith('Key Run');
  });

  it('switches to a different run', () => {
    const props = defaultProps();
    const run1 = makeRun({ name: 'Run 1' });
    const run2 = makeRun({ name: 'Run 2' });
    const state: AppState = { activeRunId: run1.id, runs: [run1, run2] };
    const { getByLabelText } = render(
      <RunManager state={state} activeRunId={run1.id} {...props} />,
    );

    fireEvent.click(getByLabelText('Switch to Run 2'));

    expect(props.onSwitchRun).toHaveBeenCalledWith(run2.id);
  });

  it('does not show Switch button for the active run', () => {
    const props = defaultProps();
    const run = makeRun({ name: 'Active Run' });
    const state: AppState = { activeRunId: run.id, runs: [run] };
    const { queryByLabelText } = render(
      <RunManager state={state} activeRunId={run.id} {...props} />,
    );

    expect(queryByLabelText('Switch to Active Run')).toBeNull();
  });

  it('deletes a run', () => {
    const props = defaultProps();
    const run = makeRun({ name: 'Delete Me' });
    const state: AppState = { activeRunId: run.id, runs: [run] };
    const { getByLabelText } = render(
      <RunManager state={state} activeRunId={run.id} {...props} />,
    );

    fireEvent.click(getByLabelText('Delete Delete Me'));

    expect(props.onDeleteRun).toHaveBeenCalledWith(run.id);
  });

  describe('end run confirmation (FR-24)', () => {
    let confirmSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      confirmSpy = vi.spyOn(window, 'confirm');
    });

    afterEach(() => {
      confirmSpy.mockRestore();
    });

    it('confirms before ending a run below ante 39', () => {
      confirmSpy.mockReturnValue(true);
      const props = defaultProps();
      const run = makeRun({ name: 'Early Run', currentAnte: 5 });
      const state: AppState = { activeRunId: run.id, runs: [run] };
      const { getByLabelText } = render(
        <RunManager state={state} activeRunId={run.id} {...props} />,
      );

      fireEvent.click(getByLabelText('End Early Run'));

      expect(confirmSpy).toHaveBeenCalled();
      expect(props.onEndRun).toHaveBeenCalledWith(run.id);
    });

    it('does not end run if user cancels confirmation', () => {
      confirmSpy.mockReturnValue(false);
      const props = defaultProps();
      const run = makeRun({ name: 'Keep Going', currentAnte: 10 });
      const state: AppState = { activeRunId: run.id, runs: [run] };
      const { getByLabelText } = render(
        <RunManager state={state} activeRunId={run.id} {...props} />,
      );

      fireEvent.click(getByLabelText('End Keep Going'));

      expect(confirmSpy).toHaveBeenCalled();
      expect(props.onEndRun).not.toHaveBeenCalled();
    });

    it('ends run at ante 39 without confirmation', () => {
      confirmSpy.mockReturnValue(false); // should not be called
      const props = defaultProps();
      const run = makeRun({ name: 'Done Run', currentAnte: 39 });
      const state: AppState = { activeRunId: run.id, runs: [run] };
      const { getByLabelText } = render(
        <RunManager state={state} activeRunId={run.id} {...props} />,
      );

      fireEvent.click(getByLabelText('End Done Run'));

      expect(confirmSpy).not.toHaveBeenCalled();
      expect(props.onEndRun).toHaveBeenCalledWith(run.id);
    });
  });

  describe('active run limit prompt (FR-26)', () => {
    let confirmSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
      confirmSpy = vi.spyOn(window, 'confirm');
    });

    afterEach(() => {
      confirmSpy.mockRestore();
    });

    it('prompts when creating an 11th active run', () => {
      confirmSpy.mockReturnValue(true);
      const props = defaultProps();
      const runs = Array.from({ length: 10 }, (_, i) =>
        makeRun({ name: `Run ${i + 1}` }),
      );
      const state: AppState = { activeRunId: runs[0].id, runs };
      const { getByLabelText } = render(
        <RunManager state={state} activeRunId={runs[0].id} {...props} />,
      );

      fireEvent.click(getByLabelText('Create new run'));

      expect(confirmSpy).toHaveBeenCalled();
      expect(props.onDeleteRun).toHaveBeenCalled();
      expect(props.onCreateRun).toHaveBeenCalled();
    });

    it('does not create run if user cancels limit prompt', () => {
      confirmSpy.mockReturnValue(false);
      const props = defaultProps();
      const runs = Array.from({ length: 10 }, (_, i) =>
        makeRun({ name: `Run ${i + 1}` }),
      );
      const state: AppState = { activeRunId: runs[0].id, runs };
      const { getByLabelText } = render(
        <RunManager state={state} activeRunId={runs[0].id} {...props} />,
      );

      fireEvent.click(getByLabelText('Create new run'));

      expect(confirmSpy).toHaveBeenCalled();
      expect(props.onDeleteRun).not.toHaveBeenCalled();
      expect(props.onCreateRun).not.toHaveBeenCalled();
    });
  });
});
