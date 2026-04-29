"use client";

export function MaritimeBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(245,158,11,0.12),transparent_50%)] dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(245,158,11,0.18),transparent_55%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/40 to-slate-950 dark:from-[#0a1628]/0 dark:via-[#0a1628]/70 dark:to-[#050a14]" />

      <svg
        className="absolute -bottom-8 left-0 h-[38vh] w-full min-w-[800px] text-amber-500/15 dark:text-amber-400/20"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
            <stop offset="50%" stopColor="currentColor" stopOpacity="0.45" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          fill="url(#waveGrad)"
          className="animate-maritime-wave-1"
          d="M0,120 C150,100 300,140 450,110 C600,80 750,130 900,105 C1050,80 1150,115 1200,95 L1200,200 L0,200 Z"
        />
        <path
          fill="currentColor"
          className="animate-maritime-wave-2 opacity-60"
          d="M0,145 C200,125 400,165 600,130 C800,95 1000,150 1200,125 L1200,200 L0,200 Z"
        />
      </svg>

      <svg
        className="absolute bottom-[12vh] right-[8%] h-24 w-40 text-slate-700/40 dark:text-slate-600/35 sm:h-28 sm:w-48"
        viewBox="0 0 200 80"
        fill="currentColor"
        aria-hidden
      >
        <path d="M10 55 L30 45 L50 50 L90 35 L130 48 L170 40 L190 45 L190 60 L10 60 Z" opacity="0.9" />
        <rect x="85" y="22" width="30" height="18" rx="2" opacity="0.7" />
        <path d="M95 22 L105 10 L115 10 L125 22 Z" opacity="0.6" />
      </svg>
    </div>
  );
}
