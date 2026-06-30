<script setup lang="ts">
import { UiCard } from 'platform-ui'
import type { TimelineSignal } from './model/types.ts'

defineProps<{
  signals: TimelineSignal[]
  sparklinePoints: string
}>()
</script>

<template>
  <UiCard class="activity-card" padding="md">
    <div class="card-heading">
      <div>
        <p class="card-heading__title">Repository Activity Timeline</p>
        <p class="card-heading__subtitle">Created, updated, and pushed signals from GitHub</p>
      </div>
    </div>
    <div aria-label="Repository activity timeline" class="timeline-chart">
      <svg class="timeline-chart__line" preserveAspectRatio="none" viewBox="0 0 100 100">
        <polyline :points="sparklinePoints" />
      </svg>
      <div
        v-for="signal in signals"
        :key="signal.label"
        class="timeline-chart__point"
        :class="`timeline-chart__point--${signal.tone}`"
        :style="signal.style"
      >
        <span class="timeline-chart__dot" />
        <span class="timeline-chart__label">{{ signal.label }}</span>
        <span class="timeline-chart__date">{{ signal.relativeDate }}</span>
      </div>
    </div>
  </UiCard>
</template>

<style scoped>
.activity-card {
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

.timeline-chart {
  position: relative;
  height: 182px;
  border-radius: 8px;
  background:
    linear-gradient(#edf2f7 1px, transparent 1px),
    linear-gradient(90deg, #edf2f7 1px, transparent 1px);
  background-size:
    100% 45px,
    25% 100%;
}

.timeline-chart__line {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
}

.timeline-chart__line polyline {
  fill: none;
  stroke: #4f46e5;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}

.timeline-chart__point {
  position: absolute;
  left: var(--point-x);
  top: var(--point-y);
  transform: translate(-50%, -50%);
  display: grid;
  justify-items: center;
  gap: 6px;
  min-width: 92px;
}

.timeline-chart__dot {
  width: 13px;
  height: 13px;
  border: 3px solid #ffffff;
  border-radius: 999px;
  background: #4f46e5;
  box-shadow: 0 0 0 3px rgb(79 70 229 / 16%);
}

.timeline-chart__point--green .timeline-chart__dot {
  background: #16a34a;
  box-shadow: 0 0 0 3px rgb(34 197 94 / 16%);
}

.timeline-chart__point--amber .timeline-chart__dot {
  background: #d97706;
  box-shadow: 0 0 0 3px rgb(245 158 11 / 18%);
}

.timeline-chart__label {
  margin-top: 3px;
  color: #0f172a;
  font-size: 12px;
  font-weight: 850;
}

.timeline-chart__date {
  color: #64748b;
  font-size: 11px;
}

@media (max-width: 560px) {
  .timeline-chart {
    display: grid;
    gap: 14px;
    height: auto;
    padding: 4px 0;
    background: transparent;
  }

  .timeline-chart__line {
    display: none;
  }

  .timeline-chart__point {
    position: static;
    grid-template-columns: auto minmax(0, 1fr);
    justify-items: start;
    column-gap: 10px;
    min-width: 0;
    transform: none;
  }

  .timeline-chart__dot {
    grid-row: span 2;
    margin-top: 2px;
  }

  .timeline-chart__label {
    margin-top: 0;
  }

  .timeline-chart__date {
    grid-column: 2;
  }
}
</style>
