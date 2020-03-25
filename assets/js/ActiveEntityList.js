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
		const tempEntityList = [this.playerEntity, ...this.activeEntitiesList];
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
		if (id === undefined) {
			return this.activeEntitiesList.shift();
		}
		const indexToDelete = this.activeEntitiesList.findIndex(id);
		return this.activeEntitiesList.splice(indexToDelete, 1);
	}

	getActiveEntitiesList() {
		return this.activeEntitiesList;
	}
}
