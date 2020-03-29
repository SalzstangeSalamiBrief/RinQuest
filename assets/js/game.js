export default class Game {
	constructor(activeEntityList, movementAgent, gameField, player) {
		this.activeEntityList = activeEntityList;
		this.movementAgent = movementAgent;
		this.gameField = gameField;
		this.playerMovement = { xAxis: 0, yAxis: 0, entity: player };
		// keys presed
		this.isPlayerAttackPressed = false;
		this.isPlayerMoving = false;
		this.gameLoop = undefined;
	}

	setIsMoving(bool) {
		this.isMoving = bool;
	}

	isAttackPressed(bool) {
		this.isAttackPressed = bool;
	}

	setPlayerMovement(xAxis, yAxis) {
		this.playerMovement.xAxis = xAxis;
		this.playerMovement.yAxis = yAxis;
	}

	createGameLogic() {
		this.gameLoop = setInterval(() => {
			if (this.isPlayerMoving) {
				this.movementAgent.moveCharacter(playerMovement);
				// todo determine player attacking/moving display
			}
			// todo: loop gamefield
			// todo activeNpcs movement/logic
			// todo condition for finish
		}, 50);
	}
}
