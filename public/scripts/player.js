const buttons = document.querySelectorAll('button');
console.log(buttons);

function setDisabled(disabled) {
    for (const button of buttons) {
        disabled ? button.setAttribute('disabled', true) : button.removeAttribute('disabled');
    }
}

function setCurrentButton(choice) {
    const existing = document.querySelector('.current');
    if (existing) {
        existing.classList.remove('current');
    }

    const current = document.querySelector('[data-choice=' + choice + '}]');
    if (current) {
        current.classList.add('current');
    }
}

function sendChoice(e) {
    const button = e.target;
    const choice = button.getAttribute('data-choice');

    setDisabled(true);

    const request = fetch('/submit', {
        method: 'POST',
        body: JSON.stringify({ choice: choice }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    
    request
        .then(res => res.json())
        .then(data => {
            setCurrentButton(data.choice)
            setDisabled(false);
        })
}

for (const button of buttons) {
    button.addEventListener('click', sendChoice);
}