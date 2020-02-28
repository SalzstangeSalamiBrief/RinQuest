export default class Character {
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}

	setX(x) {
		this.x = x;
	}

	setY(y) {
		this.y = y;
	}

	getCoords() {
		return {
			x: this.x,
			y: this.y,
		};
	}
}
