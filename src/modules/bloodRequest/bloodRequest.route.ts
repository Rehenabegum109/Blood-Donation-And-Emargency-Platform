import { Router } from "express";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { BloodRequestController } from "./bloodRequest.controller";
import { bloodRequestValidation } from "./bloodRequest.validation";
import { Role } from "../../generated/prisma/enums";

const router = Router();


router.post(
  "/",
  auth(Role.RECIPIENT),
  validateRequest(
    bloodRequestValidation.CreateBloodRequestZodSchema
  ),
  BloodRequestController.createBloodRequest
);


router.get(
  "/",
  auth(Role.ADMIN, Role.DONOR, Role.RECIPIENT),
  BloodRequestController.getAllBloodRequests
);


router.get(
  "/search",
  auth(Role.ADMIN, Role.DONOR, Role.RECIPIENT),
  BloodRequestController.searchBloodRequests
);

router.get(
  "/:id",
  auth(Role.ADMIN, Role.DONOR, Role.RECIPIENT),
  BloodRequestController.getBloodRequestById
);


router.patch(
  "/:id",
  auth(Role.RECIPIENT),
  validateRequest(
    bloodRequestValidation.UpdateBloodRequestZodSchema
  ),
  BloodRequestController.updateBloodRequest
);


router.delete(
  "/:id",
  auth(Role.RECIPIENT),
  BloodRequestController.deleteBloodRequest
);

export const BloodRequestRoutes = router;