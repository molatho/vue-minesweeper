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
import FieldGenerator from "../scripts/field-generator";

export default {
  name: "Board",
  components: { Field },
  props: ["config", "stats"],
  data: function() {
    return {
      generator: null
    };
  },
  computed: {
    fields: function() {
      if (!this.generator) return [];
      return this.generator.fields;
    },
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
    rows: function() {
      return this.config.rows;
    },
    columns: function() {
      return this.config.columns;
    }
  },
  watch: {
    rows: function(newVal, oldVal) {
      this.resize(this.columns, this.columns, oldVal, newVal);
    },
    columns: function(newVal, oldVal) {
      this.resize(oldVal, newVal, this.rows, this.rows);
    },
    config: {
      immediate: true,
      //deep: true,
      handler: function(newVal) {
        if (newVal) {
          this.generator = new FieldGenerator(newVal);
          this.reset();
        }
      }
    }
  },
  mounted: function() {
    //this.reset();
    window.addEventListener("keydown", e => {
      if (e.code == "Space") {
        e.preventDefault();
        this.reset();
      }
    });
  },
  methods: {
    reset: function(newSeed) {
      if (newSeed) this.generator.setRandomSeed();
      this.generator.generateFields();
      this.resetStats();
    },
    resize: function(oldColumns, newColumns, oldRows, newRows) {
      this.generator.resize(oldColumns, newColumns, oldRows, newRows);
      if (this.stats.state == "running") this.generator.generateMines();
    },
    resetStats: function() {
      this.stats.state = "new";
      this.stats.mines = this.fields.filter(f => f.isMine).length;
      this.stats.opened = this.fields.filter(f => f.state == "opened").length;
      this.stats.flags = this.fields.filter(f => f.state == "flagged").length;
      this.stats.numFields = this.fields.length;
    },
    onFieldClicked: function(field) {
      if (this.stats.state == "new") {
        this.stats.state = "running";
        this.generator.generateMines(field.idx);
        this.stats.mines = this.fields.filter(f => f.isMine).length;
      }
      if (this.stats.state == "running") {
        if (field.state == "default") {
          field.fieldData.state = "opened";
        }
      }
    },
    hasWon: function() {
      return (
        this.stats.opened == this.fields.length - this.stats.mines &&
        this.stats.opened + this.stats.flags == this.fields.length &&
        this.stats.mines == this.stats.flags
      );
    },
    setLost: function(mineField) {
      if (this.stats.state == "running") {
        this.stats.state = "lost";
        this.$emit("hitMine", mineField);
        for (var idx in this.fields)
          if (this.fields[idx].isMine) this.fields[idx].state = "opened";
      }
    },
    onFieldOpened: function(field) {
      this.stats.opened++;

      if (this.stats.state != "running") return;
      if (field.isMine) return this.setLost(field);

      if (field.mines == 0) {
        var neighbours = this.generator.getFieldsAround(field.x, field.y);
        for (var n in neighbours) {
          if (!neighbours[n].isMine)
            this.fields[neighbours[n].idx].state = "opened";
        }
      }
      if (this.hasWon()) {
        this.stats.state = "won";
        this.$emit("won");
      }
    },
    onFieldFlagged: function(field) {
      if (this.stats.state != "running") return;

      field.fieldData.state = "flagged";
      this.stats.flags++;

      if (this.hasWon()) {
        this.stats.state = "won";
        this.$emit("won");
      }
    },
    onFieldUnflagged: function(field) {
      if (this.stats.state != "running") return;

      field.fieldData.state = "default";
      this.stats.flags--;

      if (this.hasWon()) {
        this.stats.state = "won";
        this.$emit("won");
      }
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