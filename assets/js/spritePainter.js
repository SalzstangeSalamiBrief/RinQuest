import ImageLoader from './imageLoader';


export default class SpritePainter {
	constructor(canvas) {
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
	}

	async drawBackground(xStart, yStart, xEnd, yEnd, imagePath) {
		const img = await ImageLoader(imagePath);
		for (let x = xStart; x < xEnd; x += 1) {
			for (let y = yStart; y < yEnd; y += 1) {
				this.ctx.drawImage(img, x * 20, y * 20);
			}
		}
	}
}
