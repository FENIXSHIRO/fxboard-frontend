<template>
  <div v-if="showMenu" 
    :style="{ top: mouseY + 4 + 'px', left: mouseX + 4 + 'px' }"  
    class="absolute bg-[#eee] min-w-[100px] *:hover:bg-[#ccc] *:min-w-[100px]"
    tabindex="0"
    @click="close"
    @blur="close"
    >
    <slot name="menu" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  data: () => ({
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
  emits: ['inFocus', 'update:showMenu'],
  computed: {
  },
  watch: {
  },
  methods: {
    close() {
      this.$emit('update:showMenu', false)
    }
  }
})
</script>

<style scoped>
</style>
