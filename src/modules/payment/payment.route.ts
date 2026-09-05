import { Router } from "express";

import { Role } from "../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";

import { PaymentController } from "./payment.controller";
import { paymentValidation } from "./payment.validation";

const router = Router();

router.post(
  "/initiate",
  auth(Role.RECIPIENT),
  validateRequest(
    paymentValidation.InitiatePaymentZodSchema
  ),
  PaymentController.initiatePayment
);

router.post(
  "/execute/:paymentID",
  auth(Role.RECIPIENT),
  PaymentController.executeBkashPayment
);

router.get(
  "/callback",
  PaymentController.bkashCallback
);



router.get(
  "/my",
  auth(Role.RECIPIENT),
  PaymentController.getMyPayments
);

router.get(
  "/all",
  auth(Role.ADMIN),
  PaymentController.getAllPayments
);

router.get(
  "/:id",
  auth(Role.RECIPIENT, Role.ADMIN),
  PaymentController.getSinglePayment
);

export const PaymentRoutes = router;
