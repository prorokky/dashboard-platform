import type { Page, Route } from "@playwright/test";

const REPOSITORY_PATH = "/repos/prorokky/dashboard-platform";

export const githubSources = ["commits", "issues", "events", "workflows"] as const;

export type GithubSource = (typeof githubSources)[number];

export type GithubMockResponse = {
  body: unknown;
  status?: number;
  waitFor?: Promise<void>;
};

export type GithubMockPlan = Partial<Record<GithubSource, GithubMockResponse[]>>;

const users = {
  alice: {
    avatar_url: "https://avatars.githubusercontent.com/u/1?v=4",
    html_url: "https://github.com/alice",
    login: "alice",
  },
  bob: {
    avatar_url: "https://avatars.githubusercontent.com/u/2?v=4",
    html_url: "https://github.com/bob",
    login: "bob",
  },
  carol: { html_url: "https://github.com/carol", login: "carol" },
  dave: { login: "dave" },
  eve: { login: "eve" },
  octocat: { login: "octocat" },
};

const commits = Array.from({ length: 9 }, (_, index) => {
  const number = index + 1;
  const paddedNumber = String(number).padStart(2, "0");
  const sha = `${number}`.repeat(12).slice(0, 12);

  return {
    author: number % 2 === 0 ? users.alice : users.octocat,
    commit: {
      author: { date: `2026-07-${paddedNumber}T10:00:00Z` },
      comment_count: number,
      message: `Commit ${paddedNumber}: platform change`,
      verification: { verified: number % 2 === 1 },
    },
    html_url: `https://github.com/prorokky/dashboard-platform/commit/${sha}`,
    parents: [],
    sha,
  };
});

const issues = [
  {
    assignees: [users.bob],
    body: "Quoted CSV value and frontend filtering coverage.",
    comments: 2,
    created_at: "2026-07-10T09:00:00Z",
    html_url: "https://github.com/prorokky/dashboard-platform/issues/42",
    labels: ["frontend", { name: "bug" }],
    number: 42,
    state: "open",
    title: 'fix: handle "quoted" cases',
    updated_at: "2026-07-10T12:00:00Z",
    user: users.alice,
  },
  {
    body: "Add composable filters.",
    comments: 1,
    created_at: "2026-07-11T09:00:00Z",
    html_url: "https://github.com/prorokky/dashboard-platform/pull/43",
    labels: ["feature"],
    number: 43,
    pull_request: {
      html_url: "https://github.com/prorokky/dashboard-platform/pull/43",
    },
    state: "open",
    title: "feat: cases filters",
    updated_at: "2026-07-11T12:00:00Z",
    user: users.bob,
  },
  {
    body: null,
    closed_at: "2026-07-12T11:00:00Z",
    comments: 0,
    created_at: "2026-07-12T09:00:00Z",
    html_url: "https://github.com/prorokky/dashboard-platform/issues/44",
    labels: [],
    number: 44,
    state: "closed",
    title: "docs: close legacy case",
    updated_at: "2026-07-12T12:00:00Z",
    user: users.alice,
  },
];

const events = [
  {
    actor: users.carol,
    created_at: "2026-07-13T12:00:00Z",
    id: "event-watch",
    repo: { name: "prorokky/dashboard-platform" },
    type: "WatchEvent",
  },
  {
    actor: users.carol,
    created_at: "2026-07-13T11:00:00Z",
    id: "event-push",
    repo: { name: "prorokky/dashboard-platform" },
    type: "PushEvent",
  },
];

const workflowRuns = {
  workflow_runs: [
    {
      actor: users.dave,
      conclusion: "failure",
      created_at: "2026-07-15T10:00:00Z",
      event: "push",
      head_branch: "main",
      html_url: "https://github.com/prorokky/dashboard-platform/actions/runs/1",
      id: 1,
      name: "CI",
      run_attempt: 1,
      run_number: 1,
      status: "completed",
      updated_at: "2026-07-15T12:00:00Z",
    },
    {
      actor: users.bob,
      conclusion: null,
      created_at: "2026-07-14T10:00:00Z",
      event: "pull_request",
      head_branch: "feature/cases",
      html_url: "https://github.com/prorokky/dashboard-platform/actions/runs/2",
      id: 2,
      name: "Preview",
      run_attempt: 1,
      run_number: 2,
      status: "in_progress",
      updated_at: "2026-07-14T12:00:00Z",
    },
    {
      actor: users.eve,
      conclusion: "success",
      created_at: "2026-07-16T10:00:00Z",
      event: "workflow_dispatch",
      head_branch: "main",
      html_url: "https://github.com/prorokky/dashboard-platform/actions/runs/3",
      id: 3,
      name: "Deploy",
      run_attempt: 1,
      run_number: 3,
      status: "completed",
      updated_at: "2026-07-16T12:00:00Z",
    },
  ],
};

export const defaultGithubBodies: Record<GithubSource, unknown> = {
  commits,
  events,
  issues,
  workflows: workflowRuns,
};

const sourcePaths: Record<GithubSource, string> = {
  commits: `${REPOSITORY_PATH}/commits`,
  events: `${REPOSITORY_PATH}/events`,
  issues: `${REPOSITORY_PATH}/issues`,
  workflows: `${REPOSITORY_PATH}/actions/runs`,
};

const fulfillJson = async (route: Route, response: GithubMockResponse) => {
  await response.waitFor;
  await route.fulfill({
    body: JSON.stringify(response.body),
    headers: {
      "access-control-allow-headers": "*",
      "access-control-allow-origin": "*",
      "content-type": "application/json",
    },
    status: response.status ?? 200,
  });
};

export const createGithubPlan = (
  createResponses: (source: GithubSource) => GithubMockResponse[],
): GithubMockPlan => {
  return Object.fromEntries(
    githubSources.map((source) => [source, createResponses(source)]),
  ) as GithubMockPlan;
};

export const mockGithubSources = async (page: Page, plan: GithubMockPlan = {}) => {
  const requestCounts: Record<GithubSource, number> = {
    commits: 0,
    events: 0,
    issues: 0,
    workflows: 0,
  };

  await page.route(
    (url) => url.hostname === "api.github.com" && url.pathname.startsWith(REPOSITORY_PATH),
    async (route) => {
      const requestUrl = route.request().url().split("?")[0] ?? "";
      const pathname = requestUrl.replace("https://api.github.com", "");
      const source = githubSources.find((candidate) => sourcePaths[candidate] === pathname);

      if (!source) {
        await fulfillJson(route, {
          body: { message: "Unexpected GitHub request in test" },
          status: 404,
        });
        return;
      }

      const responses = plan[source] ?? [{ body: defaultGithubBodies[source] }];
      const requestIndex = requestCounts[source];
      const response = responses[Math.min(requestIndex, responses.length - 1)] ?? {
        body: defaultGithubBodies[source],
      };
      requestCounts[source] += 1;

      await fulfillJson(route, response);
    },
  );

  return {
    getRequestCount: (source: GithubSource) => requestCounts[source],
  };
};
