import ImageLoaderClass from './imageLoader';

export default class SpritePainter {
	constructor() {
		// this.canvas = canvas;
		this.canvasMap = new Map();
		/**
		 * xMax = width / 20, yMax = height / 20
		 * result is that xMax represents the amount of tiles on the xAxis => example: 80
		 * yAxis is the same
		 */
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

	async drawBackgroundInit(
		{
			xMin, yMin, xMax, yMax, imageName, type = 'background',
		},
	) {
		// check if an image already got loaded. if not, then call ImageLoader
		let img = this.imagesLoaded.get(imageName);
		if (img === undefined) {
			img = await this.imageLoader.loadImage(`/game/background/${imageName}.png`);
			this.imagesLoaded.set(imageName, img);
		}
		const { ctx } = this.canvasMap.get(type);
		for (let row = xMin; row < xMax; row += 1) {
			for (let col = yMin; col < yMax; col += 1) {
				ctx.drawImage(img, row * 20, col * 20);
			}
		}
	}

	async drawFieldMap(fieldArray, type = 'background') {
		this.clearCanvas(type);
		const { ctx } = 	this.canvasMap.get(type);
		for (let row = 0; row < fieldArray.length; row += 1) {
			for (let col = 0; col < fieldArray[row].length; col += 1) {
				ctx.drawImage(
					this.imagesLoaded.get(fieldArray[row][col]),
					col * 20,
					row * 20,
				);
			}
		}
	}

	async drawCharacter(characterType, [xCoord, yCoord], [characterWidth, characterHeight]) {
		// console.log(characterWidth, characterHeight);
		const { ctx } = this.canvasMap.get('entities');
		const img = this.imagesLoaded.get(characterType);
		ctx.drawImage(img, xCoord * 20, yCoord * 20, characterWidth * 20, characterHeight * 20);
	}

	clearCanvas(type) {
		this.canvasMap.get(type).ctx.clearRect(
			0,
			0,
			this.canvasSize.xMax * 20,
			this.canvasSize.yMax * 20,
		);
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
			xMax: Math.floor(canvas.width / 20),
			yMax: Math.floor(canvas.height / 20),
		};
	}

	getCanvasAndCtx(type) {
		return this.canvasMap.get(type);
	}

	getCanvasSize() {
		return this.canvasSize;
	}
}
