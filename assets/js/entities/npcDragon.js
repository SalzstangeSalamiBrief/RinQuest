import NPC from './nonPlayerCharacter';

export default class Dragon extends NPC {
	constructor(posX, posY) {
		// id is per default 99
		// height = 9, width = 7, id = 99
		super(posX, posY, 10, 10, 'npcDragon', 99);
		this.movement = this.constructor.movementGenerator();
		this.hp = 100;
		// check if the dragon is allowed to move
		this.canMove = true;
		this.breathsFire = false;
		// TODO:
		// grab both dom-elems via selector
		// set visible to true (default false)
		// todo: change their textContent and bg if hp is changed
		this.dragonHPTextContainer = 	document.querySelector('.hp-bar__text--current.dragon');
		this.dragonBackgroundContainer = document.querySelector('.hp-bar__background.dragon');
		this.gotDamage = false;
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

	getGotDamage() {
		return this.gotDamage;
	}

	getBreathsFire() {
		return this.breathsFire;
	}
}
