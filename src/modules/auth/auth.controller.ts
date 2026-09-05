import type { Request, Response } from "express";
import httpStatus from "http-status";

import { AuthService } from "./auth.service";
import { authValidation } from "./auth.validation";
import { sendResponse } from "../../utils/sendResponse";

import { catchAsync } from "../../utils/catchAsync";

const register = catchAsync(
  async (req: Request, res: Response) => {
        console.log("REQ BODY:", req.body);
    const payload =
      authValidation.RegisterZodSchema.safeParse(req.body);

    if (!payload.success) {
      const errorMessage = payload.error.issues
        .map((issue) => issue.message)
        .join(" ");

      throw new Error(errorMessage);
    }

    const result = await AuthService.register(payload.data);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.CREATED,
      message:
        "Registration successful. Please check your email to verify your account.",
      data: result,
    });
  }
);
const verifyEmail = catchAsync(
  async (req: Request, res: Response) => {
    const payload =
      authValidation.VerifyEmailZodSchema.safeParse(req.body);

    if (!payload.success) {
      const errorMessage = payload.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new Error(errorMessage);
    }

    const result = await AuthService.verifyEmail(
      payload.data.email,
      payload.data.otp
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Email verified successfully",
      data: result,
    });
  }
);

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = authValidation.LoginZodSchema.safeParse(req.body);

  if (!payload.success) {
    let errorMessage = "";

    payload.error.issues.forEach((issue) => {
      errorMessage += `${issue.message} `;
    });

    throw new Error(errorMessage);
  }

  const result = await AuthService.loginUser(payload.data);

  const { accessToken, refreshToken, user } = result;

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24, 
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7, 
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken,
      user,
    },
  });
});
const refreshAccessToken = catchAsync(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    const result = await AuthService.refreshAccessToken(
      refreshToken
    );

    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24,
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Access token refreshed successfully",
      data: result,
    });
  }
);
const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const payload =
      authValidation.ForgetPasswordZodSchema.safeParse(req.body);

    if (!payload.success) {
      const errorMessage = payload.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new Error(errorMessage);
    }

    const result = await AuthService.forgotPassword(
      payload.data.email
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
      data: null,
    });
  }
);


const resetPassword = catchAsync(
  async (req: Request, res: Response) => {
    const payload =
      authValidation.ResetPasswordZodSchema.safeParse(req.body);

    if (!payload.success) {
      const errorMessage = payload.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new Error(errorMessage);
    }

    const result = await AuthService.resetPassword(
      payload.data.email,
      payload.data.otp,
      payload.data.newPassword
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: result.message,
      data: null,
    });
  }
);
export const AuthController = {
  register,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
};
