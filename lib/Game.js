const EventEmitter = require('events');
const { v4: uuidv4 } = require('uuid');

const GAME_STATES = {
    RUNNING: 1,
    RESULT: 2,
    FOOLED: 3
}

class Game extends EventEmitter {
    constructor(config, length) {
        super();

        this.config = config;
        this.choices = {};
        this.result = '';

        this.timeStart = new Date();
        this.gameState = GAME_STATES.RUNNING;
        this.id = uuidv4();
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
        if (this.gameState !== GAME_STATES.RUNNING) {
            throw new Error('Game not running.');
        }

        if (!this.playerExists(id)) {
            throw new Error('Player ID not found.');
        }

        if (choice !== 'a' && choice !== 'b') {
            throw new Error('Invalid choice.');
        }

        this.choices[id] = choice;
    }

    setResult(result, config) {
        if (this.gameState !== GAME_STATES.RUNNING) {
            throw new Error('Game not running.');
        }

        if (result !== 'a' && result !== 'b') {
            throw new Error('Invalid result.');
        }

        if (config.a) this.config.a = config.a;
        if (config.b) this.config.b = config.b;

        this.result = result;
        this.gameState = GAME_STATES.RESULT;
    }

    end() {
        if (this.gameState !== GAME_STATES.RESULT) {
            throw new Error('Game not in results.');
        }

        this.gameState = GAME_STATES.FOOLED;

        return {
            table: this.config.table,
            score: this.getPercentFooled()
        }
    }

    getRemainingTime() {
        if (this.gameState !== GAME_STATES.RUNNING) {
            return 0;
        }

        const now = new Date();
        const difference = now.getTime() - this.timeStart.getTime();
        const seconds = difference / 1000;
        return Math.ceil(Math.max(0, process.env.ROUND_LENGTH - seconds));
    }

    getChoiceCounts() {
        const choiceCounts = Object.values(this.choices).reduce(
            (counts, choice) => {
                counts[choice] ++
                return counts
            },
            { a: 0, b: 0 }
        );

        return choiceCounts;
    }

    getTotalChoices() {
        return Object.keys(this.choices).length;
    }

    getPercentFooled() {
        if (this.result.length === 0) return 0;

        const falseResult = this.result === 'a' ? 'b' : 'a';

        const choiceCounts = this.getChoiceCounts();
        const total = this.getTotalChoices();

        if (total === 0) return 0;

        const count = choiceCounts[falseResult];
        return Math.floor(count / total * 100);
    }

    getState() {
        const counts = this.getChoiceCounts();

        return {
            state: this.gameState,
            result: this.config[this.result],
            time: this.getRemainingTime(),
            a: this.config.a || '',
            b: this.config.b || '',
            table: this.config.table,
            percent: this.getPercentFooled(),
            aCount: counts.a,
            bCount: counts.b,
            totalChoices: this.getTotalChoices(),
            gameId: this.id
        };
    }
}

module.exports = Game;
