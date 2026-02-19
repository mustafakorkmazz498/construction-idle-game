import { useCallback, useMemo, useState } from 'react';
import {
  advanceStateByStep,
  calculateBuildingCost,
  collectManualCredits,
  purchaseBuilding,
  withRecomputedProduction,
} from '../domain/gameEngine';
import {
  BUILDINGS,
  FIXED_TIMESTEP_MS,
  INITIAL_GAME_STATE,
  type BuildingId,
  type GameState,
} from '../domain/gameTypes';
import { useGameLoop } from './useGameLoop';
import { logger } from '../../shared/logging/logger';

type BuildingViewModel = {
  id: BuildingId;
  cost: number;
  canAfford: boolean;
};

type GameStateApi = {
  state: GameState;
  fps: number;
  buildings: BuildingViewModel[];
  onManualCollect: () => void;
  onBuyBuilding: (buildingId: BuildingId) => void;
  onReset: () => void;
};

export function useGameState(): GameStateApi {
  const [state, setState] = useState<GameState>(() => withRecomputedProduction(INITIAL_GAME_STATE));

  const fps = useGameLoop({
    fixedStepMs: FIXED_TIMESTEP_MS,
    onFixedUpdate: (stepMs) => {
      setState((prev) => advanceStateByStep(prev, stepMs));
    },
  });

  const onManualCollect = useCallback((): void => {
    try {
      setState((prev) => collectManualCredits(prev, 1));
    } catch (error) {
      logger.error('Failed manual collect action.', error);
    }
  }, []);

  const onBuyBuilding = useCallback((buildingId: BuildingId): void => {
    try {
      setState((prev) => {
        const result = purchaseBuilding(prev, buildingId);
        if (!result.success) {
          logger.warn('Purchase attempt failed.', {
            buildingId,
            reason: result.reason,
          });
        }
        return result.state;
      });
    } catch (error) {
      logger.error('Failed buy building action.', { buildingId, error });
    }
  }, []);

  const onReset = useCallback((): void => {
    logger.info('Game reset requested.');
    setState(withRecomputedProduction(INITIAL_GAME_STATE));
  }, []);

  const buildings = useMemo<BuildingViewModel[]>(() => {
    return (Object.keys(BUILDINGS) as BuildingId[]).map((id) => {
      const cost = calculateBuildingCost(state, id);
      return {
        id,
        cost,
        canAfford: state.credits >= cost,
      };
    });
  }, [state]);

  return {
    state,
    fps,
    buildings,
    onManualCollect,
    onBuyBuilding,
    onReset,
  };
}

