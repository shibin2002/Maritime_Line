"use client";

import { motion } from "framer-motion";
import type { FreightBreakdown } from "@/lib/freight";
import { KG_PER_CBM_EQUIVALENT, LOCAL_DOCUMENTATION_FEE_USD, USD_PER_CBM } from "@/lib/freight";
import { formatCbm, formatUsd } from "@/lib/format";
import { AnimatedMoney } from "./AnimatedMoney";

const stepVariants = {
  hidden: { opacity: 0, x: -16 },
  show: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

const icons = {
  weight: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 4h8v4H8V4zm-2 6h12v10a2 2 0 01-2 2H8a2 2 0 01-2-2V10z"
        className="fill-amber-500/90"
      />
    </svg>
  ),
  cube: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3l8 4v10l-8 4-8-4V7l8-4z" className="stroke-amber-500" strokeWidth="1.5" fill="none" />
    </svg>
  ),
  scale: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3v18M5 12h14M8 8l-2 4h4l-2-4zm10 0l-2 4h4l-2-4z"
        className="stroke-amber-500"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ),
  ship: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 18h16l2-6H2l2 6zm2-9h12l1-4H5l1 4z" className="fill-amber-500/85" />
    </svg>
  ),
  doc: (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3h7l3 3v15a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
        className="stroke-amber-500"
        strokeWidth="1.4"
        fill="none"
      />
    </svg>
  ),
};

export function BreakdownSteps({
  breakdown,
  grossWeightKg,
}: {
  breakdown: FreightBreakdown;
  grossWeightKg: number;
}) {
  const steps = [
    {
      key: "wcbm",
      title: "Weight CBM",
      icon: icons.weight,
      body: (
        <>
          {formatCbm(grossWeightKg)} kg ÷ {KG_PER_CBM_EQUIVALENT} ={" "}
          <strong className="text-slate-900 dark:text-white">{formatCbm(breakdown.weightFromKgCbm)} CBM</strong>
        </>
      ),
    },
    {
      key: "vcbm",
      title: "Volume CBM",
      icon: icons.cube,
      body: (
        <>
          Declared volume:{" "}
          <strong className="text-slate-900 dark:text-white">{formatCbm(breakdown.actualVolumeCbm)} CBM</strong>
        </>
      ),
    },
    {
      key: "charge",
      title: "Chargeable CBM",
      icon: icons.scale,
      body: (
        <div className="space-y-2">
          <p>
            Max of weight vs volume →{" "}
            <strong className="text-amber-700 dark:text-amber-400">{formatCbm(breakdown.chargeableCbm)} CBM</strong>
          </p>
          <p
            className={`inline-flex rounded-lg px-2 py-1 text-xs font-medium ${
              breakdown.chargeableFrom === "weight"
                ? "bg-amber-500/20 text-amber-900 dark:text-amber-200"
                : "bg-sky-500/15 text-sky-900 dark:text-sky-200"
            }`}
          >
            {breakdown.chargeableFrom === "weight"
              ? "Heavier: weight equivalent wins"
              : "Heavier: volume wins"}
          </p>
        </div>
      ),
    },
    {
      key: "freight",
      title: "Freight cost",
      icon: icons.ship,
      body: (
        <>
          {formatCbm(breakdown.chargeableCbm)} × {formatUsd(USD_PER_CBM)} ={" "}
          <AnimatedMoney value={breakdown.freightUsd} className="font-semibold text-slate-900 dark:text-white" />
        </>
      ),
    },
    {
      key: "docs",
      title: "Documentation",
      icon: icons.doc,
      body:
        breakdown.documentationUsd > 0 ? (
          <>Local documentation + {formatUsd(LOCAL_DOCUMENTATION_FEE_USD)}</>
        ) : (
          <span className="text-slate-500">Not included</span>
        ),
    },
  ];

  return (
    <ol className="space-y-2">
      {steps.map((s, i) => (
        <motion.li
          key={s.key}
          custom={i}
          variants={stepVariants}
          initial="hidden"
          animate="show"
          className="flex gap-3 rounded-xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-sm dark:border-slate-700/80 dark:bg-slate-900/70"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
            {s.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-display text-sm uppercase tracking-wide text-slate-500 dark:text-slate-400">{s.title}</p>
            <div className="mt-1 text-sm tabular-nums text-slate-700 dark:text-slate-300">{s.body}</div>
          </div>
        </motion.li>
      ))}
    </ol>
  );
}
