import { Game } from "@/lib/game";
import { useEffect } from "react";

let game = undefined;
export function GameScreen() {
  useEffect(() => {
    game = Game();
    console.log(game);
  }, []);
  return (
    <>
      <h1>Game Screen</h1>
      <canvas id="background" width="1600" height="800" />
    </>
  );
}
