import type { Entity } from '../entities/entityTypes';

export type WorldState = {
  elapsedMs: number;
  entities: Entity[];
};

export function createInitialWorld(): WorldState {
  return {
    elapsedMs: 0,
    entities: [
      {
        id: 'hq',
        position: { x: 0, y: 0 },
        velocity: { x: 0, y: 0 },
        tags: ['hq'],
      },
    ],
  };
}

