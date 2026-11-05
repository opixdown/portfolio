# Atharva's portfolio

Next.js site with three pages: `/`, `/work` and `/book`.

## Run it

```bash
npm install
npm run dev
```

## Update things

- **Text, projects, links:** `content/site.ts`
- **X and LinkedIn posts:** add them to the top of the list in `content/posts.ts`. They show up in the banner and on `/work`.
- **GitHub data:** set `GITHUB_TOKEN` on the host and it refreshes every hour. Use a token with no private access, such as a classic token with no scopes. Without a token the site uses `data/github-snapshot.json`, which `npm run snapshot` refreshes through your logged-in `gh` CLI.

Private repositories are dropped in `lib/github-normalize.mjs`, so they can't reach a page.
