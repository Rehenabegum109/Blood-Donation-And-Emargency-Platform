import type { ErrorRequestHandler } from "express";
import httpStatus from "http-status";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  console.error(error);

  res.status(error.statusCode || httpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    statusCode:
      error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
    message: error.message || "Something went wrong",
    data: null,
  });
};