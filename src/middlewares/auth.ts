import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";

import config from "../config";
import { Role } from "../generated/prisma/enums";

export interface AuthenticatedRequest extends Request {
  cookies: {
    accessToken?: string;
  };

  user?: {
    id: string;
    role: Role;
  };
}

export const auth = (...allowedRoles: Role[]) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token =
        req.cookies?.accessToken ||
        req.get("authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(httpStatus.UNAUTHORIZED).json({
          success: false,
          statusCode: httpStatus.UNAUTHORIZED,
          message: "You are not logged in",
          data: null,
        });
      }

      const decoded = jwt.verify(
        token,
        config.jwt_access_secret as string
      ) as {
        id: string;
        role: Role;
      };

      if (
        allowedRoles.length > 0 &&
        !allowedRoles.includes(decoded.role)
      ) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          statusCode: httpStatus.FORBIDDEN,
          message: "You do not have permission to access this resource",
          data: null,
        });
      }

      req.user = {
        id: decoded.id,
        role: decoded.role,
      };

      next();
    } catch (error) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        statusCode: httpStatus.UNAUTHORIZED,
        message: "Invalid or expired access token",
        data: null,
      });
    }
  };
};