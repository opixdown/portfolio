import { cacheLife } from "next/cache";
import snapshot from "@/data/github-snapshot.json";
import { GITHUB_QUERY } from "./github-query.mjs";
import { normalizeGitHub } from "./github-normalize.mjs";

export type FeedKind = "merged" | "open" | "commit" | "issue";

export type FeedItem = {
  id: string;
  kind: FeedKind;
  title: string;
  url: string;
  date: string;
  repo: string;
  number?: number;
  plus?: number;
  minus?: number;
};

export type GitHubData = {
  generatedAt: string;
  totals: {
    contributions: number;
    commits: number;
    pullRequests: number;
    issues: number;
    reviews: number;
    lfortranMerged: number;
    lfortranOpen: number;
    lfortranIssues: number;
  };
  days: { date: string; count: number }[];
  feed: FeedItem[];
};

/** Live data when GITHUB_TOKEN is set, otherwise the snapshot in data/. */
export async function getGitHub(): Promise<GitHubData> {
  "use cache";
  cacheLife("hours");

  const token = process.env.GITHUB_TOKEN;
  if (!token) return snapshot as GitHubData;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query: GITHUB_QUERY }),
    });
    if (!response.ok) throw new Error(`GitHub responded ${response.status}`);
    const raw = await response.json();
    if (raw.errors) throw new Error(raw.errors[0]?.message ?? "GitHub query failed");
    return normalizeGitHub(raw) as GitHubData;
  } catch (error) {
    console.error("Falling back to the GitHub snapshot:", error);
    return snapshot as GitHubData;
  }
}
