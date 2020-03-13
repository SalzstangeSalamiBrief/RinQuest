import { backgroundColumns, initEntities } from './fields.json';
// TODO: rename
export default class GameField {
	constructor(painter) {
		return new Promise((resolve) => {
			this.scrollIndex = 0;
			this.fieldMap = new Map();
			this.painter = painter;
			// reduce json-size with repeating
			this.repeatCol = backgroundColumns.scrollColumns[this.scrollIndex][0].repeat;
			// parallel init and drawing
			const promiseArray = [
				this.initField(backgroundColumns.start, 'background'),
				this.initField(initEntities, 'entities'),
				this.painter.drawCharacter(
					initEntities[0].type,
					initEntities[0].coords,
					initEntities[0].size,
				),
			];
			backgroundColumns.start
				.forEach((backgroundCol) => promiseArray.push(
					this.painter.drawBackgroundInit(backgroundCol),
				));
			Promise.all(promiseArray)
				.then(() => resolve(this));
		});
	}

	async	initField(inputArray, fieldType) {
		const resultArray = [];
		// init rows with 0es filled
		for (let i = 0; i < 43; i += 1) {
			resultArray.push(new Array(80).fill(0));
		}
		// set values according to the inputArray
		inputArray.forEach(({
			xMin, yMin, xMax, yMax, type,
		}) => {
			// console.log(type);
			for (let row = yMin; row < yMax; row += 1) {
				for (let col = xMin; col < xMax; col += 1) {
					resultArray[row][col] = type;
				}
			}
		});
		this.fieldMap.set(fieldType, resultArray);
	}

	// todo scroll character field
	scrollField(fieldType = 'background', movementAgent, character) {
		const map = this.fieldMap.get(fieldType);
		const scrollCol = backgroundColumns.scrollColumns[this.scrollIndex];
		scrollCol.forEach(({ start, end, type }) => {
			for (let i = start; i < end; i += 1) {
				map[i].shift();
				map[i].push(type);
			}
		});
		movementAgent.moveCharacter(-1, 0, character);
		this.repeatCol -= 1;
		// todo: end of scrollColumns
		if (this.repeatCol === 0) {
			this.scrollIndex += 1;
			this.repeatCol = backgroundColumns.scrollColumns[this.scrollIndex][0].repeat;
		}
		return this.painter.drawFieldMap(map);
	}

	updateEntitiesField(fieldType = 'entities', oldXCoord, oldYCoord, width, height, newXCoord, newYCoord, entityType) {
		const map = this.fieldMap.get(fieldType);

		/**
		 * TODO: Refactor into something like this to reduce steps
		 * top:
		 * 		row - 1; width
		 * bottom:
		 * 		row + 1; width
		 * left:
		 * 	height; col + 1
		 * right
		 * 	height; col -1
		 */
		// clear old position
		for (let row = oldYCoord; row < oldYCoord + height; row += 1) {
			for (let col = oldXCoord; col < oldXCoord + width; col += 1) {
				map[row][col] = 0;
			}
		}
		// insert new position
		for (let row = newYCoord; row < newYCoord + height; row += 1) {
			for (let col = newXCoord; col < newXCoord + width; col += 1) {
				map[row][col] = entityType;
			}
		}
	}

	getField(type) {
		return this.fieldMap.get(type);
	}

	async getMergedPartialField([xStart, yStart], [width, height], movementDirection) {
		// calc xStart, yStart, xEnd, yEnd based on movementDirection
		const movementObject = {};
		switch (movementDirection) {
		case 'right':
			movementObject.xStart = xStart + width - 1;
			movementObject.yStart = yStart;
			movementObject.xEnd = xStart + width;
			movementObject.yEnd = yStart + height;
			break;
		case 'left':
			movementObject.xStart = xStart - 1;
			movementObject.yStart = yStart;
			movementObject.xEnd = xStart;
			movementObject.yEnd = yStart + height;
			break;
		case 'top':
			movementObject.xStart = xStart;
			movementObject.yStart = yStart;
			movementObject.xEnd = xStart + width;
			movementObject.yEnd = yStart + 1;
			break;
		case 'bottom':
			movementObject.xStart = xStart;
			movementObject.yStart = yStart + height - 1;
			movementObject.xEnd = xStart + width;
			movementObject.yEnd = yStart + height;
			break;
		default: break;
		}
		// parallelize call of booth methods
		const [partialEntitiesField, partialBackgroundField] = await Promise.all([
			this.getPartialField(movementObject, 'entities'),
			this.getPartialField(movementObject, 'background'),
		]);
		// merge both field-arrays
		const mergedPartialField = [];
		for (let x = 0; x < partialEntitiesField.length; x += 1) {
			// if the partialBackgroundField[x] is a grassTile, then push partialEntitiesField[x].
			// Else: push partialBackgroundField[x]
			if (partialBackgroundField[x] === 'grassTile') {
				mergedPartialField.push(partialEntitiesField[x]);
			} else {
				mergedPartialField.push(partialBackgroundField[x]);
			}
		}
		return mergedPartialField;
	}

	/**
	 * get partial field from [xStart, yStart] to [yStart, yEnd]
	 * @param {Object} Object
	 * @param {String} fieldType
	 */
	async getPartialField({
		xStart, xEnd, yStart, yEnd,
	}, fieldType) {
		const field = this.fieldMap.get(fieldType);
		const result = [];
		for (let row = yStart; row < yEnd; row += 1) {
			for (let col = xStart; col < xEnd; col += 1) {
				result.push(field[row][col]);
			}
		}
		return result;
	}
}
