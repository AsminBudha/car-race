class Enemy extends Car {
  constructor(x, y, offset, initialPosition) {
    super(x, y, offset, initialPosition);

    this.worldCoordinates = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    // console.log(offset);
    this.accel = GAME_VARIABLES.maxSpeed / Math.floor(Math.random() * 10 + 4);
    this.maxSpeed = GAME_VARIABLES.segmentLength / (Math.floor(Math.random() * 4 + 1) * GAME_VARIABLES.step);

  }

  drawEnemy(enemySegment, sprites) {

    let enemyScale = enemySegment.p1.screen.scale;
    let enemyX = enemySegment.p1.screen.x
      + (enemyScale * this.playerOffset * GAME_VARIABLES.roadWidth * GAME_VARIABLES.CANVAS_WIDTH / 2);
    let enemyY = enemySegment.p1.screen.y;
    let enemyPercent = percentRemaining(this.position, GAME_VARIABLES.segmentLength);

    // enemyY = enemyY
    //   - (GAME_VARIABLES.cameraDepth / this.z
    //     * interpolate(enemySegment.p1.camera.y, enemySegment.p2.camera.y, enemyPercent)
    //     * enemyY);
    // let isUP = enemySegment.p1.world.y != 0;

    let steer = 0;
    if (enemySegment.curve > 0) {
      steer = -1;
    }
    else if (enemySegment.curve < 0) {
      steer = 1;
    }

    let sprite;

    if (steer < 0) {
      sprite = sprites[IMAGES.CAR_2_RIGHT];
    }
    else if (steer > 0) {
      sprite = sprites[IMAGES.CAR_2_LEFT];
    }
    else {
      sprite = sprites[IMAGES.CAR_2_STRAIGHT];
    }

    renderSprite(sprite, enemyScale
      , enemyX, enemyY, (this.playerOffset < 0 ? -1 : 0), -1, enemySegment.clip, this.worldCoordinates);
  }

  update(dt, totalTrackLength) {

    this.updatePosition(dt, totalTrackLength);

    // console.log('accel', this.accel);
    if (this.crossFinish) {
      if (this.speed > 0)
        this.updateSpeed(this.NO_ACCEL, dt, GAME_VARIABLES.decel, this.maxSpeed);
      // console.log('speed', this.speed);
    }
    else {
      this.updateSpeed(this.ACCEL, dt, this.accel, this.maxSpeed);
    }

  }
}