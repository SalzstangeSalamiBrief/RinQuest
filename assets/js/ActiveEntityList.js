export default class ActiveEntitiesList {
	constructor(initPlayer, painter) {
		this.playerEntity = initPlayer;
		this.activeEntitiesList = [];
		this.painter = painter;
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

	removeNPC(id = undefined) {
		// no id is given => remove first entry in list
		if (id === undefined) {
			return this.activeEntitiesList.shift();
		}
		// an id is given: search for the index and delete the entry
		const indexToDelete = this.activeEntitiesList.findIndex(
			(item) => item.getID() === parseInt(id, 10),
		);
		return this.activeEntitiesList.splice(indexToDelete, 1);
	}

	getActiveEntitiesList() {
		return this.activeEntitiesList;
	}

	getPlayerEntity() {
		return this.playerEntity;
	}

	getNPCEntityByID(id) {
		const index = this.activeEntitiesList.findIndex(
			(item) => item.getID() === parseInt(id, 10),
		);
		return this.activeEntitiesList[index];
	}
}
