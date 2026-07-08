import { expect, test, type Page } from '@playwright/test'

const GITHUB_REPOSITORY_API_URL = 'https://api.github.com/repos/prorokky/dashboard-platform'

const mockGithubRepository = async (page: Page) => {
  await page.route(GITHUB_REPOSITORY_API_URL, async (route) => {
    await route.fulfill({
      body: JSON.stringify({
        archived: false,
        created_at: '2024-06-09T18:30:00Z',
        default_branch: 'main',
        disabled: false,
        fork: false,
        forks_count: 2,
        full_name: 'prorokky/dashboard-platform',
        html_url: 'https://github.com/prorokky/dashboard-platform',
        language: 'TypeScript',
        license: { name: 'MIT License', spdx_id: 'MIT' },
        name: 'dashboard-platform',
        open_issues_count: 0,
        owner: {
          login: 'prorokky',
        },
        private: false,
        pushed_at: '2026-07-04T09:30:00Z',
        size: 48128,
        stargazers_count: 16,
        topics: ['vue'],
        updated_at: '2026-07-05T08:15:00Z',
        visibility: 'public',
        watchers_count: 4,
      }),
      headers: {
        'access-control-allow-headers': '*',
        'access-control-allow-origin': '*',
        'content-type': 'application/json',
      },
      status: 200,
    })
  })
}

test('opens the dashboard remote from the shell home page', async ({ page }) => {
  await mockGithubRepository(page)

  await page.goto('/')
  await expect(page.getByText('Frontend Platform Console')).toBeVisible()

  await page.getByRole('link', { name: 'Dashboard' }).click()

  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByRole('button', { name: 'Dashboard' })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Frontend Platform Overview' })).toBeVisible()
  await expect(page.getByRole('region', { name: 'Repository summary' })).toContainText(
    'dashboard-platform',
  )
})
