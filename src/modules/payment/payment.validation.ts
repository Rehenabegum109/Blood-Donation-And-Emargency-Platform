import { z } from "zod";

const InitiatePaymentZodSchema = z.object({
  bloodRequestId: z.string().uuid("Invalid blood request ID"),
});
const StripeCheckoutZodSchema = z.object({
   bloodRequestId: z.string().uuid("Invalid blood request ID"), 
  });
export const paymentValidation = {
  InitiatePaymentZodSchema,
  StripeCheckoutZodSchema,
};
