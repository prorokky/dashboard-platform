<script setup lang="ts">
import ErrorBoundary from '../pages/errorBoundary/ErrorBoundary.vue'
import NavBar from '../widgets/NavBar.vue'
</script>

<template>
  <ErrorBoundary>
    <div class="app-layout">
      <NavBar v-if="$route?.meta.showHostNavbar" />
      <RouterView />
    </div>
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

.app-layout {
  min-height: 100vh;
  display: flex;
}

.app-layout > :last-child {
  flex: 1;
}
</style>
