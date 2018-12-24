class Road {

	constructor() {
		this.totalLenghtOfRoad = 0;
		this.segments = [];

		this.miniMapW = 500;
		this.miniMapH = 300;
		this.miniMapX = 2;
		this.miniMapY = this.miniMapH / 2;
		this.miniMapCanvas = document.createElement('canvas');
		this.miniMapCanvas.width = this.miniMapW;
		this.miniMapCanvas.height = this.miniMapH
		this.miniMapDdx = 0;
		this.miniMapDx = 0;

		this.miniMapCtxt = this.miniMapCanvas.getContext('2d');
		this.miniMapCtxt.fillStyle = 'yellow';
		this.miniMapCtxt.fillRect(0, 0, this.miniMapW, this.miniMapH)
		this.initSegment();

		this.sand = [];
	}

	initSegment() {
		trackMap.forEach((item) => {

			let length = Math.floor(item.length / 3);

			this.addRoad(length, length, length, item.curve, item.height);

			this.totalLenghtOfRoad += item.length;
			this.addSegmentInMiniMap(item.curve, item.length)
		});


	}

	initObstacles(sprites) {
		spritesObstacles.forEach((item) => {
			this.segments[item.position].sprites.push({ sprite: sprites[IMAGES[item.sprite]], offset: item.offset });
		});
	}

	renderRoad(player, sprites, enemies) {

		let keyLeft = KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.LEFT];
		let keyRight = KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.RIGHT];

		let playerX = player.x;
		let playerZ = player.z;
		
		let playerSegment = this.findSegment(player.position + playerZ);

		player.playerX = player.x - (playerSegment.curve * GAME_VARIABLES.centrifugal);

		let baseSegment = this.findSegment(player.position);
		let maxy = GAME_VARIABLES.CANVAS_HEIGHT;
		let n, segment;

		let basePercent = percentRemaining(player.position, GAME_VARIABLES.segmentLength);
		let dx = - (baseSegment.curve * basePercent), x = 0;

		let playerPercent = percentRemaining(player.position, GAME_VARIABLES.segmentLength);
		let playerY = interpolate(baseSegment.p1.world.y, baseSegment.p2.world.y, playerPercent);

		for (n = 0; n < GAME_VARIABLES.drawDistance; n++) {

			segment = this.segments[(baseSegment.index + n) % this.segments.length];

			segment.looped = segment.index < baseSegment.index;

			segment.clip = maxy;

			this.project(segment.p1
				, (playerX * GAME_VARIABLES.roadWidth) - x
				, playerY + GAME_VARIABLES.cameraHeight
				, player.position - ((segment.looped) ? this.segments.length * GAME_VARIABLES.segmentLength : 0)
			);

			this.project(segment.p2
				, (playerX * GAME_VARIABLES.roadWidth) - dx - x
				, playerY + GAME_VARIABLES.cameraHeight
				, player.position - ((segment.looped) ? this.segments.length * GAME_VARIABLES.segmentLength : 0)
			);

			x += dx;
			dx += segment.curve;

			if ((segment.p1.camera.z <= GAME_VARIABLES.cameraDepth) || // behind us
				(segment.p2.screen.y >= segment.p1.screen.y) || // back face cull
				(segment.p2.screen.y >= maxy))                  // clip by (already rendered) segment
				continue;

			this.drawRoadSegment(segment.p1.screen.x,
				segment.p1.screen.y,
				segment.p1.screen.w,
				segment.p2.screen.x,
				segment.p2.screen.y,
				segment.p2.screen.w,
				segment.color, sprites);

			if (segment.index == 8) {
				GAME_VARIABLES.ctx.fillStyle = 'white';
				GAME_VARIABLES.ctx.fillRect(0, segment.p2.screen.y, GAME_VARIABLES.CANVAS_WIDTH, segment.p1.screen.y - segment.p2.screen.y);
			}

			maxy = segment.p2.screen.y;
		}

		for (n = GAME_VARIABLES.drawDistance - 1; n > 0; n--) {
			segment = this.segments[(baseSegment.index + n) % this.segments.length];
			for (let i = 0; i < segment.sprites.length; i++) {
				let sprite = segment.sprites[i];
				let spriteScale = segment.p1.screen.scale;
				let spriteX = segment.p1.screen.x + (spriteScale * sprite.offset * GAME_VARIABLES.roadWidth * GAME_VARIABLES.CANVAS_WIDTH / 2);
				let spriteY = segment.p1.screen.y;

				let objCoordintaes = {
					x: 0,
					y: 0,
					width: 0,
					height: 0
				};

				renderSprite(sprite.sprite, spriteScale
					, spriteX, spriteY, (sprite.offset < 0 ? -1 : 0), -1, segment.clip, objCoordintaes);

				if (segment.index == playerSegment.index + 1) {

					if (player.checkCollisionWith(objCoordintaes)) {
						player.speed = 0;
					}
				}
			}
			// console.log('enemies',segment.enemies.length);
			// for(let i=0;i<segment.enemies.length;i++){
				
			// 	enemies[i].drawEnemy(segment, sprites);
			// }
			for (let i = 0; i < enemies.length; i++) {

				let enemySegment = this.findSegment(enemies[i].position + enemies[i].z);

				if (segment == enemySegment) {
					enemies[i].drawEnemy(enemySegment, sprites);
				}

			}

		}
		// console.log(player.currentPosition, enemies[0].currentPosition);
		player.drawPlayer(sprites
			, (keyLeft ? -1 : keyRight ? 1 : 0)
			, playerSegment.p2.world.y - playerSegment.p1.world.y
			, GAME_VARIABLES.CANVAS_WIDTH / 2
			, (GAME_VARIABLES.CANVAS_HEIGHT / 2)
			- (GAME_VARIABLES.cameraDepth / playerZ
				* interpolate(playerSegment.p1.camera.y, playerSegment.p2.camera.y, playerPercent)
				* GAME_VARIABLES.CANVAS_HEIGHT / 2)
		);
		if (player.x < -1.2 || player.x > 1.2) {
			this.drawSand(player.worldCoordinates.x, player.worldCoordinates.y + player.worldCoordinates.height);
			this.drawSand(player.worldCoordinates.x + player.worldCoordinates.width - 50
				, player.worldCoordinates.y + player.worldCoordinates.height);

		}


	}

	drawSand(px, py) {

		if(KEY_PRESSED_FLAGS[KEY_PRESSED_INDEX.V]){
			return;
		}

		let COLOR_SAND_LIGHT = new Color(240, 191, 136);
		let COLOR_SAND_DARK = new Color(101, 67, 33);
		for (let i = 0; i < 100; i++) {
			let x = Math.floor(Math.random() * 50);
			let y = Math.floor(Math.random() * 50);
			let particles;
			if (i % 5 == 0) {
				particles = new Particles(px + x, py + y, 1, COLOR_SAND_DARK.getRGBString(), 0, 1);
				particles.draw();
			}
			else {
				particles = new Particles(px + x, py + y, 10, COLOR_SAND_LIGHT.getRGBString(), 0, 1);
				particles.draw();
			}
			this.sand.push(particles);
		}

		let interval = setInterval(() => {
			for (let i = 0; i < this.sand.length; i++) {
				this.sand[i].updatePosition();
				// particles.draw();
				this.sand[i].draw();
				if (this.sand[i].a < 0) {
					this.sand.splice(i, 1);
				}
			}
			if (this.sand.length <= 0) {
				clearInterval(interval);
			}

		}, 100);
	}

	drawRoadSegment(x1, y1, w1, x2, y2, w2, color, sprites) {

		let lanes = GAME_VARIABLES.lanes;
		let r1 = this.getRumbleWidth(w1, lanes),
			r2 = this.getRumbleWidth(w2, lanes),
			l1 = this.getLaneMarkerWidth(w1, lanes),
			l2 = this.getLaneMarkerWidth(w2, lanes);
		let lanew1, lanew2, lanex1, lanex2, lane;

		//Grass with full Canvas width
		// GAME_VARIABLES.ctx.fillStyle = color.grass;
		// GAME_VARIABLES.ctx.fillRect(0, y2, GAME_VARIABLES.CANVAS_WIDTH, y1 - y2);
		let ground = sprites[IMAGES.DESERT_GROUND];
		GAME_VARIABLES.ctx.drawImage(ground, 0, y2, GAME_VARIABLES.CANVAS_WIDTH, y1 - y2);

		this.drawPolygon(x1 - w1 - r1, y1, x1 - w1, y1, x2 - w2, y2, x2 - w2 - r2, y2, color.rumble);
		this.drawPolygon(x1 + w1 + r1, y1, x1 + w1, y1, x2 + w2, y2, x2 + w2 + r2, y2, color.rumble);
		this.drawPolygon(x1 - w1, y1, x1 + w1, y1, x2 + w2, y2, x2 - w2, y2, color.road);

		if (color.lane) {
			lanew1 = w1 * 2 / lanes;
			lanew2 = w2 * 2 / lanes;
			lanex1 = x1 - w1 + lanew1;
			lanex2 = x2 - w2 + lanew2;
			for (lane = 1; lane < lanes; lanex1 += lanew1, lanex2 += lanew2, lane++) {
				this.drawPolygon(lanex1 - l1 / 2, y1, lanex1 + l1 / 2, y1, lanex2 + l2 / 2, y2, lanex2 - l2 / 2, y2, color.lane);
			}
		}

	}


	addRoad(enter, hold, leave, curve, y) {
		var startY = this.lastY();
		var endY = startY + (y * GAME_VARIABLES.segmentLength);
		var n, total = enter + hold + leave;
		for (n = 0; n < enter; n++) {
			let tempCurve = this.easeIn(0, curve, n / enter);
			this.addSegment(tempCurve, this.easeInOut(startY, endY, n / total));
			this.addSegmentInMiniMap(tempCurve);
		}
		for (n = 0; n < hold; n++) {
			this.addSegment(curve, this.easeInOut(startY, endY, (enter + n) / total));
			this.addSegmentInMiniMap(curve);
		}
		for (n = 0; n < leave; n++) {
			let tempCurve = this.easeInOut(curve, 0, n / leave);
			this.addSegment(tempCurve, this.easeInOut(startY, endY, (enter + hold + n) / total));
			this.addSegmentInMiniMap(-tempCurve);
		}
	}

	addSegment(curve, y) {
		let index = this.segments.length;
		this.segments.push({
			'index': index,
			'p1': {
				'camera': { x: 0, y: 0, z: 0 },
				'screen': { x: 0, y: 0, z: 0 },
				'world': { x: 0, y: this.lastY(), z: index * GAME_VARIABLES.segmentLength }
			},
			'p2': {
				'camera': { x: 0, y: 0, z: 0 },
				'screen': { x: 0, y: 0, z: 0 },
				'world': { x: 0, y: y, z: (index + 1) * GAME_VARIABLES.segmentLength }
			},
			curve: curve,
			sprites: [],
			enemies:[],
			'color': {
				'road': GAME_VARIABLES.COLOR.ROAD,
				'grass': Math.floor(index / GAME_VARIABLES.rumbleLength) & 1 ? GAME_VARIABLES.COLOR.GRASS_DARK : GAME_VARIABLES.COLOR.GRASS_LIGHT,
				'rumble': Math.floor(index / GAME_VARIABLES.rumbleLength) & 1 ? GAME_VARIABLES.COLOR.RUMBLE_DARK : GAME_VARIABLES.COLOR.RUMBLE_LIGHT,
				'lane': Math.floor(index / GAME_VARIABLES.rumbleLength) & 1 ? GAME_VARIABLES.COLOR.LANE_DARK : GAME_VARIABLES.COLOR.LANE_LIGHT
			}
		});
	}

	addSegmentInMiniMap(curve) {
		this.miniMapCtxt.beginPath();
		this.miniMapCtxt.moveTo(this.miniMapX, this.miniMapY);

		this.miniMapX += 0.1;
		this.miniMapY -= curve;

		this.miniMapCtxt.lineTo(this.miniMapX, this.miniMapY);
		this.miniMapCtxt.stroke();
	}

	// drawMiniMap() {
	// 	// GAME_VARIABLES.ctx.drawImage(IMAGES_SRC[0],0,0);
	// 	// console.log(this.miniMapCanvas);
	// 	// this.miniMapCtxt.beginPath();
	// 	// this.miniMapCtxt.moveTo(0,0);
	// 	// this.miniMapCtxt.lineTo(50,50);
	// 	// this.miniMapCtxt.stroke();
	// 	GAME_VARIABLES.ctx.drawImage(this.miniMapCanvas, 10, 10);

	// 	// console.log('here')
	// }

	getRumbleWidth(projectedRoadWidth, lanes) {
		return projectedRoadWidth / Math.max(6, 2 * lanes);
	}

	getLaneMarkerWidth(projectedRoadWidth, lanes) {
		return projectedRoadWidth / Math.max(32, 8 * lanes);
	}

	drawPolygon(x1, y1, x2, y2, x3, y3, x4, y4, color) {
		GAME_VARIABLES.ctx.fillStyle = color;
		GAME_VARIABLES.ctx.beginPath();
		GAME_VARIABLES.ctx.moveTo(x1, y1);
		GAME_VARIABLES.ctx.lineTo(x2, y2);
		GAME_VARIABLES.ctx.lineTo(x3, y3);
		GAME_VARIABLES.ctx.lineTo(x4, y4);
		GAME_VARIABLES.ctx.closePath();
		GAME_VARIABLES.ctx.fill();
	}

	project(p, cameraX, cameraY, cameraZ) {
		p.camera.x = (p.world.x || 0) - cameraX;
		p.camera.y = (p.world.y || 0) - cameraY;
		p.camera.z = (p.world.z || 0) - cameraZ;

		p.screen.scale = GAME_VARIABLES.cameraDepth / p.camera.z;

		p.screen.x = Math.round((GAME_VARIABLES.CANVAS_WIDTH / 2) + (p.screen.scale * p.camera.x * GAME_VARIABLES.CANVAS_WIDTH / 2));
		p.screen.y = Math.round((GAME_VARIABLES.CANVAS_HEIGHT / 2) - (p.screen.scale * p.camera.y * GAME_VARIABLES.CANVAS_HEIGHT / 2));
		p.screen.w = Math.round((p.screen.scale * GAME_VARIABLES.roadWidth * GAME_VARIABLES.CANVAS_WIDTH / 2));
	}

	calculateDistance(x1, y1, x2, y2) {
		let dx = x2 - x1;
		let dy = y2 - y1;
		return Math.sqrt(dx * dx + dy * dy);
	}

	lastY() {
		return (this.segments.length == 0) ? 0 : this.segments[this.segments.length - 1].p2.world.y;
	}

	findSegment(z) {
		return this.segments[(Math.floor(z / GAME_VARIABLES.segmentLength)) % this.segments.length];
	}


	easeIn(a, b, percent) {
		return a + (b - a) * Math.pow(percent, 2);
	}
	easeOut(a, b, percent) {
		return a + (b - a) * (1 - Math.pow(1 - percent, 2));
	}
	easeInOut(a, b, percent) {
		return a + (b - a) * ((-Math.cos(percent * Math.PI) / 2) + 0.5);
	}
}
