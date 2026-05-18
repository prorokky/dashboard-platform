<script setup lang="ts">
import { remoteApps } from '../shared/remotes/remoteApps.ts'

const currentURL = window.location.href
const path = currentURL.split('/').reverse()[0]
</script>

<template>
  <nav class="container">
    <RouterLink v-for="item in remoteApps" :key="item.id" custom :to="item.path">
      <p :class="['element', `/${path}` === item.path ? 'element__active' : '']">
        {{ item.title }}
      </p>
    </RouterLink>
  </nav>
</template>

<style scoped>
.container {
  padding: 24px 16px;
  background-color: #0f172a;
  width: 236px;
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.element {
  padding: 10px 24px;
  text-decoration: none;
  border-radius: 8px;
  color: #ffffff;
  font-size: 14px;
  font-weight: bold;
}

.element__active {
  background-color: #4f46e6;
}
</style>
