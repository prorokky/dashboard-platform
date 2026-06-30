<script setup lang="ts">
import { UiCard } from 'platform-ui'
import type { ProfileItem } from './model/types.ts'

defineProps<{
  items: ProfileItem[]
}>()
</script>

<template>
  <UiCard class="profile-card" padding="md">
    <div class="card-heading">
      <div>
        <p class="card-heading__title">Repository Profile</p>
        <p class="card-heading__subtitle">Metadata from GitHub</p>
      </div>
    </div>
    <div class="profile-list">
      <div v-for="item in items" :key="item.label" class="profile-row">
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>
    </div>
  </UiCard>
</template>

<style scoped>
.profile-card {
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

.profile-list {
  display: grid;
  gap: 12px;
}

.profile-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #e2e8f0;
  padding: 11px 0;
}

.profile-row:last-child {
  border-bottom: 0;
}

.profile-row span {
  color: #64748b;
  font-size: 12px;
}

.profile-row strong {
  overflow-wrap: anywhere;
  color: #0f172a;
  font-size: 13px;
  font-weight: 850;
  text-align: right;
}

@media (max-width: 560px) {
  .profile-row {
    display: grid;
  }

  .profile-row strong {
    text-align: left;
  }
}
</style>
