const repo = (alias, name) => `${alias}: repository(owner: "opixdown", name: "${name}") { ...Repo }`;

export const GITHUB_LOGIN = "opixdown";
export const PROJECT_REPOS = ["packetworld", "wipe", "CineCache", "statspro"];

export const GITHUB_QUERY = `
query {
  user(login: "${GITHUB_LOGIN}") {
    contributionsCollection {
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      totalPullRequestReviewContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks { contributionDays { date contributionCount } }
      }
    }
    pullRequests(first: 60, states: [OPEN, MERGED], orderBy: { field: CREATED_AT, direction: DESC }) {
      nodes {
        title url number state createdAt mergedAt additions deletions
        repository { nameWithOwner isPrivate }
      }
    }
    issues(first: 20, orderBy: { field: CREATED_AT, direction: DESC }) {
      nodes { title url number createdAt repository { nameWithOwner isPrivate } }
    }
  }
  ${PROJECT_REPOS.map((name, i) => repo(`project${i}`, name)).join("\n  ")}
  lfMerged: search(query: "repo:lfortran/lfortran is:pr is:merged author:${GITHUB_LOGIN}", type: ISSUE, first: 1) { issueCount }
  lfOpen: search(query: "repo:lfortran/lfortran is:pr is:open author:${GITHUB_LOGIN}", type: ISSUE, first: 1) { issueCount }
  lfIssues: search(query: "repo:lfortran/lfortran is:issue author:${GITHUB_LOGIN}", type: ISSUE, first: 1) { issueCount }
}
fragment Repo on Repository {
  nameWithOwner isPrivate
  defaultBranchRef {
    target {
      ... on Commit {
        history(first: 8) {
          nodes { messageHeadline committedDate url additions deletions author { user { login } } }
        }
      }
    }
  }
}`;
