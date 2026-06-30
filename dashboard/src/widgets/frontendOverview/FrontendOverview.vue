<script setup lang="ts">
import { computed } from 'vue'
import type { GithubRepositoryInfo } from '../../stores/dashboard.ts'
import ActivityTimelineCard from './ActivityTimelineCard.vue'
import AttentionNeededCard from './AttentionNeededCard.vue'
import OverviewError from './OverviewError.vue'
import OverviewHeader from './OverviewHeader.vue'
import OverviewSkeleton from './OverviewSkeleton.vue'
import RecentEventsCard from './RecentEventsCard.vue'
import RepositoryProfileCard from './RepositoryProfileCard.vue'
import SummaryCards from './SummaryCards.vue'
import { useRepositoryOverview } from './model/useRepositoryOverview.ts'

const props = defineProps<{
  error: string | null
  loading: boolean
  repository: GithubRepositoryInfo | null
}>()

const emit = defineEmits<{
  refresh: []
}>()

const repositoryRef = computed(() => props.repository)
const isInitialLoading = computed(() => props.loading && !props.repository)

const {
  attentionItems,
  headerPill,
  profileItems,
  recentEvents,
  repositoryName,
  repositorySummary,
  sparklinePoints,
  summaryCards,
  timelineSignals,
} = useRepositoryOverview(repositoryRef)
</script>

<template>
  <main class="dashboard-content">
    <OverviewHeader
      :loading="loading"
      :repository-summary="repositorySummary"
      :repository-url="repository?.html_url"
      :status-label="headerPill"
      @refresh="emit('refresh')"
    />
    <OverviewSkeleton v-if="isInitialLoading" />
    <OverviewError v-else-if="error && !repository" :message="error" @refresh="emit('refresh')" />
    <template v-else>
      <div v-if="error" class="inline-error" role="status">
        Showing the last loaded GitHub response. Refresh failed: {{ error }}
      </div>
      <SummaryCards :cards="summaryCards" />
      <section class="content-grid">
        <ActivityTimelineCard :signals="timelineSignals" :sparkline-points="sparklinePoints" />
        <AttentionNeededCard :items="attentionItems" />
        <RecentEventsCard :events="recentEvents" :repository-name="repositoryName" />
        <RepositoryProfileCard :items="profileItems" />
      </section>
    </template>
  </main>
</template>

<style scoped>
.dashboard-content {
  min-height: 100vh;
  padding: 28px;
  background: #f5f7fb;
  color: #111827;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(260px, 0.85fr);
  gap: 16px;
  margin-top: 16px;
}

.inline-error {
  margin-bottom: 14px;
  border-radius: 8px;
  padding: 12px 14px;
  background: #fffbeb;
  color: #b45309;
  font-size: 13px;
}

@media (max-width: 1100px) {
  .content-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 740px) {
  .dashboard-content {
    padding: 12px;
  }

  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
