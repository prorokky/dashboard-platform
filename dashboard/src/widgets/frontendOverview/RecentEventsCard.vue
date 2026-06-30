<script setup lang="ts">
import { UiCard } from 'platform-ui'
import type { RepositoryEvent } from './model/types.ts'

defineProps<{
  events: RepositoryEvent[]
  repositoryName: string
}>()
</script>

<template>
  <UiCard class="events-card" padding="md">
    <div class="card-heading">
      <div>
        <p class="card-heading__title">Recent Repository Events</p>
        <p class="card-heading__subtitle">{{ repositoryName }}</p>
      </div>
    </div>
    <div class="event-list">
      <div v-for="event in events" :key="event.label" class="event-row">
        <span class="event-row__dot" :class="`event-row__dot--${event.tone}`" />
        <div class="event-row__main">
          <p class="event-row__title">{{ event.label }}</p>
          <p class="event-row__meta">{{ event.value }} · {{ event.formattedDate }}</p>
        </div>
        <span class="event-row__status" :class="`event-row__status--${event.tone}`">
          {{ event.status }}
        </span>
      </div>
    </div>
  </UiCard>
</template>

<style scoped>
.events-card {
  min-height: 260px;
  border-color: #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 6%);
}

.card-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 18px;
}

.card-heading__title {
  color: #0f172a;
  font-size: 16px;
  font-weight: 850;
}

.card-heading__subtitle {
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
}

.event-list {
  display: grid;
  gap: 12px;
}

.event-row {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e2e8f0;
}

.event-row:last-child {
  border-bottom: 0;
}

.event-row__dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  background: #4f46e5;
}

.event-row__dot--green {
  background: #22c55e;
}

.event-row__dot--amber {
  background: #f59e0b;
}

.event-row__main {
  min-width: 0;
}

.event-row__title {
  color: #0f172a;
  font-size: 13px;
  font-weight: 850;
}

.event-row__meta {
  overflow: hidden;
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.event-row__status {
  border-radius: 999px;
  padding: 5px 9px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 11px;
  font-weight: 850;
}

.event-row__status--green {
  background: #dcfce7;
  color: #15803d;
}

.event-row__status--amber {
  background: #fef3c7;
  color: #b45309;
}

@media (max-width: 740px) {
  .event-row {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .event-row__status {
    grid-column: 2;
    justify-self: start;
  }
}

@media (max-width: 560px) {
  .event-row__meta {
    overflow: visible;
    text-overflow: clip;
    white-space: normal;
  }
}
</style>
