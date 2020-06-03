import NPC from './nonPlayerCharacter';

export default class Boar extends NPC {
	constructor(posX, posY, id, movementType = 'straightMovement') {
		// height: 5, width: 7
		super(posX, posY, 7, 5, 'npcBoar', id);
		this.movementType = movementType;
		/*
		calculate different values for movement by the given movementTypebundleRenderer.renderToStream
		if movementType === 'waveMovement,
			then create this.movemenGenerator which is used to iterate over the movemen-array
	*/
		if (movementType === 'waveMovement') {
			this.movementGenerator = this.constructor.waveMovementGenerator(24);
		} else {
			this.movement = this.constructor.createStraightMovement();
		}
	}


	/** <--------------- general functions ----------> */

	/**
	 * create an object for straight movements vom right to left
	 */
	static createStraightMovement() {
		return {
			xAxis: -1,
			yAxis: 0,
		};
	}

	/**
	 * Generator function, which iterates over the movement-array for type waveMovements.
	 * it starts again from zero, if the last index in the array is reached
	 * @param {Number} maxLength
	 */
	static* waveMovementGenerator(maxLength) {
		let index = 0;
		while (true) {
			if (index < maxLength - 1) {
				index += 1;
			} else {
				index = 0;
			}
			yield index;
		}
	}

	/** <--------------- getter ----------> */

	/**
	 * return the movementPattern of the created entity
	 * if the movementType is straightMovement, then just return the value of this.movement
	 * Else it is movementType waveMovement: return the entry at a given index in the movementArray
	 */
	getMovementPattern() {
		// straight movement
		if (this.movementType === 'straightMovement') {
			return this.movement;
		}
		// wave movement
		const result = { xAxis: 0, yAxis: 0 };
		const stepIndex = this.movementGenerator.next().value;
		// straight left movement
		if (stepIndex % 2 === 0) {
			result.xAxis = -1;
			return result;
		} if (stepIndex < 12) {
			// top movement
			result.yAxis = -1;
		} else {
			// bottom movement
			result.yAxis = 1;
		}
		return result;
	}
}
