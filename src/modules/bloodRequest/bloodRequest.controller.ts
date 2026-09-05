import { Request, Response } from "express";
import httpStatus from "http-status";

import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import type { AuthenticatedRequest } from "../../middlewares/auth";

import { bloodRequestValidation } from "./bloodRequest.validation";
import { BloodRequestService } from "./bloodRequest.service";

const createBloodRequest = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const recipientId = req.user?.id;

    if (!recipientId) {
      throw new Error("User not found");
    }

    const payload =
      bloodRequestValidation.CreateBloodRequestZodSchema.safeParse(
        req.body
      );

    if (!payload.success) {
      const errorMessage = payload.error.issues
        .map((issue) => issue.message)
        .join(", ");

      throw new Error(errorMessage);
    }

    const result = await BloodRequestService.createBloodRequest(
      recipientId,
      payload.data
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Blood request created successfully",
      data: result,
    });
  }
);
const getAllBloodRequests = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const query = req.query;

    const limit = query.limit ? Number(query.limit) : 10;

    const page = query.page ? Number(query.page) : 1;

    const skip = (page - 1) * limit;

    const sortBy = query.sortBy ? String(query.sortBy) : "createdAt";

    const sortOrder = query.sortOrder
      ? String(query.sortOrder)
      : "desc";

    const status =
      typeof query.status === "string"
        ? query.status
        : undefined;

    const bloodGroup =
      typeof query.bloodGroup === "string"
        ? query.bloodGroup
        : undefined;

    const result = await BloodRequestService.getAllBloodRequests(
      page,
      limit,
      status,
      bloodGroup,
      sortBy,
      sortOrder
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blood requests retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

const getBloodRequestById = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!id) {
      throw new Error("Blood request ID is required");
    }

    const result =
      await BloodRequestService.getBloodRequestById(id);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blood request retrieved successfully",
      data: result,
    });
  }
);
const updateBloodRequest = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const recipientId = req.user?.id;

    if (!id) {
      throw new Error("Blood request ID is required");
    }

    if (!recipientId) {
      throw new Error("User not found");
    }

    const result = await BloodRequestService.updateBloodRequest(
      id,
      recipientId,
      req.body
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blood request updated successfully",
      data: result,
    });
  }
);
const deleteBloodRequest = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const id = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const recipientId = req.user?.id;

    if (!id) {
      throw new Error("Blood request ID is required");
    }

    if (!recipientId) {
      throw new Error("User not found");
    }

    const result = await BloodRequestService.deleteBloodRequest(
      id,
      recipientId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blood request deleted successfully",
      data: result,
    });
  }
);
const searchBloodRequests = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const searchTerm =
      typeof req.query.q === "string"
        ? req.query.q
        : "";

    if (!searchTerm) {
      throw new Error("Search keyword is required");
    }

    const page = req.query.page
      ? Number(req.query.page)
      : 1;

    const limit = req.query.limit
      ? Number(req.query.limit)
      : 10;

    const result =
      await BloodRequestService.searchBloodRequests(
        searchTerm,
        page,
        limit
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Blood requests search results retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);
const verifyBloodRequest = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;

    if (!adminId) {
      throw new Error("Admin authentication required");
    }
const bloodRequestId = Array.isArray(req.params.id)
  ? req.params.id[0]
  : req.params.id;

if (!bloodRequestId) {
  throw new Error("Blood request ID is required");
}

const result = await BloodRequestService.verifyBloodRequest(
  bloodRequestId,
  adminId
);

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Blood request verified successfully",
      data: result,
    });
  }
);
const rejectBloodRequest = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;

    if (!adminId) {
      throw new Error("Admin authentication required");
    }

    const bloodRequestId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    if (!bloodRequestId) {
      throw new Error("Blood request ID is required");
    }

    const { rejectionReason } = req.body;

    const result = await BloodRequestService.rejectBloodRequest(
      bloodRequestId,
      adminId,
      rejectionReason
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Blood request rejected successfully",
      data: result,
    });
  }
);
export const BloodRequestController = {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
  searchBloodRequests,
  verifyBloodRequest,
  rejectBloodRequest,
};