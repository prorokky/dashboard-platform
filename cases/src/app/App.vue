<script setup lang="ts">
import { onMounted } from "vue";
import { useCasesStore } from "../stores/cases.ts";
import { casesPinia } from "../stores/pinia.ts";
import CasesWorkspace from "../widgets/cases/CasesWorkspace.vue";

const casesStore = useCasesStore(casesPinia);

onMounted(() => {
  casesStore.fetchCases();
});
</script>

<template>
  <CasesWorkspace
    :cases="casesStore.cases"
    :error="casesStore.error"
    :loaded-at="casesStore.loadedAt"
    :loading="casesStore.loading"
    @refresh="casesStore.fetchCases()"
  />
</template>
