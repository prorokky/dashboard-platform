<script setup lang="ts">
import { ChevronLeft, ChevronRight } from "@lucide/vue";
import { UiButton } from "platform-ui";

defineProps<{
  page: number;
  totalPages: number;
}>();

const emit = defineEmits<{
  change: [page: number];
}>();
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="Cases pagination" class="pagination">
    <UiButton
      aria-label="Previous page"
      class="light-button"
      :disabled="page === 1"
      size="sm"
      title="Previous page"
      variant="secondary"
      @click="emit('change', page - 1)"
    >
      <ChevronLeft :size="16" />
    </UiButton>
    <span>Page {{ page }} of {{ totalPages }}</span>
    <UiButton
      aria-label="Next page"
      class="light-button"
      :disabled="page === totalPages"
      size="sm"
      title="Next page"
      variant="secondary"
      @click="emit('change', page + 1)"
    >
      <ChevronRight :size="16" />
    </UiButton>
  </nav>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 14px;
}

.pagination span {
  color: #64748b;
  font-size: 11px;
  font-weight: 750;
}

.light-button {
  --button-bg: #ffffff;
  --button-border: #e2e8f0;
  --button-color: #475569;
  --button-hover-bg: #f8fafc;
  --button-hover-border: #cbd5e1;
}
</style>
