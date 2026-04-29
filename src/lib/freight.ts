export const KG_PER_CBM_EQUIVALENT = 500;
export const USD_PER_CBM = 265;
export const LOCAL_DOCUMENTATION_FEE_USD = 150;

export type FreightBreakdown = {
  weightFromKgCbm: number;
  actualVolumeCbm: number;
  chargeableCbm: number;
  chargeableFrom: "weight" | "volume";
  freightUsd: number;
  documentationUsd: number;
  totalUsd: number;
};

export function computeFreightEstimate(
  grossWeightKg: number,
  volumeCbm: number,
  localDocumentation: boolean,
): FreightBreakdown {
  const weightFromKgCbm = grossWeightKg / KG_PER_CBM_EQUIVALENT;
  const chargeableFrom =
    weightFromKgCbm >= volumeCbm ? ("weight" as const) : ("volume" as const);
  const chargeableCbm = Math.max(weightFromKgCbm, volumeCbm);
  const freightUsd = chargeableCbm * USD_PER_CBM;
  const documentationUsd = localDocumentation ? LOCAL_DOCUMENTATION_FEE_USD : 0;
  const totalUsd = freightUsd + documentationUsd;

  return {
    weightFromKgCbm,
    actualVolumeCbm: volumeCbm,
    chargeableCbm,
    chargeableFrom,
    freightUsd,
    documentationUsd,
    totalUsd,
  };
}
