import Image from "next/image";
import Link from "next/link";
import { Clock } from "@/components/clock";
import { Comments } from "@/components/comments";
import { CompilerDemo } from "@/components/compiler-demo";
import { ContributionGraph } from "@/components/contribution-graph";
import { ActivityRow } from "@/components/pr-row";
import { Section } from "@/components/section";
import { elsewhere, highlights, otherOpenSource, profile, projects, stack, work } from "@/content/site";
import { formatDay, latestActivity, mergeActivity, rounded, shortRepo } from "@/lib/activity";
import { getGitHub } from "@/lib/github";

const external = { target: "_blank", rel: "noreferrer" };
const textLink = "text-fg underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:decoration-fg";
const pullsUrl = "https://github.com/lfortran/lfortran/pulls?q=is%3Apr+is%3Amerged+author%3Aopixdown";
const openedUrl = "https://github.com/lfortran/lfortran/pulls?q=is%3Apr+author%3Aopixdown";
const reviewsUrl = "https://github.com/lfortran/lfortran/pulls?q=is%3Apr+reviewed-by%3Aopixdown";
const issuesUrl = "https://github.com/lfortran/lfortran/issues?q=is%3Aissue+author%3Aopixdown";

export default async function HomePage() {
  const github = await getGitHub();
  const activity = mergeActivity(github.feed);
  const { totals } = github;

  const proof = [
    { value: rounded(totals.lfortranMerged), label: "PRs merged into LFortran", url: pullsUrl },
    { value: rounded(totals.pullRequests), label: "PRs opened in the last year", url: openedUrl },
    { value: rounded(totals.issues), label: "issues reported in the last year", url: issuesUrl },
    { value: rounded(totals.commits), label: "commits in the last year", url: profile.github },
    { value: rounded(totals.reviews), label: "code reviews in the last year", url: reviewsUrl },
    { value: rounded(totals.contributions), label: "GitHub contributions in the last year", url: profile.github },
  ];

  const recentMerged = activity.filter((item) => item.kind === "merged").slice(0, 5);
  const latest = latestActivity(activity, 6);

  return (
    <main className="flex-1">
      <section className="rise pt-8 pb-8">
        <div className="flex items-center gap-4">
          <Image src="/avatar.jpg" alt="Atharva Waghmare" width={56} height={56} priority className="size-14 rounded-full" />
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-fg">{profile.name}</h1>
            <p className="mt-0.5 font-mono text-xs text-muted">
              {profile.role} · {profile.place} · <Clock />
            </p>
          </div>
        </div>

        <div className="mt-8 max-w-[62ch] space-y-4 text-base leading-relaxed text-prose">
          <p>
            I&apos;m a software engineer and 3rd-year student at IIT Jodhpur. I like building things end to end, across web
            apps, developer tools, data pipelines and systems code.
          </p>
          <p>
            I&apos;ve shipped{" "}
            <a href="https://packetworld.vercel.app" {...external} className={textLink}>
              PacketWorld
            </a>
            ,{" "}
            <a href="https://wipemode.vercel.app" {...external} className={textLink}>
              wipe
            </a>{" "}
            and{" "}
            <a href="https://earlyfound.vercel.app" {...external} className={textLink}>
              EarlyFound
            </a>
            , and I contribute to{" "}
            <a href="https://github.com/lfortran/lfortran" {...external} className={textLink}>
              LFortran
            </a>
            , an open-source compiler, with {rounded(totals.lfortranMerged)} merged PRs.
          </p>
        </div>

        <div className="mt-7 flex flex-wrap gap-3 text-sm">
          <Link
            href="/book"
            className="inline-flex min-h-11 items-center rounded-md bg-fg px-4 font-medium text-bg transition-opacity duration-150 hover:opacity-85"
          >
            Book a call
          </Link>
          <a
            href={`mailto:${profile.email}`}
            className="inline-flex min-h-11 items-center rounded-md border border-line-strong px-4 text-fg transition-colors duration-150 hover:bg-surface"
          >
            Say hi
          </a>
        </div>

      </section>

      <section className="rise pb-10">
        <h2 className="mb-3 text-base text-fg">Try it: compile a program, one step at a time</h2>
        <CompilerDemo />
      </section>

      <Section number="01" title="Projects">
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.name}
              className={`overflow-hidden rounded-lg border border-line transition-colors duration-150 hover:border-line-strong ${
                index === 0 ? "sm:col-span-2" : ""
              }`}
            >
              {project.image && (
                <a href={project.live} {...external} aria-label={`Open ${project.name}`}>
                  <Image
                    src={project.image}
                    alt={`${project.name} home page`}
                    width={1280}
                    height={720}
                    sizes="(max-width: 640px) 100vw, 680px"
                    className="aspect-video w-full border-b border-line object-cover object-top"
                  />
                </a>
              )}
              <div className="p-4">
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="text-base font-medium text-fg">{project.name}</h3>
                  <p className="flex items-center gap-1.5 font-mono text-[11px] text-subtle">
                    {project.status === "Live" && <span aria-hidden="true" className="size-1.5 rounded-full bg-live" />}
                    {project.status}
                  </p>
                </div>
                <p className="mt-1.5 text-sm text-prose">{project.tagline}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{project.description}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                  <p className="text-subtle">{project.tags.join(" · ")}</p>
                  <p className="flex gap-3 text-muted">
                    {project.live && (
                      <a href={project.live} {...external} className="py-1 transition-colors duration-150 hover:text-fg">
                        Live ↗
                      </a>
                    )}
                    {project.source && (
                      <a href={project.source} {...external} className="py-1 transition-colors duration-150 hover:text-fg">
                        Source ↗
                      </a>
                    )}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section number="02" title="Experience">
        <ol className="space-y-8">
          {work.map((job) => (
            <li key={job.role}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h3 className="text-base text-fg">
                  {job.role}
                  <span className="text-muted">
                    {" · "}
                    {job.url ? (
                      <a href={job.url} {...external} className="underline decoration-line-strong underline-offset-4 hover:text-fg">
                        {job.org}
                      </a>
                    ) : (
                      job.org
                    )}
                  </span>
                </h3>
                <p className="font-mono text-xs text-subtle">{job.period}</p>
              </div>
              {job.points.length > 0 && (
                <ul className="mt-2.5 space-y-1.5 text-sm leading-relaxed text-prose">
                  {job.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </Section>

      <Section
        number="03"
        title="Open source"
        aside={
          <Link href="/work" className="transition-colors duration-150 hover:text-fg">
            All recent work →
          </Link>
        }
      >
        <div>
          {recentMerged.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Also shipped fixes to{" "}
          {otherOpenSource.map((repo, index) => (
            <span key={repo.name}>
              <a href={repo.url} {...external} className={textLink}>
                {repo.name}
              </a>
              {index < otherOpenSource.length - 2 ? ", " : index === otherOpenSource.length - 2 ? " and " : "."}
            </span>
          ))}
        </p>
      </Section>

      <Section
        number="04"
        title="Activity"
        aside={
          <Link href="/work" className="transition-colors duration-150 hover:text-fg">
            See everything →
          </Link>
        }
      >
        <ContributionGraph days={github.days} total={totals.contributions} />
        <dl className="mt-6 grid gap-x-6 gap-y-1 sm:grid-cols-3">
          {proof.map((item) => (
            <div key={item.label}>
              <a href={item.url} {...external} className="group flex items-baseline gap-2 py-1 text-xs text-muted transition-colors duration-150 hover:text-fg sm:block">
                <dd className="font-mono text-base text-fg tabular-nums">{item.value}</dd>
                <dt className="sm:mt-0.5">{item.label}</dt>
              </a>
            </div>
          ))}
        </dl>

        <h3 className="mt-10 mb-1 font-mono text-xs text-muted">Latest</h3>
        <ul>
          {latest.map((item) => (
            <li key={item.id} className="border-b border-line last:border-b-0">
              <a
                href={item.url}
                {...external}
                className="grid gap-x-4 py-2.5 text-sm transition-colors duration-150 sm:grid-cols-[64px_1fr_auto]"
              >
                <span className="font-mono text-[11px] leading-6 text-subtle">{formatDay(item.date)}</span>
                <span className="min-w-0 truncate leading-6 text-prose hover:text-fg">{item.title}</span>
                <span className="font-mono text-[11px] leading-6 text-subtle">
                  {item.source === "github" ? shortRepo(item.repo).replace("lfortran/lfortran", "lfortran") : item.source}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section number="05" title="Highlights">
        <ul className="space-y-2.5 text-sm leading-relaxed text-prose">
          {highlights.map((highlight) => (
            <li key={highlight.text}>
              {highlight.url ? (
                <a href={highlight.url} {...external} className={textLink}>
                  {highlight.text}
                </a>
              ) : (
                highlight.text
              )}
            </li>
          ))}
        </ul>
      </Section>

      <Section number="06" title="Stack">
        <dl className="space-y-3 text-sm">
          {stack.map((row) => (
            <div key={row.group} className="grid gap-1 sm:grid-cols-[110px_1fr] sm:gap-4">
              <dt className="font-mono text-xs leading-6 text-subtle">{row.group}</dt>
              <dd className="leading-6 text-prose">{row.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section number="07" title="Elsewhere">
        <ul className="grid gap-x-6 gap-y-1 font-mono text-xs sm:grid-cols-2">
          {elsewhere.map((link) => (
            <li key={link.label}>
              <a
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel="noreferrer"
                className="flex min-h-9 items-center text-muted transition-colors duration-150 hover:text-fg"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <Section number="08" title="Notes">
        <Comments />
      </Section>

      <section className="border-t border-line py-14 text-center">
        <p className="text-xl font-semibold tracking-tight text-fg">You scrolled all the way down.</p>
        <p className="mt-2 text-sm text-muted">So you might want to talk.</p>
        <Link
          href="/book"
          className="mt-6 inline-flex min-h-11 items-center rounded-md bg-fg px-5 text-sm font-medium text-bg transition-opacity duration-150 hover:opacity-85"
        >
          Let&apos;s talk
        </Link>
      </section>
    </main>
  );
}
