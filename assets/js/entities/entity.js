
export default class Entity {
	constructor(xCoord = 0, yCoord = 0, width = 0, height = 0, type) {
		this.xCoord = xCoord;
		this.yCoord = yCoord;
		this.width = width;
		this.height = height;
		this.type = type;
	}

	setX(xCoord) {
		this.xCoord = xCoord;
	}

	setY(yCoord) {
		this.y = yCoord;
	}

	setCoords([xCoord, yCoord]) {
		this.xCoord = xCoord;
		this.yCoord = yCoord;
	}

	getType() {
		return this.type;
	}

	getCoordsAndSize() {
		return {
			coords: [this.xCoord, this.yCoord],
			// [width, height]
			size: [this.width, this.height],
		};
	}
}
