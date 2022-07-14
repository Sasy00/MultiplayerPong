module.exports.Player = Player;
function Player(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.input = 0;     //+1 goes down, -1 goes up, 0 is neutral
    this.score = 0;

    /**
     * @param {number} x
     */
    this.setInput = function (x) {
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

    this.getPosition = function () { return { x: this.x, y: this.y }; }
    this.setPosition = function (pos) { this.x = pos.x; this.y = pos.y; }

    this.update = function () {
        this.y += this.input;
    }

    this.incrementScore = function () {
        this.score++;
    }
    this.resetScore = function () {
        this.score = 0;
    }
}