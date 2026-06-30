<script setup lang="ts">
import { UiButton } from 'platform-ui'

defineProps<{
  loading: boolean
  repositorySummary: string
  repositoryUrl?: string
  statusLabel: string
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <header class="dashboard-header">
    <div class="dashboard-header__copy">
      <p class="dashboard-header__eyebrow">Platform Deck</p>
      <h1>Frontend Platform Overview</h1>
      <p>{{ repositorySummary }}</p>
    </div>
    <div class="dashboard-header__actions">
      <span class="environment-pill">{{ statusLabel }}</span>
      <a v-if="repositoryUrl" class="github-link" :href="repositoryUrl" target="_blank">GitHub</a>
      <UiButton :loading="loading" size="sm" variant="primary" @click="emit('refresh')">
        Refresh
      </UiButton>
    </div>
  </header>
</template>

<style scoped>
.dashboard-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.dashboard-header__copy {
  min-width: 0;
}

.dashboard-header__eyebrow {
  margin-bottom: 6px;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 800;
}

.dashboard-header h1 {
  color: #0f172a;
  font-size: 30px;
  line-height: 1.15;
}

.dashboard-header p:last-child {
  margin-top: 7px;
  color: #64748b;
  font-size: 14px;
}

.dashboard-header__actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.environment-pill,
.github-link {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  border-radius: 999px;
  padding: 0 12px;
  font-size: 12px;
  font-weight: 800;
  text-decoration: none;
}

.environment-pill {
  background: #dcfce7;
  color: #15803d;
}

.github-link {
  background: #eef2ff;
  color: #4338ca;
}

@media (max-width: 740px) {
  .dashboard-header {
    display: grid;
  }

  .dashboard-header__actions {
    justify-content: flex-start;
  }
}

@media (max-width: 560px) {
  .dashboard-header h1 {
    font-size: 26px;
  }
}
</style>
