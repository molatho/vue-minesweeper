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
          <Board ref="board" id="board" :config="this.config" :stats="stats" />
          </b-col>
      </b-row>
      <b-row>
        <b-col>
          <game-stats :stats="stats" />
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <b-button-group>
            <b-button
              :disabled="this.stats.state != 'running'"
              @click='onResetClicked'>
              Reset</b-button>
            <b-button
              @click='$refs["board"].reset(true)'>
              New Game</b-button>
            <b-button
              :disabled="this.stats.state != 'lost' && this.stats.state != 'won'"
              @click='onReplayClicked'>
              Replay</b-button>
            <b-button size="sm" v-b-modal.settings><font-awesome-icon icon="cog"/></b-button>
          </b-button-group>
        </b-col>
        <!--<b-col>
          <b-button
            v-if="this.stats.state =='running'"
            v-on:click='$refs["board"].reset()'>
          Reset</b-button>
          <b-button
            v-else-if="this.stats.state == 'lost' || this.stats.state == 'won'"
            v-on:click='$refs["board"].reset(true)'>
          New Game</b-button>
        </b-col>
        <b-col>
          <b-button
            v-if="this.stats.state == 'lost' || this.stats.state == 'won'"
            v-on:click='$refs["board"].reset(false)'>
          Replay</b-button>
        </b-col>          
        <b-col>
          <b-button size="sm" v-b-modal.settings><font-awesome-icon icon="cog"/></b-button>
        </b-col>-->
      </b-row>
      <b-row>
        <configuration-modal :id="'settings'" :config="this.config"></configuration-modal>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Board from "./components/Board.vue";
import GameStats from "./components/GameStats.vue";
import ConfigurationModal from "./components/ConfigurationModal.vue";

export default {
  name: "app",
  components: {
    Board,
    GameStats,
    ConfigurationModal
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
        mineDensity: 0.15,
        seed: 'init'
      }
    };
  },
  mounted: function() {},
  methods: {
    onResetClicked: function() {
      if (this.stats.state == 'running')
        this.$refs["board"].reset();
    },
    onReplayClicked: function() {
      if (this.stats.state == 'lost' || this.stats.state == 'won')
        this.$refs["board"].reset(false);
    }
  }
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
