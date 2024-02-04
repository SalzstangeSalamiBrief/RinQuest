import { MovementDirection } from "./enums/MovementDirection";

export interface IEntity {
  readonly id: number;
  readonly height: number;
  readonly width: number;
  readonly xCoordinate: number;
  readonly yCoordinate: number;
}

export interface INpc<T extends (typeof npcEntities)[number]> extends IEntity {
  readonly damage: number;
  readonly hp: number;
  readonly type: T;
  readonly isAlive: () => boolean;
  move: () => void;
}

export interface IDragon extends INpc<"dragon"> {
  readonly isBreathingFire: boolean;
}

export interface IPlayer extends IEntity {
  type: (typeof playerEntities)[number];
  move: (direction: MovementDirection) => void;
  setCurrentType: (newType: (typeof playerEntities)[number]) => void;
  hp: number;
}

export const backgroundEntities = [
  "waterTile",
  "grassTile",
  "skyTile",
  "transparentTile",
] as const;
export const npcEntities = ["dragon", "flame", "boar"] as const;
export const playerEntities = [
  "player_idle",
  "player_moving",
  "player_attacking",
] as const;

// export const NpcEntityTypes = {
//   Dragon: "dragon",
//   Flame: "flame",
//   Boar: "boar",
// } as const;

// export const PlayerEntityTypes = {
//   PlayerIdle: "player_idle",
//   PlayerMoving: "player_moving",
//   PlayerAttacking: "player_attacking",
// } as const;
