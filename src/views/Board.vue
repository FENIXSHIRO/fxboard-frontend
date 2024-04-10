<template>
  <div>
    Editor
    <KonvaEditor />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import KonvaEditor from '@/components/editor/KonvaEditor.vue'

export default defineComponent({
  components: {
    KonvaEditor
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
