import { describe, expect, it } from "vitest";
import type { EngineeringCase } from "../../../entities/case/model/types.ts";
import { createInitialFilters, filterCases } from "./useCaseExplorer.ts";

const baseCase: EngineeringCase = {
  actor: { login: "octocat" },
  attributes: [],
  createdAt: "2026-07-10T10:00:00Z",
  id: "commit-1",
  kind: "commit",
  labels: ["frontend"],
  linkedEntities: [],
  repository: "prorokky/dashboard-platform",
  severity: "info",
  source: "Commits",
  status: "completed",
  summary: "Add cases table",
  timeline: [],
  title: "feat: add cases table",
  updatedAt: "2026-07-10T10:00:00Z",
  url: "https://github.com/example/commit/1",
};

describe("filterCases", () => {
  it("searches across title, actor, and labels", () => {
    const filters = createInitialFilters();
    filters.search = "frontend";

    expect(filterCases([baseCase], filters)).toEqual([baseCase]);
  });

  it("combines type, status, actor, and date filters", () => {
    const filters = {
      ...createInitialFilters(),
      actor: "octocat",
      from: "2026-07-01",
      kind: "commit" as const,
      status: "completed" as const,
      to: "2026-07-31",
    };

    expect(filterCases([baseCase], filters)).toHaveLength(1);
    expect(
      filterCases([{ ...baseCase, status: "failed" }], filters),
    ).toHaveLength(0);
  });
});
