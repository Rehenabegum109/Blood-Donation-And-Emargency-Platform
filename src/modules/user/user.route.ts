import { Router } from "express";

import { UserController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { userValidation } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

const router = Router();

router.get(
  "/me",
  auth(),
  UserController.getMyProfile
);
router.patch(
  "/me",
  auth(),
  validateRequest(userValidation.UpdateProfileZodSchema),
  UserController.updateMyProfile
);

export const UserRoutes = router;