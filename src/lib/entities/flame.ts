import { NpcEntityTypes, IEntity } from "@/models/Entities";

interface IFlame extends IEntity<typeof NpcEntityTypes.Flame> {
  readonly timeToLive: number;
}

export function Flame(
  initialXCoordinate: number,
  initialYCoordinate: number,
  id: number
): IFlame {
  const type = NpcEntityTypes.Flame;
  const width = 2;
  const height = 2;
  let xCoordinate = initialXCoordinate;
  let yCoordinate = initialYCoordinate;
  let timeToLive = 20;

  function move() {
    if (timeToLive <= 0) {
      return;
    }

    timeToLive -= 1;
    const isXAxisMovement = timeToLive % 2 === 0;
    if (isXAxisMovement) {
      // TODO CHECK OUT OF BOUNDS OR RETURN MOVEMENT => REQUIRES THE MAP => MAYBE CHECK IN THE CALLING FUNCTION IF OUT_OF_BOUNDS AND REMVOE?
      xCoordinate -= 1;
      return;
    }

    yCoordinate += Math.round(Math.random()) === 0 ? -1 : 1;
  }

  return {
    id,
    xCoordinate,
    yCoordinate,
    type,
    width,
    height,
    timeToLive,
    move,
  };
}
