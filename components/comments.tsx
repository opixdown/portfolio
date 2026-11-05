"use client";

import { type FormEvent, useEffect, useState } from "react";
import type { Comment } from "@/lib/comments";

const MAX_MESSAGE = 500;
const inputClass =
  "w-full rounded-md border border-line bg-transparent px-3 text-base text-fg outline-none transition-colors duration-150 placeholder:text-subtle hover:border-line-strong focus:border-fg sm:text-sm";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "disabled" | "failed">("loading");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/comments")
      .then((response) => {
        if (!response.ok) throw new Error("load failed");
        return response.json();
      })
      .then((data) => {
        if (cancelled) return;
        setComments(data.comments);
        setStatus(data.enabled ? "ready" : "disabled");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setSending(true);
    setError("");
    setSent(false);
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, website }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error ?? "Your note couldn't be saved. Try again.");
        return;
      }
      if (data.comment) setComments((current) => [data.comment, ...current]);
      setMessage("");
      setSent(true);
    } catch {
      setError("Your note couldn't be saved. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  if (status === "disabled") {
    return <p className="text-sm text-muted">Notes open soon.</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="comment-name" className="mb-1.5 block text-sm text-muted">
            Your name
          </label>
          <input
            id="comment-name"
            required
            maxLength={40}
            autoComplete="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className={`${inputClass} h-11 sm:max-w-[280px]`}
          />
        </div>
        <div>
          <label htmlFor="comment-message" className="mb-1.5 block text-sm text-muted">
            Your note
          </label>
          <textarea
            id="comment-message"
            required
            rows={3}
            maxLength={MAX_MESSAGE}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className={`${inputClass} resize-y py-2.5`}
          />
        </div>
        <div aria-hidden="true" className="absolute -left-[9999px]">
          <label>
            Leave this empty
            <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
          </label>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={sending}
            className="min-h-11 cursor-pointer rounded-md border border-line-strong px-4 text-sm text-fg transition-colors duration-150 hover:bg-surface disabled:cursor-default disabled:opacity-50"
          >
            {sending ? "Leaving it…" : "Leave a note"}
          </button>
          <p aria-live="polite" className={`text-sm ${error ? "text-minus" : "text-muted"}`}>
            {error || (sent ? "Thanks for stopping by." : "")}
          </p>
        </div>
      </form>

      <div className="mt-8">
        {status === "loading" && (
          <div aria-hidden="true" className="h-16 animate-pulse rounded-md bg-surface" />
        )}
        {status === "failed" && <p className="text-sm text-muted">Notes couldn&apos;t load right now.</p>}
        {status === "ready" && comments.length === 0 && (
          <p className="text-sm text-muted">No notes yet. Yours can be the first.</p>
        )}
        <ul className="space-y-5">
          {comments.map((comment) => (
            <li key={comment.id}>
              <p className="text-sm leading-relaxed break-words whitespace-pre-line text-prose">{comment.message}</p>
              <p className="mt-1 font-mono text-[11px] text-subtle">
                {comment.name} · {dateFormat.format(new Date(comment.createdAt))}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
