import Entity from './entity';
import { initEntities } from '../gamefield/fields.json';

export default class PlayerCharacter extends Entity {
	constructor() {
		super(
			initEntities[0].coords[0],
			initEntities[0].coords[1],
			//  5 * 20 = 100px
			5,
			//  6 * 20 = 120px
			6,
			'playerCharacter',
		);
		// possible States: idle, moving, attacking
		this.state = 'idle';
	}

	/** <--------------- setter ----------> */

	setState(state) {
		this.state = state;
	}

	/** <--------------- getter ----------> */

	getPlayerTypeToDraw() {
		const { type, state } = this;
		const suffix = state === 'idle' ? '' : `_${state}`;
		return `${type}${suffix}`;
	}

	getState() {
		return this.state;
	}

	getGotDamage() {
		return this.gotDamage;
	}
}
