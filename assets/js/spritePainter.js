import ImageLoaderClass from './imageLoader';


export default class SpritePainter {
	constructor(canvas = undefined) {
		this.canvas = canvas;
		this.ctx = canvas ? canvas.getContext('2d') : undefined;
		this.canvasSize = canvas ? this.calcCanvasSize() : undefined;
		this.imagesLoaded = new Map();
		this.imageLoader = new ImageLoaderClass();
	}

	async loadAllImages() {
		const data = await this.imageLoader.loadAllImages();
		data.forEach((item) => {
			if (!this.imagesLoaded.has(item.imageName)) {
				this.imagesLoaded.set(item.imageName, item.image);
			}
		});
	}

	async drawBackground(
		xStart, yStart, xEnd, yEnd, imageName,
	) {
		// check if an image already got loaded. if not, then call ImageLoader
		let img = this.imagesLoaded.get(imageName);
		if (this.imagesLoaded.get(imageName) === undefined) {
			img = await this.imageLoader.loadImage(`/game/background/${imageName}.png`);
			this.imagesLoaded.set(imageName, img);
		}
		// const img = await ImageLoader(imagePath);
		for (let x = xStart; x < xEnd; x += 1) {
			for (let y = yStart; y < yEnd; y += 1) {
				this.ctx.drawImage(img, x * 20, y * 20);
			}
		}
	}

	setCanvasAndCtx(canvas) {
		return new Promise((resolve, reject) => {
			if (!canvas) {
				reject();
			}
			this.canvas = canvas;
			this.ctx = canvas.getContext('2d');
			this.canvasSize = this.calcCanvasSize();
			resolve();
		});
	}

	calcCanvasSize() {
		return {
			xMin: 0,
			yMin: 0,
			xMax: this.canvas.width,
			yMax: this.canvas.height,
		};
	}

	getCanvasAndCtx() {
		return { canvas: this.canvas, ctx: this.ctx };
	}

	getCanvasSize() {
		return this.canvasSize;
	}
}
