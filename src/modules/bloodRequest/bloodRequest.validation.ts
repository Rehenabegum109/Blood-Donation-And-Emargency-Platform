import { z } from "zod";

const CreateBloodRequestZodSchema = z.object({
  bloodGroup: z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE",
  ]),

  units: z.number().int().positive().default(1),

  hospitalName: z.string().min(2),

  hospitalAddress: z.string().optional(),

  requiredDate: z.coerce.date(),

  urgency: z
    .enum(["LOW", "NORMAL", "HIGH", "CRITICAL"])
    .default("NORMAL"),

  contactNumber: z.string().min(10).max(15).optional(),

  patientName: z.string().min(2).optional(),

  notes: z.string().optional(),
});

const UpdateBloodRequestZodSchema = z.object({
  bloodGroup: z
    .enum([
      "A_POSITIVE",
      "A_NEGATIVE",
      "B_POSITIVE",
      "B_NEGATIVE",
      "AB_POSITIVE",
      "AB_NEGATIVE",
      "O_POSITIVE",
      "O_NEGATIVE",
    ])
    .optional(),

  units: z.number().int().positive().optional(),

  hospitalName: z.string().min(2).optional(),

  hospitalAddress: z.string().optional(),

  requiredDate: z.coerce.date().optional(),

  urgency: z
    .enum(["LOW", "NORMAL", "HIGH", "CRITICAL"])
    .optional(),

  contactNumber: z.string().min(10).max(15).optional(),

  patientName: z.string().min(2).optional(),

  notes: z.string().optional(),
});

export const bloodRequestValidation = {
  CreateBloodRequestZodSchema,
  UpdateBloodRequestZodSchema,
};