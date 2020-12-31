import { updatePageData } from './lib.js';

const socket = io();
socket.on('game', updateTimer);
socket.on('standby', hideTimer)

const timerElement = document.getElementById('timer');

function updateTimer(data) {
    timerElement.removeAttribute('hidden');
    updatePageData(data);
}

function hideTimer() {
    timerElement.setAttribute('hidden', true);
}
