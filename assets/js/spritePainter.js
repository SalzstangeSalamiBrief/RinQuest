import ImageLoaderClass from './imageLoader';


export default class SpritePainter {
	constructor(canvas = undefined) {
		this.canvas = canvas;
		this.ctx = canvas ? canvas.getContext('2d') : undefined;
		this.imagesLoaded = new Map();
		this.imageLoader = new ImageLoaderClass();
	}

	async loadAllImages() {
		const data = await this.imageLoader.loadAllImages();
		console.log(data);
		console.log('loadAllImages');
		data.forEach((item) => {
			if (!this.imagesLoaded.has(item.imageName)) {
				this.imagesLoaded.set(item.imageName, item.image);
			}
		});
		console.log(this.imagesLoaded.entries());
	}

	async drawBackground({
		xStart, yStart, xEnd, yEnd, imageName,
	}) {
		console.log('drawBackground');
		// check if an image already got loaded. if not, then call ImageLoader
		const img = this.imagesLoaded.get(imageName);
		// if (this.imagesLoaded.get(imageName) === undefined) {
		// 	img = await this.imageLoader.loadImage(`./background/${imageName}.png`);
		// 	this.imagesLoaded.set(imageName, img);
		// }
		// const img = await ImageLoader(imagePath);
		for (let x = xStart; x < xEnd; x += 1) {
			for (let y = yStart; y < yEnd; y += 1) {
				this.ctx.drawImage(img, x * 20, y * 20);
			}
		}
	}

	setCanvasAndCtx(canvas) {
		console.log('setCanvasAndCtx');
		return new Promise((resolve, reject) => {
			if (!canvas) {
				reject();
			}
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			resolve();
		});
	}

	getCtx() {
		return this.ctx;
	}
}
