import { BOSS_MAP } from '../data/bosses.ts';

interface BossPillListProps {
  label: string;
  bossIds: string[];
}

export function BossPillList({ label, bossIds }: BossPillListProps) {
  if (bossIds.length === 0) return null;

  return (
    <div class="boss-pill-list" aria-label={label}>
      <span class="boss-pill-list__label">{label}:</span>
      {bossIds.map((id) => (
        <span key={id} class="boss-pill">
          <img
            class="boss-pill__icon"
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
