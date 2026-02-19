import type { Entity } from '../entities/entityTypes';

export function movementSystem(entities: Entity[], deltaMs: number): Entity[] {
  const dt = deltaMs / 1000;

  return entities.map((entity) => ({
    ...entity,
    position: {
      x: entity.position.x + entity.velocity.x * dt,
      y: entity.position.y + entity.velocity.y * dt,
    },
  }));
}

