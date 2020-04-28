import NPC from './nonPlayerCharacter';

export default class Dragon extends NPC {
	constructor(posX, posY) {
		// id is per default 99
		// height = 9, width = 7, id = 99
		super(posX, posY, 10, 10, 'npcDragon', 99);
		this.dealtDamage = false;
		this.movement = this.constructor.movementGenerator();
		this.hp = 100;
		// check if the dragon is allowed to move
		this.canMove = true;
		this.breathsFire = false;
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
		// only move every second call and if the dragon is not breathing fire
		if (this.canMove && !this.breathsFire) {
			const stepIndex = this.movement.next().value;
			// at stepIndex === 4 the dragon is on the most left side of his movementPattern
			// and breaths fire
			if (stepIndex === 4) {
				this.breathsFire = true;
				setTimeout(() => { this.breathsFire = false; }, 1050);
			}
			// if the dragon is not breathing fire, then move
			if (!this.breathsFire) {
				result.xAxis = stepIndex <= 4 ? -1 : 1;
			}
		}
		this.canMove = !this.canMove;
		return result;
	}

	/**
	 * Generator for generating an index which is used for calculation the movementPattern
	 */
	static* movementGenerator() {
		let index = 2;
		while (true) {
			// index = index <= 12 ? index + 1 : 0;
			index = index <= 7 ? index + 1 : 0;
			yield index;
		}
	}

	/**
	 * Decrease the HP of this object by a passed value (default 20)
	 * @param {Number} damage
	 */
	decreaseDragonHP(damage = 20) {
		this.HP -= damage;
		if (this.HP <= 0) {
			return true;
		}
		return false;
	}
	// todo: breath fire

	getDealtDamage() {
		return this.dealtDamage;
	}

	getBreathsFire() {
		return this.breathsFire;
	}
}
