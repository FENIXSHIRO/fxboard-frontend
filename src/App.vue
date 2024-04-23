<template>
  <main>
    <router-view />
  </main>
  <RouterLinks />
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import RouterLinks from "@/components/RouterLinks.vue";

export default defineComponent({
  components: {
    RouterLinks
  },
  data: () => ({}),
  props: {},
  emits: [],
  computed: {
  },
  methods: {}
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
