import { IPlayer, playerEntities } from "@/models/Entities";
import { MovementDirection } from "@/models/enums/MovementDirection";

export function Player(
  initialXCoordinate: number,
  initialYCoordinate: number,
  id: number
): IPlayer {
  let xCoordinate = initialXCoordinate;
  let yCoordinate = initialYCoordinate;
  let type: (typeof playerEntities)[number] = playerEntities[0];
  const width = 5;
  const height = 6;
  const hp = 100;

  function setCurrentType(newType: (typeof playerEntities)[number]) {
    type = newType;
  }

  function move(direction: MovementDirection) {
    switch (direction) {
      case MovementDirection.Top:
        yCoordinate -= 1;
        break;
      case MovementDirection.Bottom:
        yCoordinate += 1;
        break;
      case MovementDirection.Left:
        xCoordinate -= 1;
        break;
      case MovementDirection.Right:
        xCoordinate += 1;
        break;
    }
  }

  return {
    type,
    width,
    height,
    hp,
    setCurrentType,
    xCoordinate,
    yCoordinate,
    id,
    move,
  };
}
