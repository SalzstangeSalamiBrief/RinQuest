import { EntityType, INpc } from "@/models/Entities";

export function Dragon(
  initialXCoordinate: number,
  initialYCoordinate: number,
  id: number
): INpc {
  const type = EntityType.Dragon;
  const width = 5;
  const height = 7;
  const damage = 10;
  const hp = 100;
  const xCoordinate = initialXCoordinate;
  const yCoordinate = initialYCoordinate;

  return {
    height,
    width,
    hp,
    damage,
    id,
    xCoordinate,
    yCoordinate,
    move,
    type,
    isAlive,
  };
}
