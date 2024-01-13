export default class keyHandler {
	constructor(gameLoop) {
		this.gameLoop = gameLoop;
		// invoke functions for adding keyup and down listeners
		this.addKeyDownListeners();
		this.addKeyUpListeners();
	}

	/**
   * add keydown listeners to the window
   */
	addKeyDownListeners() {
		window.addEventListener('keydown', (e) => {
			this.keyDownListeners.call(this, e);
		});
	}

	/**
   * add keyup listeners to the window
   */
	addKeyUpListeners() {
		window.addEventListener('keyup', (e) => {
			this.keyUpListeners.call(this, e);
		});
	}

	removeKeyListeners() {
		window.removeEventListener('keydown', this.keyDownListeners);
		window.removeEventListener('keyup', this.keyUpListeners);
	}

	/**
   * calculate state and movement based on the pressed key
   * @param {Object} e
   */
	keyDownListeners({ keyCode }) {
		switch (keyCode) {
		//  space
		case 32:
			this.gameLoop.setPlayerStates({ isAttacking: true });
			break;
			// w
		case 87:
			this.gameLoop.setPlayerStates({ isMoving: true });
			this.gameLoop.setPlayerMovement(0, -1);
			break;
			// a
		case 65:
			this.gameLoop.setPlayerStates({ isMoving: true });
			this.gameLoop.setPlayerMovement(-1, 0);
			break;
			// ss
		case 83:
			this.gameLoop.setPlayerStates({ isMoving: true });
			this.gameLoop.setPlayerMovement(0, 1);
			break;
			// d
		case 68:
			this.gameLoop.setPlayerStates({ isMoving: true });
			this.gameLoop.setPlayerMovement(1, 0);
			break;
		default:
			break;
		}
	}

	/**
   * calculate state and movement based on the released key
   * @param {Object} e
   */
	keyUpListeners({ keyCode }) {
		switch (keyCode) {
		//  space
		case 32:
			// todo better display => actual to clunky
			this.gameLoop.setPlayerStates({ isAttacking: false });
			break;
			// w
		case 87:
			this.gameLoop.setPlayerStates({ isMoving: false });
			this.gameLoop.setPlayerMovement(0, 0);
			break;
			// a
		case 65:
			this.gameLoop.setPlayerStates({ isMoving: false });
			this.gameLoop.setPlayerMovement(0, 0);
			break;
			// s
		case 83:
			this.gameLoop.setPlayerStates({ isMoving: false });
			this.gameLoop.setPlayerMovement(0, 0);
			break;
			// d
		case 68:
			this.gameLoop.setPlayerStates({ isMoving: false });
			this.gameLoop.setPlayerMovement(0, 0);
			break;
		default:
			break;
		}
	}
}
