export default class ImageLoader {
	/** <--------------- general functions ----------> */

	static loadImage(filePath) {
		return new Promise((resolve) => {
			const img = new Image();
			img.addEventListener('load', () => resolve(img));
			img.src = filePath;
		});
	}

	/**
	 * load all Images preventive
	 */
	async loadAllImages() {
		const imagesToLoad = [
			'/game/background/waterTile.png',
			'/game/background/grassTile.png',
			'/game/entities/playerCharacter.png',
			'/game/entities/playerCharacter_moving.png',
			'/game/entities/playerCharacter_attacking.png',
			'/game/entities/npcBoar.png',
			'/game/entities/npcDragon.png',
			'/game/entities/flame.png',
		];
		const promiseArray = [];
		imagesToLoad.forEach((imgPath) => {
			promiseArray.push(
				this.constructor.loadImage(imgPath),
			);
		});
		const loadedImages = await Promise.all(promiseArray);
		return loadedImages.map((image, index) => ({ imageName: imagesToLoad[index].split('/').pop().split('.').shift(), image }));
	}
}
