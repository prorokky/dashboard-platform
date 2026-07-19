import { defineStore } from "pinia";
import type { EngineeringCase } from "../entities/case/model/types.ts";
import { fetchGithubCases } from "../shared/api/github/githubCasesApi.ts";

type CasesState = {
  cases: EngineeringCase[];
  error: string | null;
  loadedAt: string | null;
  loading: boolean;
};

const initialState = (): CasesState => ({
  cases: [],
  error: null,
  loadedAt: null,
  loading: false,
});

export const useCasesStore = defineStore("cases", {
  actions: {
    async fetchCases() {
      this.loading = true;
      this.error = null;

      try {
        this.cases = await fetchGithubCases();
        this.loadedAt = new Date().toISOString();
      } catch (error) {
        this.error =
          error instanceof Error
            ? error.message
            : "Could not load GitHub cases";
      } finally {
        this.loading = false;
      }
    },
  },
  state: initialState,
});
