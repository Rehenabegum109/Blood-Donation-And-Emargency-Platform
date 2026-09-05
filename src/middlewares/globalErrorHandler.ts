import type { ErrorRequestHandler } from "express";
import httpStatus from "http-status";

export const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  console.error("Global Error:", error);

  const statusCode =
    error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;

  const message =
    statusCode === httpStatus.INTERNAL_SERVER_ERROR
      ? "Internal server error"
      : error.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: [],
    data: null,
  });
};