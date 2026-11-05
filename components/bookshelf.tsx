"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Book } from "@/content/books";

const OPEN_MS = 800;

export function Bookshelf({ books }: { books: Book[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<Book | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!selected) return;
    dialog.current?.showModal();
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    return () => cancelAnimationFrame(frame);
  }, [selected]);

  function handleClose() {
    setOpen(false);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setTimeout(
      () => {
        dialog.current?.close();
        setSelected(null);
      },
      reduceMotion ? 0 : OPEN_MS * 0.7,
    );
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 md:grid-cols-4">
        {books.map((book) => (
          <li key={book.title}>
            <button
              type="button"
              onClick={() => setSelected(book)}
              aria-label={`Open ${book.title} by ${book.author}`}
              className="book-tile block w-full cursor-pointer text-left"
            >
              <span className="book-tile-cover block overflow-hidden rounded-r-sm rounded-l-[2px]">
                <Image
                  src={book.cover}
                  alt=""
                  width={300}
                  height={450}
                  sizes="(max-width: 640px) 45vw, 160px"
                  className="aspect-[2/3] w-full object-cover"
                />
              </span>
              <span className="mt-3 block text-sm leading-snug text-fg">{book.title}</span>
              <span className="mt-0.5 block text-xs text-muted">{book.author}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={selected ? `${selected.title}, what I like about it` : "Book"}
        onCancel={(event) => {
          event.preventDefault();
          handleClose();
        }}
        onClick={(event) => {
          if (event.target === dialog.current) handleClose();
        }}
        className="book-dialog"
      >
        {selected && (
          <div className="book-stage">
            <div className="book" data-open={open}>
              <div className="book-page">
                <div className="mb-5 sm:hidden">
                  <p className="text-lg leading-snug font-semibold tracking-tight">{selected.title}</p>
                  <p className="mt-1 text-sm opacity-70">{selected.author}</p>
                </div>
                <p className="font-mono text-[11px] tracking-wide opacity-70">What I like about it</p>
                <p className="mt-3 text-base leading-relaxed">{selected.note}</p>
                <button type="button" onClick={handleClose} className="mt-6 min-h-11 cursor-pointer font-mono text-xs underline underline-offset-4">
                  Close the book
                </button>
              </div>
              <div className="book-cover">
                <div className="book-cover-front">
                  <Image src={selected.cover} alt={`${selected.title} cover`} width={400} height={600} className="size-full object-cover" />
                </div>
                <div className="book-cover-back">
                  <Image
                    src={selected.cover}
                    alt=""
                    width={200}
                    height={300}
                    className="mb-auto aspect-[2/3] w-28 rounded-sm object-cover"
                  />
                  <p className="text-xl leading-snug font-semibold tracking-tight">{selected.title}</p>
                  <p className="mt-2 text-sm opacity-70">{selected.author}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
