import { IPlayer, PlayerEntityTypes } from "@/models/Entities";
import { MovementDirection } from "@/models/enums/MovementDirection";
import { ValueOf } from "@/models/utilityTypes";

export function Player(
  initialXCoordinate: number,
  initialYCoordinate: number,
  id: number
): IPlayer {
  let xCoordinate = initialXCoordinate;
  let yCoordinate = initialYCoordinate;
  let type: ValueOf<typeof PlayerEntityTypes> = PlayerEntityTypes.PlayerIdle;
  const width = 5;
  const height = 6;
  const hp = 100;

  const setCurrentType = (newType: ValueOf<typeof PlayerEntityTypes>) =>
    (type = newType);

  const move = (direction: MovementDirection) => {
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
  };

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
