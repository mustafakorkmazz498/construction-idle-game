import Matter from 'matter-js';

export type PhysicsBoxSnapshot = {
  id: number;
  x: number;
  y: number;
  angle: number;
  size: number;
};

const PHYSICS_STEP_SEC = 1 / 60;
const PHYSICS_STEP_MS = PHYSICS_STEP_SEC * 1000;
const MAX_PHYSICS_DELTA_SEC = 0.25;

export type MaterialsPhysicsWorld = {
  setViewport: (width: number, height: number) => void;
  spawnMaterialBoxes: (count: number) => void;
  step: (renderDeltaSec: number) => void;
  getBoxes: () => PhysicsBoxSnapshot[];
  clearBoxes: () => void;
};

export function createMaterialsPhysicsWorld(): MaterialsPhysicsWorld {
  const engine = Matter.Engine.create({
    gravity: { x: 0, y: 1.1, scale: 0.001 },
    enableSleeping: true,
  });

  const world = engine.world;
  const bodyById = new Map<number, Matter.Body>();
  let nextId = 1;
  let accumulatorSec = 0;

  const bounds = {
    width: 360,
    height: 760,
  };

  const floor = Matter.Bodies.rectangle(
    bounds.width / 2,
    bounds.height - 18,
    5000,
    36,
    { isStatic: true, friction: 0.8, restitution: 0.05 }
  );

  const leftWall = Matter.Bodies.rectangle(-8, bounds.height / 2, 16, 5000, {
    isStatic: true,
  });
  const rightWall = Matter.Bodies.rectangle(bounds.width + 8, bounds.height / 2, 16, 5000, {
    isStatic: true,
  });

  Matter.Composite.add(world, [floor, leftWall, rightWall]);

  const updateBounds = (): void => {
    Matter.Body.setPosition(floor, {
      x: bounds.width / 2,
      y: bounds.height - 18,
    });

    Matter.Body.setPosition(leftWall, { x: -8, y: bounds.height / 2 });

    Matter.Body.setPosition(rightWall, { x: bounds.width + 8, y: bounds.height / 2 });
  };

  return {
    setViewport: (width, height) => {
      if (width <= 0 || height <= 0) {
        return;
      }

      bounds.width = width;
      bounds.height = height;
      updateBounds();
    },

    spawnMaterialBoxes: (count) => {
      const safeCount = Math.max(0, Math.min(40, Math.floor(count)));
      for (let i = 0; i < safeCount; i += 1) {
        const size = 24 + (i % 3) * 4;
        const x = bounds.width * 0.3 + i * 24;
        const y = 80 + i * 4;

        const body = Matter.Bodies.rectangle(x, y, size, size, {
          friction: 0.6,
          restitution: 0.15,
          density: 0.0015,
          frictionAir: 0.01,
        });

        const id = nextId;
        nextId += 1;
        body.label = `material-${id}`;

        bodyById.set(id, body);
        Matter.Composite.add(world, body);
      }
    },

    step: (renderDeltaSec) => {
      const clamped = Math.max(0, Math.min(renderDeltaSec, MAX_PHYSICS_DELTA_SEC));
      accumulatorSec += clamped;

      while (accumulatorSec >= PHYSICS_STEP_SEC) {
        Matter.Engine.update(engine, PHYSICS_STEP_MS);
        accumulatorSec -= PHYSICS_STEP_SEC;
      }
    },

    getBoxes: () => {
      const snapshots: PhysicsBoxSnapshot[] = [];

      bodyById.forEach((body, id) => {
        if (body.position.y > bounds.height + 300) {
          Matter.Composite.remove(world, body);
          bodyById.delete(id);
          return;
        }

        const width = body.bounds.max.x - body.bounds.min.x;
        snapshots.push({
          id,
          x: body.position.x,
          y: body.position.y,
          angle: body.angle,
          size: width,
        });
      });

      return snapshots;
    },

    clearBoxes: () => {
      bodyById.forEach((body) => {
        Matter.Composite.remove(world, body);
      });
      bodyById.clear();
    },
  };
}

