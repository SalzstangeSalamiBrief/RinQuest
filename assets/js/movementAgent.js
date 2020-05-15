export default class MovementAgent {
	constructor(painter, gameField = undefined, activeEntitiesList = undefined) {
		this.painter = painter;
		this.gameField = gameField;
		this.activeEntitiesList = activeEntitiesList;
		this.stepSize = 20;
		this.regexDragon = /npcDragon_99/;
		this.regexBoar = /^npcBoar_[0-9]{1,3}$/;
		this.regexFlames = /^entityFlames_[0-9]*$/;
		this.regexNPCs = new RegExp('^npcBoar_[0-9]{1,3}|npcDragon_99$');
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
			let {
				// eslint-disable-next-line prefer-const
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
			// console.log(foundCollision, entityID);
			if (!foundCollision) {
				foundCollision = await this.checkForFieldCollision(
					newCoords,
					movementDirection,
					entity,
				);
				if (foundCollision) {
					({ coords: [xCoord, yCoord] } = entity.getCoordsAndSize());
					newCoords = [xCoord, yCoord];
				}
			}
			//  else if (foundCollision && typeof entityID === 'string') {
			// 	// console.log('hihihi');
			// 	this.activeEntitiesList.removeEntity(entityID);
			// }
			// draw character
			// set new coords on the entity
			entity.setCoords(newCoords);
			// calc which enityType has to be drawn
			// const typeToDraw = entityType === 'playerCharacter' ?
			// 'playerCharacter_moving' : entityType;
			// update the entitiesField gamefield
			// todo: possible Bugs with moving npcs?
			// todo: check if moving npcs gets updated
			const entityTypeToUpdate = entityType === 'playerCharacter'
				? 'playerCharacter' : `${entityType}_${entity.getID()}`;
			if (entityTypeToUpdate !== 'playerCharacter' && (newCoords[0] <= 0 || newCoords[1] <= 0)) {
				this.activeEntitiesList.removeEntity(entityID);
			} else {
				this.gameField.updateEntitiesField(
					'entities',
					xCoord, yCoord,
					entitySize[0],
					entitySize[1],
					newCoords[0], newCoords[1],
					entityTypeToUpdate,
				);
				// update coords of entity
				entity.setCoords(newCoords);
			}

			// if(entityTypeToUpdate !== 'playerCharacter'){
			// 	if()
			// }
		}
		// draw all entitites
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
				this.activeEntitiesList.removeEntity(id);
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
		// console.log(mergedPartialField);
		if (entityType === 'playerCharacter') {
			return this.checkForFieldCollisionPlayer(mergedPartialField, entity);
		}
		if (entityType !== 'playerCharacter') {
			return this.checkForFieldCollisionNPC(mergedPartialField, entity);
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
		// console.log(mergedPartialField);
		if (entityState === 'attacking') {
			// decide for the used regex (regexBoar or regexDragon)
			let regexOfEntity;
			if (this.constructor.checkIfArrayIncludesString(this.regexBoar, mergedPartialField)) {
				regexOfEntity = 'regexBoar';
			}
			if (this.constructor.checkIfArrayIncludesString(this.regexDragon, mergedPartialField)) {
				regexOfEntity = 'regexDragon';
			}
			// regexOfEntity is not undefined
			if (regexOfEntity !== undefined) {
				const { type, id } = this.constructor.getTypeOfEntity(
					this[regexOfEntity], mergedPartialField,
				);
				if (regexOfEntity === 'regexBoar') {
					this.activeEntitiesList.removeEntity(id);
					this.gameField.removeFromEntitiesField(type, id);
				}
				if (regexOfEntity === 'regexDragon') {
					// console.log('func Attack');
					this.damageDragon();
				}
			}
		}
	}

	/**
	 * Validate if an array includes a given string/regex
	 * @param {Regex} regex
	 * @param {*} item
	 */
	static checkIfArrayIncludesString(regex, item) {
		// console.log(item);
		const itemsToCheck = [...item];
		let isIncluded = false;
		for (let i = 0; i < itemsToCheck.length; i += 1) {
			isIncluded = isIncluded || regex.test(item[i]);
		}
		// console.log(isIncluded);
		return isIncluded;
	}

	/**
	 * Calculate teh type and id for the first match of an entity in the input array
	 * @param {Regex} regex
	 * @param {Array} arr
	 */
	static getTypeOfEntity(regex, arr) {
		// console.log(regex, arr);
		let type;
		let id;
		for (let i = 0; i < arr.length; i += 1) {
			// safety check if arr[i] is from type string
			if (typeof arr[i] === 'string') {
				const match = arr[i].match(regex);
				// if there was a result
				if (match !== null) {
					// extract type and id from the entity
					[type, id] = match.input.split('_');
					// break for loop
					break;
				}
			}
		}
		return { type, id };
	}

	setGamefield(gamefield) {
		this.gameField = gamefield;
	}

	setActiveEntityList(list) {
		this.activeEntitiesList = list;
	}

	/**
 * Calculate fieldCollisions for boars
 * @param {Array} mergedPartialField
 * @param {Entity} entity
 */
	checkForFieldCollisionNPC(mergedPartialField, entity) {
		// if a playerCharacter got hit
		if (this.constructor.checkIfArrayIncludesString(/playerCharacter/, mergedPartialField)) {
			// console.log('NPC HIT Player');
			const playerEntity = this.activeEntitiesList.getPlayerEntity();
			const { type: entityType, id } = entity;
			// check if the player character is attacking
			if (playerEntity.getState() === 'attacking') {
				// remove this npc if its not a dragon
				if (entityType !== 'npcDragon') {
					// console.log('func checkForFieldCollisionNPC');
					this.activeEntitiesList.removeEntity(id);
					this.gameField.removeFromEntitiesField(entityType, id);
				}
			} else {
				// console.log('PLYER NON ATTACKING');
				playerEntity.decreaseHP();
			}
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
		// check if an npc gets hit
		if (this.constructor.checkIfArrayIncludesString(this.regexNPCs, mergedPartialField)) {
			// check state of playerCharacter if entityType === 'playerCharacter'
			// further calc
			console.log(mergedPartialField);
			// TODO: REmove Boar properly from gamefield etc.
			// get id and type from the corresponding npc
			// let id;
			// let type;
			// try {
			// 	({ id, type } = this.constructor.getTypeOfEntity(this.regexNPCs, mergedPartialField));
			// } catch (err) {
			// 	console.log('err func checkForFieldCollisionPlayer');
			// 	throw err;
			// }
			const { id, type } = this.constructor.getTypeOfEntity(this.regexNPCs, mergedPartialField);
			// if the player is in attacking state,
			if (entity.getState() === 'attacking') {
				// check if the player hits a boar
				if (this.constructor.checkIfArrayIncludesString(this.regexBoar, mergedPartialField)) {
					// if a boar gets hit, remove it
					this.gameField.removeFromEntitiesField(type, id);
					this.activeEntitiesList.removeEntity(id);
				}
				console.log(mergedPartialField);
				// check if the player hits a dragon
				if (this.constructor.checkIfArrayIncludesString(this.regexDragon, mergedPartialField)) {
					// deal damage to dragon
					this.damageDragon();
				}
				result = true;
			} else {
				// the player is not in the state of attacking
				if (this.constructor.checkIfArrayIncludesString(this.regexNPCs, mergedPartialField)) {
					// if the player hits an dragon/boar decrease hp
					entity.decreaseHP();
				}
				if (this.constructor.checkIfArrayIncludesString(this.regexFlames, mergedPartialField)) {
					// if the player hits a flame decrease hp
					entity.decreaseHP();
				}
				result = true;
			}
			// result = true;
		}
		return result;
	}

	damageDragon() {
		const activeDragon = this.activeEntitiesList.getDragon();
		// TODO: FIX bug: Dragon loses 100HP in under 1 second
		// if (activeDragon.getGotDamage() === false) {
		const dragonIsAlive = activeDragon.decreaseHP(20);
		// console.log(dragonIsAlive);
		if (!dragonIsAlive) {
			const id = activeDragon.getID();
			this.activeEntitiesList.removeEntity(id);
			this.gameField.removeFromEntitiesField('npcDragon', id);
		}
		// }
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
