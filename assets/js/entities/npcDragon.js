import NPC from './nonPlayerCharacter';

export default class Dragon extends NPC {
	constructor(posX, posY, type) {
		// id is per default 99
		// height = 9, width = 7, id = 99
		super(posX, posY, 10, 10, type, 99);
		this.dealtDamage = false;
		this.tempMovement = { xAxis: 0, yAxis: 0 };
		this.movement = this.constructor.movementGenerator();
		this.hp = 100;
		// check if the dragon is allowed to move
		this.canMove = true;
	}

	/**
	 * set the value of dealtDamage to true and reverse the value to false after 1.5sec
	 */
	setDealtDamage() {
		this.dealtDamage = true;
		setTimeout(() => { this.dealtDamage = false; }, 1500);
	}

	/**
	 * get the movementPattern for the dragon
	 */
	getMovementPattern() {
		const result = { xAxis: 0, yAxis: 0 };
		// only move every second call
		if (this.canMove === true) {
			const stepIndex = this.movement.next().value;
			result.yAxis = stepIndex <= 6 ? -1 : 1;
		}
		this.canMove = !this.canMove;
		return result;
	}

	/**
	 * Generator for generating an index which is used for calculation the movementPattern
	 */
	static* movementGenerator() {
		let index = 3;
		while (true) {
			index = index <= 12 ? index + 1 : 0;
			yield index;
		}
	}
}
