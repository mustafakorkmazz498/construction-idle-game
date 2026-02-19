export type PlayerSettings = {
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  graphicsQuality: 'low' | 'medium' | 'high';
  physicsEnabled: boolean;
};

export type PlayerState = {
  money: number;
  level: number;
  workers: number;
  equipment: number;
  activeProjectId: string | null;
  projectEndAt: string | null;
  pendingProjectRewardId: string | null;
  lastTickAt: string;
  settings: PlayerSettings;
};

