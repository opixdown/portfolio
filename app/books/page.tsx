import type { Metadata } from "next";
import { Bookshelf } from "@/components/bookshelf";
import { books } from "@/content/books";

export const metadata: Metadata = {
  title: "Books",
  description: "Books I like, and what I like about them.",
};

export default function BooksPage() {
  return (
    <main className="rise flex-1 pt-8 pb-16">
      <h1 className="text-3xl font-semibold tracking-tight text-fg">Books</h1>
      <p className="mt-3 mb-10 text-base leading-relaxed text-prose">Pick a book to open it.</p>
      <Bookshelf books={books} />
    </main>
  );
}
