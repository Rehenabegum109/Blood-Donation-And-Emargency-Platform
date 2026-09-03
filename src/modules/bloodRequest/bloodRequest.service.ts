import { BloodRequestStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateBloodRequestPayload, IUpdateBloodRequestPayload } from "./bloodRequest.interface";

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
export const BloodRequestService = {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
  searchBloodRequests,
};
 
