import { z } from "zod";

const CreateDonationZodSchema = z.object({
  bloodRequestId: z
    .string()
    .uuid("Invalid blood request ID"),

  units: z
    .number()
    .int("Units must be an integer")
    .positive("Units must be greater than 0")
    .max(10, "Units cannot be more than 10")
    .default(1),

  notes: z
    .string()
    .max(500, "Notes cannot exceed 500 characters")
    .optional(),
});

export const donationValidation = {
  CreateDonationZodSchema,
};