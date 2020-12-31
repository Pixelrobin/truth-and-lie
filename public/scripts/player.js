const buttons = document.querySelectorAll('button');

let timeout = -1;

function resetCurrent() {
    const existing = document.querySelectorAll('.current');
    for (const element of existing) {
        element.classList.remove('current');
    }
}

function setDisabled(disabled) {
    for (const button of buttons) {
        disabled ? button.setAttribute('disabled', true) : button.removeAttribute('disabled');
    }
}

function setCurrentButton(choice) {
    resetCurrent();

    const current = document.querySelector('[data-choice="' + choice + '"]');
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
    });
    
    request
        .then(res => res.json())
        .then(data => {
            setDisabled(false);
            resetCurrent();

            if ('error' in data) return;

            if (data.remaining) {
                setCurrentButton(data.choice);
                clearTimeout(timeout);
                timeout = setTimeout(resetCurrent, data.remaining * 1000)
            }
        })
}

for (const button of buttons) {
    button.addEventListener('click', sendChoice);
}
