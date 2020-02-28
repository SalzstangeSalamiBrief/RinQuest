const Character = require('./character');

export default class NonPlayerCharacter extends Character {
	constructor(type, positionX, positionY) {
		super(positionX, positionY);
		this.type = type;
		this.isAlive = true;
	}

	killNPC() {
		this.isAlive = false;
	}

	getType() {
		return this.type;
	}

	getIsAlive() {
		return this.isAlive;
	}
}
