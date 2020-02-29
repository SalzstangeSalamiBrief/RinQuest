/* eslint-disable no-unused-vars */

export default class MovementAgent {
	constructor(painter) {
		this.painter = painter;
		this.stepSize = 20;
	}

	// destructure character getCoordsAndSize()-object
	// eslint-disable-next-line class-methods-use-this
	moveCharacter(xAxis = 0, yAxis = 0, character) {
		/*
		xAxis
			= 0 => not moved on this axis
			= 1 => positive movement on this axis
			= -1 negative Movement on this Axis
		*/
		const characterCoordAndSize = character.getCoordsAndSize();
		const characterType = character.getType();
		const canvasSize = this.painter.getCanvasSize();
		let newCoords;
		// TODO dry moveX and moveY merged into one move-function
		if (xAxis !== yAxis) {
			if (xAxis !== 0) {
				newCoords = [
					this.constructor.calcNewCoordinate(characterCoordAndSize.xCoord, this.stepSize * xAxis),
					characterCoordAndSize.yCoord,
				];
			} else {
				// yAxis !== 0
				newCoords = [
					characterCoordAndSize.xCoord,
					this.constructor.calcNewCoordinate(characterCoordAndSize.yCoord, this.stepSize * yAxis),
				];
			}
			// todo check collision
			// check for collision with field
			newCoords = this.checkForFieldCollision(
				characterCoordAndSize,
				newCoords,
				characterType,
				canvasSize,
			);
			// todo draw if no collision
			// draw field
			// draw character
			this.painter.clearCanvas('characters');
			// TODO: draw each active character again
			character.setCoords(newCoords);
			// requestAnimationFrame(this.painter.drawCharacter(characterType, newCoords));
			this.painter.drawCharacter(characterType, newCoords);
		}
	}

	static calcNewCoordinate(coord, step) {
		return coord + step;
	}

	// eslint-disable-next-line class-methods-use-this
	checkForFieldCollision({ width, height }, [newXCoord, newYCoord], type, canvasSize) {
		const newCalcedCoords = [newXCoord, newYCoord];
		// check for -x/left movement collision
		if (newXCoord <= 0) newCalcedCoords[0] = 0;
		// check for +x/right movement collision
		if (newXCoord + width > canvasSize.xMax) {
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


	checkForCollision(x, y) {
		// TODO: push functions
		// check for x outOfField
		const collisionObject = {
			collisionWithX: false,
			collisionWithY: false,
			typeOfCollision: [],
		};
		if (x <= 0 || x >= this.fieldCoords.xMax) {
			collisionObject.collisionWithX = true;
			collisionObject.typeOfCollision.push('outOfField');
		}
		if (y <= 0 || y >= this.fieldCoords.yMax) {
			collisionObject.collisionWithY = true;
			collisionObject.typeOfCollision.push('outOfField');
		}
		// todo: other checks
		// check for y outOfField
		// calc collisionX
		// calc collisionY
		// calc Type of Collision
		// todo move
		return collisionObject;
	}
}
