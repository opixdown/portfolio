import { connection } from "next/server";
import { addComment, commentsEnabled, isRateLimited, listComments } from "@/lib/comments";

const MAX_NAME = 40;
const MAX_MESSAGE = 500;
const LINK_PATTERN = /https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|io|ru|xyz|top|shop)\b/i;

export async function GET() {
  await connection();
  if (!commentsEnabled) return Response.json({ enabled: false, comments: [] });
  try {
    return Response.json({ enabled: true, comments: await listComments() });
  } catch (error) {
    console.error("Could not load comments:", error);
    return Response.json({ error: "Comments couldn't load." }, { status: 502 });
  }
}

export async function POST(request: Request) {
  await connection();
  if (!commentsEnabled) return Response.json({ error: "Comments aren't switched on yet." }, { status: 503 });

  const body = await request.json().catch(() => null);
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";

  // Bots fill the hidden field. Pretend it worked so they don't retry.
  if (body?.website) return Response.json({ ok: true });

  if (!name || name.length > MAX_NAME) {
    return Response.json({ error: `Add a name of up to ${MAX_NAME} characters.` }, { status: 400 });
  }
  if (!message || message.length > MAX_MESSAGE) {
    return Response.json({ error: `Keep your note between 1 and ${MAX_MESSAGE} characters.` }, { status: 400 });
  }
  if (LINK_PATTERN.test(name) || LINK_PATTERN.test(message)) {
    return Response.json({ error: "Links aren't allowed here." }, { status: 400 });
  }

  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (await isRateLimited(ip)) {
      return Response.json({ error: "That's a few notes already. Try again in a little while." }, { status: 429 });
    }
    return Response.json({ comment: await addComment(name, message) }, { status: 201 });
  } catch (error) {
    console.error("Could not save comment:", error);
    return Response.json({ error: "Your note couldn't be saved. Try again." }, { status: 502 });
  }
}
