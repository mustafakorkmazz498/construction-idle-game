export type EconomyState = {
  credits: number;
  incomePerSecond: number;
};

export const DEFAULT_ECONOMY_STATE: EconomyState = {
  credits: 0,
  incomePerSecond: 1,
};

