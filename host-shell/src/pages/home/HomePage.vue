<script setup lang="ts">
const STACK = ['Vue', 'TypeScript', 'Module Federation', 'Vite']
</script>

<template>
  <main class="home-page">
    <p class="title">Platform Deck</p>
    <p class="subtitle">Frontend Platform Console</p>
    <div class="stack-card">
      <p class="stack-card__title">Stack</p>
      <div class="stack-card__list">
        <p
          v-for="item in STACK"
          :key="item"
          class="stack-card__item"
        >
          {{ item }}
        </p>
      </div>
    </div>
    <div class="modules-list">
      <button class="modules-list__item">Dashboard</button>
    </div>
  </main>
</template>

<style scoped>
  .home-page {
    padding: 120px;
    height: calc(100vh - 240px);
    display: flex;
    flex-direction: column;
    background-color: #0B1020;
  }

  .title {
    margin-bottom: 18px;
    font-size: 72px;
    color: #FFFFFF;
  }

  .subtitle {
    font-size: 28px;
    color: #CBD5E1;
  }

  .stack-card {
    margin-top: 86px;
    padding: 32px;
    width: 520px;
    height: 64px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    border: 1px solid #334155;
    border-radius: 24px;
  }

  .stack-card__title {
    font-size: 20px;
    color: #FFFFFF;
  }

  .stack-card__list {
    display: flex;
  }

  .stack-card__item {
    font-size: 18px;
    color: #CBD5E1;
  }

  .stack-card__item::after {
    content: "·";
    margin: 0 12px;
  }

  .stack-card__item:last-child::after {
    content: "";
    margin: 0;
  }

  .modules-list {
    margin-top: 64px;
    display: flex;
    flex-direction: row;
  }

  .modules-list__item {
    padding: 16px;
    font-size: 24px;
    color: #818CF8;
    background-color: #1E293B;
    border: 1px solid #475569;
    border-radius: 24px;
    cursor: pointer;
  }
</style>
