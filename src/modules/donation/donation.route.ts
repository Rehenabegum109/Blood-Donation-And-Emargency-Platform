import { Router } from "express";

import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { Role } from "../../generated/prisma/enums";

import { DonationController } from "./donation.controller";
import { donationValidation } from "./donation.validation";

const router = Router();


router.post(
  "/",
  auth(Role.DONOR),
  validateRequest(
    donationValidation.CreateDonationZodSchema
  ),
  DonationController.createDonation
);

router.get(
  "/my",
  auth(Role.DONOR),
  DonationController.getMyDonations
);

router.patch(
  "/:id/approve",
  auth(Role.RECIPIENT),
  DonationController.approveDonation
);
router.patch(
  "/:id/reject",
  auth(Role.RECIPIENT),
  DonationController.rejectDonation
);
export const DonationRoutes = router;