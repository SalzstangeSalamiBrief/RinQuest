import Entity from './entity';

export default class NonPlayerCharacter extends Entity {
	constructor(positionX, positionY, height, width, type, id) {
		// todo: width, height to super
		super(positionX, positionY, height, width, type);
		// todo: maybe not needed
		this.isAlive = true;
		this.id = id;
		this.dealtDamage = false;
	}

	// TODO: two kinds of movement?
	moveCharacter() {
		// straight movement
		const { xCoord } = this;
		this.setX(xCoord + 20);
	}

	setDealtDamage() {
		this.dealtDamage = true;
	}

	getDealtDamage() {
		return this.dealtDamage;
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
