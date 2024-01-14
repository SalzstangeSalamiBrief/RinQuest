export const loadImages = async () => {
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
};

const imagesToLoad = [
  "/game/background/waterTile.png",
  "/game/background/grassTile.png",
  "/game/entities/playerCharacter.png",
  "/game/entities/playerCharacter_moving.png",
  "/game/entities/playerCharacter_attacking.png",
  "/game/entities/npcBoar.png",
  "/game/entities/npcDragon.png",
  "/game/entities/flame.png",
];

const loadImage = (filePath: string): Promise<HTMLImageElement> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.src = filePath;
  });
};
