export const loadImages = async () => {
  try {
    const promiseArray = imagesToLoad.map(loadImage);
    const loadedImages = await Promise.all(promiseArray);
    const imageMap = new Map<string, HTMLImageElement>();
    loadedImages.forEach((loadedImage, index) => {
      const imageName =
        imagesToLoad[index].split("/").pop()?.split(".").shift() ?? "";
      const isItemIncluded = imageMap.has(imageName);
      if (isItemIncluded) {
        return;
      }

      imageMap.set(imageName, loadedImage);
    });

    return imageMap;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const imagesToLoad = [
  "/game/background/waterTile.png",
  "/game/background/grassTile.png",
  "/game/entities/player_idle.png",
  "/game/entities/player_moving.png",
  "/game/entities/player_attacking.png",
  "/game/entities/boar.png",
  "/game/entities/dragon.png",
  "/game/entities/flame.png",
];

const loadImage = (filePath: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    try {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.src = filePath;
    } catch (error) {
      console.error(error);
      reject();
    }
  });
};
