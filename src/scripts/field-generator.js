const MersenneTwister = require('mersenne-twister');
const SentenceGenerator = require('./sentence-generator');

class FieldGenerator {
    constructor(config) {
        this.config = config;
        this.twister = new MersenneTwister(this.config.seed);
        this.fields = this.generateFields();
        this.sentenceGenerator = new SentenceGenerator();

        if (this.config == undefined) throw new Error('Config required');
        //if (this.config.seed == undefined)
        this.setRandomSeed();
    }

    generateFields() {
        //Reset twister!
        this.setSeed(this.config.seed);
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
        if (x >= 0 && x < this.config.columns && y >= 0 && y < this.config.rows)
            return this.fields[y * this.config.columns + x];
        return null;
    }
    resize(oldColumns, newColumns, oldRows, newRows) {
        var _fields = [];
        for (var y = 0; y < newRows; y++) {
            for (var x = 0; x < newColumns; x++) {
                var field = this.fields.filter(f => f.y == y && f.x == x)[0];
                if (!field)
                    field = {
                        state: "default",
                        isMine: false,
                        mines: 0,
                        x: x,
                        y: y,
                        idx: y * newColumns + x
                    };
                _fields.push(field);
            }
        }
        this.fields = _fields;
    }
    setRandomSeed() {
        this.setSeed(this.sentenceGenerator.getRandomSentence());
    }
    setSeed(seed) {
        if (!seed)
            seed = this.sentenceGenerator.getRandomSentence();
        
        this.config.seed = seed;
        var h = 0, l = seed.length, i = 0;
        if (l > 0)
            while (i < l)
                h = (h << 5) - h + seed.charCodeAt(i++) | 0;
        this.twister.init_seed(h);
    }
}

module.exports = FieldGenerator;