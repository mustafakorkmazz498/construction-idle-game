import { movementSystem } from '../systems/movementSystem';
import type { WorldState } from '../world/worldState';

function tick(world: WorldState, deltaMs: number): WorldState {
  return {
    ...world,
    elapsedMs: world.elapsedMs + deltaMs,
    entities: movementSystem(world.entities, deltaMs),
  };
}

export const gameLoop = {
  tick,
};

