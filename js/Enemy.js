class Enemy extends Car {
  constructor(x, y, offset, initialPosition) {
    super(x, y, offset, initialPosition);
  }

  drawPlayer(sprites, steer, updown) {

    let sprite = sprites[IMAGES.PLAYER_STRAIGHT];

    if (steer < 0) {
      sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_LEFT] : sprites[IMAGES.PLAYER_LEFT];
    }
    else if (steer > 0) {
      sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_RIGHT] : sprites[IMAGES.PLAYER_RIGHT];
    }
    else
      sprite = (updown > 0) ? sprites[IMAGES.PLAYER_UPHILL_STRAIGHT] : sprites[IMAGES.PLAYER_STRAIGHT];

    renderSprite(sprite, GAME_VARIABLES.cameraDepth / this.z, destX, destY, this.playerOffset, this.playerY);
  }

  update(dt, currentSegment, totalTrackLength) {

    this.updatePosition(dt, totalTrackLength);

    this.updateSpeed(this.ACCEL, dt);

  }
}