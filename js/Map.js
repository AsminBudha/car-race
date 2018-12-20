//Map of track better give length in divisble of 3
let trackMap = [
	{ type: 'straight', length: 30, curve: 0, height: 0 },
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
	{ position: 40, sprite: 'TREE_1', offset: -5 }
	, { position: 50, sprite: 'TREE_1', offset: -2 }
	, { position: 100, sprite: 'TREE_1', offset: 5 }
	, { position: 110, sprite: 'TREE_1', offset: -2 }
	, { position: 140, sprite: 'TREE_1', offset: -2 }
	, { position: 150, sprite: 'TREE_1', offset: 1.5 }
	, { position: 180, sprite: 'TREE_1', offset: -1.5 }
	, { position: 200, sprite: 'TREE_1', offset: 1.5 }
	, { position: 150, sprite: 'DESERT_STONE', offset: 5 }
];