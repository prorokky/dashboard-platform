import { readFile } from "node:fs/promises";
import { expect, test, type Page } from "@playwright/test";
import {
  createGithubPlan,
  defaultGithubBodies,
  githubSources,
  mockGithubSources,
} from "./github-mocks.js";

const FIXED_NOW = new Date("2026-07-29T12:00:00Z");

const expectSummaryMetric = async (page: Page, label: string, value: string) => {
  const metric = page.getByRole("region", { name: "Cases summary" }).locator(".summary-card", {
    hasText: label,
  });

  await expect(metric.locator(".summary-card__value")).toHaveText(value);
};

const failedResponse = {
  body: { message: "GitHub API is unavailable" },
  status: 503,
};

test.beforeEach(async ({ page }) => {
  await page.clock.setFixedTime(FIXED_NOW);
});

test.describe("cases workspace", () => {
  test("renders aggregated GitHub cases, summary metrics, and selected details", async ({ page }) => {
    await mockGithubSources(page);

    await page.goto("/");

    await expect(page.getByRole("heading", { name: "GitHub Cases" })).toBeVisible();
    await expect(page.getByText("Synced just now")).toBeVisible();
    await expect(page.getByText("16 results from GitHub")).toBeVisible();
    await expectSummaryMetric(page, "Total signals", "16");
    await expectSummaryMetric(page, "Open work", "2");
    await expectSummaryMetric(page, "Workflow failures", "1");
    await expectSummaryMetric(page, "Contributors", "6");

    const details = page.locator(".details-card");
    await expect(details.getByRole("heading", { name: "Deploy" })).toBeVisible();
    await expect(details).toContainText("Workflow");
    await expect(details).toContainText("Completed");
    await expect(details).toContainText("Healthy");
    await expect(details).toContainText("Workflow started");
    await expect(details).toContainText("Workflow finished");
    await expect(details).toContainText("Branch");
    await expect(details).toContainText("main");
  });

  test("shows a loading skeleton until every GitHub source settles", async ({ page }) => {
    let completeCommitsRequest = () => {};
    const commitsCompleted = new Promise<void>((resolve) => {
      completeCommitsRequest = resolve;
    });

    await mockGithubSources(page, {
      commits: [{ body: defaultGithubBodies.commits, waitFor: commitsCompleted }],
    });

    await page.goto("/");

    await expect(page.getByRole("region", { name: "Loading GitHub cases" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Refresh" })).toBeDisabled();
    await expect(page.getByRole("region", { name: "Cases summary" })).toHaveCount(0);

    completeCommitsRequest();

    await expect(page.getByRole("region", { name: "Loading GitHub cases" })).toBeHidden();
    await expect(page.getByRole("region", { name: "Cases summary" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Refresh" })).toBeEnabled();
  });

  test("shows a retryable error when every GitHub source fails", async ({ page }) => {
    const retryPlan = createGithubPlan((source) => [
      failedResponse,
      { body: defaultGithubBodies[source] },
    ]);
    await mockGithubSources(page, retryPlan);

    await page.goto("/");

    await expect(page.getByRole("heading", { name: "Could not load GitHub cases" })).toBeVisible();
    await expect(page.getByText("Could not load GitHub commits: 503")).toBeVisible();
    await expect(page.getByRole("button", { name: "Export CSV" })).toBeDisabled();

    await page.getByRole("button", { name: "Try again" }).click();

    await expect(page.getByRole("heading", { name: "Could not load GitHub cases" })).toBeHidden();
    await expect(page.getByText("16 results from GitHub")).toBeVisible();
    await expect(page.getByRole("button", { name: "Export CSV" })).toBeEnabled();
  });

  test("keeps data from healthy GitHub sources when one source fails", async ({ page }) => {
    await mockGithubSources(page, {
      commits: [failedResponse],
    });

    await page.goto("/");

    await expect(page.getByText("7 results from GitHub")).toBeVisible();
    await expectSummaryMetric(page, "Total signals", "7");
    await expect(page.getByRole("heading", { name: "Deploy" })).toBeVisible();
    await expect(page.getByText("Could not load GitHub cases")).toHaveCount(0);
    await expect(page.getByText("Commit 09: platform change")).toHaveCount(0);
  });

  test("keeps the previous response visible when refresh fails", async ({ page }) => {
    const refreshFailurePlan = createGithubPlan((source) => [
      { body: defaultGithubBodies[source] },
      failedResponse,
    ]);
    const requests = await mockGithubSources(page, refreshFailurePlan);

    await page.goto("/");

    await expect(page.getByText("16 results from GitHub")).toBeVisible();
    await page.getByRole("button", { name: "Refresh" }).click();

    await expect(page.getByRole("status")).toContainText(
      "Showing the last successful GitHub response. Refresh failed",
    );
    await expect(page.getByText("16 results from GitHub")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Deploy" })).toBeVisible();

    for (const source of githubSources) {
      await expect.poll(() => requests.getRequestCount(source)).toBe(2);
    }
  });

  test("combines filters, renders an empty state, and resets the workspace", async ({ page }) => {
    await mockGithubSources(page);
    await page.goto("/");

    const filterCard = page.locator(".filter-card");
    const filterSelects = filterCard.getByRole("combobox");
    const dateInputs = filterCard.locator('input[type="date"]');

    await filterCard.getByRole("searchbox").fill("quoted");
    await filterSelects.nth(0).selectOption("issue");
    await filterSelects.nth(1).selectOption("open");
    await filterSelects.nth(2).selectOption("alice");
    await dateInputs.nth(0).fill("2026-07-10");
    await dateInputs.nth(1).fill("2026-07-10");

    await expect(page.locator(".filter-count")).toHaveText("6");
    await expect(page.getByText("1 results from GitHub")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: 'fix: handle "quoted" cases' }),
    ).toBeVisible();

    await filterCard.getByRole("searchbox").fill("missing case");

    await expect(page.getByText("No cases match these filters.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Export CSV" })).toBeDisabled();

    await page.getByRole("button", { name: "Reset filters" }).click();

    await expect(page.getByText("16 results from GitHub")).toBeVisible();
    await expect(page.getByRole("button", { name: "Reset filters" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Export CSV" })).toBeEnabled();
    await expect(page.getByRole("navigation", { name: "Cases pagination" })).toBeVisible();
  });

  test("sorts, paginates, and selects cases with mouse and keyboard", async ({ page }) => {
    await mockGithubSources(page);
    await page.goto("/");

    const rows = page.locator("tbody tr");
    await expect(rows.first()).toContainText("Deploy");

    await page.getByRole("button", { name: "Actor", exact: true }).click();
    await expect(rows.first()).toContainText("alice");

    await page.getByRole("button", { name: "Actor", exact: true }).click();
    await expect(rows.first()).toContainText("octocat");

    await page.getByRole("button", { name: "Updated", exact: true }).click();
    await expect(rows.first()).toContainText("Deploy");

    const pagination = page.getByRole("navigation", { name: "Cases pagination" });
    await expect(pagination).toContainText("Page 1 of 2");
    await expect(page.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await page.getByRole("button", { name: "Next page" }).click();
    await expect(pagination).toContainText("Page 2 of 2");
    await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();

    const commitEightRow = rows.filter({ hasText: "Commit 08: platform change" });
    await commitEightRow.click();
    await expect(page.getByRole("heading", { name: "Commit 08: platform change" })).toBeVisible();

    const commitSevenRow = rows.filter({ hasText: "Commit 07: platform change" });
    await commitSevenRow.focus();
    await commitSevenRow.press("Enter");
    await expect(page.getByRole("heading", { name: "Commit 07: platform change" })).toBeVisible();

    await page.getByRole("button", { name: "Previous page" }).click();
    await expect(pagination).toContainText("Page 1 of 2");
  });

  test("downloads a CSV containing only filtered cases and escaped values", async ({ page }) => {
    await mockGithubSources(page);
    await page.goto("/");
    await page.locator(".filter-card").getByRole("searchbox").fill("quoted");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export CSV" }).click();
    const download = await downloadPromise;
    const downloadPath = await download.path();

    expect(download.suggestedFilename()).toBe("github-cases-2026-07-29.csv");
    expect(downloadPath).not.toBeNull();

    const csv = await readFile(downloadPath as string, "utf8");
    const rows = csv.split("\n");

    expect(rows).toHaveLength(2);
    expect(rows[0]).toBe(
      '"ID","Title","Type","Status","Source","Actor","Updated","URL"',
    );
    expect(rows[1]).toContain('"fix: handle ""quoted"" cases"');
    expect(rows[1]).toContain('"issue"');
    expect(rows[1]).toContain('"alice"');
    expect(csv).not.toContain('"Deploy"');
  });
});
