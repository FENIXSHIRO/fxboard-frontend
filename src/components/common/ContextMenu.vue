<template>
  <div v-if="isShouldShowMenu" 
    :style="{ top: mouseY + 4 + 'px', left: mouseX + 4 + 'px' }"  
    class="absolute bg-[#ccc] min-w-[100px]"
    tabindex="0"
    @click="close"
    >
    <slot name="menu" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  data: () => ({
    isShouldShowMenu: false
  }),
  props: {
    showMenu: {
      type: Boolean,
      default: false
    },
    mouseX: {
      type: Number || String,
      default: 0
    },
    mouseY: {
      type: Number || String,
      default: 0
    },
    width: {
      type: Number || String,
      default: ''
    },

  },
  emits: [],
  computed: {
  },
  watch: {
    showMenu(newValue) {
      this.isShouldShowMenu = newValue
    }
  },
  methods: {
    close() {
      this.isShouldShowMenu = false
    }
  }
})
</script>

<style scoped>
</style>
