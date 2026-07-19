<script setup lang="ts">
import { computed } from "vue";
import { UiCard } from "platform-ui";
import type { EngineeringCase } from "../../entities/case/model/types.ts";

const props = defineProps<{
  cases: EngineeringCase[];
}>();

const metrics = computed(() => [
  {
    label: "Total signals",
    meta: "Across all GitHub sources",
    tone: "brand",
    value: props.cases.length,
  },
  {
    label: "Open work",
    meta: "Issues and pull requests",
    tone: "amber",
    value: props.cases.filter((item) => item.status === "open").length,
  },
  {
    label: "Workflow failures",
    meta: "Action required",
    tone: "red",
    value: props.cases.filter((item) => item.status === "failed").length,
  },
  {
    label: "Contributors",
    meta: "Unique GitHub actors",
    tone: "blue",
    value: new Set(props.cases.map((item) => item.actor.login)).size,
  },
]);
</script>

<template>
  <section aria-label="Cases summary" class="summary-grid">
    <UiCard
      v-for="metric in metrics"
      :key="metric.label"
      class="summary-card"
      :class="`summary-card--${metric.tone}`"
      padding="md"
    >
      <p class="summary-card__label">{{ metric.label }}</p>
      <p class="summary-card__value">{{ metric.value }}</p>
      <p class="summary-card__meta">{{ metric.meta }}</p>
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
  content: "";
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: #4f46e5;
}

.summary-card--amber::before {
  background: #f59e0b;
}

.summary-card--red::before {
  background: #ef4444;
}

.summary-card--blue::before {
  background: #0ea5e9;
}

.summary-card__label {
  color: #64748b;
  font-size: 12px;
  font-weight: 800;
}

.summary-card__value {
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

@media (max-width: 640px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }
}
</style>
