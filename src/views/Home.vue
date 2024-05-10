<template>
  <div class="mt-10 p-10">
    <div class="">
      <h1 class="text-left text-2xl font-bold">Ваши доски</h1>
      <hr class="my-1 h-px border-t-0 bg-[#ddd]" />
      <div class="flex flex-wrap m-5 ml-0">
        <div v-for="n in 3" class="me-3 mb-3 w-[150px] h-[150px] border shadow-md rounded-lg align-middle hover:bg-[#eee]">
          {{n}}
        </div>
        <div class="w-[150px] h-[150px] border shadow-md rounded-lg align-middle hover:bg-[#eee]">
          +
        </div>
      </div>
    </div>
    <div>
      <h1 class="text-left font-bold">Доступные доски</h1>
      <hr class="my-1 h-px border-t-0 bg-[#ddd]" />
      <div class="flex flex-wrap m-5 ml-0">
        <div v-for="n in 3" class="me-3 mb-3 w-[150px] h-[150px] border shadow-md rounded-lg align-middle hover:bg-[#eee]">
          {{n}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  components: {},
  setup() {
    return {
      authStore: useAuthStore()
    }
  },
  data: () => ({
  }),
  props: {},
  emits: [],
  computed: {
    user() {
      return this.authStore.user
    }
  },
  methods: {
  }
})
</script>

<style scoped>
</style>