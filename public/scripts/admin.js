import { updatePageData } from './lib.js';

const socket = io();

socket.on('game', updatePageData);

const secret = 'pleasedonthackme'; // sssshhhhhh
const forms = document.querySelectorAll('form');

for (const form of forms) {
    form.addEventListener('submit', event => {
        const formData = new FormData(form);
        const data = { secret };

        formData.forEach(function(value, key){
            data[key] = value;
        });

        event.preventDefault();

        const request = fetch(form.action, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        request
            .then(res => res.text())
            .then(data => {
                console.log(data);
            });
    });
}

const clearButton = document.getElementById('clear');

clearButton.addEventListener('click', e => {
    fetch('/clear', {
        method: 'POST',
        body: JSON.stringify({ secret }),
        headers: {
            'Content-Type': 'application/json'
        }
    });
});
