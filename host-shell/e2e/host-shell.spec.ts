import { expect, test, type Page } from '@playwright/test'
import { mockGithubApis } from './github-mocks.js'

const expectActiveNavigationItem = async (page: Page, activeItem: 'Cases' | 'Dashboard') => {
  const inactiveItem = activeItem === 'Dashboard' ? 'Cases' : 'Dashboard'

  await expect(page.getByRole('button', { name: activeItem })).toHaveClass(/ui-button--primary/)
  await expect(page.getByRole('button', { name: inactiveItem })).toHaveClass(/ui-button--ghost/)
}

test.beforeEach(async ({ page }) => {
  await mockGithubApis(page)
})

test.describe('host shell', () => {
  test('renders the platform home page and available remote applications', async ({ page }) => {
    await page.goto('/')

    await expect(page.getByText('Platform Deck')).toBeVisible()
    await expect(page.getByText('Frontend Platform Console')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Dashboard' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Cases' })).toBeVisible()
    await expect(page.getByRole('navigation')).toHaveCount(0)

    for (const technology of ['Vue', 'TypeScript', 'Module Federation', 'Vite']) {
      await expect(page.getByText(technology, { exact: true })).toBeVisible()
    }
  })

  test('opens the dashboard remote and highlights it in shell navigation', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Dashboard' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Frontend Platform Overview' })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Repository summary' })).toContainText(
      'dashboard-platform',
    )
    await expectActiveNavigationItem(page, 'Dashboard')
  })

  test('opens the cases remote and switches between remote applications', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Cases' }).click()

    await expect(page).toHaveURL('/cases')
    await expect(page.getByRole('heading', { name: 'GitHub Cases' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Engineering signals' })).toBeVisible()
    await expect(
      page.getByRole('heading', { name: 'feat: cover host shell with Playwright' }),
    ).toBeVisible()
    await expectActiveNavigationItem(page, 'Cases')

    await page.getByRole('button', { name: 'Dashboard' }).click()

    await expect(page).toHaveURL('/dashboard')
    await expect(page.getByRole('heading', { name: 'Frontend Platform Overview' })).toBeVisible()
    await expectActiveNavigationItem(page, 'Dashboard')
  })

  test('supports direct links to every remote application', async ({ page }) => {
    await page.goto('/dashboard')

    await expect(page.getByRole('heading', { name: 'Frontend Platform Overview' })).toBeVisible()
    await expectActiveNavigationItem(page, 'Dashboard')

    await page.goto('/cases')

    await expect(page.getByRole('heading', { name: 'GitHub Cases' })).toBeVisible()
    await expectActiveNavigationItem(page, 'Cases')
  })

  test('redirects unknown routes to the platform home page', async ({ page }) => {
    await page.goto('/missing-remote')

    await expect(page).toHaveURL('/')
    await expect(page.getByText('Frontend Platform Console')).toBeVisible()
    await expect(page.getByRole('navigation')).toHaveCount(0)
  })
})
