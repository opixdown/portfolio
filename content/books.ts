// Change the books or notes here. `note` is what shows when the book opens.
export type Book = {
  title: string;
  author: string;
  cover: string;
  note: string;
};

export const books: Book[] = [
  {
    title: "Crafting Interpreters",
    author: "Robert Nystrom",
    cover: "/books/crafting-interpreters.jpg",
    note: "It makes a language implementation feel like something you can build in small steps. Every chapter ends with code that runs.",
  },
  {
    title: "The Pragmatic Programmer",
    author: "David Thomas, Andrew Hunt",
    cover: "/books/pragmatic-programmer.jpg",
    note: "Practical habits instead of rules. It's the kind of advice that gets more useful the bigger your codebase gets.",
  },
  {
    title: "Surely You're Joking, Mr. Feynman!",
    author: "Richard P. Feynman",
    cover: "/books/feynman.jpg",
    note: "Feynman treats everything as a puzzle worth poking at, from safes to bongo drums. It's the best argument I know for staying curious.",
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    cover: "/books/atomic-habits.jpg",
    note: "Small changes, repeated. That's how 100+ merged PRs happen: one fix at a time.",
  },
  {
    title: "Deep Work",
    author: "Cal Newport",
    cover: "/books/deep-work.jpg",
    note: "Compiler bugs don't get solved in ten-minute bursts. This book explains why long, quiet blocks of focus are worth protecting.",
  },
  {
    title: "Sapiens",
    author: "Yuval Noah Harari",
    cover: "/books/sapiens.jpg",
    note: "A huge story told simply. It changes how you look at things you assumed were just normal.",
  },
  {
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    cover: "/books/thinking-fast-slow.jpg",
    note: "A good reminder that a confident first answer is often the wrong one. That applies to debugging too.",
  },
];
