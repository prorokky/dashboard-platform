export type GithubUserDto = {
  avatar_url?: string;
  html_url?: string;
  login?: string;
};

export type GithubLabelDto = {
  name?: string;
};

export type GithubIssueDto = {
  assignees?: GithubUserDto[];
  body?: string | null;
  closed_at?: string | null;
  comments?: number;
  created_at: string;
  html_url: string;
  labels?: Array<GithubLabelDto | string>;
  number: number;
  pull_request?: {
    html_url?: string;
  };
  state: "closed" | "open";
  title: string;
  updated_at: string;
  user?: GithubUserDto;
};

export type GithubCommitDto = {
  author?: GithubUserDto | null;
  commit: {
    author?: {
      date?: string;
      name?: string;
    };
    comment_count?: number;
    message: string;
    verification?: {
      reason?: string;
      verified?: boolean;
    };
  };
  html_url: string;
  parents?: Array<{
    html_url?: string;
    sha?: string;
  }>;
  sha: string;
};

export type GithubEventDto = {
  actor?: GithubUserDto;
  created_at: string;
  id: string;
  payload?: Record<string, unknown>;
  repo?: {
    name?: string;
  };
  type: string;
};

export type GithubWorkflowRunDto = {
  actor?: GithubUserDto;
  conclusion?: string | null;
  created_at: string;
  event?: string;
  head_branch?: string | null;
  html_url: string;
  id: number;
  name?: string;
  run_attempt?: number;
  run_number?: number;
  status?: string;
  updated_at: string;
};

export type GithubWorkflowRunsDto = {
  workflow_runs?: GithubWorkflowRunDto[];
};
