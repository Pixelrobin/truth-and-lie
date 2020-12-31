class Scorekeeper {
    constructor() {
        this.scores = {};

        const tableCount = parseInt(process.env.TABLE_COUNT, 10);

        for (let t = 1; t <= tableCount; t ++) {
            this.scores[t] = 0;
        }
    }

    addScores(table, score) {
        const tableString = table.toString();

        if (!(tableString in this.scores)) {
            throw new Error('Table not found');
        }

        this.scores[tableString] += score;
    }

    getShowScores() {
        return !Object.values(this.scores).every(score => score === 0);
    }

    getScoresRanked() {
        return Object.keys(this.scores)
            .filter((key) => this.scores[key] > 0)
            .sort((a, b) => this.scores[b] - this.scores[a])
            .slice(0, 3)
            .map((key) => ({ table: key, score: this.scores[key] }))
    }

    getScores() {
        return {
            showScores: this.getShowScores(),
            scores: this.getScoresRanked()
        };
    }
}

module.exports = Scorekeeper;
