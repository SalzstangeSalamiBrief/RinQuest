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

	/** <--------------- general functions ----------> */

	/**
   * Function which moves a character on the entityCanvas
   * there is collisionDetection for the edges, tiles and other characters
   * @param {Number} xAxis
   * @param {Number} yAxis
   * @param {Object} entity
   */
	async moveCharacter({ xAxis = 0, yAxis = 0, entity }) {
		if (xAxis !== yAxis) {
			let foundCollision = false;
			/*
		xAxis
			= 0 => not moved on this axis
			= 1 => positive movement on this axis
			= -1 negative Movement on this Axis
		*/
			let {
				coords: [xCoord, yCoord],
				// eslint-disable-next-line prefer-const
				size: entitySize,
			} = entity.getCoordsAndSize();
			const entityType = entity.getType();
			const canvasSize = this.painter.getCanvasSize();
			let movementDirection;
			let newCoords;
			if (xAxis !== 0) {
				movementDirection = xAxis === 1 ? 'right' : 'left';
				newCoords = [this.constructor.calcNewCoordinate(xCoord, xAxis), yCoord];
			} else {
				// yAxis !== 0
				movementDirection = yAxis === 1 ? 'bottom' : 'top';
				newCoords = [xCoord, this.constructor.calcNewCoordinate(yCoord, yAxis)];
			}
			const entityID = entityType === 'playerCharacter' ? undefined : entity.getID();
			// check for collision with field
			({
				newCalcedCoords: newCoords,
				collisionDetected: foundCollision,
			} = this.checkForFieldEdgeCollision(
				entitySize,
				newCoords,
				entityType,
				canvasSize,
				entityID,
			));
			if (!foundCollision) {
				// if no collisions with the edge is found, check for collisions on the field
				foundCollision = await this.checkForFieldCollision(
					newCoords,
					movementDirection,
					entity,
				);
				// if a field collision was found, set new coords
				if (foundCollision) {
					({
						coords: [xCoord, yCoord],
					} = entity.getCoordsAndSize());
					newCoords = [xCoord, yCoord];
				}
			}
			// execute calculated movement for the entity
			await this.executeEntityMovement(
				entity,
				entityType,
				newCoords,
				[xCoord, yCoord],
				entityID,
				movementDirection,
			);
		}
		// draw all entitites
		this.activeEntitiesList.drawActiveEntitiesList();
	}

	/**
   * Check for collisions with the edges of the field
   * @param {Array} size
   * @param {Array} coords
   * @param {String} type
   * @param {Number} canvasSize
   * @param {String} id
   */
	checkForFieldEdgeCollision(
		[width, height],
		[newXCoord, newYCoord],
		type,
		canvasSize,
		id = undefined,
	) {
		const newCalcedCoords = [newXCoord, newYCoord];
		const isFromTypePlayer = type === 'playerCharacter';
		let collisionDetected = false;
		// check for left movement collision
		if (newXCoord <= 0) {
			collisionDetected = true;
			if (isFromTypePlayer) {
				newCalcedCoords[0] = 0;
			} else {
				newCalcedCoords[0] = 0;
				this.activeEntitiesList.removeEntity(id);
			}
		}
		// check for right movement collision
		const isMovementToRightInField = newXCoord + width > canvasSize.xMax;
		if (isMovementToRightInField) {
			if (isFromTypePlayer) {
				newCalcedCoords[0] = canvasSize.xMax - width;
			}
			collisionDetected = true;
		}
		// check for -y/top movement collision
		if (newYCoord <= 0) {
			newCalcedCoords[1] = 0;
			collisionDetected = true;
		}
		// check for -y/bottom movement collision
		const isMovementToBottomInField = newYCoord + height > canvasSize.yMax;
		if (isMovementToBottomInField) {
			if (isFromTypePlayer) {
				newCalcedCoords[1] = canvasSize.yMax - height;
			}
			collisionDetected = true;
		}
		return { newCalcedCoords, collisionDetected };
	}

	/**
   * Check for collision on the field for the passed entity in
   * the given direction based on the passed coordinates
   * different checks for playerCharacter and npc entities
   * @param {Array} passedCords
   * @param {String} movementDirection
   * @param {Entity} entity
   */
	async checkForFieldCollision(passedCords, movementDirection, entity) {
		const { size: entitySize } = entity.getCoordsAndSize();
		const entityType = entity.getType();
		const mergedPartialField = await this.gameField.getMergedPartialField(
			passedCords,
			entitySize,
			movementDirection,
		);
		if (entityType === 'playerCharacter') {
			return this.checkForFieldCollisionPlayer(
				mergedPartialField,
				entity,
				movementDirection,
			);
		}
		if (entityType !== 'playerCharacter') {
			return this.checkForFieldCollisionNPC(mergedPartialField, entity);
		}
		// entity type could be flames, boar or dragon
		const isEntityFromTypeNPCInvolved = 		this.constructor.checkIfArrayIncludesString(
			this.regexNPCs,
			mergedPartialField,
		);
		const isPlayerEntityInvolved = this.constructor.checkIfArrayIncludesString(
			this.regexPlayer,
			mergedPartialField,
		);

		return isEntityFromTypeNPCInvolved && isPlayerEntityInvolved;
	}

	/**
   * Calculate fieldCollisions for boars
   * @param {Array} mergedPartialField
   * @param {Entity} entity
   */
	checkForFieldCollisionNPC(mergedPartialField, entity) {
		const { type: entityType, id } = entity;
		// if a playerCharacter got hit
		const isCollisionWithWaterTile = this.constructor.checkIfArrayIncludesString(
			this.regexWaterTile,
			mergedPartialField,
		);
		const isCollisionWIthPlayer = this.constructor.checkIfArrayIncludesString(
			/playerCharacter/,
			mergedPartialField,
		);

		if (isCollisionWithWaterTile) {
			this.activeEntitiesList.removeEntity(id);
			this.gameField.removeFromEntitiesField(entityType, id);
		} else if (isCollisionWIthPlayer) {
			const playerEntity = this.activeEntitiesList.getPlayerEntity();
			const isPlayerAttacking = playerEntity.getState() === 'attacking';

			if (isPlayerAttacking) {
				const isEntityNotADragon = entityType !== 'npcDragon';

				if (isEntityNotADragon) {
					this.activeEntitiesList.removeEntity(id);
					this.gameField.removeFromEntitiesField(entityType, id);
				}
			} else {
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

		const gotWaterTileHit = this.constructor.checkIfArrayIncludesString(
			this.regexWaterTile,
			mergedPartialField,
		);
		if (gotWaterTileHit) {
			result = true;
		}

		const gotNPCHit = this.constructor.checkIfArrayIncludesString(
			this.regexNPCs,
			mergedPartialField,
		);
		if (gotNPCHit) {
			const { id, type } = this.constructor.getTypeOfEntity(
				this.regexNPCs,
				mergedPartialField,
			);
			const isPlayerAttacking = entity.getState() === 'attacking';
			if (isPlayerAttacking) {
				const isPlayerHittingABoar = this.constructor.checkIfArrayIncludesString(
					this.regexBoar,
					mergedPartialField,
				);
				if (isPlayerHittingABoar) {
					this.gameField.removeFromEntitiesField(type, id);
					this.activeEntitiesList.removeEntity(id);
				}
				const isPlayerHittingADragon = this.constructor.checkIfArrayIncludesString(
					this.regexDragon,
					mergedPartialField,
				);
				if (isPlayerHittingADragon) {
					this.damageDragon();
				}
				result = false;
			} else {
				// case: the player is not in the state of attacking
				const gotPlayerHitByNPCs = this.constructor.checkIfArrayIncludesString(
					this.regexNPCs,
					mergedPartialField,
				);
				if (gotPlayerHitByNPCs) {
					entity.decreaseHP();
				}
				const gotPlayerHitByFlame	=	this.constructor.checkIfArrayIncludesString(
					this.regexFlames,
					mergedPartialField,
				);
				if (gotPlayerHitByFlame) {
					entity.decreaseHP();
				}
				result = false;
			}
		}
		return result;
	}

	/**
   * check if a given entity collides with an non walkable environmentTile
   */
	async checkForEnvTileCollision(passedCords, entitySize, movementDirection) {
		const mergedPartialField = await this.gameField.getMergedPartialField(
			passedCords,
			entitySize,
			movementDirection,
		);
		return 	this.constructor.checkIfArrayIncludesString(
			this.regexWaterTile,
			mergedPartialField,
		);
		// const isTile
		// if (
		// 	this.constructor.checkIfArrayIncludesString(
		// 		this.regexWaterTile,
		// 		mergedPartialField,
		// 	)
		// ) {
		// 	return true;
		// }
		// return false;
	}

	/**
   * Damage the dragon by 20
   * If the dragon is not alive after that, remove him from the field and activeEntityList
   */
	damageDragon() {
		const activeDragon = this.activeEntitiesList.getDragon();
		const dragonIsAlive = activeDragon.decreaseHP(20);
		if (!dragonIsAlive) {
			const id = activeDragon.getID();
			this.activeEntitiesList.removeEntity(id);
			this.gameField.removeFromEntitiesField('npcDragon', id);
		}
	}

	/**
   * Calculate a new Coordinate by adding the passed coord with the passed step
   * @param {Number} coord
   * @param {Number} step
   */
	static calcNewCoordinate(coord, step) {
		return coord + step;
	}

	/**
   * execute the movement of an Entity
   * Remove npc Entities if they move outside of the gamefield
   * Update Entities-gameField
   * @param {Entity} entity
   * @param {String} entityType
   * @param {Array} newCoords
   * @param {Array} oldCoords
   * @param {String} entityID
   */
	async executeEntityMovement(
		entity,
		entityType,
		newCoords,
		oldCoords,
		entityID,
		movementDirection,
	) {
		entity.setCoords(newCoords);
		const { size: entitySize } = entity.getCoordsAndSize();
		// decide the type of the entity
		const entityTypeToUpdate = entityType === 'playerCharacter'	? 'playerCharacter'	: `${entityType}_${entity.getID()}`;
		// get the mergedPartialField
		const collisionWithEnvTiles = await this.checkForEnvTileCollision(
			newCoords,
			entitySize,
			movementDirection,
		);
		if (
			entityTypeToUpdate !== 'playerCharacter'
      && (newCoords[0] <= 0 || newCoords[1] <= 0 || collisionWithEnvTiles)
		) {
			// Remove npc Entities if they move outside of the gamefield
			this.activeEntitiesList.removeEntity(entityID);
			this.gameField.removeFromEntitiesField(entityType, entity.getID());
		} else {
			// update the entitiesField gamefield
			this.gameField.updateEntitiesField(
				'entities',
				oldCoords[0],
				oldCoords[1],
				entitySize[0],
				entitySize[1],
				newCoords[0],
				newCoords[1],
				entityTypeToUpdate,
			);
			// update coords of entity
			entity.setCoords(newCoords);
		}
	}

	/**
   * let an entity attack
   * @param {PlayerObject} entity
   */
	async attack(entity) {
		const { size, coords } = entity.getCoordsAndSize();
		const entityState = entity.getState();
		const mergedPartialField = await this.gameField.getMergedPartialField(
			[coords[0] + 1, coords[1]],
			size,
			'right',
		);
		if (entityState === 'attacking') {
			// decide for the used regex (regexBoar or regexDragon)
			let regexOfEntity;
			if (
				this.constructor.checkIfArrayIncludesString(
					this.regexBoar,
					mergedPartialField,
				)
			) {
				regexOfEntity = 'regexBoar';
			}
			if (
				this.constructor.checkIfArrayIncludesString(
					this.regexDragon,
					mergedPartialField,
				)
			) {
				regexOfEntity = 'regexDragon';
			}
			// regexOfEntity is not undefined
			if (regexOfEntity !== undefined) {
				const { type, id } = this.constructor.getTypeOfEntity(
					this[regexOfEntity],
					mergedPartialField,
				);
				if (regexOfEntity === 'regexBoar') {
					this.activeEntitiesList.removeEntity(id);
					this.gameField.removeFromEntitiesField(type, id);
				}
				if (regexOfEntity === 'regexDragon') {
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
		const itemsToCheck = [...item];
		let isIncluded = false;
		for (let i = 0; i < itemsToCheck.length; i += 1) {
			isIncluded = isIncluded || regex.test(item[i]);
		}
		return isIncluded;
	}

	/** <--------------- setter ----------> */

	setGamefield(gamefield) {
		this.gameField = gamefield;
	}

	setActiveEntityList(list) {
		this.activeEntitiesList = list;
	}

	/** <--------------- getter ----------> */

	/**
   * Calculate teh type and id for the first match of an entity in the input array
   * @param {Regex} regex
   * @param {Array} arr
   */
	static getTypeOfEntity(regex, arr) {
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

	getPainter() {
		return this.painter;
	}
}
