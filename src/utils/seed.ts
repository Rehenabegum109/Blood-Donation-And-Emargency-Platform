import bcrypt from "bcrypt";

import {
  Role,
  AccountStatus,
  BloodGroup,
} from "../generated/prisma/enums";
import { prisma } from "../lib/prisma";

export const seedAdmin = async () => {
  const email = "admin@bloodlink.com";

  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log("Admin already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  await prisma.user.create({
    data: {
      name: "BloodLink Admin",
      email,
      password: hashedPassword,
      role: Role.ADMIN,
      status: AccountStatus.ACTIVE,
      emailVerified: true,
    },
  });

  console.log("Admin created successfully");
};

export const seedDonor = async () => {
  const email = "donor@bloodlink.com";

  const existingDonor = await prisma.user.findUnique({
    where: { email },
  });

  if (existingDonor) {
    console.log("Donor already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("Donor@123", 10);

  await prisma.user.create({
    data: {
      name: "Test Donor",
      email,
      password: hashedPassword,
      role: Role.DONOR,
      status: AccountStatus.ACTIVE,
      emailVerified: true,
      phone: "01700000000",
      location: "Sylhet",

      donor: {
        create: {
          bloodGroup: BloodGroup.O_POSITIVE,
          address: "Sylhet, Bangladesh",
          isAvailable: true,
        },
      },
    },
  });

  console.log("Donor created successfully");
};



