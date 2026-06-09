<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'
import { useRouter } from 'vue-router'
import { UiButton, UiCard } from 'platform-ui'

const router = useRouter()
const hasError = ref(false)

onErrorCaptured((error) => {
  console.error('Captured by Boundary:', error)
  hasError.value = true
  return false
})

const navigateHome = async () => {
  await router.push('/')
  hasError.value = false
}
</script>

<template>
  <main v-if="hasError" class="error-page">
    <UiCard class="error-page__card" variant="surface">
      <h1 class="error-page__title">Oops, something went wrong</h1>

      <p class="error-page__text">We will definitely sort this out.</p>

      <UiButton class="error-page__button" size="md" type="button" variant="secondary" @click="navigateHome">
        Home
      </UiButton>
    </UiCard>
  </main>

  <slot v-else />
</template>

<style scoped>
.error-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  background: var(--ui-color-bg-canvas);
  padding: var(--ui-space-4);
}

.error-page__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
  border-radius: 28px;
  background: rgb(248 250 252 / 94%);
  text-align: center;
  gap: var(--ui-space-3);
}

.error-page__title {
  color: #0f172a;
  font-size: var(--ui-font-size-2xl);
  font-weight: 700;
  line-height: var(--ui-line-height-tight);
  letter-spacing: -0.02em;
}

.error-page__text {
  max-width: 320px;
  color: #64748b;
  font-size: var(--ui-font-size-md);
  font-weight: 400;
  line-height: var(--ui-line-height-relaxed);
}

.error-page__button {
  margin-top: var(--ui-space-4);
}
</style>
