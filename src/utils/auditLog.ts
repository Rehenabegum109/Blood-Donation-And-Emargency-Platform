import { AuditAction } from "../generated/prisma/enums";
import { Prisma } from "../generated/prisma/client";
import { prisma } from "../lib/prisma";

interface ICreateAuditLog {
  userId?: string;
  action: AuditAction;
  entity: string;
  entityId?: string;
  details?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
}

export const createAuditLog = async ({
  userId,
  action,
  entity,
  entityId,
  details,
  ipAddress,
  userAgent,
}: ICreateAuditLog) => {
  return prisma.auditLog.create({
    data: {
      action,
      entity,

      ...(entityId !== undefined && {
        entityId,
      }),

      ...(details !== undefined && {
        details,
      }),

      ...(ipAddress !== undefined && {
        ipAddress,
      }),

      ...(userAgent !== undefined && {
        userAgent,
      }),

      ...(userId !== undefined && {
        user: {
          connect: {
            id: userId,
          },
        },
      }),
    },
  });
};