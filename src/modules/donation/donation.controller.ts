import type { Response } from "express";
import httpStatus from "http-status";


import type { AuthenticatedRequest } from "../../middlewares/auth";
import { sendResponse } from "../../utils/sendResponse";

import { DonationService } from "./donation.service";
import { catchAsync } from "../../utils/catchAsync";


const createDonation = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const donorUserId = req.user?.id;

    if (!donorUserId) {
      throw new Error("User not found");
    }

    const result = await DonationService.createDonation(
      donorUserId,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Donation request created successfully",
      data: result,
    });
  }
);

const getMyDonations = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const donorUserId = req.user?.id;

    if (!donorUserId) {
      throw new Error("User not found");
    }

    const result = await DonationService.getMyDonations(
      donorUserId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My donations retrieved successfully",
      data: result,
    });
  }
);
const approveDonation = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const recipientId = req.user?.id;

    if (!recipientId) {
      throw new Error("User not found");
    }

    const donationId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!donationId) {
      throw new Error("Donation ID is required");
    }

    const result = await DonationService.approveDonation(
      donationId,
      recipientId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Donation approved successfully",
      data: result,
    });
  }
);
const rejectDonation = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const recipientId = req.user?.id;

    if (!recipientId) {
      throw new Error("User not found");
    }

    const donationId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!donationId) {
      throw new Error("Donation ID is required");
    }

    const result = await DonationService.rejectDonation(
      donationId,
      recipientId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Donation rejected successfully",
      data: result,
    });
  }
);
export const DonationController = {
  createDonation,
  getMyDonations,
  approveDonation,
  rejectDonation,
};