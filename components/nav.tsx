import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

const links = [
  { href: "/work", label: "Work" },
  { href: "/book", label: "Book a call" },
];

export function Nav() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 py-4 sm:h-20 sm:flex-nowrap sm:py-0">
      <Link href="/" className="py-3 font-mono text-sm text-fg">
        atharva
      </Link>
      <div className="sm:hidden">
        <ThemeToggle />
      </div>
      <nav className="-mx-2 flex w-full items-center overflow-x-auto text-sm whitespace-nowrap text-muted sm:mx-0 sm:w-auto sm:gap-1">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className="px-2 py-3 transition-colors duration-150 hover:text-fg">
            {link.label}
          </Link>
        ))}
        <div className="hidden sm:block">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
