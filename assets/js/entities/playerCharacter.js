import Entity from './entity';
import { initEntities } from '../gamefield/fields.json';

export default class PlayerCharacter extends Entity {
	constructor(textContainer, backgroundContainer) {
		// todo state
		super(
			initEntities[0].coords[0],
			initEntities[0].coords[1],
			//  5 * 20 = 100px
			5,
			//  6 * 20 = 120px
			6,
			'playerCharacter',
		);
		this.HP = 100;
		this.textContainer = textContainer;
		this.backgroundContainer = backgroundContainer;
	}

	changeHP(damageReceived) {
		const newHP = this.HP - damageReceived;
		if (newHP <= 0) {
			this.HP = 0;
			// todo: END GAME
		} else {
			this.HP = newHP;
		}
		// update hpBar-width and current numerical current hp of the player
		this.textContainer.textContent = this.HP;
		this.backgroundContainer.style.width = `${this.HP}%`;
	}
}
