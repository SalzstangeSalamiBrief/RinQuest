import NPC from './nonPlayerCharacter';

export default class Flame extends NPC {
	constructor(posX, posY, id) {
		super(posX, posY, 2, 2, 'npcFlame', id);
		this.movement = { xAxis: 0, yAxis: 0 };
		this.TTL = 4;
	}

	getMovementPattern() {
		return this.movement;
	}
}
