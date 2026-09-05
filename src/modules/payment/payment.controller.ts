import type { Request, Response } from "express";
import httpStatus from "http-status";

import type { AuthenticatedRequest } from "../../middlewares/auth";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

import { PaymentService } from "./payment.service";

// ==================================================
// Initiate Payment
// ==================================================

const initiatePayment = catchAsync(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const recipientId = req.user?.id;

    if (!recipientId) {
      throw new Error("User not found");
    }

    const result =
      await PaymentService.initiatePayment(
        recipientId,
        req.body
      );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Payment initiated successfully",
      data: result,
    });
  }
);

// ==================================================
// Execute bKash Payment
// ==================================================

const executeBkashPayment = catchAsync(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const paymentID = req.params.paymentID;

    if (
      !paymentID ||
      Array.isArray(paymentID)
    ) {
      throw new Error("Invalid payment ID");
    }

    const result =
      await PaymentService.executeBkashPayment(
        paymentID
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment executed successfully",
      data: result,
    });
  }
);

// ==================================================
// bKash Callback
// ==================================================

const bkashCallback = catchAsync(
  async (
    req: Request,
    res: Response
  ) => {
    const paymentID =
      typeof req.query.paymentID === "string"
        ? req.query.paymentID
        : undefined;

    const status =
      typeof req.query.status === "string"
        ? req.query.status
        : undefined;

    if (!paymentID) {
      throw new Error("Payment ID missing");
    }

    if (!status) {
      throw new Error("Payment status missing");
    }

    const result =
      await PaymentService.bkashCallback({
        paymentID,
        status,
      });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: result.status === "success",
      message: result.message,
      data: result.payment,
    });
  }
);

// ==================================================
// Query bKash Payment Status
// ==================================================

const queryBkashPayment = catchAsync(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const paymentID = req.params.paymentID;

    if (
      !paymentID ||
      Array.isArray(paymentID)
    ) {
      throw new Error("Invalid payment ID");
    }

    const result =
      await PaymentService.queryBkashPayment(
        paymentID
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment status retrieved successfully",
      data: result,
    });
  }
);

// ==================================================
// Get My Payments
// ==================================================

const getMyPayments = catchAsync(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const recipientId = req.user?.id;

    if (!recipientId) {
      throw new Error("User not found");
    }

    const result =
      await PaymentService.getMyPayments(
        req.query,
        recipientId
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "My payments retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// ==================================================
// Get All Payments
// ==================================================

const getAllPayments = catchAsync(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const result =
      await PaymentService.getAllPayments(
        req.query
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "All payments retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  }
);

// ==================================================
// Get Single Payment
// ==================================================

const getSinglePayment = catchAsync(
  async (
    req: AuthenticatedRequest,
    res: Response
  ) => {
    const paymentId = req.params.id;

    if (
      !paymentId ||
      Array.isArray(paymentId)
    ) {
      throw new Error("Invalid payment ID");
    }

    if (!req.user) {
      throw new Error("User not found");
    }

    const result =
      await PaymentService.getSinglePayment(
        paymentId,
        req.user
      );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Payment retrieved successfully",
      data: result,
    });
  }
);

export const PaymentController = {
  initiatePayment,
  executeBkashPayment,
  bkashCallback,
  queryBkashPayment,
  getMyPayments,
  getAllPayments,
  getSinglePayment,
};