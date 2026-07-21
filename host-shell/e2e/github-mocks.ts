import type { Page, Route } from '@playwright/test'

const GITHUB_REPOSITORY_PATH = '/repos/prorokky/dashboard-platform'

const repository = {
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
}

const commits = [
  {
    author: { login: 'octocat' },
    commit: {
      author: { date: '2026-07-10T10:00:00Z' },
      comment_count: 0,
      message: 'feat: cover host shell with Playwright',
      verification: { verified: true },
    },
    html_url: 'https://github.com/prorokky/dashboard-platform/commit/abcdef123456',
    parents: [],
    sha: 'abcdef123456',
  },
]

const fulfillJson = async (route: Route, body: unknown, status = 200) => {
  await route.fulfill({
    body: JSON.stringify(body),
    headers: {
      'access-control-allow-headers': '*',
      'access-control-allow-origin': '*',
      'content-type': 'application/json',
    },
    status,
  })
}

export const mockGithubApis = async (page: Page) => {
  await page.route(
    (url) => url.hostname === 'api.github.com' && url.pathname.startsWith(GITHUB_REPOSITORY_PATH),
    async (route) => {
      const pathname = route.request().url().split('?')[0]?.replace('https://api.github.com', '')

      if (pathname === GITHUB_REPOSITORY_PATH) {
        await fulfillJson(route, repository)
        return
      }

      if (pathname === `${GITHUB_REPOSITORY_PATH}/commits`) {
        await fulfillJson(route, commits)
        return
      }

      if (pathname === `${GITHUB_REPOSITORY_PATH}/issues`) {
        await fulfillJson(route, [])
        return
      }

      if (pathname === `${GITHUB_REPOSITORY_PATH}/events`) {
        await fulfillJson(route, [])
        return
      }

      if (pathname === `${GITHUB_REPOSITORY_PATH}/actions/runs`) {
        await fulfillJson(route, { workflow_runs: [] })
        return
      }

      await fulfillJson(route, { message: 'Unexpected GitHub request in test' }, 404)
    },
  )
}
