<template>
  <div @keyup.tab="debuggingBackToIndex">
    <canvas id="game-area" width="1600" height="900"></canvas>
  </div>
</template>
<script>
import SpritePainter from '../assets/js/spritePainter';

export default {
	data() {
		return {
			// painter: undefined,
		};
	},
	methods: {
		debuggingBackToIndex() {
			this.$router.push({ path: '/' });
		},
	},
	// todo back to mounted and asyncData; remove store
	async mounted() {
		// const filepathGrassTile = './background/grassTile.png';
		// grassTile, waterTile
		// this.painter = new SpritePainter(document.querySelector('#game-area'));
		// await this.painter.loadAllImages();
		// max: (51,42)

		// await this.painter.setCanvasAndCtx(document.querySelector('#game-area'));
		// console.log(this.painter);
		// console.log(this.painter.getCtx());
		// await	this.painter.drawBackground(0, 0, 42, 45, 'grassTile');
		// await	this.painter.drawBackground(42, 0, 80, 45, 'waterTile');
		console.log('mounted');
		// this.painter.setCanvasAndCtx(document.querySelector('#game-area')).then(() => {
		// 	console.log(this.painter);
		// 	console.log(this.painter.getCtx());
		// }).then(async () => {
		// 	await	this.painter.drawBackground(0, 0, 42, 45, 'grassTile');
		// 	await	this.painter.drawBackground(42, 0, 80, 45, 'waterTile');
		// });
		this.$store.commit('painter/callPainterMethod', {
			method: 'setCanvasAndCtx',
			payload: document.querySelector('#game-area'),
		});
		this.$store.dispatch('painter/callPainterMethod', {
			method: 'drawBackground',
			payload: {
				xStart: 0, yStart: 0, xEnd: 42, yEnd: 45, imageName: 'grassTile',
			},
		});
		this.$store.dispatch('painter/callPainterMethod', {
			method: 'drawBackground',
			payload: {
				xStart: 42, yStart: 0, xEnd: 80, yEnd: 45, imageName: 'waterTile',
			},
		});
		// await	this.painter.drawBackground(0, 0, 42, 45, 'grassTile');
		// await	this.painter.drawBackground(42, 0, 80, 45, 'waterTile');
	},
	async asyncData() {
		console.log('asyncData');
	// 	console.log(document.querySelector('#game-area'));
	// 	const painter = new SpritePainter();
	// 	await painter.loadAllImages();
	// 	return { painter };
	// 	// const test = document.querySelector('#game-area');
	// 	// console.log(test);
	// 	// return { test };
	},
	async fetch({ store }) {
		console.log('fetchHook');
		const painter = new SpritePainter();
		await painter.loadAllImages();
		store.commit('painter/setPainter', painter);

		// return { painter };
		// const test = document.querySelector('#game-area');
		// console.log(test);
		// return { test };
	},
	computed: {
		painter() {
			return this.$store.state.painter.painter;
		},
	},
};
</script>
<style></style>
