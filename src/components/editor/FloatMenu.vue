<template>
  <div 
  :style="{ top: positionY + 'px', left: targetX + 'px' }"
  class="absolute translate-x-[-50%] bg-[#eee] rounded-md shadow-md *:min-h-[30px] *:min-w-[30px] *:rounded-md *:m-[5px]"
  >
    <PopoverMenu>
      <button class="floatMenuButton">
        <svg 
        viewBox="0 0 30 30"
        class="fill-none stroke-2 stroke-[#555]"
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
        <p class="text-center w-full">Рамка</p>
        <hr class="mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-50 dark:via-neutral-400" />
        <div class="grid grid-cols-4 gap-2">
          <button
            class="w-[25px] h-[25px] border border-[#aaa] rounded-md"
            @click="changeStroke(null)"
          >
          X
          </button>
          <button
            v-for="(color, index) in buttonColors"
            :key="index"
            :style="{ backgroundColor: color }"
            class="w-[25px] h-[25px] border border-[#aaa] rounded-md"
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
        class="fill-[#555]"
        fill-rule='nonzero'
        >
          <g id="surface1">
            <path d="M 27.5 20.625 L 27.5 24.375 C 27.5 26.101562 26.101562 27.5 24.375 27.5 L 15.449219 27.5 C 14.339844 27.5 13.789062 26.164062 14.5625 25.375 L 21.902344 17.875 C 22.136719 17.636719 22.464844 17.5 22.789062 17.5 L 24.375 17.5 C 26.101562 17.5 27.5 18.898438 27.5 20.625 Z M 27.5 20.625 "/>
            <path d="M 22.960938 14.113281 L 19.574219 17.5 L 16.5 20.5625 C 15.710938 21.347656 14.363281 20.800781 14.363281 19.6875 C 14.363281 15.675781 14.363281 9.074219 14.363281 9.074219 C 14.363281 8.738281 14.5 8.425781 14.726562 8.1875 L 15.875 7.035156 C 17.101562 5.8125 19.074219 5.8125 20.300781 7.035156 L 22.949219 9.6875 C 24.1875 10.910156 24.1875 12.886719 22.960938 14.113281 Z M 22.960938 14.113281 "/>
            <path d="M 9.375 2.5 L 5.625 2.5 C 3.75 2.5 2.5 3.75 2.5 5.625 L 2.5 22.5 C 2.5 22.835938 2.539062 23.175781 2.601562 23.5 C 2.636719 23.664062 2.675781 23.824219 2.726562 23.988281 C 2.789062 24.175781 2.851562 24.363281 2.925781 24.539062 C 2.9375 24.550781 2.9375 24.5625 2.9375 24.5625 C 2.949219 24.5625 2.949219 24.5625 2.9375 24.574219 C 3.113281 24.925781 3.3125 25.261719 3.550781 25.574219 C 3.6875 25.738281 3.824219 25.886719 3.960938 26.039062 C 4.101562 26.1875 4.25 26.3125 4.414062 26.4375 L 4.425781 26.449219 C 4.738281 26.6875 5.074219 26.886719 5.425781 27.0625 C 5.4375 27.050781 5.4375 27.050781 5.4375 27.0625 C 5.625 27.148438 5.8125 27.210938 6.011719 27.273438 C 6.175781 27.324219 6.335938 27.363281 6.5 27.398438 C 6.824219 27.460938 7.164062 27.5 7.5 27.5 C 8.011719 27.5 8.539062 27.425781 9.023438 27.261719 C 9.164062 27.210938 9.300781 27.164062 9.4375 27.101562 C 9.875 26.925781 10.300781 26.675781 10.675781 26.351562 C 10.789062 26.261719 10.914062 26.148438 11.023438 26.039062 L 11.074219 25.988281 C 11.949219 25.085938 12.5 23.851562 12.5 22.5 L 12.5 5.625 C 12.5 3.75 11.25 2.5 9.375 2.5 Z M 7.5 24.375 C 6.460938 24.375 5.625 23.539062 5.625 22.5 C 5.625 21.460938 6.460938 20.625 7.5 20.625 C 8.539062 20.625 9.375 21.460938 9.375 22.5 C 9.375 23.539062 8.539062 24.375 7.5 24.375 Z M 7.5 24.375 "/>
          </g>
        </svg>
      </button>
      <template #menu>
        <p class="text-center w-full">Заливка</p>
        <hr class="mb-2 h-px border-t-0 bg-transparent bg-gradient-to-r from-transparent via-neutral-500 to-transparent opacity-50 dark:via-neutral-400" />
        <div class="grid grid-cols-4 gap-2">
          <button
            class="w-[25px] h-[25px] border border-[#aaa] rounded-md"
            @click="changeFill(null)"
          >
          X
          </button>
          <button
            v-for="(color, index) in buttonColors"
            :key="index"
            :style="{ backgroundColor: color }"
            class="w-[25px] h-[25px] border border-[#aaa] rounded-md"
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
