import { z } from "zod";

export const freightFormSchema = z
  .object({
    grossWeightKg: z.union([z.number(), z.undefined()]),
    volumeCbm: z.union([z.number(), z.undefined()]),
    localDocumentation: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const w = data.grossWeightKg;
    if (w === undefined) {
      ctx.addIssue({ code: "custom", path: ["grossWeightKg"], message: "Enter gross weight in kg" });
    } else if (!Number.isFinite(w) || w <= 0) {
      ctx.addIssue({ code: "custom", path: ["grossWeightKg"], message: "Weight must be greater than 0" });
    }
    const v = data.volumeCbm;
    if (v === undefined) {
      ctx.addIssue({ code: "custom", path: ["volumeCbm"], message: "Enter volume in CBM" });
    } else if (!Number.isFinite(v) || v <= 0) {
      ctx.addIssue({ code: "custom", path: ["volumeCbm"], message: "Volume must be greater than 0" });
    }
  })
  .transform((data) => ({
    grossWeightKg: data.grossWeightKg!,
    volumeCbm: data.volumeCbm!,
    localDocumentation: data.localDocumentation,
  }));

export type FreightFormInput = z.input<typeof freightFormSchema>;
export type FreightFormValues = z.output<typeof freightFormSchema>;
