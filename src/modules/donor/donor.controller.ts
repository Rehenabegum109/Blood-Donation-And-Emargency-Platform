import type { Response } from "express";
import httpStatus from "http-status";

import type { AuthenticatedRequest } from "../../middlewares/auth";
import { sendResponse } from "../../utils/sendResponse";
import { catchAsync } from "../../utils/catchAsync";

import { DonorService } from "./donor.service";

const getMyDonorProfile = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const result = await DonorService.getMyDonorProfile(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Donor profile retrieved successfully",
      data: result,
    });
  }
);

const matchDonors = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { bloodRequestId } = req.params;

    if (!bloodRequestId || Array.isArray(bloodRequestId)) {
      throw new Error("Blood request ID is required");
    }

    const result = await DonorService.matchDonors(
      bloodRequestId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Compatible donors retrieved successfully",
      data: result,
    });
  }
);

const findNearbyDonors = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { bloodRequestId } = req.params;

    if (!bloodRequestId || Array.isArray(bloodRequestId)) {
      throw new Error("Blood request ID is required");
    }

    const radiusKm = req.query.radius
      ? Number(req.query.radius)
      : 20;

    if (Number.isNaN(radiusKm) || radiusKm <= 0) {
      throw new Error("Radius must be a positive number");
    }

    const result = await DonorService.findNearbyDonors(
      bloodRequestId,
      radiusKm
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Nearby compatible donors retrieved successfully",
      data: result,
    });
  }
);

const updateAvailability = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const { isAvailable } = req.body;

    if (typeof isAvailable !== "boolean") {
      throw new Error("isAvailable must be a boolean");
    }

    const result = await DonorService.updateAvailability(
      userId,
      isAvailable
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Donor availability updated successfully",
      data: result,
    });
  }
);

const updateDonorLocation = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      throw new Error("User not found");
    }

    const {
      latitude,
      longitude,
      address,
    } = req.body;

    if (
      typeof latitude !== "number" ||
      typeof longitude !== "number"
    ) {
      throw new Error(
        "Latitude and longitude must be numbers"
      );
    }

    const result = await DonorService.updateDonorLocation(
      userId,
      latitude,
      longitude,
      address
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Donor location updated successfully",
      data: result,
    });
  }
);

export const DonorController = {
  getMyDonorProfile,
  matchDonors,
  findNearbyDonors,
  updateAvailability,
  updateDonorLocation,
};