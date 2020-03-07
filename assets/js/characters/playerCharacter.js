import Entity from './entity';
import { initCharacters } from '../gamefield/fields.json';

export default class PlayerCharacter extends Entity {
	constructor() {
		// todo state
		super(
			initCharacters[0].coords[0],
			initCharacters[0].coords[1],
			//  5 * 20 = 100px
			5,
			//  6 * 20 = 120px
			6,
			'playerCharacter',
		);
		this.HP = 100;
	}

	changeHP(damageReceived) {
		const newHP = this.hp - damageReceived;
		if (newHP <= 0) {
			this.HP = 0;
			// todo: END GAME
			return;
		}
		this.HP = newHP;
	}
}
