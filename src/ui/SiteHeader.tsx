import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-rule px-4 sm:px-6">
      <Link href="/" className="font-mono text-xs tracking-[0.2em] text-ink uppercase">
        Paleo Sphere
      </Link>
      <ThemeToggle />
    </header>
  );
}
