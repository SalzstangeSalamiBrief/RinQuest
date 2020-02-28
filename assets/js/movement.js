
class MovementAgent {
	constructor(painter) {
		this.fieldCoords = painter.calcCanvasSize();
	}

	moveCharacter(character) {
		const {
			collisionWithX,
			collisionWithY,
			typeOfCollision,
		} = this.checkForCollision(character.getX(), character.getY());
		// TODO: Dry
		if (!collisionWithX) {
			switch (typeOfCollision) {
			case 'orange':
				// todo
				break;
			default:
				// todo;
				break;
			}
		}
		if (!collisionWithY) {
			switch (typeOfCollision) {
			case 'orange':
				// todo
				break;
			default:
				// todo;
				break;
			}
		}
	}

	checkForCollision(x, y) {
		// check for x outOfField
		const collisionObject = {
			collisionWithX: false,
			collisionWithY: false,
			typeOfCollision: [],
		};
		if (x <= 0 || x >= this.fieldCoords.xMax) {
			collisionObject.collisionWithX = true;
			collisionObject.typeOfCollision.push('outOfField');
		}
		if (y <= 0 || y >= this.fieldCoords.yMax) {
			collisionObject.collisionWithY = true;
			collisionObject.typeOfCollision.push('outOfField');
		}
		// todo: other checks
		// check for y outOfField
		// calc collisionX
		// calc collisionY
		// calc Type of Collision
		// todo move
		return collisionObject;
	}
}

export default new MovementAgent();
