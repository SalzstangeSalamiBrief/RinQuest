import { MovementDirection } from "./enums/MovementDirection";
import { ValueOf } from "./utilityTypes";

export interface IEntity<T> {
  readonly id: number;
  readonly height: number;
  readonly width: number;
  readonly type: ValueOf<T>;
  readonly xCoordinate: number;
  readonly yCoordinate: number;
  move: () => void;
}

export interface INpc<T> extends IEntity<T> {
  readonly damage: number;
  readonly hp: number;
  readonly isAlive: () => boolean;
}

export interface IDragon extends INpc<typeof NpcEntityTypes> {
  readonly isBreathingFire: boolean;
}

export interface IPlayer
  extends Omit<IEntity<typeof PlayerEntityTypes>, "move"> {
  move: (direction: MovementDirection) => void;
  setCurrentType: (newType: ValueOf<typeof PlayerEntityTypes>) => void;
  hp: number;
}

export const NpcEntityTypes = {
  Dragon: "dragon",
  Flame: "flame",
  Boar: "boar",
} as const;

export const PlayerEntityTypes = {
  PlayerIdle: "player_idle",
  PlayerMoving: "player_moving",
  PlayerAttacking: "player_attacking",
} as const;
