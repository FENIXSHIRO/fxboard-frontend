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
  @mousedown="createConnection($event, 'top', {x: 0, y: verticalHalf*newScaleY})"
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
  @mousedown="createConnection($event, 'bottom', {x: 0, y: -verticalHalf*newScaleY})"
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
  @mousedown="createConnection($event, 'right', {x: -horizontalHalf*newScaleX, y: 0})"
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
  @mousedown="createConnection($event, 'left', {x: horizontalHalf*newScaleX, y: 0})"
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
      newStageScale: this.stageScale,
      cneterX: this.x,
      cneterY: this.y,
      newRotation: this.rotation,
      newScaleX: this.scaleX,
      newScaleY: this.scaleY,
      anchorOffset: 20,
      newNodeType: this.nodeType
    };
  },
  props: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    rotation: { type: Number, default: 0 },
    stageScale: { type: Number, default: 1 },
    nodeId: { type: String, required: true },
    nodeType: { type: String }
  },
  watch: {
    x(newValue) {
      this.cneterX = newValue
    },
    y(newValue) {
      this.cneterY = newValue
    },
    scaleX(newValue) {
      this.newScaleX = Math.abs(newValue)
    },
    scaleY(newValue) {
      this.newScaleY = Math.abs(newValue)
    },
    rotation(newValue) {
      this.newRotation = newValue
    },
    stageScale(newValue) {
      this.newStageScale = newValue
    },
    nodeType(newValue) {
      this.newNodeType = newValue
    }
  },
  emits: ['connectNodes'],
  computed: {
    horizontalHalf() {
      if (this.newNodeType === 'card' || this.newNodeType === 'sticker') {
        return 100
      } else {
        return 50
      }
    },
    verticalHalf() {
      if (this.newNodeType === 'sticker') {
        return 100
      } else {
        return 50
      }
    }
  },
  methods: {
    createConnection(e: any, side: string, offset:{x: number, y:number}) {
      e.target.fill('#80d0ff');
      this.$emit('connectNodes', e, this.nodeId, side, offset);
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
  mounted() {
  },
})
</script>

<style scoped>
</style>
