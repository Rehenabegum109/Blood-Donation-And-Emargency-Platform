import type { Request, Response, NextFunction } from "express";
import type { ZodObject } from "zod";

export const validateRequest = (schema: ZodObject) => {
  return (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const message = result.error.issues
        .map((issue) => issue.message)
        .join(", ");

      return res.status(400).json({
        success: false,
        statusCode: 400,
        message,
        data: null,
      });
    }

    req.body = result.data;

    next();
  };
};