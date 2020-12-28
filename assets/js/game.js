import flameEntity from './entities/flame';
import npcDragon from './entities/npcDragon';
import npcBoar from './entities/npcBoar';

export default class Game {
	constructor(activeEntityList, movementAgent, gameField) {
		// object for dynamic npc creation
		this.entityClasses = {
			flame: flameEntity,
			npcDragon,
			npcBoar,
		};
		this.activeEntityList = activeEntityList;
		this.movementAgent = movementAgent;
		this.gameField = gameField;
		this.playerMovement = {
			xAxis: 0,
			yAxis: 0,
			entity: activeEntityList.getPlayerEntity(),
		};
		// keys presed
		this.isPlayerAttacking = false;
		this.isPlayerMoving = false;
		this.gameLoop = undefined;
		// needed for checking if the finish screen will be shown
		this.gameState = 'running';
		this.flameIndexGenerator = this.constructor.generateFlameIndex();
		// max xCoord of the actual gamefield
		this.actualMaxXCoord = 80;
	}


	/** <--------------- general functions ----------> */

	/**
	 * create the game loop
	 * inside the game loop move characters and the field periodic
	 */
	createGameLoop() {
		let loopIndex = 0;
		this.gameLoop = setInterval(async () => {
			// move player
			// move each active npc entity on the field
			// move flames each time loopIndex % 3 === 1
			if (loopIndex % 3 === 1) {
				this.activeEntityList.getFlameEntities().forEach(async (flame) => {
					const flameIsAlive = this.flameHandler(flame);
					if (flameIsAlive === true) {
						await	this.moveEntity(flame);
					}
				});
			}

			// Move the npc and player character on each 5th and 10th loop
			if (loopIndex !== 0 && loopIndex % 5 === 0) {
				// if player is in attacking state execute attack
				if (this.isPlayerAttacking) {
					await this.movementAgent.attack(this.playerMovement.entity);
				}
				// move player
				await this.movementAgent.moveCharacter(this.playerMovement);
				// loop through the activeNPCsList
				await 	this.activeEntityList.getActiveNPCsList().forEach(async (entity) => {
					// move a entity
					await this.moveEntity(entity);
					// if the type of the entity is npcDragon, create flames
					if (entity.getType() === 'npcDragon') {
						this.dragonHandler(entity);
					}
				});
				// increment actualMaxXCoord
			}

			// if loop index is equal to 10 set it to 0 and scroll field
			// else: increment LoopIndex
			if (loopIndex === 25) {
				await this.scrollHandler();
				loopIndex = 0;
			} else {
				loopIndex += 1;
			}
			// check if new entities have to be spawned
			await this.checkForAvailableEntities();
			// calc if game is finished
			const activePlayer = this.activeEntityList.getPlayerEntity();
			const activeDragon = this.activeEntityList.getDragon();
			if (activePlayer.getHP() === 0) this.gameState = 'playerLost';
			if (activeDragon && activeDragon.getHP() === 0) this.gameState = 'playerWon';
			// clear gameLoop if the game is over
			if (this.gameState !== 'running') {
				clearInterval(this.gameLoop);
			}
		}, 10);
	}

	/**
	 * Move the passed Entity
	 * @param {Entity} entity
	 */
	async moveEntity(entity) {
		const { xAxis, yAxis } = entity.getMovementPattern();
		await	this.movementAgent.moveCharacter({
			xAxis,
			yAxis,
			entity,
		});
	}

	/**
	 * handler for flames
	 * check if a flame is alive (ttl > 0)
	 * if that is not the case, remove the flame and return undefined
	 * else return true
	 * @param {Flame} entity
	 */
	flameHandler(entity) {
		// check if the TTL of the flame is equal to 0
		if (entity.getTTL() === 0) {
			// clearInterval(this.gameLoop);
			// remove flame
			this.activeEntityList.removeEntity(entity.getID(), 'flame');
			return undefined;
		}
		return true;
	}

	/**
 * Scroll the gamefield by one tick
 * if the player collides with an envTile in the next tick, move him back one tile
 */
	async scrollHandler() {
	// check if the player will collide with an envTile in the next tick
		const playerEntity = this.activeEntityList.getPlayerEntity();
		const { coords: playerCoords, size } = playerEntity.getCoordsAndSize();
		const hasCollisionWithEnvTile = await this.movementAgent.checkForEnvTileCollision(
			[
				this.movementAgent.constructor.calcNewCoordinate(playerCoords[0], 1),
				playerCoords[1],
			],
			size,
			'right',
		);
		// check if the col left from the player doe not exists => FieldEdge
		const hasCollisionWithLeftEdge = false;
		// if the player collides with an envTile move it back one tile
		if (hasCollisionWithEnvTile) {
			if (hasCollisionWithLeftEdge) {
			// player got stuck (left edge, right non walkable tile)
			// kill player
				playerEntity.decreaseHP(playerEntity.getHP());
			} else {
			// player got only stuck by a non walkable tile right
				await this.movementAgent.moveCharacter(
					{
						xAxis: -1,
						yAxis: 0,
						entity: playerEntity,
					},
				);
			}
		}

		// scroll field by one
		const hasScrolled = 	await	this.gameField.scrollField();
		// increment axtualMaxXCoord if the field got scrolled
		if (hasScrolled)	this.actualMaxXCoord += 1;
	// check if a new entity has to be created
	}

	/**
 * Check if the first inactive Entity can be displayed
 * If that is the case create a new Entity and add it to the activeEntityList
 */
	async checkForAvailableEntities() {
		// try to get the first inactive entity
		const fistActiveEntity = this.gameField.checkForCreationOfNewEntity(
			this.actualMaxXCoord,
		);
		// check if fistActiveEntity is not null => it exists
		if (fistActiveEntity !== null) {
		// create a new entity-object
			const newEntity = this.createNewEntity(
				fistActiveEntity.type,
				fistActiveEntity.coords[0],
				fistActiveEntity.coords[1],
				fistActiveEntity.id,
				fistActiveEntity.movementPattern,
			);
			// add new the new entity to the activeEntityList
			await this.activeEntityList.addEntity(newEntity);
		}
	}

	/**
 * Handler for the dragon. Creates a new flame if the dragon breaths fire
 * @param {npcDragon} entity
 */
	dragonHandler(entity) {
	// check if the dragon breaths fire
		if (entity.getBreathsFire() === true) {
		// get the next index from the flameIndexGenerator
			const index = this.flameIndexGenerator.next().value;
			// get Coords from the passed dragon
			const { coords: [xAxisPos, yAxisPos] } = entity.getCoordsAndSize();
			// create a new flame
			const newFlame = this.createNewEntity(
				'flame',
				xAxisPos - 2,
				yAxisPos + 2,
				index,
			);

			// add the created flame to the flameEntityList
			this.activeEntityList.addEntity(newFlame);
			// add the created Flame to the entity map of the gameField
			this.gameField.addEntityAtCoords(newFlame);
		}
	}

	createNewEntity(entityType, xPos, yPos, id = undefined, movementType = undefined) {
		return new this.entityClasses[entityType](xPos, yPos, id, movementType);
	}

	/**
* Generator for a integer gt 100
*/
	static* generateFlameIndex() {
		let index = 100;
		while (true) {
			index += 1;
			yield index;
		}
	}

	/** <--------------- setter ----------> */

	/**
	 * Calculate the state of the user based on the fact if the player attacks or is moving
	 * @param {Boolean} isMoving
	 * @param {Boolean} isAttacking
	 */
	setPlayerStates({ isMoving = undefined, isAttacking = undefined }) {
		let newState = '';
		const evalIsMoving = isMoving !== undefined ? isMoving : this.isPlayerMoving;
		const evalIsAttacking = isAttacking !== undefined ? isAttacking : this.isPlayerAttacking;
		switch (true) {
		case (!evalIsMoving && !evalIsAttacking):
			newState = 'idle';
			break;
		case (evalIsMoving && !evalIsAttacking):
			newState = 'moving';
			break;
		default:
			// (!isMoving && isAttacking)|| (isMoving && isAttacking)
			newState = 'attacking';
			break;
		}
		this.isPlayerAttacking = evalIsAttacking;
		this.isPlayerMoving = evalIsMoving;
		this.playerMovement.entity.setState(newState);
	}

	setPlayerMovement(xAxis, yAxis) {
		this.playerMovement.xAxis = xAxis;
		this.playerMovement.yAxis = yAxis;
	}

	/** <--------------- getter ----------> */

	getGameState() {
		return this.gameState;
	}

	getGameLoop() {
		return this.gameLoop;
	}
}
