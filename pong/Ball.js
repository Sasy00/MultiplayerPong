module.exports.Ball = Ball;
function Ball(x, y) {
    this.x = x;
    this.y = y;
    this.vx = 0;
    this.vy = 0;
    this.speed = 1;

    this.getPosition = function () {
        return { x: this.x, y: this.y }
    }
    this.setPosition = function (pos) {
        this.x = pos.x;
        this.y = pos.y;
    }

    /**
     * @param {{ x: number; y: number; }} vel
     */
    this.setVelocity = function (vel) {
        //normalizes the vector, add it if you want
        //let vlen = Math.sqrt(vel.x * vel.x + vel.y * vel.y);
        let vlen = 1;
        this.vx = vel.x / vlen;
        this.vy = vel.y / vlen;
    }
    this.getVelocity = function () {
        return { x: this.vx, y: this.vy };
    }

    this.flipVY = function () {
        this.vy *= -1;
    }
    this.flipVX = function () {
        this.vx *= -1;
    }

    this.update = function () {
        this.x += this.vx;
        this.y += this.vy;
    }
}