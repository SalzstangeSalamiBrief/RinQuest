export default class ActiveEntitiesList {
	constructor(initPlayer, painter) {
		this.playerEntity = initPlayer;
		this.activeEntitiesList = [];
		this.painter = painter;
		this.gamefield = undefined;
	}

	addEntity(entity) {
		this.activeEntitiesList.push(entity);
	}

	drawActiveEntitiesList() {
		// clear canvas
		this.painter.clearCanvas('entities');
		const tempEntityList = [...this.activeEntitiesList, this.playerEntity];
		// draw each entity of the activeEntitiesList on the canvas
		tempEntityList.forEach((activeEntity) => {
			const { size, coords } = activeEntity.getCoordsAndSize();
			let type = activeEntity.getType();
			// change type if the actual entity is the playercharacter
			if (type === 'playerCharacter') type = activeEntity.getPlayerTypeToDraw();
			this.painter.drawCharacter(type, coords, size);
		});
	}

	/**
	 * Remove a NPC by its id from the activeEntitiesList and the entities-gamefield
	 * @param {String} id
	 */
	removeNPC(id = undefined) {
		// no id passed,  dont execute remove f urther
		if (id === undefined) return;
		// an id is given: search for the index and delete the entry
		const indexToDelete = this.activeEntitiesList.findIndex(
			(item) => item.getID() === parseInt(id, 10),
		);
		const entityToRemove = this.activeEntitiesList[indexToDelete];
		if (entityToRemove) {
			this.gamefield.removeFromEntitiesField(
				entityToRemove.getType(),
				entityToRemove.getID(),
			);
			// eslint-disable-next-line consistent-return
			return this.activeEntitiesList.splice(indexToDelete, 1);
		}
	}

	setGamefield(gamefield) {
		this.gamefield = gamefield;
	}

	getActiveEntitiesList() {
		return this.activeEntitiesList;
	}

	getPlayerEntity() {
		return this.playerEntity;
	}

	getAllEntities() {
		return [this.playerEntity, ...this.activeEntitiesList];
	}

	getNPCEntityByID(id) {
		const index = this.activeEntitiesList.findIndex(
			(item) => item.getID() === parseInt(id, 10),
		);
		return this.activeEntitiesList[index];
	}
}
