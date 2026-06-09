<script setup lang="ts">
import { remoteApps } from '../shared/remotes/remoteApps.ts'
import { useRoute } from 'vue-router'
import { UiButton } from 'platform-ui'

const route = useRoute()
</script>

<template>
  <nav class="container">
    <RouterLink v-for="item in remoteApps" :key="item.id" v-slot="{ navigate }" custom :to="item.path">
      <UiButton
        class="element"
        full-width
        size="md"
        :variant="route.path === item.path ? 'primary' : 'ghost'"
        @click="navigate"
      >
        {{ item.title }}
      </UiButton>
    </RouterLink>
  </nav>
</template>

<style scoped>
.container {
  padding: var(--ui-space-6) var(--ui-space-4);
  background-color: #0f172a;
  width: 236px;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--ui-space-2);
}

.element {
  justify-content: flex-start;
  font-weight: 700;
}
</style>
