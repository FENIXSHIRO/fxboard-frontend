<template>
<div class="absolute right-[10px] top-[10px] bg-white rounded-lg border shadow-md p-2"> 
  <PopoverMenu>
    <p class="hover:text-blue-600 cursor-pointer">{{username}}</P>
    <template #menu>
      <a class="hover:text-blue-600 cursor-pointer" @click="logOut">Выйти</a>
    </template>
  </PopoverMenu>
</div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth';
import { defineComponent } from 'vue'
import PopoverMenu from './common/PopoverMenu.vue';

export default defineComponent({
  components: {
    PopoverMenu
  },
  setup() {
    return {
      authStore: useAuthStore()
    }
  },
  data () {
    return {}
  },
  props: {},
  emits: [],
  computed: {
    username() {
      return this.authStore.user.username
    }
  },
  methods: {
    test() {
      console.log(this.authStore.user)
    },
    logOut() {
      this.authStore.logout()
    }
  }
})
</script>

<style scoped>
</style>