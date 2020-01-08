<template>
  <div class="field" v-on:click="fieldClick" @contextmenu.prevent="onFlagged">
    <div v-if="state == 'default'" class="fieldDefault"></div>
    <div v-if="state == 'opened' && !isMine" :class="`fieldOpened fieldOpened${mines}`">
      <span v-if="mines > 0">{{ mines }}</span>
    </div>
    <!--<div v-if="state == 'opened' && isMine" class="fieldMine">X</div>-->
    <div v-if="state == 'opened' && isMine" class="fieldMine"><font-awesome-icon icon="bomb"/></div>
    <!--<div v-if="state == 'flagged'" class="fieldFlag">?</div>-->
    <div v-if="state == 'flagged'" class="fieldFlag"><font-awesome-icon icon="flag"/></div>
  </div>
</template>

<script>
export default {
  name: 'Field',
  props: ['fieldData'],
  computed: {
    idx: function() { return this.fieldData.idx; },
    x: function() { return this.fieldData.x; },
    y: function() { return this.fieldData.y; },
    state: function() { return this.fieldData.state; },
    isMine: function() { return this.fieldData.isMine; },
    mines: function() { return this.fieldData.mines; }
  },
  watch:{
    state: function(newState, oldState) {
      if (oldState == 'default' && newState == 'opened') this.$emit('opened', this);
    }
  },
  methods: {
    fieldClick: function() {
       this.$emit('clicked', this);
    },
    open: function() {
      if (this.state == 'default') {
        this.fieldData.state = 'opened';
      }
    },
    onFlagged: function() {
      if (this.state == 'default')
        this.$emit('flagged', this);
      else if (this.state == 'flagged')
        this.$emit('unflagged', this);
    }
  }
};
</script>

<style>
.field {
  width: 20px;
  height: 20px;
  margin: 2px;
  text-align: center;
  vertical-align: middle;
  display: flex;
  line-height: normal;
}

.fieldDefault {
  width: 100%;
  border: #333 solid 1px;
  border-radius: 4px;
  background-color: #aaa;
}

.fieldDefault:hover {
  border: #000 dashed 1px;
  border-radius: 3px;
  background-color: #ccc;
}
.fieldOpened {
  width: 100%;
  border-radius: 2px;
  background-color: #ddd;
}
.fieldOpened1 {
  background-color: #E5D400;
}
.fieldOpened2 {
  background-color: #EAA900;
}
.fieldOpened3 {
  background-color: #EF7F00;
}
.fieldOpened4 {
  background-color: #F45400;
}
.fieldOpened5 {
  background-color: #F92A00;
}
.fieldOpened6 {
  background-color: #FF0000;
}
/*.fieldMine {
  width: 100%;
  border: #f00 solid 1px;
  border-radius: 4px;
  background-color: #7b2b2b;
  color: #f00;
}*/
.fieldMine {
  width: 100%;
  color: #000;
  border: #F33 dashed 1px;
  border-radius: 4px;
}
.fieldFlag {
  width: 100%;
  border: #272 solid 1px;
  border-radius: 4px;
  background-color: #0d0;
  color: #272;
}
.fieldFlag:hover {
  width: 100%;
  border: #161 dashed 1px;
  border-radius: 3px;
  background-color: #2F2;
  color: #383;
}
</style>