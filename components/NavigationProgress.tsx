"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, trickleSpeed: 200, minimum: 0.08 });

function Progress() {
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);

  useEffect(() => {
    const start = () => NProgress.start();
    const done  = () => NProgress.done();

    // Intercept all <a> clicks that look like internal navigations
    const handler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto")) return;
      start();
    };

    document.addEventListener("click", handler);
    window.addEventListener("popstate", done);
    return () => {
      document.removeEventListener("click", handler);
      window.removeEventListener("popstate", done);
    };
  }, []);

  return null;
}

export default function NavigationProgress() {
  return (
    <Suspense fallback={null}>
      <Progress />
    </Suspense>
  );
}
