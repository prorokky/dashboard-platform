<script setup lang="ts">
import { computed } from 'vue'

type UiInputSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    modelValue?: string | number
    label?: string
    hint?: string
    placeholder?: string
    invalid?: boolean
    disabled?: boolean
    size?: UiInputSize
    type?: string
    name?: string
    autocomplete?: string
  }>(),
  {
    modelValue: '',
    label: '',
    hint: '',
    placeholder: '',
    invalid: false,
    disabled: false,
    size: 'md',
    type: 'text',
    name: '',
    autocomplete: '',
  },
)

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void
  (event: 'blur', value: FocusEvent): void
  (event: 'focus', value: FocusEvent): void
}>()

const normalizedValue = computed(() => String(props.modelValue ?? ''))

const handleInput = (event: Event): void => {
  const target = event.target as HTMLInputElement | null
  emit('update:modelValue', target?.value ?? '')
}
</script>

<template>
  <label class="ui-input" :class="[`ui-input--${size}`]">
    <span v-if="label" class="ui-input__label">{{ label }}</span>
    <input
      :value="normalizedValue"
      :type="type"
      :name="name || undefined"
      :autocomplete="autocomplete || undefined"
      :placeholder="placeholder"
      :disabled="disabled"
      class="ui-input__control"
      :class="{ 'ui-input__control--invalid': invalid }"
      @input="handleInput"
      @blur="emit('blur', $event)"
      @focus="emit('focus', $event)"
    />
    <span v-if="hint" class="ui-input__hint" :class="{ 'ui-input__hint--invalid': invalid }">
      {{ hint }}
    </span>
  </label>
</template>

<style scoped>
.ui-input {
  display: flex;
  flex-direction: column;
  gap: var(--ui-space-2);
  color: var(--ui-color-text-secondary);
}

.ui-input__label {
  font-size: var(--ui-font-size-sm);
  font-weight: 600;
}

.ui-input__control {
  width: 100%;
  border-radius: var(--ui-radius-sm);
  border: 1px solid var(--ui-color-border-default);
  background: var(--ui-color-bg-elevated);
  color: var(--ui-color-text-primary);
  transition:
    border-color var(--ui-transition-fast),
    box-shadow var(--ui-transition-fast);
}

.ui-input__control::placeholder {
  color: var(--ui-color-text-muted);
}

.ui-input__control:hover:not(:disabled) {
  border-color: var(--ui-color-border-strong);
}

.ui-input__control:focus-visible {
  outline: none;
  border-color: var(--ui-color-brand-500);
  box-shadow: var(--ui-shadow-focus);
}

.ui-input__control:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.ui-input__control--invalid {
  border-color: var(--ui-color-danger-500);
}

.ui-input__control--invalid:focus-visible {
  box-shadow: 0 0 0 3px rgb(239 68 68 / 30%);
}

.ui-input--sm .ui-input__control {
  min-height: 36px;
  padding: 0 var(--ui-space-3);
  font-size: var(--ui-font-size-sm);
}

.ui-input--md .ui-input__control {
  min-height: 44px;
  padding: 0 var(--ui-space-4);
  font-size: var(--ui-font-size-md);
}

.ui-input--lg .ui-input__control {
  min-height: 52px;
  padding: 0 var(--ui-space-5);
  font-size: var(--ui-font-size-lg);
}

.ui-input__hint {
  font-size: var(--ui-font-size-xs);
  color: var(--ui-color-text-muted);
}

.ui-input__hint--invalid {
  color: var(--ui-color-danger-500);
}
</style>
