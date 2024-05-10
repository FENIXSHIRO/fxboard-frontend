import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

const isAuthenticated = false

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/board',
      component: () => import('@/views/Board.vue'),
    },
    {
      path: '/auth',
      component: () => import('@/views/Auth.vue'),
    },
    {
      path: '/about',
      component: () => import('@/views/About.vue'),
    },
  ],
})

export default router
