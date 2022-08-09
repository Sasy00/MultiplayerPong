const http = require('http');
const express = require('express');
var session = require('express-session');
const game = require('./pong/GameServer.js');
const path = require('path');
const { Server } = require('socket.io');
const { randomBytes } = require('crypto');

const PORT = process.env.PORT || 3000
const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(session({
    secret: randomBytes(256).toString('hex'),
    saveUninitialized: false,
    resave: false
}))
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + '/public')));

var sess;

game.init(io);

app.get('/', (req, res) => {
    sess = req.session;
    res.render('game', { username: 'anon' });
});

server.listen(PORT, () => {
    console.log(`Listening on *:${PORT}`)
});

process.on('SIGINT', function () {
    console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
    io.disconnectSockets();
    server.close((error)=>{
        if(error){
            console.log(error);
        }
        console.log('Http server closed');
        io.close(()=>{
            console.log("io closed");
            process.exit(0);
        })
    })
});