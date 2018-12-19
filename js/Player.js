class Player extends Car {
	constructor() {
		super(0, -1, -0.5, 3);

		this.worldCoordinates = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
	}

	drawPlayer(sprites, steer, updown, destX, destY) {

		let sprite = sprites[IMAGES.PLAYER_STRAIGHT];

		if (steer < 0) {
			sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_LEFT] : sprites[IMAGES.PLAYER_LEFT];
		}
		else if (steer > 0) {
			sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_RIGHT] : sprites[IMAGES.PLAYER_RIGHT];
		}
		else {
			sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_STRAIGHT] : sprites[IMAGES.PLAYER_STRAIGHT];
		}
		// console.log(destX, destY, GAME_VARIABLES.CANVAS_WIDTH, GAME_VARIABLES.CANVAS_HEIGHT);
		renderSprite(sprite, GAME_VARIABLES.cameraDepth / this.z, destX, destY, this.playerOffset, this.playerY, 0, this.worldCoordinates);
	}

	checkCollisionWith(objCoordinates) {
		// console.log(this.worldCoordinates, objCoordinates);
		if (this.worldCoordinates != null && objCoordinates != null) {
			console.log('inside');
			if ((this.worldCoordinates.x >= objCoordinates.x
				&& this.worldCoordinates.x <= objCoordinates.x + objCoordinates.width)
				|| (this.worldCoordinates.x + this.worldCoordinates.width >= objCoordinates.x
					&& this.worldCoordinates.x + this.worldCoordinates.width <= objCoordinates.x + objCoordinates.width)) {
				return true;
			}
		}
		return false;
	}

	update(dt, playerSegment, totalTrackLength, keyPressedFlags) {

		this.updatePosition(dt, totalTrackLength);

		//Update X according to key presse index 0: left index 2: right
		if (keyPressedFlags[0] && !this.crossFinish) {
			this.updateX(-dt);
		}
		else if (keyPressedFlags[2] && !this.crossFinish) {
			this.updateX(dt);
		}

		if (playerSegment.curve != 0 && this.speed != 0) {
			this.updateXInCurve(dt, playerSegment.curve);
		}

		if (keyPressedFlags[1] && !this.crossFinish) {
			this.updateSpeed(this.ACCEL, dt, GAME_VARIABLES.accel, GAME_VARIABLES.maxSpeed);
		}
		else if (keyPressedFlags[3] && !this.crossFinish) {
			this.updateSpeed(this.DECCEL, dt, GAME_VARIABLES.breaking, GAME_VARIABLES.maxSpeed);
		}
		else if (this.speed > 0 || this.crossFinish) {
			this.updateSpeed(this.NO_ACCEL, dt, GAME_VARIABLES.decel, GAME_VARIABLES.maxSpeed);
		}
	}
}