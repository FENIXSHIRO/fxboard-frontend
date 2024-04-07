import Home from '@/views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
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
      path: '/about',
      component: () => import('@/views/About.vue'),
    },
  ],
})
