<template>
  <div @keyup.tab="debuggingBackToIndex">
    <canvas id="game-area" width="1028" height="840"></canvas>
  </div>
</template>
<script>
import SpritePainter from '../assets/js/spritePainter';

export default {
	data() {
		return {
			painter: undefined,
		};
	},
	methods: {
		debuggingBackToIndex() {
			this.$router.push({ path: '/' });
		},
	},
	mounted() {
		const filepathGrassTile = './background/grassTile.png';
		this.painter = new SpritePainter(document.querySelector('#game-area'));
		this.painter.drawBackground(0, 0, 51, 42, filepathGrassTile);
	},
};
</script>
<style></style>
