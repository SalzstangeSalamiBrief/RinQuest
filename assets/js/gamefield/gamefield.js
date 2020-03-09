/* eslint-disable class-methods-use-this */
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

	getMergedPartialField([xStart, yStart], [width, height]) {
		// todo: loop only through needed site and not all sites
		const entitiesField = this.fieldMap.get('entities');
		console.log(this.fieldMap.entries());
		// console.log(entitiesField);
		const backgroundField = this.fieldMap.get('background');
		// console.log(backgroundField);
		const mergedPartialField = [];
		// create full field
		for (let row = yStart - 1; row < yStart + height + 1; row += 1) {
			const tempRow = [];
			// console.log(`row:  ${row}`);
			for (let col = xStart - 1; col < xStart + width + 1; col += 1) {
				// only the tiles outside of the entity need to be considered
				const dontPush = (
					row >= yStart
					&& row < yStart + height
					&& col >= xStart
					&& col < xStart + width
				);

				if (!dontPush) {
					// TODO: Merge entities + background
					// TODO: bug where wrong piece gets selected
					console.log(backgroundField[row][col]);
					console.log('--------------------');
					console.log(entitiesField[row][col]);
					if (backgroundField[row][col] === 'grassTile') {
						tempRow.push(entitiesField[row][col]);
					} else {
						tempRow.push(0);
					}
				}
			}
			mergedPartialField.push(tempRow);
		}

		// console.log(mergedPartialField);
		// console.log(xStart, yStart, width, height);
		return mergedPartialField;
	}
}
