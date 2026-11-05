import type { Metadata } from "next";
import { BookCall } from "@/components/book-call";
import { profile } from "@/content/site";

export const metadata: Metadata = {
  title: "Book a call",
  description: "Pick a length, then a time that suits you.",
};

export default function BookPage() {
  return (
    <main className="rise flex-1 pt-8 pb-16">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Book a call</h1>
      <p className="mt-3 mb-8 text-base leading-relaxed text-prose">
        Hiring, a collaboration, or an idea you want to talk through. Pick a length, then a time that suits you.
      </p>
      <BookCall calLink={profile.calLink} />
    </main>
  );
}
