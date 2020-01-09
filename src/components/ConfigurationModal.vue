<template>
  <b-modal :id="id" ok-only title="Vue-Sweeper Configuration">
    <b-container>
      <b-row>
        <b-col sm="4">
          <label for="mineDensity">Mines: {{ parseInt(config.mineDensity * 100) }}%</label>
        </b-col>
        <b-col sm="8">
          <b-form-input
            id="mineDensity"
            v-model="config.mineDensity"
            type="range"
            min="0"
            max="1"
            step="0.01"
          ></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="4">
          <label for="columns">Dimensions:</label>
        </b-col>
        <b-col sm="1"></b-col>
        <b-col sm="3">
          <b-form-input
            id="columns"
            v-model="config.columns"
            type="number"
            min="1"
            max="100"
            step="1"
          ></b-form-input>
        </b-col>
        <b-col sm="1">x</b-col>
        <b-col sm="3">
          <b-form-input id="rows" v-model="config.rows" type="number" min="1" max="100" step="1"></b-form-input>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="4">
          <label for="seed">Seed:</label>
        </b-col>
        <b-col sm="8">
          <b-form inline>
            <b-form-input id="seed" v-model="config.seed" type="text"></b-form-input>
            <b-button @click="assignRandomSeed">
              <font-awesome-icon icon="dice"></font-awesome-icon>
            </b-button>
          </b-form>
        </b-col>
      </b-row>
      <b-row>
        <b-col sm="4">
          <label for="b64">B64:</label>
        </b-col>
        <b-col sm="8">
          <b-form-input id="b64" v-model="b64" type="text" :readonly="true"></b-form-input>
        </b-col>
      </b-row>
    </b-container>
  </b-modal>
</template>

<script>
import SentenceGenerator from "../scripts/sentence-generator";

export default {
  name: "ConfigurationModal",
  props: ["id", "config"],
  computed: {
    b64: function() {
      return btoa(JSON.stringify(this.config));
    },
    cseed: {
      get: function() { return this.config.seed; },
      set: function(s) { this.config.seed = s; }
    }
  },
  data: function() {
    return {
      sentenceGenerator: new SentenceGenerator()
    };
  },
  methods: {
    assignRandomSeed: function() {
      this.$nextTick().then(() => {
        this.config.seed = this.sentenceGenerator.getRandomSentence();
      });
    }
  }
};
</script>

<style>
</style>