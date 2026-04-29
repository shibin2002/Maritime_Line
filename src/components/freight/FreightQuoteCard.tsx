"use client";

import { motion } from "framer-motion";
import type { FreightBreakdown } from "@/lib/freight";
import { KG_PER_CBM_EQUIVALENT, LOCAL_DOCUMENTATION_FEE_USD, USD_PER_CBM } from "@/lib/freight";
import { formatCbm, formatUsd } from "@/lib/format";
import { AnimatedMoney } from "./AnimatedMoney";

type Props = {
  breakdown: FreightBreakdown;
  grossWeightKg: number;
  quoteId: string;
  quoteDate: string;
  embedInModal?: boolean;
};

export function FreightQuoteCard({ breakdown, grossWeightKg, quoteId, quoteDate, embedInModal }: Props) {
  return (
    <motion.article
      initial={embedInModal ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: embedInModal ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border-2 border-dashed border-amber-600/40 bg-[#faf8f5] p-6 shadow-xl dark:border-amber-500/35 dark:bg-[#111827]"
      aria-labelledby="quote-title"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-500/10 blur-2xl" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-amber-600/30 bg-slate-900 text-lg font-display text-amber-400 dark:bg-slate-950">
            ML
          </div>
          <div>
            <p id="quote-title" className="font-display text-2xl uppercase tracking-[0.12em] text-slate-900 dark:text-white">
              Maritime Line
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Ocean freight quotation (indicative)</p>
          </div>
        </div>
        <dl className="text-right text-sm">
          <div>
            <dt className="text-slate-500">Quote no.</dt>
            <dd className="font-mono font-medium text-slate-900 dark:text-white">{quoteId}</dd>
          </div>
          <div className="mt-2">
            <dt className="text-slate-500">Date</dt>
            <dd className="font-mono text-slate-800 dark:text-slate-200">{quoteDate}</dd>
          </div>
        </dl>
      </div>

      <div className="my-6 border-t border-slate-300 pt-4 dark:border-slate-600">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Route</p>
        <p className="mt-2 font-display text-xl text-slate-900 dark:text-white">
          Guangzhou <span className="text-amber-600 dark:text-amber-400">→</span> Jebel Ali
        </p>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-300 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-600">
            <th className="pb-2 pr-2">Description</th>
            <th className="pb-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody className="font-mono text-slate-800 dark:text-slate-200">
          <tr className="border-b border-slate-200/80 dark:border-slate-700">
            <td className="py-2 pr-2">
              Gross weight → CBM ({formatCbm(grossWeightKg)} kg ÷ {KG_PER_CBM_EQUIVALENT})
            </td>
            <td className="py-2 text-right">{formatCbm(breakdown.weightFromKgCbm)} CBM</td>
          </tr>
          <tr className="border-b border-slate-200/80 dark:border-slate-700">
            <td className="py-2 pr-2">Volume (actual)</td>
            <td className="py-2 text-right">{formatCbm(breakdown.actualVolumeCbm)} CBM</td>
          </tr>
          <tr className="border-b border-slate-200/80 dark:border-slate-700">
            <td className="py-2 pr-2">Chargeable CBM ({breakdown.chargeableFrom})</td>
            <td className="py-2 text-right">{formatCbm(breakdown.chargeableCbm)} CBM</td>
          </tr>
          <tr className="border-b border-slate-200/80 dark:border-slate-700">
            <td className="py-2 pr-2">Ocean freight @ {formatUsd(USD_PER_CBM)} / CBM</td>
            <td className="py-2 text-right">
              <AnimatedMoney value={breakdown.freightUsd} />
            </td>
          </tr>
          <tr>
            <td className="py-2 pr-2">Local documentation</td>
            <td className="py-2 text-right">
              {breakdown.documentationUsd > 0 ? formatUsd(LOCAL_DOCUMENTATION_FEE_USD) : "—"}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 flex items-center justify-between border-t-2 border-amber-600/40 pt-4 dark:border-amber-500/40">
        <span className="font-display text-lg uppercase tracking-wide text-slate-700 dark:text-slate-300">Total</span>
        <AnimatedMoney
          value={breakdown.totalUsd}
          className="font-display text-3xl text-slate-900 dark:text-white"
        />
      </div>

      <p className="mt-4 text-xs leading-relaxed text-slate-500 dark:text-slate-500">
        Subject to space, BAF/CAF, and terminal charges. Valid for planning only — not a binding contract.
      </p>
    </motion.article>
  );
}
