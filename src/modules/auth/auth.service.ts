import bcrypt from "bcrypt";
import crypto from "crypto";

import { Role, AccountStatus, AuditAction } from "../../generated/prisma/enums";
import jwt from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { redisClient } from "../../utils/redis";
import { sendEmailVerificationEmail, sendForgotPasswordEmail, sendResetPasswordEmail, sendWelcomeEmail } from "../../utils/email";
import { IRegisterPayload } from "./auth.interface";
import { createAuditLog } from "../../utils/auditLog";


const register = async (payload: IRegisterPayload) => {
  const email = payload.email.trim().toLowerCase();

  // Check existing user
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("User already exists with this email");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(
    payload.password,
    10
  );

  // Create user
  const user = await prisma.user.create({
  data: {
    name: payload.name,
    email,
    password: hashedPassword,
    phone: payload.phone ?? null,
    location: payload.location ?? null,
    role: Role.RECIPIENT,
    status: AccountStatus.ACTIVE,
    emailVerified: false,
  },

  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    status: true,
    phone: true,
    location: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
  },
});

  // Generate OTP
  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  // Save OTP in Redis for 5 minutes
  await redisClient.set(
    `verify-email:${email}`,
    otp,
    {
      EX: 300,
    }
  );

  // Send verification email
  await sendEmailVerificationEmail(
    email,
    user.name,
    otp
  );

  return user;
};

const verifyEmail = async (email: string, otp: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.emailVerified) {
    throw new Error("Email is already verified");
  }

  const storedOtp = await redisClient.get(
    `verify-email:${normalizedEmail}`
  );

  if (!storedOtp) {
    throw new Error("OTP expired or not found");
  }

  if (storedOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  const updatedUser = await prisma.user.update({
    where: {
      email: normalizedEmail,
    },
    data: {
      emailVerified: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
    },
  });

  await redisClient.del(
    `verify-email:${normalizedEmail}`
  );

  await sendWelcomeEmail(
    updatedUser.email,
    updatedUser.name
  );

  return updatedUser;
};
const loginUser = async (payload: {
  email: string;
  password: string;
}) => {
  const email = payload.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // 2. Check account status
  if (user.status !== AccountStatus.ACTIVE) {
    throw new Error("Your account is not active");
  }

  // 3. Check email verification
  if (!user.emailVerified) {
    throw new Error("Please verify your email first");
  }

  // 4. Check password
  if (!user.password) {
    throw new Error("Please use your registered password");
  }

  const isPasswordMatched = await bcrypt.compare(
    payload.password,
    user.password
  );

  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  // 5. Create Access Token
  const accessToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.jwt_access_secret as string,
    {
      expiresIn: 60 * 60 * 24, // 1 day
    }
  );

  // 6. Create Refresh Token
  const refreshToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    config.jwt_refresh_secret as string,
    {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
    }
  );

  // 7. Save Refresh Token in database
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 1000 * 60 * 60 * 24 * 7
      ),
    },
  });

  // 8. Audit log
  await createAuditLog
  ({
    userId: user.id,
    action: AuditAction.LOGIN,
    entity: "User",
    entityId: user.id,
    details: {
      email: user.email,
      role: user.role,
      message: "User logged in successfully",
    },
  });

  // 9. Remove password from response
  const { password, ...userWithoutPassword } = user;

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};
const refreshAccessToken = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken,
    },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id,
      },
    });

    throw new Error("Refresh token expired");
  }

  const decoded = jwt.verify(
    refreshToken,
    config.jwt_refresh_secret as string
  ) as {
    id: string;
    role: Role;
  };

  const accessToken = jwt.sign(
    {
      id: decoded.id,
      role: decoded.role,
    },
    config.jwt_access_secret as string,
    {
      expiresIn: 60 * 60 * 24,
    }
  );

  return {
    accessToken,
  };
};
const forgotPassword = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  // Security: email exists কিনা প্রকাশ না করাই ভালো
  if (!user) {
    return {
      message: "If this email is registered, a password reset OTP has been sent",
    };
  }

  if (user.status !== AccountStatus.ACTIVE) {
    throw new Error("Your account is not active");
  }

  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  await redisClient.set(
    `reset-password:${normalizedEmail}`,
    otp,
    {
      EX: 300,
    }
  );

  await sendForgotPasswordEmail(
  normalizedEmail,
  user.name,
  otp
);

  return {
    message: "Password reset OTP sent successfully",
  };
};


const resetPassword = async (
  email: string,
  otp: string,
  newPassword: string
) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
  });

  if (!user) {
    throw new Error("Invalid email or OTP");
  }

  const storedOtp = await redisClient.get(
    `reset-password:${normalizedEmail}`
  );

  if (!storedOtp) {
    throw new Error("OTP expired or not found");
  }

  if (storedOtp !== otp) {
    throw new Error("Invalid OTP");
  }

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  await prisma.user.update({
    where: {
      email: normalizedEmail,
    },
    data: {
      password: hashedPassword,
    },
  });

  // OTP delete
  await redisClient.del(
    `reset-password:${normalizedEmail}`
  );

  // Invalidate old refresh tokens
  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id,
    },
  });

  // Send password reset success email
  await sendResetPasswordEmail(
    normalizedEmail,
    user.name
  );

  return {
    message: "Password reset successfully",
  };
};
export const AuthService = {
  register,
  verifyEmail,
  loginUser,
  refreshAccessToken,
  forgotPassword,
  resetPassword
};