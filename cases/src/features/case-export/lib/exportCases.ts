import type { EngineeringCase } from "../../../entities/case/model/types.ts";

const columns = [
  "ID",
  "Title",
  "Type",
  "Status",
  "Source",
  "Actor",
  "Updated",
  "URL",
];

export function createCasesCsv(cases: EngineeringCase[]) {
  const rows = cases.map((item) => [
    item.id,
    item.title,
    item.kind,
    item.status,
    item.source,
    item.actor.login,
    item.updatedAt,
    item.url,
  ]);

  return [columns, ...rows]
    .map((row) => row.map(escapeCsvValue).join(","))
    .join("\n");
}

export function downloadCasesCsv(cases: EngineeringCase[]) {
  const blob = new Blob([createCasesCsv(cases)], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = `github-cases-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function escapeCsvValue(value: string) {
  return `"${value.replaceAll('"', '""')}"`;
}
