import type { Metadata } from "next";
import { ContributionGraph } from "@/components/contribution-graph";
import { WorkFeed } from "@/components/work-feed";
import { projects } from "@/content/site";
import { mergeActivity, rounded } from "@/lib/activity";
import { getGitHub } from "@/lib/github";

export const metadata: Metadata = {
  title: "Recent work",
  description: "I ship what people want, and I take on the hard problems along the way.",
};

export default async function WorkPage() {
  const github = await getGitHub();
  const activity = mergeActivity(github.feed);
  const { totals } = github;
  const isCompilerWork = (item: (typeof activity)[number]) =>
    item.source === "github" && item.repo === "lfortran/lfortran";
  const compilerWork = activity.filter(isCompilerWork);
  const otherWork = activity.filter((item) => !isCompilerWork(item));

  const stats = [
    { value: rounded(totals.lfortranMerged), label: "PRs merged into LFortran" },
    { value: rounded(totals.pullRequests), label: "PRs opened in the last year" },
    { value: rounded(totals.issues), label: "issues reported in the last year" },
    { value: rounded(totals.reviews), label: "code reviews in the last year" },
  ];

  return (
    <main className="flex-1 pb-16">
      <div className="rise pt-8 pb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-fg">Recent work</h1>
        <p className="mt-3 text-base leading-relaxed text-prose">
          I ship what people want, and I take on the hard problems along the way. Everything below comes straight from
          GitHub: my own projects and open source.
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-line py-8 sm:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label}>
            <dd className="font-mono text-xl text-fg tabular-nums">{stat.value}</dd>
            <dt className="mt-1 text-xs leading-snug text-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <div className="border-t border-line py-8">
        <p className="mb-4 font-mono text-xs text-muted">{rounded(totals.contributions)} contributions in the last year</p>
        <ContributionGraph days={github.days} total={totals.contributions} />
      </div>

      <section className="border-t border-line pt-8">
        <h2 className="mb-5 text-xl font-semibold tracking-tight text-fg">Compiler work</h2>
        <WorkFeed label="compiler work" items={compilerWork} />
      </section>

      <section className="mt-12 border-t border-line pt-8">
        <h2 className="mb-3 text-xl font-semibold tracking-tight text-fg">Projects</h2>
        <ul>
          {projects.map((project) => (
            <li key={project.name} className="border-b border-line py-4 last:border-b-0">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-base font-medium text-fg">{project.name}</h3>
                <p className="flex shrink-0 gap-3 font-mono text-[11px] text-muted">
                  {project.live && (
                    <a href={project.live} target="_blank" rel="noreferrer" className="py-1 transition-colors duration-150 hover:text-fg">
                      Live ↗
                    </a>
                  )}
                  {project.source && (
                    <a href={project.source} target="_blank" rel="noreferrer" className="py-1 transition-colors duration-150 hover:text-fg">
                      Source ↗
                    </a>
                  )}
                </p>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-prose">{project.tagline}</p>
              <p className="mt-1 font-mono text-[11px] text-subtle">{project.tags.join(" · ")}</p>
            </li>
          ))}
        </ul>

        <h3 className="mt-8 mb-4 font-mono text-xs text-muted">Recent updates</h3>
        <WorkFeed label="project updates" items={otherWork} />
      </section>
    </main>
  );
}
