export interface BossBlind {
  id: string;
  name: string;
  icon: string;
  minAnte: number;
  isShowdown: boolean;
}

export const BOSSES: BossBlind[] = [
  // Ante 1
  { id: 'the-hook', name: 'The Hook', icon: 'images/bosses/the-hook.png', minAnte: 1, isShowdown: false },
  { id: 'the-club', name: 'The Club', icon: 'images/bosses/the-club.png', minAnte: 1, isShowdown: false },
  { id: 'the-psychic', name: 'The Psychic', icon: 'images/bosses/the-psychic.png', minAnte: 1, isShowdown: false },
  { id: 'the-goad', name: 'The Goad', icon: 'images/bosses/the-goad.png', minAnte: 1, isShowdown: false },
  { id: 'the-window', name: 'The Window', icon: 'images/bosses/the-window.png', minAnte: 1, isShowdown: false },
  { id: 'the-manacle', name: 'The Manacle', icon: 'images/bosses/the-manacle.png', minAnte: 1, isShowdown: false },
  { id: 'the-head', name: 'The Head', icon: 'images/bosses/the-head.png', minAnte: 1, isShowdown: false },
  { id: 'the-pillar', name: 'The Pillar', icon: 'images/bosses/the-pillar.png', minAnte: 1, isShowdown: false },

  // Ante 2
  { id: 'the-wall', name: 'The Wall', icon: 'images/bosses/the-wall.png', minAnte: 2, isShowdown: false },
  { id: 'the-wheel', name: 'The Wheel', icon: 'images/bosses/the-wheel.png', minAnte: 2, isShowdown: false },
  { id: 'the-house', name: 'The House', icon: 'images/bosses/the-house.png', minAnte: 2, isShowdown: false },
  { id: 'the-mark', name: 'The Mark', icon: 'images/bosses/the-mark.png', minAnte: 2, isShowdown: false },
  { id: 'the-fish', name: 'The Fish', icon: 'images/bosses/the-fish.png', minAnte: 2, isShowdown: false },

  // Ante 3
  { id: 'the-ox', name: 'The Ox', icon: 'images/bosses/the-ox.png', minAnte: 3, isShowdown: false },
  { id: 'the-arm', name: 'The Arm', icon: 'images/bosses/the-arm.png', minAnte: 3, isShowdown: false },

  // Ante 4
  { id: 'the-flint', name: 'The Flint', icon: 'images/bosses/the-flint.png', minAnte: 4, isShowdown: false },
  { id: 'the-needle', name: 'The Needle', icon: 'images/bosses/the-needle.png', minAnte: 4, isShowdown: false },
  { id: 'the-eye', name: 'The Eye', icon: 'images/bosses/the-eye.png', minAnte: 4, isShowdown: false },

  // Ante 5
  { id: 'the-mouth', name: 'The Mouth', icon: 'images/bosses/the-mouth.png', minAnte: 5, isShowdown: false },
  { id: 'the-plant', name: 'The Plant', icon: 'images/bosses/the-plant.png', minAnte: 5, isShowdown: false },
  { id: 'the-tooth', name: 'The Tooth', icon: 'images/bosses/the-tooth.png', minAnte: 5, isShowdown: false },
  { id: 'the-serpent', name: 'The Serpent', icon: 'images/bosses/the-serpent.png', minAnte: 5, isShowdown: false },

  // Ante 6
  { id: 'the-water', name: 'The Water', icon: 'images/bosses/the-water.png', minAnte: 6, isShowdown: false },

  // Showdown bosses (ante 8+)
  { id: 'amber-acorn', name: 'Amber Acorn', icon: 'images/bosses/amber-acorn.png', minAnte: 8, isShowdown: true },
  { id: 'verdant-leaf', name: 'Verdant Leaf', icon: 'images/bosses/verdant-leaf.png', minAnte: 8, isShowdown: true },
  { id: 'violet-vessel', name: 'Violet Vessel', icon: 'images/bosses/violet-vessel.png', minAnte: 8, isShowdown: true },
  { id: 'crimson-heart', name: 'Crimson Heart', icon: 'images/bosses/crimson-heart.png', minAnte: 8, isShowdown: true },
  { id: 'cerulean-bell', name: 'Cerulean Bell', icon: 'images/bosses/cerulean-bell.png', minAnte: 8, isShowdown: true },
];

export const BOSS_MAP: Record<string, BossBlind> = Object.fromEntries(
  BOSSES.map((boss) => [boss.id, boss]),
);
