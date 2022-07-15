
class Player {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.input = 0;     //+1 goes down, -1 goes up, 0 is neutral
        this.score = 0;
    }
    /**
     * @param {number} x
     */
    setInput(x) {
        if (x > 0) {
            this.input = 1;
        }
        else if (x < 0) {
            this.input = -1;
        }
        else {
            this.input = 0;
        }
    }

    get position() { return { x: this.x, y: this.y }; }
    set position(pos) { this.x = pos.x; this.y = pos.y; }

    update() {
        this.y += this.input;
    }

    incrementScore() {
        this.score++;
    }
    resetScore() {
        this.score = 0;
    }
}

module.exports.Player = Player;