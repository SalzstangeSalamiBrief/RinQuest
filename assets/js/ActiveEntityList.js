export default class ActiveEntitiesList {
	constructor(initPlayer, painter) {
		this.activeEntitiesList = [initPlayer];
		this.painter = painter;
	}

	addEntity(entity) {
		this.activeEntitiesList.push(entity);
	}

	drawActiveEntitiesList() {
		this.activeEntitiesList.forEach((activeEntity) => {
			const { size, coords } = activeEntity.getCoordsAndSize();
			const type = activeEntity.getType();
			// promiseArrayEntitiesToDraw.push(
			this.painter.drawCharacter(type, coords, size);
			// );
		});
	}

	getActiveEntitiesList() {
		return this.activeEntitiesList;
	}
}
