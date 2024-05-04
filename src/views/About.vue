<template>
  <h2>About</h2>
  <TestingField/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import TestingField from '@/components/common/TestingField.vue'

export default defineComponent({
  components: {
    TestingField
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