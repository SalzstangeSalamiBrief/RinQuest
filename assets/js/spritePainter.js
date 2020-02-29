import ImageLoaderClass from './imageLoader';

export default class SpritePainter {
	constructor() {
		// this.canvas = canvas;
		this.canvasMap = new Map();
		// this.ctx = canvas ? canvas.getContext('2d') : undefined;
		this.canvasSize = undefined;
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
		xStart, yStart, xEnd, yEnd, imageName, type = 'background',
	) {
		// check if an image already got loaded. if not, then call ImageLoader
		let img = this.imagesLoaded.get(imageName);
		if (img === undefined) {
			img = await this.imageLoader.loadImage(`/game/background/${imageName}.png`);
			this.imagesLoaded.set(imageName, img);
		}
		for (let x = xStart; x < xEnd; x += 1) {
			for (let y = yStart; y < yEnd; y += 1) {
				this.canvasMap.get(type).ctx.drawImage(img, x * 20, y * 20);
			}
		}
	}

	drawCharacter(characterType, [xCoord, yCoord]) {
		const img = this.imagesLoaded.get(characterType);
		this.canvasMap.get('characters').ctx.drawImage(img, xCoord, yCoord);
	}

	clearCanvas(type) {
		this.canvasMap.get(type).ctx.clearRect(0, 0, this.canvasSize.xMax, this.canvasSize.yMax);
	}

	addCanvasAndCtx(canvas, type) {
		return new Promise((resolve, reject) => {
			if (!canvas || !type) {
				reject();
			}
			this.canvasMap.set(type, { canvas, ctx: canvas.getContext('2d') });
			if (this.canvasSize === undefined) this.canvasSize = this.constructor.calcCanvasSize(canvas);
			resolve();
		});
	}

	static calcCanvasSize(canvas) {
		return {
			xMin: 0,
			yMin: 0,
			xMax: canvas.width,
			yMax: canvas.height,
		};
	}

	getCanvasAndCtx(type) {
		return this.canvasMap.get(type);
	}

	getCanvasSize() {
		return this.canvasSize;
	}
}
