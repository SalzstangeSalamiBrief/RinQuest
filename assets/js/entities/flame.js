import NPC from './nonPlayerCharacter';

export default class Flame extends NPC {
	constructor(posX, posY, id) {
		super(posX, posY, 2, 2, 'flame', id);
		this.movement = { xAxis: 0, yAxis: 0 };
		this.TTL = 20;
	}

	/** <--------------- getter ----------> */

	/**
	 * Calculate the movementPattern
	 */
	getMovementPattern() {
		const resultObject = 	this.movement;
		// if TTL % 2 === 0 move the character on the xAxis, else move on the yAxis
		if (this.TTL % 2 === 0) {
			resultObject.xAxis = -1;
			resultObject.yAxis = 0;
		} else {
			resultObject.xAxis = 0;
			// decide randomly the yAxis movement
			resultObject.yAxis = Math.round(Math.random()) === 0 ? -1 : 1;
		}
		this.TTL -= 1;
		return this.movement;
	}

	getTTL() {
		return this.TTL;
	}
}
