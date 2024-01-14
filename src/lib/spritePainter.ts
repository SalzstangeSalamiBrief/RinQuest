import { CanvasType } from "@/models/CanvasType";
import { loadImages } from "./imageLoder";
import { IEntity } from "@/models/Entities";
import { TILE_SIZE } from "./constants";

interface ICanvasDimensions {
  xMin: 0;
  yMin: 0;
  xMax: number;
  yMax: number;
}
// TODO OUTSOURCE INTO MODELS, IF THIS MODELS ARE REQUIRED IN OTHER FILES
interface ICanvasItem {
  canvas: HTMLCanvasElement;
  dimensions: ICanvasDimensions;
}

export const spritePainter = async () => {
  const canvasMap = new Map<CanvasType, ICanvasItem>();
  const imagesLoaded = await loadImages();

  const addCanvas = (
    canvasToAdd: HTMLCanvasElement | undefined,
    type: CanvasType
  ) => {
    if (canvasToAdd === undefined) {
      throw new Error(
        `Could not add canvas of type '${type}' because it does not exist.`
      );
    }

    const isAlreadyIncluded = canvasMap.has(type);
    if (isAlreadyIncluded) {
      console.warn(
        `Cannot add canvas of type '${type}' because it is already added.`
      );
    }

    const dimensions = getDimensionsOfCanvas(canvasToAdd);
    const canvasItem: ICanvasItem = {
      canvas: canvasToAdd,
      dimensions,
    };
    canvasMap.set(type, canvasItem);
  };

  const clearCanvas = (type: CanvasType) => {
    const canvasToClear = canvasMap.get(type);
    if (!canvasToClear) {
      throw new Error(
        `Could not clear canvas of type '${type}' because it does not exist.`
      );
    }

    // TODO IS THE CANVAS PROPERTY USED? IF NOT USE THE CONTEXT?
    const context = getContextOfCanvas(canvasToClear.canvas, type);
    context.clearRect(
      0,
      0,
      canvasToClear.dimensions.xMax * TILE_SIZE,
      canvasToClear.dimensions.yMax * TILE_SIZE
    );
  };

  // TODO WHAT IS FIELDARRAY => SOME 2D ARRAY?
  const drawBackground = (fieldArray: any) => {
    clearCanvas(CanvasType.background);
    const backgroundCanvas = getCanvasItemFromMap(
      canvasMap,
      CanvasType.background
    );

    const context = getContextOfCanvas(
      backgroundCanvas.canvas,
      CanvasType.background
    );
    for (let rowIndex = 0; rowIndex < fieldArray.length; rowIndex += 1) {
      const row = fieldArray[rowIndex];
      for (let colIndex = 0; colIndex < row.length; colIndex += 1) {
        const cell = row[colIndex];
        const image = imagesLoaded.get(cell.imageName);
        if (!image) {
          throw new Error(
            `Could not draw background because the image '${cell.imageName}' does not exist.`
          );
        }
        // TODO CONSTANT TILE_SIZE
        context.drawImage(image, colIndex * TILE_SIZE, rowIndex * TILE_SIZE);
      }
    }
  };

  // TODO CHARACTERTYPE STRING ENUM
  const drawEntity = (entity: IEntity) => {
    const { type, height, width, xCoordinate, yCoordinate } = entity;
    const image = imagesLoaded.get(type);
    if (!image) {
      throw new Error(
        `Could not draw entity because the image '${type}' does not exist.`
      );
    }

    const canvasItem = getCanvasItemFromMap(canvasMap, CanvasType.entities);
    const context = getContextOfCanvas(canvasItem.canvas, CanvasType.entities);
    context.drawImage(
      image,
      xCoordinate * TILE_SIZE,
      yCoordinate * TILE_SIZE,
      width * TILE_SIZE,
      height * TILE_SIZE
    );
  };

  return { drawBackground, drawEntity, clearCanvas, addCanvas };
};

const getDimensionsOfCanvas = (
  canvas: HTMLCanvasElement
): ICanvasDimensions => ({
  xMin: 0,
  yMin: 0,
  xMax: Math.floor(canvas.width / TILE_SIZE),
  yMax: Math.floor(canvas.height / TILE_SIZE),
});

const getCanvasItemFromMap = (
  canvasMap: Map<CanvasType, ICanvasItem>,
  type: CanvasType
) => {
  const canvasToGet = canvasMap.get(type);
  if (!canvasToGet) {
    throw new Error(
      `Could not draw background because the canvas '${CanvasType.background}' does not exist.`
    );
  }

  return canvasToGet;
};

const getContextOfCanvas = (canvas: HTMLCanvasElement, type: CanvasType) => {
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error(
      `Could not clear canvas of type '${type}' because the context of the canvas could not be accessed.`
    );
  }

  return context;
};
