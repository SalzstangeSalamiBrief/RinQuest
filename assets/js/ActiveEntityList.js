export default class activeNPCsList {
	constructor(initPlayer, painter) {
		this.playerEntity = initPlayer;
		this.activeNPCsList = [];
		this.painter = painter;
		this.gamefield = undefined;
		this.dragon = undefined;
		this.activeFlamesList = [];
	}

	addEntity(entity) {
		const type = entity.getType();
		if (type === 'flame') {
			this.activeFlamesList.push(entity);
		} else {
			this.activeNPCsList.push(entity);
		}
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
	 */
	removeNPC(id = undefined) {
		// no id passed,  dont execute remove f urther
		if (id === undefined) return;
		// an id is given: search for the index and delete the entry
		const indexToDelete = this.activeNPCsList.findIndex(
			(item) => item.getID() === parseInt(id, 10),
		);
		const entityToRemove = this.activeNPCsList[indexToDelete];
		if (entityToRemove) {
			this.gamefield.removeFromEntitiesField(
				entityToRemove.getType(),
				entityToRemove.getID(),
			);
			// eslint-disable-next-line consistent-return
			return this.activeNPCsList.splice(indexToDelete, 1);
		}
	}

	setGamefield(gamefield) {
		this.gamefield = gamefield;
	}

	getActiveNPCsList() {
		return this.activeNPCsList;
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

	getNPCEntityByID(id) {
		const index = this.activeNPCsList.findIndex(
			(item) => item.getID() === parseInt(id, 10),
		);
		return this.activeNPCsList[index];
	}

	getDragon() {
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
