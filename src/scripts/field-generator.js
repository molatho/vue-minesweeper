const MersenneTwister = require('mersenne-twister');

class FieldGenerator {
    constructor(data) {
        this.config = data.config;
        this.seed = data.seed;
        if (this.seed == undefined) this.seed = new Date().getTime();
        if (this.config == undefined) throw new Error('Config required');
        this.twister = new MersenneTwister(this.seed);
        this.fields = [];
    }

    generateFields() {
        //Generate fields
        this.fields = [];
        for (var y = 0; y < this.config.rows; y++) {
            for (var x = 0; x < this.config.columns; x++) {
                this.fields.push({
                    state: "default",
                    isMine: false,
                    mines: 0,
                    x: x,
                    y: y,
                    idx: y * this.config.columns + x
                });
            }
        }
    }

    generateFromB64(b64) {
        var data = JSON.parse(atob(b64));
        return this.generate(data.config);
    }

    generateMines(clickFieldIdx) {
        // Put mines
        var currentMines = this.fields.filter(f => f.isMine).length;
        var maxMines = parseInt(this.fields.length * this.config.mineDensity);
        var numMines = 0;

        do {
            var idx = parseInt(this.twister.random() * this.fields.length);
            if (
                this.fields[idx].isMine ||
                this.fields[idx].state == "opened" ||
                idx == clickFieldIdx)
                continue;
            this.fields[idx].isMine = true;
            numMines++;
        } while (numMines < maxMines - currentMines);

        this.calculateNeighbours();
    }
    calculateNeighbours() {
        // Calculate neighbours
        for (var idx = 0; idx < this.fields.length; idx++) {
            if (this.fields[idx].isMine) continue;
            this.fields[idx].mines = this.getFieldsAround(
                this.fields[idx].x,
                this.fields[idx].y
            ).filter(f => f.isMine).length;
        }
    }
    getFieldsAround(x, y) {
        return [
            this.getFieldAt(x - 1, y - 1),
            this.getFieldAt(x, y - 1),
            this.getFieldAt(x + 1, y - 1),
            this.getFieldAt(x - 1, y),
            this.getFieldAt(x + 1, y),
            this.getFieldAt(x - 1, y + 1),
            this.getFieldAt(x, y + 1),
            this.getFieldAt(x + 1, y + 1)
        ].filter(f => f != null);
    }
    getFieldAt(x, y) {
        //, wrap) {
        if (x >= 0 && x < this.config.columns && y >= 0 && y < this.config.rows)
            return this.fields[y * this.config.columns + x];
        return null;
    }
}

module.exports = FieldGenerator;