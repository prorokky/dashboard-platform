<script setup lang="ts">
import { UiCard } from 'platform-ui'
import type { SummaryCard } from './model/types.ts'

defineProps<{
  cards: SummaryCard[]
}>()
</script>

<template>
  <section aria-label="Repository summary" class="summary-grid">
    <UiCard
      v-for="card in cards"
      :key="card.eyebrow"
      class="summary-card"
      :class="`summary-card--${card.tone}`"
      padding="md"
    >
      <p class="summary-card__eyebrow">{{ card.eyebrow }}</p>
      <p class="summary-card__value">{{ card.value }}</p>
      <p class="summary-card__meta">{{ card.meta }}</p>
    </UiCard>
  </section>
</template>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

.summary-card {
  position: relative;
  overflow: hidden;
  border-color: #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 6%);
}

.summary-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: #4f46e5;
}

.summary-card--green::before {
  background: #22c55e;
}

.summary-card--amber::before {
  background: #f59e0b;
}

.summary-card--blue::before {
  background: #0ea5e9;
}

.summary-card__eyebrow {
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
}

.summary-card__value {
  overflow-wrap: anywhere;
  margin-top: 8px;
  color: #0f172a;
  font-size: 28px;
  font-weight: 850;
  line-height: 1.05;
}

.summary-card__meta {
  margin-top: 8px;
  color: #64748b;
  font-size: 12px;
}

@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 740px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .summary-card {
    padding: 14px;
  }

  .summary-card__value {
    overflow-wrap: break-word;
    font-size: 18px;
  }
}
</style>
