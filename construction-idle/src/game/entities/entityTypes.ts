export type EntityId = string;

export type Vec2 = {
  x: number;
  y: number;
};

export type Entity = {
  id: EntityId;
  position: Vec2;
  velocity: Vec2;
  tags: string[];
};

