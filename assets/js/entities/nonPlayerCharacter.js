import Entity from './entity';

export default class NonPlayerCharacter extends Entity {
	constructor(type, positionX, positionY) {
		// todo: width, height to super
		super(positionX, positionY);
		this.type = type;
		// todo: maybe not needed
		this.isAlive = true;
	}

	removeNPC() {
		this.isAlive = false;
	}

	getType() {
		return this.type;
	}

	getIsAlive() {
		return this.isAlive;
	}
}
