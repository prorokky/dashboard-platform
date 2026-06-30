<script setup lang="ts">
import { UiCard } from 'platform-ui'
import type { AttentionItem } from './model/types.ts'

defineProps<{
  items: AttentionItem[]
}>()
</script>

<template>
  <UiCard class="attention-card" padding="md">
    <div class="card-heading">
      <div>
        <p class="card-heading__title">Attention Needed</p>
        <p class="card-heading__subtitle">Repository-level signals</p>
      </div>
    </div>
    <div class="attention-list">
      <div
        v-for="item in items"
        :key="item.title"
        class="attention-item"
        :class="`attention-item--${item.tone}`"
      >
        <span class="attention-item__badge">{{ item.badge }}</span>
        <div>
          <p class="attention-item__title">{{ item.title }}</p>
          <p class="attention-item__description">{{ item.description }}</p>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<style scoped>
.attention-card {
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

.attention-list {
  display: grid;
  gap: 12px;
}

.attention-item {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
  align-items: start;
  border-radius: 8px;
  padding: 10px;
  background: #f8fafc;
}

.attention-item__badge {
  border-radius: 999px;
  padding: 4px 8px;
  background: #e0f2fe;
  color: #0369a1;
  font-size: 10px;
  font-weight: 850;
  text-transform: uppercase;
}

.attention-item--warning .attention-item__badge {
  background: #fef3c7;
  color: #b45309;
}

.attention-item--danger .attention-item__badge {
  background: #fee2e2;
  color: #b91c1c;
}

.attention-item--success .attention-item__badge {
  background: #dcfce7;
  color: #15803d;
}

.attention-item__title {
  color: #0f172a;
  font-size: 13px;
  font-weight: 850;
}

.attention-item__description {
  margin-top: 3px;
  color: #64748b;
  font-size: 12px;
}

@media (max-width: 560px) {
  .attention-item {
    grid-template-columns: 1fr;
  }

  .attention-item__badge {
    justify-self: start;
  }
}
</style>
