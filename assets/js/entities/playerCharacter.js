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
		// possible States: idle, moving, attacking
		this.state = 'idle';
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

	setState(state) {
		this.state = state;
	}

	getPlayerTypeToDraw() {
		const { type, state } = this;
		const suffix = state === 'idle' ? '' : `_${state}`;
		return `${type}${suffix}`;
	}

	getState() {
		return this.state;
	}
}
