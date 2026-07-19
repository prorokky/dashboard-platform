import { computed, reactive, type Ref, ref, watch } from "vue";
import type {
  CaseKind,
  CaseStatus,
  EngineeringCase,
} from "../../../entities/case/model/types.ts";

export type CaseFilters = {
  actor: string;
  from: string;
  kind: CaseKind | "all";
  search: string;
  status: CaseStatus | "all";
  to: string;
};

export type CaseSortKey = "actor" | "kind" | "status" | "title" | "updatedAt";
export type SortDirection = "asc" | "desc";

const PAGE_SIZE = 8;

export function createInitialFilters(): CaseFilters {
  return {
    actor: "all",
    from: "",
    kind: "all",
    search: "",
    status: "all",
    to: "",
  };
}

export function filterCases(cases: EngineeringCase[], filters: CaseFilters) {
  const query = filters.search.trim().toLowerCase();
  const fromTime = filters.from ? Date.parse(`${filters.from}T00:00:00`) : null;
  const toTime = filters.to ? Date.parse(`${filters.to}T23:59:59`) : null;

  return cases.filter((item) => {
    const searchable = [
      item.title,
      item.summary,
      item.actor.login,
      item.repository,
      item.source,
      ...item.labels,
    ]
      .join(" ")
      .toLowerCase();
    const updatedAt = Date.parse(item.updatedAt);

    return (
      (!query || searchable.includes(query)) &&
      (filters.actor === "all" || item.actor.login === filters.actor) &&
      (filters.kind === "all" || item.kind === filters.kind) &&
      (filters.status === "all" || item.status === filters.status) &&
      (fromTime === null || updatedAt >= fromTime) &&
      (toTime === null || updatedAt <= toTime)
    );
  });
}

export function useCaseExplorer(cases: Readonly<Ref<EngineeringCase[]>>) {
  const filters = reactive(createInitialFilters());
  const page = ref(1);
  const selectedCaseId = ref<string | null>(null);
  const sortBy = ref<CaseSortKey>("updatedAt");
  const sortDirection = ref<SortDirection>("desc");

  const actorOptions = computed(() =>
    [...new Set(cases.value.map((item) => item.actor.login))].sort(
      (first, second) => first.localeCompare(second),
    ),
  );

  const filteredCases = computed(() => filterCases(cases.value, filters));
  const sortedCases = computed(() =>
    [...filteredCases.value].sort((first, second) => {
      const firstValue = getSortValue(first, sortBy.value);
      const secondValue = getSortValue(second, sortBy.value);
      const comparison = firstValue.localeCompare(secondValue);

      return sortDirection.value === "asc" ? comparison : -comparison;
    }),
  );
  const totalPages = computed(() =>
    Math.max(1, Math.ceil(sortedCases.value.length / PAGE_SIZE)),
  );
  const paginatedCases = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE;

    return sortedCases.value.slice(start, start + PAGE_SIZE);
  });
  const selectedCase = computed(
    () =>
      cases.value.find((item) => item.id === selectedCaseId.value) ??
      paginatedCases.value[0] ??
      null,
  );
  const activeFilterCount = computed(
    () =>
      Object.entries(filters).filter(([key, value]) => {
        if (key === "actor" || key === "kind" || key === "status") {
          return value !== "all";
        }

        return Boolean(value);
      }).length,
  );

  watch(
    filters,
    () => {
      page.value = 1;
      selectedCaseId.value = null;
    },
    { deep: true },
  );

  watch(totalPages, (value) => {
    page.value = Math.min(page.value, value);
  });

  function resetFilters() {
    Object.assign(filters, createInitialFilters());
  }

  function selectCase(id: string) {
    selectedCaseId.value = id;
  }

  function setSort(key: CaseSortKey) {
    if (sortBy.value === key) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
      return;
    }

    sortBy.value = key;
    sortDirection.value = key === "updatedAt" ? "desc" : "asc";
  }

  return {
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
  };
}

function getSortValue(item: EngineeringCase, key: CaseSortKey) {
  if (key === "actor") {
    return item.actor.login;
  }

  return item[key];
}
