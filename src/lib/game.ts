import { CanvasType } from "@/models/enums/CanvasType";
import { Field, GameField } from "./gameField/gameField";
import { SpritePainter } from "./spritePainter";

export async function Game() {
  const backgroundCanvas =
    document.querySelector<HTMLCanvasElement>("#background");
  const gameField = GameField();
  const spritePainter = await SpritePainter();

  spritePainter.addCanvas(backgroundCanvas, CanvasType.Background);
  console.log(gameField.createField());
  spritePainter.drawBackground(gameField.createField() as unknown as Field);

  return {};
}
