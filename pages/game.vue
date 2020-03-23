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
		<div class="hp-bar">
			<div class="hp-bar__container">
				<div class="hp-bar__text full-container flex--row center-flex">
					<span class="hp-bar__text--current">
						100
					</span>
					/100
				</div>
				<div class="hp-bar__background"></div>
			</div>
		</div>
  </div>
</template>
<script>
import SpritePainter from '../assets/js/spritePainter';
import PlayerCharacter from '../assets/js/entities/playerCharacter';
import MovementAgent from '../assets/js/movementAgent';
import GameField from '../assets/js/gamefield/gamefield';
import ActiveEntityList from '../assets/js/ActiveEntityList';
import NonPlayerCharacter from '../assets/js/entities/nonPlayerCharacter';

export default {
	name: 'game',
	data() {
		return {
			player: undefined,
			canRepeatMovement: true,
			someKeyIsPressed: false,
			gameField: undefined,
			activeEntityList: undefined,
		};
	},
	methods: {
		debuggingBackToIndex() {
			this.$router.push({ path: '/' });
		},
		async keyDownListeners({ keyCode }) {
			// todo: improve movement + attacking
			this.someKeyIsPressed = true;
			// check if the movement can continue
			if (this.canRepeat === false) return;
			switch (keyCode) {
			//  space
			case 32:
				// todo better display => actual to clunky
				await this.displayPlayerAttack();
				this.player.setState('attacking');
				break;
			// w
			case 87:
				await this.movementAgent.moveCharacter(0, -1, this.player);
				this.player.setState('moving');
				break;
				// a
			case 65:
				await this.movementAgent.moveCharacter(-1, 0, this.player);
				this.player.setState('moving');
				break;
				// ss
			case 83:
				await this.movementAgent.moveCharacter(0, 1, this.player);
				this.player.setState('moving');
				break;
				// d
			case 68:
				await this.movementAgent.moveCharacter(1, 0, this.player);
				this.player.setState('moving');
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
			this.player.setState('idle');
			this.painter.clearCanvas('entities');
			// todo redraw whole characterCanvas
			this.activeEntityList.drawActiveEntitiesList();
		},
		async displayPlayerAttack() {
			this.painter.clearCanvas('entities');
			this.activeEntityList.drawActiveEntitiesList();
		},
	},
	// todo back to mounted and asyncData; remove store
	async mounted() {
		this.painter.addCanvasAndCtx(document.querySelector('#background-area'), 'background');
		this.painter.addCanvasAndCtx(document.querySelector('#entities-area'), 'entities');
		window.addEventListener('keydown', this.keyDownListeners);
		window.addEventListener('keyup', this.keyUpListener);

		this.gameField = await new GameField(this.painter);
		this.movementAgent.setGameField(this.gameField);

		this.player = new PlayerCharacter(
			document.querySelector('.hp-bar__text--current'),
			document.querySelector('.hp-bar__background'),
		);
		this.activeEntityList = new ActiveEntityList(this.player, this.painter);
		const dummyNPC = new NonPlayerCharacter(
			25,
			17,
			7,
			5,
			'npcBoar',
			0,
		);

		this.activeEntityList.addEntity(dummyNPC);
		this.movementAgent.setActiveEntityList(this.activeEntityList);
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
	top: 10px;
	left: 10px;
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
</style>
