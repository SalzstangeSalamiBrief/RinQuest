import Character from './character';

export default class PlayerCharacter extends Character {
	constructor() {
		// todo starting coords
		super(0, 0, 60, 80, 'playerCharacter');
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
