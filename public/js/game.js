/**
 * emits:
 *      'playMove'
 */
var cvs;
var ctx;
//var playersList;

const socket = io();

const paddleHeight = 64;
const paddleWidth = 8;
const ballRadius = 8;

const FPS = 60

var pressedKeys = {};


const K_UP = 87;
const K_DOWN = 83;

var started = false;
var countdown = 0;


var gameState = {
    ball: { x: 0, y: 0 },
    p1: { paddle: { x: 0, y: 0 }, score: 0 },
    p2: { paddle: { x: 0, y: 0 }, score: 0 },
};

window.onload = function () {
    cvs = document.getElementById('GameCanvas');
    ctx = cvs.getContext('2d');

    window.onkeyup = function (e) { pressedKeys[e.keyCode] = false; console.log(e.keyCode) }
    window.onkeydown = function (e) { pressedKeys[e.keyCode] = true; console.log(e.keyCode) }

    playersList = document.getElementById('playersList');
    socket.on('start', (state) => {
        gameState = state;
        started = true;
    });
    socket.on('countdown', (x) => {
        countdown = x;
    });
    socket.on('update', (state) => {
        gameState = state;
    })
    socket.emit('ready');
    setInterval(() => {
        let input = userInput();
        update(input);
        draw();
    }, 1 / (FPS * 1000));
}

function userInput() {
    let move = 0;
    if (pressedKeys[K_UP]) {
        move -= 1;
    }
    if (pressedKeys[K_DOWN]) {
        move += 1;
    }
    console.log(move);
    return move;
}

function update(move) {
    if (!started) {
        return;
    }
    socket.emit('playMove', move);
}

function draw() {
    if (!started) {
        print(ctx, cvs.width / 2, cvs.height / 2, 'waiting second player', 'white');
        return;
    }
    if (countdown) {
        print(ctx, cvs.width / 2, 100, countdown, 'white');
    }
    rect(ctx, 0, 0, cvs.width, cvs.height, 'black');

    circle(ctx, gameState.ball.x, gameState.ball.y, ballRadius, 'red');
    rect(ctx, gameState.p1.paddle.x, gameState.p1.paddle.y, paddleWidth, paddleHeight, 'green');
    rect(ctx, gameState.p2.paddle.x, gameState.p2.paddle.y, paddleWidth, paddleHeight, 'green');
    print(ctx, cvs.width / 2 - 60, 20, gameState.p1.score, 'yellow');
    print(ctx, cvs.width / 2 + 60, 20, gameState.p2.score, 'yellow');
}

function circle(ctx, x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
}

function rect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function print(ctx, x, y, msg, color) {
    ctx.fillStyle = color;
    ctx.font = '20px serif';
    ctx.fillText(msg, x, y);
}
