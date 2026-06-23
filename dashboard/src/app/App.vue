<script setup lang="ts">
import { onMounted } from 'vue'
import { useDashboardStore } from '../stores/dashboard.ts'
import { dashboardPinia } from '../stores/pinia.ts'

const dashboardStore = useDashboardStore(dashboardPinia)

onMounted(() => {
  dashboardStore.fetchGithubRepositoryInfo()
})
</script>

<template>
  <main class="dashboard-content">This is dashboard microfront</main>
</template>

<style scoped>
.dashboard-content {
  min-height: 100vh;
}
</style>
