export const BalanceConfig = {
  offline: {
    maxSeconds: 8 * 60 * 60,
  },
  tap: {
    windowMs: 60_000,
    softCapPerMinute: 200,
    decayPerExtraTap: 0.01,
    minMultiplier: 0.2,
  },
  upgrades: {
    repeatableCostMultiplier: 1.35,
  },
} as const;

