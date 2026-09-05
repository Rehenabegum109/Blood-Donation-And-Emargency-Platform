import { Router } from "express";
import { DonorController } from "./donor.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../../generated/prisma/enums";

const router = Router();

// Get my donor profile
router.get(
  "/me",
  auth(Role.DONOR),
  DonorController.getMyDonorProfile
);

// Match compatible donors
router.get(
  "/match/:bloodRequestId",
  auth(Role.RECIPIENT, Role.ADMIN),
  DonorController.matchDonors
);

// Find nearby compatible donors
router.get(
  "/nearby/:bloodRequestId",
  auth(Role.RECIPIENT, Role.ADMIN),
  DonorController.findNearbyDonors
);

// Update donor availability
router.patch(
  "/availability",
  auth(Role.DONOR),
  DonorController.updateAvailability
);

// Update donor location
router.patch(
  "/location",
  auth(Role.DONOR),
  DonorController.updateDonorLocation
);

export const DonorRoutes = router;