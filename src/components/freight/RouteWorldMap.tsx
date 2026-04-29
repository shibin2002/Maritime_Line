"use client";

const PORT_A = { label: "Guangzhou", flag: "🇨🇳", sub: "CN · Export" };
const PORT_B = { label: "Jebel Ali", flag: "🇦🇪", sub: "AE · Import" };

export function RouteWorldMap() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-sky-200/80 bg-gradient-to-b from-sky-50 via-white to-slate-50 p-4 shadow-lg shadow-sky-900/5 backdrop-blur-sm dark:border-amber-500/25 dark:bg-[#0c1829]/85 dark:from-[#0c1829] dark:via-[#0a1526] dark:to-[#081220] dark:shadow-black/40">
      <p className="mb-3 text-center font-display text-xs uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400/95">
        Lane visualization
      </p>

      <div className="relative mx-auto aspect-[2/1] max-h-[200px] w-full overflow-hidden rounded-lg">
        <svg
          className="h-full w-full"
          viewBox="0 0 400 200"
          role="img"
          aria-label="Simplified map showing route from Guangzhou to Jebel Ali"
        >
          <defs>
            <linearGradient id="ocean-light" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="45%" stopColor="#bae6fd" />
              <stop offset="100%" stopColor="#7dd3fc" />
            </linearGradient>
            <linearGradient id="ocean-dark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <filter id="lane-glow">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <rect width="400" height="200" fill="url(#ocean-light)" rx="8" className="dark:hidden" />
          <rect width="400" height="200" fill="url(#ocean-dark)" rx="8" className="hidden dark:block" />

          <path
            d="M60 80 Q120 40 180 70 Q240 100 300 85 Q340 75 360 90"
            fill="none"
            strokeWidth="0.75"
            strokeDasharray="4 6"
            className="stroke-sky-600/35 dark:stroke-slate-500/45"
          />

          <path
            d="M72 88 Q160 42 240 72 Q300 95 338 82"
            fill="none"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeDasharray="8 12"
            strokeDashoffset="0"
            className="animate-route-dash stroke-amber-600 dark:stroke-amber-400"
            filter="url(#lane-glow)"
            opacity="0.98"
          />

          <circle cx="72" cy="88" r="5" className="fill-amber-600 dark:fill-amber-500" />
          <circle cx="338" cy="82" r="5" className="fill-amber-500 dark:fill-amber-400" />
        </svg>

        <div className="pointer-events-none absolute inset-x-0 top-1 flex justify-between px-2 text-[10px] sm:text-xs">
          <span className="rounded-md border border-sky-200/90 bg-white/90 px-1.5 py-0.5 font-medium text-sky-900 shadow-sm backdrop-blur-sm dark:border-slate-600/60 dark:bg-slate-950/75 dark:text-slate-200">
            East Asia
          </span>
          <span className="rounded-md border border-sky-200/90 bg-white/90 px-1.5 py-0.5 font-medium text-sky-900 shadow-sm backdrop-blur-sm dark:border-slate-600/60 dark:bg-slate-950/75 dark:text-slate-200">
            Arabian Gulf
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <PortCard {...PORT_A} align="left" />
        <div className="flex flex-col items-center gap-1 text-amber-700 dark:text-amber-400">
          <span className="font-display text-lg sm:text-xl" aria-hidden>
            →
          </span>
          <span className="text-center text-[10px] font-medium uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Ocean leg
          </span>
        </div>
        <PortCard {...PORT_B} align="right" />
      </div>

      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-200/90 pt-3 text-center text-[11px] sm:text-xs dark:border-slate-600/50">
        <div>
          <dt className="font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">Est. transit</dt>
          <dd className="mt-0.5 font-mono font-medium text-slate-800 dark:text-slate-200">18–24 days</dd>
        </div>
        <div>
          <dt className="font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">Service</dt>
          <dd className="mt-0.5 font-medium text-slate-800 dark:text-slate-200">FCL / LCL</dd>
        </div>
        <div>
          <dt className="font-medium uppercase tracking-wide text-slate-500 dark:text-slate-500">Carrier window</dt>
          <dd className="mt-0.5 font-mono font-medium text-slate-800 dark:text-slate-200">Weekly</dd>
        </div>
      </dl>
    </div>
  );
}

function PortCard({
  label,
  flag,
  sub,
  align,
}: {
  label: string;
  flag: string;
  sub: string;
  align: "left" | "right";
}) {
  return (
    <div
      className={`rounded-xl border px-2 py-2 shadow-sm sm:px-3 ${
        align === "right" ? "text-right" : "text-left"
      } border-sky-200/90 bg-white/90 text-slate-900 backdrop-blur-sm dark:border-slate-600/50 dark:bg-slate-950/55 dark:text-white`}
    >
      <p className="font-display text-lg leading-none tracking-wide sm:text-xl">
        <span className="mr-1" aria-hidden>
          {flag}
        </span>
        {label}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-600 dark:text-slate-400">{sub}</p>
    </div>
  );
}
