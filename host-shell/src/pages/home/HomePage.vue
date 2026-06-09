<script setup lang="ts">
import { remoteApps } from '../../shared/remotes/remoteApps.ts'
import { UiButton, UiCard } from 'platform-ui'

const STACK = ['Vue', 'TypeScript', 'Module Federation', 'Vite']
</script>

<template>
  <main class="home-page">
    <p class="home-page__title">Platform Deck</p>
    <p class="home-page__subtitle">Frontend Platform Console</p>

    <UiCard class="stack-card" padding="lg" variant="outline">
      <p class="stack-card__title">Stack</p>
      <div class="stack-card__list">
        <p v-for="item in STACK" :key="item" class="stack-card__item">
          {{ item }}
        </p>
      </div>
    </UiCard>

    <div class="modules-list">
      <RouterLink
        v-for="app in remoteApps"
        :key="app.id"
        v-slot="{ navigate }"
        custom
        :to="app.path"
      >
        <UiButton class="modules-list__item" role="link" size="lg" variant="secondary" @click="navigate">
          {{ app.title }}
        </UiButton>
      </RouterLink>
    </div>
  </main>
</template>

<style scoped>
.home-page {
  padding: 96px clamp(24px, 6vw, 120px);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background:
    radial-gradient(circle at top right, rgb(79 70 229 / 22%), transparent 44%),
    var(--ui-color-bg-canvas);
}

.home-page__title {
  margin-bottom: var(--ui-space-3);
  font-size: clamp(40px, 8vw, var(--ui-font-size-5xl));
  color: var(--ui-color-text-primary);
  line-height: var(--ui-line-height-tight);
}

.home-page__subtitle {
  font-size: clamp(var(--ui-font-size-lg), 3vw, var(--ui-font-size-2xl));
  color: var(--ui-color-text-secondary);
}

.stack-card {
  margin-top: clamp(48px, 8vw, 86px);
  width: min(100%, 560px);
  display: grid;
  gap: var(--ui-space-5);
  border-color: rgb(71 85 105 / 80%);
  backdrop-filter: blur(10px);
}

.stack-card__title {
  font-size: var(--ui-font-size-xl);
  color: var(--ui-color-text-primary);
  font-weight: 700;
}

.stack-card__list {
  display: flex;
  flex-wrap: wrap;
}

.stack-card__item {
  font-size: var(--ui-font-size-lg);
  color: var(--ui-color-text-secondary);
}

.stack-card__item::after {
  content: '·';
  margin: 0 var(--ui-space-3);
}

.stack-card__item:last-child::after {
  content: '';
  margin: 0;
}

.modules-list {
  margin-top: clamp(32px, 6vw, 64px);
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: var(--ui-space-4);
}

.modules-list__item {
  font-size: var(--ui-font-size-xl);
}

@media (max-width: 900px) {
  .home-page {
    padding-top: 48px;
  }
}
</style>
