<script setup lang="ts">
import ErrorBoundary from '../pages/errorBoundary/ErrorBoundary.vue'
</script>

<template>
  <ErrorBoundary>
    <RouterView />
  </ErrorBoundary>
</template>

<style>
body {
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
}

h1 {
  font-family: 'Inter', sans-serif;
}

p {
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
}
</style>
