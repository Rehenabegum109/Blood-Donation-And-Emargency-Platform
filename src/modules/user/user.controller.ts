import type { Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserService } from "./user.service";
import type { AuthenticatedRequest } from "../../middlewares/auth";
import { userValidation } from "./user.validation";

const getMyProfile = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const result = await UserService.getMyProfile(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile retrieved successfully",
      data: result,
    });
  }
);
const updateMyProfile = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const result = await UserService.updateMyProfile(
      userId,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      data: result,
    });
  }
);

export const UserController = {
  getMyProfile,
  updateMyProfile,
};