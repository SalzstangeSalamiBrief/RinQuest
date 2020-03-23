import Entity from './entity';

export default class NonPlayerCharacter extends Entity {
	constructor(positionX, positionY, height, width, type, id) {
		// todo: width, height to super
		super(positionX, positionY, height, width, type);
		// todo: maybe not needed
		this.isAlive = true;
		this.id = id;
	}

	removeNPC() {
		this.isAlive = false;
	}

	getIsAlive() {
		return this.isAlive;
	}

	getID() {
		return this.id;
	}
}
