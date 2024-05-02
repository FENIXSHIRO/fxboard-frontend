<template>
  <div 
  :style="{ top: positionY + 'px', left: targetX + 'px' }"
  class="absolute translate-x-[-50%] bg-[#eee] rounded-md shadow-md *:min-h-[30px] *:min-w-[30px] *:rounded-md *:m-[5px]"
  >
    <PopoverMenu>
      <button class="floatMenuButton">
        <svg 
        viewBox="0 0 30 30"
        class="fill-none stroke-2 stroke-blue-600"
        stroke-linejoin='round'
        stroke-linecap='butt'
        >
          <g id="surface1">
          <path d="M 3 7 C 3 5.115625 3 4.171875 3.584375 3.584375 C 4.171875 3 5.115625 3 7 3 C 8.884375 3 9.828125 3 10.415625 3.584375 C 11 4.171875 11 5.115625 11 7 L 11 17 C 11 18.884375 11 19.828125 10.415625 20.415625 C 9.828125 21 8.884375 21 7 21 C 5.115625 21 4.171875 21 3.584375 20.415625 C 3 19.828125 3 18.884375 3 17 Z M 3 7 " transform="matrix(1.25,0,0,1.25,0,0)"/>
          <path d="M 11 7.5 L 12.671875 5.828125 C 14.00625 4.49375 14.671875 3.828125 15.5 3.828125 C 16.328125 3.828125 16.99375 4.49375 18.328125 5.828125 L 19.171875 6.671875 C 20.50625 8.00625 21.171875 8.671875 21.171875 9.5 C 21.171875 10.328125 20.50625 10.99375 19.171875 12.328125 L 11 20.5 " transform="matrix(1.25,0,0,1.25,0,0)"/>
          <path d="M 7 21 L 17 21 C 18.884375 21 19.828125 21 20.415625 20.415625 C 21 19.828125 21 18.884375 21 17 L 21 15.5 C 21 15.034375 21 14.803125 20.9625 14.609375 C 20.803125 13.815625 20.184375 13.196875 19.390625 13.0375 C 19.196875 13 18.965625 13 18.5 13 " transform="matrix(1.25,0,0,1.25,0,0)"/>
          <path stroke-linecap='round' d="M 7 17.009375 L 7 17 " transform="matrix(1.25,0,0,1.25,0,0)"/>
          </g>
          </svg>
      </button>
      <template #menu>
        <p class="mb-2 text-center w-full">Рамка</p>
        <div class="grid grid-cols-4 gap-2">
          <button
            class="w-[35px] h-[35px] border border-[#aaa] rounded-md"
            @click="changeStroke(null)"
          >
          X
          </button>
          <button
            v-for="(color, index) in buttonColors"
            :key="index"
            :style="{ backgroundColor: color }"
            class="w-[35px] h-[35px] border border-[#aaa] rounded-md"
            @click="changeStroke(color)"
          >
          </button>
        </div>
      </template>
    </PopoverMenu>
    <PopoverMenu>
      <button class="floatMenuButton">
        <svg 
        viewBox="0 0 30 30"
        class="fill-blue-600 stroke-2 stroke-black"
        stroke-linejoin='round'
        stroke-linecap='butt'
        >
          <g id="surface1">
          <path d="M 3 7 C 3 5.115625 3 4.171875 3.584375 3.584375 C 4.171875 3 5.115625 3 7 3 C 8.884375 3 9.828125 3 10.415625 3.584375 C 11 4.171875 11 5.115625 11 7 L 11 17 C 11 18.884375 11 19.828125 10.415625 20.415625 C 9.828125 21 8.884375 21 7 21 C 5.115625 21 4.171875 21 3.584375 20.415625 C 3 19.828125 3 18.884375 3 17 Z M 3 7 " transform="matrix(1.25,0,0,1.25,0,0)"/>
          <path d="M 11 7.5 L 12.671875 5.828125 C 14.00625 4.49375 14.671875 3.828125 15.5 3.828125 C 16.328125 3.828125 16.99375 4.49375 18.328125 5.828125 L 19.171875 6.671875 C 20.50625 8.00625 21.171875 8.671875 21.171875 9.5 C 21.171875 10.328125 20.50625 10.99375 19.171875 12.328125 L 11 20.5 " transform="matrix(1.25,0,0,1.25,0,0)"/>
          <path d="M 7 21 L 17 21 C 18.884375 21 19.828125 21 20.415625 20.415625 C 21 19.828125 21 18.884375 21 17 L 21 15.5 C 21 15.034375 21 14.803125 20.9625 14.609375 C 20.803125 13.815625 20.184375 13.196875 19.390625 13.0375 C 19.196875 13 18.965625 13 18.5 13 " transform="matrix(1.25,0,0,1.25,0,0)"/>
          <path stroke-linecap='round' d="M 7 17.009375 L 7 17 " transform="matrix(1.25,0,0,1.25,0,0)"/>
          </g>
          </svg>
      </button>
      <template #menu>
        <p class="mb-2 text-center w-full">Заливка</p>
        <div class="grid grid-cols-4 gap-2">
          <button
            class="w-[35px] h-[35px] border border-[#aaa] rounded-md"
            @click="changeFill(null)"
          >
          X
          </button>
          <button
            v-for="(color, index) in buttonColors"
            :key="index"
            :style="{ backgroundColor: color }"
            class="w-[35px] h-[35px] border border-[#aaa] rounded-md"
            @click="changeFill(color)"
          >
          </button>
        </div>
      </template>
    </PopoverMenu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import PopoverMenu from '@/components/common/PopoverMenu.vue'

export default defineComponent({
  components: {
    PopoverMenu
  },
  data() {
    return {
      newTargetX: this.targetX,
      newTargetY: this.targetY,
      newScaleX: this.scaleX,
      newScaleY: this.scaleY,
      newRotation: this.rotation,
      yOffsetByScaleX: false,
      color1: '#409EFF',
      buttonColors: [
        '#ffffff', '#212121', '#ffd900', 
        '#f24726', '#e6e6e6', '#cee741', '#8fd14f', 
        '#da0063', '#808080', '#12cdd4', '#0ca789',
        '#652cb3', '#2d9bf0', '#414bb2'
      ]
    };
  },
  props: {
    targetX: {type: Number || String, required: true },
    targetY: {type: Number || String, required: true },
    scaleX: {type: Number || String, required: true },
    scaleY: {type: Number || String, required: true },
    rotation: {type: Number || String, required: true },
  },
  emits: ['changeFill', 'changeStroke'],
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
  methods: {
    changeStroke(color: string | null) {
      this.$emit('changeStroke', color)
    },
    changeFill(color: string | null) {
      this.$emit('changeFill', color)
    }
  }
})
</script>

<style scoped>
.floatMenuButton {
 @apply hover:bg-[#ccc] p-[5px];
}
</style>
