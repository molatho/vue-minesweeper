<template>
  <div id="app">
    <b-container>
      <b-row>
        <b-col class="logo">
         Vue-Sweeper
         <font-awesome-icon icon="bomb" class="lost" v-if="this.stats.state == 'lost'"/>
         <font-awesome-icon icon="flag" class="won" v-if="this.stats.state == 'won'"/>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <Board ref="board" id="board" :config="this.config" :rows="this.config.rows" :columns="this.config.columns" :mineDensity="this.config.mineDensity" :stats="stats" />
          </b-col>
      </b-row>
      <b-row>
        <b-col>
          <game-stats :stats="stats" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button
            v-if="this.stats.state =='running'"
            v-on:click='$refs["board"].reset()'>
          Reset</b-button>
          <b-button
            v-if="this.stats.state == 'lost' || this.stats.state == 'won'"
            v-on:click='$refs["board"].reset()'>
          New Game</b-button>
        </b-col>
        <b-col>
          <b-button size="sm" v-b-modal.settings><font-awesome-icon icon="cog"/></b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-modal id="settings" ok-only title="Vue-Sweeper Configuration">
      <b-container>
        <b-row>
          <b-col sm="5">
            <label for="mineDensity">Mine-Density: {{ parseInt(config.mineDensity * 100) }}%</label>
          </b-col>
          <b-col sm="7">
            <b-form-input id="mineDensity" v-model="config.mineDensity" type="range" min="0" max="1" step="0.01"></b-form-input>
          </b-col>
        </b-row>
        <b-row>
          <b-col sm="5">
            <label for="columns">Dimensions:</label>
          </b-col>
          <b-col sm="3">
            <b-form-input id="columns" v-model="config.columns" type="number" min="1" max="100" step="1"></b-form-input>
          </b-col>
          <b-col sm="1">
            x
          </b-col>
          <b-col sm="3">
            <b-form-input id="rows" v-model="config.rows" type="number" min="1" max="100" step="1"></b-form-input>
          </b-col>
        </b-row>
      </b-container>
    </b-modal>
  </div>
</template>

<script>
import Board from "./components/Board.vue";
import GameStats from "./components/GameStats.vue";

export default {
  name: "app",
  components: {
    Board,
    GameStats
  },
  data: function() {
    return {
      stats: {
        flags: 0,
        opened: 0,
        mines: 0,
        numFields: 0,
        state: 'new'
      },
      config: {
        columns: 10,
        rows: 10,
        mineDensity: 0.15
      }
    };
  },
  mounted: function() {}
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

.logo {
  font-size: 200%;
  margin-bottom: 0.7em;
}

.won {
  color: #0A0;
}

.lost {
  color: #A00;
}
</style>
