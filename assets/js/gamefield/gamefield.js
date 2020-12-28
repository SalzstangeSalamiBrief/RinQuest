import { backgroundColumns, initEntities, inactiveEntities } from './fields.json';

export default class GameField {
	constructor(painter, activeEntityList) {
		return new Promise((resolve) => {
			this.activeEntityList = activeEntityList;
			this.scrollIndex = 0;
			this.fieldMap = new Map();
			this.painter = painter;
			// reduce json-size with repeating
			this.repeatCol = backgroundColumns.scrollColumns[this.scrollIndex][0].repeat;
			// parallel init and drawing
			const promiseArray = [
				this.initField(backgroundColumns.start, 'background'),
				this.initField(initEntities, 'entities'),
			];
			// draw each active entity of the init screen
			this.activeEntityList.getAllEntities().forEach((entity) => {
				const { coords, size } = entity.getCoordsAndSize();
				const type = entity.getType();
				this.painter.drawCharacter(type, coords, size);
			});
			this.activeEntityList.setInactiveEntities(inactiveEntities);
			// wait to succeed all promises in promiseArray and then paint background field
			Promise.all(promiseArray)
				.then(() => this.painter.drawFieldMap(this.fieldMap.get('background')))
				.then(() => resolve(this));
		});
	}


	/**
	 * Calc an Object with coords for the movement direction
	 * @param {String} movementDirection
	 * @param {Number} xStart
	 * @param {Number} yStart
	 * @param {Number} width
	 * @param {Number} height
	 */
	static calcMovementDirection(movementDirection, xStart, yStart, width, height) {
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
		return movementObject;
	}
	/** <--------------- general functions ----------> */


	async	initField(inputArray, fieldType) {
		const resultArray = [];
		// init rows with 0es filled
		for (let row = 0; row < 43; row += 1) {
			resultArray.push(new Array(80).fill(''));
		}
		// set values according to the inputArray
		inputArray.forEach(({
			xMin, yMin, xMax, yMax, type, id = undefined,
		}) => {
			for (let r = yMin; r < yMax; r += 1) {
				const row = resultArray[r];
				for (let col = xMin; col < xMax; col += 1) {
					const suffix = id !== undefined ? `_${id}` : '';
					row[col] = `${type}${suffix}`;
				}
			}
		});
		this.fieldMap.set(fieldType, resultArray);
	}

	/**
	 * check if the first inactiveEntity can be displayed
	 * return null if that is not the case, else return the entity
	 * @param {Number} acutalMaxXCoord
	 */
	checkForCreationOfNewEntity(actualMaxXCoord) {
		let result = null;
		// get first inanctive entty and check if it can be displayed
		const inactiveEntity = this.activeEntityList.getFirstInactiveEntity();
		if (inactiveEntity !== null) {
			const isActualXCoordVisible = actualMaxXCoord === inactiveEntity.xMax;
			if (isActualXCoordVisible) {
				result = this.activeEntityList.getFistInactiveEntity();
			}
		}
		return result;
	}

	/**
	 * Scroll the Field by 1 each call from right to left
	 * @param {String} fieldType
	 */
	async scrollField(fieldType = 'background') {
		let hasScrolled = false;
		if (this.scrollIndex < backgroundColumns.scrollColumns.length) {
			const map = this.fieldMap.get(fieldType);
			const scrollCol = backgroundColumns.scrollColumns[this.scrollIndex];
			// scroll each col of background
			for (let i = 0; i < scrollCol.length; i += 1) {
				const { start, end, type } = scrollCol[i];
				for (let cell = start; cell < end; cell += 1) {
					map[cell].shift();
					map[cell].push(type);
				}
			}

			this.repeatCol -= 1;
			if (this.repeatCol === 0) {
				this.scrollIndex += 1;
				// check if the new scrollIndex actually exist
				if (this.scrollIndex < backgroundColumns.scrollColumns.length) {
					// new scrollIndex exists, set repeatCol to next repeat-Entry in scrollColumns
					this.repeatCol = backgroundColumns.scrollColumns[this.scrollIndex][0].repeat;
				}
			}
			hasScrolled = true;
			this.painter.drawFieldMap(map);
		}
		return hasScrolled;
	}

	updateEntitiesField(fieldType = 'entities', oldXCoord, oldYCoord, width, height, newXCoord, newYCoord, entityType, id = '') {
		const map = this.fieldMap.get(fieldType);
		const entityToUpdate = `${entityType}${id !== '' ? '_' : ''}${id}`;
		// clear old position
		for (let row = oldYCoord; row < oldYCoord + height; row += 1) {
			for (let col = oldXCoord; col < oldXCoord + width; col += 1) {
				map[row][col] = this.constructor.removeEntryFromCell(entityToUpdate, map[row][col]);
			}
		}
		// insert new position
		for (let r = newYCoord; r < newYCoord + height; r += 1) {
			const row = map[r];
			for (let col = newXCoord; col < newXCoord + width; col += 1) {
				// check if the entity already exists in the cell
				const isEntityInCell = new RegExp(entityToUpdate).test(row[col]);
				if (!isEntityInCell) {
					row[col] = (`${row[col]} ${entityToUpdate}`).trim();
				}
			}
		}
	}

	/**
	 * remove and entity from the entitiesField
	 * @param {String} entityType
	 * @param {*} id
	 */
	removeFromEntitiesField(entityType = undefined, id = '') {
		const entityToRemove = `${entityType}${id !== '' ? '_' : ''}${id}`;
		const map = this.fieldMap.get('entities');
		const maxRows = map.length;
		const maxCols = map[0].length;
		for (let row = 0; row < maxRows; row += 1) {
			for (let col = 0; col < maxCols; col += 1) {
				const isEntityToRemoveInCell = new RegExp(entityToRemove).test(map[row][col]);
				if (isEntityToRemoveInCell) {
					map[row][col]	= this.constructor.removeEntryFromCell(entityToRemove, map[row][col]);
				}
			}
		}
	}

	/**
	 * Remove an entry from the given cell
	 * @param {String} entityToUpdate
	 * @param {String} cell
	 */
	static removeEntryFromCell(entityToRemove, cell = '') {
		const entries = [...cell.split(' ')];
		for (let entryIndex = 0; entryIndex < entries.length; entryIndex += 1) {
			const isEntryFilledByEntityToRemove = entityToRemove === entries[entryIndex];
			if (isEntryFilledByEntityToRemove) {
				entries.splice(entryIndex, 1);
			}
		}
		return entries.join(' ').trim();
	}

	addEntityAtCoords(entityToAdd) {
		const { size: [width, height], coords: [xCoord, yCoord] } = entityToAdd.getCoordsAndSize();
		const maxXCoord = xCoord + width;
		const maxYCoord = yCoord + height;
		const entryToAdd = `${entityToAdd.getType()}_${entityToAdd.getID()}`;
		const map = this.fieldMap.get('entities');
		for (let row = yCoord; row < maxYCoord; row += 1) {
			for (let col = xCoord; col < maxXCoord; col += 1) {
				map[row][col] += ` ${entryToAdd}`;
				map[row][col].trim();
			}
		}
	}

	/** <--------------- getter ----------> */


	getField(type) {
		return this.fieldMap.get(type);
	}

	async getMergedPartialField([xStart, yStart], [width, height], movementDirection) {
		const movementObject = this.constructor.calcMovementDirection(
			movementDirection, xStart, yStart, width, height,
		);

		const [partialEntitiesField, partialBackgroundField] = await Promise.all([
			this.getPartialField(movementObject, 'entities'),
			this.getPartialField(movementObject, 'background'),
		]);

		const mergedPartialField = [];
		for (let x = 0; x < partialEntitiesField.length; x += 1) {
			const isCellAGrassTile = partialBackgroundField[x] === 'grassTile';
			if (isCellAGrassTile) {
				mergedPartialField.push(partialEntitiesField[x].split(' '));
			} else {
				mergedPartialField.push(partialBackgroundField[x]);
			}
		}
		return mergedPartialField.flat();
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
