<script setup lang="ts">
import { UiButton, UiCard } from 'platform-ui'

defineProps<{
  message: string
}>()

const emit = defineEmits<{
  refresh: []
}>()
</script>

<template>
  <UiCard class="error-card" padding="lg" variant="elevated">
    <p class="error-card__title">Could not load repository data</p>
    <p class="error-card__message">{{ message }}</p>
    <UiButton size="sm" variant="primary" @click="emit('refresh')">Try again</UiButton>
  </UiCard>
</template>

<style scoped>
.error-card {
  display: grid;
  justify-items: start;
  gap: 12px;
  max-width: 560px;
  border-color: #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 6%);
}

.error-card__title {
  color: #0f172a;
  font-size: 20px;
  font-weight: 850;
}

.error-card__message {
  color: #b45309;
  font-size: 14px;
}
</style>
