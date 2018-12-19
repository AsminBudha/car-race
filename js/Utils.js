let GAME_VARIABLES = {
	//For Canvas
	CANVAS_WIDTH: window.innerWidth - 100 || document.body.clientWidth - 100,
	CANVAS_HEIGHT: window.innerHeight - 100 || document.body.clientHeight - 100,
	canvas: document.getElementById('canvas'),
	ctx: canvas.getContext('2d'),

	fieldOfView: 90, // angle (degrees) for field of view
	cameraHeight: 1000,// z height of camera
	cameraDepth: 0.8,//null;// z distance camera is from screen (computed) calculated using d=1/tan(fav/2)
	resolution: null,
	//For Track
	segmentLength: 200,
	rumbleLength: 3,
	drawDistance: 300,
	roadWidth: 2000,
	lanes: 2,
	COLOR: {
		GRASS_DARK: '#007f00',
		GRASS_LIGHT: '#00b200',
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
GAME_VARIABLES.accel = GAME_VARIABLES.maxSpeed / 5;             // acceleration rate - tuned until it 'felt' right
GAME_VARIABLES.breaking = -GAME_VARIABLES.maxSpeed;               // deceleration rate when braking
GAME_VARIABLES.decel = -GAME_VARIABLES.maxSpeed / 5;             // 'natural' deceleration rate when neither accelerating, nor braking
GAME_VARIABLES.offRoadDecel = -GAME_VARIABLES.maxSpeed / 2;             // off road deceleration is somewhere in between
GAME_VARIABLES.offRoadLimit = GAME_VARIABLES.maxSpeed / 4;

let CAR = {
	width: 80
	, height: 40 //let car moves from 0 to 100 kph in 5 secs
};

let IMAGES = {
	PLAYER_LEFT: 0,
	PLAYER_RIGHT: 1,
	PLAYER_STRAIGHT: 2,
	PLAYER_UPHILL_LEFT: 3,
	PLAYER_UPHILL_RIGHT: 4,
	PLAYER_UPHILL_STRAIGHT: 5,
	COUNTDOWN_3: 6,
	COUNTDOWN_2: 7,
	COUNTDOWN_1: 8,
	COUNTDOWN_GO: 9,
	TREE_1: 10
	, BACKGROUND: 11
};

let IMAGES_SRC = [
	'img/player/player_left.png'
	, 'img/player/player_right.png'
	, 'img/player/player_straight.png'
	, 'img/player/player_uphill_left.png'
	, 'img/player/player_uphill_right.png'
	, 'img/player/player_uphill_straight.png'
	, 'img/countdown/3.png'
	, 'img/countdown/2.png'
	, 'img/countdown/1.png'
	, 'img/countdown/go.png'
	, 'img/column.png'
	, 'img/background/background.png'];

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

	var destW = (sprite.width * scale * GAME_VARIABLES.CANVAS_WIDTH / 2) * (SPRITE.scale * GAME_VARIABLES.roadWidth);
	var destH = (sprite.height * scale * GAME_VARIABLES.CANVAS_WIDTH / 2) * (SPRITE.scale * GAME_VARIABLES.roadWidth);

	destX = destX + (destW * (offsetX || 0));
	destY = destY + (destH * (offsetY || 0));

	var clipH = clipY ? Math.max(0, destY + destH - clipY) : 0;

	if (clipH < destH) {
		GAME_VARIABLES.ctx.drawImage(sprite, destX, destY, destW, destH - clipH);

		worldObj.x = destX;
		worldObj.y = destY;
		worldObj.width = destW;
		worldObj.height = destH - clipH;
	}
};