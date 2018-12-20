class Player extends Car {
	constructor() {
		super(0, -1, -0.5, 3);

		this.worldCoordinates = {
			x: 0,
			y: 0,
			width: 0,
			height: 0
		};
		this.lastPosition=0;

		this.topView=true;
	}

	drawPlayer(sprites, steer, updown, destX, destY) {

		let sprite;

		
		if(this.topView){
			if (steer < 0) {
				sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_LEFT] : sprites[IMAGES.PLAYER_LEFT];
			}
			else if (steer > 0) {
				sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_RIGHT] : sprites[IMAGES.PLAYER_RIGHT];
			}
			else {
				sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_STRAIGHT] : sprites[IMAGES.PLAYER_STRAIGHT];
			}
			
			renderSprite(sprite, GAME_VARIABLES.cameraDepth / this.z, destX, destY, this.playerOffset, this.playerY, 0, this.worldCoordinates);
		}
		else{
			if (steer < 0) {
				sprite = sprites[IMAGES.PLAYER_STEER_LEFT];
			}
			else if (steer > 0) {
				sprite = sprites[IMAGES.PLAYER_STEER_RIGHT];
			}
			else {
				sprite = sprites[IMAGES.PLAYER_STEER_STILL];
			}
			
			destY=GAME_VARIABLES.CANVAS_HEIGHT;
			GAME_VARIABLES.ctx.drawImage(
				sprite
				,0
				,GAME_VARIABLES.CANVAS_HEIGHT-200
				,GAME_VARIABLES.CANVAS_WIDTH
				,200
			);
		}
	}

	checkCollisionWith(objCoordinates) {
		// console.log(this.worldCoordinates, objCoordinates);
		if (this.worldCoordinates != null && objCoordinates != null) {
			console.log('inside');
			if ((this.worldCoordinates.x >= objCoordinates.x
				&& this.worldCoordinates.x <= objCoordinates.x + objCoordinates.width)
				|| (this.worldCoordinates.x + this.worldCoordinates.width >= objCoordinates.x
					&& this.worldCoordinates.x + this.worldCoordinates.width <= objCoordinates.x + objCoordinates.width)) {
				return true;
			}
		}
		return false;
	}

	drawSpeed(){
		
		let speedMeter=5 * Math.round(this.speed/500);
		GAME_VARIABLES.ctx.save();
		GAME_VARIABLES.ctx.fillStyle='#363636';
		GAME_VARIABLES.ctx.fillRect(0,0,200,100);

		
		GAME_VARIABLES.ctx.fillStyle='#000';
		GAME_VARIABLES.ctx.fillRect(10,20,180,20);

		let maxSpeedMeter=5*Math.round(GAME_VARIABLES.maxSpeed/500);
		let speedPercent=speedMeter/maxSpeedMeter*100;
		
		if(this.speed>0){
			
			if(speedPercent<80){
				let speedMeterWidth=180*speedPercent/100;
				GAME_VARIABLES.ctx.fillStyle='#b3b3ff';
				GAME_VARIABLES.ctx.fillRect(10,20,speedMeterWidth,20);	
			}
			else{
				let upto80Width=180*80/100;
				GAME_VARIABLES.ctx.fillStyle='#b3b3ff';
				GAME_VARIABLES.ctx.fillRect(10,20,upto80Width,20);
				
				let speedMeterWidth=180*(speedPercent-80)/100;
				GAME_VARIABLES.ctx.fillStyle='#ffc2b3';
				GAME_VARIABLES.ctx.fillRect(10+upto80Width,20,speedMeterWidth,20);
				
			}
				
		}
		


		GAME_VARIABLES.ctx.fillStyle='#FFF';
		GAME_VARIABLES.ctx.font='36px serif';
		GAME_VARIABLES.ctx.fillText('MPH   '+speedMeter,30,80);

		GAME_VARIABLES.ctx.restore();
	}

	drawPosition(position,total){
		GAME_VARIABLES.ctx.save();
		GAME_VARIABLES.ctx.fillStyle='#535353';
		GAME_VARIABLES.ctx.fillRect(GAME_VARIABLES.CANVAS_WIDTH-200,0,200,100);

		GAME_VARIABLES.ctx.fillStyle='#C2810B';
		GAME_VARIABLES.ctx.font='30px serif';
		GAME_VARIABLES.ctx.fillText('POS',GAME_VARIABLES.CANVAS_WIDTH-180,80);
		
		GAME_VARIABLES.ctx.fillStyle='#FFFF';
		GAME_VARIABLES.ctx.font='36px serif';
		GAME_VARIABLES.ctx.fillText(position+'/'+total,GAME_VARIABLES.CANVAS_WIDTH-100,80);
		
		GAME_VARIABLES.ctx.restore();
	}

	update(dt, playerSegment, totalTrackLength, keyPressedFlags) {

		this.updatePosition(dt, totalTrackLength);

		//Update X according to key presse index 0: left index 2: right
		if (keyPressedFlags[0] && !this.crossFinish && this.speed!=0) {
			this.updateX(-dt);
		}
		else if (keyPressedFlags[2] && !this.crossFinish && this.speed!=0) {
			this.updateX(dt);
		}

		if (playerSegment.curve != 0 && this.speed != 0) {
			this.updateXInCurve(dt, playerSegment.curve);
		}

		if (keyPressedFlags[1] && !this.crossFinish) {
			this.updateSpeed(this.ACCEL, dt, GAME_VARIABLES.accel, GAME_VARIABLES.maxSpeed);
		}
		else if (keyPressedFlags[3] && !this.crossFinish) {
			this.updateSpeed(this.DECCEL, dt, GAME_VARIABLES.breaking, -GAME_VARIABLES.maxSpeed/4);
		}
		else if (this.speed > 0 || this.crossFinish) {
			this.updateSpeed(this.NO_ACCEL, dt, GAME_VARIABLES.decel, GAME_VARIABLES.maxSpeed);
		}
		else if(this.speed<0 && !this.crossFinish){
			this.updateSpeed(this.NO_ACCEL, dt, -GAME_VARIABLES.decel, -GAME_VARIABLES.maxSpeed/4);	
		}
	}
}