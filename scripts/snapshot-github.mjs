// Refreshes data/github-snapshot.json using your logged-in `gh` CLI.
// Run with: npm run snapshot
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
import { GITHUB_QUERY } from "../lib/github-query.mjs";
import { normalizeGitHub } from "../lib/github-normalize.mjs";

const output = execFileSync("gh", ["api", "graphql", "-f", `query=${GITHUB_QUERY}`], {
  encoding: "utf8",
  maxBuffer: 50 * 1024 * 1024,
});
const data = normalizeGitHub(JSON.parse(output));
writeFileSync(new URL("../data/github-snapshot.json", import.meta.url), JSON.stringify(data, null, 2) + "\n");
console.log(`Saved ${data.feed.length} feed items and ${data.days.length} days.`);
