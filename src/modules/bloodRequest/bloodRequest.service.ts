import { AuditAction, BloodRequestStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { createAuditLog } from "../../utils/auditLog";
import { ICreateBloodRequestPayload, IUpdateBloodRequestPayload } from "./bloodRequest.interface";

// const createBloodRequest = async (
//   recipientId: string,
//   payload: ICreateBloodRequestPayload
// ) => {
//   const user = await prisma.user.findUnique({
//     where: {
//       id: recipientId,
//     },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   if (user.role !== "RECIPIENT") {
//     throw new Error("Only recipients can create blood requests");
//   }

//   const bloodRequest = await prisma.bloodRequest.create({
//     data: {
//       recipientId,
//       bloodGroup: payload.bloodGroup,
//       units: payload.units ?? 1,
//       hospitalName: payload.hospitalName,
//       hospitalAddress: payload.hospitalAddress ?? null,
//       requiredDate: payload.requiredDate,
//       urgency: payload.urgency ?? "NORMAL",
//       status: BloodRequestStatus.PENDING,
//       contactNumber: payload.contactNumber ?? null,
//       patientName: payload.patientName ?? null,
//       notes: payload.notes ?? null,
//     },
//   });

//   return bloodRequest;
// };

const createBloodRequest = async (
  recipientId: string,
  payload: ICreateBloodRequestPayload
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: recipientId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.role !== "RECIPIENT") {
    throw new Error("Only recipients can create blood requests");
  }

  const bloodRequest = await prisma.bloodRequest.create({
    data: {
      recipientId,
      bloodGroup: payload.bloodGroup,
      units: payload.units ?? 1,
      hospitalName: payload.hospitalName,
      hospitalAddress: payload.hospitalAddress ?? null,
      requiredDate: payload.requiredDate,
      urgency: payload.urgency ?? "NORMAL",
      status: BloodRequestStatus.PENDING,
      contactNumber: payload.contactNumber ?? null,
      patientName: payload.patientName ?? null,
      notes: payload.notes ?? null,
    },
  });

  // Audit log
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.CREATE,
    entity: "BloodRequest",
    entityId: bloodRequest.id,
    details: {
      bloodGroup: bloodRequest.bloodGroup,
      units: bloodRequest.units,
      urgency: bloodRequest.urgency,
      message: "Blood request created by recipient",
    },
  });

  return bloodRequest;
};
const getAllBloodRequests = async (
  page: number,
  limit: number,
  status?: string,
  bloodGroup?: string,
  sortBy: string = "createdAt",
  sortOrder: string = "desc"
) => {
  const skip = (page - 1) * limit;

  const where = {
  deletedAt: null,
  ...(status ? { status: status as any } : {}),
  ...(bloodGroup ? { bloodGroup: bloodGroup as any } : {}),
};

  const [requests, total] = await Promise.all([
    prisma.bloodRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true,
          },
        },
      },
    }),

    prisma.bloodRequest.count({
      where,
    }),
  ]);

  return {
    data: requests,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


const getBloodRequestById = async (id: string) => {
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    include: {
      recipient: {
        select: {
          id: true,
          name: true,
          phone: true,
          location: true,
        },
      },
    },
  });

  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }

  return bloodRequest;
};

const updateBloodRequest = async (
  id: string,
  recipientId: string,
  payload: IUpdateBloodRequestPayload
) => {
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: {
      id,
    },
  });

  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }

  if (bloodRequest.recipientId !== recipientId) {
    throw new Error(
      "You can only update your own blood request"
    );
  }

  const updatedBloodRequest = await prisma.bloodRequest.update({
    where: {
      id,
    },
    data: {
      ...(payload.bloodGroup !== undefined && {
        bloodGroup: payload.bloodGroup,
      }),
      ...(payload.units !== undefined && {
        units: payload.units,
      }),
      ...(payload.hospitalName !== undefined && {
        hospitalName: payload.hospitalName,
      }),
      ...(payload.hospitalAddress !== undefined && {
        hospitalAddress: payload.hospitalAddress,
      }),
      ...(payload.requiredDate !== undefined && {
        requiredDate: payload.requiredDate,
      }),
      ...(payload.urgency !== undefined && {
        urgency: payload.urgency,
      }),
      ...(payload.contactNumber !== undefined && {
        contactNumber: payload.contactNumber,
      }),
      ...(payload.patientName !== undefined && {
        patientName: payload.patientName,
      }),
      ...(payload.notes !== undefined && {
        notes: payload.notes,
      }),
    },
  });

  // Audit log
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.UPDATE,
    entity: "BloodRequest",
    entityId: updatedBloodRequest.id,
    details: {
      message: "Blood request updated by recipient",
      updatedFields: Object.keys(payload),
    },
  });

  return updatedBloodRequest;
};
const deleteBloodRequest = async (
  id: string,
  recipientId: string
) => {
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: {
      id,
    },
  });

  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }

  if (bloodRequest.recipientId !== recipientId) {
    throw new Error(
      "You can only delete your own blood request"
    );
  }

  const deletedBloodRequest = await prisma.bloodRequest.update({
    where: {
      id,
    },
    data: {
      deletedAt: new Date(),
    },
  });

  // Audit log
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.DELETE,
    entity: "BloodRequest",
    entityId: deletedBloodRequest.id,
    details: {
      message: "Blood request deleted by recipient",
    },
  });

  return deletedBloodRequest;
};
const searchBloodRequests = async (
  searchTerm: string,
  page: number,
  limit: number
) => {
  const skip = (page - 1) * limit;

  const where = {
    deletedAt: null,
    OR: [
      {
        hospitalName: {
          contains: searchTerm,
          mode: "insensitive" as const,
        },
      },
      {
        hospitalAddress: {
          contains: searchTerm,
          mode: "insensitive" as const,
        },
      },
      {
        patientName: {
          contains: searchTerm,
          mode: "insensitive" as const,
        },
      },
      {
        notes: {
          contains: searchTerm,
          mode: "insensitive" as const,
        },
      },
    ],
  };

  const [requests, total] = await Promise.all([
    prisma.bloodRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true,
          },
        },
      },
    }),

    prisma.bloodRequest.count({
      where,
    }),
  ]);

  return {
    data: requests,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const verifyBloodRequest = async (
  bloodRequestId: string,
  adminId: string
) => {
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: bloodRequestId,
      deletedAt: null,
    },
  });

  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }

  if (bloodRequest.verificationStatus === "VERIFIED") {
    throw new Error("Blood request is already verified");
  }

  if (bloodRequest.verificationStatus === "REJECTED") {
    throw new Error("Rejected blood request cannot be verified");
  }

  const updatedBloodRequest = await prisma.bloodRequest.update({
    where: {
      id: bloodRequestId,
    },
    data: {
      verificationStatus: "VERIFIED",
      verifiedAt: new Date(),
      verifiedBy: adminId,
      rejectionReason: null,
    },
  });

  await createAuditLog({
    userId: adminId,
    action: AuditAction.APPROVE,
    entity: "BloodRequest",
    entityId: bloodRequestId,
    details: {
      verificationStatus: "VERIFIED",
      message: "Blood request verified by admin",
    },
  });

  return updatedBloodRequest;
};
const rejectBloodRequest = async (
  bloodRequestId: string,
  adminId: string,
  rejectionReason: string
) => {
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: bloodRequestId,
      deletedAt: null,
    },
  });

  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }

  if (bloodRequest.verificationStatus === "VERIFIED") {
    throw new Error("Verified blood request cannot be rejected");
  }

  if (bloodRequest.verificationStatus === "REJECTED") {
    throw new Error("Blood request is already rejected");
  }

  const updatedBloodRequest = await prisma.bloodRequest.update({
    where: {
      id: bloodRequestId,
    },
    data: {
      verificationStatus: "REJECTED",
      rejectionReason,
      verifiedAt: new Date(),
      verifiedBy: adminId,
    },
  });

  await createAuditLog({
    userId: adminId,
    action: AuditAction.REJECT,
    entity: "BloodRequest",
    entityId: bloodRequestId,
    details: {
      verificationStatus: "REJECTED",
      rejectionReason,
      message: "Blood request rejected by admin",
    },
  });

  return updatedBloodRequest;
};
export const BloodRequestService = {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
  searchBloodRequests,
  verifyBloodRequest,
  rejectBloodRequest
};
 
