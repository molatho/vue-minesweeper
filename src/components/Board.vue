<template>
  <div>
    <div v-if="hasFields" class="board">
      <div class="fieldRow" v-for="row in fieldRows" :key="fieldRows.indexOf(row)">
        <Field
          v-for="f in row"
          :key="f.idx"
          :fieldData="f"
          v-on:opened="onFieldOpened"
          v-on:flagged="onFieldFlagged"
          v-on:unflagged="onFieldUnflagged"
          v-on:clicked="onFieldClicked"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Field from "./Field.vue";
import FieldGenerator from '../scripts/field-generator';

export default {
  name: "Board",
  components: { Field },
  props: ["config", "mineDensity", "columns", "rows", "stats"],
  data: function() {
    return {
      fields: null
    };
  },
  computed: {
    fieldRows: function() {
      var _rows = [];
      var _currentRow = [];
      for (var i = 0; i < this.fields.length; i++) {
        if (i > 0 && i % this.columns == 0) {
          _rows.push(_currentRow);
          _currentRow = [];
        }
        _currentRow.push(this.fields[i]);
      }
      _rows.push(_currentRow);
      return _rows;
    },
    hasFields: function() {
      return this.fields && this.fields.length > 0;
    },
    generator: function() {
      return new FieldGenerator(this.config)
    }
  },
  watch: {
    rows: function(newVal, oldVal) {
      this.resize(this.columns, this.columns, oldVal, newVal);
    },
    columns: function(newVal, oldVal) {
      this.resize(oldVal, newVal, this.rows, this.rows);
    }
  },
  mounted: function() {
      this.reset();
      window.addEventListener('keydown', (e) => {
        if (e.code == 'Space') {
          e.preventDefault();
          this.reset();
        }
      });
  },
  methods: {
    reset: function() {
        this.generateFields();
        this.resetStats();
    },
    resize: function(oldColumns, newColumns, oldRows, newRows) {
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
      if (this.stats.state == 'running')
        this.generateMines();
    },
    generateMines: function(clickField) {
      // Put mines
      var currentMines = this.fields.filter(f => f.isMine).length;
      var maxMines = parseInt(this.fields.length * this.mineDensity);
      var numMines = 0;

      do {
        var idx = parseInt(Math.random() * this.fields.length);
        if (
          this.fields[idx].isMine || 
          this.fields[idx].state == "opened" || 
          idx == clickField.idx)
          continue;
        this.fields[idx].isMine = true;
        numMines++;
      } while (numMines < maxMines - currentMines);
      
      this.stats.mines = this.fields.filter(f => f.isMine).length;
      this.calculateNeighbours(); 
    },
    generateFields: function() {
      var _fields = [];
      for (var y = 0; y < this.rows; y++) {
        for (var x = 0; x < this.columns; x++) {
          _fields.push({
            state: "default",
            isMine: false,
            mines: 0,
            x: x,
            y: y,
            idx: y * this.columns + x
          });
        }
      }
      this.fields = _fields;
    },
    resetStats: function() {
      this.stats.state = 'new';
      this.stats.mines = this.fields.filter(f => f.isMine).length;
      this.stats.opened = this.fields.filter(f => f.state == "opened").length;
      this.stats.flags = this.fields.filter(f => f.state == "flagged").length;
      this.stats.numFields = this.fields.length;
    },
    calculateNeighbours: function() {
      // Calculate neighbours
      for (var idx = 0; idx < this.fields.length; idx++) {
        if (this.fields[idx].isMine) continue;
        this.fields[idx].mines = this.getFieldsAround(
          this.fields[idx].x,
          this.fields[idx].y
        ).filter(f => f.isMine).length;
      }
    },
    onFieldClicked: function(field) {
      if (this.stats.state == 'new') {
        this.stats.state = 'running';
        this.generateMines(field);
      }
      if (this.stats.state == 'running') {
        if (field.state == 'default') {
          field.fieldData.state = 'opened';
        }
      }
    },
    hasWon: function() {
      return this.stats.opened == this.fields.length - this.stats.mines &&
        this.stats.opened + this.stats.flags == this.fields.length &&
        this.stats.mines == this.stats.flags;
    },
    setLost: function(mineField) {
      if (this.stats.state == 'running') {
        this.stats.state = 'lost';
        this.$emit('hitMine', mineField);
        for (var idx in this.fields)
          if (this.fields[idx].isMine) this.fields[idx].state = 'opened';  
      }
    },
    onFieldOpened: function(field) {
      this.stats.opened++;

      if (this.stats.state != 'running') return;
      if (field.isMine) return this.setLost(field);
      
      if (field.mines == 0) {
        var neighbours = this.getFieldsAround(field.x, field.y);
        for (var n in neighbours) {
          if (!neighbours[n].isMine)
            this.fields[neighbours[n].idx].state = "opened";
        }
      }
      if (this.hasWon()) {
        this.stats.state = 'won';
        this.$emit('won');
      }
    },
    onFieldFlagged: function(field) {
      if (this.stats.state != 'running')
        return;

      field.fieldData.state = 'flagged';
      this.stats.flags++;
      
      if (this.hasWon()) {
        this.stats.state = 'won';
        this.$emit('won');
      }
    },
    onFieldUnflagged: function(field) {
      if (this.stats.state != 'running')
        return;
      
      field.fieldData.state = 'default';
      this.stats.flags--;

      if (this.hasWon()) {
        this.stats.state = 'won';
        this.$emit('won');
      }
    },
    getFieldAt: function(x, y) {
      //, wrap) {
      if (x >= 0 && x < this.columns && y >= 0 && y < this.rows)
        return this.fields[y * this.columns + x];
      return null;
    },
    getFieldsAround: function(x, y) {
      var neighbours = [
        this.getFieldAt(x - 1, y - 1),
        this.getFieldAt(x, y - 1),
        this.getFieldAt(x + 1, y - 1),
        this.getFieldAt(x - 1, y),
        this.getFieldAt(x + 1, y),
        this.getFieldAt(x - 1, y + 1),
        this.getFieldAt(x, y + 1),
        this.getFieldAt(x + 1, y + 1)
      ].filter(f => f != null);

      return neighbours;
    }
  }
};
</script>

<style>
.fieldRow {
  background-color: #fff;
  display: flex;
}
.board {
  display: inline-block;
}
</style>