<script setup lang="ts">
import { onMounted } from 'vue'
import FrontendOverview from '../widgets/frontendOverview/FrontendOverview.vue'
import { useDashboardStore } from '../stores/dashboard.ts'
import { dashboardPinia } from '../stores/pinia.ts'

const dashboardStore = useDashboardStore(dashboardPinia)

onMounted(() => {
  dashboardStore.fetchGithubRepositoryInfo()
})

const fetchRepositoryInfo = () => {
  dashboardStore.fetchGithubRepositoryInfo()
}
</script>

<template>
  <FrontendOverview
    :error="dashboardStore.githubRepositoryError"
    :loading="dashboardStore.githubRepositoryLoading"
    :repository="dashboardStore.githubRepositoryInfo"
    @refresh="fetchRepositoryInfo"
  />
</template>
