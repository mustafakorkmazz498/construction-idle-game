export type UpgradeEffectType =
  | 'money_per_sec_multiplier'
  | 'tap_bonus'
  | 'worker_efficiency'
  | 'equipment_efficiency';

export type UpgradeEffect = {
  type: UpgradeEffectType;
  value: number;
};

export type Upgrade = {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: UpgradeEffect;
  isRepeatable?: boolean;
};

