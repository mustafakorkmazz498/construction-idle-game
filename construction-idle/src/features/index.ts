export type { PlayerSettings, PlayerState } from './player/playerTypes';
export { INITIAL_PLAYER_STATE } from './player/data';
export { usePlayerStore } from './player/playerStore';

export type { Project, ProjectId } from './projects/projectTypes';
export { PROJECTS } from './projects/data';
export { canStartProject, getAvailableProjects } from './projects/projectRules';

export type { Upgrade, UpgradeEffect, UpgradeEffectType } from './upgrades/upgradeTypes';
export { UPGRADES } from './upgrades/data';
export {
  evaluateUpgradePurchase,
  hasUpgrade,
  purchaseUpgrade,
  type PurchaseUpgradeResult,
  type UpgradePurchaseEvaluation,
} from './upgrades/upgradeRules';

export {
  computeIncomePerSecond,
  computeOfflineProgress,
  computeTapBonus,
  type OfflineProgressResult,
} from './economy/economyCalculations';

