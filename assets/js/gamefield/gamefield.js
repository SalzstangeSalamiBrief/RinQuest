import { backgroundColumns, initCharacters } from './fields.json';
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
			Promise.all([
				this.initField(backgroundColumns.start, 'background'),
				this.initField(initCharacters, 'characters'),
				this.painter.drawBackgroundInit(backgroundColumns.start[0]),
				this.painter.drawBackgroundInit(backgroundColumns.start[1]),
				this.painter.drawCharacter(
					initCharacters[0].type,
					initCharacters[0].coords,
					initCharacters[0].size,
				),
			])
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
			xMin, yMin, xMax, yMax, imageName,
		}) => {
			for (let row = yMin; row < yMax; row += 1) {
				for (let col = xMin; col < xMax; col += 1) {
					resultArray[row][col] = imageName;
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

	getField(type) {
		return this.fieldMap.get(type);
	}
}
