class Ball {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.speed = 1;
    }

    get position() {
        return { x: this.x, y: this.y }
    }

    set position(pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    get velocity() {
        return { x: this.vx, y: this.vy };
    }

    set velocity(vel) {
        //normalizes the vector, add it if you want
        //let vlen = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
        let vlen = 1;
        this.vx = vel.x / vlen;
        this.vy = vel.y / vlen;
    }

    flipVX() {
        this.vx *= -1;
    }

    flipVY() {
        this.vy *= -1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
}