<template>
  <div 
  :style="{ top: positionY + 'px', left: targetX + 'px' }"
  class="absolute translate-x-[-50%] bg-[#eee] rounded-md shadow-md *:min-h-[30px] *:min-w-[30px] *:rounded-md *:m-[5px]"
  >
    <button class="floatMenuButton">A</button>
    <button class="floatMenuButton">A</button>
    <button class="floatMenuButton">A</button>
    <button class="floatMenuButton">A</button>
    <button class="floatMenuButton">A</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  data() {
    return {
      newTargetX: this.targetX,
      newTargetY: this.targetY,
      newScaleX: this.scaleX,
      newScaleY: this.scaleY,
      newRotation: this.rotation,
      yOffsetByScaleX: false
    };
  },
  props: {
    targetX: {type: Number || String, required: true },
    targetY: {type: Number || String, required: true },
    scaleX: {type: Number || String, required: true },
    scaleY: {type: Number || String, required: true },
    rotation: {type: Number || String, required: true },
  },
  emits: [],
  watch: {
    targetX(newValue) {
      this.newTargetX = newValue
    },
    targetY(newValue) {
      this.newTargetY = newValue
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
  computed: {
    positionY() {
      if(Math.abs(this.newRotation) > 50 && Math.abs(this.newRotation) < 135) {
        return this.newTargetY - 50 * this.newScaleX - 95
      } else {
        return this.newTargetY - 50 * this.newScaleY - 95
      }
    }
  },
  methods: {}
})
</script>

<style scoped>
.floatMenuButton {
 @apply hover:bg-[#ccc];
}
</style>
