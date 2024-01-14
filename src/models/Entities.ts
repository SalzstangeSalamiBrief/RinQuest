export interface IEntity {
  readonly id: number;
  readonly height: number;
  readonly width: number;
  readonly type: EntityType;
  readonly xCoordinate: number;
  readonly yCoordinate: number;
  move: () => void;
}

export interface INPC extends IEntity {
  readonly damage: number;
  readonly hp: number;
  readonly isAlive: boolean;
}

export const EntityType = {
  Player: "player", // TODO DIFFERENTIATE BETWEEN MOVING; ATTACKING; STANDING
  Dragon: "npcDragon",
  Flame: "flame",
  // TODO ADD OTHER
} as const;
