import type { ReactNode } from "react";

type SectionProps = {
  number: string;
  title: string;
  aside?: ReactNode;
  children: ReactNode;
};

export function Section({ number, title, aside, children }: SectionProps) {
  return (
    <section className="py-10">
      <div className="mb-6 flex items-baseline justify-between gap-4 font-mono text-xs">
        <h2 className="text-muted">
          <span className="mr-3 text-subtle">{number}</span>
          {title}
        </h2>
        {aside && <div className="text-subtle">{aside}</div>}
      </div>
      {children}
    </section>
  );
}
