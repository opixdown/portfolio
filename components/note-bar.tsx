"use client";

import Link from "next/link";
import { type FocusEvent, type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from "react";

export const NOTE_ADDED_EVENT = "note-added";

const MAX_NAME = 40;
const MAX_MESSAGE = 500;
const SENT_VISIBLE_MS = 6000;
const fieldClass = "note-field w-full bg-transparent text-base text-fg outline-none placeholder:text-subtle sm:text-sm";

/** The note box, pinned to the bottom of every page like a search bar. */
export function NoteBar() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState("");
  const [focused, setFocused] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const messageField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!sent) return;
    const timer = setTimeout(() => setSent(false), SENT_VISIBLE_MS);
    return () => clearTimeout(timer);
  }, [sent]);

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
      if (data.comment) window.dispatchEvent(new CustomEvent(NOTE_ADDED_EVENT, { detail: data.comment }));
      setMessage("");
      setSent(true);
      messageField.current?.blur();
    } catch {
      setError("Your note couldn't be saved. Check your connection and try again.");
    } finally {
      setSending(false);
    }
  }

  /** Only the text fields open the bar. A click on the link must not shift it mid-press. */
  function handleFocus(event: FocusEvent<HTMLFormElement>) {
    if (event.target instanceof HTMLInputElement) setFocused(true);
  }

  function handleBlur(event: FocusEvent<HTMLFormElement>) {
    if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLFormElement>) {
    if (event.key === "Escape" && document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }

  const open = focused || Boolean(message) || Boolean(error);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto w-full max-w-[720px] px-5 sm:px-6">
        <form
          onSubmit={handleSubmit}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="pointer-events-auto rounded-xl border border-line-strong bg-bg transition-colors duration-150 focus-within:border-fg"
        >
          <div aria-live="polite">
            {(error || sent) && (
              <p className={`border-b border-line px-4 py-2.5 text-sm ${error ? "text-minus" : "text-muted"}`}>
                {error || "Thanks for stopping by."}{" "}
                {sent && (
                  <Link href="/#notes" className="text-fg underline underline-offset-4">
                    See all notes
                  </Link>
                )}
              </p>
            )}
          </div>
          {open && (
            <div className="border-b border-line px-4">
              <input
                aria-label="Your name"
                placeholder="Your name"
                required
                maxLength={MAX_NAME}
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={`${fieldClass} h-11`}
              />
            </div>
          )}
          <div aria-hidden="true" className="absolute -left-[9999px]">
            <label>
              Leave this empty
              <input tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
            </label>
          </div>
          <div className="flex items-center gap-2 pr-1.5 pl-4">
            <input
              ref={messageField}
              aria-label="Your note"
              placeholder="Leave a note..."
              required
              maxLength={MAX_MESSAGE}
              enterKeyHint="send"
              autoComplete="off"
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                setError("");
              }}
              className={`${fieldClass} h-12 min-w-0`}
            />
            <button
              type="submit"
              disabled={sending}
              aria-label={sending ? "Sending your note" : "Send note"}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg text-muted transition-colors duration-150 hover:bg-surface hover:text-fg disabled:cursor-default disabled:opacity-50"
            >
              <svg aria-hidden="true" viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 13V3M3.5 7.5 8 3l4.5 4.5" />
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
