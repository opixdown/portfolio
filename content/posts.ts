// Your X and LinkedIn posts for the activity banner and /work.
// Add the newest post at the top. Leave out replies.
//
// {
//   source: "x",            // or "linkedin"
//   text: "What the post says",
//   url: "https://x.com/atharva76067495/status/123",
//   date: "2026-11-06",
// },

export type SocialPost = {
  source: "x" | "linkedin";
  text: string;
  url: string;
  date: string;
};

export const posts: SocialPost[] = [];
