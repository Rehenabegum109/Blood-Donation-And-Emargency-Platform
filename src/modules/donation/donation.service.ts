
import { AuditAction, BloodRequestStatus, DonationStatus } from "../../generated/prisma/enums";

import { prisma } from "../../lib/prisma";
import { createAuditLog } from "../../utils/auditLog";

import { ICreateDonationPayload } from "./donation.interface";

const createDonation = async (
  donorUserId: string,
  payload: ICreateDonationPayload
) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId: donorUserId,
    },
  });

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: payload.bloodRequestId,
      deletedAt: null,
    },
  });

  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }

  if (bloodRequest.status !== "PENDING") {
    throw new Error(
      "Donation cannot be created for this blood request"
    );
  }

  if (bloodRequest.verificationStatus !== "VERIFIED") {
    throw new Error(
      "This blood request has not been verified by admin"
    );
  }

  if (!donor.isAvailable) {
    throw new Error("Donor is currently unavailable");
  }

  const existingDonation = await prisma.donation.findUnique({
    where: {
      donorId_bloodRequestId: {
        donorId: donor.id,
        bloodRequestId: payload.bloodRequestId,
      },
    },
  });

  if (existingDonation) {
    throw new Error(
      "You have already submitted a donation for this blood request"
    );
  }

  const donation = await prisma.donation.create({
    data: {
      donorId: donor.id,
      bloodRequestId: payload.bloodRequestId,
      units: payload.units ?? 1,
      notes: payload.notes ?? null,

   status: DonationStatus.PENDING,
    },
  });

  await createAuditLog({
    userId: donorUserId,
    action: AuditAction.CREATE,
    entity: "Donation",
    entityId: donation.id,
    details: {
      bloodRequestId: payload.bloodRequestId,
      units: donation.units,
      message: "Blood request accepted by donor",
    },
  });

  return donation;
};
// const getMyDonations = async (
//   donorUserId: string,
//   page: number = 1,
//   limit: number = 10
// ) => {
//   const donor = await prisma.donor.findUnique({
//     where: {
//       userId: donorUserId,
//     },
//   });

//   if (!donor) {
//     throw new Error("Donor profile not found");
//   }

//   const skip = (page - 1) * limit;

//   const [donations, total] = await prisma.$transaction([
//     prisma.donation.findMany({
//       where: {
//         donorId: donor.id,
//       },
//       skip,
//       take: limit,
//       orderBy: {
//         createdAt: "desc",
//       },
//       include: {
//         bloodRequest: {
//           select: {
//             id: true,
//             bloodGroup: true,
//             units: true,
//             hospitalName: true,
//             hospitalAddress: true,
//             requiredDate: true,
//             urgency: true,
//             status: true,
//             patientName: true,
//           },
//         },
//       },
//     }),

//     prisma.donation.count({
//       where: {
//         donorId: donor.id,
//       },
//     }),
//   ]);

//   return {
//     data: donations,
//     meta: {
//       page,
//       limit,
//       total,
//       totalPage: Math.ceil(total / limit),
//     },
//   };
// };
const getMyDonations = async (
  donorUserId: string,
  page: number = 1,
  limit: number = 10
) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId: donorUserId,
    },
  });

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  const skip = (page - 1) * limit;

  const [donations, total] = await Promise.all([
    prisma.donation.findMany({
      where: {
        donorId: donor.id,
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        bloodRequest: {
          select: {
            id: true,
            bloodGroup: true,
            units: true,
            hospitalName: true,
            hospitalAddress: true,
            requiredDate: true,
            urgency: true,
            status: true,
            verificationStatus: true,
            patientName: true,
          },
        },
      },
    }),

    prisma.donation.count({
      where: {
        donorId: donor.id,
      },
    }),
  ]);

  return {
    data: donations,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};
const getReceivedDonations = async (
  recipientId: string,
  page: number = 1,
  limit: number = 10
) => {
  const skip = (page - 1) * limit;

  const [donations, total] = await Promise.all([
    prisma.donation.findMany({
      where: {
        bloodRequest: {
          recipientId,
        },
      },

      skip,
      take: limit,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        bloodRequest: {
          select: {
            id: true,
            bloodGroup: true,
            units: true,
            hospitalName: true,
            hospitalAddress: true,
            requiredDate: true,
            urgency: true,
            status: true,
            verificationStatus: true,
            patientName: true,
          },
        },
      },
    }),

    prisma.donation.count({
      where: {
        bloodRequest: {
          recipientId,
        },
      },
    }),
  ]);

  return {
    data: donations,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};
const approveDonation = async (
  donationId: string,
  recipientId: string
) => {
  const updatedDonation = await prisma.$transaction(
    async (tx) => {
      // Lock the BloodRequest row first
      const donation = await tx.donation.findUnique({
        where: {
          id: donationId,
        },
        include: {
          bloodRequest: true,
        },
      });

      if (!donation) {
        throw new Error("Donation not found");
      }

      if (donation.bloodRequest.recipientId !== recipientId) {
        throw new Error(
          "You can only approve donations for your own blood request"
        );
      }

      if (donation.status !== DonationStatus.PENDING) {
        throw new Error("Only pending donations can be approved");
      }

      if (donation.bloodRequest.status !== "PENDING") {
        throw new Error("This blood request is no longer active");
      }

      // Lock BloodRequest row to prevent concurrent approval
      await tx.$queryRaw`
        SELECT id
        FROM "BloodRequest"
        WHERE id = ${donation.bloodRequestId}
        FOR UPDATE
      `;

      // Get accepted donations after lock
      const acceptedDonations = await tx.donation.aggregate({
        where: {
          bloodRequestId: donation.bloodRequestId,
          status: DonationStatus.ACCEPTED,
        },
        _sum: {
          units: true,
        },
      });

      const acceptedUnits = acceptedDonations._sum.units ?? 0;

      const totalUnits = acceptedUnits + donation.units;

      if (totalUnits > donation.bloodRequest.units) {
        throw new Error(
          `Only ${
            donation.bloodRequest.units - acceptedUnits
          } unit(s) are still required`
        );
      }

      // Approve donation
      const approvedDonation = await tx.donation.update({
        where: {
          id: donationId,
        },
        data: {
          status: DonationStatus.ACCEPTED,
          donationDate: new Date(),
        },
      });

      // Fulfill request when required units are reached
      if (totalUnits >= donation.bloodRequest.units) {
        await tx.bloodRequest.update({
          where: {
            id: donation.bloodRequestId,
          },
          data: {
            status: BloodRequestStatus.FULFILLED,
          },
        });
      }

      return approvedDonation;
    },
    {
      timeout: 10000,
      maxWait: 10000,
    }
  );

  // Audit log
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.APPROVE,
    entity: "Donation",
    entityId: donationId,
    details: {
      bloodRequestId: updatedDonation.bloodRequestId,
      units: updatedDonation.units,
      message: "Donation approved by recipient",
    },
  });

  return updatedDonation;
};

const rejectDonation = async (
  donationId: string,
  recipientId: string
) => {
  const updatedDonation = await prisma.$transaction(
    async (tx) => {
      const donation = await tx.donation.findUnique({
        where: {
          id: donationId,
        },
        include: {
          bloodRequest: true,
        },
      });

      if (!donation) {
        throw new Error("Donation not found");
      }

      // Check request ownership
      if (donation.bloodRequest.recipientId !== recipientId) {
        throw new Error(
          "You can only reject donations for your own blood request"
        );
      }

      // Check donation status
      if (donation.status !== DonationStatus.PENDING) {
        throw new Error(
          "Only pending donations can be rejected"
        );
      }

      // Check blood request status
      if (donation.bloodRequest.status !== "PENDING") {
        throw new Error(
          "This blood request is no longer active"
        );
      }

      const rejectedDonation = await tx.donation.update({
        where: {
          id: donationId,
        },
        data: {
          status: DonationStatus.REJECTED,
        },
      });

      return rejectedDonation;
    },
    {
      timeout: 10000,
      maxWait: 10000,
    }
  );

  // Audit log
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.REJECT,
    entity: "Donation",
    entityId: donationId,
    details: {
      message: "Donation rejected by recipient",
      bloodRequestId: updatedDonation.bloodRequestId,
      units: updatedDonation.units,
    },
  });

  return updatedDonation;
};

const cancelDonation = async (
  donationId: string,
  donorUserId: string
) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId: donorUserId,
    },
  });

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  const donation = await prisma.donation.findUnique({
    where: {
      id: donationId,
    },
    include: {
      bloodRequest: true,
    },
  });

  if (!donation) {
    throw new Error("Donation not found");
  }

  // Make sure this donation belongs to the logged-in donor
  if (donation.donorId !== donor.id) {
    throw new Error(
      "You can only cancel your own donation"
    );
  }

  // Only accepted donation can be cancelled
  if (donation.status !== DonationStatus.ACCEPTED) {
    throw new Error(
      "Only accepted donations can be cancelled"
    );
  }

  // If request is already fulfilled, cancellation is not allowed
  if (
    donation.bloodRequest.status ===
    BloodRequestStatus.FULFILLED
  ) {
    throw new Error(
      "You cannot cancel a donation after the blood request is fulfilled"
    );
  }

  const cancelledDonation =
    await prisma.donation.update({
      where: {
        id: donationId,
      },
      data: {
        status: DonationStatus.CANCELLED,
      },
    });

  await createAuditLog({
    userId: donorUserId,
    action: AuditAction.UPDATE,
    entity: "Donation",
    entityId: donationId,
    details: {
      bloodRequestId: donation.bloodRequestId,
      units: donation.units,
      message: "Donation cancelled by donor",
    },
  });

  return cancelledDonation;
};


export const DonationService = {
  createDonation,
  getMyDonations,
  getReceivedDonations,
  cancelDonation,
  approveDonation,

  rejectDonation,

};