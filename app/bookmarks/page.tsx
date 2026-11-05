import type { Metadata } from "next";
import { bookmarks } from "@/content/bookmarks";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Articles, docs and repos I keep coming back to.",
};

const hostOf = (url: string) => new URL(url).hostname.replace(/^www\./, "");

export default function BookmarksPage() {
  return (
    <main className="rise flex-1 pt-8 pb-16">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Bookmarks</h1>
      <p className="mt-3 mb-10 text-base leading-relaxed text-prose">Articles, docs and repos I keep coming back to.</p>
      <div className="space-y-10">
        {bookmarks.map((section) => (
          <section key={section.group}>
            <h2 className="mb-2 font-mono text-xs text-muted">{section.group}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item.url}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group -mx-3 block rounded-md px-3 py-3 transition-colors duration-150 hover:bg-surface"
                  >
                    <span className="block text-sm leading-relaxed text-prose transition-colors duration-150 group-hover:text-fg">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block font-mono text-[11px] text-subtle">{hostOf(item.url)}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
