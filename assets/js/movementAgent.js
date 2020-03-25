export default class MovementAgent {
	constructor(painter, gameField = undefined, activeEntitiesList = undefined) {
		this.painter = painter;
		this.gameField = gameField;
		this.activeEntitiesList = activeEntitiesList;
		this.stepSize = 20;
	}

	getPainter() {
		return this.painter;
	}

	/**
 * Function which moves a character on the entityCanvas
 * there is collisionDetection for the edges, tiles and other characters
 * @param {Number} xAxis
 * @param {Number} yAxis
 * @param {Object} entity
 */
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
			// destructure calcCoords and if a collision is found into existing variables
			({
				newCalcedCoords: newCoords,
				collisionDetected: foundCollision,
			} = this.checkForFieldEdgeCollision(
				entitySize,
				newCoords,
				entityType,
				canvasSize,
			)
			);
			if (!foundCollision) {
				foundCollision = await this.checkForFieldCollision(
					newCoords,
					entitySize,
					entityType,
					movementDirection,
					entity,
				);
				if (foundCollision) newCoords = [xCoord, yCoord];
			}
			// draw character
			// this.painter.clearCanvas('entities');
			// TODO: draw each active character again and update entitiesField
			// set new coords on the entity
			entity.setCoords(newCoords);
			// calc which enityType has to be drawn
			// const typeToDraw = entityType === 'playerCharacter' ?
			// 'playerCharacter_moving' : entityType;
			// update the entitiesField gamefield
			// todo: possible Bugs with moving npcs?
			this.gameField.updateEntitiesField(
				'entities',
				xCoord, yCoord,
				entitySize[0],
				entitySize[1],
				newCoords[0], newCoords[1],
				entityType,
			);
			// draw character
			// draw all characters in the entities list
			// const promiseArrayEntitiesToDraw = [];
			this.activeEntitiesList.drawActiveEntitiesList();
			// console.log(this.activeEntitiesList.getActiveEntitiesList());
			// this.activeEntitiesList.getActiveEntitiesList().forEach((activeEntity) => {
			// 	const { size, coords } = activeEntity.getCoordsAndSize();
			// 	const type = activeEntity.getType();
			// 	// promiseArrayEntitiesToDraw.push(
			// 	this.painter.drawCharacter(type, coords, size);
			// 	// );
			// });
			// await Promise.all(promiseArrayEntitiesToDraw);
			// await this.painter.drawCharacter(typeToDraw, newCoords, entitySize);
		}
	}

	static calcNewCoordinate(coord, step) {
		return coord + step;
	}

	// eslint-disable-next-line class-methods-use-this
	checkForFieldEdgeCollision([width, height], [newXCoord, newYCoord], type, canvasSize) {
		const newCalcedCoords = [newXCoord, newYCoord];
		let collisionDetected = false;
		// check for -x/left movement collision
		if (newXCoord <= 0) {
			collisionDetected = true;
			newCalcedCoords[0] = 0;
		}
		// check for +x/right movement collision
		if (newXCoord + width > canvasSize.xMax) {
		// if (newXCoord + width > canvasSize.xMax) {
			if (type === 'playerCharacter') {
				newCalcedCoords[0] = canvasSize.xMax - width;
			}
			// todo: else => monster
			collisionDetected = true;
		}
		// check for -y/top movement collision
		if (newYCoord <= 0) {
			newCalcedCoords[1] = 0;
			collisionDetected = true;
		}
		// check for -y/bottom movement collision
		if (newYCoord + height > canvasSize.yMax) {
			if (type === 'playerCharacter') {
				newCalcedCoords[1] = canvasSize.yMax - height;
			}
			collisionDetected = true;
		}
		return { newCalcedCoords, collisionDetected };
	}

	// eslint-disable-next-line class-methods-use-this
	async	checkForFieldCollision(passedCords, entitySize, entityType, movementDirection, entity) {
		console.log(entity);
		// todo: increase extensibility of entityTypes
		// todo: increase extensibility of tileTypes
		const mergedPartialField = await this.gameField.getMergedPartialField(
			passedCords,
			entitySize,
			movementDirection,
		);
		console.log(mergedPartialField);
		if (entityType === 'playerCharacter') {
			if (mergedPartialField.includes('flames')) {
				// todo: calc if hit by Flames
				return false;
			}
			if (mergedPartialField.includes('npcBoar') || mergedPartialField.includes('npcDragon')) {
				// check state of playerCharacter if entityType === 'playerCharacter'
				// further calc
				if (entity.getState() === 'attacking') {
					// different handling for boar and dragon beacause of hp
					if (mergedPartialField.includes('npcBoar')) {
						this.activeEntitiesList.removeNPC();
					}
					console.log('ATTACK');
				} else {
					entity.changeHP(20);
					console.log('got dmg');
				}
				return true;
			}
		}
		// entity type could be flames, boar or dragon
		if (entityType === 'boarCharacter' || entityType === 'dragonCharacter') {
			if (mergedPartialField.includes('playerCharacter')) {
				// check for state of playerCharacter attacking => dmg to entityType, else dmg player
				return false;
			}
		}
		if (mergedPartialField.includes('waterTile')) {
			return true;
		}
		// else: calc new coods;
		// TODO: check fieldCOllision and set returnvalue
		return false;
	}

	// /**
	//  *
	//  * @param {PlayerObject} entity
	//  * @param {Array} passedCoords
	//  */
	async attack(entity) {
		const { size, coords } = entity.getCoordsAndSize();
		const entityState = entity.getState();
		const mergedPartialField = await this.gameField.getMergedPartialField(
			[coords[0] + 1, coords[1]],
			size,
			'right',
		);
		if (entityState === 'attacking') {
			if (mergedPartialField.includes('npcBoar')) {
				this.activeEntitiesList.removeNPC();
				this.activeEntitiesList.drawActiveEntitiesList();
			}
			if (mergedPartialField.includes('npcDragon')) {
				console.log('attack Dragon');
			}
		}
	}

	setGameField(gameField) {
		this.gameField = gameField;
	}

	setActiveEntityList(list) {
		this.activeEntitiesList = list;
	}
}
