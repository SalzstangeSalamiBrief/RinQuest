import Character from './character';
import { initCharacters } from '../gamefield/fields.json';

export default class PlayerCharacter extends Character {
	constructor() {
		// todo starting coords
		super(
			initCharacters.xMin,
			initCharacters.yMin,
			60 + initCharacters.xMin,
			80 + initCharacters.yMin,
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
