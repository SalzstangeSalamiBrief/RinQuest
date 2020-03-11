/* eslint-disable no-unused-vars */

export default class MovementAgent {
	constructor(painter, gameField = undefined) {
		this.painter = painter;
		this.gameField = gameField;
		this.stepSize = 20;
	}

	getPainter() {
		return this.painter;
	}

	// destructure character getCoordsAndSize()-object
	// eslint-disable-next-line class-methods-use-this
	async moveCharacter(xAxis = 0, yAxis = 0, entity) {
		// TODO dry moveX and moveY merged into one move-function
		if (xAxis !== yAxis) {
			let foundCollision = false;
			/*
			xAxis
				= 0 => not moved on this axis
				= 1 => positive movement on this axis
				= -1 negative Movement on this Axis
			*/
			const {
				coords: [xCoord, yCoord], size: entitySize,
			} = entity.getCoordsAndSize();
			const entityType = entity.getType();
			const canvasSize = this.painter.getCanvasSize();
			let movementDirection;
			let newCoords;
			if (xAxis !== 0) {
				movementDirection = xAxis === 1 ? 'right' : 'left';
				newCoords = [
					this.constructor.calcNewCoordinate(xCoord, xAxis),
					yCoord,
				];
			} else {
				// yAxis !== 0
				movementDirection = yAxis === 1 ? 'bottom' : 'top';
				newCoords = [
					xCoord,
					this.constructor.calcNewCoordinate(yCoord, yAxis),
				];
			}
			// todo check collision
			// check for collision with field

			newCoords = this.checkForFieldEdgeCollision(
				entitySize,
				newCoords,
				entityType,
				canvasSize,
			);
			// console.log(newCoords[0], newCoords[1], xCoord, yCoord);
			// check if there was a collision detected by checkForFieldEdgeCollision
			if (newCoords[0] === xCoord && newCoords[1] === yCoord) {
				foundCollision = true;
			}
			console.log(foundCollision);
			if (foundCollision === false) {
				newCoords = await this.checkForFieldCollision(
					newCoords,
					entitySize,
					entityType,
					movementDirection,
				);
			}

			// todo draw if no collision
			// draw field
			// draw character
			this.painter.clearCanvas('entities');
			// TODO: draw each active character again and update entitiesField
			entity.setCoords(newCoords);
			const typeToDraw = entityType === 'playerCharacter' ? 'playerCharacter_moving' : entityType;
			this.gameField.updateEntitiesField(
				'entities',
				xCoord, yCoord,
				entitySize[0],
				entitySize[1],
				newCoords[0], newCoords[1],
				entityType,
			);
			await this.painter.drawCharacter(typeToDraw, newCoords, entitySize);
		}
	}

	static calcNewCoordinate(coord, step) {
		return coord + step;
	}

	// eslint-disable-next-line class-methods-use-this
	checkForFieldEdgeCollision([width, height], [newXCoord, newYCoord], type, canvasSize) {
		const newCalcedCoords = [newXCoord, newYCoord];
		// check for -x/left movement collision
		if (newXCoord <= 0) newCalcedCoords[0] = 0;
		// check for +x/right movement collision
		if (newXCoord + width > canvasSize.xMax) {
		// if (newXCoord + width > canvasSize.xMax) {
			if (type === 'playerCharacter') {
				newCalcedCoords[0] = canvasSize.xMax - width;
			}
			// todo: else => monster
		}
		// check for -y/top movement collision
		if (newYCoord <= 0) newCalcedCoords[1] = 0;
		// check for -y/bottom movement collision
		if (newYCoord + height > canvasSize.yMax) {
			if (type === 'playerCharacter') {
				newCalcedCoords[1] = canvasSize.yMax - height;
			}
		}
		return newCalcedCoords;
	}

	// eslint-disable-next-line class-methods-use-this
	async	checkForFieldCollision(passedCords, entitySize, entityType, movementDirection) {
		const newCoords = passedCords;
		// todo: increase extensibility of entityTypes
		// todo: increase extensibility of tileTypes
		const mergedPartialField = await this.gameField.getMergedPartialField(
			passedCords,
			entitySize,
			movementDirection,
		);
		if (entityType === 'playerCharacter') {
			if (mergedPartialField.includes('flames')) {
				// todo: calc if hit by Flames
				return newCoords;
			}
			if (mergedPartialField.includes('boarCharacter') || mergedPartialField.includes('dragonCharacter')) {
				// check state of playerCharacter if entityType === 'playerCharacter'
				// further calc
				return newCoords;
			}
		}
		// entity type could be flames, boar or dragon
		if (entityType === 'boarCharacter' || entityType === 'dragonCharacter') {
			if (mergedPartialField.includes('playerCharacter')) {
				// check for state of playerCharacter attacking => dmg to entityType, else dmg player
				return newCoords;
			}
		}
		if (mergedPartialField.includes('waterTile')) {
			return passedCords;
		}
		// else: calc new coods;
		// TODO: check fieldCOllision and set returnvalue
		console.log(mergedPartialField);
		return newCoords;
	}

	setGameField(gameField) {
		this.gameField = gameField;
	}
}
