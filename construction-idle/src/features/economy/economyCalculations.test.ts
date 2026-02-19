import { computeIncomePerSecond, computeOfflineProgress } from './economyCalculations';
import { INITIAL_PLAYER_STATE } from '../player/data';
import type { Upgrade } from '../upgrades/upgradeTypes';

describe('economyCalculations', () => {
  test('computeIncomePerSecond returns positive baseline income', () => {
    const income = computeIncomePerSecond(INITIAL_PLAYER_STATE, []);
    expect(income).toBeGreaterThan(0);
  });

  test('computeIncomePerSecond increases with upgrades', () => {
    const upgrades: Upgrade[] = [
      {
        id: 'x',
        name: 'Boost',
        description: 'boost',
        cost: 1,
        effect: { type: 'money_per_sec_multiplier', value: 0.25 },
      },
    ];

    const base = computeIncomePerSecond(INITIAL_PLAYER_STATE, []);
    const boosted = computeIncomePerSecond(INITIAL_PLAYER_STATE, upgrades);
    expect(boosted).toBeGreaterThan(base);
  });

  test('computeOfflineProgress caps elapsed time at 8 hours', () => {
    const player = {
      ...INITIAL_PLAYER_STATE,
      lastTickAt: new Date('2020-01-01T00:00:00.000Z').toISOString(),
    };

    const result = computeOfflineProgress(player, [], new Date('2020-01-02T00:00:00.000Z').toISOString());
    expect(result.elapsedSec).toBe(8 * 60 * 60);
    expect(result.earnedMoney).toBeGreaterThan(0);
  });
});

