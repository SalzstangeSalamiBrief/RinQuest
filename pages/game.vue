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
			canRepeat: true,
			gameField: undefined,
		};
	},
	methods: {
		debuggingBackToIndex() {
			this.$router.push({ path: '/' });
		},
		async addKeyListeners({ keyCode }) {
			// 	// check if the movement can continue
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
				break;
				// d
			case 68:
				await this.movementAgent.moveCharacter(1, 0, this.player);
				// await this.gameField.scrollField();
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
	},
	// todo back to mounted and asyncData; remove store
	async mounted() {
		this.painter.addCanvasAndCtx(document.querySelector('#background-area'), 'background');
		this.painter.addCanvasAndCtx(document.querySelector('#character-area'), 'characters');
		this.gameField = await new GameField(this.painter);
		this.gameField.getField('background');
		// await this.painter.drawBackground(
		// 	0, 0, 42, 43, 'grassTile', 'background',
		// );
		// await this.painter.drawBackground(
		// 	42, 0, 80, 43, 'waterTile', 'background',
		// );

		this.player = new PlayerCharacter();
		// init player
		// this.painter.drawCharacter(this.player.getType(), [0, 0]);
		window.addEventListener('keydown', this.addKeyListeners);
		// console.log(this.gameField.getField('background'));
	},
	beforeDestroy() {
		window.removeEventListener('keydown', this.addKeyListeners);
	},
	async asyncData() {
		const painter = new SpritePainter();
		const movementAgent = new MovementAgent(painter);
		// const gameField = new GameField(painter);
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
