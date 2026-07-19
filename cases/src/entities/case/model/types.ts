export type CaseKind =
  | "activity"
  | "commit"
  | "issue"
  | "pull-request"
  | "workflow";

export type CaseStatus = "closed" | "completed" | "failed" | "open" | "running";

export type CaseSeverity = "attention" | "critical" | "info" | "success";

export type CaseActor = {
  avatarUrl?: string;
  login: string;
  url?: string;
};

export type CaseAttribute = {
  label: string;
  value: string;
};

export type CaseTimelineItem = {
  at: string;
  description: string;
  title: string;
  tone: CaseSeverity;
};

export type CaseLinkedEntity = {
  label: string;
  url?: string;
  value: string;
};

export type EngineeringCase = {
  actor: CaseActor;
  attributes: CaseAttribute[];
  createdAt: string;
  id: string;
  kind: CaseKind;
  labels: string[];
  linkedEntities: CaseLinkedEntity[];
  repository: string;
  severity: CaseSeverity;
  source: string;
  status: CaseStatus;
  summary: string;
  timeline: CaseTimelineItem[];
  title: string;
  updatedAt: string;
  url: string;
};
