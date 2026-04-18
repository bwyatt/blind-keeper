export interface BossBlind {
  id: string;
  name: string;
  minAnte: number;
  isShowdown: boolean;
}

export const BOSSES: BossBlind[] = [
  // Ante 1
  { id: 'the-hook', name: 'The Hook', minAnte: 1, isShowdown: false },
  { id: 'the-club', name: 'The Club', minAnte: 1, isShowdown: false },
  { id: 'the-psychic', name: 'The Psychic', minAnte: 1, isShowdown: false },
  { id: 'the-goad', name: 'The Goad', minAnte: 1, isShowdown: false },
  { id: 'the-window', name: 'The Window', minAnte: 1, isShowdown: false },
  { id: 'the-manacle', name: 'The Manacle', minAnte: 1, isShowdown: false },
  { id: 'the-head', name: 'The Head', minAnte: 1, isShowdown: false },
  { id: 'the-pillar', name: 'The Pillar', minAnte: 1, isShowdown: false },

  // Ante 2
  { id: 'the-wall', name: 'The Wall', minAnte: 2, isShowdown: false },
  { id: 'the-wheel', name: 'The Wheel', minAnte: 2, isShowdown: false },
  { id: 'the-house', name: 'The House', minAnte: 2, isShowdown: false },
  { id: 'the-mark', name: 'The Mark', minAnte: 2, isShowdown: false },
  { id: 'the-fish', name: 'The Fish', minAnte: 2, isShowdown: false },

  // Ante 3
  { id: 'the-ox', name: 'The Ox', minAnte: 3, isShowdown: false },
  { id: 'the-arm', name: 'The Arm', minAnte: 3, isShowdown: false },

  // Ante 4
  { id: 'the-flint', name: 'The Flint', minAnte: 4, isShowdown: false },
  { id: 'the-needle', name: 'The Needle', minAnte: 4, isShowdown: false },
  { id: 'the-eye', name: 'The Eye', minAnte: 4, isShowdown: false },

  // Ante 5
  { id: 'the-mouth', name: 'The Mouth', minAnte: 5, isShowdown: false },
  { id: 'the-plant', name: 'The Plant', minAnte: 5, isShowdown: false },
  { id: 'the-tooth', name: 'The Tooth', minAnte: 5, isShowdown: false },
  { id: 'the-serpent', name: 'The Serpent', minAnte: 5, isShowdown: false },

  // Ante 6
  { id: 'the-water', name: 'The Water', minAnte: 6, isShowdown: false },

  // Showdown bosses (ante 8+)
  { id: 'amber-acorn', name: 'Amber Acorn', minAnte: 8, isShowdown: true },
  { id: 'verdant-leaf', name: 'Verdant Leaf', minAnte: 8, isShowdown: true },
  { id: 'violet-vessel', name: 'Violet Vessel', minAnte: 8, isShowdown: true },
  { id: 'crimson-heart', name: 'Crimson Heart', minAnte: 8, isShowdown: true },
  { id: 'cerulean-bell', name: 'Cerulean Bell', minAnte: 8, isShowdown: true },
];

export const BOSS_MAP: Record<string, BossBlind> = Object.fromEntries(
  BOSSES.map((boss) => [boss.id, boss]),
);
