export default class MovementAgent {
	constructor(painter, gameField = undefined, activeEntitiesList = undefined) {
		this.painter = painter;
		this.gameField = gameField;
		this.activeEntitiesList = activeEntitiesList;
		this.stepSize = 20;
		this.regexDragon = /npcDragon/;
		this.regexBoar = /npcBoar/;
		this.regexFlames = /entityFlames/;
		this.regexNPCs = new RegExp('npcBoar|npcDraong');
		this.regexPlayer = /playerCharacter/;
		this.regexWaterTile = /waterTile/;
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
	async moveCharacter({ xAxis = 0, yAxis = 0, entity }) {
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
			const entityID = entityType === 'playerCharacter' ? undefined : entity.getID();
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
				entityID,
			)
			);
			if (!foundCollision) {
				foundCollision = await this.checkForFieldCollision(
					newCoords,
					movementDirection,
					entity,
				);
				if (foundCollision) newCoords = [xCoord, yCoord];
			}
			// draw character
			// set new coords on the entity
			entity.setCoords(newCoords);
			// calc which enityType has to be drawn
			// const typeToDraw = entityType === 'playerCharacter' ?
			// 'playerCharacter_moving' : entityType;
			// update the entitiesField gamefield
			// todo: possible Bugs with moving npcs?
			// todo: check if moving npcs gets updated
			this.gameField.updateEntitiesField(
				'entities',
				xCoord, yCoord,
				entitySize[0],
				entitySize[1],
				newCoords[0], newCoords[1],
				entityType,
			);
			// draw all entitites
		}
		this.activeEntitiesList.drawActiveEntitiesList();
	}

	static calcNewCoordinate(coord, step) {
		return coord + step;
	}

	// eslint-disable-next-line class-methods-use-this
	checkForFieldEdgeCollision(
		[width, height],
		[newXCoord, newYCoord],
		type,
		canvasSize,
		id = undefined,
	) {
		const newCalcedCoords = [newXCoord, newYCoord];
		let collisionDetected = false;
		// check for -x/left movement collision
		if (newXCoord <= 0) {
			collisionDetected = true;
			if (type === 'playerCharacter') {
				newCalcedCoords[0] = 0;
			} else {
				newCalcedCoords[0] = 0;
				this.activeEntitiesList.removeNPC(id);
			}
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

	// foundCollision = await this.checkForFieldCollision(
	// 	newCoords,
	// 	entitySize,
	// 	entityType,
	// 	movementDirection,
	// 	entity,
	// );

	// eslint-disable-next-line class-methods-use-this
	async	checkForFieldCollision(passedCords, movementDirection, entity) {
		const { size: entitySize } = entity.getCoordsAndSize();
		const entityType = entity.getType();
		// todo: increase extensibility of entityTypes
		// todo: increase extensibility of tileTypes
		const mergedPartialField = await this.gameField.getMergedPartialField(
			passedCords,
			entitySize,
			movementDirection,
		);
		console.log(mergedPartialField);
		if (entityType === 'playerCharacter') {
			return this.checkForFieldCollisionPlayer(mergedPartialField, entity);
		}
		if (entityType === 'npcBoar') {
			return this.checkForFieldCollisionBoar(mergedPartialField, entity);
		}
		// entity type could be flames, boar or dragon
		if (this.constructor.checkIfArrayIncludesString(this.regexNPCs, mergedPartialField)) {
			if (this.constructor.checkIfArrayIncludesString(this.regexPlayer, mergedPartialField)) {
				// check for state of playerCharacter attacking => dmg to entityType, else dmg player
				return false;
			}
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
		console.log(mergedPartialField);
		if (entityState === 'attacking') {
			if (this.constructor.checkIfArrayIncludesString(this.regexBoar, mergedPartialField)) {
				const { type, id } = 	this.constructor.getTypeOfEntity(this.regexBoar, mergedPartialField);
				this.activeEntitiesList.removeNPC(id);
				this.gameField.removeFromEntitiesField(type, id);
				console.log(this.gameField.getField('entities'));
				// todo remove from gamefield

				// this.gameField.removeFromEntitiesField(type, id);
				this.activeEntitiesList.drawActiveEntitiesList();
			}
			if (this.constructor.checkIfArrayIncludesString(this.regexDragon, mergedPartialField)) {
				console.log('attack Dragon');
			}
		}
	}

	static checkIfArrayIncludesString(regex, item) {
		const itemsToCheck = [...item];
		let isIncluded = false;
		for (let i = 0; i < itemsToCheck.length; i += 1) {
			isIncluded = isIncluded || regex.test(item[i]);
		}
		return isIncluded;
	}

	static getTypeOfEntity(regex, arr) {
		let result;
		for (let i = 0; i < arr.length; i += 1) {
			result = arr[i].match(regex);
			if (result !== undefined) {
				break;
			}
		}
		const [type, id] = result.input.split('_');
		return { type, id };
	}

	setGameField(gameField) {
		this.gameField = gameField;
	}

	setActiveEntityList(list) {
		this.activeEntitiesList = list;
	}

	/**
 * Calculate fieldCollisions for boars
 * @param {Array} mergedPartialField
 * @param {Entity} entity
 */
	checkForFieldCollisionBoar(mergedPartialField, entity) {
		// if a playercharacter got hit
		if (this.constructor.checkIfArrayIncludesString(/playerCharacter/, mergedPartialField)) {
			const playerEntity = this.activeEntitiesList.getPlayerEntity();
			// check if the player character is attacking
			if (playerEntity.getState() === 'attacking') {
				// remove this npc
				this.activeEntitiesList.removeNPC(entity.getID());
			} else if (entity.getDealtDamage() === false) {
				// player is not Attacking => set dealtDamage and decrease hp of the player
				entity.setDealtDamage();
				playerEntity.changeHP(20);
			}
			// return false to let the boar pass
		}
		return false;
	}


	/**
	 * Calculate fieldCollisions for player
	 * @param {Array} mergedPartialField
	 * @param {Entity} entity
	 */
	checkForFieldCollisionPlayer(mergedPartialField, entity) {
		let result = false;
		// check if a waterTile gets hit
		if (this.constructor.checkIfArrayIncludesString(this.regexWaterTile, mergedPartialField)) {
			result = true;
		}
		// check if a flame gets hit
		if (this.constructor.checkIfArrayIncludesString(this.regexFlames, mergedPartialField)) {
			// todo: calc if hit by Flames
			result = false;
		}
		// check if an npc gets hit
		if (this.constructor.checkIfArrayIncludesString(this.regexNPCs, mergedPartialField)) {
			// check state of playerCharacter if entityType === 'playerCharacter'
			// further calc
			console.log('hit some entity');
			// if the player is in attacking state,
			if (entity.getState() === 'attacking') {
				// different handling for boar and dragon beacause of hp
				// if a boar gets hgit, remove it
				if (this.constructor.checkIfArrayIncludesString(this.regexBoar, mergedPartialField)) {
					const { id, type } = this.constructor.getTypeOfEntity(this.regexBoar, mergedPartialField);
					this.gameField.removeFromEntitiesField(type, id);
					this.activeEntitiesList.removeNPC(id);
				}
				if (this.constructor.checkIfArrayIncludesString(this.regexDragon, mergedPartialField)) {
					// if a dragon gets hit, deal damage to the dragon
					console.log('hitDragon');
				}
				console.log('ATTACK');
			} else {
				// todo: get id from mergedPartialField, set damageDealt to this entity
				entity.changeHP(20);
				console.log('got dmg');
			}
			result = true;
		}
		return result;
	}

	// static getCollisionEntity(mergedPartialField) {
	// 	const res = { id: 0, type: undefined };
	// 	for (let i = 0; i < mergedPartialField.length; i += 1) {
	// 		if (mergedPartialField[i].match(this.regexNPCs)) {
	// 			const [type, id] = mergedPartialField[i].split('_');
	// 			res.type = type;
	// 			res.id = id;
	// 			break;
	// 		}
	// 	}
	// 	return res;
	// }
}
