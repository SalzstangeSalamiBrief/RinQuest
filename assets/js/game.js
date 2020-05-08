import NPCFlame from './entities/flame';

export default class Game {
	constructor(activeEntityList, movementAgent, gameField) {
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
		this.gameIsFinished = false;
		this.flameIndexGenerator = this.constructor.generateFlameIndex();
	}

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

	createGameLoop() {
		// if loop index is equal to 5, move characters;
		// 5 * 20 ms => 100ms for one movement
		let loopIndex = 0;
		this.gameLoop = setInterval(async () => {
			// move player
			// move each active npc entity on the field
			// move flames each time loopIndex % 3 === 1
			if (loopIndex % 3 === 1) {
				this.activeEntityList.getFlameEntities().forEach((flame) => {
					const flameIsAlive = this.flameHandler(flame);
					if (flameIsAlive === true) {
						this.moveEntity(flame);
					}
				});
			}


			// Move the npc and player character
			if (loopIndex === 5) {
				// // if player is in attacking state execute attack
				// if (this.isPlayerAttacking) {
				// 	await this.movementAgent.attack(this.playerMovement.entity);
				// }
				// else: player is not in attacking state
				// move player character
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

				loopIndex = 0;
			} else {
				loopIndex += 1;
			}
			// console.log(this.gameField.getField('entities'));
			// console.log('gameLoop');
			// console.log(loopIndex);
			// clearInterval(this.gameLoop);
			// todo: loop gamefield
			// todo condition for finish
		}, 20);
	}

	/**
	 * Move the passed Entity
	 * @param {Entity} entity
	 */
	moveEntity(entity) {
		const { xAxis, yAxis } = entity.getMovementPattern();
		// console.log({
		// 	xAxis,
		// 	yAxis,
		// 	entity,
		// });
		this.movementAgent.moveCharacter({
			xAxis,
			yAxis,
			entity,
		});
	}

	// todo bug: flames invisible, not moving
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
			const newFlame = new NPCFlame(
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
}
