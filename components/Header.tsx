"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/shop#categories" },
  { label: "About", href: "/about" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="text-2xl select-none" aria-hidden>🐱</span>
          <span className="font-bold text-lg text-brand tracking-tight">
            Best<span className="text-ink">Catnip</span>
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href.split("#")[0]);
            return (
              <Link
                key={href}
                href={href}
                className={[
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  active
                    ? "text-brand border-b-2 border-brand"
                    : "text-ink hover:text-brand",
                ].join(" ")}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Mobile: hamburger placeholder — good enough for Phase 1 */}
        <div className="sm:hidden">
          <Link href="/shop" className="text-sm font-medium text-brand">
            Shop →
          </Link>
        </div>
      </div>
    </header>
  );
}
