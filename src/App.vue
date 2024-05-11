<template>
  <main>
    <router-view />
  </main>
  <RouterLinks />
  <UserPanel v-if="user" />

</template>

<script lang="ts">
import { defineComponent } from 'vue'

import RouterLinks from "@/components/RouterLinks.vue";
import UserPanel from "@/components/UserPanel.vue";
import { useAuthStore } from './stores/auth';

export default defineComponent({
  components: {
    RouterLinks,
    UserPanel
  },
  setup() {
    return {
      authStore: useAuthStore()
    }
  },
  data: () => ({}),
  props: {},
  emits: [],
  computed: {
    user() {
      return this.authStore.user
    }
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
.el-drawer__header {
  @apply mb-0;
}
</style>
