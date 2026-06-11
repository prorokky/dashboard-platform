import { describe, expect, it } from 'vitest'

import { flushPromises, mount } from '@vue/test-utils'
import NavBar from '../widgets/NavBar.vue'
import { createTestRouter } from './testRouter'

describe('NavBar', () => {
  it('highlights the active remote app route', async () => {
    const router = await createTestRouter('/dashboard')
    const wrapper = mount(NavBar, {
      global: {
        plugins: [router],
      },
    })

    const dashboardButton = wrapper.get('button.element')

    expect(dashboardButton.text()).toBe('Dashboard')
    expect(dashboardButton.classes()).toContain('ui-button--primary')
  })

  it('navigates to the selected remote app', async () => {
    const router = await createTestRouter()
    const wrapper = mount(NavBar, {
      global: {
        plugins: [router],
      },
    })

    const dashboardButton = wrapper.get('button.element')

    expect(dashboardButton.classes()).toContain('ui-button--ghost')

    await dashboardButton.trigger('click')
    await flushPromises()

    expect(router.currentRoute.value.path).toBe('/dashboard')
  })
})
