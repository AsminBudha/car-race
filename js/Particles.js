class Particles {

    constructor(x, y, radius, rgb_string, vx, vy) {
        this.radius = radius;
        this.reset(x, y, rgb_string, vx, vy);

    }

    reset(x, y, rgb_string, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.rgb_string = rgb_string;
        this.a = 0.5;
    }

    get color() {
        return "rgba(" + this.rgb_string + "," + this.a + ")";
    }

    updatePosition() {
        this.a -= 0.05;
        this.x -= this.vx * 2;
        this.y -= this.vy * 2;
    }

    draw() {
        GAME_VARIABLES.ctx.beginPath();
        GAME_VARIABLES.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        GAME_VARIABLES.ctx.fillStyle = this.color;
        GAME_VARIABLES.ctx.fill();
        GAME_VARIABLES.ctx.closePath();
    }

    // drawPath() {
    //     // this.context.clearRect(0,0,this.canvas.clientWidth,this.canvas.height)
    //     this.context.beginPath();
    //     // this.context.fillRect(this.x, this.y, 5, 5);
    //     this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    //     this.context.fillStyle = this.color;
    //     this.context.fill();
    //     this.context.closePath();
    // }

}
