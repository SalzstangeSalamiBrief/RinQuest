import Character from './character';
import { initCharacters } from '../gamefield/fields.json';

export default class PlayerCharacter extends Character {
	constructor() {
		// todo starting coords
		super(
			initCharacters[0].xMin,
			initCharacters[0].yMin,
			//  3 * 20 = 60px
			3,
			//  4 * 20 = 80px
			4,
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
