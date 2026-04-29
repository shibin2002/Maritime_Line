"use client";

import { motion } from "framer-motion";
import type { FreightBreakdown } from "@/lib/freight";
import { LOCAL_DOCUMENTATION_FEE_USD } from "@/lib/freight";
import { formatUsd } from "@/lib/format";
import { AnimatedMoney } from "./AnimatedMoney";

export function WhatIfCompare({
  withDocs,
  withoutDocs,
}: {
  withDocs: FreightBreakdown;
  withoutDocs: FreightBreakdown;
}) {
  const delta = withDocs.totalUsd - withoutDocs.totalUsd;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <motion.div
        layout
        className="rounded-2xl border border-slate-200 bg-white/95 p-5 shadow-md dark:border-slate-700 dark:bg-slate-900/80"
      >
        <p className="font-display text-xs uppercase tracking-[0.2em] text-slate-500">Without documentation</p>
        <p className="mt-3 font-display text-2xl text-slate-900 dark:text-white">
          <AnimatedMoney value={withoutDocs.totalUsd} />
        </p>
        <p className="mt-2 text-xs text-slate-500">Freight only — no {formatUsd(LOCAL_DOCUMENTATION_FEE_USD)} fee</p>
      </motion.div>
      <motion.div
        layout
        className="rounded-2xl border border-amber-500/40 bg-amber-50/80 p-5 shadow-md dark:border-amber-500/30 dark:bg-amber-950/40"
      >
        <p className="font-display text-xs uppercase tracking-[0.2em] text-amber-800 dark:text-amber-200">
          With documentation
        </p>
        <p className="mt-3 font-display text-2xl text-slate-900 dark:text-white">
          <AnimatedMoney value={withDocs.totalUsd} />
        </p>
        <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
          Includes local docs — adds <AnimatedMoney value={delta} className="inline font-semibold" /> versus freight-only (left).
        </p>
      </motion.div>
    </div>
  );
}
