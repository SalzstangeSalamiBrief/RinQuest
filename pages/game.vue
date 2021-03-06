<template>
  <div class="flex--row center-flex canvas-container">
    <canvas
			id="background-area"
			width="1600"
			height="860"
			class="full-container"
		>
		</canvas>
		<canvas
			id="entities-area"
			width="1600"
			height="860"
			class="full-container"
		></canvas>
		<div class="hp-bar player">
			<p class="hp-bar__label">Player</p>
			<div class="hp-bar__container">
				<div class="hp-bar__text full-container flex--row center-flex">
					<span class="hp-bar__text--current player">
						100
					</span>
					/100
				</div>
				<div class="hp-bar__background player"></div>
			</div>
		</div>
		<!-- create HP-bar for dragon -->
		<div class="hp-bar dragon">
			<p class="hp-bar__label">Dragon</p>
			<div class="hp-bar__container">
				<div class="hp-bar__text full-container flex--row center-flex">
					<span class="hp-bar__text--current dragon">
						100
					</span>
					/100
				</div>
				<div class="hp-bar__background dragon"></div>
			</div>
		</div>
  </div>
</template>
<script>
import SpritePainter from '../assets/js/spritePainter';
import PlayerCharacter from '../assets/js/entities/playerCharacter';
import MovementAgent from '../assets/js/movementAgent';
import Gamefield from '../assets/js/gamefield/gamefield';
import ActiveEntityList from '../assets/js/ActiveEntityList';
import GameLoop from '../assets/js/game';
import KeyHandler from '../assets/js/keyHandler';

export default {
	name: 'game',
	data() {
		return {
			player: undefined,
			gamefield: undefined,
			activeEntityList: undefined,
			gameLoop: false,
			keyHandler: null,
		};
	},
	methods: {},
	async mounted() {
		// reset store
		this.$store.commit('gameState/setActualState');
		// add canvas to Painter
		this.painter.addCanvasAndCtx(document.querySelector('#background-area'), 'background');
		this.painter.addCanvasAndCtx(document.querySelector('#entities-area'), 'entities');
		this.player = new PlayerCharacter();
		this.activeEntityList = new ActiveEntityList(this.player, this.painter);
		this.gamefield = await new Gamefield(this.painter, this.activeEntityList);
		this.activeEntityList.setGamefield(this.gamefield);
		this.movementAgent.setGamefield(this.gamefield);
		this.movementAgent.setActiveEntityList(this.activeEntityList);
		this.gameLoop = new GameLoop(
			this.activeEntityList, this.movementAgent, this.gamefield, this.$store,
		);
		this.gameLoop.createGameLoop();
		this.keyHandler = new KeyHandler(this.gameLoop);
	},
	beforeDestroy() {
		this.keyHandler.removeKeyListeners();
	},
	async asyncData() {
		const painter = new SpritePainter();
		const movementAgent = new MovementAgent(painter);
		await painter.loadAllImages();
		return { painter, movementAgent };
	},
	computed: {
		gameState() {
			return this.gameLoop.gameState;
		},
	},
	watch: {
		gameState(newState) {
			// console.log(`watched GameState: ${newState}`);
			if (newState !== 'running') {
				this.$store.commit('gameState/setActualState', newState);
				this.$router.push('/finish');
			}
		},
	},
};
</script>
<style>

#entities-area{
	position: absolute;
	left: 0;
	top: 0;
	z-index: 1;
}

.canvas-container{
	position: relative
}
.hp-bar{
	position: absolute;
	z-index: 2;
}

.hp-bar.player{
	top: 10px;
	left: 10px;
}

.hp-bar.dragon{
	bottom: 10px;
	left: calc(50% - 12.5rem);
	visibility: hidden;
}

.hp-bar__container{
	position: relative;
	border: 2px solid black;
	width: 25rem;
	height: 2.5rem;
	background: white;
}

.hp-bar__text{
	text-align: center;
	vertical-align: middle;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1;
}

.hp-bar__background{
	background: green;
	width: 100%;
	height: 100%;
}
/* TODO: Better contrast colors */
.hp-bar.dragon div{
	color: white;
}

.hp-bar__background.dragon{
	background: red;
}

/* TODO: better contrast colors */
.hp-bar__label{
	font-weight: 600;
	display: inline-block;
	padding: 2px;
}
</style>
