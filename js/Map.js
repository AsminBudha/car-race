//Map of track better give length in divisble of 3
let trackMap = [
	{ type: 'straight', length: 300, curve: 0, height: 0 },
	{ type: 'straight', length: 60, curve: 0, height: 10 },
	{ type: 'straight', length: 300, curve: 0, height: -10 },
	{ type: 'straight', length: 300, curve: 0, height: 0 },
	{ type: 'curve', length: 300, curve: 2, height: 0 },
	{ type: 'curve', length: 300, curve: -4, height: 0 },
	{ type: 'straight', length: 300, curve: 0, height: 0 },
	{ type: 'straight', length: 300, curve: 0, height: 10 },
	{ type: 'straight', length: 300, curve: 0, height: -10 },
	{ type: 'straight', length: 300, curve: 0, height: 0 },
	{ type: 'curve', length: 300, curve: -2, height: 0 },
	{ type: 'straight', length: 300, curve: 0, height: 0 }
];

let spritesObstacles = [
	{ position: 40, sprite: 'CACTUS_1', offset: -5 }
	, { position: 50, sprite: 'CACTUS_2', offset: -2 }
	, { position: 100, sprite: 'STONE_1', offset: 5 }
	, { position: 100, sprite: 'GRASS_1', offset: 5.1 }
	, { position: 100, sprite: 'GRASS_1', offset: 5.3 }
	, { position: 100, sprite: 'GRASS_1', offset: 5.5 }
	, { position: 100, sprite: 'GRASS_1', offset: 4.9 }
	, { position: 100, sprite: 'GRASS_1', offset: 4.7 }
	, { position: 110, sprite: 'CACTUS_2', offset: -2 }
	, { position: 140, sprite: 'CACTUS_1', offset: -2 }
	, { position: 150, sprite: 'STONE_1', offset: 1.5 }
	, { position: 150, sprite: 'GRASS_1', offset: 1.6 }
	, { position: 150, sprite: 'GRASS_1', offset: 1.4 }
	, { position: 180, sprite: 'CACTUS_1', offset: -1.5 }
	, { position: 200, sprite: 'CACTUS_2', offset: 1.5 }
	, { position: 150, sprite: 'CACTUS_1', offset: 5 }
	, { position: 240, sprite: 'STONE_1', offset: -5 }
	, { position: 250, sprite: 'STONE_1', offset: -2 }
	, { position: 300, sprite: 'STONE_1', offset: 5 }
	, { position: 310, sprite: 'CACTUS_1', offset: -2 }
	, { position: 340, sprite: 'CACTUS_2', offset: -2 }
	, { position: 350, sprite: 'CACTUS_1', offset: 1.5 }
	, { position: 380, sprite: 'CACTUS_2', offset: -1.5 }
	, { position: 400, sprite: 'CACTUS_1', offset: 1.5 }
	, { position: 450, sprite: 'CACTUS_1', offset: 5 }
	, { position: 510, sprite: 'STONE_1', offset: 5 }
	, { position: 600, sprite: 'GRASS_1', offset: 5.1 }
	, { position: 780, sprite: 'GRASS_1', offset: 5.3 }
	, { position: 880, sprite: 'GRASS_1', offset: 5.5 }
	, { position: 940, sprite: 'GRASS_1', offset: 4.9 }
	, { position: 1050, sprite: 'GRASS_1', offset: 4.7 }
	, { position: 40, sprite: 'CACTUS_1', offset: -5 }
	, { position: 60, sprite: 'CACTUS_2', offset: -2 }
	, { position: 120, sprite: 'STONE_1', offset: 5 }
	, { position: 120, sprite: 'GRASS_1', offset: 5.1 }
	, { position: 140, sprite: 'GRASS_1', offset: 5.3 }
	, { position: 160, sprite: 'GRASS_1', offset: 5.5 }
	, { position: 180, sprite: 'GRASS_1', offset: 4.9 }
	, { position: 190, sprite: 'GRASS_1', offset: 4.7 }
	, { position: 210, sprite: 'CACTUS_2', offset: -2 }
	, { position: 240, sprite: 'CACTUS_1', offset: -2 }
	, { position: 250, sprite: 'STONE_1', offset: 1.5 }
	, { position: 250, sprite: 'GRASS_1', offset: 1.6 }
	, { position: 250, sprite: 'GRASS_1', offset: 1.4 }
	, { position: 280, sprite: 'CACTUS_1', offset: -1.5 }
	, { position: 300, sprite: 'CACTUS_2', offset: 1.5 }
	, { position: 750, sprite: 'CACTUS_1', offset: 5 }
	, { position: 280, sprite: 'STONE_1', offset: -5 }
	, { position: 950, sprite: 'STONE_1', offset: -2 }
	, { position: 390, sprite: 'STONE_1', offset: 5 }
	, { position: 380, sprite: 'CACTUS_1', offset: -2 }
	, { position: 440, sprite: 'CACTUS_2', offset: -2 }
	, { position: 450, sprite: 'CACTUS_1', offset: 1.5 }
	, { position: 880, sprite: 'CACTUS_2', offset: -1.5 }
	, { position: 800, sprite: 'CACTUS_1', offset: 1.5 }
	, { position: 450, sprite: 'CACTUS_1', offset: 5 }
	, { position: 510, sprite: 'STONE_1', offset: 5 }
	, { position: 600, sprite: 'GRASS_1', offset: 5.1 }
	, { position: 780, sprite: 'GRASS_1', offset: 5.3 }
	, { position: 980, sprite: 'GRASS_1', offset: 5.5 }
	, { position: 1240, sprite: 'GRASS_1', offset: 4.9 }
	, { position: 1150, sprite: 'GRASS_1', offset: 4.7 }
	, { position: 1340, sprite: 'GRASS_1', offset: 4.9 }
	, { position: 1450, sprite: 'GRASS_1', offset: -4.7 }
	, { position: 1540, sprite: 'GRASS_1', offset: -4.9 }
	, { position: 1650, sprite: 'GRASS_1', offset: 4.7 }
	, { position: 1740, sprite: 'GRASS_1', offset: 4.9 }
	, { position: 1850, sprite: 'GRASS_1', offset: 4.7 }
];