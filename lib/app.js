const path = require('path');
const http = require('http');

const express = require('express');
const socket = require('socket.io');
const cookies = require('cookie-parser');
const parser = require('body-parser');

const Game = require('./Game');

const COOKIE_AGE = 1000 * 60 * 60; // 1 hour

function getView(name) {
    return path.resolve(__dirname, '../views/' + name + '.html');
}

const app = express();

app.use(express.static('public'));
app.use(cookies());
app.use(parser.json());

const game = new Game();

app.get('/', (req, res) => {
    res.sendFile(getView('index'));
});

app.post('/submit', (req, res) => {
    let playerId = req.cookies.playerId;
    let choice = req.body.choice;
    let created = false;

    if (!game.playerExists(playerId)) {
        playerId = game.createPlayer();
        created = true;
        res.cookie('playerId', playerId, {
            maxAge: COOKIE_AGE,
            httpOnly: true
        });
    }

    try {
        game.setPlayerChoice(playerId, choice);
        res.send({ created, choice, playerId });
    } catch (error) {
        return res.status(400).send(error.message);
    }
});


const server = http.createServer(app);
// const io = socket(server);


module.exports = server;
