<template>
<v-circle
  :config="AnchorConfig"
  :x="cneterX"
  :y="cneterY"
  :offsetY="verticalHalf*newScaleY+anchorOffset"
  :rotation="newRotation"
  :perfectDrawEnabled="false"
  @mouseover="overAnchor"
  @mouseout="outAnchor"
  @mousedown="test"
  ref="top"
/>
<v-circle
  :config="AnchorConfig"
  :x="cneterX"
  :y="cneterY"
  :offsetY="-verticalHalf*newScaleY-anchorOffset"
  :rotation="newRotation"
  :perfectDrawEnabled="false"
  @mouseover="overAnchor"
  @mouseout="outAnchor"
  @mousedown="test"
  ref="bottom"
/>
<v-circle
  :config="AnchorConfig"
  :x="cneterX"
  :offsetX="-horizontalHalf*newScaleX-anchorOffset"
  :y="cneterY"
  :rotation="newRotation"
  :scaleX="1/newStageScale"
  :perfectDrawEnabled="false"
  @mouseover="overAnchor"
  @mouseout="outAnchor"
  @mousedown="test"
  ref="right"
/>
<v-circle
  :config="AnchorConfig"
  :x="cneterX"
  :offsetX="horizontalHalf*newScaleX+anchorOffset"
  :y="cneterY"
  :rotation="newRotation"
  :perfectDrawEnabled="false"
  @mouseover="overAnchor"
  @mouseout="outAnchor"
  @mousedown="test"
  ref="left"
/>
</template>

<script lang="ts">
import Konva from 'konva';
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: {},
  data() {
    return {
      AnchorConfig: {
        radius: 5,
        fill: '#aaa'
      },
      newStageScale: this.stageScale,
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
    stageScale: { type: Number, default: 1 },
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
    },
    stageScale(newValue) {
      this.newStageScale = newValue
    }
  },
  emits: ['connectNodes'],
  computed: {
  },
  methods: {
    test(e: any) {
      e.target.fill('#80d0ff');
      this.$emit('connectNodes', e, 50);
    },
    overAnchor(e: any) {
      e.target.fill('#eee');
      e.target.stroke('#80d0ff');
    },
    outAnchor(e: any) {
      e.target.fill(this.AnchorConfig.fill);
      e.target.stroke(null);
    }
  },

})
</script>

<style scoped>
</style>
