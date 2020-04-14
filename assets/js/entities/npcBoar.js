import NPC from './nonPlayerCharacter';

export default class Boar extends NPC {
	constructor(posX, posY, type, id, movementType = 'straightMovement') {
		// height: 5, width: 7
		super(posX, posY, 7, 5, type, id);
		this.dealtDamage = false;
		this.movementType = movementType;
		/*
		calculate different values for movement by the given movementTypebundleRenderer.renderToStream
		if movementType === 'waveMovement,
			then create this.movemenGenerator which is used to iterate over the movemen-array
	*/
		if (movementType === 'waveMovement') {
			this.movement = this.constructor.createWaveMovementArray();
			this.movementGenerator = this.constructor.waveMovementGenerator(this.movement.length);
		} else {
			this.movement = this.constructor.createStraightMovement();
		}
	}

	setDealtDamage() {
		this.dealtDamage = true;
	}

	getDealtDamage() {
		return this.dealtDamage;
	}

	/**
	 * return the movementPattern of the created entity
	 * if the movementType is straightMovement, then just return the value of this.movement
	 * Else it is movementType waveMovement: return the entry at a given index in the movementArray
	 */
	getMovementPattern() {
		if (this.movementType === 'straightMovement') {
			return this.movement;
		}
		return this.movement[this.movementGenerator.next().value];
	}

	/**
	 * Generator function, which iterates over the movement-array for type waveMovements.
	 * it starts again from zero, if the last index in the array is reached
	 * @param {Number} maxLength
	 */
	static* waveMovementGenerator(maxLength) {
		let index = 3;
		while (true) {
			if (index < maxLength - 1) {
				index += 1;
			} else {
				index = 0;
			}
			yield index;
		}
	}

	/**
	 * create an array for wave-like movements from top-left to bottom-left and so on
	 */
	static createWaveMovementArray() {
		const resArray = [];
		// push inclination movement (1x left, 1x top each) top the top left
		for (let i = 0; i < 6; i += 1) {
			resArray.push({ xAxis: -1, yAxis: 0 });
			resArray.push({ xAxis: 0, yAxis: -1 });
		}
		// push inclination movement (1x left, 1x bottom each) top the bottom left
		for (let i = 0; i < 6; i += 1) {
			resArray.push({ xAxis: -1, yAxis: 0 });
			resArray.push({ xAxis: 0, yAxis: 1 });
		}
		return resArray;
	}

	/**
	 * create an object for straight movements vom right to left
	 */
	static createStraightMovement() {
		return {
			xAxis: -1,
			yAxis: 0,
		};
	}
}
