import { render, fireEvent } from '@testing-library/preact';
import { describe, it, expect, vi } from 'vitest';
import { BossGrid } from './BossGrid.tsx';
import type { BossBlind } from '../data/bosses.ts';

const sampleBosses: BossBlind[] = [
  { id: 'the-hook', name: 'The Hook', minAnte: 1, isShowdown: false, icon: 'images/bosses/the-hook.png' },
  { id: 'the-club', name: 'The Club', minAnte: 1, isShowdown: false, icon: 'images/bosses/the-club.png' },
  { id: 'the-psychic', name: 'The Psychic', minAnte: 1, isShowdown: false, icon: 'images/bosses/the-psychic.png' },
];

describe('BossGrid', () => {
  it('renders all eligible bosses', () => {
    const { getByText } = render(
      <BossGrid
        eligibleBosses={sampleBosses}
        rerolledBosses={[]}
        onFace={() => {}}
        onReroll={() => {}}
      />,
    );

    expect(getByText('The Hook')).toBeInTheDocument();
    expect(getByText('The Club')).toBeInTheDocument();
    expect(getByText('The Psychic')).toBeInTheDocument();
  });

  it('hides rerolled bosses from the grid', () => {
    const { queryByText, getByText } = render(
      <BossGrid
        eligibleBosses={sampleBosses}
        rerolledBosses={['the-hook']}
        onFace={() => {}}
        onReroll={() => {}}
      />,
    );

    expect(queryByText('The Hook')).toBeNull();
    expect(getByText('The Club')).toBeInTheDocument();
  });

  it('shows empty message when no eligible bosses', () => {
    const { getByText } = render(
      <BossGrid
        eligibleBosses={[]}
        rerolledBosses={[]}
        onFace={() => {}}
        onReroll={() => {}}
      />,
    );

    expect(getByText('No eligible bosses for this ante.')).toBeInTheDocument();
  });

  it('calls onFace when the Faced button is clicked', () => {
    const onFace = vi.fn();
    const { getByLabelText } = render(
      <BossGrid
        eligibleBosses={sampleBosses}
        rerolledBosses={[]}
        onFace={onFace}
        onReroll={() => {}}
      />,
    );

    fireEvent.click(getByLabelText('Face The Hook'));
    expect(onFace).toHaveBeenCalledWith('the-hook');
  });

  it('calls onReroll when the Rerolled button is clicked', () => {
    const onReroll = vi.fn();
    const { getByLabelText } = render(
      <BossGrid
        eligibleBosses={sampleBosses}
        rerolledBosses={[]}
        onFace={() => {}}
        onReroll={onReroll}
      />,
    );

    fireEvent.click(getByLabelText('Reroll The Hook'));
    expect(onReroll).toHaveBeenCalledWith('the-hook');
  });

  it('calls onFace on Enter key press on touch area', () => {
    const onFace = vi.fn();
    const { getByLabelText } = render(
      <BossGrid
        eligibleBosses={sampleBosses}
        rerolledBosses={[]}
        onFace={onFace}
        onReroll={() => {}}
      />,
    );

    const touchArea = getByLabelText(
      'The Hook. Tap to face, long press to reroll',
    );
    fireEvent.keyDown(touchArea, { key: 'Enter' });
    expect(onFace).toHaveBeenCalledWith('the-hook');
  });
});
