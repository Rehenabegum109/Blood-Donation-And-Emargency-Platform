import { prisma } from "../../lib/prisma";


const getMyProfile = async (userId: string) => {
const user = await prisma.user.findFirst({
  where: {
    id: userId,
    deletedAt: null,
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

    donor: {
      select: {
        id: true,
        bloodGroup: true,
        dateOfBirth: true,
        address: true,
        lastDonationDate: true,
        isAvailable: true,
      },
    },
  },
});

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};
const updateMyProfile = async (
  userId: string,
  payload: {
    name?: string;
    phone?: string;
    location?: string;
    profileImage?: string;
  }
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
      deletedAt: null,
    },
    data: payload,
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
  });

  return updatedUser;
};

export const UserService = {
  getMyProfile,
  updateMyProfile,
};