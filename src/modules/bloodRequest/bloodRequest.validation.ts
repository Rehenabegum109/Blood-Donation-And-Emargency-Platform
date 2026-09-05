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

const RejectBloodRequestZodSchema = z.object({
  rejectionReason: z
    .string()
    .min(5, "Rejection reason must be at least 5 characters")
    .max(500, "Rejection reason cannot exceed 500 characters"),
});
export const bloodRequestValidation = {
  CreateBloodRequestZodSchema,
  UpdateBloodRequestZodSchema,
  RejectBloodRequestZodSchema,
};