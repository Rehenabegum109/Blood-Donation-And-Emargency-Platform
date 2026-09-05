import { BloodGroup } from "../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

const compatibleBloodGroups: Record<string, string[]> = {
  O_NEGATIVE: ["O_NEGATIVE"],
  O_POSITIVE: ["O_NEGATIVE", "O_POSITIVE"],

  A_NEGATIVE: ["O_NEGATIVE", "A_NEGATIVE"],
  A_POSITIVE: [
    "O_NEGATIVE",
    "O_POSITIVE",
    "A_NEGATIVE",
    "A_POSITIVE",
  ],

  B_NEGATIVE: ["O_NEGATIVE", "B_NEGATIVE"],
  B_POSITIVE: [
    "O_NEGATIVE",
    "O_POSITIVE",
    "B_NEGATIVE",
    "B_POSITIVE",
  ],

  AB_NEGATIVE: [
    "O_NEGATIVE",
    "A_NEGATIVE",
    "B_NEGATIVE",
    "AB_NEGATIVE",
  ],

  AB_POSITIVE: [
    "O_NEGATIVE",
    "O_POSITIVE",
    "A_NEGATIVE",
    "A_POSITIVE",
    "B_NEGATIVE",
    "B_POSITIVE",
    "AB_NEGATIVE",
    "AB_POSITIVE",
  ],
};
const getMyDonorProfile = async (userId: string) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId,
    },
    select: {
      id: true,
      userId: true,
      bloodGroup: true,
      dateOfBirth: true,
      address: true,
      latitude: true,
      longitude: true,
      lastDonationDate: true,
      isAvailable: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          location: true,
          profileImage: true,
          emailVerified: true,
        },
      },
    },
  });

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  return donor;
};

const matchDonors = async (bloodRequestId: string) => {

  const bloodRequest =
    await prisma.bloodRequest.findFirst({
      where: {
        id: bloodRequestId,
        deletedAt: null,
      },
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
      },
    });

  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }

  // -----------------------------------------------
  // 2. Only verified & pending requests
  // -----------------------------------------------

  if (
    bloodRequest.verificationStatus !== "VERIFIED"
  ) {
    throw new Error(
      "Only verified blood requests can be matched with donors"
    );
  }

  if (bloodRequest.status !== "PENDING") {
    throw new Error(
      "Donors cannot be matched for this blood request"
    );
  }

  // -----------------------------------------------
  // 3. Get compatible donor blood groups
  // -----------------------------------------------

  const compatibleGroups =
    compatibleBloodGroups[bloodRequest.bloodGroup];

  if (!compatibleGroups) {
    throw new Error(
      "No compatible blood groups found"
    );
  }

  // -----------------------------------------------
  // 4. Find available donors
  // -----------------------------------------------

  const donors = await prisma.donor.findMany({
    where: {
      bloodGroup: {
        in: compatibleGroups as any,
      },
      isAvailable: true,
      user: {
        status: "ACTIVE",
        emailVerified: true,
        deletedAt: null,
      },
    },
    select: {
      id: true,
      bloodGroup: true,
      dateOfBirth: true,
      address: true,
      latitude: true,
      longitude: true,
      lastDonationDate: true,
      isAvailable: true,
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          location: true,
          profileImage: true,
        },
      },
    },
    orderBy: {
      lastDonationDate: "asc",
    },
  });



  return {
    bloodRequest,
    compatibleBloodGroups: compatibleGroups,
    totalMatchedDonors: donors.length,
    donors,
  };
};
const findNearbyDonors = async (
  bloodRequestId: string,
  radiusKm: number = 20
) => {
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: bloodRequestId,
      deletedAt: null,
    },
    select: {
      id: true,
      bloodGroup: true,
      units: true,
      hospitalName: true,
      hospitalLatitude: true,
      hospitalLongitude: true,
      urgency: true,
      status: true,
      verificationStatus: true,
    },
  });

  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }

  if (bloodRequest.verificationStatus !== "VERIFIED") {
    throw new Error(
      "Only verified blood requests can find nearby donors"
    );
  }

  if (bloodRequest.status !== "PENDING") {
    throw new Error(
      "Nearby donors cannot be found for this blood request"
    );
  }

  if (
    bloodRequest.hospitalLatitude === null ||
    bloodRequest.hospitalLongitude === null
  ) {
    throw new Error(
      "Hospital location coordinates are not available"
    );
  }

  const compatibleGroups =
    compatibleBloodGroups[bloodRequest.bloodGroup];

  const donors = await prisma.donor.findMany({
    where: {
      bloodGroup: {
        in: compatibleGroups as any,
      },
      isAvailable: true,
      latitude: {
        not: null,
      },
      longitude: {
        not: null,
      },
      user: {
        status: "ACTIVE",
        emailVerified: true,
        deletedAt: null,
      },
    },
    select: {
      id: true,
      bloodGroup: true,
      address: true,
      latitude: true,
      longitude: true,
      lastDonationDate: true,
      isAvailable: true,
      user: {
        select: {
          id: true,
          name: true,
          phone: true,
          location: true,
          profileImage: true,
        },
      },
    },
  });

  const nearbyDonors = donors
    .map((donor) => {
      const lat1 = bloodRequest.hospitalLatitude!;
      const lon1 = bloodRequest.hospitalLongitude!;
      const lat2 = donor.latitude!;
      const lon2 = donor.longitude!;

      const R = 6371;

      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;

      const distance =
        2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

      return {
        ...donor,
        distanceKm: Number(distance.toFixed(2)),
      };
    })
    .filter((donor) => donor.distanceKm <= radiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);

  return {
    bloodRequest,
    radiusKm,
    totalNearbyDonors: nearbyDonors.length,
    donors: nearbyDonors,
  };
};
const updateAvailability = async (
  userId: string,
  isAvailable: boolean
) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId,
    },
  });

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  const updatedDonor = await prisma.donor.update({
    where: {
      userId,
    },
    data: {
      isAvailable,
    },
    select: {
      id: true,
      userId: true,
      bloodGroup: true,
      isAvailable: true,
      updatedAt: true,
    },
  });

  return updatedDonor;
};

const updateDonorLocation = async (
  userId: string,
  latitude: number,
  longitude: number,
  address?: string
) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId,
    },
  });

  if (!donor) {
    throw new Error("Donor profile not found");
  }

  const updatedDonor = await prisma.donor.update({
    where: {
      userId,
    },
    data: {
      latitude,
      longitude,
      ...(address !== undefined && {
        address,
      }),
    },
    select: {
      id: true,
      userId: true,
      bloodGroup: true,
      address: true,
      latitude: true,
      longitude: true,
      isAvailable: true,
      updatedAt: true,
    },
  });

  return updatedDonor;
};

export const DonorService = {
  getMyDonorProfile,
  matchDonors,
  findNearbyDonors,
  updateAvailability,
  updateDonorLocation,
};