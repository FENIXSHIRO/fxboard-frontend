<template>
  <div class="absolute left-[10px] top-[10px] bg-white rounded-lg border shadow-md p-2"> 
    <nav>
      <a @click="routerToMain" class="hover:text-blue-600">
          <svg 
          width="20px" height="20px"
          viewBox="0 0 24 24"
          class="fill-[#555] inline-block hover:fill-blue-600"
          fill-rule='nonzero'
          >
          <path d="M21.71,10.29l-9-9a1,1,0,0,0-1.42,0l-9,9a1,1,0,0,0-.21,1.09A1,1,0,0,0,3,12H4v9a1,1,0,0,0,1,1H8a1,1,0,0,0,1-1V15a1,1,0,0,1,1-1h4a1,1,0,0,1,1,1v6a1,1,0,0,0,1,1h3a1,1,0,0,0,1-1V12h1a1,1,0,0,0,.92-.62A1,1,0,0,0,21.71,10.29Z" />
        </svg>
      </a>
      <p class="inline-block mx-1"> | </p> 
      <template
      v-if="selectefBoardName"
      >
      {{ selectefBoardName }}
      </template>
      <template
      v-else
      >
        <p class="inline-block cursor-default">Домашняя страница</p>
      </template>
    </nav>
  </div>
</template>

<script lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useBoardsStore } from '@/stores/boards';
import { defineComponent } from 'vue'
import router from '@/router/router';

export default defineComponent({
  components: {},
  setup() {
    return {
      authStore: useAuthStore(),
      boardsStore: useBoardsStore()
    }
  },
  data: () => ({}),
  props: {},
  emits: [],
  computed: {
    selectefBoardName() {
      return this.boardsStore.board
    }
  },
  methods: {
    routerToMain() {
      router.push('/')
      this.boardsStore.board = null
    },
    clearLocalStorage() {
      localStorage.clear()
    }
  }
})
</script>

<style scoped>
</style>

