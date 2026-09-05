import type { Response } from "express";
import httpStatus from "http-status";

import type { AuthenticatedRequest } from "../../middlewares/auth";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AdminService } from "./admin.service";




const getAllUsers = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = req.query.page
      ? Number(req.query.page)
      : 1;

    const limit = req.query.limit
      ? Number(req.query.limit)
      : 10;

    const searchTerm =
      typeof req.query.searchTerm === "string"
        ? req.query.searchTerm
        : undefined;

    const role =
      typeof req.query.role === "string"
        ? req.query.role
        : undefined;

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : undefined;

    if (Number.isNaN(page) || page < 1) {
      throw new Error("Page must be a positive number");
    }

    if (Number.isNaN(limit) || limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

    const result = await AdminService.getAllUsers(
      page,
      limit,
      searchTerm,
      role,
      status
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Users retrieved successfully",
      data: result,
    });
  }
);

const blockUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;
    const { id } = req.params;

    if (!adminId) {
      throw new Error("Admin user not found");
    }

    if (!id || Array.isArray(id)) {
      throw new Error("User ID is required");
    }

    const result = await AdminService.blockUser(
      adminId,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User blocked successfully",
      data: result,
    });
  }
);

const unblockUser = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const adminId = req.user?.id;
    const { id } = req.params;

    if (!adminId) {
      throw new Error("Admin user not found");
    }

    if (!id || Array.isArray(id)) {
      throw new Error("User ID is required");
    }

    const result = await AdminService.unblockUser(
      adminId,
      id
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User unblocked successfully",
      data: result,
    });
  }
);

const getDashboardStats = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const result = await AdminService.getDashboardStats();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: result,
    });
  }
);
const getAuditLogs = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const action =
      typeof req.query.action === "string"
        ? req.query.action
        : undefined;

    const entity =
      typeof req.query.entity === "string"
        ? req.query.entity
        : undefined;

    const userId =
      typeof req.query.userId === "string"
        ? req.query.userId
        : undefined;

    if (Number.isNaN(page) || page < 1) {
      throw new Error("Page must be a positive number");
    }

    if (Number.isNaN(limit) || limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

    const result = await AdminService.getAuditLogs(
      page,
      limit,
      action,
      entity,
      userId
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Audit logs retrieved successfully",
      data: result,
    });
  }
);

export const AdminController = {
  getAllUsers,
  blockUser,
  unblockUser,
  getDashboardStats,
  getAuditLogs,
};
