"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface PaginationProps {
  currentPage:  number;
  totalPages:   number;
  total:        number;
  pageSize:     number;
}

function pageUrl(page: number, params: URLSearchParams) {
  const p = new URLSearchParams(params.toString());
  if (page === 1) p.delete("page");
  else            p.set("page", String(page));
  const qs = p.toString();
  return `/shop${qs ? `?${qs}` : ""}`;
}

function pages(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (current <= 4) return [1, 2, 3, 4, 5, "…", total];
  if (current >= total - 3) return [1, "…", total - 4, total - 3, total - 2, total - 1, total];
  return [1, "…", current - 1, current, current + 1, "…", total];
}

export default function Pagination({ currentPage, totalPages, total, pageSize }: PaginationProps) {
  const params = useSearchParams();

  if (totalPages <= 1) return null;

  const from = (currentPage - 1) * pageSize + 1;
  const to   = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex flex-col items-center gap-4 mt-12">
      {/* Result count */}
      <p className="text-sm text-ink/50">
        Showing <span className="font-semibold text-ink">{from}–{to}</span> of{" "}
        <span className="font-semibold text-ink">{total}</span> products
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1 flex-wrap justify-center">
        {/* Prev */}
        {currentPage > 1 ? (
          <Link
            href={pageUrl(currentPage - 1, params)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm font-medium text-ink hover:border-brand hover:text-brand transition-colors"
          >
            ← Prev
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm font-medium text-ink/30 cursor-not-allowed">
            ← Prev
          </span>
        )}

        {/* Page numbers */}
        {pages(currentPage, totalPages).map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-2 py-2 text-ink/40 text-sm select-none">
              …
            </span>
          ) : (
            <Link
              key={p}
              href={pageUrl(p, params)}
              className={[
                "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-semibold border transition-colors",
                p === currentPage
                  ? "bg-brand text-white border-brand"
                  : "border-border text-ink hover:border-brand hover:text-brand",
              ].join(" ")}
            >
              {p}
            </Link>
          )
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link
            href={pageUrl(currentPage + 1, params)}
            className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm font-medium text-ink hover:border-brand hover:text-brand transition-colors"
          >
            Next →
          </Link>
        ) : (
          <span className="flex items-center gap-1 px-3 py-2 rounded-lg border border-border text-sm font-medium text-ink/30 cursor-not-allowed">
            Next →
          </span>
        )}
      </div>
    </div>
  );
}
