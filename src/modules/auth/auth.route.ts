import { NextFunction, Request, Response, Router } from "express";

import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";
import { auth } from "../../middlewares/auth";


const router = Router();



router.post(
  "/register",
  validateRequest(authValidation.RegisterZodSchema),
  AuthController.register
);
router.post(
  "/verify-email",
  validateRequest(authValidation.VerifyEmailZodSchema),
  AuthController.verifyEmail
);
router.post(
  "/login",
  validateRequest(authValidation.LoginZodSchema),
  AuthController.loginUser
);
router.post(
  "/refresh-token",
  AuthController.refreshAccessToken
);


export const AuthRoutes = router;