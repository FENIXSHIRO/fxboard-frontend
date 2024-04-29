<template>
  <div>
    <Circle
    :x="x"
    :y="y"
    radius="5"
    fill="black"
    draggable
    :perfectDrawEnabled="false"
    ref="anchor"
  />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  components: {},
  data: () => ({}),
  props: {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
    id: { type: String, required: true }
  },
  emits: [],
  computed: {
  },
  methods: {
  },

})
</script>

<style scoped>
</style>
