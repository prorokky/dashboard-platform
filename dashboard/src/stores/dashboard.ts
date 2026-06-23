import axios from 'axios'
import { defineStore } from 'pinia'

const GITHUB_REPOSITORY_API_URL = 'https://api.github.com/repos/prorokky/dashboard-platform'

export type GithubRepositoryInfo = Record<string, unknown>

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
