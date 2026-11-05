import { createHash, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

export type Comment = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

const LIST_KEY = "portfolio:comments";
const MAX_SHOWN = 50;
const RATE_LIMIT = 3;
const RATE_WINDOW_SECONDS = 600;
const LOCAL_FILE = path.join(process.cwd(), ".data", "comments.json");

const redisUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const hasRedis = Boolean(redisUrl && redisToken);

/** Vercel's disk is read-only, so comments there need Redis. Local runs use a file. */
export const commentsEnabled = hasRedis || !process.env.VERCEL;

async function redis<T>(command: (string | number)[]): Promise<T> {
  const response = await fetch(redisUrl!, {
    method: "POST",
    headers: { Authorization: `Bearer ${redisToken}`, "Content-Type": "application/json" },
    body: JSON.stringify(command),
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Comment store responded ${response.status}`);
  const body = await response.json();
  return body.result as T;
}

async function readLocal(): Promise<Comment[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, "utf8"));
  } catch {
    return [];
  }
}

export async function listComments(): Promise<Comment[]> {
  if (!hasRedis) return (await readLocal()).slice(0, MAX_SHOWN);
  const rows = await redis<string[]>(["LRANGE", LIST_KEY, 0, MAX_SHOWN - 1]);
  return rows.map((row) => JSON.parse(row) as Comment);
}

export async function addComment(name: string, message: string): Promise<Comment> {
  const comment: Comment = { id: randomUUID(), name, message, createdAt: new Date().toISOString() };
  if (hasRedis) {
    await redis(["LPUSH", LIST_KEY, JSON.stringify(comment)]);
    return comment;
  }
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify([comment, ...(await readLocal())], null, 2));
  return comment;
}

/** Allows a few comments per visitor per window. Stores only a hash of the address. */
export async function isRateLimited(ip: string): Promise<boolean> {
  if (!hasRedis) return false;
  const key = `portfolio:rate:${createHash("sha256").update(ip).digest("hex").slice(0, 24)}`;
  const count = await redis<number>(["INCR", key]);
  if (count === 1) await redis(["EXPIRE", key, RATE_WINDOW_SECONDS]);
  return count > RATE_LIMIT;
}
