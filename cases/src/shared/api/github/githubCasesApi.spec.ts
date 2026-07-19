import { describe, expect, it } from "vitest";
import { mapCommits, mapIssues, mapWorkflowRuns } from "./githubCasesApi.ts";

describe("GitHub cases mapper", () => {
  it("normalizes commits into the shared case contract", () => {
    const [result] = mapCommits([
      {
        author: { login: "octocat" },
        commit: {
          author: { date: "2026-07-10T10:00:00Z" },
          message: "feat: add filters\n\nDetails",
          verification: { verified: true },
        },
        html_url: "https://github.com/example/commit/abc",
        sha: "abcdef123456",
      },
    ]);

    expect(result).toMatchObject({
      actor: { login: "octocat" },
      kind: "commit",
      status: "completed",
      title: "feat: add filters",
    });
  });

  it("distinguishes pull requests from issues", () => {
    const [result] = mapIssues([
      {
        created_at: "2026-07-10T10:00:00Z",
        html_url: "https://github.com/example/pull/42",
        number: 42,
        pull_request: {},
        state: "open",
        title: "Add cases interface",
        updated_at: "2026-07-11T10:00:00Z",
        user: { login: "octocat" },
      },
    ]);

    expect(result).toMatchObject({
      id: "pull-request-42",
      kind: "pull-request",
      severity: "attention",
      status: "open",
    });
  });

  it("marks failed workflow runs as critical", () => {
    const [result] = mapWorkflowRuns({
      workflow_runs: [
        {
          conclusion: "failure",
          created_at: "2026-07-10T10:00:00Z",
          html_url: "https://github.com/example/actions/runs/1",
          id: 1,
          name: "Checks",
          status: "completed",
          updated_at: "2026-07-10T10:04:00Z",
        },
      ],
    });

    expect(result).toMatchObject({ severity: "critical", status: "failed" });
  });
});
