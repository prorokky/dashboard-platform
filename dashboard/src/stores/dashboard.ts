import axios from 'axios'
import { defineStore } from 'pinia'

const GITHUB_REPOSITORY_API_URL = 'https://api.github.com/repos/prorokky/dashboard-platform'

export type GithubRepositoryOwner = {
  avatar_url?: string
  html_url?: string
  login?: string
}

export type GithubRepositoryLicense = {
  name?: string
  spdx_id?: string
}

export type GithubRepositoryInfo = {
  archived?: boolean
  created_at?: string
  default_branch?: string
  disabled?: boolean
  fork?: boolean
  forks_count?: number
  full_name?: string
  html_url?: string
  language?: string | null
  license?: GithubRepositoryLicense | null
  name?: string
  open_issues_count?: number
  owner?: GithubRepositoryOwner
  private?: boolean
  pushed_at?: string
  size?: number
  stargazers_count?: number
  subscribers_count?: number
  topics?: string[]
  updated_at?: string
  visibility?: string
  watchers_count?: number
}

export type DashboardState = {
  githubRepositoryError: string | null
  githubRepositoryInfo: GithubRepositoryInfo | null
  githubRepositoryLoading: boolean
}

const initialState = (): DashboardState => ({
  githubRepositoryError: null,
  githubRepositoryInfo: null,
  githubRepositoryLoading: false,
})

export const useDashboardStore = defineStore('dashboard', {
  actions: {
    fetchGithubRepositoryInfo: async function () {
      this.githubRepositoryLoading = true
      this.githubRepositoryError = null

      try {
        const { data } = await axios.get<GithubRepositoryInfo>(GITHUB_REPOSITORY_API_URL)

        this.githubRepositoryInfo = data
      } catch (error) {
        this.githubRepositoryError =
          error instanceof Error ? error.message : 'Failed to load GitHub repository info'
      } finally {
        this.githubRepositoryLoading = false
      }
    },
  },
  state: initialState,
})
