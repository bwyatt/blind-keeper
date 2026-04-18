import { BOSS_MAP } from '../data/bosses.ts';

interface RerollListProps {
  rerolledBossIds: string[];
}

export function RerollList({ rerolledBossIds }: RerollListProps) {
  if (rerolledBossIds.length === 0) return null;

  return (
    <div class="reroll-list" aria-label="Rerolled bosses">
      <span class="reroll-list__label">Rerolled:</span>
      {rerolledBossIds.map((id) => (
        <span key={id} class="reroll-list__pill">
          <img
            class="reroll-list__icon"
            src={`/images/bosses/${id}.png`}
            alt=""
            width={20}
            height={20}
          />
          {BOSS_MAP[id]?.name ?? id}
        </span>
      ))}
    </div>
  );
}
