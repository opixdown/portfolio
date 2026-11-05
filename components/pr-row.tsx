import { compact, formatDay, shortRepo, type ActivityItem } from "@/lib/activity";

const badge = {
  merged: { label: "merged", className: "text-live" },
  open: { label: "in review", className: "text-muted" },
  commit: { label: "commit", className: "text-muted" },
  issue: { label: "issue", className: "text-muted" },
  post: { label: "post", className: "text-muted" },
};

export function ActivityRow({ item }: { item: ActivityItem }) {
  const isGitHub = item.source === "github";
  const hasLines = isGitHub && item.plus !== undefined && item.minus !== undefined;

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noreferrer"
      className="group -mx-3 block rounded-md px-3 py-3 transition-colors duration-150 hover:bg-surface"
    >
      <p className="text-sm leading-relaxed text-prose transition-colors duration-150 group-hover:text-fg">{item.title}</p>
      <p className="mt-1 flex flex-wrap items-center gap-x-3 font-mono text-[11px] text-subtle">
        <span className={badge[item.kind].className}>{badge[item.kind].label}</span>
        <span>{isGitHub ? shortRepo(item.repo) : item.source}</span>
        {hasLines && (
          <span>
            <span className="text-plus">+{compact(item.plus!)}</span> <span className="text-minus">-{compact(item.minus!)}</span>
          </span>
        )}
        <span>{formatDay(item.date)}</span>
      </p>
    </a>
  );
}
