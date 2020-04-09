import NPC from './nonPlayerCharacter';

export default class Boar extends NPC {
	constructor(positionX, positionY, height, width, type, id) {
		super(positionX, positionY, height, width, type, id);
		this.dealtDamage = false;
	}

	setDealtDamage() {
		this.dealtDamage = true;
	}

	getDealtDamage() {
		return this.dealtDamage;
	}

	// straight movement on the xAxis for boars
	moveCharacter() {
		const { xCoord } = this;
		this.setX(xCoord + 20);
	}

	static getMovementPattern() {
		return {
			xAxis: -1,
			yAxis: 0,
		};
	}
}
