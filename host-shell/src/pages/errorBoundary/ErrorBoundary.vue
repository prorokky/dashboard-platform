<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'
import { useRouter } from 'vue-router'

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
    <section class="error-page__card">
      <h1 class="error-page__title">Oops, something went wrong</h1>

      <p class="error-page__text">We will definitely sort this out.</p>

      <button class="error-page__button" type="button" @click="navigateHome">Home</button>
    </section>
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
  background-color: #0b1020;
}

.error-page__card {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 420px;
  padding: 40px 32px;
  border-radius: 28px;
  background: rgb(255 255 255 / 88%);
  text-align: center;
}

.error-page__title {
  margin: 0;
  color: #0f172a;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.error-page__text {
  max-width: 320px;
  margin: 12px 0 0;
  color: #64748b;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
}

.error-page__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 22px;
  margin-top: 28px;
  border-radius: 14px;
  color: #818cf8;
  background-color: #1e293b;
  border: 1px solid #475569;
  font-size: 14px;
  font-family: 'Inter', sans-serif;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
}
</style>
