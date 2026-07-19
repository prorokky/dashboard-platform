<script setup lang="ts">
import { Download, ExternalLink, RefreshCw } from "@lucide/vue";
import { UiButton } from "platform-ui";
import { formatRelativeDate } from "../../shared/lib/caseFormatters.ts";

defineProps<{
  casesCount: number;
  loadedAt: string | null;
  loading: boolean;
}>();

const emit = defineEmits<{
  export: [];
  refresh: [];
}>();
</script>

<template>
  <header class="cases-header">
    <div class="cases-header__copy">
      <p class="cases-header__eyebrow">Platform Deck</p>
      <h1>GitHub Cases</h1>
      <p>
        Repository activity, issues, pull requests, and workflow runs in one
        operational view.
      </p>
    </div>
    <div class="cases-header__actions">
      <span class="sync-pill">
        <span class="sync-pill__dot" />
        {{
          loadedAt
            ? `Synced ${formatRelativeDate(loadedAt)}`
            : "GitHub live data"
        }}
      </span>
      <a
        aria-label="Open repository on GitHub"
        class="icon-link"
        href="https://github.com/prorokky/dashboard-platform"
        target="_blank"
        title="Open repository on GitHub"
      >
        <ExternalLink :size="17" />
      </a>
      <UiButton
        class="light-button"
        :disabled="casesCount === 0"
        size="sm"
        variant="secondary"
        @click="emit('export')"
      >
        <Download :size="16" />
        Export CSV
      </UiButton>
      <UiButton
        :loading="loading"
        size="sm"
        variant="primary"
        @click="emit('refresh')"
      >
        <RefreshCw :size="16" />
        Refresh
      </UiButton>
    </div>
  </header>
</template>

<style scoped>
.cases-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.cases-header__copy {
  min-width: 0;
}

.cases-header__eyebrow {
  margin-bottom: 6px;
  color: #4f46e5;
  font-size: 13px;
  font-weight: 800;
}

.cases-header h1 {
  color: #0f172a;
  font-size: 30px;
  line-height: 1.15;
}

.cases-header__copy > p:last-child {
  max-width: 680px;
  margin-top: 7px;
  color: #64748b;
  font-size: 14px;
}

.cases-header__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  flex-wrap: wrap;
}

.sync-pill,
.icon-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 800;
}

.light-button {
  --button-bg: #ffffff;
  --button-border: #e2e8f0;
  --button-color: #475569;
  --button-hover-bg: #f8fafc;
  --button-hover-border: #cbd5e1;
}

.sync-pill {
  gap: 7px;
  padding: 0 11px;
  background: #dcfce7;
  color: #15803d;
}

.sync-pill__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
}

.icon-link {
  width: 36px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #475569;
}

@media (max-width: 900px) {
  .cases-header {
    display: grid;
  }

  .cases-header__actions {
    justify-content: flex-start;
  }
}

@media (max-width: 560px) {
  .cases-header h1 {
    font-size: 26px;
  }
}
</style>
