import { updatePageData } from './lib.js';

const socket = io();

const stateElements = document.querySelectorAll('[data-game-state]');
const scoreElement = document.getElementById('scores');
const scoreTextElement = document.getElementById('score-text');
let currentState = -1;

socket.on('game', updateGameState);
socket.on('standby', updateScores);

function setVisibleState(state) {
    if (state === currentState) {
        return;
    }

    for (const element of stateElements) {
        element.setAttribute('hidden', true);
    }

    const element = document.querySelector(`[data-game-state="${ state }"]`);;

    if (element) {
        element.removeAttribute('hidden');
    }

    currentState = state;
}

function updateGameState(data) {
    setVisibleState(data.state);
    updatePageData(data);
}

function updateScores(data) {
    const scores = data.scores;
    const html = scores
        .map(score => `<li><div class="score-table">Table ${ score.table }</div><div class="score-points">${ score.score } points</div></li>`)
        .join('');
    scoreElement.innerHTML = html;
    scoreTextElement.style.display = data.showScores ? 'block' : 'none';
    setVisibleState(0);
}
