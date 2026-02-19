export type BuildingId = 'crew' | 'mixer' | 'crane';

export type BuildingDefinition = {
  id: BuildingId;
  name: string;
  description: string;
  baseCost: number;
  growth: number;
  productionPerSecond: number;
};

export type BuildingState = {
  owned: number;
};

export type GameState = {
  timeMs: number;
  credits: number;
  totalProduced: number;
  productionPerSecond: number;
  buildings: Record<BuildingId, BuildingState>;
};

export const BUILDINGS: Record<BuildingId, BuildingDefinition> = {
  crew: {
    id: 'crew',
    name: 'Work Crew',
    description: 'General workers increasing construction throughput.',
    baseCost: 10,
    growth: 1.15,
    productionPerSecond: 1,
  },
  mixer: {
    id: 'mixer',
    name: 'Concrete Mixer',
    description: 'Produces high-volume concrete materials.',
    baseCost: 100,
    growth: 1.17,
    productionPerSecond: 8,
  },
  crane: {
    id: 'crane',
    name: 'Tower Crane',
    description: 'Heavy lifting for major project milestones.',
    baseCost: 1_200,
    growth: 1.2,
    productionPerSecond: 55,
  },
};

export const FIXED_TIMESTEP_MS = 100;

export const INITIAL_GAME_STATE: GameState = {
  timeMs: 0,
  credits: 25,
  totalProduced: 0,
  productionPerSecond: 0,
  buildings: {
    crew: { owned: 0 },
    mixer: { owned: 0 },
    crane: { owned: 0 },
  },
};

