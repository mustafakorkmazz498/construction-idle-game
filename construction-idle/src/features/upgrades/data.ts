import type { Upgrade } from './upgradeTypes';

export const UPGRADES: Upgrade[] = [
  { id: 'upg-01-gloves', name: 'Work Gloves', description: 'Increase tap earnings.', cost: 100, effect: { type: 'tap_bonus', value: 1 }, isRepeatable: true },
  { id: 'upg-02-boots', name: 'Steel Boots', description: 'Increase worker efficiency.', cost: 180, effect: { type: 'worker_efficiency', value: 0.05 } },
  { id: 'upg-03-drill-kit', name: 'Drill Kit', description: 'Slight income multiplier.', cost: 260, effect: { type: 'money_per_sec_multiplier', value: 0.08 }, isRepeatable: true },
  { id: 'upg-04-mixer-blades', name: 'Mixer Blades', description: 'Boost equipment output.', cost: 420, effect: { type: 'equipment_efficiency', value: 0.07 } },
  { id: 'upg-05-crane-rig', name: 'Crane Rigging', description: 'Increase worker efficiency.', cost: 620, effect: { type: 'worker_efficiency', value: 0.08 } },
  { id: 'upg-06-timecards', name: 'Digital Timecards', description: 'Global income multiplier.', cost: 900, effect: { type: 'money_per_sec_multiplier', value: 0.1 } },
  { id: 'upg-07-tap-hammer', name: 'Precision Hammer', description: 'Higher tap bonus.', cost: 1_200, effect: { type: 'tap_bonus', value: 2 }, isRepeatable: true },
  { id: 'upg-08-loader', name: 'Compact Loader', description: 'Boost equipment efficiency.', cost: 1_700, effect: { type: 'equipment_efficiency', value: 0.1 } },
  { id: 'upg-09-training', name: 'Crew Training', description: 'Increase worker efficiency.', cost: 2_300, effect: { type: 'worker_efficiency', value: 0.12 } },
  { id: 'upg-10-logistics', name: 'Site Logistics', description: 'Global income multiplier.', cost: 3_100, effect: { type: 'money_per_sec_multiplier', value: 0.14 } },
  { id: 'upg-11-laser-level', name: 'Laser Leveling', description: 'Big equipment boost.', cost: 4_200, effect: { type: 'equipment_efficiency', value: 0.15 } },
  { id: 'upg-12-automation', name: 'Task Automation', description: 'Major income multiplier.', cost: 5_600, effect: { type: 'money_per_sec_multiplier', value: 0.2 } },
];

