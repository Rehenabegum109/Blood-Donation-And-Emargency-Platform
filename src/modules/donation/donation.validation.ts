import { z } from "zod";

const CreateDonationZodSchema = z.object({
  bloodRequestId: z.string().uuid("Invalid blood request ID"),

  units: z
    .number()
    .int()
    .positive()
    .default(1),

  notes: z.string().optional(),
});

export const donationValidation = {
  CreateDonationZodSchema,
};