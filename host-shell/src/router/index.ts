import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/home/HomePage.vue'
import { remoteApps } from '../shared/remotes/remoteApps.ts'

const remoteComponents = {
  cases: () => import('cases/Cases'),
  dashboard: () => import('dashboard/Dashboard'),
}

const remoteRoutes = remoteApps.map((app) => ({
  component: remoteComponents[app.id as keyof typeof remoteComponents],
  meta: {
    showHostNavbar: app.showHostNavbar ?? true,
  },
  name: app.id,
  path: app.path,
}))

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      component: HomePage,
      name: 'home',
      path: '/',
    },
    ...remoteRoutes,
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
