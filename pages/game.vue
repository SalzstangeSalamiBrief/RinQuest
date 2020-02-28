<template>
  <div @keyup.tab="debuggingBackToIndex" class="flex--row flex-center">
    <canvas id="game-area" width="1600" height="860"></canvas>
  </div>
</template>
<script>
import SpritePainter from '../assets/js/spritePainter';

export default {
	data() {
		return {
		};
	},
	methods: {
		debuggingBackToIndex() {
			this.$router.push({ path: '/' });
		},
	},
	// todo back to mounted and asyncData; remove store
	async mounted() {
		this.painter.setCanvasAndCtx(document.querySelector('#game-area'));
		await this.painter.drawBackground(
			0, 0, 42, 43, 'grassTile',
		);
		await this.painter.drawBackground(
			42, 0, 80, 43, 'waterTile',
		);
		console.log(this.painter.getCanvasSize());
	},
	async asyncData() {
		const painter = new SpritePainter();
		await painter.loadAllImages();
		return { painter };
	},

};
</script>
<style>
canvas{
	height: 100%;
	width: 100%;
}
</style>
