export interface AnteEntry {
  anteNumber: number;
  facedBoss: string;
  rerolledBosses: string[];
}

export interface Run {
  id: string;
  name: string;
  createdAt: string;
  status: 'active' | 'completed';
  currentAnte: number;
  anteDecrements: number;
  entries: AnteEntry[];
}

export interface AppState {
  activeRunId: string | null;
  runs: Run[];
}
