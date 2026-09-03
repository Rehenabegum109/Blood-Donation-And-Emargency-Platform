import { z } from "zod";

const UpdateProfileZodSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().min(10).max(15).optional(),
  location: z.string().optional(),
  profileImage: z.string().url().optional(),
});

export const userValidation = {
  UpdateProfileZodSchema,
};