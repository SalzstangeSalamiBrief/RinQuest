import Entity from './entity';

export default class NonPlayerCharacter extends Entity {
	constructor(positionX, positionY, height, width, type) {
		// todo: width, height to super
		super(positionX, positionY, height, width, type);
		// todo: maybe not needed
		this.isAlive = true;
	}

	removeNPC() {
		this.isAlive = false;
	}

	getIsAlive() {
		return this.isAlive;
	}
}
