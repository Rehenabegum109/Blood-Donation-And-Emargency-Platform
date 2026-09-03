import { DonationStatus } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { ICreateDonationPayload } from "./donation.interface";

const createDonation = async (
  donorUserId: string,
  payload: ICreateDonationPayload
) => {
  // Check donor profile
  const donor = await prisma.donor.findUnique({
    where: {
      userId: donorUserId,
    },
  });

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  // Check blood request
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: payload.bloodRequestId,
      deletedAt: null,
    },
  });

  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }

  // Check request status
  if (bloodRequest.status !== "PENDING") {
    throw new Error(
      "Donation cannot be created for this blood request"
    );
  }

  // Check donor availability
  if (!donor.isAvailable) {
    throw new Error("Donor is currently unavailable");
  }

  // Create donation
  const donation = await prisma.donation.create({
    data: {
      donorId: donor.id,
      bloodRequestId: payload.bloodRequestId,
      units: payload.units ?? 1,
      notes: payload.notes ?? null,
      status: DonationStatus.PENDING,
    },
  });

  return donation;
};
const getMyDonations = async (donorUserId: string) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId: donorUserId,
    },
  });

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  const donations = await prisma.donation.findMany({
    where: {
      donorId: donor.id,
    },
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
          patientName: true,
        },
      },
    },
  });

  return donations;
};
const approveDonation = async (
  donationId: string,
  recipientId: string
) => {
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

 
  if (donation.bloodRequest.recipientId !== recipientId) {
    throw new Error(
      "You can only approve donations for your own blood request"
    );
  }

  
  if (donation.status !== DonationStatus.PENDING) {
    throw new Error(
      "Only pending donations can be approved"
    );
  }

  const updatedDonation = await prisma.donation.update({
    where: {
      id: donationId,
    },
    data: {
      status: DonationStatus.ACCEPTED,
    },
  });

  return updatedDonation;
};

const rejectDonation = async (
  donationId: string,
  recipientId: string
) => {
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

  if (donation.bloodRequest.recipientId !== recipientId) {
    throw new Error(
      "You can only reject donations for your own blood request"
    );
  }

  if (donation.status !== DonationStatus.PENDING) {
    throw new Error(
      "Only pending donations can be rejected"
    );
  }

  const updatedDonation = await prisma.donation.update({
    where: {
      id: donationId,
    },
    data: {
      status: DonationStatus.REJECTED,
    },
  });

  return updatedDonation;
};
export const DonationService = {
  createDonation,
  getMyDonations,
  approveDonation,
  rejectDonation,
};