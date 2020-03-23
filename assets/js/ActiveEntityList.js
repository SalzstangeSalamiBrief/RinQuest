export default class ActiveEntitiesList {
	constructor(initPlayer, painter) {
		this.activeEntitiesList = [initPlayer];
		this.painter = painter;
	}

	addEntity(entity) {
		this.activeEntitiesList.push(entity);
	}

	drawActiveEntitiesList() {
		// clear canvas
		this.painter.clearCanvas('entities');
		// draw each entity of the activeEntitiesList on the canvas
		this.activeEntitiesList.forEach((activeEntity) => {
			const { size, coords } = activeEntity.getCoordsAndSize();
			let type = activeEntity.getType();
			// change type if the actual entity is the playercharacter
			if (type === 'playerCharacter') type = activeEntity.getState();
			this.painter.drawCharacter(type, coords, size);
		});
	}

	getActiveEntitiesList() {
		return this.activeEntitiesList;
	}
}
