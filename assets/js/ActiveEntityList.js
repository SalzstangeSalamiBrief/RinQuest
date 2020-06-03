export default class activeNPCsList {
	constructor(initPlayer, painter) {
		this.playerEntity = initPlayer;
		this.activeNPCsList = [];
		this.painter = painter;
		this.gamefield = undefined;
		this.dragon = undefined;
		this.activeFlamesList = [];
		this.inactiveEntities = undefined;
	}


	/** <--------------- general functions ----------> */

	async addEntity(entity) {
		const type = entity.getType();
		if (type === 'flame') {
			this.activeFlamesList.push(entity);
		} else {
			this.activeNPCsList.push(entity);
		}
		// add to gamefield[entities]
		const { coords, size } = entity.getCoordsAndSize();
		this.painter.drawCharacter(type, coords, size);
	}

	drawActiveEntitiesList() {
		// clear canvas
		this.painter.clearCanvas('entities');
		const tempEntityList = [
			...this.activeNPCsList,
			...this.activeFlamesList,
			this.playerEntity];
		// draw each entity of the activeNPCsList on the canvas
		tempEntityList.forEach((activeEntity) => {
			const { size, coords } = activeEntity.getCoordsAndSize();
			let type = activeEntity.getType();
			// change type if the actual entity is the playercharacter
			if (type === 'playerCharacter') type = activeEntity.getPlayerTypeToDraw();
			this.painter.drawCharacter(type, coords, size);
		});
	}

	/**
	 * Remove a NPC by its id from the activeNPCsList and the entities-gamefield
	 * @param {String} id
	 * @param {String} entityType
	 */
	removeEntity(id = undefined, entityType = 'npc') {
		// no id passed,  dont execute remove further
		if (id === undefined) return;
		const list = entityType === 'npc' ? this.activeNPCsList : this.activeFlamesList;
		// an id is given: search for the index and delete the entry
		const indexToDelete = list.findIndex(
			(item) => item.getID() === parseInt(id, 10),
		);
		const entityToRemove = list[indexToDelete];
		if (entityToRemove) {
			this.gamefield.removeFromEntitiesField(
				entityToRemove.getType(),
				entityToRemove.getID(),
			);
			// eslint-disable-next-line consistent-return
			return list.splice(indexToDelete, 1);
		}
	}


	/** <--------------- setter ----------> */

	setGamefield(gamefield) {
		this.gamefield = gamefield;
	}

	setInactiveEntities(entities) {
		this.inactiveEntities = [...entities];
	}

	/** <--------------- getter ----------> */

	/**
	 * shift first inactiveEntity out of inactiveEntities
	 */
	getFistInactiveEntity() {
		return this.inactiveEntities.shift();
	}

	getInactiveEntities() {
		return this.inactiveEntities;
	}

	getActiveNPCsList() {
		return this.activeNPCsList;
	}

	getFirstInactiveEntity() {
		const inactiveEntity = this.inactiveEntities[0];
		if (inactiveEntity) return inactiveEntity;
		return null;
	}

	getPlayerEntity() {
		return this.playerEntity;
	}

	getFlameEntities() {
		return this.activeFlamesList;
	}

	getAllEntities() {
		return [this.playerEntity, ...this.activeFlamesList, ...this.activeNPCsList];
	}

	/**
	 * Get a NPC by the passed ID from the activeNPCsList
	 * @param {Number} id
	 */
	getNPCEntityByID(id) {
		const index = this.activeNPCsList.findIndex(
			(item) => item.getID() === parseInt(id, 10),
		);
		return this.activeNPCsList[index];
	}

	/**
	 * get the active dragon of the game
	 */
	getDragon() {
		// if dragon is undefined, search for it in the activeNPCsList and set the dragon variable
		if (this.dragon === undefined) {
			let dragon;
			const list = this.activeNPCsList;
			for (let i = 0; i < list.length; i += 1) {
				if (list[i].getType() === 'npcDragon') {
					dragon = list[i];
					break;
				}
			}
			this.dragon = dragon;
			return dragon;
		}
		return this.dragon;
	}
}
