/* eslint-disable class-methods-use-this */
// const url = require('url');

export default class ImageLoader {
	loadImage(filePath) {
		return new Promise((resolve) => {
			const img = new Image();
			img.addEventListener('load', () => resolve(img));
			img.src = filePath;
			// url.resolve(window.location.origin, filePath);
		});
	}

	/**
	 * load all Images preventive
	 */
	async loadAllImages() {
		const imagesToLoad = [
			'/game/background/waterTile.png',
			'/game/background/grassTile.png',
			'/game/characters/playerCharacter.png',
		];
		const promiseArray = [];
		imagesToLoad.forEach((imgPath) => {
			promiseArray.push(
				this.loadImage(imgPath),
			);
		});
		const loadedImages = await Promise.all(promiseArray);
		return loadedImages.map((image, index) => ({ imageName: imagesToLoad[index].split('/').pop().split('.').shift(), image }));
	}
}
