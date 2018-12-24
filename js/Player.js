class Player extends Car {
	constructor() {
		//x, y, offset, startZoom initial position later it will be updated automatically
		super(0, -1, -1, 5);

		this.worldCoordinates = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
		this.lastPosition = 0;

		this.nitro = [];
	}

	drawPlayer(sprites, steer, destX, destY) {

		let sprite;

		this.drawSpeed();

		if (!KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.V]) {
			if (steer < 0) {
				sprite = sprites[IMAGES.PLAYER_LEFT];
			}
			else if (steer > 0) {
				sprite = sprites[IMAGES.PLAYER_RIGHT];
			}
			else {
				sprite = sprites[IMAGES.PLAYER_STRAIGHT];
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

		this.drawNitro();
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

				let speedMeterWidth = 280 * speedPercent / 100;
				GAME_VARIABLES.ctx.fillStyle = '#32324e';
				GAME_VARIABLES.ctx.fillRect(10, 20, speedMeterWidth, 20);
			}
			else {
				let speedGradient = GAME_VARIABLES.ctx.createLinearGradient(10, 20, 280, 20)
				speedGradient.addColorStop(1, '#a30403');//'#f40000');
				speedGradient.addColorStop(0.1, '#00006f');//'#32324e');

				GAME_VARIABLES.ctx.fillStyle = speedGradient;
				let speedMeterWidth = 280 * speedPercent / 100;

				GAME_VARIABLES.ctx.fillRect(10, 20, speedMeterWidth, 20);

			}

		}

		GAME_VARIABLES.ctx.fillStyle = '#FFF';
		GAME_VARIABLES.ctx.font = '36px Press Start';
		GAME_VARIABLES.ctx.fillText('MPH ' + speedMeter, 20, 80);

		if (KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.V]) {
			GAME_VARIABLES.ctx.beginPath();
			GAME_VARIABLES.ctx.fillStyle = 'white';
			GAME_VARIABLES.ctx.fillRect(
				GAME_VARIABLES.CANVAS_WIDTH / 2 - 85
				, GAME_VARIABLES.CANVAS_HEIGHT - 180
				, 200, 200);

			let startAngle = 2 * Math.PI / 3;
			let angleInPercent = speedPercent * 360 / 100;
			let endAngle = startAngle;

			endAngle = startAngle;
			if (angleInPercent <= 60 * 360 / 100 && angleInPercent > 0) {
				endAngle = startAngle;
				endAngle += angleInPercent * Math.PI / 180;
				angleInPercent -= 60 * 360 / 100;
			}

			if (angleInPercent > 0) {
				if (angleInPercent <= 180 * 360 / 100) {
					endAngle += Math.PI - angleInPercent * Math.PI / 180;
					endAngle = -endAngle;
					angleInPercent -= 180 * 360 / 100;
				}
				else {
					endAngle = Math.PI - angleInPercent * Math.PI / 180;
				}
			}

			GAME_VARIABLES.ctx.beginPath();
			GAME_VARIABLES.ctx.lineWidth = 60;
			GAME_VARIABLES.ctx.strokeStyle = '#1172a9';
			GAME_VARIABLES.ctx.ellipse(
				GAME_VARIABLES.CANVAS_WIDTH / 2 - 5
				, GAME_VARIABLES.CANVAS_HEIGHT - 125
				, 60
				, 45
				, 0
				, startAngle
				, endAngle);
			GAME_VARIABLES.ctx.stroke();
		}

		GAME_VARIABLES.ctx.restore();
	}

	drawPosition(position, total) {
		GAME_VARIABLES.ctx.save();
		GAME_VARIABLES.ctx.fillStyle = '#535353';
		GAME_VARIABLES.ctx.fillRect(GAME_VARIABLES.CANVAS_WIDTH * 0.75, 0, 400, 50);

		GAME_VARIABLES.ctx.fillStyle = '#C2810B';
		GAME_VARIABLES.ctx.font = '30px Press Start';
		GAME_VARIABLES.ctx.fillText('POS', GAME_VARIABLES.CANVAS_WIDTH * 0.8, 35);

		GAME_VARIABLES.ctx.fillStyle = '#FFFF';
		GAME_VARIABLES.ctx.font = '36px Press Start';
		GAME_VARIABLES.ctx.fillText(position + '/' + total, GAME_VARIABLES.CANVAS_WIDTH * 0.9, 35);

		GAME_VARIABLES.ctx.restore();
	}

	update(dt, playerSegment, totalTrackLength) {

		this.updatePosition(dt, totalTrackLength);

		//Update X according to key presse index 0: left index 2: right
		if (KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.LEFT] && !this.crossFinish) {
			this.updateX(-dt);
		}
		else if (KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.RIGHT] && !this.crossFinish) {
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
		if (!KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.N] || KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.V]) {
			return;
		}

		let colorNitroLight = new Color(7, 121, 223);
		let colorNitroDark = new Color(10, 37, 160);
		let px = this.worldCoordinates.x;
		let width = this.worldCoordinates.width;
		let py = this.worldCoordinates.y + this.worldCoordinates.height;
		for (let i = 0; i < 50; i++) {
			let x = Math.floor(Math.random() * 20);
			let y = Math.floor(Math.random() * 50);
			let particles, nextParticle;
			if (i % 5 == 0) {
				particles = new Particles(px + width * 0.25 + x, py + y, 2, colorNitroLight.getRGBString(), 0, -1);
				particles.draw();

				nextParticle = new Particles(px + width * 0.75 + x, py + y, 2, colorNitroLight.getRGBString(), 0, -1);
				nextParticle.draw();
			}
			else {
				particles = new Particles(px + width * 0.25 + x, py + y, 10, colorNitroDark.getRGBString(), 0, 1);
				particles.draw();

				nextParticle = new Particles(px + width * 0.75 + x, py + y, 10, colorNitroDark.getRGBString(), 0, 1);
				nextParticle.draw();
			}
			this.nitro.push(particles);
			this.nitro.push(nextParticle);
		}

		let interval = setInterval(() => {
			for (let i = 0; i < this.nitro.length; i++) {
				this.nitro[i].updatePosition();

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