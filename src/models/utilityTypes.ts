import { npcEntities } from "./Entities";

// TODO REMOVE IF NOT USED
export type ValueOf<T> = T[keyof T];
// TODO REMOVE IF NOT USED
export type NpcOption<T extends (typeof npcEntities)[number]> = T;
