
export default class Entity {
	constructor(xCoord = 0, yCoord = 0, width = 0, height = 0, type) {
		this.xCoord = xCoord;
		this.yCoord = yCoord;
		this.width = width;
		this.height = height;
		this.type = type;
		// check if the type is playerCharacter or npcDragon and asjust the suffix for a queryselector.
		let querySelectorSuffix;
		if (type === 'playerCharacter') querySelectorSuffix = 'player';
		if (type === 'npcDragon') querySelectorSuffix = 'dragon';
		// if the querySelectorSuffix is not undefined (type === npcDragon || playerCharacter)
		if (querySelectorSuffix !== undefined) {
			// init containers for displaying hp and the the progressbar
			this.textContainer = document.querySelector(`.hp-bar__text--current.${querySelectorSuffix}`);
			this.backgroundContainer = document.querySelector(`.hp-bar__background.${querySelectorSuffix}`);
			// init hp and gotDamage
			this.HP = 100;
			this.gotDamage = false;
		}
	}

	/**
	 * Decrease the HP of this object by a passed value (default 20)
	 * return true if the dragon is still alive
	 * return false if the dragon is not alive (hp <= 0)
	 * @param {Number} damage
	 */
	decreaseHP(damageReceived = 20) {
		// check if the entity is from type playerCharacter or npcDragon (only these two got HP)
		if ((new RegExp('playerCharacter|npcDragon')).test(this.type)) {
			// check if the entity got damage in the last 1.5s
			if (this.gotDamage) return true;
			// else calc new HP
			const newHP = this.HP - damageReceived;
			// init entityIsAlive with true
			let entityIsAlive = true;
			if (newHP <= 0) {
				// if newHP is lt 0 => HP = 0 && entityIsAlive = false
				this.HP = 0;
				entityIsAlive = false;
			} else {
				// else set HP = newHP
				this.HP = newHP;
			}
			this.setGotDamage();
			return entityIsAlive;
		}
		return true;
	}

	/**
	 * Set gotDamage to true
	 * Set HPTextContainer with new Hp and adjust width of the background
	 * Set timeout to set gotDamage to false after 1.5sec
	 */
	setGotDamage() {
		this.gotDamage = true;
		this.textContainer.textContent = this.HP;
		this.backgroundContainer.style.width = `${this.HP}%`;
		setTimeout(() => { this.gotDamage = false; }, 1500);
	}

	setX(xCoord) {
		this.xCoord = xCoord;
	}

	setY(yCoord) {
		this.y = yCoord;
	}

	setCoords([xCoord, yCoord]) {
		this.xCoord = xCoord;
		this.yCoord = yCoord;
	}

	getType() {
		return this.type;
	}

	getCoordsAndSize() {
		return {
			coords: [this.xCoord, this.yCoord],
			// [width, height]
			size: [this.width, this.height],
		};
	}
}
