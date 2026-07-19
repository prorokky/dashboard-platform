<script setup lang="ts">
import { ExternalLink, GitBranch, Tag, UserRound } from "@lucide/vue";
import { UiCard } from "platform-ui";
import type { EngineeringCase } from "../../entities/case/model/types.ts";
import {
  caseKindLabels,
  caseSeverityLabels,
  caseStatusLabels,
  formatCaseDate,
} from "../../shared/lib/caseFormatters.ts";

defineProps<{
  item: EngineeringCase | null;
}>();
</script>

<template>
  <UiCard class="details-card" padding="md">
    <template v-if="item">
      <div class="details-card__heading">
        <div>
          <p class="details-card__eyebrow">Selected case</p>
          <h2>{{ item.title }}</h2>
        </div>
        <a
          aria-label="Open case on GitHub"
          class="details-card__link"
          :href="item.url"
          target="_blank"
          title="Open case on GitHub"
        >
          <ExternalLink :size="17" />
        </a>
      </div>

      <div class="badge-row">
        <span class="badge badge--kind">{{ caseKindLabels[item.kind] }}</span>
        <span class="badge" :class="`badge--${item.status}`">
          {{ caseStatusLabels[item.status] }}
        </span>
        <span class="badge badge--severity">{{
          caseSeverityLabels[item.severity]
        }}</span>
      </div>

      <p class="details-card__summary">{{ item.summary }}</p>

      <section class="details-section">
        <h3>Timeline</h3>
        <ol class="timeline">
          <li
            v-for="event in item.timeline"
            :key="`${event.at}-${event.title}`"
          >
            <span
              class="timeline__dot"
              :class="`timeline__dot--${event.tone}`"
            />
            <div>
              <strong>{{ event.title }}</strong>
              <p>{{ event.description }}</p>
              <time :datetime="event.at">{{ formatCaseDate(event.at) }}</time>
            </div>
          </li>
        </ol>
      </section>

      <section class="details-section">
        <h3>Attributes</h3>
        <dl class="attribute-list">
          <div v-for="attribute in item.attributes" :key="attribute.label">
            <dt>{{ attribute.label }}</dt>
            <dd>{{ attribute.value }}</dd>
          </div>
        </dl>
      </section>

      <section v-if="item.labels.length" class="details-section">
        <h3><Tag :size="14" /> Labels</h3>
        <div class="labels">
          <span v-for="label in item.labels" :key="label">{{ label }}</span>
        </div>
      </section>

      <section class="details-section">
        <h3>Related entities</h3>
        <div class="entity-list">
          <component
            :is="entity.url ? 'a' : 'div'"
            v-for="entity in item.linkedEntities"
            :key="`${entity.label}-${entity.value}`"
            :href="entity.url"
            :target="entity.url ? '_blank' : undefined"
          >
            <GitBranch v-if="entity.label !== 'Actor'" :size="15" />
            <UserRound v-else :size="15" />
            <span>
              <small>{{ entity.label }}</small>
              <strong>{{ entity.value }}</strong>
            </span>
            <ExternalLink v-if="entity.url" :size="14" />
          </component>
        </div>
      </section>
    </template>
    <div v-else class="details-empty">
      <p>Select a case to inspect its timeline and related entities.</p>
    </div>
  </UiCard>
</template>

<style scoped>
.details-card {
  min-width: 0;
  border-color: #e2e8f0;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgb(15 23 42 / 6%);
}

.details-card__heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.details-card__eyebrow {
  margin-bottom: 5px;
  color: #4f46e5;
  font-size: 11px;
  font-weight: 850;
  text-transform: uppercase;
}

.details-card h2 {
  overflow-wrap: anywhere;
  color: #0f172a;
  font-size: 17px;
  font-weight: 850;
  line-height: 1.35;
}

.details-card__link {
  display: inline-grid;
  flex: 0 0 34px;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #475569;
}

.badge-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.badge {
  display: inline-flex;
  min-height: 24px;
  align-items: center;
  border-radius: 999px;
  padding: 0 8px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 10px;
  font-weight: 800;
}

.badge--open,
.badge--running {
  background: #fef3c7;
  color: #b45309;
}

.badge--failed {
  background: #fee2e2;
  color: #b91c1c;
}

.badge--closed,
.badge--completed {
  background: #dcfce7;
  color: #15803d;
}

.badge--severity {
  background: #f1f5f9;
  color: #475569;
}

.details-card__summary {
  display: -webkit-box;
  overflow: hidden;
  margin-top: 16px;
  color: #475569;
  font-size: 12px;
  line-height: 1.65;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
}

.details-section {
  margin-top: 20px;
  border-top: 1px solid #e2e8f0;
  padding-top: 18px;
}

.details-section h3 {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  color: #0f172a;
  font-size: 12px;
  font-weight: 850;
}

.timeline {
  display: grid;
  gap: 14px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.timeline li {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 10px;
}

.timeline__dot {
  width: 9px;
  height: 9px;
  margin-top: 4px;
  border-radius: 50%;
  background: #0ea5e9;
  box-shadow: 0 0 0 4px rgb(14 165 233 / 12%);
}

.timeline__dot--attention {
  background: #f59e0b;
}

.timeline__dot--critical {
  background: #ef4444;
}

.timeline__dot--success {
  background: #22c55e;
}

.timeline strong {
  color: #0f172a;
  font-size: 12px;
}

.timeline p,
.timeline time {
  display: block;
  margin-top: 3px;
  color: #64748b;
  font-size: 11px;
}

.timeline time {
  color: #94a3b8;
}

.attribute-list {
  display: grid;
  gap: 10px;
  margin: 0;
}

.attribute-list div {
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.attribute-list dt,
.attribute-list dd {
  margin: 0;
  font-size: 11px;
}

.attribute-list dt {
  color: #64748b;
}

.attribute-list dd {
  overflow-wrap: anywhere;
  color: #0f172a;
  font-weight: 800;
  text-align: right;
}

.labels {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.labels span {
  border-radius: 999px;
  padding: 4px 8px;
  background: #f1f5f9;
  color: #475569;
  font-size: 10px;
  font-weight: 700;
}

.entity-list {
  display: grid;
  gap: 8px;
}

.entity-list > * {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 9px;
  border-radius: 8px;
  padding: 9px 10px;
  background: #f8fafc;
  color: #475569;
  text-decoration: none;
}

.entity-list span {
  min-width: 0;
}

.entity-list small,
.entity-list strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.entity-list small {
  color: #94a3b8;
  font-size: 9px;
}

.entity-list strong {
  margin-top: 2px;
  color: #0f172a;
  font-size: 11px;
}

.details-empty {
  display: grid;
  min-height: 240px;
  place-items: center;
  color: #64748b;
  font-size: 12px;
  text-align: center;
}
</style>
