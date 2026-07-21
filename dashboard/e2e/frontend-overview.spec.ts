import { expect, test, type Page } from '@playwright/test'

const GITHUB_REPOSITORY_API_URL = 'https://api.github.com/repos/prorokky/dashboard-platform'
const FIXED_NOW = new Date('2026-07-05T12:00:00Z')

const baseRepository = {
  archived: false,
  created_at: '2024-06-09T18:30:00Z',
  default_branch: 'main',
  disabled: false,
  fork: false,
  forks_count: 98,
  full_name: 'prorokky/dashboard-platform',
  html_url: 'https://github.com/prorokky/dashboard-platform',
  language: 'TypeScript',
  license: null as { name: string; spdx_id: string } | null,
  name: 'dashboard-platform',
  open_issues_count: 12,
  owner: {
    avatar_url: 'https://avatars.githubusercontent.com/u/1?v=4',
    html_url: 'https://github.com/prorokky',
    login: 'prorokky',
  },
  private: false,
  pushed_at: '2026-07-04T09:30:00Z',
  size: 48128,
  stargazers_count: 1200,
  subscribers_count: 45,
  topics: [] as string[],
  updated_at: '2026-07-05T08:15:00Z',
  visibility: 'public',
  watchers_count: 45,
}

type RepositoryFixture = typeof baseRepository

type GithubMockResponse = {
  body: RepositoryFixture | Record<string, unknown>
  status?: number
  waitFor?: Promise<void>
}

const createRepository = (overrides: Partial<RepositoryFixture> = {}): RepositoryFixture => {
  return {
    ...baseRepository,
    ...overrides,
    owner: overrides.owner ?? baseRepository.owner,
    topics: overrides.topics ?? baseRepository.topics,
  }
}

const mockGithubRepository = async (page: Page, responses: GithubMockResponse[]) => {
  let requestCount = 0

  await page.route(GITHUB_REPOSITORY_API_URL, async (route) => {
    const response = responses[Math.min(requestCount, responses.length - 1)]
    requestCount += 1

    await response.waitFor

    await route.fulfill({
      body: JSON.stringify(response.body),
      headers: {
        'access-control-allow-headers': '*',
        'access-control-allow-origin': '*',
        'content-type': 'application/json',
      },
      status: response.status ?? 200,
    })
  })

  return () => requestCount
}

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED_NOW)
})

test.describe('frontend overview', () => {
  test('renders the GitHub repository overview', async ({ page }) => {
    await mockGithubRepository(page, [{ body: createRepository() }])

    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Frontend Platform Overview' })).toBeVisible()
    await expect(page.getByText(/TypeScript.*main branch.*public/)).toBeVisible()
    await expect(page.getByRole('link', { name: 'GitHub' })).toHaveAttribute(
      'href',
      baseRepository.html_url,
    )

    const repositorySummary = page.getByRole('region', { name: 'Repository summary' })
    await expect(repositorySummary).toContainText('Repository')
    await expect(repositorySummary).toContainText('dashboard-platform')
    await expect(repositorySummary).toContainText('Default branch: main')
    await expect(repositorySummary).toContainText('Activity')
    await expect(repositorySummary).toContainText('yesterday')
    await expect(repositorySummary).toContainText('Last updated today')
    await expect(repositorySummary).toContainText('Open Work')
    await expect(repositorySummary).toContainText('12')
    await expect(repositorySummary).toContainText('Popularity')
    await expect(repositorySummary).toContainText('1.2K stars')
    await expect(repositorySummary).toContainText('98 forks')
    await expect(repositorySummary).toContainText('45 watchers')

    await expect(page.getByText('Repository Activity Timeline')).toBeVisible()
    await expect(page.getByText('Created, updated, and pushed signals from GitHub')).toBeVisible()
    await expect(page.getByText('Attention Needed')).toBeVisible()
    await expect(page.getByText('12 open issues/PRs')).toBeVisible()
    await expect(page.getByText('License is not set')).toBeVisible()
    await expect(page.getByText('Topics are empty')).toBeVisible()
    await expect(page.getByText('Recent Repository Events')).toBeVisible()
    await expect(page.getByText('main · Jul 04, 2026')).toBeVisible()
    await expect(page.getByText('prorokky/dashboard-platform · Jul 05, 2026')).toBeVisible()
    await expect(page.getByText('Repository Profile')).toBeVisible()
    await expect(page.getByText('Owner')).toBeVisible()
    await expect(page.getByText('prorokky', { exact: true })).toBeVisible()
    await expect(page.getByText('48,128 KB')).toBeVisible()
    await expect(page.getByText('Source repository')).toBeVisible()
  })

  test('refreshes repository data', async ({ page }) => {
    const getGithubRequestCount = await mockGithubRepository(page, [
      {
        body: createRepository({
          license: { name: 'MIT License', spdx_id: 'MIT' },
          open_issues_count: 0,
          stargazers_count: 16,
          topics: ['vue', 'module-federation'],
        }),
      },
      {
        body: createRepository({
          license: { name: 'MIT License', spdx_id: 'MIT' },
          open_issues_count: 3,
          pushed_at: '2026-07-05T10:30:00Z',
          stargazers_count: 24,
          topics: ['vue', 'module-federation'],
          updated_at: '2026-07-05T10:45:00Z',
        }),
      },
    ])

    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Frontend Platform Overview' })).toBeVisible()
    await expect(page.getByText('16 stars')).toBeVisible()
    await expect(page.getByText('No attention items')).toBeVisible()
    await expect.poll(getGithubRequestCount).toBe(1)

    await page.getByRole('button', { name: 'Refresh' }).click()

    await expect(page.getByText('24 stars')).toBeVisible()
    await expect(page.getByText('3 open issues/PRs')).toBeVisible()
    await expect.poll(getGithubRequestCount).toBe(2)
  })

  test('shows a retryable error when the GitHub request fails before data is loaded', async ({
    page,
  }) => {
    await mockGithubRepository(page, [
      {
        body: { message: 'GitHub API is unavailable' },
        status: 503,
      },
      {
        body: createRepository({
          license: { name: 'MIT License', spdx_id: 'MIT' },
          open_issues_count: 0,
          stargazers_count: 42,
          topics: ['vue'],
        }),
      },
    ])

    await page.goto('/')

    await expect(page.getByText('Could not load repository data')).toBeVisible()
    await expect(page.getByText('Request failed with status code 503')).toBeVisible()

    await page.getByRole('button', { name: 'Try again' }).click()

    await expect(page.getByText('Could not load repository data')).toBeHidden()
    await expect(page.getByRole('heading', { name: 'Frontend Platform Overview' })).toBeVisible()
    await expect(page.getByText('42 stars')).toBeVisible()
    await expect(page.getByText('No attention items')).toBeVisible()
  })

  test('shows a loading state until the initial GitHub response completes', async ({ page }) => {
    let completeRequest = () => {}
    const requestCompleted = new Promise<void>((resolve) => {
      completeRequest = resolve
    })

    await mockGithubRepository(page, [
      {
        body: createRepository(),
        waitFor: requestCompleted,
      },
    ])

    await page.goto('/')

    await expect(page.getByRole('region', { name: 'Loading repository overview' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeDisabled()
    await expect(page.getByRole('region', { name: 'Repository summary' })).toHaveCount(0)

    completeRequest()

    await expect(page.getByRole('region', { name: 'Loading repository overview' })).toBeHidden()
    await expect(page.getByRole('region', { name: 'Repository summary' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Refresh' })).toBeEnabled()
  })

  test('keeps the last repository data visible when refresh fails', async ({ page }) => {
    const getGithubRequestCount = await mockGithubRepository(page, [
      {
        body: createRepository({
          license: { name: 'MIT License', spdx_id: 'MIT' },
          open_issues_count: 0,
          stargazers_count: 16,
          topics: ['vue'],
        }),
      },
      {
        body: { message: 'GitHub API is unavailable' },
        status: 503,
      },
    ])

    await page.goto('/')

    await expect(page.getByText('16 stars')).toBeVisible()
    await page.getByRole('button', { name: 'Refresh' }).click()

    await expect(page.getByRole('status')).toContainText(
      'Showing the last loaded GitHub response. Refresh failed: Request failed with status code 503',
    )
    await expect(page.getByText('16 stars')).toBeVisible()
    await expect(page.getByText('Could not load repository data')).toHaveCount(0)
    await expect.poll(getGithubRequestCount).toBe(2)
  })

  test('shows critical repository warnings and limits the attention list', async ({ page }) => {
    await mockGithubRepository(page, [
      {
        body: createRepository({
          archived: true,
          disabled: true,
          open_issues_count: 5,
        }),
      },
    ])

    await page.goto('/')

    const attentionCard = page.locator('.attention-card')

    await expect(attentionCard.getByText('Repository disabled')).toBeVisible()
    await expect(attentionCard.getByText('Repository archived')).toBeVisible()
    await expect(attentionCard.getByText('5 open issues/PRs')).toBeVisible()
    await expect(attentionCard.getByText('License is not set')).toBeVisible()
    await expect(attentionCard.getByText('Topics are empty')).toHaveCount(0)
    await expect(attentionCard.locator('.attention-item')).toHaveCount(4)
  })

  test('renders safe fallbacks for incomplete repository metadata', async ({ page }) => {
    await mockGithubRepository(page, [
      {
        body: {
          name: 'fallback-repository',
          private: true,
          subscribers_count: 7,
        },
      },
    ])

    await page.goto('/')

    await expect(page.getByText(/No primary language.*private/)).toBeVisible()
    await expect(page.getByText('Private', { exact: true })).toBeVisible()
    await expect(page.getByRole('link', { name: 'GitHub' })).toHaveCount(0)

    const repositorySummary = page.getByRole('region', { name: 'Repository summary' })
    await expect(repositorySummary).toContainText('fallback-repository')
    await expect(repositorySummary).toContainText('Default branch unknown')
    await expect(repositorySummary).toContainText('unknown')
    await expect(repositorySummary).toContainText('Last updated unknown')
    await expect(repositorySummary).toContainText('7 watchers')

    const timeline = page.getByLabel('Repository activity timeline')
    await expect(timeline.locator('.timeline-chart__point')).toHaveCount(0)
    await expect(timeline.locator('polyline')).toHaveAttribute('points', '')

    const eventsCard = page.locator('.events-card')
    await expect(eventsCard).toContainText('fallback-repository')
    await expect(eventsCard.locator('.event-row')).toHaveCount(0)

    const profileCard = page.locator('.profile-card')
    await expect(profileCard).toContainText('Unknown')
    await expect(profileCard).toContainText('Not specified')
    await expect(profileCard).toContainText('Not set')
    await expect(profileCard).toContainText('Source repository')
  })

  test('handles invalid repository dates without exposing invalid values', async ({ page }) => {
    await mockGithubRepository(page, [
      {
        body: createRepository({
          created_at: 'invalid-date',
          pushed_at: 'invalid-date',
          updated_at: 'invalid-date',
        }),
      },
    ])

    await page.goto('/')

    await expect(page.getByRole('region', { name: 'Repository summary' })).toContainText('unknown')
    await expect(page.locator('.events-card')).toContainText('Unknown date')
    await expect(page.getByText('Invalid Date')).toHaveCount(0)
    await expect(page.locator('.timeline-chart__point')).toHaveCount(3)
  })
})
