import type {
  CaseKind,
  CaseSeverity,
  CaseStatus,
} from "../../entities/case/model/types.ts";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "short",
  year: "numeric",
});

export const caseKindLabels: Record<CaseKind, string> = {
  activity: "Activity",
  commit: "Commit",
  issue: "Issue",
  "pull-request": "Pull request",
  workflow: "Workflow",
};

export const caseStatusLabels: Record<CaseStatus, string> = {
  closed: "Closed",
  completed: "Completed",
  failed: "Failed",
  open: "Open",
  running: "Running",
};

export const caseSeverityLabels: Record<CaseSeverity, string> = {
  attention: "Needs attention",
  critical: "Critical",
  info: "Informational",
  success: "Healthy",
};

export function formatCaseDate(value: string) {
  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "Unknown date"
    : dateFormatter.format(date);
}

export function formatRelativeDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "unknown";
  }

  const minutes = Math.max(
    0,
    Math.floor((Date.now() - date.getTime()) / 60_000),
  );

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);

  return days < 30 ? `${days}d ago` : formatCaseDate(value);
}
