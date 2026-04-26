import { BOSS_MAP } from '../data/bosses.ts';

export interface BossPillItem {
  id: string;
  key?: string;
  subtitle?: string;
}

interface BossPillListProps {
  label: string;
  items: BossPillItem[];
}

export function BossPillList({ label, items }: BossPillListProps) {
  if (items.length === 0) return null;

  return (
    <div class="boss-pill-list" role="list" aria-label={label}>
      <span class="boss-pill-list__label">{label}:</span>
      {items.map((item, i) => (
        <span key={item.key ?? `${item.id}-${i}`} class="boss-pill" role="listitem">
          {BOSS_MAP[item.id] && (
            <img
              class="boss-pill__icon"
              src={`${import.meta.env.BASE_URL}${BOSS_MAP[item.id].icon}`}
              alt=""
              width={20}
              height={20}
            />
          )}
          {BOSS_MAP[item.id]?.name ?? item.id}
          {item.subtitle && (
            <span class="boss-pill__subtitle">{item.subtitle}</span>
          )}
        </span>
      ))}
    </div>
  );
}
