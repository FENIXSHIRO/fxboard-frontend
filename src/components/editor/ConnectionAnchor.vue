<template>
<v-circle
  :config="AnchorConfig"
  :x="cneterX"
  :y="cneterY"
  :offsetY="verticalHalf*newScaleY+anchorOffset"
  :rotation="newRotation"
  draggable
  :perfectDrawEnabled="false"
  ref="top"
/>
<v-circle
  :config="AnchorConfig"
  :x="cneterX"
  :y="cneterY"
  :offsetY="-verticalHalf*newScaleY-anchorOffset"
  :rotation="newRotation"
  draggable
  :perfectDrawEnabled="false"
  ref="bottom"
/>
<v-circle
  :config="AnchorConfig"
  :x="cneterX"
  :offsetX="-horizontalHalf*newScaleX-anchorOffset"
  :y="cneterY"
  :rotation="newRotation"
  draggable
  :perfectDrawEnabled="false"
  @dragmove="test"
  ref="right"
/>
<v-circle
  :config="AnchorConfig"
  :x="cneterX"
  :offsetX="horizontalHalf*newScaleX+anchorOffset"
  :y="cneterY"
  :rotation="newRotation"
  draggable
  :perfectDrawEnabled="false"
  ref="left"
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
        fill: '#aaa'
      },
      cneterX: this.x,
      cneterY: this.y,
      newRotation: this.rotation,
      newScaleX: this.scaleX,
      newScaleY: this.scaleY,
      verticalHalf: 50,
      horizontalHalf: 50,
      anchorOffset: 20
    };
  },
  props: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    rotation: { type: Number, default: 0 },
  },
  watch: {
    x(newValue) {
      this.cneterX = newValue
    },
    y(newValue) {
      this.cneterY = newValue
    },
    scaleX(newValue) {
      this.newScaleX = newValue
    },
    scaleY(newValue) {
      this.newScaleY = newValue
    },
    rotation(newValue) {
      this.newRotation = newValue
    }
  },
  emits: [],
  computed: {
  },
  methods: {
    test() {
      console.log('AnchorClick')
    }
  },

})
</script>

<style scoped>
</style>
