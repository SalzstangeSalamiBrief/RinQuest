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
		// if loop index is equal to 5, move characters;
		// 5 * 30 ms => 150ms for one movement
		let loopIndex = 0;
		this.gameLoop = setInterval(async () => {
			if (this.isPlayerAttacking) {
				await this.movementAgent.attack(this.playerMovement.entity);
			}
			// move player
			this.movementAgent.moveCharacter(this.playerMovement);
			// move each active npc entity on the field

			this.activeEntityList.getFlameEntities().forEach((flame) => {
				const flameIsAlive = this.constructor.flameHandler(flame);
				if (flameIsAlive === true) {
					this.moveEntity(flame);
				}
			});
			// TODO: Bug: flames not moving, dragon not moving
			this.activeEntityList.getActiveNPCsList().forEach((entity) => {
				if (loopIndex === 5) {
					this.moveEntity(entity);
					if (entity.getType() === 'npcDragon') {
						this.dragonHandler(entity);
					}
					loopIndex = 0;
				} else {
					loopIndex += 1;
				}
			});
			console.log('gameLoop');
			console.log(loopIndex);
			// clearInterval(this.gameLoop);
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
			return undefined;
		}
		return true;
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
			// for (let i = 0; i < 20; i += 1) {
			// 	this.activeEntityList.getFlameEntities().forEach((flame) => {
			// 		this.moveEntity(flame);
			// 	});
			// }
			// for (let i = 0; i < 10; i += 1) {

			// 	setTimeout(() => { console.log(i); }, 50);
			// }
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
