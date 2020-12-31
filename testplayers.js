const fetch = require('node-fetch');
require('dotenv').config();

const PLAYER_COUNT = 200;

const bias = Math.random() > 0.5 ? 0.75 : 0.25;

function delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 5000));
}

async function submitChoice() {
    await delay();

    const choice = Math.random() < bias ? 'a' : 'b';

    return fetch(`http://localhost:${ process.env.PORT }/submit`, {
        method: 'POST',
        body: JSON.stringify({ choice: choice }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(data => data.json()).then(console.log);
}

const promises = [];

for (let p = 0; p < PLAYER_COUNT; p ++) {
    promises.push(submitChoice());
}

Promise.all(promises).then(() => {
    console.log('done');
});
