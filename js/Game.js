class Game{

	constructor(){
		GAME_VARIABLES.canvas.height = GAME_VARIABLES.CANVAS_HEIGHT;
		GAME_VARIABLES.canvas.width = GAME_VARIABLES.CANVAS_WIDTH;

		this.position = 0;

		gameThat=this;

		this.keyPressedFlags=[false,false,false,false];//LEFT , UP , RIGHT , DOWN
	}

	start(){
		this.timer=0;

		this.road = new Road();
		this.player = new Car();

		this.playerSprites=[];

		let totalImg=0;
		let onLoad=()=>{
			totalImg++;
			if(totalImg==IMAGES_SRC.length){
				document.addEventListener('keydown',this.keyDownHandler);
				document.addEventListener('keyup',this.keyUpHandler);

				this.last=new Date().getTime();
				this.gdt=0;
				this.frame();
			}
		};

		for(let i=0;i<IMAGES_SRC.length;i++){
			let imgObj=new Image();
			imgObj.onload=onLoad();
			imgObj.src=IMAGES_SRC[i];
			this.playerSprites.push(imgObj);
		}

	}

	frame() {
		let now=new Date().getTime();
		let dt  = Math.min(1, (now - gameThat.last) / 1000); // using requestAnimationFrame have to be able to handle large delta's caused when it 'hibernates' in a background or non-visible tab
    gameThat.gdt = gameThat.gdt + dt;
    while (gameThat.gdt > GAME_VARIABLES.step) {
      gameThat.gdt -= GAME_VARIABLES.step;
      gameThat.update(GAME_VARIABLES.step);
    }
  	gameThat.road.renderRoad(gameThat.position,gameThat.player,gameThat.playerSprites
				,gameThat.keyPressedFlags[0],gameThat.keyPressedFlags[2]);
			
    gameThat.last = now;
  
		requestAnimationFrame(gameThat.frame);

	}

	update(dt){
    let speedPercent  = gameThat.player.speed/gameThat.player.maxSpeed;
	  let dx            = dt * 2 * speedPercent; // at top speed, should be able to cross from left to right (-1 to 1) in 1 
		let startPosition = gameThat.position;
		let playerSegment = gameThat.road.findSegment(gameThat.position+gameThat.player.playerZ);
      

    gameThat.position = gameThat.position+(dt*gameThat.player.speed);

    let totalTrackLength=GAME_VARIABLES.segmentLength*gameThat.road.segments.length;
    while(gameThat.position>=totalTrackLength){
    	gameThat.position-=totalTrackLength;
    }
    while(gameThat.position<0){
    	gameThat.position+=totalTrackLength;
    }

    if (gameThat.keyPressedFlags[0]){
      gameThat.player.playerX = gameThat.player.playerX - dx;
      // console.log('left',gameThat.playerX,dx);
    }
    else if (gameThat.keyPressedFlags[2]){
      gameThat.player.playerX = gameThat.player.playerX + dx;
      // console.log('right',gameThat.playerX,dx);
    }

    gameThat.player.playerX = gameThat.player.playerX - (dx * speedPercent * playerSegment.curve * GAME_VARIABLES.centrifugal);

    if (gameThat.keyPressedFlags[1])
      gameThat.player.accelerate(gameThat.player.accel, dt);//accelerate when pressing up key
    else if (gameThat.keyPressedFlags[3])
      gameThat.player.accelerate(gameThat.player.breaking, dt);//deccelerate when pressing down key
    else
      gameThat.player.accelerate(gameThat.player.decel, dt);//deccelerate when no key is pressed


    if ((gameThat.player.playerX < -1) || (gameThat.player.playerX > 1)) {
      if (gameThat.player.speed > gameThat.player.offRoadLimit)
        gameThat.player.accelerate(gameThat.player.offRoadDecel, dt);
    }

    gameThat.player.playerX = Math.max(-3,Math.min(gameThat.player.playerX, 3));     // dont ever let it go too far out of bounds
    gameThat.player.speed   = Math.max(0, Math.min(gameThat.player.speed, gameThat.player.maxSpeed)); // or exceed maxSpeed
	}

	keyDownHandler(e){
		//arrow key ranges from 37-40 with 37=LEFT in clockwise
		gameThat.keyPressedFlags[e.keyCode-37]=true;
	}

	keyUpHandler(e){
		//arrow key ranges from 37-40 with 37=LEFT in clockwise
		gameThat.keyPressedFlags[e.keyCode-37]=false;
	}

}
let gameThat=null;
new Game().start();