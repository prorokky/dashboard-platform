<script setup lang="ts">
import { Search, SlidersHorizontal, X } from "@lucide/vue";
import { UiButton, UiCard } from "platform-ui";
import type { CaseFilters } from "../../features/case-explorer/model/useCaseExplorer.ts";
import { caseKindLabels, caseStatusLabels } from "../../shared/lib/caseFormatters.ts";

defineProps<{
  activeFilterCount: number;
  actorOptions: string[];
  filters: CaseFilters;
}>();

const emit = defineEmits<{
  reset: [];
  update: [key: keyof CaseFilters, value: string];
}>();

const kindOptions = Object.entries(caseKindLabels);
const statusOptions = Object.entries(caseStatusLabels);

const getValue = (event: Event) => {
  return (event.target as HTMLInputElement | HTMLSelectElement).value;
};
</script>

<template>
  <UiCard class="filter-card" padding="md">
    <div class="filter-card__heading">
      <div class="filter-card__title">
        <SlidersHorizontal :size="17" />
        <span>Filters</span>
        <span v-if="activeFilterCount" class="filter-count">{{ activeFilterCount }}</span>
      </div>
      <UiButton
        v-if="activeFilterCount"
        aria-label="Reset filters"
        size="sm"
        title="Reset filters"
        variant="ghost"
        @click="emit('reset')"
      >
        <X :size="16" />
        Reset
      </UiButton>
    </div>
    <div class="filter-grid">
      <label class="field field--search">
        <span>Search</span>
        <div class="search-control">
          <Search :size="16" />
          <input
            placeholder="Title, actor, label..."
            type="search"
            :value="filters.search"
            @input="emit('update', 'search', getValue($event))"
          />
        </div>
      </label>
      <label class="field">
        <span>Type</span>
        <select :value="filters.kind" @change="emit('update', 'kind', getValue($event))">
          <option value="all">All types</option>
          <option v-for="[value, label] in kindOptions" :key="value" :value="value">
            {{ label }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Status</span>
        <select :value="filters.status" @change="emit('update', 'status', getValue($event))">
          <option value="all">All statuses</option>
          <option v-for="[value, label] in statusOptions" :key="value" :value="value">
            {{ label }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>Actor</span>
        <select :value="filters.actor" @change="emit('update', 'actor', getValue($event))">
          <option value="all">All actors</option>
          <option v-for="actor in actorOptions" :key="actor" :value="actor">
            {{ actor }}
          </option>
        </select>
      </label>
      <label class="field">
        <span>From</span>
        <input
          type="date"
          :value="filters.from"
          @input="emit('update', 'from', getValue($event))"
        />
      </label>
      <label class="field">
        <span>To</span>
        <input type="date" :value="filters.to" @input="emit('update', 'to', getValue($event))" />
      </label>
    </div>
  </UiCard>
</template>

<style scoped>
.filter-card {
  margin-top: 16px;
  border-color: #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 6%);
}

.filter-card__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-card__title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  font-size: 14px;
  font-weight: 850;
}

.filter-count {
  display: inline-grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #eef2ff;
  color: #4338ca;
  font-size: 11px;
}

.filter-grid {
  display: grid;
  grid-template-columns: minmax(220px, 1.6fr) repeat(5, minmax(120px, 1fr));
  gap: 12px;
}

.field {
  display: grid;
  gap: 7px;
  min-width: 0;
  color: #64748b;
  font-size: 11px;
  font-weight: 750;
}

.field input,
.field select,
.search-control {
  width: 100%;
  min-height: 38px;
  border: 1px solid #dbe3ee;
  border-radius: 8px;
  background: #f8fafc;
  color: #0f172a;
  font-size: 13px;
  font-weight: 500;
}

.field > input,
.field select {
  padding: 0 10px;
}

.field input:focus,
.field select:focus,
.search-control:focus-within {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgb(99 102 241 / 14%);
}

.search-control {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 10px;
  color: #94a3b8;
}

.search-control input {
  min-height: 34px;
  border: 0;
  padding: 0;
  background: transparent;
}

.search-control input:focus {
  box-shadow: none;
}

@media (max-width: 1280px) {
  .filter-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .field--search {
    grid-column: span 2;
  }
}

@media (max-width: 720px) {
  .filter-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .filter-grid {
    grid-template-columns: 1fr;
  }

  .field--search {
    grid-column: auto;
  }
}
</style>
