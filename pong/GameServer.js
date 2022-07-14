const socketio = require('socket.io');
const EventEmitter = require('events');

const { GameState } = require('./GameState');

const ticks = 64;

var io;

function module(x) {
    return x >= 0 ? x : -x;
}

var players = [];

exports.init = (sio) => {
    io = sio;
    let state = new GameState(io);
    io.on('connection', (socket) => {
        console.log(`connection ${socket.id}`);
        socket.on('disconnect', () => {
            console.log(`disconnection ${socket.id}`);
        });
        socket.on('playMove', (move) => {
            state.setInput(socket.id, move);
        });
        socket.on('ready', () => {
            players.push(socket.id);
            if (players.length == 2) {
                state.addPlayer(players.pop());
                state.addPlayer(players.pop());
                state.resetPositions();
                state.start();
                setInterval(() => {
                    state.update();
                }, 1000 / ticks);
            }
        });
    });
}