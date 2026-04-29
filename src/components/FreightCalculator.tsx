"use client";

import { useMemo, useState } from "react";
import {
  computeFreightEstimate,
  KG_PER_CBM_EQUIVALENT,
  LOCAL_DOCUMENTATION_FEE_USD,
  USD_PER_CBM,
} from "@/lib/freight";

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

function formatCbm(n: number) {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3,
  }).format(n);
}

type FieldErrors = {
  weight?: string;
  volume?: string;
};

function parsePositiveNumber(raw: string): { ok: true; value: number } | { ok: false } {
  const trimmed = raw.trim();
  if (trimmed === "") return { ok: false };
  const n = Number(trimmed);
  if (!Number.isFinite(n)) return { ok: false };
  if (n <= 0) return { ok: false };
  return { ok: true, value: n };
}

export function FreightCalculator() {
  const [weightInput, setWeightInput] = useState("");
  const [volumeInput, setVolumeInput] = useState("");
  const [documentation, setDocumentation] = useState(false);
  const [touched, setTouched] = useState({ weight: false, volume: false });
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo((): FieldErrors => {
    const next: FieldErrors = {};
    const w = parsePositiveNumber(weightInput);
    const v = parsePositiveNumber(volumeInput);

    const showWeight = touched.weight || submitted;
    const showVolume = touched.volume || submitted;

    if (showWeight) {
      if (weightInput.trim() === "") next.weight = "Enter gross weight in kg.";
      else if (!w.ok) next.weight = "Use a number greater than zero.";
    }
    if (showVolume) {
      if (volumeInput.trim() === "") next.volume = "Enter volume in CBM.";
      else if (!v.ok) next.volume = "Use a number greater than zero.";
    }
    return next;
  }, [weightInput, volumeInput, touched, submitted]);

  const weightParsed = parsePositiveNumber(weightInput);
  const volumeParsed = parsePositiveNumber(volumeInput);
  const isValid = weightParsed.ok && volumeParsed.ok;

  const breakdown = useMemo(() => {
    const w = parsePositiveNumber(weightInput);
    const v = parsePositiveNumber(volumeInput);
    if (!w.ok || !v.ok) return null;
    return computeFreightEstimate(w.value, v.value, documentation);
  }, [weightInput, volumeInput, documentation]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTouched({ weight: true, volume: true });
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <header className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-900/20"
            aria-hidden
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 18h16v2H4v-2zm2-3h12l1-9H5l1 9zm3-11h6l1 4H8l1-4z"
                fill="currentColor"
                opacity="0.92"
              />
            </svg>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
              Demo estimator
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-3xl">
              FreightDesk
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              Quick ocean freight quote for a single lane. Numbers are illustrative only.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200/80 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm dark:border-zinc-700 dark:bg-zinc-900/60">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Route
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-base font-semibold text-zinc-900 dark:text-zinc-100">
            <span>Guangzhou</span>
            <span
              className="inline-flex items-center rounded-full bg-sky-100 px-2 py-0.5 text-xs font-medium text-sky-800 dark:bg-sky-950/80 dark:text-sky-200"
              aria-hidden
            >
              →
            </span>
            <span>Jebel Ali</span>
          </p>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-10 lg:items-start">
        <section
          className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950 sm:p-8"
          aria-labelledby="estimate-heading"
        >
          <h2 id="estimate-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Shipment details
          </h2>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            All fields are required. Rates use chargeable CBM (max of volume vs weight equivalent).
          </p>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
            <div>
              <label htmlFor="weight" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Gross weight (kg)
              </label>
              <input
                id="weight"
                name="weight"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="e.g. 2000"
                value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, weight: true }))}
                aria-invalid={Boolean(errors.weight)}
                aria-describedby={errors.weight ? "weight-error" : undefined}
                className="mt-2 block w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-base text-zinc-900 outline-none ring-sky-500/40 transition placeholder:text-zinc-400 focus:border-sky-500 focus:bg-white focus:ring-4 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:bg-zinc-900"
              />
              {errors.weight ? (
                <p id="weight-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.weight}
                </p>
              ) : null}
            </div>

            <div>
              <label htmlFor="volume" className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
                Volume (CBM)
              </label>
              <input
                id="volume"
                name="volume"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="e.g. 2"
                value={volumeInput}
                onChange={(e) => setVolumeInput(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, volume: true }))}
                aria-invalid={Boolean(errors.volume)}
                aria-describedby={errors.volume ? "volume-error" : undefined}
                className="mt-2 block w-full rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3 text-base text-zinc-900 outline-none ring-sky-500/40 transition placeholder:text-zinc-400 focus:border-sky-500 focus:bg-white focus:ring-4 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-100 dark:focus:bg-zinc-900"
              />
              {errors.volume ? (
                <p id="volume-error" className="mt-2 text-sm text-red-600 dark:text-red-400" role="alert">
                  {errors.volume}
                </p>
              ) : null}
            </div>

            <div className="rounded-xl border border-zinc-100 bg-zinc-50/90 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span id="doc-label" className="text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    Local documentation needed?
                  </span>
                  <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                    Adds {formatUsd(LOCAL_DOCUMENTATION_FEE_USD)} when enabled.
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={documentation}
                  aria-labelledby="doc-label"
                  onClick={() => setDocumentation((d) => !d)}
                  className={`relative inline-flex h-9 w-[3.25rem] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40 ${
                    documentation
                      ? "bg-sky-600 dark:bg-sky-500"
                      : "bg-zinc-300 dark:bg-zinc-600"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-8 w-8 translate-x-0.5 rounded-full bg-white shadow transition-transform ${
                      documentation ? "translate-x-[1.35rem]" : "translate-x-0"
                    }`}
                  />
                  <span className="sr-only">{documentation ? "Yes" : "No"}</span>
                </button>
              </div>
              <p className="mt-3 text-right text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {documentation ? "Yes — fee applies" : "No"}
              </p>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-zinc-900 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-500/40 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white sm:w-auto sm:px-8"
            >
              Calculate estimate
            </button>
          </form>
        </section>

        <section
          className="rounded-2xl border border-zinc-200 bg-gradient-to-b from-sky-50/80 to-white p-6 shadow-sm dark:border-zinc-800 dark:from-zinc-900/80 dark:to-zinc-950 sm:p-8"
          aria-labelledby="breakdown-heading"
        >
          <h2 id="breakdown-heading" className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
            Calculation breakdown
          </h2>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Chargeable CBM is the higher of actual volume and weight expressed as CBM (kg ÷ {KG_PER_CBM_EQUIVALENT}).
          </p>

          {!isValid ? (
            <div className="mt-10 rounded-xl border border-dashed border-zinc-300 bg-white/60 px-4 py-12 text-center dark:border-zinc-700 dark:bg-zinc-900/40">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Enter valid weight and volume to see line-by-line math and totals.
              </p>
            </div>
          ) : breakdown ? (
            <div className="mt-8 space-y-6">
              <ol className="space-y-4 text-sm">
                <li className="flex flex-col gap-1 rounded-xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900/70 dark:ring-zinc-800 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    1. Weight → CBM
                  </span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    {formatCbm(breakdown.weightFromKgCbm * KG_PER_CBM_EQUIVALENT)} kg ÷{" "}
                    {KG_PER_CBM_EQUIVALENT} ={" "}
                    <strong className="text-zinc-900 dark:text-zinc-100">
                      {formatCbm(breakdown.weightFromKgCbm)} CBM
                    </strong>
                  </span>
                </li>
                <li className="flex flex-col gap-1 rounded-xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900/70 dark:ring-zinc-800 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    2. Actual volume
                  </span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-zinc-100">
                      {formatCbm(breakdown.actualVolumeCbm)} CBM
                    </strong>
                  </span>
                </li>
                <li className="rounded-xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-sky-200/80 dark:bg-zinc-900/70 dark:ring-sky-900/50">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <span className="font-medium text-zinc-800 dark:text-zinc-200">
                      3. Chargeable CBM
                    </span>
                    <span className="font-mono text-lg font-semibold text-sky-800 dark:text-sky-200">
                      {formatCbm(breakdown.chargeableCbm)} CBM
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {breakdown.chargeableFrom === "weight"
                      ? `Uses weight equivalent (${formatCbm(breakdown.weightFromKgCbm)} CBM) because it is greater than or equal to actual volume (${formatCbm(breakdown.actualVolumeCbm)} CBM).`
                      : `Uses actual volume (${formatCbm(breakdown.actualVolumeCbm)} CBM) because it exceeds weight equivalent (${formatCbm(breakdown.weightFromKgCbm)} CBM).`}
                  </p>
                </li>
                <li className="flex flex-col gap-1 rounded-xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900/70 dark:ring-zinc-800 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    4. Freight ({formatUsd(USD_PER_CBM)} / CBM)
                  </span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    {formatCbm(breakdown.chargeableCbm)} × {formatUsd(USD_PER_CBM)} ={" "}
                    <strong className="text-zinc-900 dark:text-zinc-100">
                      {formatUsd(breakdown.freightUsd)}
                    </strong>
                  </span>
                </li>
                <li className="flex flex-col gap-1 rounded-xl bg-white/90 px-4 py-3 shadow-sm ring-1 ring-zinc-100 dark:bg-zinc-900/70 dark:ring-zinc-800 sm:flex-row sm:items-baseline sm:justify-between">
                  <span className="font-medium text-zinc-800 dark:text-zinc-200">
                    5. Local documentation
                  </span>
                  <span className="font-mono text-zinc-700 dark:text-zinc-300">
                    {breakdown.documentationUsd > 0 ? (
                      <>
                        + {formatUsd(breakdown.documentationUsd)}
                      </>
                    ) : (
                      <span className="text-zinc-500 dark:text-zinc-500">Not selected</span>
                    )}
                  </span>
                </li>
              </ol>

              <div className="rounded-2xl bg-zinc-900 px-5 py-5 text-white dark:bg-zinc-100 dark:text-zinc-900">
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
                  Estimated total
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">
                  {formatUsd(breakdown.totalUsd)}
                </p>
                <p className="mt-3 text-xs text-zinc-400 dark:text-zinc-600">
                  Example: 2000 kg → 4 CBM vs 2 CBM actual → chargeable 4 CBM → freight{" "}
                  {formatUsd(4 * USD_PER_CBM)} before optional docs.
                </p>
              </div>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
