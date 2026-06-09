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
.app-layout {
  min-height: 100vh;
  display: flex;
  background: var(--ui-color-bg-canvas);
}

.app-layout > :last-child {
  flex: 1;
  min-width: 0;
}
</style>
