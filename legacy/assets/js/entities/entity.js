
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


	/** <--------------- general functions ----------> */

	/**
	 * Decrease the HP of this object by a passed value (default 20)
	 * return true if the dragon is still alive
	 * return false if the dragon is not alive (hp <= 0)
	 * @param {Number} damage
	 */
	decreaseHP(damageReceived = 20) {
		const isEntityPlayer = this.type === 'playerCharacter';
		const isEntityDragon = this.type === 'npcDragon';

		if (isEntityPlayer || isEntityDragon) {
			if (this.gotDamage) return true;
			const newHP = this.HP - damageReceived;
			const isEntityAlive = newHP > 0;
			if (isEntityAlive) {
				this.HP = newHP;
			} else {
				this.HP = 0;
				if (isEntityDragon) {
					document.querySelector('.hp-bar.dragon').style.visibility = 'hidden';
				}
			}
			this.setGotDamage();
			return isEntityAlive;
		}
		return true;
	}

	/** <--------------- setter ----------> */

	/**
	 * Set gotDamage to true
	 * Set HPTextContainer with new Hp and adjust width of the background
	 * Set timeout to set gotDamage to false after 1.5sec
	 */
	setGotDamage() {
		this.gotDamage = true;
		this.textContainer.textContent = this.HP;
		this.backgroundContainer.style.width = `${this.HP}%`;
		const timeoutDelay = this.type === 'playerCharacter' ? 500 : 1500;
		setTimeout(() => { this.gotDamage = false; }, timeoutDelay);
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

	/** <--------------- getter ----------> */

	getType() {
		return this.type;
	}

	getCoordsAndSize() {
		return {
			coords: [this.xCoord, this.yCoord],
			size: [this.width, this.height],
		};
	}

	getHP() {
		return this.HP;
	}
}
