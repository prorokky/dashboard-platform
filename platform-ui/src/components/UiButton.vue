<script setup lang="ts">
import { computed } from 'vue'

type UiButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type UiButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: UiButtonVariant
    size?: UiButtonSize
    fullWidth?: boolean
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
  }>(),
  {
    disabled: false,
    fullWidth: false,
    loading: false,
    size: 'md',
    type: 'button',
    variant: 'primary',
  },
)

const isDisabled = computed(() => props.disabled || props.loading)
</script>

<template>
  <button
    class="ui-button"
    :class="[
      `ui-button--${variant}`,
      `ui-button--${size}`,
      {
        'ui-button--full-width': fullWidth,
      },
    ]"
    :disabled="isDisabled"
    :type="type"
  >
    <span v-if="loading" aria-hidden="true" class="ui-button__spinner" />
    <span class="ui-button__label">
      <slot />
    </span>
  </button>
</template>

<style scoped>
.ui-button {
  --button-bg: var(--ui-color-brand-600);
  --button-border: var(--ui-color-brand-600);
  --button-color: var(--ui-color-text-primary);
  --button-hover-bg: var(--ui-color-brand-700);
  --button-hover-border: var(--ui-color-brand-700);

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--ui-space-2);
  border: 1px solid var(--button-border);
  border-radius: var(--ui-radius-sm);
  background: var(--button-bg);
  color: var(--button-color);
  cursor: pointer;
  white-space: nowrap;
  font-weight: 600;
  transition:
    background-color var(--ui-transition-fast),
    border-color var(--ui-transition-fast),
    transform var(--ui-transition-fast);
}

.ui-button:hover:not(:disabled) {
  background: var(--button-hover-bg);
  border-color: var(--button-hover-border);
}

.ui-button:active:not(:disabled) {
  transform: translateY(1px);
}

.ui-button:focus-visible {
  outline: none;
  box-shadow: var(--ui-shadow-focus);
}

.ui-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ui-button--full-width {
  width: 100%;
}

.ui-button--sm {
  min-height: 36px;
  padding: 0 var(--ui-space-3);
  font-size: var(--ui-font-size-sm);
}

.ui-button--md {
  min-height: 44px;
  padding: 0 var(--ui-space-4);
  font-size: var(--ui-font-size-md);
}

.ui-button--lg {
  min-height: 52px;
  padding: 0 var(--ui-space-6);
  font-size: var(--ui-font-size-lg);
}

.ui-button--primary {
  --button-bg: var(--ui-color-brand-600);
  --button-border: var(--ui-color-brand-600);
  --button-color: var(--ui-color-text-primary);
  --button-hover-bg: var(--ui-color-brand-700);
  --button-hover-border: var(--ui-color-brand-700);
}

.ui-button--secondary {
  --button-bg: var(--ui-color-bg-elevated);
  --button-border: var(--ui-color-border-default);
  --button-color: var(--ui-color-brand-500);
  --button-hover-bg: var(--ui-color-bg-muted);
  --button-hover-border: var(--ui-color-border-strong);
}

.ui-button--ghost {
  --button-bg: transparent;
  --button-border: transparent;
  --button-color: var(--ui-color-text-secondary);
  --button-hover-bg: rgb(148 163 184 / 16%);
  --button-hover-border: transparent;
}

.ui-button--danger {
  --button-bg: var(--ui-color-danger-500);
  --button-border: var(--ui-color-danger-500);
  --button-color: var(--ui-color-text-primary);
  --button-hover-bg: var(--ui-color-danger-600);
  --button-hover-border: var(--ui-color-danger-600);
}

.ui-button__spinner {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 2px solid currentcolor;
  border-right-color: transparent;
  animation: ui-spin 0.8s linear infinite;
}

.ui-button__label {
  line-height: var(--ui-line-height-tight);
}

@keyframes ui-spin {
  to {
    transform: rotate(1turn);
  }
}
</style>
