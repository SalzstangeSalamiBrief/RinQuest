import { NpcEntityTypes, IDragon } from "@/models/Entities";

// TODO HANDLE DRAWING OF THE HEALTH BAR TO CUSTOM SERVICE
export function Dragon(
  initialXCoordinate: number,
  initialYCoordinate: number,
  id: number
): IDragon {
  const type = NpcEntityTypes.Dragon;
  const width = 5;
  const height = 7;
  const damage = 10;
  const hp = 100;
  const xCoordinate = initialXCoordinate;
  let yCoordinate = initialYCoordinate;
  const movement = movementGenerator();
  let isBreathingFire = false;

  const isAlive = () => hp > 0;

  const move = () => {
    if (isBreathingFire === true) {
      return;
    }

    const currentMovementIndex = movement.next().value ?? 0;
    const shouldBreathFire = currentMovementIndex === 4;
    if (shouldBreathFire) {
      isBreathingFire = true;
      setTimeout(() => (isBreathingFire = false), 1050);
      return;
    }

    const shouldMoveTop = currentMovementIndex <= 4;
    if (shouldMoveTop) {
      yCoordinate -= 1;
    } else {
      yCoordinate += 1;
    }
  };

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
    isBreathingFire,
  };
}

function* movementGenerator() {
  let index = 2;
  while (true) {
    index = index <= 7 ? index + 1 : 0;
    yield index;
  }
}
