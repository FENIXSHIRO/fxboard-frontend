import Home from '@/views/Home.vue';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

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

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/auth/login', '/auth/signup'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useAuthStore();

  if (authRequired && !auth.user) {
      auth.returnUrl = to.fullPath;
      return '/auth/login';
  }
});
