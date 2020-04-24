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
		this.gameLoop = setInterval(async () => {
			if (this.isPlayerAttacking) {
				await this.movementAgent.attack(this.playerMovement.entity);
			}
			// move player
			this.movementAgent.moveCharacter(this.playerMovement);
			// move each active npc entity on the field


			this.activeEntityList.getActiveNPCsList().forEach((entity) => {
				const entityType = entity.getType();
				// check if the entity is of type flame

				// move entity
				this.moveEntity(entity);
				switch (entityType) {
				case 'flame':
					this.constructor.flameHandler(entity);
					break;
				case 'npcDragon':
					this.dragonHandler(entity);
					break;
				default:
					break;
				}
				// const { xAxis: xAxisMovement, yAxis: yAxisMovement } = entity.getMovementPattern();
				// this.movementAgent.moveCharacter({
				// 	xAxisMovement,
				// 	yAxisMovement,
				// 	entity,
				// });

				// if entityType === dragon, spit fire
				// if (entityType === 'npcDragon') {
				// const activeDragon = this.activeEntityList.getDragon();
				// if (activeDragon !== undefined) {
				// if (entity.getBreathsFire() === true) {
				// 	const index = this.flameIndexGenerator.next().value;
				// 	const { coords: [xAxisPos, yAxisPos] } = entity.getCoordsAndSize();
				// 	// todo remove try catchj
				// 	try {
				// 		this.activeEntityList.addEntity(new NPCFlame(
				// 			xAxisPos - 2,
				// 			yAxisPos + 2,
				// 			index,
				// 		));

				// 		clearInterval(this.gameLoop);
				// 	} catch (err) {
				// 		console.error(err);
				// 		clearInterval(this.gameLoop);
				// 	}
				// 	for (let i = 0; i < 10; i += 1) {
				// 		setTimeout(() => { console.log(i); }, 50);
				// 	}

				// console.log(this.activeEntityList.getActiveNPCsList());
				// todo bug: flames get not drawn
				// todo add movementPattern for flames and remove them

				// for (let i = 100; i < 109; i += 1) {
				// console.log('BREATHHHHH');
				// }
				// todo spawn one flame each
				// }
				// }
				// }
			});
			console.log('gameLoop');
			// todo !important: attacking while standing still
			// todo: loop gamefield
			// todo activeNpcs movement/logic
			// todo condition for finish
		}, 100);
	}

	moveEntity(entity) {
		const { xAxis: xAxisMovement, yAxis: yAxisMovement } = entity.getMovementPattern();
		this.movementAgent.moveCharacter({
			xAxisMovement,
			yAxisMovement,
			entity,
		});
	}

	static flameHandler(entity) {
		// check if the TTL of the flame is equal to 0
		if (entity.getTTL() === 0) {
			// remove flame
			this.activeEntityList.removeNPC(entity.getID());
		}
	}

	dragonHandler(entity) {
		if (entity.getBreathsFire() === true) {
			const index = this.flameIndexGenerator.next().value;
			const { coords: [xAxisPos, yAxisPos] } = entity.getCoordsAndSize();
			// add a new flame
			this.activeEntityList.addEntity(new NPCFlame(
				xAxisPos - 2,
				yAxisPos + 2,
				index,
			));
			// todo move flames , for 20 movements, async??
			for (let i = 0; i < 20; i += 1) {
				this.activeEntityList.getFlameEntities().forEach((flame) => {
					this.moveEntity(flame);
				});
			}
			// for (let i = 0; i < 10; i += 1) {

			// 	setTimeout(() => { console.log(i); }, 50);
			// }
			clearInterval(this.gameLoop);
		}
	}


	static* generateFlameIndex() {
		let index = 100;
		while (true) {
			index += 1;
			yield index;
		}
	}
}
