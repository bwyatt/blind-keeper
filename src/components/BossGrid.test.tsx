import { render, fireEvent, act } from '@testing-library/preact';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { useState } from 'preact/hooks';
import { BossGrid } from './BossGrid.tsx';
import type { BossBlind } from '../data/bosses.ts';

const sampleBosses: BossBlind[] = [
  { id: 'the-hook', name: 'The Hook', minAnte: 1, isShowdown: false, icon: 'images/bosses/the-hook.png' },
  { id: 'the-club', name: 'The Club', minAnte: 1, isShowdown: false, icon: 'images/bosses/the-club.png' },
  { id: 'the-psychic', name: 'The Psychic', minAnte: 1, isShowdown: false, icon: 'images/bosses/the-psychic.png' },
];

describe('BossGrid', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

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

  it('does not trigger face or reroll on swipe movement beyond threshold', () => {
    vi.useFakeTimers();

    const onFace = vi.fn();
    const onReroll = vi.fn();
    const { getByLabelText } = render(
      <BossGrid
        eligibleBosses={sampleBosses}
        rerolledBosses={[]}
        onFace={onFace}
        onReroll={onReroll}
      />,
    );

    const touchArea = getByLabelText(
      'The Hook. Tap to face, long press to reroll',
    );

    fireEvent.pointerDown(touchArea, { clientX: 10, clientY: 10 });
    fireEvent.pointerMove(touchArea, { clientX: 30, clientY: 30 });
    fireEvent.pointerUp(touchArea);

    expect(onFace).not.toHaveBeenCalled();
    expect(onReroll).not.toHaveBeenCalled();

    // Advance past the long-press threshold to confirm the timer was actually canceled
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(onFace).not.toHaveBeenCalled();
    expect(onReroll).not.toHaveBeenCalled();
  });

  it('fires reroll once on long press and does not face when pointer up lands on newly-exposed boss', () => {
    vi.useFakeTimers();

    const onFace = vi.fn();
    const onReroll = vi.fn();

    function StatefulBossGrid() {
      const [rerolledBosses, setRerolledBosses] = useState<string[]>([]);
      return (
        <BossGrid
          eligibleBosses={sampleBosses}
          rerolledBosses={rerolledBosses}
          onFace={onFace}
          onReroll={(id) => {
            onReroll(id);
            setRerolledBosses((prev) => [...prev, id]);
          }}
        />
      );
    }

    const { getByLabelText, queryByLabelText } = render(<StatefulBossGrid />);

    const hookTouchArea = getByLabelText(
      'The Hook. Tap to face, long press to reroll',
    );

    // Long press on The Hook triggers a reroll, removing The Hook from the grid
    fireEvent.pointerDown(hookTouchArea, { clientX: 10, clientY: 10 });
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(queryByLabelText('The Hook. Tap to face, long press to reroll')).toBeNull();
    expect(onReroll).toHaveBeenCalledTimes(1);
    expect(onReroll).toHaveBeenCalledWith('the-hook');

    // The subsequent pointerUp lands on The Club, now exposed after the reroll
    const clubTouchArea = getByLabelText(
      'The Club. Tap to face, long press to reroll',
    );
    fireEvent.pointerUp(clubTouchArea);

    expect(onFace).not.toHaveBeenCalled();
  });

  it('still faces on quick tap without movement', () => {
    vi.useFakeTimers();

    const onFace = vi.fn();
    const onReroll = vi.fn();
    const { getByLabelText } = render(
      <BossGrid
        eligibleBosses={sampleBosses}
        rerolledBosses={[]}
        onFace={onFace}
        onReroll={onReroll}
      />,
    );

    const touchArea = getByLabelText(
      'The Hook. Tap to face, long press to reroll',
    );

    fireEvent.pointerDown(touchArea, { clientX: 10, clientY: 10 });
    fireEvent.pointerUp(touchArea);

    expect(onFace).toHaveBeenCalledTimes(1);
    expect(onFace).toHaveBeenCalledWith('the-hook');

    // Advance past the long-press threshold to confirm the timer was canceled by pointerUp
    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(onReroll).not.toHaveBeenCalled();
  });
});
