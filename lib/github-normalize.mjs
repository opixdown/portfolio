import { GITHUB_LOGIN, PROJECT_REPOS } from "./github-query.mjs";

/**
 * Turns the raw GraphQL response into the shape the site renders.
 * Anything from a private repository is dropped here, so private work cannot
 * reach a page or the saved snapshot, whichever token produced the response.
 */
export function normalizeGitHub(raw, generatedAt = new Date().toISOString()) {
  const data = raw.data;
  const collection = data.user.contributionsCollection;
  const isPublic = (repository) => repository && repository.isPrivate === false;

  const pullRequests = data.user.pullRequests.nodes
    .filter((pr) => isPublic(pr.repository))
    .map((pr) => ({
      id: pr.url,
      kind: pr.state === "MERGED" ? "merged" : "open",
      title: pr.title.trim(),
      url: pr.url,
      date: pr.mergedAt ?? pr.createdAt,
      repo: pr.repository.nameWithOwner,
      number: pr.number,
      plus: pr.additions,
      minus: pr.deletions,
    }));

  const issues = data.user.issues.nodes
    .filter((issue) => isPublic(issue.repository))
    .map((issue) => ({
      id: issue.url,
      kind: "issue",
      title: issue.title.trim(),
      url: issue.url,
      date: issue.createdAt,
      repo: issue.repository.nameWithOwner,
      number: issue.number,
    }));

  const commits = PROJECT_REPOS.flatMap((_, index) => {
    const repository = data[`project${index}`];
    if (!isPublic(repository)) return [];
    const history = repository.defaultBranchRef?.target?.history?.nodes ?? [];
    return history
      .filter((commit) => commit.author?.user?.login === GITHUB_LOGIN)
      .filter((commit) => !commit.messageHeadline.startsWith("Merge "))
      .map((commit) => ({
        id: commit.url,
        kind: "commit",
        title: commit.messageHeadline.trim(),
        url: commit.url,
        date: commit.committedDate,
        repo: repository.nameWithOwner,
        plus: commit.additions,
        minus: commit.deletions,
      }));
  });

  const days = collection.contributionCalendar.weeks.flatMap((week) =>
    week.contributionDays.map((day) => ({ date: day.date, count: day.contributionCount })),
  );

  return {
    generatedAt,
    totals: {
      contributions:
        collection.contributionCalendar.totalContributions - collection.restrictedContributionsCount,
      commits: collection.totalCommitContributions,
      pullRequests: collection.totalPullRequestContributions,
      issues: collection.totalIssueContributions,
      reviews: collection.totalPullRequestReviewContributions,
      lfortranMerged: data.lfMerged.issueCount,
      lfortranOpen: data.lfOpen.issueCount,
      lfortranIssues: data.lfIssues.issueCount,
    },
    days,
    feed: [...pullRequests, ...issues, ...commits].sort((a, b) => b.date.localeCompare(a.date)),
  };
}
