import {
  BUILDINGS,
  type BuildingDefinition,
  type BuildingId,
  type GameState,
} from './gameTypes';

function getDefinition(buildingId: BuildingId): BuildingDefinition {
  return BUILDINGS[buildingId];
}

export function calculateBuildingCost(state: GameState, buildingId: BuildingId): number {
  const definition = getDefinition(buildingId);
  const owned = state.buildings[buildingId].owned;
  return Math.floor(definition.baseCost * Math.pow(definition.growth, owned));
}

export function calculateProductionPerSecond(state: GameState): number {
  return (Object.keys(BUILDINGS) as BuildingId[]).reduce((total, id) => {
    const owned = state.buildings[id].owned;
    return total + owned * BUILDINGS[id].productionPerSecond;
  }, 0);
}

export function withRecomputedProduction(state: GameState): GameState {
  const productionPerSecond = calculateProductionPerSecond(state);
  return {
    ...state,
    productionPerSecond,
  };
}

export function advanceStateByStep(state: GameState, stepMs: number): GameState {
  const produced = state.productionPerSecond * (stepMs / 1000);
  if (!Number.isFinite(produced) || produced <= 0) {
    return {
      ...state,
      timeMs: state.timeMs + stepMs,
    };
  }

  return {
    ...state,
    timeMs: state.timeMs + stepMs,
    credits: state.credits + produced,
    totalProduced: state.totalProduced + produced,
  };
}

export type PurchaseResult = {
  state: GameState;
  success: boolean;
  reason?: string;
};

export function purchaseBuilding(state: GameState, buildingId: BuildingId): PurchaseResult {
  const cost = calculateBuildingCost(state, buildingId);
  if (state.credits < cost) {
    return {
      state,
      success: false,
      reason: 'Not enough credits.',
    };
  }

  const next: GameState = {
    ...state,
    credits: state.credits - cost,
    buildings: {
      ...state.buildings,
      [buildingId]: {
        owned: state.buildings[buildingId].owned + 1,
      },
    },
  };

  return {
    state: withRecomputedProduction(next),
    success: true,
  };
}

export function collectManualCredits(state: GameState, amount = 1): GameState {
  if (!Number.isFinite(amount) || amount <= 0) {
    return state;
  }

  return {
    ...state,
    credits: state.credits + amount,
    totalProduced: state.totalProduced + amount,
  };
}

