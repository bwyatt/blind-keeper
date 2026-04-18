import { render } from '@testing-library/preact';
import { describe, it, expect } from 'vitest';
import { BossPillList } from './BossPillList.tsx';

describe('BossPillList', () => {
  it('returns null when items is empty', () => {
    const { container } = render(<BossPillList label="Faced" items={[]} />);
    expect(container.innerHTML).toBe('');
  });

  it('renders label and boss names', () => {
    const items = [
      { id: 'the-hook' },
      { id: 'the-club' },
    ];
    const { getByText } = render(
      <BossPillList label="Rerolled" items={items} />,
    );

    expect(getByText('Rerolled:')).toBeInTheDocument();
    expect(getByText('The Hook')).toBeInTheDocument();
    expect(getByText('The Club')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    const items = [{ id: 'the-hook', subtitle: '(Ante 3)' }];
    const { getByText } = render(
      <BossPillList label="Faced" items={items} />,
    );

    expect(getByText('(Ante 3)')).toBeInTheDocument();
  });

  it('falls back to id when boss is not in BOSS_MAP', () => {
    const items = [{ id: 'unknown-boss' }];
    const { getByText } = render(
      <BossPillList label="Faced" items={items} />,
    );

    expect(getByText('unknown-boss')).toBeInTheDocument();
  });

  it('renders unique keys for duplicate boss ids', () => {
    const items = [
      { id: 'the-hook', subtitle: '(1)' },
      { id: 'the-hook', subtitle: '(3)' },
    ];
    const { getAllByText } = render(
      <BossPillList label="Faced" items={items} />,
    );

    expect(getAllByText('The Hook')).toHaveLength(2);
  });

  it('sets aria-label from the label prop', () => {
    const items = [{ id: 'the-hook' }];
    const { getByLabelText } = render(
      <BossPillList label="Rerolled" items={items} />,
    );

    expect(getByLabelText('Rerolled')).toBeInTheDocument();
  });
});
