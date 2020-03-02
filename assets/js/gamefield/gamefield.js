// TODO: rename
export default class Gamefield {
	constructor() {
		this.field = [];
		/* todo:
      load field,
      push values,
      coding for tiles, characters,
    */
		for (let x = 0; x < 80; x += 1) {
			const row = [];
			for (let y = 0; y < 43; y += 1) {
				row.push(undefined);
			}
		}
	}

	setPartialField(xMin, yMin, xMax, yMax, value) {
		for (let x = xMin; x < xMax; xMax += 1) {
			for (let y = yMin; y < yMax; yMax += 1) {
				this.field[x][y] = value;
			}
		}
	}

	getField() {
		return this.field;
	}
}
