class Player extends Car{
	constructor(){
		super(0,-1,-0.5,3);
	}

	drawPlayer(sprites,steer,updown,destX,destY){
		
		let sprite=sprites[IMAGES.PLAYER_STRAIGHT];
		  
    if (steer < 0){
      sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_LEFT] : sprites[IMAGES.PLAYER_LEFT];
    }
    else if (steer > 0){
      sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_RIGHT] : sprites[IMAGES.PLAYER_RIGHT];
    }
    else{
      sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_STRAIGHT] : sprites[IMAGES.PLAYER_STRAIGHT];
    }
    // console.log(destX,GAME_VARIABLES.CANVAS_WIDTH,destY,GAME_VARIABLES.CANVAS_HEIGHT);
	  renderSprite(sprite, GAME_VARIABLES.cameraDepth/this.z, destX, destY, this.playerOffset, this.playerY);

	  // this.player.draw(
   //    this.ctx,
   //    'images/spritesheet.high.png',
   //    this.carSprite,
   //    this.canvas.width / 2 + 30 * WIDTH_MULTIPLIER + 30,
   //    600 * HEIGHT_MULTIPLIER + 600,
   //    this.isSpacePressed
   //  );
   	// console.log(sprite,GAME_VARIABLES.CANVAS_WIDTH
   	// 	,GAME_VARIABLES.CANVAS_WIDTH/2+30*GAME_VARIABLES.resolution+30
   	// 	,GAME_VARIABLES.CANVAS_HEIGHT*0.2*GAME_VARIABLES.resolution+GAME_VARIABLES.CANVAS_HEIGHT*0.2
   	// 	,GAME_VARIABLES.CANVAS_HEIGHT
   	// 	,CAR.width*GAME_VARIABLES.resolution+CAR.width
   	// 	,CAR.height*GAME_VARIABLES.resolution+CAR.height);

		// GAME_VARIABLES.ctx.drawImage(sprite
		// 	,GAME_VARIABLES.CANVAS_WIDTH/2
		// 	,GAME_VARIABLES.CANVAS_HEIGHT*0.4*GAME_VARIABLES.resolution+GAME_VARIABLES.CANVAS_HEIGHT*0.4
		// 	,CAR.width*GAME_VARIABLES.resolution+CAR.width
		// 	,CAR.height*GAME_VARIABLES.resolution+CAR.height);

			// 	GAME_VARIABLES.ctx.drawImage(sprite
			// ,10,10,CAR.width,CAR.height);
	}

	update(dt,playerSegment,totalTrackLength,keyPressedFlags){

    this.updatePosition(dt,totalTrackLength);

    //Update X according to key presse index 0: left index 2: right
	 	if(keyPressedFlags[0]){
	 		this.updateX(-dt,playerSegment.curve);
	 	}
	 	else if(keyPressedFlags[2]){
	 		this.updateX(dt,playerSegment.curve);
	 	}
	 	else if(playerSegment.curve>0 && this.speed!=0){
	 		this.updateX(-dt,playerSegment.curve);
	 	}
	 	else if(playerSegment.curve<0 && this.speed!=0){
	 		this.updateX(dt,playerSegment.curve);
	 	}

	 	if(keyPressedFlags[1]){
	 		this.updateSpeed(this.ACCEL,dt);
	 	}
	 	else if(keyPressedFlags[3]){
	 		this.updateSpeed(this.DECCEL,dt);	
	 	}
	 	else if(this.speed>0){
	 		this.updateSpeed(-1,dt);
	 	}
	}
}