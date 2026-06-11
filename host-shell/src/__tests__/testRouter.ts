import { defineComponent, h } from 'vue'
import { createMemoryHistory, createRouter } from 'vue-router'

const RouteStub = defineComponent({
  name: 'RouteStub',
  render: () => h('div'),
})

export const createTestRouter = async (initialPath = '/') => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        component: RouteStub,
        name: 'home',
        path: '/',
      },
      {
        component: RouteStub,
        name: 'dashboard',
        path: '/dashboard',
      },
    ],
  })

  await router.push(initialPath)
  await router.isReady()

  return router
}
