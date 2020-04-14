import NPC from './nonPlayerCharacter';

export default class Dragon extends NPC {
	constructor(posX, posY, type) {
		// id is per default 99
		// height = 9, width = 7, id = 99
		super(posX, posY, 10, 10, type, 99);
		this.dealtDamage = false;
		this.tempMovement = { xAxis: 0, yAxis: 0 };
	}

	setDealtDamage() {
		this.dealtDamage = true;
		setTimeout(() => { this.dealtDamge = false; }, 1500);
	}

	getMovementPattern() {
		return this.tempMovement;
	}
}
