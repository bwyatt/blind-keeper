import { render, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { TopBar } from './TopBar.tsx';
import type { Run } from '../types.ts';

function makeRun(overrides: Partial<Run> = {}): Run {
  return {
    id: crypto.randomUUID(),
    name: 'Test Run',
    createdAt: new Date().toISOString(),
    status: 'active',
    currentAnte: 3,
    anteDecrements: 0,
    entries: [],
    ...overrides,
  };
}

const defaultProps = () => ({
  theme: 'dark' as const,
  onToggleTheme: vi.fn(),
  onDecrementAnte: vi.fn(),
  onAbandonRun: vi.fn(),
});

describe('TopBar', () => {
  it('renders the app title', () => {
    const { getByText } = render(<TopBar run={null} {...defaultProps()} />);
    expect(getByText('Blind Keeper')).toBeInTheDocument();
  });

  it('does not show abandon button when there is no active run', () => {
    const { queryByLabelText } = render(<TopBar run={null} {...defaultProps()} />);
    expect(queryByLabelText('Abandon run and start new')).toBeNull();
  });

  it('shows abandon button when there is an active run', () => {
    const run = makeRun();
    const { getByLabelText } = render(<TopBar run={run} {...defaultProps()} />);
    expect(getByLabelText('Abandon run and start new')).toBeInTheDocument();
  });

  it('does not show run name in the title bar', () => {
    const run = makeRun({ name: 'My Special Run' });
    const { queryByText } = render(<TopBar run={run} {...defaultProps()} />);
    expect(queryByText('My Special Run')).toBeNull();
  });

  it('shows current ante when a run is active', () => {
    const run = makeRun({ currentAnte: 5 });
    const { getByText } = render(<TopBar run={run} {...defaultProps()} />);
    expect(getByText('Ante 5')).toBeInTheDocument();
  });

  describe('abandon run button', () => {
    it('calls onAbandonRun when abandon button is clicked', () => {
      const props = defaultProps();
      const run = makeRun();
      const { getByLabelText } = render(<TopBar run={run} {...props} />);

      fireEvent.click(getByLabelText('Abandon run and start new'));

      expect(props.onAbandonRun).toHaveBeenCalled();
    });
  });
});
