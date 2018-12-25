let GAME_VARIABLES = {
	//For Canvas
	CANVAS_WIDTH: window.innerWidth - 10 || document.body.clientWidth - 10,
	CANVAS_HEIGHT: window.innerHeight - 10 || document.body.clientHeight - 10,
	canvas: document.getElementById('canvas'),
	ctx: canvas.getContext('2d'),

	fieldOfView: 90, // angle (degrees) for field of view
	cameraHeight: 1000,// z height of camera
	cameraDepth: 0.8,//null;// z distance camera is from screen (computed) calculated using d=1/tan(fav/2)
	resolution: null,
	//For Track
	segmentLength: 300,
	rumbleLength: 3,
	drawDistance: 300,
	roadWidth: 2000,
	lanes: 2,
	COLOR: {
		GRASS_DARK: '#97837A',
		GRASS_LIGHT: '#97837A',
		ROAD: 'gray',
		RUMBLE_DARK: 'red',
		RUMBLE_LIGHT: 'yellow',
		LANE_DARK: 'gray',
		LANE_LIGHT: 'white'
	},
	fps: 60,                  // how many 'update' frames per second
	speed: 1,                    // current speed
	maxSpeed: 0,      // top speed (ensure we can't move more than 1 segment in a
	centrifugal: 0.3,
	step: 1,                   // how long is each frame (in seconds)
	offRoadDecel: 0.99                    // speed multiplier when off road (e.g. you lose 2% speed each
}
GAME_VARIABLES.cameraDepth = 1 / Math.tan((GAME_VARIABLES.fieldOfView / 2) * Math.PI / 180);
GAME_VARIABLES.resolution = GAME_VARIABLES.CANVAS_HEIGHT / 480;
GAME_VARIABLES.step = 1 / GAME_VARIABLES.fps;
GAME_VARIABLES.maxSpeed = GAME_VARIABLES.segmentLength / GAME_VARIABLES.step;
GAME_VARIABLES.accel = GAME_VARIABLES.maxSpeed / 5;             // acceleration rate
GAME_VARIABLES.breaking = -GAME_VARIABLES.maxSpeed;               // deceleration rate when braking
GAME_VARIABLES.decel = -GAME_VARIABLES.maxSpeed / 5;             // 'natural' deceleration rate when neither accelerating, nor braking
GAME_VARIABLES.offRoadDecel = -GAME_VARIABLES.maxSpeed / 2;             // off road deceleration
GAME_VARIABLES.offRoadLimit = GAME_VARIABLES.maxSpeed / 4;

let CAR = {
	width: 80
	, height: 40
};

let IMAGES = {
	PLAYER_LEFT: 0
	, PLAYER_RIGHT: 1
	, PLAYER_STRAIGHT: 2
	, PLAYER_UPHILL_LEFT: 3
	, PLAYER_UPHILL_RIGHT: 4
	, PLAYER_UPHILL_STRAIGHT: 5
	, COUNTDOWN_3: 6
	, COUNTDOWN_2: 7
	, COUNTDOWN_1: 8
	, COUNTDOWN_GO: 9
	, CACTUS_1: 10
	, BACKGROUND: 11
	, PLAYER_STEER_STILL: 12
	, PLAYER_STEER_LEFT: 13
	, PLAYER_STEER_RIGHT: 14
	, DESERT_GROUND: 15
	, DESERT_STONE: 16
	, ENEMY_1_STRAIGHT: 17
	, CACTUS_2: 18
	, STONE_1: 19
	, GRASS_1: 20
	, NOS: 21
	, CAR_2_STRAIGHT: 22
	, CAR_2_LEFT: 23
	, CAR_2_RIGHT: 24
};

let IMAGES_SRC = [
	'img/player/car1_left.png'
	, 'img/player/car1_right.png'
	, 'img/player/car1_straight.png'
	, 'img/player/player_uphill_left.png'
	, 'img/player/player_uphill_right.png'
	, 'img/player/player_uphill_straight.png'
	, 'img/countdown/3.png'
	, 'img/countdown/2.png'
	, 'img/countdown/1.png'
	, 'img/countdown/go.png'
	, 'img/cactus1.png'
	, 'img/background/desert_BG.png'
	, 'img/player/steer_straight.png'
	, 'img/player/steer_left.png'
	, 'img/player/steer_right.png'
	, 'img/background/desert-ground.png'
	, 'img/desert-stone.png'
	, 'img/player/car1_straight.png'
	, 'img/cactus2.png'
	, 'img/stone1.png'
	, 'img/grass1.png'
	, 'img/nos.png'
	, 'img/player/car2-straight.png'
	, 'img/player/car2-left.png'
	, 'img/player/car2-right.png'
];

const writeText = (ctx, x, y, text, font, color) => {
	ctx.font = font;
	ctx.textAlign = 'center';
	ctx.fillStyle = color;
	ctx.shadowColor = 'black';
	ctx.shadowBlur = 40;
	ctx.fillText(text, x, y);

	ctx.shadowBlur = 0;
}

SPRITE = {
	scale: 0.3 * (1 / 100)
}

const renderSprite = function (sprite, scale, destX, destY, offsetX, offsetY, clipY, worldObj) {

	let destW = (sprite.width * scale * GAME_VARIABLES.CANVAS_WIDTH / 2) * (SPRITE.scale * GAME_VARIABLES.roadWidth);
	let destH = (sprite.height * scale * GAME_VARIABLES.CANVAS_WIDTH / 2) * (SPRITE.scale * GAME_VARIABLES.roadWidth);

	destX = destX + (destW * (offsetX || 0));
	destY = destY + (destH * (offsetY || 0));

	let clipH = clipY ? Math.max(0, destY + destH - clipY) : 0;

	if (clipH < destH) {
		GAME_VARIABLES.ctx.drawImage(sprite, 0, 0, sprite.width
			, sprite.height - (sprite.height * clipH / destH), destX, destY, destW, destH - clipH);

		worldObj.x = destX;
		worldObj.y = destY;
		worldObj.width = destW;
		worldObj.height = destH - clipH;
	}
};

let KEY_PRESSED_FLAGS = [
	false
	, false
	, false
	, false
	, false
	, false
];

let KEY_PRESSED_INDEX = {
	LEFT: 0
	, UP: 1
	, RIGHT: 2
	, DOWN: 3
	, N: 4
	, V: 5
	, SPACE: 3
	, A: 0
	, W: 1
	, D: 2
	, S: 3
};

let KEY_PRESSED_CODE = {
	LEFT: 37
	, UP: 38
	, RIGHT: 39
	, DOWN: 40
	, N: 78
	, V: 86
	, SPACE: 32
	, W: 87
	, A: 65
	, S: 83
	, D: 68
};

function percentRemaining(n, total) {
	return (n % total) / total;
}

function interpolate(a, b, percent) {
	return a + (b - a) * percent;
}
