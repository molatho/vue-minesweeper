<template>
<div>
  <b-container v-if="this.stats.state == 'new'">
    <b-row>
      <b-col>
        Click a field to begin!
      </b-col>
    </b-row>
  </b-container>
  <b-container v-if="this.stats.state != 'new'">
    <b-row>
      <b-col>
        Flags: {{ this.stats.flags }} / {{ this.stats.mines }}
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        Revealed: {{ this.openedPercent }}% ({{ this.stats.opened }} / {{ (this.stats.numFields - this.stats.mines) }})
      </b-col>
    </b-row>
  </b-container>
  </div>
</template>

<script>
export default {
  name: "GameStats",
  props: ["stats"],
  computed: {
    openedPercent: function() {
      return parseInt(100 * (this.stats.opened / (this.stats.numFields - this.stats.mines)));
    }
  }
};
</script>

<style>
</style>