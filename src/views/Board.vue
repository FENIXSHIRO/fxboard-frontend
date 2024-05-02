<template>
  <KonvaWhiteboard />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import KonvaWhiteboard from '@/components/editor/KonvaWhiteboard.vue'

export default defineComponent({
  components: {
    KonvaWhiteboard
  },
  data: () => ({}),
  props: {},
  emits: [],
  computed: {
  },
  methods: {}
})
</script>

<style scoped>
</style>
