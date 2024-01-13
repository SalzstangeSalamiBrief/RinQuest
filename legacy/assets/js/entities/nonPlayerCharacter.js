import Entity from './entity';

export default class NonPlayerCharacter extends Entity {
	constructor(positionX, positionY, height, width, type, id) {
		super(positionX, positionY, height, width, type);
		this.id = id;
	}

	/** <--------------- getter ----------> */

	getIsAlive() {
		return this.isAlive;
	}

	getID() {
		return this.id;
	}
}
