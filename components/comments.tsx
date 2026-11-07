"use client";

import { useEffect, useState } from "react";
import type { Comment } from "@/lib/comments";
import { NOTE_ADDED_EVENT } from "@/components/note-bar";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

export function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");

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
        setStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setStatus("failed");
      });

    function handleAdded(event: Event) {
      const comment = (event as CustomEvent<Comment>).detail;
      setComments((current) => [comment, ...current]);
      setStatus("ready");
    }
    window.addEventListener(NOTE_ADDED_EVENT, handleAdded);
    return () => {
      cancelled = true;
      window.removeEventListener(NOTE_ADDED_EVENT, handleAdded);
    };
  }, []);

  return (
    <div id="notes" className="scroll-mt-8">
      {status === "loading" && <div aria-hidden="true" className="h-16 animate-pulse rounded-md bg-surface" />}
      {status === "failed" && <p className="text-sm text-muted">Notes couldn&apos;t load right now.</p>}
      {status === "ready" && comments.length === 0 && (
        <p className="text-sm text-muted">No notes yet. Yours can be the first, in the box at the bottom of the screen.</p>
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
  );
}
