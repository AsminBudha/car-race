class Game {

	constructor() {
		GAME_VARIABLES.canvas.height = GAME_VARIABLES.CANVAS_HEIGHT;
		GAME_VARIABLES.canvas.width = GAME_VARIABLES.CANVAS_WIDTH;

		gameThat = this;
	}

	start() {
		this.timer = 0;

		this.road = new Road();
		this.player = new Player();
		this.enemies = [];
		for (let i = 0; i < 4; i++) {

			let z = 5 + 3 * i;
			this.enemies.push(new Enemy(0.5, -1, i & 1 ? -0.2 : 0.2, z));
			let enemySegment = this.road.findSegment(z);
			enemySegment.enemies.push(this.enemies[i]);
		}
		this.sprites = [];

		this.backgroundX = -100;

		this.cursor = 0;

		let totalImg = 0;
		let onLoad = () => {
			totalImg++;
			if (totalImg >= IMAGES_SRC.length) {
				document.addEventListener('keydown', this.keyDownHandler, true);
				document.addEventListener('keyup', this.keyUpHandler, true);

				this.last = new Date().getTime();
				this.gdt = 0;
				this.countdown = -1;

				this.road.initObstacles(this.sprites);

				this.frame();
			}
		};

		for (let i = 0; i < IMAGES_SRC.length; i++) {
			let imgObj = new Image();
			imgObj.src = IMAGES_SRC[i];
			this.sprites.push(imgObj);
			imgObj.onload = onLoad();
		}

	}

	frame() {
		let now = new Date().getTime();

		if (gameThat.countdown > 3) {

			if (gameThat.player.crossFinish) {
				for (let i = 0; i < KEY_PRESSED_FLAGS.length; i++)
					KEY_PRESSED_FLAGS[i] = false;
			}


			gameThat.updateEnemiesPosition();

			gameThat.update(GAME_VARIABLES.step);

			GAME_VARIABLES.ctx.clearRect(0, 0, GAME_VARIABLES.CANVAS_WIDTH, GAME_VARIABLES.CANVAS_HEIGHT);

			gameThat.drawBackground();
			gameThat.road.renderRoad(gameThat.player, gameThat.sprites, gameThat.enemies);

			gameThat.updatePlayerPosition();

			gameThat.last = now;
		}
		else {

			if (gameThat.countdown == -1) {
				gameThat.drawBackground();
				gameThat.road.renderRoad(gameThat.player, gameThat.sprites, gameThat.enemies);

				gameThat.player.drawSpeed();
				gameThat.updatePlayerPosition();
			}
			if (now - gameThat.last >= 1000) {
				gameThat.countdown++;
				if (gameThat.countdown <= 3) {
					gameThat.drawCountDown(gameThat.countdown);

				}
				gameThat.last = now;
			}
		}

		if (gameThat.player.crossFinish && gameThat.player.speed == 0) {
			gameThat.showFinishPosition();
			return;
		}
		requestAnimationFrame(gameThat.frame);

	}

	showFinishPosition() {
		let gameOverText;
		let positionText;
		if (gameThat.player.lastPosition == 1) {
			gameOverText = 'You Won';
			positionText = 'Your Position is 1st';
		}
		else {
			gameOverText = 'You Lose';
			positionText = 'Your Position is ' + gameThat.player.lastPosition;
		}
		GAME_VARIABLES.ctx.font = '48px Press Start';
		GAME_VARIABLES.ctx.shadowBlur = 4;
		GAME_VARIABLES.ctx.shadowColor = 'rgba(0,0,0,0.8)';
		GAME_VARIABLES.ctx.shadowOffsetX = 3;
		GAME_VARIABLES.ctx.shadowOffsetY = 3;
		GAME_VARIABLES.ctx.fillStyle = 'white';
		GAME_VARIABLES.ctx.fillText(gameOverText, GAME_VARIABLES.CANVAS_WIDTH * 0.4, 100);
		GAME_VARIABLES.ctx.font = '40px Press Start';
		GAME_VARIABLES.ctx.fillText(positionText, GAME_VARIABLES.CANVAS_WIDTH * 0.25, 200);
  }

  /**
   * Find the position of player and calls draw function which write position in canvas
   */
	updatePlayerPosition() {
		if (!gameThat.player.crossFinish) {
			let playerPosition = [];
			let alreadyFinished = 0;

			for (let i = 0; i < gameThat.enemies.length; i++) {
				if (gameThat.enemies[i].crossFinish) {
					alreadyFinished++;
				}
				else {
					let key = 'enemy' + i;
					playerPosition.push({
						'name': key,
						'position': gameThat.enemies[i].currentPosition
					});
				}

			}
			playerPosition.push({
				'name': 'player',
				'position': gameThat.player.currentPosition
			});

			playerPosition.sort((a, b) => {
				return b.position - a.position;
			});

			for (let i = 0; i < playerPosition.length; i++) {
				if (playerPosition[i].name == 'player') {
					let position = i + 1 + alreadyFinished;
					gameThat.player.drawPosition(position, this.enemies.length + 1);
					gameThat.player.lastPosition = position;
					break;
				}
			}
		}
		else {
			gameThat.player.drawPosition(gameThat.player.lastPosition, this.enemies.length + 1);
		}

	}

	updateEnemiesPosition() {
		let totalTrackLength = GAME_VARIABLES.segmentLength * gameThat.road.segments.length;

		let playerSegment = this.road.findSegment(gameThat.player.position + gameThat.player.z);

		for (let i = 0; i < gameThat.enemies.length; i++) {
			gameThat.enemies[i].update(GAME_VARIABLES.step, totalTrackLength);

			let enemySegment = gameThat.road.findSegment(gameThat.enemies[i].position + gameThat.enemies[i].z);
			if (enemySegment == playerSegment) {
				if (gameThat.player.checkCollisionWith(gameThat.enemies[i].worldCoordinates)) {
					if (playerSegment.p1.screen.y >= enemySegment.p1.screen.y) {
						gameThat.player.speed = 0;
					}
					else {
						gameThat.enemies[i].speed = 0;
					}

				}
			}
		}
	}

	update(dt) {

		let totalTrackLength = GAME_VARIABLES.segmentLength * gameThat.road.segments.length;

		let playerSegment = gameThat.road.findSegment(gameThat.player.position + gameThat.player.z);

		gameThat.player.update(dt
			, playerSegment
			, totalTrackLength);

		if (playerSegment.curve > 0 && gameThat.player.speed) {
			gameThat.updateBackground(true);
		}
		else if (playerSegment.curve < 0 && gameThat.player.speed) {
			gameThat.updateBackground(false);
		}

  }

	drawCountDown(countdown) {
		GAME_VARIABLES.ctx.drawImage(gameThat.sprites[IMAGES.COUNTDOWN_3 + countdown], GAME_VARIABLES.CANVAS_WIDTH / 2 - 150, 10);
	}

	drawBackground() {
		GAME_VARIABLES.ctx.drawImage(gameThat.sprites[IMAGES.BACKGROUND]
			, gameThat.backgroundX, 0, GAME_VARIABLES.CANVAS_WIDTH * 1.5, gameThat.sprites[IMAGES.BACKGROUND].height);
	}

  /**
   * This function is called when player is in curve
   * @param {*} left = boolean value which tells whether player is moving left or right
   */
	updateBackground(left) {
		if (left) {
			gameThat.backgroundX -= 0.2;
		}
		else {
			gameThat.backgroundX += 0.2;
		}
	}

	keyDownHandler(e) {
		//arrow key ranges from 37-40 with 37=LEFT in clockwise

		if (e.keyCode >= KEY_PRESSED_CODE.LEFT && e.keyCode <= KEY_PRESSED_CODE.DOWN) {
			if (!gameThat.player.crossFinish) {
				KEY_PRESSED_FLAGS[e.keyCode - KEY_PRESSED_CODE.LEFT] = true;
			}
			else {

				KEY_PRESSED_FLAGS[e.keyCode - KEY_PRESSED_CODE.LEFT] = false;
			}

		}
		else {
			switch (e.keyCode) {
				case KEY_PRESSED_CODE.V:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.V] = !KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.V];
					break;
				case KEY_PRESSED_CODE.N:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.N] = true;
					break;
				case KEY_PRESSED_CODE.SPACE:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.SPACE] = true;
					break;
				case KEY_PRESSED_CODE.W:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.W] = true;
					break;
				case KEY_PRESSED_CODE.A:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.A] = true;
					break;
				case KEY_PRESSED_CODE.S:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.S] = true;
					break;
				case KEY_PRESSED_CODE.D:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.D] = true;
					break;
			}
		}

	}

	keyUpHandler(e) {
		//arrow key ranges from 37-40 with 37=LEFT in clockwise
		if (e.keyCode >= KEY_PRESSED_CODE.LEFT && e.keyCode <= KEY_PRESSED_CODE.DOWN) {
			KEY_PRESSED_FLAGS[e.keyCode - KEY_PRESSED_CODE.LEFT] = false;
		}
		else {
			switch (e.keyCode) {
				case KEY_PRESSED_CODE.N:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.N] = false;
					break;
				case KEY_PRESSED_CODE.SPACE:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.SPACE] = false;
					break;
				case KEY_PRESSED_CODE.W:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.W] = false;
					break;
				case KEY_PRESSED_CODE.A:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.A] = false;
					break;
				case KEY_PRESSED_CODE.S:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.S] = false;
					break;
				case KEY_PRESSED_CODE.D:
					KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.D] = false;
					break;
			}
		}
	}

}

let gameThat = null;
let game = new Game();
game.start();
