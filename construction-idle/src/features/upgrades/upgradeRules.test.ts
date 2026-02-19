import { INITIAL_PLAYER_STATE } from '../player/data';
import { evaluateUpgradePurchase, getScaledUpgradeCost, getUpgradeOwnedCount, purchaseUpgrade } from './upgradeRules';
import type { Upgrade } from './upgradeTypes';

const BASE_UPGRADE: Upgrade = {
  id: 'upg-test',
  name: 'Test Upgrade',
  description: 'Test',
  cost: 100,
  effect: { type: 'worker_efficiency', value: 0.1 },
};

describe('upgradeRules', () => {
  test('evaluateUpgradePurchase rejects already owned non-repeatable upgrade', () => {
    const player = { ...INITIAL_PLAYER_STATE, money: 1000 };
    const owned = [BASE_UPGRADE];
    const result = evaluateUpgradePurchase(player, owned, BASE_UPGRADE);

    expect(result.canPurchase).toBe(false);
    expect(result.reasons.join(' ')).toContain('already owned');
  });

  test('repeatable upgrades scale cost and can be bought repeatedly', () => {
    const repeatable: Upgrade = { ...BASE_UPGRADE, id: 'upg-repeat', isRepeatable: true };
    const player = { ...INITIAL_PLAYER_STATE, money: 10000 };
    const owned = [repeatable, repeatable];

    const count = getUpgradeOwnedCount(owned, repeatable.id);
    expect(count).toBe(2);

    const scaledCost = getScaledUpgradeCost(repeatable, count);
    expect(scaledCost).toBeGreaterThan(repeatable.cost);

    const purchase = purchaseUpgrade(player, owned, repeatable);
    expect(purchase.purchased).toBe(true);
    expect(purchase.ownedUpgrades.length).toBe(3);
  });
});

