"use client";

import { useMemo, useState } from "react";
import { formatMonth, type ActivityItem } from "@/lib/activity";
import { ActivityRow } from "./pr-row";


const filters = [
  { id: "all", label: "All", match: () => true },
  { id: "merged", label: "Merged", match: (item: ActivityItem) => item.kind === "merged" },
  { id: "open", label: "In review", match: (item: ActivityItem) => item.kind === "open" },
  { id: "issue", label: "Issues", match: (item: ActivityItem) => item.kind === "issue" },
  { id: "commit", label: "Projects", match: (item: ActivityItem) => item.kind === "commit" },
  { id: "post", label: "Posts", match: (item: ActivityItem) => item.kind === "post" },
];

type WorkFeedProps = {
  label: string;
  items: ActivityItem[];
  pageSize?: number;
};

const READ_MORE_STEP = 20;

export function WorkFeed({ label, items, pageSize = 5 }: WorkFeedProps) {
  const [active, setActive] = useState("all");
  const [limit, setLimit] = useState(pageSize);

  const available = filters.filter((filter) => items.some(filter.match));
  const matching = items.filter(filters.find((filter) => filter.id === active)!.match);
  const shown = matching.slice(0, limit);

  const months = useMemo(() => {
    const groups = new Map<string, ActivityItem[]>();
    for (const item of shown) {
      const key = item.date.slice(0, 7);
      groups.set(key, [...(groups.get(key) ?? []), item]);
    }
    return [...groups.entries()];
  }, [shown]);

  function handleFilter(id: string) {
    setActive(id);
    setLimit(pageSize);
  }

  return (
    <div>
      {available.length > 2 && (
        <div role="group" aria-label={`Filter ${label}`} className="mb-6 flex flex-wrap gap-1.5">
          {available.map((filter) => (
            <button
              key={filter.id}
              type="button"
              aria-pressed={active === filter.id}
              onClick={() => handleFilter(filter.id)}
              className={`min-h-9 cursor-pointer rounded-md border px-3 font-mono text-xs transition-colors duration-150 ${
                active === filter.id
                  ? "border-line-strong bg-surface text-fg"
                  : "border-transparent text-muted hover:text-fg"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-8">
        {months.map(([month, monthItems]) => (
          <section key={month}>
            <h3 className="mb-1 font-mono text-xs text-subtle">{formatMonth(`${month}-01`)}</h3>
            <div>
              {monthItems.map((item) => (
                <ActivityRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {(matching.length > limit || limit > pageSize) && (
        <button
          type="button"
          onClick={() => setLimit(matching.length > limit ? limit + READ_MORE_STEP : pageSize)}
          aria-expanded={limit > pageSize}
          className="mt-6 min-h-11 w-full cursor-pointer rounded-md border border-line font-mono text-xs text-muted transition-colors duration-150 hover:border-line-strong hover:text-fg"
        >
          {matching.length > limit ? `Read more (${matching.length - limit})` : "Read less"}
        </button>
      )}
    </div>
  );
}
