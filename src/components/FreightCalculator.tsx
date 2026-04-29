"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useId, useMemo, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { BreakdownSteps } from "@/components/freight/BreakdownSteps";
import { FreightQuoteCard } from "@/components/freight/FreightQuoteCard";
import { ReceiptModal } from "@/components/freight/ReceiptModal";
import { RouteWorldMap } from "@/components/freight/RouteWorldMap";
import { ThemeToggle } from "@/components/freight/ThemeToggle";
import { WhatIfCompare } from "@/components/freight/WhatIfCompare";
import { freightFormSchema, type FreightFormInput, type FreightFormValues } from "@/lib/freight-schema";
import { computeFreightEstimate, KG_PER_CBM_EQUIVALENT, LOCAL_DOCUMENTATION_FEE_USD, USD_PER_CBM } from "@/lib/freight";
import { formatUsd, quoteRef } from "@/lib/format";
import { MARITIME_SHIP_ICON_PATH } from "@/lib/maritime-mark";
import { AnimatedMoney } from "@/components/freight/AnimatedMoney";

const WEIGHT_MIN = 1;
const WEIGHT_MAX = 50000;
const VOLUME_MIN = 0.01;
const VOLUME_MAX = 200;

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function FreightCalculator() {
  const formId = useId();
  const [whatIf, setWhatIf] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [quoteId] = useState(() => quoteRef());

  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FreightFormInput, unknown, FreightFormValues>({
    resolver: zodResolver(freightFormSchema),
    mode: "onChange",
    defaultValues: {
      grossWeightKg: undefined,
      volumeCbm: undefined,
      localDocumentation: false,
    },
  });

  const watched = useWatch({ control });
  const weight = watched?.grossWeightKg;
  const volume = watched?.volumeCbm;
  const localDocumentation = watched?.localDocumentation ?? false;

  const parsed = useMemo(() => {
    const w = typeof weight === "number" && Number.isFinite(weight) && weight > 0;
    const v = typeof volume === "number" && Number.isFinite(volume) && volume > 0;
    if (!w || !v) return null;
    return { weight: weight as number, volume: volume as number };
  }, [weight, volume]);

  const breakdown = useMemo(() => {
    if (!parsed) return null;
    return computeFreightEstimate(parsed.weight, parsed.volume, localDocumentation);
  }, [parsed, localDocumentation]);

  const breakdownNoDocs = useMemo(() => {
    if (!parsed) return null;
    return computeFreightEstimate(parsed.weight, parsed.volume, false);
  }, [parsed]);

  const breakdownWithDocs = useMemo(() => {
    if (!parsed) return null;
    return computeFreightEstimate(parsed.weight, parsed.volume, true);
  }, [parsed]);

  const quoteDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(new Date()),
    [],
  );

  useEffect(() => {
    if (!breakdown) queueMicrotask(() => setShowReceipt(false));
  }, [breakdown]);

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/40 bg-slate-900 text-amber-400 shadow-lg shadow-slate-900/15 dark:border-amber-500/30 dark:bg-slate-950 dark:shadow-amber-900/20"
            aria-hidden
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d={MARITIME_SHIP_ICON_PATH} fill="currentColor" opacity="0.92" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-display text-xs uppercase tracking-[0.35em] text-amber-600 dark:text-amber-400">
              Ocean freight desk
            </p>
            <h1 className="font-display mt-2 text-4xl uppercase tracking-[0.06em] text-slate-900 dark:text-white sm:text-5xl">
              Maritime Line
            </h1>
            <p className="font-serif mt-3 max-w-xl text-base leading-relaxed text-slate-600 dark:text-slate-400">
              Indicative Guangzhou → Jebel Ali estimate. Chargeable CBM, live breakdown, and export-style quote.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 lg:flex-col lg:items-end">
          <ThemeToggle />
          <div className="w-full min-w-[260px] rounded-2xl border border-amber-500/35 bg-white/95 px-4 py-3 text-slate-900 shadow-lg shadow-slate-900/5 backdrop-blur-md dark:border-amber-500/30 dark:bg-slate-950/80 dark:text-white dark:shadow-black/30">
            <p className="font-display text-xs uppercase tracking-[0.25em] text-amber-700 dark:text-amber-400/90">Active lane</p>
            <p className="font-display mt-2 flex flex-wrap items-center gap-2 text-xl tracking-wide">
              <span>Guangzhou</span>
              <span className="text-amber-600 dark:text-amber-400" aria-hidden>
                →
              </span>
              <span>Jebel Ali</span>
            </p>
          </div>
        </div>
      </header>

      <div className="mb-10">
        <RouteWorldMap />
      </div>

      <form
        id={formId}
        className="grid gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start"
        onSubmit={handleSubmit(() => undefined)}
        noValidate
      >
        <section
          className="flex flex-col rounded-2xl border border-slate-200/90 bg-white/95 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-md dark:border-slate-700/80 dark:bg-gradient-to-b dark:from-slate-950 dark:to-[#0b1422] dark:shadow-xl dark:shadow-black/40 dark:ring-1 dark:ring-amber-500/10 sm:p-7 lg:self-start"
          aria-labelledby="shipment-heading"
        >
          <h2 id="shipment-heading" className="font-display text-2xl uppercase tracking-[0.12em] text-slate-900 dark:text-white">
            Shipment details
          </h2>
          <p className="font-serif mt-2 text-sm leading-snug text-slate-600 dark:text-slate-300">
            Values validate as you type — no submit required. Rate uses max(volume CBM, weight ÷ {KG_PER_CBM_EQUIVALENT}).
          </p>

          <div className="mt-7 flex flex-col space-y-6">
            <div>
              <label htmlFor={`${formId}-weight`} className="block text-sm font-medium text-slate-800 dark:text-slate-100">
                Gross weight (kg)
              </label>
              <Controller
                name="grossWeightKg"
                control={control}
                render={({ field }) => (
                  <div className="mt-2 space-y-3">
                    <input
                      id={`${formId}-weight`}
                      type="number"
                      min={WEIGHT_MIN}
                      step="any"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="e.g. 2000"
                      aria-invalid={Boolean(errors.grossWeightKg)}
                      aria-describedby={errors.grossWeightKg ? `${formId}-weight-err` : `${formId}-weight-hint`}
                      value={field.value === undefined || field.value === null ? "" : field.value}
                      onChange={(e) => {
                        const raw = e.target.value;
                        field.onChange(raw === "" ? undefined : parseFloat(raw));
                      }}
                      onBlur={field.onBlur}
                      className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-base text-slate-900 outline-none ring-amber-500/0 transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/25 dark:border-slate-600 dark:bg-[#0d1420] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-amber-400 dark:focus:ring-amber-400/20"
                    />
                    <input
                      type="range"
                      min={WEIGHT_MIN}
                      max={WEIGHT_MAX}
                      step="50"
                      aria-label="Adjust gross weight in kilograms"
                      value={clamp(
                        typeof field.value === "number" && Number.isFinite(field.value) ? field.value : WEIGHT_MIN,
                        WEIGHT_MIN,
                        WEIGHT_MAX,
                      )}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-amber-600 dark:bg-slate-800/90 dark:accent-amber-400"
                    />
                  </div>
                )}
              />
              <p id={`${formId}-weight-hint`} className="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400">
                Slider range {WEIGHT_MIN.toLocaleString()}–{WEIGHT_MAX.toLocaleString()} kg — you can type any valid value.
              </p>
              {errors.grossWeightKg ? (
                <p id={`${formId}-weight-err`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.grossWeightKg.message}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor={`${formId}-volume`} className="block text-sm font-medium text-slate-800 dark:text-slate-100">
                Volume (CBM)
              </label>
              <Controller
                name="volumeCbm"
                control={control}
                render={({ field }) => (
                  <div className="mt-2 space-y-3">
                    <input
                      id={`${formId}-volume`}
                      type="number"
                      min={VOLUME_MIN}
                      step="any"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="e.g. 2"
                      aria-invalid={Boolean(errors.volumeCbm)}
                      aria-describedby={errors.volumeCbm ? `${formId}-vol-err` : `${formId}-vol-hint`}
                      value={field.value === undefined || field.value === null ? "" : field.value}
                      onChange={(e) => {
                        const raw = e.target.value;
                        field.onChange(raw === "" ? undefined : parseFloat(raw));
                      }}
                      onBlur={field.onBlur}
                      className="block w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-mono text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/25 dark:border-slate-600 dark:bg-[#0d1420] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-amber-400 dark:focus:ring-amber-400/20"
                    />
                    <input
                      type="range"
                      min={VOLUME_MIN}
                      max={VOLUME_MAX}
                      step="0.5"
                      aria-label="Adjust volume in cubic meters"
                      value={clamp(
                        typeof field.value === "number" && Number.isFinite(field.value) ? field.value : VOLUME_MIN,
                        VOLUME_MIN,
                        VOLUME_MAX,
                      )}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-amber-600 dark:bg-slate-800/90 dark:accent-amber-400"
                    />
                  </div>
                )}
              />
              <p id={`${formId}-vol-hint`} className="mt-1.5 text-xs leading-snug text-slate-500 dark:text-slate-400">
                Slider up to {VOLUME_MAX} CBM — type larger volumes if needed.
              </p>
              {errors.volumeCbm ? (
                <p id={`${formId}-vol-err`} className="mt-1.5 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.volumeCbm.message}
                </p>
              ) : null}
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 dark:border-slate-600/50 dark:bg-slate-900/70 dark:shadow-inner dark:shadow-black/20">
              <div className="flex flex-row items-center justify-between gap-3">
                <div className="min-w-0 flex-1 pr-2">
                  <span id={`${formId}-doc-label`} className="text-sm font-medium text-slate-800 dark:text-slate-100">
                    Local documentation
                  </span>
                  <p className="font-serif mt-1 text-xs leading-snug text-slate-500 dark:text-slate-400">
                    Adds {formatUsd(LOCAL_DOCUMENTATION_FEE_USD)} when enabled.
                  </p>
                </div>
                <Controller
                  name="localDocumentation"
                  control={control}
                  render={({ field }) => (
                    <button
                      type="button"
                      role="switch"
                      aria-checked={field.value}
                      aria-labelledby={`${formId}-doc-label`}
                      onClick={() => field.onChange(!field.value)}
                      className={`relative inline-flex h-9 w-[3.25rem] shrink-0 cursor-pointer rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400 ${
                        field.value
                          ? "border-amber-600 bg-gradient-to-r from-amber-600 to-amber-500 shadow-sm shadow-amber-900/20 dark:border-amber-400 dark:from-amber-500 dark:to-amber-400"
                          : "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-800"
                      }`}
                    >
                      <motion.span
                        transition={{ type: "spring", stiffness: 450, damping: 30 }}
                        className="absolute top-0.5 left-0.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[9px] font-bold leading-none text-slate-600 shadow ring-1 ring-slate-200/80 dark:bg-slate-100 dark:text-slate-700 dark:ring-slate-600/40"
                        animate={{ x: field.value ? 26 : 0 }}
                      >
                        {field.value ? "ON" : "OFF"}
                      </motion.span>
                      <span className="sr-only">{field.value ? "Documentation included" : "Documentation not included"}</span>
                    </button>
                  )}
                />
              </div>
            </div>

            <div className="flex flex-col gap-2.5 rounded-2xl border border-dashed border-amber-500/45 bg-amber-50/60 p-4 dark:border-amber-500/35 dark:bg-gradient-to-br dark:from-amber-950/50 dark:to-slate-950/80 dark:ring-1 dark:ring-amber-500/10">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span id={`${formId}-whatif`} className="font-display text-sm uppercase tracking-[0.15em] text-amber-800 dark:text-amber-300">
                  What-if compare
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={whatIf}
                  aria-labelledby={`${formId}-whatif`}
                  onClick={() => setWhatIf((w) => !w)}
                  className={`relative inline-flex h-9 w-[3.25rem] shrink-0 rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:focus-visible:ring-amber-400 ${
                    whatIf
                      ? "border-amber-600 bg-amber-500 shadow-sm shadow-amber-900/20 dark:border-amber-400 dark:bg-amber-500"
                      : "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-800"
                  }`}
                >
                  <motion.span
                    layout
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                    className="absolute top-0.5 left-0.5 h-8 w-8 rounded-full bg-white shadow ring-1 ring-slate-200/80 dark:bg-slate-100 dark:ring-slate-600/40"
                    animate={{ x: whatIf ? 26 : 0 }}
                  />
                </button>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Side-by-side totals: freight only vs including documentation.
              </p>
            </div>
          </div>
        </section>

        <section
          className="relative flex flex-col rounded-2xl border border-slate-200/90 bg-white/70 p-5 shadow-xl backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/70 sm:p-6"
          aria-labelledby="results-heading"
        >
          <div className="flex shrink-0 flex-wrap items-end justify-between gap-2 sm:gap-3">
            <div>
              <h2 id="results-heading" className="font-display text-2xl uppercase tracking-[0.12em] text-slate-900 dark:text-white">
                Estimate
              </h2>
              <p className="font-serif mt-0.5 text-sm leading-snug text-slate-600 dark:text-slate-400">
                {formatUsd(USD_PER_CBM)} per chargeable CBM · docs {formatUsd(LOCAL_DOCUMENTATION_FEE_USD)} optional
              </p>
            </div>
            <AnimatePresence>
              {isValid && parsed ? (
                <motion.span
                  initial={{ scale: 0.85, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.85, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 24 }}
                  className="inline-flex items-center rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                >
                  Inputs valid
                </motion.span>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="relative mt-5 min-h-[280px]">
            <div
              className={`transition duration-500 ${!isValid || !parsed || !breakdown ? "pointer-events-none blur-sm" : ""}`}
              aria-hidden={!isValid || !parsed || !breakdown}
            >
              {breakdown && parsed ? (
                <div className="space-y-5">
                  <AnimatePresence mode="sync">
                    {whatIf && breakdownNoDocs && breakdownWithDocs ? (
                      <motion.div
                        key="whatif"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <WhatIfCompare withDocs={breakdownWithDocs} withoutDocs={breakdownNoDocs} />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>

                  <motion.div
                    key={`break-${localDocumentation}`}
                    initial={{ opacity: 0.6 }}
                    animate={{ opacity: 1 }}
                  >
                    <BreakdownSteps breakdown={breakdown} grossWeightKg={parsed.weight} />
                  </motion.div>

                  <motion.div
                    initial={false}
                    animate={isValid ? { scale: [1, 1.02, 1] } : {}}
                    transition={{ duration: 0.45 }}
                    className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 px-5 py-4 text-white shadow-inner dark:from-slate-950 dark:to-slate-900"
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-xs uppercase tracking-[0.25em] text-amber-400/90">Estimated total</p>
                        <p className="font-display mt-1 text-4xl tracking-wide">
                          <AnimatedMoney value={breakdown.totalUsd} />
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowReceipt(true)}
                        aria-haspopup="dialog"
                        aria-expanded={showReceipt}
                        aria-controls={`${formId}-receipt-dialog`}
                        className="font-display shrink-0 rounded-xl border border-amber-400/45 bg-amber-500/15 px-4 py-3 text-xs uppercase tracking-[0.18em] text-amber-100 transition hover:border-amber-400/70 hover:bg-amber-500/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400/80 sm:py-2.5"
                      >
                        View receipt
                      </button>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Complete weight and volume to unlock results.</p>
                </div>
              )}
            </div>

            {(!isValid || !parsed || !breakdown) && (
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-slate-100/55 px-6 text-center dark:bg-slate-950/55">
                <p className="max-w-xs text-sm font-medium text-slate-600 dark:text-slate-300">
                  Enter valid gross weight and volume (both greater than zero)
                </p>
              </div>
            )}
          </div>
        </section>
      </form>

      {parsed && breakdown ? (
        <ReceiptModal
          open={showReceipt}
          onClose={() => setShowReceipt(false)}
          titleId={`${formId}-receipt-modal-title`}
          dialogId={`${formId}-receipt-dialog`}
        >
          <FreightQuoteCard
            embedInModal
            breakdown={breakdown}
            grossWeightKg={parsed.weight}
            quoteId={quoteId}
            quoteDate={quoteDate}
          />
        </ReceiptModal>
      ) : null}
    </div>
  );
}
