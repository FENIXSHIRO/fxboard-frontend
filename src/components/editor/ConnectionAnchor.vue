<template>
<v-circle
  :config="AnchorConfig"
  :x="cneterX"
  :y="cneterY-verticalOffset"
  draggable
  :perfectDrawEnabled="false"
  ref="top"
/>
<v-circle
  :config="AnchorConfig"
  :x="cneterX+horizontalOffset"
  :y="cneterY"
  draggable
  :perfectDrawEnabled="false"
  ref="right"
/>
<v-circle
  :config="AnchorConfig"
  :x="cneterX-horizontalOffset"
  :y="cneterY"
  draggable
  :perfectDrawEnabled="false"
  ref="left"
/>
<v-circle
  :config="AnchorConfig"
  :x="cneterX"
  :y="cneterY+verticalOffset"
  draggable
  :perfectDrawEnabled="false"
  ref="bottom"
/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: {},
  data() {
    return {
      AnchorConfig: {
        radius: 5,
        fill: 'red'
      },
      cneterX: 0,
      cneterY: 0,
      verticalOffset: 70,
      horizontalOffset: 70
    };
  },
  props: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  watch: {
    x(newValue) {
      this.cneterX = newValue
    },
    y(newValue) {
      this.cneterY = newValue
    }
  },
  emits: [],
  computed: {
  },
  methods: {
  },

})
</script>

<style scoped>
</style>
