import type { PlayerState } from '../player/playerTypes';
import type { Upgrade } from '../upgrades/upgradeTypes';
import { BalanceConfig } from '../balance/BalanceConfig';

const BASE_WORKER_INCOME = 1.25;
const BASE_EQUIPMENT_INCOME = 2.5;

function sumUpgradeValues(upgrades: Upgrade[], type: Upgrade['effect']['type']): number {
  return upgrades
    .filter((upgrade) => upgrade.effect.type === type)
    .reduce((total, upgrade) => total + upgrade.effect.value, 0);
}

export function computeIncomePerSecond(player: PlayerState, ownedUpgrades: Upgrade[]): number {
  const workerEfficiency = 1 + sumUpgradeValues(ownedUpgrades, 'worker_efficiency');
  const equipmentEfficiency = 1 + sumUpgradeValues(ownedUpgrades, 'equipment_efficiency');
  const globalMultiplier = 1 + sumUpgradeValues(ownedUpgrades, 'money_per_sec_multiplier');

  const workerIncome = player.workers * BASE_WORKER_INCOME * workerEfficiency;
  const equipmentIncome = player.equipment * BASE_EQUIPMENT_INCOME * equipmentEfficiency;

  return (workerIncome + equipmentIncome) * globalMultiplier;
}

export function computeTapBonus(ownedUpgrades: Upgrade[]): number {
  return 1 + sumUpgradeValues(ownedUpgrades, 'tap_bonus');
}

export type OfflineProgressResult = {
  elapsedSec: number;
  earnedMoney: number;
  nextPlayerState: PlayerState;
};

export function computeOfflineProgress(
  player: PlayerState,
  ownedUpgrades: Upgrade[],
  nowIso: string
): OfflineProgressResult {
  const lastTickMs = Date.parse(player.lastTickAt);
  const nowMs = Date.parse(nowIso);

  if (!Number.isFinite(lastTickMs) || !Number.isFinite(nowMs) || nowMs <= lastTickMs) {
    return {
      elapsedSec: 0,
      earnedMoney: 0,
      nextPlayerState: { ...player, lastTickAt: nowIso },
    };
  }

  const elapsedSecRaw = (nowMs - lastTickMs) / 1000;
  const elapsedSec = Math.max(0, Math.min(elapsedSecRaw, BalanceConfig.offline.maxSeconds));
  const earnedMoney = computeIncomePerSecond(player, ownedUpgrades) * elapsedSec;

  return {
    elapsedSec,
    earnedMoney,
    nextPlayerState: {
      ...player,
      money: player.money + earnedMoney,
      lastTickAt: nowIso,
    },
  };
}

