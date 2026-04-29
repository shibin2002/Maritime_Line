"use client";

import { useTheme } from "next-themes";
import { useHydrated } from "@/hooks/use-hydrated";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const hydrated = useHydrated();

  const next = resolvedTheme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      className="group relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-900/60 text-amber-400 transition hover:border-amber-500/50 hover:bg-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/60 dark:border-slate-600 dark:bg-slate-950/80"
      onClick={() => setTheme(next)}
      aria-label={hydrated ? `Switch to ${next} mode` : "Toggle color theme"}
      title={hydrated ? `Switch to ${next} mode` : "Theme"}
    >
      <span className="sr-only">Toggle theme</span>
      {!hydrated ? (
        <span className="h-5 w-5 animate-pulse rounded bg-slate-600" aria-hidden />
      ) : resolvedTheme === "dark" ? (
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 18a6 6 0 100-12 6 6 0 000 12zm0-16a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm0 18a1 1 0 01-1-1v-2a1 1 0 112 0v2a1 1 0 01-1 1zM5.64 5.64a1 1 0 011.41 0l1.42 1.42a1 1 0 01-1.41 1.41L5.64 7.05a1 1 0 010-1.41zm12.73 12.73a1 1 0 01-1.41 0l-1.42-1.42a1 1 0 111.41-1.41l1.42 1.42a1 1 0 010 1.41zM3 13a1 1 0 011-1h2a1 1 0 110 2H4a1 1 0 01-1-1zm14 0a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zM5.64 18.36a1 1 0 010-1.41l1.42-1.42a1 1 0 111.41 1.41l-1.42 1.42a1 1 0 01-1.41 0zm12.73-12.73a1 1 0 010 1.41l-1.42 1.42a1 1 0 11-1.41-1.41l1.42-1.42a1 1 0 011.41 0z" />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  );
}
