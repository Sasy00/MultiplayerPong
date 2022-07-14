module.exports.GameState = GameState;

const { Player } = require('./Player');
const { Ball } = require('./Ball');

const width = 800;
const height = 600;
const ballRadius = 8;
const paddleHeight = 64;
const paddleWidth = 8;
const gamePoints = 7;
const bounceAngle = 10;

function GameState(sio) {
    this.io = sio;
    this.players = new Map();                   //socketID -> Player
    this.gameIDtoSocketID = new Map();          //gameID -> socketID
    this.ball = new Ball(width / 2, height / 2);

    this.addPlayer = function (id) {
        if (this.players.size === 0) {
            this.players.set(id, new Player(id, 0, height / 2 - paddleHeight / 2));
            this.gameIDtoSocketID.set(0, id);
        }
        else if (this.players.size === 1) {
            this.players.set(id, new Player(id, width - paddleWidth, height / 2 - paddleHeight / 2));
            this.gameIDtoSocketID.set(1, id);
        }
    }

    this.update = function () {
        for (const [id, player] of this.players) {
            player.update();
        }
        this.ball.update();

        //check for collisions
        if (this.ball.getPosition().y <= 0) {
            this.ball.flipVY(); //bounce
            let currPosition = this.ball.getPosition();
            currPosition.y = ballRadius;
            this.ball.setPosition(currPosition);
        }
        else if (this.ball.getPosition().y >= height) {
            this.ball.flipVY(); //bounce
            let currPosition = this.ball.getPosition();
            currPosition.y = height - ballRadius;
            this.ball.setPosition(currPosition);
        }

        if (this.ball.getPosition().x <= 0) {
            //who is the player on the left? aka gameID == 0
            //basically we need to find who is player 0, so we use the composed function
            //gameID=>socketID=>Player === gameID=>Player
            let leftPlayer = this.players.get(this.gameIDtoSocketID.get(0));
            if (this.ball.getPosition().y > leftPlayer.getPosition().y && this.ball.getPosition().y < leftPlayer.getPosition().y + paddleHeight) {
                //bounce with player
                this.ball.flipVX();
                let currPosition = this.ball.getPosition();
                currPosition.x = paddleWidth + ballRadius;
                let distanceFromCentreOfPaddle = this.ball.getPosition().y - ((paddleHeight / 2) + leftPlayer.getPosition().y);
                this.ball.setVelocity({
                    x: this.ball.getVelocity().x,
                    y: distanceFromCentreOfPaddle * bounceAngle / (paddleHeight / 2)
                });
            } else {
                //right scored
                let rightPlayer = this.players.get(this.gameIDtoSocketID.get(1));
                rightPlayer.incrementScore();
                this.resetPositions();
                this.ball.setVelocity({ x: -1, y: 0 });
            }
        }
        else if (this.ball.getPosition().x >= width) {
            //look the precedent if 
            let rightPlayer = this.players.get(this.gameIDtoSocketID.get(1));
            if (this.ball.getPosition().y > rightPlayer.getPosition().y && this.ball.getPosition().y < rightPlayer.getPosition().y + paddleHeight) {
                //bounce with player
                this.ball.flipVX();
                let currPosition = this.ball.getPosition();
                currPosition.x = width - (paddleWidth + ballRadius);
                let distanceFromCentreOfPaddle = this.ball.getPosition().y - ((paddleHeight / 2) + rightPlayer.getPosition().y);
                this.ball.setVelocity({
                    x: this.ball.getVelocity().x,
                    y: distanceFromCentreOfPaddle * bounceAngle / (paddleHeight / 2)
                });
            }
            else {
                //left scored
                let leftPlayer = this.players.get(this.gameIDtoSocketID.get(0));
                leftPlayer.incrementScore();
                this.resetPositions();
                this.ball.setVelocity({ x: 1, y: 0 });
            }
        }
        //each tick we send the current state to the players.
        for (const [key, id] of this.players) {
            this.io.to(key).emit('update', this.getState());
        }
    }

    this.resetPositions = function () {
        let leftPlayer = this.players.get(this.gameIDtoSocketID.get(0));
        leftPlayer.setPosition({ x: 0, y: height / 2 - paddleHeight / 2 });

        let rightPlayer = this.players.get(this.gameIDtoSocketID.get(1));
        rightPlayer.setPosition({ x: width - paddleWidth, y: height / 2 - paddleHeight / 2 });

        this.ball.setPosition({ x: width / 2, y: height / 2 });
    }

    this.getState = function () {
        let leftPlayer = this.players.get(this.gameIDtoSocketID.get(0));
        let rightPlayer = this.players.get(this.gameIDtoSocketID.get(1));
        let state = {
            ball: { x: this.ball.x, y: this.ball.y },
            p1:
            {
                paddle:
                {
                    x: leftPlayer.x,
                    y: leftPlayer.y
                },
                score: leftPlayer.score
            },
            p2:
            {
                paddle:
                {
                    x: rightPlayer.x,
                    y: rightPlayer.y
                },
                score: rightPlayer.score
            },
        };
        return state;
    }

    this.start = function () {
        for (const [key, id] of this.players) {
            this.io.to(key).emit('start', this.getState());
        }
        this.ball.setVelocity({ x: 1, y: 0 });
    }

    this.setInput = function (id, input) {
        this.players.get(id).setInput(input);
    }
};