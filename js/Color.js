
class Color {

    constructor(r, g, b) {
        this.r = r; this.g = g; this.b = b;
    }

    getRGBString() {
        return String(this.r + "," + this.g + "," + this.b);
    }

    gradualShift(direction) {
        this.r = Math.floor(Math.abs(Math.cos(direction * 0.75) * 225));
        this.g = Math.floor(Math.abs(Math.sin(direction * 0.25) * 225));
        this.b = Math.floor(Math.abs(Math.sin(direction * 0.5) * 225));
    }
}

let color = new Color(240,191,136);
// let color = new Color(0, 0, 0);