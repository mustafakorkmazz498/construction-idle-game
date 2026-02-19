import type { PlayerState } from '../player/playerTypes';
import type { Upgrade } from './upgradeTypes';
import { BalanceConfig } from '../balance/BalanceConfig';

export type UpgradePurchaseEvaluation = {
  canPurchase: boolean;
  reasons: string[];
};

export function hasUpgrade(ownedUpgrades: Upgrade[], upgradeId: string): boolean {
  return ownedUpgrades.some((upgrade) => upgrade.id === upgradeId);
}

export function getUpgradeOwnedCount(ownedUpgrades: Upgrade[], upgradeId: string): number {
  return ownedUpgrades.filter((upgrade) => upgrade.id === upgradeId).length;
}

export function getScaledUpgradeCost(targetUpgrade: Upgrade, ownedCount: number): number {
  if (!targetUpgrade.isRepeatable || ownedCount <= 0) {
    return targetUpgrade.cost;
  }

  return Math.floor(
    targetUpgrade.cost * Math.pow(BalanceConfig.upgrades.repeatableCostMultiplier, ownedCount)
  );
}

export function evaluateUpgradePurchase(
  player: PlayerState,
  ownedUpgrades: Upgrade[],
  targetUpgrade: Upgrade
): UpgradePurchaseEvaluation {
  const reasons: string[] = [];
  const ownedCount = getUpgradeOwnedCount(ownedUpgrades, targetUpgrade.id);
  const scaledCost = getScaledUpgradeCost(targetUpgrade, ownedCount);

  if (!targetUpgrade.isRepeatable && hasUpgrade(ownedUpgrades, targetUpgrade.id)) {
    reasons.push('Upgrade is already owned.');
  }

  if (player.money < scaledCost) {
    reasons.push('Not enough money to purchase upgrade.');
  }

  return {
    canPurchase: reasons.length === 0,
    reasons,
  };
}

export type PurchaseUpgradeResult = {
  player: PlayerState;
  ownedUpgrades: Upgrade[];
  purchased: boolean;
  reasons: string[];
};

export function purchaseUpgrade(
  player: PlayerState,
  ownedUpgrades: Upgrade[],
  targetUpgrade: Upgrade
): PurchaseUpgradeResult {
  const evaluation = evaluateUpgradePurchase(player, ownedUpgrades, targetUpgrade);
  if (!evaluation.canPurchase) {
    return {
      player,
      ownedUpgrades,
      purchased: false,
      reasons: evaluation.reasons,
    };
  }

  const ownedCount = getUpgradeOwnedCount(ownedUpgrades, targetUpgrade.id);
  const scaledCost = getScaledUpgradeCost(targetUpgrade, ownedCount);

  return {
    player: {
      ...player,
      money: player.money - scaledCost,
    },
    ownedUpgrades: [...ownedUpgrades, targetUpgrade],
    purchased: true,
    reasons: [],
  };
}

