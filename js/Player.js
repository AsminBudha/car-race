class Player extends Car {
	constructor() {
		super(0, -1, -0.5, 5);

		this.worldCoordinates = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
		this.lastPosition = 0;

		this.nitro = [];
	}

	drawPlayer(sprites, steer, updown, destX, destY) {

		let sprite;


		if (!KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.V]) {
			if (steer < 0) {
				sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_LEFT] : sprites[IMAGES.PLAYER_LEFT];
			}
			else if (steer > 0) {
				sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_RIGHT] : sprites[IMAGES.PLAYER_RIGHT];
			}
			else {
				sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_STRAIGHT] : sprites[IMAGES.ENEMY_1_STRAIGHT];
			}

			renderSprite(sprite, GAME_VARIABLES.cameraDepth / this.z, destX, destY, this.playerOffset, this.playerY, 0, this.worldCoordinates);
		}
		else {
			if (steer < 0) {
				sprite = sprites[IMAGES.PLAYER_STEER_LEFT];
			}
			else if (steer > 0) {
				sprite = sprites[IMAGES.PLAYER_STEER_RIGHT];
			}
			else {
				sprite = sprites[IMAGES.PLAYER_STEER_STILL];
			}

			destY = GAME_VARIABLES.CANVAS_HEIGHT;
			GAME_VARIABLES.ctx.drawImage(
				sprite
				, 0
				, GAME_VARIABLES.CANVAS_HEIGHT - 200
				, GAME_VARIABLES.CANVAS_WIDTH
				, 200
			);
		}
	}

	drawSpeed() {

		let speedMeter = 5 * Math.round(this.speed / 500);
		GAME_VARIABLES.ctx.save();
		GAME_VARIABLES.ctx.fillStyle = '#363636';
		GAME_VARIABLES.ctx.fillRect(0, 0, 300, 100);


		GAME_VARIABLES.ctx.fillStyle = '#000';
		GAME_VARIABLES.ctx.fillRect(10, 20, 280, 20);

		let maxSpeedMeter = 5 * Math.round((GAME_VARIABLES.maxSpeed * 1.5) / 500);
		let speedPercent = speedMeter / maxSpeedMeter * 100;

		if (this.speed > 0) {

			if (speedMeter < 100) {
				// console.log(maxSpeedMeter);
				let speedMeterWidth = 280 * speedPercent / 100;
				GAME_VARIABLES.ctx.fillStyle = '#32324e';
				GAME_VARIABLES.ctx.fillRect(10, 20, speedMeterWidth, 20);
			}
			else {
				let upto80Width = (280 * 55.555555556) / 100;
				GAME_VARIABLES.ctx.fillStyle = '#32324e';
				GAME_VARIABLES.ctx.fillRect(10, 20, upto80Width, 20);

				let speedMeterWidth = (280 * (speedPercent - 55.555555556)) / 100;
				GAME_VARIABLES.ctx.fillStyle = '#f40000';
				GAME_VARIABLES.ctx.fillRect(10 + upto80Width, 20, speedMeterWidth, 20);

			}

		}



		GAME_VARIABLES.ctx.fillStyle = '#FFF';
		GAME_VARIABLES.ctx.font = '36px serif';
		GAME_VARIABLES.ctx.fillText('MPH   ' + speedMeter, 20, 80);

		GAME_VARIABLES.ctx.restore();
	}

	drawPosition(position, total) {
		GAME_VARIABLES.ctx.save();
		GAME_VARIABLES.ctx.fillStyle = '#535353';
		GAME_VARIABLES.ctx.fillRect(GAME_VARIABLES.CANVAS_WIDTH - 200, 0, 200, 50);

		GAME_VARIABLES.ctx.fillStyle = '#C2810B';
		GAME_VARIABLES.ctx.font = '30px serif';
		GAME_VARIABLES.ctx.fillText('POS', GAME_VARIABLES.CANVAS_WIDTH - 180, 35);

		GAME_VARIABLES.ctx.fillStyle = '#FFFF';
		GAME_VARIABLES.ctx.font = '36px serif';
		GAME_VARIABLES.ctx.fillText(position + '/' + total, GAME_VARIABLES.CANVAS_WIDTH - 100, 35);

		GAME_VARIABLES.ctx.restore();
	}

	update(dt, playerSegment, totalTrackLength) {

		this.updatePosition(dt, totalTrackLength);

		//Update X according to key presse index 0: left index 2: right
		if (KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.LEFT] && !this.crossFinish && this.speed != 0) {
			this.updateX(-dt);
		}
		else if (KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.RIGHT] && !this.crossFinish && this.speed != 0) {
			this.updateX(dt);
		}

		if (playerSegment.curve != 0 && this.speed != 0) {
			this.updateXInCurve(dt, playerSegment.curve);
		}

		if (KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.UP] && !this.crossFinish) {
			let accel = GAME_VARIABLES.accel;
			let maxSpeed = GAME_VARIABLES.maxSpeed;
			if (KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.N]) {
				accel += accel;
				maxSpeed += 0.5 * maxSpeed;
				// console.log('nitro');
				// this.drawNitro(this.worldCoordinates.x,this.worldCoordinates.y+this.worldCoordinates.height);
			}
			this.updateSpeed(this.ACCEL, dt, accel, maxSpeed);
		}
		else if (KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.DOWN] && !this.crossFinish) {
			this.updateSpeed(this.DECCEL, dt, GAME_VARIABLES.breaking, -GAME_VARIABLES.maxSpeed / 4);
		}
		else if (this.speed > 0 || this.crossFinish) {
			this.updateSpeed(this.NO_ACCEL, dt, GAME_VARIABLES.decel, GAME_VARIABLES.maxSpeed);
		}
		else if (this.speed < 0 && !this.crossFinish) {
			this.updateSpeed(this.NO_ACCEL, dt, -GAME_VARIABLES.decel, -GAME_VARIABLES.maxSpeed / 4);
		}
	}

	drawNitro() {
		// console.log(KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.N]);
		if (!KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.N]) {
			return;
		}
		// console.log(KEY_PRESSED_FLAGS);
		// console.log('Nitro');
		let COLOR_SAND_LIGHT = new Color(7, 121, 223);
		let COLOR_SAND_DARK = new Color(10, 37, 160);
		let px = this.worldCoordinates.x + this.worldCoordinates.width / 2;
		let py = this.worldCoordinates.y + this.worldCoordinates.height;
		for (let i = 0; i < 100; i++) {
			let x = Math.floor(Math.random() * 20);
			let y = Math.floor(Math.random() * 50);
			let particles;
			if (i % 5 == 0) {
				particles = new Particles(px + x, py + y, 1, COLOR_SAND_DARK.getRGBString(), 0, -1);
				particles.draw();
			}
			else {
				particles = new Particles(px + x, py + y, 10, COLOR_SAND_LIGHT.getRGBString(), 0, 1);
				particles.draw();
			}
			this.nitro.push(particles);
		}

		let interval = setInterval(() => {
			for (let i = 0; i < this.nitro.length; i++) {
				this.nitro[i].updatePosition();
				// particles.draw();
				this.nitro[i].draw();
				if (this.nitro[i].a < 0) {
					this.nitro.splice(i, 1);
				}
			}
			if (this.nitro.length <= 0) {
				clearInterval(interval);
			}

		}, 100);
	}
}