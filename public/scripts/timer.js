import { updatePageData } from './lib.js';

const socket = io();
socket.on('game', updateTimer);
socket.on('standby', hideTimer)

const timerElement = document.getElementById('timer');
const timerTextElement = document.getElementById('timer-text');

function updateTimer(data) {
    timerElement.removeAttribute('hidden');

    timerTextElement.classList.toggle('blink', data.time <= 0);
    updatePageData(data);
}

function hideTimer() {
    timerElement.setAttribute('hidden', true);
}
