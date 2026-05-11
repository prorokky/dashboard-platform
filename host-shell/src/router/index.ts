import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/home/HomePage.vue'
import { defineAsyncComponent } from 'vue'

const Dashboard = defineAsyncComponent(() => import('dashboard/Dashboard'))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: Dashboard,
      meta: {
        showHostNavbar: true,
      },
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

router.onError((error) => {
  if (error.message.includes('fetch') || error.message.includes('module')) {
    console.error('Router error caught:', error)

    throw error
  }
})

export default router
