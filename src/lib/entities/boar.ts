import { NpcEntityTypes, INpc } from "@/models/Entities";
import { MovementTyp } from "@/models/enums/MovementType";

// TODO MAYBE A FUNCTION THAT TAKES THE HP, MOVEMENET ETC AS PARAMS
export function Boar(
  initialXCoordinate: number,
  initialYCoordinate: number,
  id: number,
  movementType: MovementTyp
): INpc<typeof NpcEntityTypes.Boar> {
  const type = NpcEntityTypes.Boar;
  const width = 5;
  const height = 7;
  const damage = 10;
  const hp = 100;
  let xCoordinate = initialXCoordinate;
  let yCoordinate = initialYCoordinate;
  const indexOfMovementInWaveGenerator = getIndexOfMovementInWave();

  function move() {
    if (movementType === MovementTyp.Straight) {
      xCoordinate -= 1;
      return;
    }

    const indexInWave = indexOfMovementInWaveGenerator.next().value ?? 0;
    const shouldMoveLeft = indexInWave % 2 === 0;
    if (shouldMoveLeft) {
      xCoordinate -= 1;
      return;
    }

    const shouldMoveTop = indexInWave < 12;
    if (shouldMoveTop) {
      yCoordinate -= 1;
      return;
    }

    yCoordinate += 1;
  }

  function isAlive() {
    return hp > 0;
  }

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

// TODO WHY 24?
function* getIndexOfMovementInWave(maxLength: number = 24) {
  let index = 0;
  while (true) {
    index = index < maxLength ? index + 1 : 0;
    yield index;
  }
}
