import { posts, type SocialPost } from "@/content/posts";
import type { FeedItem } from "./github";

export type ActivityItem =
  | ({ source: "github" } & FeedItem)
  | ({ source: "x" | "linkedin"; id: string; kind: "post"; title: string } & Omit<SocialPost, "source" | "text">);

export function mergeActivity(feed: FeedItem[]): ActivityItem[] {
  const social: ActivityItem[] = posts.map((post) => ({
    source: post.source,
    id: post.url,
    kind: "post",
    title: post.text,
    url: post.url,
    date: post.date,
  }));
  const github: ActivityItem[] = feed.map((item) => ({ ...item, source: "github" }));
  return [...social, ...github].sort((a, b) => b.date.localeCompare(a.date));
}

/** The newest items, with at most two from any one repo so the list stays varied. */
export function latestActivity(items: ActivityItem[], count: number): ActivityItem[] {
  const seen = new Map<string, number>();
  return items
    .filter((item) => {
      const key = item.source === "github" ? item.repo : item.id;
      seen.set(key, (seen.get(key) ?? 0) + 1);
      return seen.get(key)! <= 2;
    })
    .slice(0, count);
}

const dayFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });
const monthFormat = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

export const formatDay = (date: string) => dayFormat.format(new Date(date));
export const formatMonth = (date: string) => monthFormat.format(new Date(date));

export const shortRepo = (repo: string) => repo.replace(/^opixdown\//, "");

/** Rounds down to a friendly figure: 135 becomes "100+", and 200 stays "200". */
export function rounded(value: number): string {
  if (value < 10) return String(value);
  const unit = 10 ** Math.floor(Math.log10(value));
  const floor = Math.floor(value / unit) * unit;
  return floor === value ? String(value) : `${floor}+`;
}

export const compact = (value: number) =>
  value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, "")}k` : String(value);
