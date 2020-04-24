import NPC from './nonPlayerCharacter';

export default class Flame extends NPC {
	constructor(posX, posY, id) {
		super(posX, posY, 2, 2, 'flame', id);
		this.movement = { xAxis: 0, yAxis: 0 };
		this.TTL = 20;
		this.dealtDamage = false;
	}

	getMovementPattern() {
		if (this.TTL % 2 === 0) {
			this.movement.xAxis = -1;
		} else {
			this.movement.yAxis = Math.round(Math.random()) === 0 ? -1 : 1;
		}
		this.TTL -= 1;
		return this.movement;
	}

	setDealtDamage() {
		this.dealtDamage = true;
	}

	getDealtDamage() {
		return this.dealtDamage;
	}

	getTTL() {
		return this.TTL;
	}
}
