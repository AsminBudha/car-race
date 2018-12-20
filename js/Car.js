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
    this.NO_ACCEL = -1;
    this.crossFinish = false;
    this.currentPosition=0;
  }

  updatePosition(dt, totalTrackLength) {

    this.position = this.position + (dt * this.speed);

    this.currentPosition+=(dt*this.speed);

    if (this.currentPosition > totalTrackLength) {
      this.crossFinish = true;
    }

    while (this.position >= totalTrackLength) {
      this.position -= totalTrackLength;
    }
    while (this.position < 0) {
      this.position += totalTrackLength;
    }

  }

  updateX(dt) {
    let speedPercent = this.speed / GAME_VARIABLES.maxSpeed;
    let dx = dt * 2 * speedPercent; // at top speed, should be able to cross from left to right (-1 to 1) in 1

    if (dx == 0) {
      if (dt < 0) {
        dx = -0.008;
      }
      else {
        dx = 0.008;
      }
    }

    this.x = this.x + dx;

    this.x = Math.max(-3, Math.min(this.x, 3));     // dont ever let it go too far out of bounds
  }

  updateXInCurve(dt, curve) {
    let speedPercent = this.speed / GAME_VARIABLES.maxSpeed;
    let dx = dt * 2 * speedPercent; // at top speed, should be able to cross from left to right (-1 to 1) in 1

    this.x = this.x - (dx * speedPercent * curve * GAME_VARIABLES.centrifugal);

  }

  updateSpeed(accel, dt, accelVal, maxSpeed) {

    this.accelerate(accelVal, dt);

    if ((this.x < -1) || (this.x > 1)) {
      if (this.speed > GAME_VARIABLES.offRoadLimit) {
        this.accelerate(GAME_VARIABLES.offRoadDecel, dt);
      }
      else if(this.speed<0 && this.speed<-GAME_VARIABLES.offRoadLimit/6){
        console.log(this.speed,-GAME_VARIABLES.offRoadLimit,-GAME_VARIABLES.offRoadDecel);
        this.accelerate(-GAME_VARIABLES.offRoadDecel*2.5,dt);
        console.log('next',this.speed);
      }
    }

    if (!accel == this.DECCEL) {
      this.speed = Math.max(0, Math.min(this.speed, maxSpeed)); // or exceed maxSpeed
    }
    else if(accel==this.DECCEL){
      this.speed = Math.max(this.speed, maxSpeed);
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

