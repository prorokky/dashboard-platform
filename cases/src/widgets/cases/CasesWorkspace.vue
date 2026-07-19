<script setup lang="ts">
import { computed } from "vue";
import type { EngineeringCase } from "../../entities/case/model/types.ts";
import { downloadCasesCsv } from "../../features/case-export/lib/exportCases.ts";
import {
  type CaseFilters,
  useCaseExplorer,
} from "../../features/case-explorer/model/useCaseExplorer.ts";
import CaseDetailsPanel from "./CaseDetailsPanel.vue";
import CasesFilters from "./CasesFilters.vue";
import CasesHeader from "./CasesHeader.vue";
import CasesLoadState from "./CasesLoadState.vue";
import CasesPagination from "./CasesPagination.vue";
import CasesSummary from "./CasesSummary.vue";
import CasesTable from "./CasesTable.vue";

const props = defineProps<{
  cases: EngineeringCase[];
  error: string | null;
  loadedAt: string | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  refresh: [];
}>();

const casesRef = computed(() => props.cases);
const isInitialLoading = computed(
  () => props.loading && props.cases.length === 0,
);

const {
  activeFilterCount,
  actorOptions,
  filteredCases,
  filters,
  page,
  paginatedCases,
  resetFilters,
  selectCase,
  selectedCase,
  setSort,
  sortBy,
  sortDirection,
  totalPages,
} = useCaseExplorer(casesRef);

function updateFilter(key: keyof CaseFilters, value: string) {
  Object.assign(filters, { [key]: value });
}
</script>

<template>
  <main class="cases-content">
    <CasesHeader
      :cases-count="filteredCases.length"
      :loaded-at="loadedAt"
      :loading="loading"
      @export="downloadCasesCsv(filteredCases)"
      @refresh="emit('refresh')"
    />
    <CasesLoadState
      v-if="isInitialLoading || (error && !cases.length)"
      :error="error"
      :loading="isInitialLoading"
      @refresh="emit('refresh')"
    />
    <template v-else>
      <div v-if="error" class="inline-warning" role="status">
        Showing the last successful GitHub response. Refresh failed: {{ error }}
      </div>
      <CasesSummary :cases="cases" />
      <CasesFilters
        :active-filter-count="activeFilterCount"
        :actor-options="actorOptions"
        :filters="filters"
        @reset="resetFilters"
        @update="updateFilter"
      />
      <section class="workspace-grid">
        <div class="cases-list">
          <CasesTable
            :cases="paginatedCases"
            :selected-case-id="selectedCase?.id"
            :sort-by="sortBy"
            :sort-direction="sortDirection"
            :total="filteredCases.length"
            @select="selectCase"
            @sort="setSort"
          />
          <CasesPagination
            :page="page"
            :total-pages="totalPages"
            @change="page = $event"
          />
        </div>
        <CaseDetailsPanel :item="selectedCase" />
      </section>
    </template>
  </main>
</template>

<style scoped>
.cases-content {
  min-height: 100vh;
  padding: 28px;
  background: #f5f7fb;
  color: #111827;
}

.inline-warning {
  margin-bottom: 14px;
  border-radius: 8px;
  padding: 12px 14px;
  background: #fffbeb;
  color: #b45309;
  font-size: 13px;
}

.workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.65fr) minmax(300px, 0.72fr);
  align-items: start;
  gap: 16px;
  margin-top: 16px;
}

.cases-list {
  min-width: 0;
}

.workspace-grid > :last-child {
  position: sticky;
  top: 16px;
}

@media (max-width: 1150px) {
  .workspace-grid {
    grid-template-columns: 1fr;
  }

  .workspace-grid > :last-child {
    position: static;
  }
}

@media (max-width: 740px) {
  .cases-content {
    padding: 12px;
  }
}
</style>
