<template>
  <div class="absolute left-[10px] top-[10px] bg-[#eee] rounded-lg border border-solid border-[#4b4b4b] p-2"> 
    <nav>
      <router-link to="/" class="hover:text-blue-600">Home</router-link> | 
      <router-link to="/board" class="hover:text-blue-600">Board</router-link> | 
      <router-link to="/about" class="hover:text-blue-600">About</router-link> | 
      <router-link to="/board" class="hover:text-blue-600" @click="clearLocalStorage">Clear</router-link> || 
      <router-link to="/auth/login" class="hover:text-blue-600" @click="clearLocalStorage">Login</router-link> | 
      <router-link to="/auth/signup" class="hover:text-blue-600" @click="clearLocalStorage">SignUp</router-link>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  components: {},
  data: () => ({}),
  props: {},
  emits: [],
  computed: {
  },
  methods: {
    clearLocalStorage() {
      localStorage.clear()
    }
  }
})
</script>

<style scoped>
</style>
