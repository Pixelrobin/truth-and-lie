const path = require('path');
const http = require('http');

const express = require('express');
const socket = require('socket.io');
const cookies = require('cookie-parser');
const parser = require('body-parser');

const Game = require('./Game');
const Scorekeeper = require('./Scorekeeper');

const COOKIE_AGE = 1000 * 60 * 60; // 1 hour

const scorekeeper = new Scorekeeper();
let game = null;

function getView(name) {
    return path.resolve(__dirname, '../views/' + name + '.html');
}

function tick() {
    if (game !== null) {
        return io.of('/').emit('game', game.getState());
    }

    return io.of('/').emit('standby', scorekeeper.getScores());
}

function validateSecret(secret) {
    // Really weak security but it's good enough for this
    return secret === 'pleasedonthackme';
}

setInterval(tick, 100);

const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(express.static('public'));
app.use(express.static('node_modules/socket.io/client-dist'));
app.use(cookies());
app.use(parser.json());

app.get('/', (req, res) => {
    res.sendFile(getView('index'));
});

app.get('/game', (req, res) => {
    res.sendFile(getView('game'));
});

app.get('/controls', (req, res) => {
    res.sendFile(getView('admin'));
});

app.get('/timer', (req, res) => {
    res.sendFile(getView('timer'));
})

app.post('/submit', (req, res) => {
    let playerId = req.cookies.playerId;
    let choice = req.body.choice;
    let created = false;

    if (!game) {
        return res.status(400).send({ error: 'No Game running.' })
    }

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
        res.send({ created, choice, playerId, remaining: game.getRemainingTime() });
    } catch (error) {
        return res.status(400).send({ error: error.message });
    }
});

/** Start the game */
app.post('/start', (req, res) => {
    const { a, b, table, secret } = req.body;

    const tableInt = parseInt(table, 10);

    const checks = [
        validateSecret(secret),
        !!a,
        !!b,
        !!tableInt && !isNaN(tableInt)
    ];

    if (checks.some(check => !check)) {
        return res.status(400).send('Invalid Request');
    }

    if (game) {
        game = null;
    }

    game = new Game(
        { table: tableInt, a, b },
        process.env.ROUND_LENGTH
    );

    res.send('done');
});

/** End the game and show a result */
app.post('/result', (req, res) => {
    const { a, b, result, secret } = req.body;

    if (!validateSecret(secret)) {
        return res.status(400).send('Invalid Request');
    }

    if (!game) {
        return res.status(400).send('No Game Running');
    }

    game.setResult(result, { a, b });

    res.send('done');
});

/** Complete the game and apply scores */
app.post('/end', (req, res) => {
    const { secret } = req.body;

    if (!validateSecret(secret)) {
        return res.status(400).send('Invalid Request');
    }

    if (!game) {
        return res.status(400).send('No Game Running');
    }

    const { table, score } = game.end();
    scorekeeper.addScores(table, score);

    res.send('done');
});

app.post('/clear', (req, res) => {
    const { secret } = req.body;

    if (!validateSecret(secret)) {
        return res.status(400).send('Invalid Request');
    }

    game = null;

    res.send('done');
});

module.exports = server;
