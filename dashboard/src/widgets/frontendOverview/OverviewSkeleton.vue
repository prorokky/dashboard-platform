<script setup lang="ts">
import { UiCard } from 'platform-ui'

const skeletonCards = Array.from({ length: 4 }, (_, index) => index)
const skeletonRows = Array.from({ length: 4 }, (_, index) => index)
</script>

<template>
  <section aria-busy="true" aria-label="Loading repository overview" class="summary-grid">
    <UiCard
      v-for="item in skeletonCards"
      :key="item"
      class="overview-card skeleton-card"
      padding="md"
    >
      <span class="skeleton-line skeleton-line--short" />
      <span class="skeleton-line skeleton-line--value" />
      <span class="skeleton-line" />
    </UiCard>
  </section>
  <section aria-hidden="true" class="content-grid">
    <UiCard class="overview-card activity-card skeleton-card" padding="md">
      <span class="skeleton-line skeleton-line--title" />
      <span class="skeleton-chart" />
    </UiCard>
    <UiCard class="overview-card skeleton-card" padding="md">
      <span class="skeleton-line skeleton-line--title" />
      <span v-for="item in skeletonRows" :key="item" class="skeleton-line" />
    </UiCard>
    <UiCard class="overview-card activity-card skeleton-card" padding="md">
      <span class="skeleton-line skeleton-line--title" />
      <span v-for="item in skeletonRows" :key="item" class="skeleton-line" />
    </UiCard>
    <UiCard class="overview-card skeleton-card" padding="md">
      <span class="skeleton-line skeleton-line--title" />
      <span v-for="item in skeletonRows" :key="item" class="skeleton-line" />
    </UiCard>
  </section>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.content-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(260px, 0.85fr);
  gap: 16px;
  margin-top: 16px;
}

.overview-card {
  border-color: #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 6%);
}

.activity-card {
  min-height: 260px;
}

.skeleton-card {
  overflow: hidden;
}

.skeleton-line,
.skeleton-chart {
  display: block;
  overflow: hidden;
  position: relative;
  border-radius: 999px;
  background: #e2e8f0;
}

.skeleton-line::after,
.skeleton-chart::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgb(255 255 255 / 72%), transparent);
  animation: skeleton-shimmer 1.2s infinite;
}

.skeleton-line {
  height: 12px;
  margin-bottom: 14px;
}

.skeleton-line--short {
  width: 42%;
}

.skeleton-line--value {
  width: 68%;
  height: 28px;
}

.skeleton-line--title {
  width: 36%;
  height: 16px;
}

.skeleton-chart {
  height: 180px;
  border-radius: 8px;
}

@keyframes skeleton-shimmer {
  to {
    transform: translateX(100%);
  }
}

@media (max-width: 1100px) {
  .summary-grid,
  .content-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 740px) {
  .summary-grid,
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
