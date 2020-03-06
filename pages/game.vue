<template>
  <div class="flex--row flex-center" style="position: relative">
    <canvas
			id="background-area"
			width="1600"
			height="860"
		>
		</canvas>
		<canvas
			id="character-area"
			width="1600"
			height="860"
			style="position: absolute; left: 0; top: 0; z-index: 1;"
		></canvas>
  </div>
</template>
<script>
import SpritePainter from '../assets/js/spritePainter';
import PlayerCharacter from '../assets/js/characters/playerCharacter';
import MovementAgent from '../assets/js/movementAgent';
import GameField from '../assets/js/gamefield/gamefield';

export default {
	name: 'game',
	data() {
		return {
			player: undefined,
			canRepeatMovement: true,
			someKeyIsPressed: false,
			gameField: undefined,
		};
	},
	methods: {
		debuggingBackToIndex() {
			this.$router.push({ path: '/' });
		},
		async keyDownListeners({ keyCode }) {
			console.log(keyCode);
			this.someKeyIsPressed = true;
			// check if the movement can continue
			if (this.canRepeat === false) return;
			switch (keyCode) {
			// w
			case 87:
				await this.movementAgent.moveCharacter(0, -1, this.player);
				break;
				// a
			case 65:
				await this.movementAgent.moveCharacter(-1, 0, this.player);
				break;
				// ss
			case 83:
				await this.movementAgent.moveCharacter(0, 1, this.player);
				// await this.gameField.scrollField(
				// 	'background',
				// 	this.movementAgent,
				// 	this.player,
				// );
				break;
				// d
			case 68:
				await this.movementAgent.moveCharacter(1, 0, this.player);
				// await this.gameField.scrollField(
				// 	'background',
				// 	this.movementAgent,
				// 	this.player,
				// );
				break;
				//  space
			case 32:
				// todo better display => actual to clunky
				await this.displayPlayerAttack();
				break;
			default:
				break;
			}
			// set interval for moving a character to 50ms
			this.canRepeat = false;
			setTimeout(() => {
				this.canRepeat = true;
			}, 50);
		},
		async keyUpListener() {
			this.someKeyIsPressed = false;
			const { coords, size } = this.player.getCoordsAndSize();
			/**
		 * TODO Error
		 * game.vue?105c:80 Uncaught (in promise) TypeError: _this2.painter is not a function
		 */
			this.painter.clearCanvas('characters');
			// todo redraw whole characterCanvas
			await this.painter.drawCharacter('playerCharacter', coords, size);
		},
		async displayPlayerAttack() {
			const { coords, size } = this.player.getCoordsAndSize();
			this.painter.clearCanvas('characters');
			// todo redraw whole characterCanvas
			await this.painter.drawCharacter('playerCharacter_attacking', coords, size);
		},
	},
	// todo back to mounted and asyncData; remove store
	async mounted() {
		this.painter.addCanvasAndCtx(document.querySelector('#background-area'), 'background');
		this.painter.addCanvasAndCtx(document.querySelector('#character-area'), 'characters');
		window.addEventListener('keydown', this.keyDownListeners);
		window.addEventListener('keyup', this.keyUpListener);
		this.gameField = await new GameField(this.painter);
		this.gameField.getField('background');
		this.player = new PlayerCharacter();
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.addKeyListeners);
	},
	async asyncData() {
		const painter = new SpritePainter();
		const movementAgent = new MovementAgent(painter);
		await painter.loadAllImages();
		return { painter, movementAgent };
	},

};
</script>
<style>
canvas{
	height: 100%;
	width: 100%;
}
</style>
