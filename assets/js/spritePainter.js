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


	/** <--------------- general functions ----------> */

	/**
	 * add a canvas and his context to the canvasMap
	 * @param {Canvas} canvas
	 * @param {String} type
	 */
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

	/**
	 * calc the size of the given Canvas
	 * @param {Canvas} canvas
	 */
	static calcCanvasSize(canvas) {
		return {
			xMin: 0,
			yMin: 0,
			xMax: Math.floor(canvas.width / 20),
			yMax: Math.floor(canvas.height / 20),
		};
	}

	/**
	 * Load all Images through the imageLoader
	 */
	async loadAllImages() {
		const data = await this.imageLoader.loadAllImages();
		data.forEach((item) => {
			if (!this.imagesLoaded.has(item.imageName)) {
				this.imagesLoaded.set(item.imageName, item.image);
			}
		});
	}

	/**
	 * initial draw of the backgroundField
	 * @param {Object} InitFIeld
	 */
	async drawBackgroundInit(
		{
			xMin, yMin, xMax, yMax, type: imageName, mapType = 'background',
		},
	) {
		// check if an image already got loaded. if not, then call ImageLoader
		let img = this.imagesLoaded.get(imageName);
		if (img === undefined) {
			img = await this.imageLoader.constructor.loadImage(`/game/background/${imageName}.png`);
			this.imagesLoaded.set(imageName, img);
		}
		const { ctx } = this.canvasMap.get(mapType);
		for (let row = xMin; row < xMax; row += 1) {
			for (let col = yMin; col < yMax; col += 1) {
				ctx.drawImage(img, row * 20, col * 20);
			}
		}
	}

	/**
	 * first clear the canvas of the given type
	 * Then draw the canvas of the given map
	 * @param {Array} fieldArray
	 * @param {String} type
	 */
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

	/**
	 * Draw the passed character on the entity-map
	 * @param {String} characterType
	 * @param {Array} coords
	 * @param {Array} size
	 */
	drawCharacter(characterType, [xCoord, yCoord], [characterWidth, characterHeight]) {
		const { ctx } = this.canvasMap.get('entities');
		const img = this.imagesLoaded.get(characterType);
		ctx.drawImage(img, xCoord * 20, yCoord * 20, characterWidth * 20, characterHeight * 20);
	}

	/**
	 * clear the canvas of the given type
	 * @param {String} type
	 */
	clearCanvas(type) {
		this.canvasMap.get(type).ctx.clearRect(
			0,
			0,
			this.canvasSize.xMax * 20,
			this.canvasSize.yMax * 20,
		);
	}

	/** <--------------- getter ----------> */

	getCanvasAndCtx(type) {
		return this.canvasMap.get(type);
	}

	getCanvasSize() {
		return this.canvasSize;
	}
}
