import type { EngineeringCase } from "../../../entities/case/model/types.ts";
import type {
  GithubCommitDto,
  GithubEventDto,
  GithubIssueDto,
  GithubUserDto,
  GithubWorkflowRunsDto,
} from "./types.ts";

const GITHUB_API_URL = "https://api.github.com";
const REPOSITORY = "prorokky/dashboard-platform";
const REPOSITORY_URL = `https://github.com/${REPOSITORY}`;

type GithubSourceResult = {
  cases: EngineeringCase[];
  source: string;
};

const githubHeaders = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
};

export const fetchGithubCases = async (): Promise<EngineeringCase[]> => {
  const sources = await Promise.allSettled([
    loadSource("commits", `/repos/${REPOSITORY}/commits?per_page=30`, mapCommits),
    loadSource("issues", `/repos/${REPOSITORY}/issues?state=all&per_page=30`, mapIssues),
    loadSource("events", `/repos/${REPOSITORY}/events?per_page=30`, mapEvents),
    loadSource("workflow runs", `/repos/${REPOSITORY}/actions/runs?per_page=30`, mapWorkflowRuns),
  ]);

  const loaded = sources
    .filter(
      (result): result is PromiseFulfilledResult<GithubSourceResult> =>
        result.status === "fulfilled",
    )
    .flatMap((result) => result.value.cases);

  if (loaded.length === 0) {
    const reasons = sources
      .filter((result): result is PromiseRejectedResult => result.status === "rejected")
      .map((result) => String(result.reason));

    throw new Error(reasons[0] ?? "GitHub returned no case data");
  }

  return loaded
    .filter(
      (item, index, items) => items.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .sort((first, second) => Date.parse(second.updatedAt) - Date.parse(first.updatedAt));
};

async function loadSource<T>(
  source: string,
  path: string,
  mapper: (data: T) => EngineeringCase[],
): Promise<GithubSourceResult> {
  const response = await fetch(`${GITHUB_API_URL}${path}`, {
    headers: githubHeaders,
  });

  if (!response.ok) {
    throw new Error(`Could not load GitHub ${source}: ${response.status}`);
  }

  return {
    cases: mapper((await response.json()) as T),
    source,
  };
}

export const mapCommits = (commits: GithubCommitDto[]): EngineeringCase[] => {
  return commits.map((commit) => {
    const createdAt = commit.commit.author?.date ?? new Date(0).toISOString();
    const title = commit.commit.message.split("\n")[0] || "Untitled commit";
    const actor = mapActor(commit.author, commit.commit.author?.name);
    const verified = commit.commit.verification?.verified === true;

    return {
      actor,
      attributes: [
        { label: "SHA", value: commit.sha.slice(0, 7) },
        { label: "Verification", value: verified ? "Verified" : "Unsigned" },
        { label: "Comments", value: String(commit.commit.comment_count ?? 0) },
      ],
      createdAt,
      id: `commit-${commit.sha}`,
      kind: "commit",
      labels: verified ? ["verified"] : ["unsigned"],
      linkedEntities: [
        { label: "Repository", url: REPOSITORY_URL, value: REPOSITORY },
        ...(commit.parents ?? []).slice(0, 1).map((parent) => ({
          label: "Parent commit",
          url: parent.html_url,
          value: parent.sha?.slice(0, 7) ?? "Unknown",
        })),
      ],
      repository: REPOSITORY,
      severity: verified ? "success" : "info",
      source: "Commits",
      status: "completed",
      summary: commit.commit.message,
      timeline: [
        {
          at: createdAt,
          description: `${actor.login} pushed commit ${commit.sha.slice(0, 7)}.`,
          title: "Commit created",
          tone: "info",
        },
      ],
      title,
      updatedAt: createdAt,
      url: commit.html_url,
    };
  });
};

export const mapIssues = (issues: GithubIssueDto[]): EngineeringCase[] => {
  return issues.map((issue) => {
    const isPullRequest = Boolean(issue.pull_request);
    const kind = isPullRequest ? "pull-request" : "issue";
    const status = issue.state;
    const severity = status === "open" ? "attention" : "success";
    const labels =
      issue.labels
        ?.map((label) => (typeof label === "string" ? label : label.name))
        .filter((label): label is string => Boolean(label)) ?? [];

    return {
      actor: mapActor(issue.user),
      attributes: [
        { label: "Number", value: `#${issue.number}` },
        { label: "Comments", value: String(issue.comments ?? 0) },
        {
          label: "Assignees",
          value: issue.assignees?.map((item) => item.login).join(", ") || "None",
        },
      ],
      createdAt: issue.created_at,
      id: `${kind}-${issue.number}`,
      kind,
      labels,
      linkedEntities: [
        { label: "Repository", url: REPOSITORY_URL, value: REPOSITORY },
        {
          label: isPullRequest ? "Pull request" : "Issue",
          url: issue.html_url,
          value: `#${issue.number}`,
        },
      ],
      repository: REPOSITORY,
      severity,
      source: isPullRequest ? "Pull requests" : "Issues",
      status,
      summary: issue.body?.trim() || `GitHub ${kind} #${issue.number}`,
      timeline: [
        {
          at: issue.created_at,
          description: `${isPullRequest ? "Pull request" : "Issue"} opened by ${issue.user?.login ?? "GitHub user"}.`,
          title: "Opened",
          tone: "attention",
        },
        ...(issue.closed_at
          ? [
              {
                at: issue.closed_at,
                description: `GitHub ${kind} was closed.`,
                title: "Closed",
                tone: "success" as const,
              },
            ]
          : []),
      ],
      title: issue.title,
      updatedAt: issue.updated_at,
      url: issue.html_url,
    };
  });
};

export const mapEvents = (events: GithubEventDto[]): EngineeringCase[] => {
  return events
    .filter((event) => event.type !== "PushEvent")
    .map((event) => {
      const eventName = humanizeEvent(event.type);
      const actor = mapActor(event.actor);
      const repository = event.repo?.name ?? REPOSITORY;

      return {
        actor,
        attributes: [
          { label: "Event ID", value: event.id },
          { label: "Event type", value: event.type },
          { label: "Visibility", value: "Public" },
        ],
        createdAt: event.created_at,
        id: `event-${event.id}`,
        kind: "activity",
        labels: [eventName.toLowerCase()],
        linkedEntities: [
          {
            label: "Repository",
            url: `https://github.com/${repository}`,
            value: repository,
          },
          ...(actor.url ? [{ label: "Actor", url: actor.url, value: actor.login }] : []),
        ],
        repository,
        severity: "info",
        source: "Repository events",
        status: "completed",
        summary: `${actor.login} generated a ${eventName.toLowerCase()} event in ${repository}.`,
        timeline: [
          {
            at: event.created_at,
            description: `GitHub recorded ${eventName.toLowerCase()} by ${actor.login}.`,
            title: eventName,
            tone: "info",
          },
        ],
        title: `${eventName} by ${actor.login}`,
        updatedAt: event.created_at,
        url: `https://github.com/${repository}/activity`,
      };
    });
};

export const mapWorkflowRuns = (data: GithubWorkflowRunsDto): EngineeringCase[] => {
  return (data.workflow_runs ?? []).map((run) => {
    const status = mapWorkflowStatus(run.status, run.conclusion);
    const severity =
      status === "failed" ? "critical" : status === "running" ? "attention" : "success";
    const actor = mapActor(run.actor);

    return {
      actor,
      attributes: [
        { label: "Run", value: `#${run.run_number ?? run.id}` },
        { label: "Attempt", value: String(run.run_attempt ?? 1) },
        { label: "Trigger", value: run.event ?? "Unknown" },
      ],
      createdAt: run.created_at,
      id: `workflow-${run.id}`,
      kind: "workflow",
      labels: [run.event ?? "workflow"],
      linkedEntities: [
        { label: "Repository", url: REPOSITORY_URL, value: REPOSITORY },
        { label: "Branch", value: run.head_branch ?? "Unknown" },
      ],
      repository: REPOSITORY,
      severity,
      source: "GitHub Actions",
      status,
      summary: `${run.name ?? "Workflow"} run triggered by ${run.event ?? "GitHub"}.`,
      timeline: [
        {
          at: run.created_at,
          description: `${actor.login} started the workflow on ${run.head_branch ?? "the default branch"}.`,
          title: "Workflow started",
          tone: "info",
        },
        {
          at: run.updated_at,
          description: `Workflow status changed to ${run.conclusion ?? run.status ?? "unknown"}.`,
          title: status === "running" ? "In progress" : "Workflow finished",
          tone: severity,
        },
      ],
      title: run.name ?? `Workflow run #${run.run_number ?? run.id}`,
      updatedAt: run.updated_at,
      url: run.html_url,
    };
  });
};

const mapActor = (user?: GithubUserDto | null, fallback = "GitHub user") => {
  return {
    avatarUrl: user?.avatar_url,
    login: user?.login ?? fallback,
    url: user?.html_url,
  };
};

const mapWorkflowStatus = (status?: string, conclusion?: string | null) => {
  if (conclusion === "failure" || conclusion === "timed_out" || conclusion === "cancelled") {
    return "failed" as const;
  }

  if (status === "in_progress" || status === "queued" || status === "waiting") {
    return "running" as const;
  }

  return "completed" as const;
};

const humanizeEvent = (value: string) => {
  return value.replace(/Event$/, "").replace(/([a-z])([A-Z])/g, "$1 $2");
};
