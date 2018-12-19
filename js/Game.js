class Game {

	constructor() {
		GAME_VARIABLES.canvas.height = GAME_VARIABLES.CANVAS_HEIGHT;
		GAME_VARIABLES.canvas.width = GAME_VARIABLES.CANVAS_WIDTH;

		this.position = 0;
		this.firstPass = true;
		gameThat = this;

		this.keyPressedFlags = [false, false, false, false];//LEFT , UP , RIGHT , DOWN
	}

	start() {
		this.timer = 0;

		this.road = new Road();
		this.player = new Player();
		this.enemies = [];
		for (let i = 0; i < 4; i++) {

			this.enemies.push(new Enemy(0.5, -1, i & 1 ? -0.2 : 0.2, 5 + 3 * i));
		}
		this.sprites = [];

		this.backgroundX = -100;

		this.cursor = 0;

		let totalImg = 0;
		let onLoad = () => {
			totalImg++;
			if (totalImg == IMAGES_SRC.length) {
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

			if (gameThat.gameFinish) {
				gameThat.keyPressedFlags[1] = false;
			}

			let dt = Math.min(1, (now - gameThat.last) / 1000); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
			gameThat.gdt = gameThat.gdt + dt;
			while (gameThat.gdt > GAME_VARIABLES.step) {

				gameThat.gdt -= GAME_VARIABLES.step;
				gameThat.update(GAME_VARIABLES.step);
			}

			GAME_VARIABLES.ctx.clearRect(0, 0, GAME_VARIABLES.CANVAS_WIDTH, GAME_VARIABLES.CANVAS_HEIGHT);

			gameThat.updateEnemiesPosition();


			gameThat.drawBackground();
			gameThat.road.renderRoad(gameThat.player, gameThat.sprites
				, gameThat.keyPressedFlags[0], gameThat.keyPressedFlags[2], gameThat.enemies);
			// gameThat.road.drawMiniMap();
			gameThat.last = now;
		}
		else {

			if (gameThat.countdown == -1) {
				gameThat.drawBackground();
				gameThat.road.renderRoad(gameThat.player, gameThat.sprites
					, gameThat.keyPressedFlags[0], gameThat.keyPressedFlags[2], gameThat.enemies);

				gameThat.road.drawMiniMap();
			}
			if (now - gameThat.last >= 1000) {
				gameThat.countdown++;
				if (gameThat.countdown <= 3) {
					gameThat.drawCountDown(gameThat.countdown);
				}
				gameThat.last = now;
			}
		}

		if (gameThat.gameFinish && gameThat.player.speed == 0) {
			GAME_VARIABLES.ctx.fillText('Game Finish', 400, 50)
			return;
		}
		requestAnimationFrame(gameThat.frame);

	}

	updateEnemiesPosition() {
		let totalTrackLength = GAME_VARIABLES.segmentLength * gameThat.road.segments.length;

		for (let i = 0; i < gameThat.enemies.length; i++) {

			gameThat.enemies[i].update(GAME_VARIABLES.step, totalTrackLength, this.gameFinish);

		}
	}

	update(dt) {

		let totalTrackLength = GAME_VARIABLES.segmentLength * gameThat.road.segments.length;

		let playerSegment = gameThat.road.findSegment(gameThat.player.position + gameThat.player.z);

		gameThat.player.update(dt
			, playerSegment
			, totalTrackLength
			, gameThat.keyPressedFlags);

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
			, gameThat.backgroundX, 0, GAME_VARIABLES.CANVAS_WIDTH * 1.5, GAME_VARIABLES.CANVAS_HEIGHT * 0.75);
	}

	updateBackground(left) {
		if (left) {
			gameThat.backgroundX += 0.2;
		}
		else {
			gameThat.backgroundX -= 0.2;
		}
	}

	keyDownHandler(e) {
		//arrow key ranges from 37-40 with 37=LEFT in clockwise
		if (!gameThat.gameFinish)
			gameThat.keyPressedFlags[e.keyCode - 37] = true;
		else {
			gameThat.keyPressedFlags[e.keyCode - 37] = false;
		}
	}

	keyUpHandler(e) {
		//arrow key ranges from 37-40 with 37=LEFT in clockwise
		gameThat.keyPressedFlags[e.keyCode - 37] = false;
	}

}
let gameThat = null;
new Game().start();