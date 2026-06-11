import { describe, expect, it } from 'vitest'

import { mount } from '@vue/test-utils'
import App from '../app/App.vue'

const mountApp = (showHostNavbar?: boolean) =>
  mount(App, {
    global: {
      mocks: {
        $route: {
          meta: {
            showHostNavbar,
          },
        },
      },
      stubs: {
        ErrorBoundary: {
          template: '<div data-test="error-boundary"><slot /></div>',
        },
        NavBar: {
          template: '<nav data-test="navbar" />',
        },
        RouterView: {
          template: '<main data-test="router-view" />',
        },
      },
    },
  })

describe('App', () => {
  it('renders host navigation when route metadata enables it', () => {
    const wrapper = mountApp(true)

    expect(wrapper.find('[data-test="navbar"]').exists()).toBe(true)
    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true)
  })

  it('hides host navigation when route metadata disables it', () => {
    const wrapper = mountApp(false)

    expect(wrapper.find('[data-test="navbar"]').exists()).toBe(false)
    expect(wrapper.find('[data-test="router-view"]').exists()).toBe(true)
  })
})
