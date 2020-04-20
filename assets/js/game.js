import NPCFlame from './entities/npcFlame';

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

			this.activeEntityList.getActiveEntitiesList().forEach((entity) => {
				const { xAxis, yAxis } = entity.getMovementPattern();
				this.movementAgent.moveCharacter({
					xAxis,
					yAxis,
					entity,
				});
			});
			const activeDragon = this.activeEntityList.getDragon();
			if (activeDragon !== undefined) {
				if (activeDragon.getBreathsFire() === true) {
					const index = this.flameIndexGenerator.next().value;
					const { coords: { xAxis, yAxis } } = activeDragon.getCoordsAndSize();
					this.activeEntityList.addEntity(new NPCFlame(
						xAxis - 1,
						yAxis - 1,
						index,
					));
					console.log(this.activeEntityList.getActiveEntitiesList());
					// todo bug: flames get not drawn
					// todo add movementPattern for flames and remove them

					// for (let i = 100; i < 109; i += 1) {
					console.log('BREATHHHHH');
					// }
					// todo spawn one flame each
				}
			}

			// todo !important: attacking while standing still
			// todo: loop gamefield
			// todo activeNpcs movement/logic
			// todo condition for finish
		}, 100);
	}

	static* generateFlameIndex() {
		let index = 100;
		while (true) {
			index += 1;
			yield index;
		}
	}
}
