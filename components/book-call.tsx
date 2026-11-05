"use client";

import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect, useState, useSyncExternalStore } from "react";

const options = [
  { slug: "15min", label: "Quick chat", length: "15 min", about: "Say hi, ask a question or pitch an idea." },
  { slug: "30min", label: "Project call", length: "30 min", about: "Hiring, a collaboration, or something you want built." },
];

function subscribeToTheme(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

const readTheme = () => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark");

export function BookCall({ calLink }: { calLink: string }) {
  const [slug, setSlug] = useState(options[0].slug);
  const theme = useSyncExternalStore(subscribeToTheme, readTheme, () => "dark" as const);
  const bookingUrl = `${calLink}/${slug}`;

  useEffect(() => {
    let cancelled = false;
    getCalApi({ namespace: "book" }).then((cal) => {
      if (!cancelled) cal("ui", { theme, hideEventTypeDetails: true, layout: "month_view" });
    });
    return () => {
      cancelled = true;
    };
  }, [theme]);

  return (
    <div>
      <div role="group" aria-label="Call length" className="grid gap-3 sm:grid-cols-2">
        {options.map((option) => (
          <button
            key={option.slug}
            type="button"
            aria-pressed={slug === option.slug}
            onClick={() => setSlug(option.slug)}
            className={`flex cursor-pointer flex-col justify-start rounded-lg border p-4 text-left transition-colors duration-150 ${
              slug === option.slug ? "border-fg" : "border-line hover:border-line-strong"
            }`}
          >
            <span className="flex w-full items-baseline justify-between gap-3">
              <span className="text-sm font-medium text-fg">{option.label}</span>
              <span className="font-mono text-xs text-subtle">{option.length}</span>
            </span>
            <span className="mt-1.5 block text-sm leading-relaxed text-muted">{option.about}</span>
          </button>
        ))}
      </div>

      <div className="relative left-1/2 mt-6 min-h-[520px] w-[min(1000px,calc(100vw-40px))] -translate-x-1/2 overflow-hidden rounded-lg border border-line">
        <Cal
          key={`${slug}-${theme}`}
          namespace="book"
          calLink={bookingUrl}
          style={{ width: "100%", height: "100%", overflow: "auto" }}
          config={{ layout: "month_view", theme }}
        />
      </div>

      <p className="mt-4 text-sm text-muted">
        Calendar not loading?{" "}
        <a href={`https://cal.com/${bookingUrl}`} target="_blank" rel="noreferrer" className="text-fg underline underline-offset-4">
          Open it on Cal.com
        </a>
      </p>
    </div>
  );
}
