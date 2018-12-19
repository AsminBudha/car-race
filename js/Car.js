class Car {

  constructor(x, y, offset, startZoom) {
    this.x = x;
    this.y = y;
    this.playerOffset = offset;
    this.z = (GAME_VARIABLES.cameraHeight * GAME_VARIABLES.cameraDepth) + startZoom * GAME_VARIABLES.segmentLength;
    this.position = 0;
    this.speed = 0;
    this.ACCEL = 0;
    this.DECCEL = 1;

  }

  // renderPlayer(sprites, speedPercent, scale, destX, destY, steer, updown) {

  // 	let choices=[-1,1];
  //    let random=this.getRandomInt(0,2);
  //    let choice=choices[random];
  //   let bounce = (1.5 * Math.random() * speedPercent * GAME_VARIABLES.resolution) * choice;
  //   let sprite =sprites[IMAGES.PLAYER_STRAIGHT];

  //    if (steer < 0){
  //      sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_LEFT] : sprites[IMAGES.PLAYER_LEFT];
  //    }
  //    else if (steer > 0){
  //      sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_RIGHT] : sprites[IMAGES.PLAYER_RIGHT];
  //    }
  //    else
  //      sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_STRAIGHT] : sprites[IMAGES.PLAYER_STRAIGHT];

  //   renderSprite(sprite, scale, destX, destY, this.playerOffset, this.y);

  // };

  updatePosition(dt, totalTrackLength) {

    this.position = this.position + (dt * this.speed);

    while (this.position >= totalTrackLength) {
      this.position -= totalTrackLength;
    }
    while (this.position < 0) {
      this.position += totalTrackLength;
    }

  }

  updateX(dt, curve) {
    let speedPercent = this.speed / GAME_VARIABLES.maxSpeed;
    let dx = dt * 2 * speedPercent; // at top speed, should be able to cross from left to right (-1 to 1) in 1

    this.x = this.x + dx;

    this.x = this.x - (dx * speedPercent * curve * GAME_VARIABLES.centrifugal);

    this.x = Math.max(-3, Math.min(this.x, 3));     // dont ever let it go too far out of bounds

  }

  updateSpeed(accel, dt) {

    if (accel == this.ACCEL) {
      this.accelerate(GAME_VARIABLES.accel, dt);//accelerate when pressing up key
    }
    else if (accel == this.DECCEL) {
      this.accelerate(GAME_VARIABLES.breaking, dt);//deccelerate when pressing down key
    }
    else {
      this.accelerate(GAME_VARIABLES.decel, dt);//deccelerate when no key is pressed
    }


    if ((this.x < -1) || (this.x > 1)) {
      if (this.speed > GAME_VARIABLES.offRoadLimit) {
        this.accelerate(GAME_VARIABLES.offRoadDecel, dt);
      }
      else if (this.speed < 0 && this.speed < -GAME_VARIABLES.offRoadLimit) {
        // gameThat.player.accelerate(-gameThat.player.offRoadDecel, dt);
        this.speed = -GAME_VARIABLES.offRoadLimit;
      }

    }

    if (!accel == this.DECCEL) {
      this.speed = Math.max(0, Math.min(this.speed, GAME_VARIABLES.maxSpeed)); // or exceed maxSpeed
    }
    else {
      this.speed = Math.max(this.speed, -GAME_VARIABLES.maxSpeed);
    }

  }

  checkCollisionWith(playerOffset, playerWidth, objOffset, objWidth) {

    var half = 0.5;

    let x = playerOffset - (playerWidth * half);
    let xW = playerOffset + (playerWidth * half);
    let objX = objOffset - (objWidth * half);
    let objXW = objOffset + (objWidth * half);

    if ((x >= objX && x <= objXW)
      || (xW >= objX && xW <= objXW))
      return true;
    return false;
  }
  accelerate(accel, dt) {
    this.speed += accel * dt;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
  }

}

