import { z } from "zod";

const RegisterZodSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be at most 100 characters"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Password must contain uppercase, lowercase, number and special character"
    ),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 characters")
    .max(15, "Phone number must be at most 15 characters")
    .optional(),

  location: z
    .string()
    .optional(),
});

const LoginZodSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

const ForgetPasswordZodSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ResetPasswordZodSchema = z.object({
  email: z.string().email("Invalid email address"),

  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),

  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Password must contain uppercase, lowercase, number and special character"
    ),
});

const VerifyEmailZodSchema = z.object({
  email: z.string().email("Invalid email address"),

  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
const GoogleLoginZodSchema = z.object({
  credential: z
    .string()
    .min(1, "Google credential is required"),
});
export const authValidation = {
  RegisterZodSchema,
  LoginZodSchema,
  ForgetPasswordZodSchema,
  ResetPasswordZodSchema,
  VerifyEmailZodSchema,
  GoogleLoginZodSchema
};