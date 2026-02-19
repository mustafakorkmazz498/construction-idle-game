import type { Project } from './projectTypes';

export const PROJECTS: Project[] = [
  { id: 'proj-01-small-shed', name: 'Small Tool Shed', durationSec: 45, rewardMoney: 120, requiredLevel: 1 },
  { id: 'proj-02-fence-line', name: 'Perimeter Fence', durationSec: 75, rewardMoney: 220, requiredLevel: 1 },
  { id: 'proj-03-driveway', name: 'Concrete Driveway', durationSec: 120, rewardMoney: 420, requiredLevel: 2 },
  { id: 'proj-04-garage', name: 'Single Garage', durationSec: 180, rewardMoney: 780, requiredLevel: 3 },
  { id: 'proj-05-warehouse-a', name: 'Warehouse Block A', durationSec: 260, rewardMoney: 1_400, requiredLevel: 4 },
  { id: 'proj-06-office-shell', name: 'Office Shell', durationSec: 360, rewardMoney: 2_250, requiredLevel: 5 },
  { id: 'proj-07-mall-wing', name: 'Mall Expansion Wing', durationSec: 520, rewardMoney: 3_650, requiredLevel: 6 },
  { id: 'proj-08-bridge-span', name: 'Bridge Span Segment', durationSec: 720, rewardMoney: 5_700, requiredLevel: 7 },
  { id: 'proj-09-tower-core', name: 'High-Rise Core', durationSec: 980, rewardMoney: 8_400, requiredLevel: 8 },
  { id: 'proj-10-mega-complex', name: 'Mega Complex', durationSec: 1_300, rewardMoney: 12_000, requiredLevel: 10 },
];

