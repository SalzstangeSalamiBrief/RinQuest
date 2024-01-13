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

export enum EntityType {
  Player,
  Dragon,
  Flame,
  // TODO ADD OTHER
}
