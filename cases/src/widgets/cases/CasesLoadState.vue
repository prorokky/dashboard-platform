<script setup lang="ts">
import { AlertCircle, RefreshCw } from "@lucide/vue";
import { UiButton, UiCard } from "platform-ui";

defineProps<{
  error: string | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
}>();

const rows = Array.from({ length: 6 }, (_, index) => index);
</script>

<template>
  <section
    v-if="loading"
    aria-busy="true"
    aria-label="Loading GitHub cases"
    class="skeleton"
  >
    <UiCard v-for="item in rows" :key="item" class="skeleton__row" padding="md">
      <span class="skeleton__dot" />
      <span class="skeleton__line skeleton__line--wide" />
      <span class="skeleton__line" />
      <span class="skeleton__line" />
    </UiCard>
  </section>
  <UiCard v-else-if="error" class="error-card" padding="lg">
    <AlertCircle :size="22" />
    <div>
      <h2>Could not load GitHub cases</h2>
      <p>{{ error }}</p>
    </div>
    <UiButton size="sm" variant="primary" @click="emit('refresh')">
      <RefreshCw :size="16" />
      Try again
    </UiButton>
  </UiCard>
</template>

<style scoped>
.skeleton {
  display: grid;
  gap: 10px;
  margin-top: 16px;
}

.skeleton__row {
  display: grid;
  grid-template-columns: auto minmax(180px, 2fr) repeat(2, minmax(80px, 1fr));
  align-items: center;
  gap: 14px;
  border-color: #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
}

.skeleton__dot,
.skeleton__line {
  overflow: hidden;
  position: relative;
  display: block;
  border-radius: 999px;
  background: #e2e8f0;
}

.skeleton__dot::after,
.skeleton__line::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent,
    rgb(255 255 255 / 75%),
    transparent
  );
  animation: shimmer 1.2s infinite;
}

.skeleton__dot {
  width: 12px;
  height: 12px;
}

.skeleton__line {
  height: 12px;
}

.skeleton__line--wide {
  height: 16px;
}

.error-card {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 14px;
  max-width: 760px;
  margin-top: 16px;
  border-color: #fecaca;
  border-radius: 8px;
  background: #ffffff;
  color: #b91c1c;
  box-shadow: 0 12px 28px rgb(15 23 42 / 6%);
}

.error-card h2 {
  color: #0f172a;
  font-size: 15px;
}

.error-card p {
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
}

@keyframes shimmer {
  to {
    transform: translateX(100%);
  }
}

@media (max-width: 640px) {
  .skeleton__row {
    grid-template-columns: auto 1fr;
  }

  .skeleton__line:not(.skeleton__line--wide) {
    display: none;
  }

  .error-card {
    grid-template-columns: auto 1fr;
  }

  .error-card :deep(.ui-button) {
    grid-column: 2;
    justify-self: start;
  }
}
</style>
