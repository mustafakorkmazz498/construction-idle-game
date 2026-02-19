import type { PlayerState } from './playerTypes';

export const INITIAL_PLAYER_STATE: PlayerState = {
  money: 250,
  level: 1,
  workers: 2,
  equipment: 1,
  activeProjectId: null,
  projectEndAt: null,
  pendingProjectRewardId: null,
  lastTickAt: new Date(0).toISOString(),
  settings: {
    soundEnabled: true,
    vibrationEnabled: true,
    graphicsQuality: 'high',
    physicsEnabled: true,
  },
};

