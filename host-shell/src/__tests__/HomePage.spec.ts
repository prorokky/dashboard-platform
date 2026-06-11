import { describe, expect, it } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import HomePage from '../pages/home/HomePage.vue'
import { createTestRouter } from './testRouter'

describe('HomePage', () => {
  it('renders platform title and stack', async () => {
    const router = await createTestRouter()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router],
      },
    })

    expect(wrapper.text()).toContain('Platform Deck')
    expect(wrapper.text()).toContain('Frontend Platform Console')

    for (const stackItem of ['Vue', 'TypeScript', 'Module Federation', 'Vite']) {
      expect(wrapper.text()).toContain(stackItem)
    }
  })

  it('renders a link to the dashboard remote app', async () => {
    const router = await createTestRouter()
    const wrapper = mount(HomePage, {
      global: {
        plugins: [router],
      },
    })

    const dashboardLink = wrapper.get('button.modules-list__item')

    expect(dashboardLink.text()).toBe('Dashboard')

    await dashboardLink.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })
})
