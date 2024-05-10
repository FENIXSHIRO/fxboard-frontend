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
      path: '/auth/login',
      component: () => import('@/views/Login.vue'),
    },
    {
      path: '/auth/signup',
      component: () => import('@/views/SignUp.vue'),
    },
    {
      path: '/about',
      component: () => import('@/views/About.vue'),
    },
  ],
})

export default router
