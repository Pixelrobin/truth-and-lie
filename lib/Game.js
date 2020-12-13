const { v4: uuidv4 } = require('uuid');

class Game {
    constructor() {
        this.choices = {};
    }

    playerExists(id) {
        if (typeof id !== 'string') return false;
        return id in this.choices;
    }

    createPlayer() {
        const id = uuidv4();
        this.choices[id] = null;
        return id;
    }

    setPlayerChoice(id, choice) {
        if (!this.playerExists(id)) {
            throw new Error('Player ID not found.');
        }

        if (choice !== 'a' && choice !== 'b') {
            throw new Error('Invalid choice');
        }

        console.log(this.choices);
        this.choices[id] = choice;
    }
}

module.exports = Game;
