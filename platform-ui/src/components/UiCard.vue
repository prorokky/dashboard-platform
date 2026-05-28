<script setup lang="ts">
type UiCardVariant = 'surface' | 'elevated' | 'outline'
type UiCardPadding = 'sm' | 'md' | 'lg'

withDefaults(
  defineProps<{
    variant?: UiCardVariant
    padding?: UiCardPadding
  }>(),
  {
    variant: 'surface',
    padding: 'md',
  },
)
</script>

<template>
  <section class="ui-card" :class="[`ui-card--${variant}`, `ui-card--padding-${padding}`]">
    <slot />
  </section>
</template>

<style scoped>
.ui-card {
  border-radius: var(--ui-radius-lg);
  border: 1px solid var(--ui-color-border-default);
}

.ui-card--surface {
  background: rgb(17 26 47 / 72%);
}

.ui-card--elevated {
  background: var(--ui-color-bg-elevated);
}

.ui-card--outline {
  background: transparent;
}

.ui-card--padding-sm {
  padding: var(--ui-space-4);
}

.ui-card--padding-md {
  padding: var(--ui-space-6);
}

.ui-card--padding-lg {
  padding: var(--ui-space-8);
}
</style>
