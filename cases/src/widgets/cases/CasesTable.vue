<script setup lang="ts">
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronRight } from "@lucide/vue";
import { UiCard } from "platform-ui";
import type { EngineeringCase } from "../../entities/case/model/types.ts";
import type {
  CaseSortKey,
  SortDirection,
} from "../../features/case-explorer/model/useCaseExplorer.ts";
import {
  caseKindLabels,
  caseStatusLabels,
  formatRelativeDate,
} from "../../shared/lib/caseFormatters.ts";

defineProps<{
  cases: EngineeringCase[];
  selectedCaseId?: string;
  sortBy: CaseSortKey;
  sortDirection: SortDirection;
  total: number;
}>();

const emit = defineEmits<{
  select: [id: string];
  sort: [key: CaseSortKey];
}>();

const columns: Array<{ key: CaseSortKey; label: string }> = [
  { key: "title", label: "Case" },
  { key: "kind", label: "Type" },
  { key: "status", label: "Status" },
  { key: "actor", label: "Actor" },
  { key: "updatedAt", label: "Updated" },
];
</script>

<template>
  <UiCard class="table-card" padding="md">
    <div class="table-card__heading">
      <div>
        <h2>Engineering signals</h2>
        <p>{{ total }} results from GitHub</p>
      </div>
    </div>
    <div v-if="cases.length" class="table-scroll">
      <table>
        <thead>
          <tr>
            <th v-for="column in columns" :key="column.key">
              <button type="button" @click="emit('sort', column.key)">
                {{ column.label }}
                <ArrowUp
                  v-if="sortBy === column.key && sortDirection === 'asc'"
                  :size="14"
                />
                <ArrowDown
                  v-else-if="sortBy === column.key && sortDirection === 'desc'"
                  :size="14"
                />
                <ArrowUpDown v-else :size="14" />
              </button>
            </th>
            <th aria-label="Open details" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="item in cases"
            :key="item.id"
            :class="{ 'is-selected': item.id === selectedCaseId }"
            tabindex="0"
            @click="emit('select', item.id)"
            @keydown.enter="emit('select', item.id)"
          >
            <td>
              <div class="case-cell">
                <span
                  class="severity-marker"
                  :class="`severity-marker--${item.severity}`"
                />
                <div>
                  <strong>{{ item.title }}</strong>
                  <span>{{ item.source }} · {{ item.repository }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="type-label">{{ caseKindLabels[item.kind] }}</span>
            </td>
            <td>
              <span
                class="status-label"
                :class="`status-label--${item.status}`"
              >
                {{ caseStatusLabels[item.status] }}
              </span>
            </td>
            <td>
              <div class="actor-cell">
                <img
                  v-if="item.actor.avatarUrl"
                  :alt="item.actor.login"
                  :src="item.actor.avatarUrl"
                />
                <span v-else class="actor-cell__fallback">{{
                  item.actor.login.slice(0, 1)
                }}</span>
                <span>{{ item.actor.login }}</span>
              </div>
            </td>
            <td>
              <time :datetime="item.updatedAt">{{
                formatRelativeDate(item.updatedAt)
              }}</time>
            </td>
            <td><ChevronRight :size="17" /></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else class="empty-state">
      <p>No cases match these filters.</p>
      <span>Try widening the date range or clearing a filter.</span>
    </div>
  </UiCard>
</template>

<style scoped>
.table-card {
  min-width: 0;
  border-color: #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 6%);
}

.table-card__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.table-card__heading h2 {
  color: #0f172a;
  font-size: 16px;
  font-weight: 850;
}

.table-card__heading p {
  margin-top: 4px;
  color: #64748b;
  font-size: 12px;
}

.table-scroll {
  overflow-x: auto;
  margin: 0 -24px;
}

table {
  width: 100%;
  min-width: 820px;
  border-collapse: collapse;
}

th {
  border-block: 1px solid #e2e8f0;
  padding: 0;
  background: #f8fafc;
  text-align: left;
}

th:first-child,
td:first-child {
  padding-left: 24px;
}

th:last-child,
td:last-child {
  width: 42px;
  padding-right: 18px;
}

th button {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 42px;
  border: 0;
  padding: 0 12px;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  font-size: 11px;
  font-weight: 800;
}

tbody tr {
  border-bottom: 1px solid #e2e8f0;
  cursor: pointer;
  transition: background-color 120ms ease;
}

tbody tr:hover,
tbody tr:focus,
tbody tr.is-selected {
  outline: none;
  background: #f7f8ff;
}

tbody tr.is-selected {
  box-shadow: inset 3px 0 #4f46e5;
}

td {
  height: 70px;
  padding: 10px 12px;
  color: #475569;
  font-size: 12px;
}

.case-cell {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 11px;
  max-width: 360px;
}

.case-cell div {
  min-width: 0;
}

.case-cell strong,
.case-cell span:last-child {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.case-cell strong {
  color: #0f172a;
  font-size: 13px;
  font-weight: 800;
}

.case-cell span:last-child {
  margin-top: 5px;
  color: #94a3b8;
  font-size: 11px;
}

.severity-marker {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #0ea5e9;
  box-shadow: 0 0 0 4px rgb(14 165 233 / 12%);
}

.severity-marker--attention {
  background: #f59e0b;
  box-shadow: 0 0 0 4px rgb(245 158 11 / 14%);
}

.severity-marker--critical {
  background: #ef4444;
  box-shadow: 0 0 0 4px rgb(239 68 68 / 12%);
}

.severity-marker--success {
  background: #22c55e;
  box-shadow: 0 0 0 4px rgb(34 197 94 / 12%);
}

.type-label {
  color: #475569;
  font-weight: 700;
}

.status-label {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  border-radius: 999px;
  padding: 0 9px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 10px;
  font-weight: 850;
}

.status-label--open,
.status-label--running {
  background: #fef3c7;
  color: #b45309;
}

.status-label--failed {
  background: #fee2e2;
  color: #b91c1c;
}

.status-label--closed,
.status-label--completed {
  background: #dcfce7;
  color: #15803d;
}

.actor-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
}

.actor-cell img,
.actor-cell__fallback {
  width: 26px;
  height: 26px;
  border-radius: 50%;
}

.actor-cell img {
  object-fit: cover;
}

.actor-cell__fallback {
  display: grid;
  place-items: center;
  background: #e2e8f0;
  color: #475569;
  text-transform: uppercase;
}

.empty-state {
  display: grid;
  justify-items: center;
  gap: 5px;
  min-height: 220px;
  place-content: center;
  color: #64748b;
  text-align: center;
}

.empty-state p {
  color: #0f172a;
  font-size: 14px;
  font-weight: 800;
}

.empty-state span {
  font-size: 12px;
}
</style>
