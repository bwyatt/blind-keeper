import { useState, useRef, useCallback, useEffect } from 'preact/hooks';
import { BOSS_MAP, type BossBlind } from '../data/bosses.ts';

interface BossGridProps {
  eligibleBosses: BossBlind[];
  rerolledBosses: string[];
  onFace: (bossId: string) => void;
  onReroll: (bossId: string) => void;
}

export function BossGrid({
  eligibleBosses,
  rerolledBosses,
  onFace,
  onReroll,
}: BossGridProps) {
  const visibleBosses = eligibleBosses.filter(
    (b) => !rerolledBosses.includes(b.id),
  );

  return (
    <div class="boss-grid" role="grid" aria-label="Boss selection">
      {visibleBosses.map((boss) => (
        <BossCard
          key={boss.id}
          boss={boss}
          onFace={onFace}
          onReroll={onReroll}
        />
      ))}
      {visibleBosses.length === 0 && (
        <p class="boss-grid__empty">No eligible bosses for this ante.</p>
      )}
    </div>
  );
}

interface BossCardProps {
  boss: BossBlind;
  onFace: (bossId: string) => void;
  onReroll: (bossId: string) => void;
}

const LONG_PRESS_MOVE_THRESHOLD = 10;

function BossCard({ boss, onFace, onReroll }: BossCardProps) {
  const [pressing, setPressing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Clean up timer on unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    didLongPress.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    setPressing(true);
    timerRef.current = setTimeout(() => {
      didLongPress.current = true;
      setPressing(false);
      onReroll(boss.id);
    }, 500);
  }, [boss.id, onReroll]);

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!startPos.current) return;
    const dx = e.clientX - startPos.current.x;
    const dy = e.clientY - startPos.current.y;
    if (Math.sqrt(dx * dx + dy * dy) > LONG_PRESS_MOVE_THRESHOLD) {
      clearTimer();
      setPressing(false);
    }
  }, [clearTimer]);

  const handlePointerUp = useCallback(() => {
    clearTimer();
    setPressing(false);
    if (!didLongPress.current) {
      onFace(boss.id);
    }
  }, [boss.id, onFace, clearTimer]);

  const handlePointerCancel = useCallback(() => {
    clearTimer();
    setPressing(false);
  }, [clearTimer]);

  const handlePointerLeave = useCallback(() => {
    clearTimer();
    setPressing(false);
  }, [clearTimer]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onFace(boss.id);
      }
    },
    [boss.id, onFace],
  );

  return (
    <div
      class={`boss-card${pressing ? ' boss-card--pressing' : ''}`}
      role="gridcell"
    >
      {boss.id in BOSS_MAP && (
        <img
          class="boss-card__icon"
          src={`${import.meta.env.BASE_URL}${boss.icon}`}
          alt=""
          width={64}
          height={64}
        />
      )}
      <span class="boss-card__name">{boss.name}</span>

      {/* Mobile: touch area overlay */}
      <div
        class="boss-card__touch"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        onPointerLeave={handlePointerLeave}
        onContextMenu={(e: Event) => e.preventDefault()}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`${boss.name}. Tap to face, long press to reroll`}
      />

      {/* Desktop: explicit buttons */}
      <div class="boss-card__buttons">
        <button
          class="btn btn--face"
          onClick={() => onFace(boss.id)}
          aria-label={`Face ${boss.name}`}
        >
          Faced
        </button>
        <button
          class="btn btn--reroll"
          onClick={() => onReroll(boss.id)}
          aria-label={`Reroll ${boss.name}`}
        >
          Rerolled
        </button>
      </div>
    </div>
  );
}
