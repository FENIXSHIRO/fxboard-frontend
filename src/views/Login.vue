<template>
  <div class="m-auto mt-20 w-full max-w-sm">
    <form class="bg-white border shadow-md rounded-md px-8 pt-6 pb-8 mb-4">
      <h1 class="font-bold">Авторизация</h1>
      <div class="mb-4 mt-3">
        <label class="block text-gray-700 text-sm font-bold mb-2 text-left" for="username">
          Почта/Имя пользователя
        </label>
        <input v-model="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="example@mail.ru">
      </div>
      <div class="mb-6">
        <label class="block text-gray-700 text-sm font-bold mb-2 text-left" for="password">
          Пароль
        </label>
        <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
      </div>
      <div class="flex items-center justify-between">
        <button @click="login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
          Войти
        </button>
        <RouterLink to="/auth/signup" class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
          Регистрация
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { mapStores } from 'pinia'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

export default defineComponent({
  components: {},
  data: () => ({
    username: null as string | null,
    password: null as string | null
  }),
  props: {},
  emits: [],
  computed: {
    ...mapStores([])
  },
  methods: {
    async login() {
      if(this.username == null || this.password == null) {
        ElMessage({
          message: 'Данные для входа не введены',
          type: 'warning',
          grouping: true
        })
        return
      }
      console.log(this.username + '|' + this.password)
      const authStore = useAuthStore()
      
      // Вызов метода login из экземпляра стора
      await authStore.login(this.username, this.password)
    }
  }
})
</script>

<style scoped>
</style>