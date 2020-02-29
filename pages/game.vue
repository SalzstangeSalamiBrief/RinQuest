<template>
  <div @keydown="addKeyListeners" class="flex--row flex-center" style="position: relative">
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

export default {
	name: 'game',
	data() {
		return {
			player: undefined,
			canRepeat: true,
		};
	},
	methods: {
		debuggingBackToIndex() {
			this.$router.push({ path: '/' });
		},
		addKeyListeners({ keyCode }) {
			// 	// check if the movement can continue
			if (this.canRepeat === false) return;
			switch (keyCode) {
			// w
			case 87:
				this.movementAgent.moveCharacter(0, -1, this.player);
				break;
				// a
			case 65:
				this.movementAgent.moveCharacter(-1, 0, this.player);
				break;
				// ss
			case 83:
				this.movementAgent.moveCharacter(0, 1, this.player);
				break;
				// d
			case 68:
				this.movementAgent.moveCharacter(1, 0, this.player);
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
		await this.painter.drawBackground(
			0, 0, 42, 43, 'grassTile', 'background',
		);
		await this.painter.drawBackground(
			42, 0, 80, 43, 'waterTile', 'background',
		);

		this.player = new PlayerCharacter();
		// init player
		this.painter.drawCharacter(this.player.getType(), [0, 0]);
		window.addEventListener('keydown', this.addKeyListeners);
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
