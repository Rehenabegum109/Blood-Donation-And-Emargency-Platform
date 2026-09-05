import { prisma } from "../../lib/prisma";
import { AccountStatus, AuditAction } from "../../generated/prisma/enums";
import { createAuditLog } from "../../utils/auditLog";

const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
  searchTerm?: string,
  role?: string,
  status?: string
) => {
  const skip = (page - 1) * limit;

  const where: any = {
    deletedAt: null,
    ...(searchTerm && {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
      ],
    }),
    ...(role && { role }),
    ...(status && { status }),
  };

  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        phone: true,
        location: true,
        profileImage: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    }),

    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const blockUser = async (
  adminId: string,
  userId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.deletedAt) {
    throw new Error("Cannot block a deleted user");
  }

  if (user.role === "ADMIN") {
    throw new Error("Admin user cannot be blocked");
  }

  if (user.status === AccountStatus.BLOCKED) {
    throw new Error("User is already blocked");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: AccountStatus.BLOCKED,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  await createAuditLog({
    userId: adminId,
    action: AuditAction.BLOCK,
    entity: "User",
    entityId: userId,
    details: {
      message: "User blocked by admin",
    },
  });

  return updatedUser;
};

const unblockUser = async (
  adminId: string,
  userId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.deletedAt) {
    throw new Error("Cannot unblock a deleted user");
  }

  if (user.role === "ADMIN") {
    throw new Error("Admin user cannot be unblocked");
  }

  if (user.status !== AccountStatus.BLOCKED) {
    throw new Error("User is not blocked");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      status: AccountStatus.ACTIVE,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true,
    },
  });

  await createAuditLog({
    userId: adminId,
    action: AuditAction.UNBLOCK,
    entity: "User",
    entityId: userId,
    details: {
      message: "User unblocked by admin",
    },
  });

  return updatedUser;
};

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalDonors,
    totalRecipients,
    totalBloodRequests,
    pendingBloodRequests,
    fulfilledBloodRequests,
    totalDonations,
    acceptedDonations,
    rejectedDonations,
  ] = await prisma.$transaction([
    prisma.user.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.user.count({
      where: {
        role: "DONOR",
        deletedAt: null,
      },
    }),

    prisma.user.count({
      where: {
        role: "RECIPIENT",
        deletedAt: null,
      },
    }),

    prisma.bloodRequest.count({
      where: {
        deletedAt: null,
      },
    }),

    prisma.bloodRequest.count({
      where: {
        status: "PENDING",
        deletedAt: null,
      },
    }),

    prisma.bloodRequest.count({
      where: {
        status: "FULFILLED",
        deletedAt: null,
      },
    }),

    prisma.donation.count(),

    prisma.donation.count({
      where: {
        status: "ACCEPTED",
      },
    }),

    prisma.donation.count({
      where: {
        status: "REJECTED",
      },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      donors: totalDonors,
      recipients: totalRecipients,
    },

    bloodRequests: {
      total: totalBloodRequests,
      pending: pendingBloodRequests,
      fulfilled: fulfilledBloodRequests,
    },

    donations: {
      total: totalDonations,
      accepted: acceptedDonations,
      rejected: rejectedDonations,
    },
  };
};
const getAuditLogs = async (
  page = 1,
  limit = 10,
  action?: string,
  entity?: string,
  userId?: string
) => {
  const skip = (page - 1) * limit;

  const where: any = {
    ...(action && { action }),
    ...(entity && { entity }),
    ...(userId && { userId }),
  };

  const logs = await prisma.auditLog.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });

  const total = await prisma.auditLog.count({
    where,
  });

  return {
    data: logs,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

export const AdminService = {
  getAllUsers,
  blockUser,
  unblockUser,
  getDashboardStats,
  getAuditLogs,
};