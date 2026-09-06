"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/vercel.ts
var vercel_exports = {};
__export(vercel_exports, {
  default: () => vercel_default
});
module.exports = __toCommonJS(vercel_exports);

// src/app.ts
var import_cookie_parser = __toESM(require("cookie-parser"));
var import_cors = __toESM(require("cors"));
var import_express9 = __toESM(require("express"));
var import_helmet = __toESM(require("helmet"));

// src/middlewares/globalErrorHandler.ts
var import_http_status = __toESM(require("http-status"));
var globalErrorHandler = (error, req, res, next) => {
  console.error("Global Error:", error);
  const statusCode = error.statusCode || import_http_status.default.INTERNAL_SERVER_ERROR;
  const message = statusCode === import_http_status.default.INTERNAL_SERVER_ERROR ? "Internal server error" : error.message || "Something went wrong";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    errors: [],
    data: null
  });
};

// src/middlewares/notFound.ts
var import_http_status2 = __toESM(require("http-status"));
var notFound = (req, res) => {
  res.status(import_http_status2.default.NOT_FOUND).json({
    success: false,
    statusCode: import_http_status2.default.NOT_FOUND,
    message: `Route ${req.originalUrl} not found`,
    data: null
  });
};

// src/routes.ts
var import_express8 = require("express");

// src/modules/auth/auth.route.ts
var import_express = require("express");

// src/modules/auth/auth.controller.ts
var import_http_status3 = __toESM(require("http-status"));

// src/modules/auth/auth.service.ts
var import_bcrypt = __toESM(require("bcrypt"));
var import_crypto = __toESM(require("crypto"));
var import_google_auth_library = require("google-auth-library");

// src/generated/prisma/enums.ts
var Role = {
  ADMIN: "ADMIN",
  DONOR: "DONOR",
  RECIPIENT: "RECIPIENT"
};
var AccountStatus = {
  ACTIVE: "ACTIVE",
  BLOCKED: "BLOCKED",
  DELETED: "DELETED"
};
var BloodRequestStatus = {
  PENDING: "PENDING",
  FULFILLED: "FULFILLED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED"
};
var DonationStatus = {
  PENDING: "PENDING",
  ACCEPTED: "ACCEPTED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED"
};
var PaymentMethod = {
  BKASH: "BKASH"
};
var PaymentStatus = {
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
  REFUNDED: "REFUNDED"
};
var VerificationStatus = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
  REJECTED: "REJECTED"
};
var AuditAction = {
  CREATE: "CREATE",
  UPDATE: "UPDATE",
  DELETE: "DELETE",
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  PAYMENT: "PAYMENT",
  APPROVE: "APPROVE",
  REJECT: "REJECT",
  BLOCK: "BLOCK",
  UNBLOCK: "UNBLOCK"
};

// src/modules/auth/auth.service.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));

// src/config/index.ts
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
var config = {
  port: process.env.PORT || 5e3,
  node_env: process.env.NODE_ENV,
  database_url: process.env.DATABASE_URL,
  redis_user: process.env.REDIS_USER,
  redis_password: process.env.REDIS_PASSWORD,
  redis_host: process.env.REDIS_HOST,
  redis_port: process.env.REDIS_PORT,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  smtp_user: process.env.SMTP_USER,
  smtp_password: process.env.SMTP_PASSWORD,
  email_sender: process.env.SMTP_SENDER,
  bkash_username: process.env.BKASH_USERNAME,
  bkash_password: process.env.BKASH_PASSWORD,
  bkash_app_key: process.env.BKASH_APP_KEY,
  bkash_app_secret: process.env.BKASH_APP_SECRET,
  bkash_base_url: process.env.BKASH_BASE_URL,
  backend_url: process.env.BKASH_BACKEND_URI,
  bkash_agreement_id: process.env.BKASH_AGREEMENT_ID,
  bkash_callback_url: process.env.BKASH_CALLBACK_URL,
  google_client_id: process.env.GOOGLE_CLIENT_ID,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET,
  google_callback_url: process.env.GOOGLE_CALLBACK_URL,
  cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
  cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET
};
var config_default = config;

// src/lib/prisma.ts
var import_config = require("dotenv/config");
var import_adapter_pg = require("@prisma/adapter-pg");

// src/generated/prisma/internal/class.ts
var runtime = __toESM(require("@prisma/client/runtime/client"));
var config2 = {
  "previewFeatures": [],
  "clientVersion": "7.10.0",
  "engineVersion": "0edf323efd1d98336f3f0a68684b56f689b900d3",
  "activeProvider": "postgresql",
  "inlineSchema": 'model AuditLog {\n  id        String      @id @default(uuid())\n  userId    String?\n  action    AuditAction\n  entity    String\n  entityId  String?\n  details   Json?\n  ipAddress String?\n  userAgent String?\n  createdAt DateTime    @default(now())\n\n  user User? @relation(fields: [userId], references: [id])\n\n  @@index([userId])\n  @@index([entity, entityId])\n  @@index([action])\n  @@index([createdAt])\n}\n\nmodel BloodRequest {\n  id          String @id @default(uuid())\n  recipientId String\n\n  bloodGroup BloodGroup\n  units      Int        @default(1)\n\n  hospitalName      String\n  hospitalAddress   String?\n  hospitalLatitude  Float?\n  hospitalLongitude Float?\n\n  patientName   String?\n  contactNumber String?\n  requiredDate  DateTime\n\n  urgency UrgencyLevel       @default(NORMAL)\n  status  BloodRequestStatus @default(PENDING)\n\n  verificationStatus VerificationStatus @default(PENDING)\n  verifiedAt         DateTime?\n  verifiedBy         String?\n  rejectionReason    String?\n\n  notes String?\n\n  createdAt DateTime  @default(now())\n  updatedAt DateTime  @updatedAt\n  deletedAt DateTime?\n\n  recipient User       @relation(fields: [recipientId], references: [id])\n  donations Donation[]\n  payment   Payment?\n\n  @@index([recipientId])\n  @@index([bloodGroup])\n  @@index([status])\n  @@index([urgency])\n  @@index([requiredDate])\n  @@index([bloodGroup, status, urgency])\n  @@index([verificationStatus])\n}\n\nmodel Donation {\n  id             String @id @default(uuid())\n  donorId        String\n  bloodRequestId String\n\n  status       DonationStatus @default(PENDING)\n  donationDate DateTime?\n  units        Int            @default(1)\n  notes        String?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  bloodRequest BloodRequest @relation(fields: [bloodRequestId], references: [id])\n  donor        Donor        @relation(fields: [donorId], references: [id])\n\n  @@unique([donorId, bloodRequestId])\n  @@index([bloodRequestId, status])\n  @@index([donorId, status])\n}\n\nmodel Donor {\n  id               String     @id @default(uuid())\n  userId           String     @unique\n  bloodGroup       BloodGroup\n  dateOfBirth      DateTime?\n  address          String?\n  latitude         Float?\n  longitude        Float?\n  lastDonationDate DateTime?\n  isAvailable      Boolean    @default(true)\n  createdAt        DateTime   @default(now())\n  updatedAt        DateTime   @updatedAt\n\n  donations Donation[]\n  user      User       @relation(fields: [userId], references: [id])\n\n  @@index([bloodGroup])\n  @@index([isAvailable])\n  @@index([bloodGroup, isAvailable])\n}\n\nenum Role {\n  ADMIN\n  DONOR\n  RECIPIENT\n}\n\nenum AccountStatus {\n  ACTIVE\n  BLOCKED\n  DELETED\n}\n\nenum BloodGroup {\n  A_POSITIVE\n  A_NEGATIVE\n  B_POSITIVE\n  B_NEGATIVE\n  AB_POSITIVE\n  AB_NEGATIVE\n  O_POSITIVE\n  O_NEGATIVE\n}\n\nenum UrgencyLevel {\n  LOW\n  NORMAL\n  HIGH\n  CRITICAL\n}\n\nenum BloodRequestStatus {\n  PENDING\n  FULFILLED\n  CANCELLED\n  EXPIRED\n}\n\nenum DonationStatus {\n  PENDING\n  ACCEPTED\n  REJECTED\n  COMPLETED\n  CANCELLED\n}\n\nenum PaymentMethod {\n  BKASH\n}\n\nenum PaymentStatus {\n  PENDING\n  PAID\n  FAILED\n  CANCELLED\n  REFUNDED\n}\n\nenum VerificationStatus {\n  PENDING\n  VERIFIED\n  REJECTED\n}\n\nenum AuditAction {\n  CREATE\n  UPDATE\n  DELETE\n  LOGIN\n  LOGOUT\n  PAYMENT\n  APPROVE\n  REJECT\n  BLOCK\n  UNBLOCK\n}\n\nmodel Payment {\n  id String @id @default(uuid())\n\n  bloodRequestId String @unique\n\n  amount   Decimal       @db.Decimal(10, 2)\n  currency String        @default("BDT")\n  method   PaymentMethod @default(BKASH)\n  status   PaymentStatus @default(PENDING)\n\n  bkashPaymentId String? @unique\n  transactionId  String? @unique\n\n  gatewayResponse Json?\n  receiptPdfUrl   String?\n  paidAt          DateTime?\n\n  createdAt DateTime @default(now())\n  updatedAt DateTime @updatedAt\n\n  bloodRequest BloodRequest @relation(fields: [bloodRequestId], references: [id])\n}\n\nmodel RefreshToken {\n  id        String   @id @default(uuid())\n  userId    String\n  token     String   @unique\n  expiresAt DateTime\n  createdAt DateTime @default(now())\n\n  user User @relation(fields: [userId], references: [id], onDelete: Cascade)\n\n  @@index([userId])\n  @@index([expiresAt])\n}\n\ngenerator client {\n  provider = "prisma-client"\n  output   = "../src/generated/prisma"\n}\n\ndatasource db {\n  provider = "postgresql"\n}\n\nmodel User {\n  id            String        @id @default(uuid())\n  name          String\n  email         String        @unique\n  password      String?\n  googleId      String?       @unique\n  role          Role          @default(RECIPIENT)\n  status        AccountStatus @default(ACTIVE)\n  phone         String?\n  location      String?\n  profileImage  String?\n  emailVerified Boolean       @default(false)\n  deletedAt     DateTime?\n  createdAt     DateTime      @default(now())\n  updatedAt     DateTime      @updatedAt\n\n  auditLogs     AuditLog[]\n  bloodRequests BloodRequest[]\n  donor         Donor?\n  refreshTokens RefreshToken[]\n\n  @@index([role])\n  @@index([status])\n  @@index([deletedAt])\n}\n',
  "runtimeDataModel": {
    "models": {},
    "enums": {},
    "types": {}
  },
  "parameterizationSchema": {
    "strings": [],
    "graph": ""
  }
};
config2.runtimeDataModel = JSON.parse('{"models":{"AuditLog":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"action","kind":"enum","type":"AuditAction"},{"name":"entity","kind":"scalar","type":"String"},{"name":"entityId","kind":"scalar","type":"String"},{"name":"details","kind":"scalar","type":"Json"},{"name":"ipAddress","kind":"scalar","type":"String"},{"name":"userAgent","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"AuditLogToUser"}],"dbName":null,"schema":null},"BloodRequest":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"recipientId","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"enum","type":"BloodGroup"},{"name":"units","kind":"scalar","type":"Int"},{"name":"hospitalName","kind":"scalar","type":"String"},{"name":"hospitalAddress","kind":"scalar","type":"String"},{"name":"hospitalLatitude","kind":"scalar","type":"Float"},{"name":"hospitalLongitude","kind":"scalar","type":"Float"},{"name":"patientName","kind":"scalar","type":"String"},{"name":"contactNumber","kind":"scalar","type":"String"},{"name":"requiredDate","kind":"scalar","type":"DateTime"},{"name":"urgency","kind":"enum","type":"UrgencyLevel"},{"name":"status","kind":"enum","type":"BloodRequestStatus"},{"name":"verificationStatus","kind":"enum","type":"VerificationStatus"},{"name":"verifiedAt","kind":"scalar","type":"DateTime"},{"name":"verifiedBy","kind":"scalar","type":"String"},{"name":"rejectionReason","kind":"scalar","type":"String"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"recipient","kind":"object","type":"User","relationName":"BloodRequestToUser"},{"name":"donations","kind":"object","type":"Donation","relationName":"BloodRequestToDonation"},{"name":"payment","kind":"object","type":"Payment","relationName":"BloodRequestToPayment"}],"dbName":null,"schema":null},"Donation":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"donorId","kind":"scalar","type":"String"},{"name":"bloodRequestId","kind":"scalar","type":"String"},{"name":"status","kind":"enum","type":"DonationStatus"},{"name":"donationDate","kind":"scalar","type":"DateTime"},{"name":"units","kind":"scalar","type":"Int"},{"name":"notes","kind":"scalar","type":"String"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bloodRequest","kind":"object","type":"BloodRequest","relationName":"BloodRequestToDonation"},{"name":"donor","kind":"object","type":"Donor","relationName":"DonationToDonor"}],"dbName":null,"schema":null},"Donor":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"bloodGroup","kind":"enum","type":"BloodGroup"},{"name":"dateOfBirth","kind":"scalar","type":"DateTime"},{"name":"address","kind":"scalar","type":"String"},{"name":"latitude","kind":"scalar","type":"Float"},{"name":"longitude","kind":"scalar","type":"Float"},{"name":"lastDonationDate","kind":"scalar","type":"DateTime"},{"name":"isAvailable","kind":"scalar","type":"Boolean"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"donations","kind":"object","type":"Donation","relationName":"DonationToDonor"},{"name":"user","kind":"object","type":"User","relationName":"DonorToUser"}],"dbName":null,"schema":null},"Payment":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"bloodRequestId","kind":"scalar","type":"String"},{"name":"amount","kind":"scalar","type":"Decimal"},{"name":"currency","kind":"scalar","type":"String"},{"name":"method","kind":"enum","type":"PaymentMethod"},{"name":"status","kind":"enum","type":"PaymentStatus"},{"name":"bkashPaymentId","kind":"scalar","type":"String"},{"name":"transactionId","kind":"scalar","type":"String"},{"name":"gatewayResponse","kind":"scalar","type":"Json"},{"name":"receiptPdfUrl","kind":"scalar","type":"String"},{"name":"paidAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"bloodRequest","kind":"object","type":"BloodRequest","relationName":"BloodRequestToPayment"}],"dbName":null,"schema":null},"RefreshToken":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"userId","kind":"scalar","type":"String"},{"name":"token","kind":"scalar","type":"String"},{"name":"expiresAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"user","kind":"object","type":"User","relationName":"RefreshTokenToUser"}],"dbName":null,"schema":null},"User":{"fields":[{"name":"id","kind":"scalar","type":"String"},{"name":"name","kind":"scalar","type":"String"},{"name":"email","kind":"scalar","type":"String"},{"name":"password","kind":"scalar","type":"String"},{"name":"googleId","kind":"scalar","type":"String"},{"name":"role","kind":"enum","type":"Role"},{"name":"status","kind":"enum","type":"AccountStatus"},{"name":"phone","kind":"scalar","type":"String"},{"name":"location","kind":"scalar","type":"String"},{"name":"profileImage","kind":"scalar","type":"String"},{"name":"emailVerified","kind":"scalar","type":"Boolean"},{"name":"deletedAt","kind":"scalar","type":"DateTime"},{"name":"createdAt","kind":"scalar","type":"DateTime"},{"name":"updatedAt","kind":"scalar","type":"DateTime"},{"name":"auditLogs","kind":"object","type":"AuditLog","relationName":"AuditLogToUser"},{"name":"bloodRequests","kind":"object","type":"BloodRequest","relationName":"BloodRequestToUser"},{"name":"donor","kind":"object","type":"Donor","relationName":"DonorToUser"},{"name":"refreshTokens","kind":"object","type":"RefreshToken","relationName":"RefreshTokenToUser"}],"dbName":null,"schema":null}},"enums":{},"types":{}}');
config2.parameterizationSchema = {
  strings: JSON.parse('["where","orderBy","cursor","auditLogs","recipient","bloodRequest","donations","user","_count","donor","payment","bloodRequests","refreshTokens","AuditLog.findUnique","AuditLog.findUniqueOrThrow","AuditLog.findFirst","AuditLog.findFirstOrThrow","AuditLog.findMany","data","AuditLog.createOne","AuditLog.createMany","AuditLog.createManyAndReturn","AuditLog.updateOne","AuditLog.updateMany","AuditLog.updateManyAndReturn","create","update","AuditLog.upsertOne","AuditLog.deleteOne","AuditLog.deleteMany","having","_min","_max","AuditLog.groupBy","AuditLog.aggregate","BloodRequest.findUnique","BloodRequest.findUniqueOrThrow","BloodRequest.findFirst","BloodRequest.findFirstOrThrow","BloodRequest.findMany","BloodRequest.createOne","BloodRequest.createMany","BloodRequest.createManyAndReturn","BloodRequest.updateOne","BloodRequest.updateMany","BloodRequest.updateManyAndReturn","BloodRequest.upsertOne","BloodRequest.deleteOne","BloodRequest.deleteMany","_avg","_sum","BloodRequest.groupBy","BloodRequest.aggregate","Donation.findUnique","Donation.findUniqueOrThrow","Donation.findFirst","Donation.findFirstOrThrow","Donation.findMany","Donation.createOne","Donation.createMany","Donation.createManyAndReturn","Donation.updateOne","Donation.updateMany","Donation.updateManyAndReturn","Donation.upsertOne","Donation.deleteOne","Donation.deleteMany","Donation.groupBy","Donation.aggregate","Donor.findUnique","Donor.findUniqueOrThrow","Donor.findFirst","Donor.findFirstOrThrow","Donor.findMany","Donor.createOne","Donor.createMany","Donor.createManyAndReturn","Donor.updateOne","Donor.updateMany","Donor.updateManyAndReturn","Donor.upsertOne","Donor.deleteOne","Donor.deleteMany","Donor.groupBy","Donor.aggregate","Payment.findUnique","Payment.findUniqueOrThrow","Payment.findFirst","Payment.findFirstOrThrow","Payment.findMany","Payment.createOne","Payment.createMany","Payment.createManyAndReturn","Payment.updateOne","Payment.updateMany","Payment.updateManyAndReturn","Payment.upsertOne","Payment.deleteOne","Payment.deleteMany","Payment.groupBy","Payment.aggregate","RefreshToken.findUnique","RefreshToken.findUniqueOrThrow","RefreshToken.findFirst","RefreshToken.findFirstOrThrow","RefreshToken.findMany","RefreshToken.createOne","RefreshToken.createMany","RefreshToken.createManyAndReturn","RefreshToken.updateOne","RefreshToken.updateMany","RefreshToken.updateManyAndReturn","RefreshToken.upsertOne","RefreshToken.deleteOne","RefreshToken.deleteMany","RefreshToken.groupBy","RefreshToken.aggregate","User.findUnique","User.findUniqueOrThrow","User.findFirst","User.findFirstOrThrow","User.findMany","User.createOne","User.createMany","User.createManyAndReturn","User.updateOne","User.updateMany","User.updateManyAndReturn","User.upsertOne","User.deleteOne","User.deleteMany","User.groupBy","User.aggregate","AND","OR","NOT","id","name","email","password","googleId","Role","role","AccountStatus","status","phone","location","profileImage","emailVerified","deletedAt","createdAt","updatedAt","equals","in","notIn","lt","lte","gt","gte","not","contains","startsWith","endsWith","every","some","none","userId","token","expiresAt","bloodRequestId","amount","currency","PaymentMethod","method","PaymentStatus","bkashPaymentId","transactionId","gatewayResponse","receiptPdfUrl","paidAt","string_contains","string_starts_with","string_ends_with","array_starts_with","array_ends_with","array_contains","BloodGroup","bloodGroup","dateOfBirth","address","latitude","longitude","lastDonationDate","isAvailable","donorId","DonationStatus","donationDate","units","notes","recipientId","hospitalName","hospitalAddress","hospitalLatitude","hospitalLongitude","patientName","contactNumber","requiredDate","UrgencyLevel","urgency","BloodRequestStatus","VerificationStatus","verificationStatus","verifiedAt","verifiedBy","rejectionReason","AuditAction","action","entity","entityId","details","ipAddress","userAgent","donorId_bloodRequestId","is","isNot","connectOrCreate","upsert","createMany","set","disconnect","delete","connect","updateMany","deleteMany","increment","decrement","multiply","divide"]'),
  graph: "4wNEcA0HAACkAgAghQEAAKICADCGAQAABQAQhwEAAKICADCIAQEAAAABlgFAAN4BACGmAQEA2QEAIdgBAACjAtgBItkBAQDYAQAh2gEBANkBACHbAQAA9AEAINwBAQDZAQAh3QEBANkBACEBAAAAAQAgFQMAAN8BACAJAADhAQAgCwAA4AEAIAwAAOIBACCFAQAA1wEAMIYBAAADABCHAQAA1wEAMIgBAQDYAQAhiQEBANgBACGKAQEA2AEAIYsBAQDZAQAhjAEBANkBACGOAQAA2gGOASKQAQAA2wGQASKRAQEA2QEAIZIBAQDZAQAhkwEBANkBACGUASAA3AEAIZUBQADdAQAhlgFAAN4BACGXAUAA3gEAIQEAAAADACANBwAApAIAIIUBAACiAgAwhgEAAAUAEIcBAACiAgAwiAEBANgBACGWAUAA3gEAIaYBAQDZAQAh2AEAAKMC2AEi2QEBANgBACHaAQEA2QEAIdsBAAD0AQAg3AEBANkBACHdAQEA2QEAIQYHAACpAwAgpgEAAKUCACDaAQAApQIAINsBAAClAgAg3AEAAKUCACDdAQAApQIAIAMAAAAFACABAAAGADACAAABACAbBAAAgQIAIAYAAIACACAKAAChAgAghQEAAJ0CADCGAQAACAAQhwEAAJ0CADCIAQEA2AEAIZABAACfAtIBIpUBQADdAQAhlgFAAN4BACGXAUAA3gEAIbsBAAD-AbsBIsUBAgCbAgAhxgEBANkBACHHAQEA2AEAIcgBAQDYAQAhyQEBANkBACHKAQgA_wEAIcsBCAD_AQAhzAEBANkBACHNAQEA2QEAIc4BQADeAQAh0AEAAJ4C0AEi0wEAAKAC0wEi1AFAAN0BACHVAQEA2QEAIdYBAQDZAQAhDQQAAKkDACAGAACoAwAgCgAAuwMAIJUBAAClAgAgxgEAAKUCACDJAQAApQIAIMoBAAClAgAgywEAAKUCACDMAQAApQIAIM0BAAClAgAg1AEAAKUCACDVAQAApQIAINYBAAClAgAgGwQAAIECACAGAACAAgAgCgAAoQIAIIUBAACdAgAwhgEAAAgAEIcBAACdAgAwiAEBAAAAAZABAACfAtIBIpUBQADdAQAhlgFAAN4BACGXAUAA3gEAIbsBAAD-AbsBIsUBAgCbAgAhxgEBANkBACHHAQEA2AEAIcgBAQDYAQAhyQEBANkBACHKAQgA_wEAIcsBCAD_AQAhzAEBANkBACHNAQEA2QEAIc4BQADeAQAh0AEAAJ4C0AEi0wEAAKAC0wEi1AFAAN0BACHVAQEA2QEAIdYBAQDZAQAhAwAAAAgAIAEAAAkAMAIAAAoAIA4FAAD1AQAgCQAAnAIAIIUBAACZAgAwhgEAAAwAEIcBAACZAgAwiAEBANgBACGQAQAAmgLEASKWAUAA3gEAIZcBQADeAQAhqQEBANgBACHCAQEA2AEAIcQBQADdAQAhxQECAJsCACHGAQEA2QEAIQQFAACgAwAgCQAAkgMAIMQBAAClAgAgxgEAAKUCACAPBQAA9QEAIAkAAJwCACCFAQAAmQIAMIYBAAAMABCHAQAAmQIAMIgBAQAAAAGQAQAAmgLEASKWAUAA3gEAIZcBQADeAQAhqQEBANgBACHCAQEA2AEAIcQBQADdAQAhxQECAJsCACHGAQEA2QEAId4BAACYAgAgAwAAAAwAIAEAAA0AMAIAAA4AIAMAAAAMACABAAANADACAAAOACABAAAADAAgEQUAAPUBACCFAQAA8AEAMIYBAAASABCHAQAA8AEAMIgBAQDYAQAhkAEAAPMBrwEilgFAAN4BACGXAUAA3gEAIakBAQDYAQAhqgEQAPEBACGrAQEA2AEAIa0BAADyAa0BIq8BAQDZAQAhsAEBANkBACGxAQAA9AEAILIBAQDZAQAhswFAAN0BACEBAAAAEgAgAQAAAAwAIBAGAACAAgAgBwAAgQIAIIUBAAD9AQAwhgEAABUAEIcBAAD9AQAwiAEBANgBACGWAUAA3gEAIZcBQADeAQAhpgEBANgBACG7AQAA_gG7ASK8AUAA3QEAIb0BAQDZAQAhvgEIAP8BACG_AQgA_wEAIcABQADdAQAhwQEgANwBACEBAAAAFQAgCQcAAIECACCFAQAAlwIAMIYBAAAXABCHAQAAlwIAMIgBAQDYAQAhlgFAAN4BACGmAQEA2AEAIacBAQDYAQAhqAFAAN4BACEBBwAAqQMAIAkHAACBAgAghQEAAJcCADCGAQAAFwAQhwEAAJcCADCIAQEAAAABlgFAAN4BACGmAQEA2AEAIacBAQAAAAGoAUAA3gEAIQMAAAAXACABAAAYADACAAAZACABAAAABQAgAQAAAAgAIAEAAAAXACABAAAAAQAgAwAAAAUAIAEAAAYAMAIAAAEAIAMAAAAFACABAAAGADACAAABACADAAAABQAgAQAABgAwAgAAAQAgCgcAALoDACCIAQEAAAABlgFAAAAAAaYBAQAAAAHYAQAAANgBAtkBAQAAAAHaAQEAAAAB2wGAAAAAAdwBAQAAAAHdAQEAAAABARIAACIAIAmIAQEAAAABlgFAAAAAAaYBAQAAAAHYAQAAANgBAtkBAQAAAAHaAQEAAAAB2wGAAAAAAdwBAQAAAAHdAQEAAAABARIAACQAMAESAAAkADABAAAAAwAgCgcAALkDACCIAQEAqQIAIZYBQACvAgAhpgEBAKoCACHYAQAAiQPYASLZAQEAqQIAIdoBAQCqAgAh2wGAAAAAAdwBAQCqAgAh3QEBAKoCACECAAAAAQAgEgAAKAAgCYgBAQCpAgAhlgFAAK8CACGmAQEAqgIAIdgBAACJA9gBItkBAQCpAgAh2gEBAKoCACHbAYAAAAAB3AEBAKoCACHdAQEAqgIAIQIAAAAFACASAAAqACACAAAABQAgEgAAKgAgAQAAAAMAIAMAAAABACAZAAAiACAaAAAoACABAAAAAQAgAQAAAAUAIAgIAAC2AwAgHwAAuAMAICAAALcDACCmAQAApQIAINoBAAClAgAg2wEAAKUCACDcAQAApQIAIN0BAAClAgAgDIUBAACTAgAwhgEAADIAEIcBAACTAgAwiAEBAMABACGWAUAAxgEAIaYBAQDBAQAh2AEAAJQC2AEi2QEBAMABACHaAQEAwQEAIdsBAADoAQAg3AEBAMEBACHdAQEAwQEAIQMAAAAFACABAAAxADAeAAAyACADAAAABQAgAQAABgAwAgAAAQAgAQAAAAoAIAEAAAAKACADAAAACAAgAQAACQAwAgAACgAgAwAAAAgAIAEAAAkAMAIAAAoAIAMAAAAIACABAAAJADACAAAKACAYBAAAtQMAIAYAAP0CACAKAAD-AgAgiAEBAAAAAZABAAAA0gEClQFAAAAAAZYBQAAAAAGXAUAAAAABuwEAAAC7AQLFAQIAAAABxgEBAAAAAccBAQAAAAHIAQEAAAAByQEBAAAAAcoBCAAAAAHLAQgAAAABzAEBAAAAAc0BAQAAAAHOAUAAAAAB0AEAAADQAQLTAQAAANMBAtQBQAAAAAHVAQEAAAAB1gEBAAAAAQESAAA6ACAViAEBAAAAAZABAAAA0gEClQFAAAAAAZYBQAAAAAGXAUAAAAABuwEAAAC7AQLFAQIAAAABxgEBAAAAAccBAQAAAAHIAQEAAAAByQEBAAAAAcoBCAAAAAHLAQgAAAABzAEBAAAAAc0BAQAAAAHOAUAAAAAB0AEAAADQAQLTAQAAANMBAtQBQAAAAAHVAQEAAAAB1gEBAAAAAQESAAA8ADABEgAAPAAwGAQAALQDACAGAADnAgAgCgAA6AIAIIgBAQCpAgAhkAEAAOQC0gEilQFAAK4CACGWAUAArwIAIZcBQACvAgAhuwEAAMUCuwEixQECANMCACHGAQEAqgIAIccBAQCpAgAhyAEBAKkCACHJAQEAqgIAIcoBCADGAgAhywEIAMYCACHMAQEAqgIAIc0BAQCqAgAhzgFAAK8CACHQAQAA4wLQASLTAQAA5QLTASLUAUAArgIAIdUBAQCqAgAh1gEBAKoCACECAAAACgAgEgAAPwAgFYgBAQCpAgAhkAEAAOQC0gEilQFAAK4CACGWAUAArwIAIZcBQACvAgAhuwEAAMUCuwEixQECANMCACHGAQEAqgIAIccBAQCpAgAhyAEBAKkCACHJAQEAqgIAIcoBCADGAgAhywEIAMYCACHMAQEAqgIAIc0BAQCqAgAhzgFAAK8CACHQAQAA4wLQASLTAQAA5QLTASLUAUAArgIAIdUBAQCqAgAh1gEBAKoCACECAAAACAAgEgAAQQAgAgAAAAgAIBIAAEEAIAMAAAAKACAZAAA6ACAaAAA_ACABAAAACgAgAQAAAAgAIA8IAACvAwAgHwAAsgMAICAAALEDACAxAACwAwAgMgAAswMAIJUBAAClAgAgxgEAAKUCACDJAQAApQIAIMoBAAClAgAgywEAAKUCACDMAQAApQIAIM0BAAClAgAg1AEAAKUCACDVAQAApQIAINYBAAClAgAgGIUBAACJAgAwhgEAAEgAEIcBAACJAgAwiAEBAMABACGQAQAAiwLSASKVAUAAxQEAIZYBQADGAQAhlwFAAMYBACG7AQAA9wG7ASLFAQIAhAIAIcYBAQDBAQAhxwEBAMABACHIAQEAwAEAIckBAQDBAQAhygEIAPgBACHLAQgA-AEAIcwBAQDBAQAhzQEBAMEBACHOAUAAxgEAIdABAACKAtABItMBAACMAtMBItQBQADFAQAh1QEBAMEBACHWAQEAwQEAIQMAAAAIACABAABHADAeAABIACADAAAACAAgAQAACQAwAgAACgAgAQAAAA4AIAEAAAAOACADAAAADAAgAQAADQAwAgAADgAgAwAAAAwAIAEAAA0AMAIAAA4AIAMAAAAMACABAAANADACAAAOACALBQAA1wIAIAkAAPsCACCIAQEAAAABkAEAAADEAQKWAUAAAAABlwFAAAAAAakBAQAAAAHCAQEAAAABxAFAAAAAAcUBAgAAAAHGAQEAAAABARIAAFAAIAmIAQEAAAABkAEAAADEAQKWAUAAAAABlwFAAAAAAakBAQAAAAHCAQEAAAABxAFAAAAAAcUBAgAAAAHGAQEAAAABARIAAFIAMAESAABSADALBQAA1QIAIAkAAPkCACCIAQEAqQIAIZABAADSAsQBIpYBQACvAgAhlwFAAK8CACGpAQEAqQIAIcIBAQCpAgAhxAFAAK4CACHFAQIA0wIAIcYBAQCqAgAhAgAAAA4AIBIAAFUAIAmIAQEAqQIAIZABAADSAsQBIpYBQACvAgAhlwFAAK8CACGpAQEAqQIAIcIBAQCpAgAhxAFAAK4CACHFAQIA0wIAIcYBAQCqAgAhAgAAAAwAIBIAAFcAIAIAAAAMACASAABXACADAAAADgAgGQAAUAAgGgAAVQAgAQAAAA4AIAEAAAAMACAHCAAAqgMAIB8AAK0DACAgAACsAwAgMQAAqwMAIDIAAK4DACDEAQAApQIAIMYBAAClAgAgDIUBAACCAgAwhgEAAF4AEIcBAACCAgAwiAEBAMABACGQAQAAgwLEASKWAUAAxgEAIZcBQADGAQAhqQEBAMABACHCAQEAwAEAIcQBQADFAQAhxQECAIQCACHGAQEAwQEAIQMAAAAMACABAABdADAeAABeACADAAAADAAgAQAADQAwAgAADgAgEAYAAIACACAHAACBAgAghQEAAP0BADCGAQAAFQAQhwEAAP0BADCIAQEAAAABlgFAAN4BACGXAUAA3gEAIaYBAQAAAAG7AQAA_gG7ASK8AUAA3QEAIb0BAQDZAQAhvgEIAP8BACG_AQgA_wEAIcABQADdAQAhwQEgANwBACEBAAAAYQAgAQAAAGEAIAcGAACoAwAgBwAAqQMAILwBAAClAgAgvQEAAKUCACC-AQAApQIAIL8BAAClAgAgwAEAAKUCACADAAAAFQAgAQAAZAAwAgAAYQAgAwAAABUAIAEAAGQAMAIAAGEAIAMAAAAVACABAABkADACAABhACANBgAA2AIAIAcAAKcDACCIAQEAAAABlgFAAAAAAZcBQAAAAAGmAQEAAAABuwEAAAC7AQK8AUAAAAABvQEBAAAAAb4BCAAAAAG_AQgAAAABwAFAAAAAAcEBIAAAAAEBEgAAaAAgC4gBAQAAAAGWAUAAAAABlwFAAAAAAaYBAQAAAAG7AQAAALsBArwBQAAAAAG9AQEAAAABvgEIAAAAAb8BCAAAAAHAAUAAAAABwQEgAAAAAQESAABqADABEgAAagAwDQYAAMcCACAHAACmAwAgiAEBAKkCACGWAUAArwIAIZcBQACvAgAhpgEBAKkCACG7AQAAxQK7ASK8AUAArgIAIb0BAQCqAgAhvgEIAMYCACG_AQgAxgIAIcABQACuAgAhwQEgAK0CACECAAAAYQAgEgAAbQAgC4gBAQCpAgAhlgFAAK8CACGXAUAArwIAIaYBAQCpAgAhuwEAAMUCuwEivAFAAK4CACG9AQEAqgIAIb4BCADGAgAhvwEIAMYCACHAAUAArgIAIcEBIACtAgAhAgAAABUAIBIAAG8AIAIAAAAVACASAABvACADAAAAYQAgGQAAaAAgGgAAbQAgAQAAAGEAIAEAAAAVACAKCAAAoQMAIB8AAKQDACAgAACjAwAgMQAAogMAIDIAAKUDACC8AQAApQIAIL0BAAClAgAgvgEAAKUCACC_AQAApQIAIMABAAClAgAgDoUBAAD2AQAwhgEAAHYAEIcBAAD2AQAwiAEBAMABACGWAUAAxgEAIZcBQADGAQAhpgEBAMABACG7AQAA9wG7ASK8AUAAxQEAIb0BAQDBAQAhvgEIAPgBACG_AQgA-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_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_QEAMIYBAAAVABCHAQAA_QEAMIgBAQDYAQAhlgFAAN4BACGXAUAA3gEAIaYBAQDYAQAhuwEAAP4BuwEivAFAAN0BACG9AQEA2QEAIb4BCAD_AQAhvwEIAP8BACHAAUAA3QEAIcEBIADcAQAh3wEAABUAIOABAAAVACADowEAABcAIKQBAAAXACClAQAAFwAgCIUBAADjAQAwhgEAAKQBABCHAQAA4wEAMIgBAQDAAQAhlgFAAMYBACGmAQEAwAEAIacBAQDAAQAhqAFAAMYBACEQhQEAAOQBADCGAQAAjgEAEIcBAADkAQAwiAEBAMABACGQAQAA5wGvASKWAUAAxgEAIZcBQADGAQAhqQEBAMABACGqARAA5QEAIasBAQDAAQAhrQEAAOYBrQEirwEBAMEBACGwAQEAwQEAIbEBAADoAQAgsgEBAMEBACGzAUAAxQEAIQ0IAADIAQAgHwAA7wEAICAAAO8BACAxAADvAQAgMgAA7wEAIJgBEAAAAAGZARAAAAAEmgEQAAAABJsBEAAAAAGcARAAAAABnQEQAAAAAZ4BEAAAAAGfARAA7gEAIQcIAADIAQAgHwAA7QEAICAAAO0BACCYAQAAAK0BApkBAAAArQEImgEAAACtAQifAQAA7AGtASIHCAAAyAEAIB8AAOsBACAgAADrAQAgmAEAAACvAQKZAQAAAK8BCJoBAAAArwEInwEAAOoBrwEiDwgAAMsBACAfAADpAQAgIAAA6QEAIJgBgAAAAAGbAYAAAAABnAGAAAAAAZ0BgAAAAAGeAYAAAAABnwGAAAAAAbQBAQAAAAG1AQEAAAABtgEBAAAAAbcBgAAAAAG4AYAAAAABuQGAAAAAAQyYAYAAAAABmwGAAAAAAZwBgAAAAAGdAYAAAAABngGAAAAAAZ8BgAAAAAG0AQEAAAABtQEBAAAAAbYBAQAAAAG3AYAAAAABuAGAAAAAAbkBgAAAAAEHCAAAyAEAIB8AAOsBACAgAADrAQAgmAEAAACvAQKZAQAAAK8BCJoBAAAArwEInwEAAOoBrwEiBJgBAAAArwECmQEAAACvAQiaAQAAAK8BCJ8BAADrAa8BIgcIAADIAQAgHwAA7QEAICAAAO0BACCYAQAAAK0BApkBAAAArQEImgEAAACtAQifAQAA7AGtASIEmAEAAACtAQKZAQAAAK0BCJoBAAAArQEInwEAAO0BrQEiDQgAAMgBACAfAADvAQAgIAAA7wEAIDEAAO8BACAyAADvAQAgmAEQAAAAAZkBEAAAAASaARAAAAAEmwEQAAAAAZwBEAAAAAGdARAAAAABngEQAAAAAZ8BEADuAQAhCJgBEAAAAAGZARAAAAAEmgEQAAAABJsBEAAAAAGcARAAAAABnQEQAAAAAZ4BEAAAAAGfARAA7wEAIREFAAD1AQAghQEAAPABADCGAQAAEgAQhwEAAPABADCIAQEA2AEAIZABAADzAa8BIpYBQADeAQAhlwFAAN4BACGpAQEA2AEAIaoBEADxAQAhqwEBANgBACGtAQAA8gGtASKvAQEA2QEAIbABAQDZAQAhsQEAAPQBACCyAQEA2QEAIbMBQADdAQAhCJgBEAAAAAGZARAAAAAEmgEQAAAABJsBEAAAAAGcARAAAAABnQEQAAAAAZ4BEAAAAAGfARAA7wEAIQSYAQAAAK0BApkBAAAArQEImgEAAACtAQifAQAA7QGtASIEmAEAAACvAQKZAQAAAK8BCJoBAAAArwEInwEAAOsBrwEiDJgBgAAAAAGbAYAAAAABnAGAAAAAAZ0BgAAAAAGeAYAAAAABnwGAAAAAAbQBAQAAAAG1AQEAAAABtgEBAAAAAbcBgAAAAAG4AYAAAAABuQGAAAAAAR0EAACBAgAgBgAAgAIAIAoAAKECACCFAQAAnQIAMIYBAAAIABCHAQAAnQIAMIgBAQDYAQAhkAEAAJ8C0gEilQFAAN0BACGWAUAA3gEAIZcBQADeAQAhuwEAAP4BuwEixQECAJsCACHGAQEA2QEAIccBAQDYAQAhyAEBANgBACHJAQEA2QEAIcoBCAD_AQAhywEIAP8BACHMAQEA2QEAIc0BAQDZAQAhzgFAAN4BACHQAQAAngLQASLTAQAAoALTASLUAUAA3QEAIdUBAQDZAQAh1gEBANkBACHfAQAACAAg4AEAAAgAIA6FAQAA9gEAMIYBAAB2ABCHAQAA9gEAMIgBAQDAAQAhlgFAAMYBACGXAUAAxgEAIaYBAQDAAQAhuwEAAPcBuwEivAFAAMUBACG9AQEAwQEAIb4BCAD4AQAhvwEIAPgBACHAAUAAxQEAIcEBIADEAQAhBwgAAMgBACAfAAD8AQAgIAAA_AEAIJgBAAAAuwECmQEAAAC7AQiaAQAAALsBCJ8BAAD7AbsBIg0IAADLAQAgHwAA-gEAICAAAPoBACAxAAD6AQAgMgAA-gEAIJgBCAAAAAGZAQgAAAAFmgEIAAAABZsBCAAAAAGcAQgAAAABnQEIAAAAAZ4BCAAAAAGfAQgA-QEAIQ0IAADLAQAgHwAA-gEAICAAAPoBACAxAAD6AQAgMgAA-gEAIJgBCAAAAAGZAQgAAAAFmgEIAAAABZsBCAAAAAGcAQgAAAABnQEIAAAAAZ4BCAAAAAGfAQgA-QEAIQiYAQgAAAABmQEIAAAABZoBCAAAAAWbAQgAAAABnAEIAAAAAZ0BCAAAAAGeAQgAAAABnwEIAPoBACEHCAAAyAEAIB8AAPwBACAgAAD8AQAgmAEAAAC7AQKZAQAAALsBCJoBAAAAuwEInwEAAPsBuwEiBJgBAAAAuwECmQEAAAC7AQiaAQAAALsBCJ8BAAD8AbsBIhAGAACAAgAgBwAAgQIAIIUBAAD9AQAwhgEAABUAEIcBAAD9AQAwiAEBANgBACGWAUAA3gEAIZcBQADeAQAhpgEBANgBACG7AQAA_gG7ASK8AUAA3QEAIb0BAQDZAQAhvgEIAP8BACG_AQgA_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_gG7ASK8AUAA3QEAIb0BAQDZAQAhvgEIAP8BACG_AQgA_wEAIcABQADdAQAhwQEgANwBACHfAQAAFQAg4AEAABUAIBsEAACBAgAgBgAAgAIAIAoAAKECACCFAQAAnQIAMIYBAAAIABCHAQAAnQIAMIgBAQDYAQAhkAEAAJ8C0gEilQFAAN0BACGWAUAA3gEAIZcBQADeAQAhuwEAAP4BuwEixQECAJsCACHGAQEA2QEAIccBAQDYAQAhyAEBANgBACHJAQEA2QEAIcoBCAD_AQAhywEIAP8BACHMAQEA2QEAIc0BAQDZAQAhzgFAAN4BACHQAQAAngLQASLTAQAAoALTASLUAUAA3QEAIdUBAQDZAQAh1gEBANkBACEEmAEAAADQAQKZAQAAANABCJoBAAAA0AEInwEAAJIC0AEiBJgBAAAA0gECmQEAAADSAQiaAQAAANIBCJ8BAACQAtIBIgSYAQAAANMBApkBAAAA0wEImgEAAADTAQifAQAAjgLTASITBQAA9QEAIIUBAADwAQAwhgEAABIAEIcBAADwAQAwiAEBANgBACGQAQAA8wGvASKWAUAA3gEAIZcBQADeAQAhqQEBANgBACGqARAA8QEAIasBAQDYAQAhrQEAAPIBrQEirwEBANkBACGwAQEA2QEAIbEBAAD0AQAgsgEBANkBACGzAUAA3QEAId8BAAASACDgAQAAEgAgDQcAAKQCACCFAQAAogIAMIYBAAAFABCHAQAAogIAMIgBAQDYAQAhlgFAAN4BACGmAQEA2QEAIdgBAACjAtgBItkBAQDYAQAh2gEBANkBACHbAQAA9AEAINwBAQDZAQAh3QEBANkBACEEmAEAAADYAQKZAQAAANgBCJoBAAAA2AEInwEAAJYC2AEiFwMAAN8BACAJAADhAQAgCwAA4AEAIAwAAOIBACCFAQAA1wEAMIYBAAADABCHAQAA1wEAMIgBAQDYAQAhiQEBANgBACGKAQEA2AEAIYsBAQDZAQAhjAEBANkBACGOAQAA2gGOASKQAQAA2wGQASKRAQEA2QEAIZIBAQDZAQAhkwEBANkBACGUASAA3AEAIZUBQADdAQAhlgFAAN4BACGXAUAA3gEAId8BAAADACDgAQAAAwAgAAAAAAHkAQEAAAABAeQBAQAAAAEB5AEAAACOAQIB5AEAAACQAQIB5AEgAAAAAQHkAUAAAAABAeQBQAAAAAELGQAA_wIAMBoAAIQDADDhAQAAgAMAMOIBAACBAwAw4wEAAIIDACDkAQAAgwMAMOUBAACDAwAw5gEAAIMDADDnAQAAgwMAMOgBAACFAwAw6QEAAIYDADALGQAA2QIAMBoAAN4CADDhAQAA2gIAMOIBAADbAgAw4wEAANwCACDkAQAA3QIAMOUBAADdAgAw5gEAAN0CADDnAQAA3QIAMOgBAADfAgAw6QEAAOACADAHGQAAwAIAIBoAAMMCACDhAQAAwQIAIOIBAADCAgAg5QEAABUAIOYBAAAVACDnAQAAYQAgCxkAALQCADAaAAC5AgAw4QEAALUCADDiAQAAtgIAMOMBAAC3AgAg5AEAALgCADDlAQAAuAIAMOYBAAC4AgAw5wEAALgCADDoAQAAugIAMOkBAAC7AgAwBIgBAQAAAAGWAUAAAAABpwEBAAAAAagBQAAAAAECAAAAGQAgGQAAvwIAIAMAAAAZACAZAAC_AgAgGgAAvgIAIAESAADjAwAwCQcAAIECACCFAQAAlwIAMIYBAAAXABCHAQAAlwIAMIgBAQAAAAGWAUAA3gEAIaYBAQDYAQAhpwEBAAAAAagBQADeAQAhAgAAABkAIBIAAL4CACACAAAAvAIAIBIAAL0CACAIhQEAALsCADCGAQAAvAIAEIcBAAC7AgAwiAEBANgBACGWAUAA3gEAIaYBAQDYAQAhpwEBANgBACGoAUAA3gEAIQiFAQAAuwIAMIYBAAC8AgAQhwEAALsCADCIAQEA2AEAIZYBQADeAQAhpgEBANgBACGnAQEA2AEAIagBQADeAQAhBIgBAQCpAgAhlgFAAK8CACGnAQEAqQIAIagBQACvAgAhBIgBAQCpAgAhlgFAAK8CACGnAQEAqQIAIagBQACvAgAhBIgBAQAAAAGWAUAAAAABpwEBAAAAAagBQAAAAAELBgAA2AIAIIgBAQAAAAGWAUAAAAABlwFAAAAAAbsBAAAAuwECvAFAAAAAAb0BAQAAAAG-AQgAAAABvwEIAAAAAcABQAAAAAHBASAAAAABAgAAAGEAIBkAAMACACADAAAAFQAgGQAAwAIAIBoAAMQCACANAAAAFQAgBgAAxwIAIBIAAMQCACCIAQEAqQIAIZYBQACvAgAhlwFAAK8CACG7AQAAxQK7ASK8AUAArgIAIb0BAQCqAgAhvgEIAMYCACG_AQgAxgIAIcABQACuAgAhwQEgAK0CACELBgAAxwIAIIgBAQCpAgAhlgFAAK8CACGXAUAArwIAIbsBAADFArsBIrwBQACuAgAhvQEBAKoCACG-AQgAxgIAIb8BCADGAgAhwAFAAK4CACHBASAArQIAIQHkAQAAALsBAgXkAQgAAAAB6gEIAAAAAesBCAAAAAHsAQgAAAAB7QEIAAAAAQsZAADIAgAwGgAAzQIAMOEBAADJAgAw4gEAAMoCADDjAQAAywIAIOQBAADMAgAw5QEAAMwCADDmAQAAzAIAMOcBAADMAgAw6AEAAM4CADDpAQAAzwIAMAkFAADXAgAgiAEBAAAAAZABAAAAxAEClgFAAAAAAZcBQAAAAAGpAQEAAAABxAFAAAAAAcUBAgAAAAHGAQEAAAABAgAAAA4AIBkAANYCACADAAAADgAgGQAA1gIAIBoAANQCACABEgAA4gMAMA8FAAD1AQAgCQAAnAIAIIUBAACZAgAwhgEAAAwAEIcBAACZAgAwiAEBAAAAAZABAACaAsQBIpYBQADeAQAhlwFAAN4BACGpAQEA2AEAIcIBAQDYAQAhxAFAAN0BACHFAQIAmwIAIcYBAQDZAQAh3gEAAJgCACACAAAADgAgEgAA1AIAIAIAAADQAgAgEgAA0QIAIAyFAQAAzwIAMIYBAADQAgAQhwEAAM8CADCIAQEA2AEAIZABAACaAsQBIpYBQADeAQAhlwFAAN4BACGpAQEA2AEAIcIBAQDYAQAhxAFAAN0BACHFAQIAmwIAIcYBAQDZAQAhDIUBAADPAgAwhgEAANACABCHAQAAzwIAMIgBAQDYAQAhkAEAAJoCxAEilgFAAN4BACGXAUAA3gEAIakBAQDYAQAhwgEBANgBACHEAUAA3QEAIcUBAgCbAgAhxgEBANkBACEIiAEBAKkCACGQAQAA0gLEASKWAUAArwIAIZcBQACvAgAhqQEBAKkCACHEAUAArgIAIcUBAgDTAgAhxgEBAKoCACEB5AEAAADEAQIF5AECAAAAAeoBAgAAAAHrAQIAAAAB7AECAAAAAe0BAgAAAAEJBQAA1QIAIIgBAQCpAgAhkAEAANICxAEilgFAAK8CACGXAUAArwIAIakBAQCpAgAhxAFAAK4CACHFAQIA0wIAIcYBAQCqAgAhBRkAAN0DACAaAADgAwAg4QEAAN4DACDiAQAA3wMAIOcBAAAKACAJBQAA1wIAIIgBAQAAAAGQAQAAAMQBApYBQAAAAAGXAUAAAAABqQEBAAAAAcQBQAAAAAHFAQIAAAABxgEBAAAAAQMZAADdAwAg4QEAAN4DACDnAQAACgAgBBkAAMgCADDhAQAAyQIAMOMBAADLAgAg5wEAAMwCADAWBgAA_QIAIAoAAP4CACCIAQEAAAABkAEAAADSAQKVAUAAAAABlgFAAAAAAZcBQAAAAAG7AQAAALsBAsUBAgAAAAHGAQEAAAAByAEBAAAAAckBAQAAAAHKAQgAAAABywEIAAAAAcwBAQAAAAHNAQEAAAABzgFAAAAAAdABAAAA0AEC0wEAAADTAQLUAUAAAAAB1QEBAAAAAdYBAQAAAAECAAAACgAgGQAA_AIAIAMAAAAKACAZAAD8AgAgGgAA5gIAIAESAADcAwAwGwQAAIECACAGAACAAgAgCgAAoQIAIIUBAACdAgAwhgEAAAgAEIcBAACdAgAwiAEBAAAAAZABAACfAtIBIpUBQADdAQAhlgFAAN4BACGXAUAA3gEAIbsBAAD-AbsBIsUBAgCbAgAhxgEBANkBACHHAQEA2AEAIcgBAQDYAQAhyQEBANkBACHKAQgA_wEAIcsBCAD_AQAhzAEBANkBACHNAQEA2QEAIc4BQADeAQAh0AEAAJ4C0AEi0wEAAKAC0wEi1AFAAN0BACHVAQEA2QEAIdYBAQDZAQAhAgAAAAoAIBIAAOYCACACAAAA4QIAIBIAAOICACAYhQEAAOACADCGAQAA4QIAEIcBAADgAgAwiAEBANgBACGQAQAAnwLSASKVAUAA3QEAIZYBQADeAQAhlwFAAN4BACG7AQAA_gG7ASLFAQIAmwIAIcYBAQDZAQAhxwEBANgBACHIAQEA2AEAIckBAQDZAQAhygEIAP8BACHLAQgA_wEAIcwBAQDZAQAhzQEBANkBACHOAUAA3gEAIdABAACeAtABItMBAACgAtMBItQBQADdAQAh1QEBANkBACHWAQEA2QEAIRiFAQAA4AIAMIYBAADhAgAQhwEAAOACADCIAQEA2AEAIZABAACfAtIBIpUBQADdAQAhlgFAAN4BACGXAUAA3gEAIbsBAAD-AbsBIsUBAgCbAgAhxgEBANkBACHHAQEA2AEAIcgBAQDYAQAhyQEBANkBACHKAQgA_wEAIcsBCAD_AQAhzAEBANkBACHNAQEA2QEAIc4BQADeAQAh0AEAAJ4C0AEi0wEAAKAC0wEi1AFAAN0BACHVAQEA2QEAIdYBAQDZAQAhFIgBAQCpAgAhkAEAAOQC0gEilQFAAK4CACGWAUAArwIAIZcBQACvAgAhuwEAAMUCuwEixQECANMCACHGAQEAqgIAIcgBAQCpAgAhyQEBAKoCACHKAQgAxgIAIcsBCADGAgAhzAEBAKoCACHNAQEAqgIAIc4BQACvAgAh0AEAAOMC0AEi0wEAAOUC0wEi1AFAAK4CACHVAQEAqgIAIdYBAQCqAgAhAeQBAAAA0AECAeQBAAAA0gECAeQBAAAA0wECFgYAAOcCACAKAADoAgAgiAEBAKkCACGQAQAA5ALSASKVAUAArgIAIZYBQACvAgAhlwFAAK8CACG7AQAAxQK7ASLFAQIA0wIAIcYBAQCqAgAhyAEBAKkCACHJAQEAqgIAIcoBCADGAgAhywEIAMYCACHMAQEAqgIAIc0BAQCqAgAhzgFAAK8CACHQAQAA4wLQASLTAQAA5QLTASLUAUAArgIAIdUBAQCqAgAh1gEBAKoCACELGQAA8QIAMBoAAPUCADDhAQAA8gIAMOIBAADzAgAw4wEAAPQCACDkAQAAzAIAMOUBAADMAgAw5gEAAMwCADDnAQAAzAIAMOgBAAD2AgAw6QEAAM8CADAHGQAA6QIAIBoAAOwCACDhAQAA6gIAIOIBAADrAgAg5QEAABIAIOYBAAASACDnAQAAeQAgDIgBAQAAAAGQAQAAAK8BApYBQAAAAAGXAUAAAAABqgEQAAAAAasBAQAAAAGtAQAAAK0BAq8BAQAAAAGwAQEAAAABsQGAAAAAAbIBAQAAAAGzAUAAAAABAgAAAHkAIBkAAOkCACADAAAAEgAgGQAA6QIAIBoAAO0CACAOAAAAEgAgEgAA7QIAIIgBAQCpAgAhkAEAAPACrwEilgFAAK8CACGXAUAArwIAIaoBEADuAgAhqwEBAKkCACGtAQAA7wKtASKvAQEAqgIAIbABAQCqAgAhsQGAAAAAAbIBAQCqAgAhswFAAK4CACEMiAEBAKkCACGQAQAA8AKvASKWAUAArwIAIZcBQACvAgAhqgEQAO4CACGrAQEAqQIAIa0BAADvAq0BIq8BAQCqAgAhsAEBAKoCACGxAYAAAAABsgEBAKoCACGzAUAArgIAIQXkARAAAAAB6gEQAAAAAesBEAAAAAHsARAAAAAB7QEQAAAAAQHkAQAAAK0BAgHkAQAAAK8BAgkJAAD7AgAgiAEBAAAAAZABAAAAxAEClgFAAAAAAZcBQAAAAAHCAQEAAAABxAFAAAAAAcUBAgAAAAHGAQEAAAABAgAAAA4AIBkAAPoCACADAAAADgAgGQAA-gIAIBoAAPgCACABEgAA2wMAMAIAAAAOACASAAD4AgAgAgAAANACACASAAD3AgAgCIgBAQCpAgAhkAEAANICxAEilgFAAK8CACGXAUAArwIAIcIBAQCpAgAhxAFAAK4CACHFAQIA0wIAIcYBAQCqAgAhCQkAAPkCACCIAQEAqQIAIZABAADSAsQBIpYBQACvAgAhlwFAAK8CACHCAQEAqQIAIcQBQACuAgAhxQECANMCACHGAQEAqgIAIQUZAADWAwAgGgAA2QMAIOEBAADXAwAg4gEAANgDACDnAQAAYQAgCQkAAPsCACCIAQEAAAABkAEAAADEAQKWAUAAAAABlwFAAAAAAcIBAQAAAAHEAUAAAAABxQECAAAAAcYBAQAAAAEDGQAA1gMAIOEBAADXAwAg5wEAAGEAIBYGAAD9AgAgCgAA_gIAIIgBAQAAAAGQAQAAANIBApUBQAAAAAGWAUAAAAABlwFAAAAAAbsBAAAAuwECxQECAAAAAcYBAQAAAAHIAQEAAAAByQEBAAAAAcoBCAAAAAHLAQgAAAABzAEBAAAAAc0BAQAAAAHOAUAAAAAB0AEAAADQAQLTAQAAANMBAtQBQAAAAAHVAQEAAAAB1gEBAAAAAQQZAADxAgAw4QEAAPICADDjAQAA9AIAIOcBAADMAgAwAxkAAOkCACDhAQAA6gIAIOcBAAB5ACAIiAEBAAAAAZYBQAAAAAHYAQAAANgBAtkBAQAAAAHaAQEAAAAB2wGAAAAAAdwBAQAAAAHdAQEAAAABAgAAAAEAIBkAAIsDACADAAAAAQAgGQAAiwMAIBoAAIoDACABEgAA1QMAMA0HAACkAgAghQEAAKICADCGAQAABQAQhwEAAKICADCIAQEAAAABlgFAAN4BACGmAQEA2QEAIdgBAACjAtgBItkBAQDYAQAh2gEBANkBACHbAQAA9AEAINwBAQDZAQAh3QEBANkBACECAAAAAQAgEgAAigMAIAIAAACHAwAgEgAAiAMAIAyFAQAAhgMAMIYBAACHAwAQhwEAAIYDADCIAQEA2AEAIZYBQADeAQAhpgEBANkBACHYAQAAowLYASLZAQEA2AEAIdoBAQDZAQAh2wEAAPQBACDcAQEA2QEAId0BAQDZAQAhDIUBAACGAwAwhgEAAIcDABCHAQAAhgMAMIgBAQDYAQAhlgFAAN4BACGmAQEA2QEAIdgBAACjAtgBItkBAQDYAQAh2gEBANkBACHbAQAA9AEAINwBAQDZAQAh3QEBANkBACEIiAEBAKkCACGWAUAArwIAIdgBAACJA9gBItkBAQCpAgAh2gEBAKoCACHbAYAAAAAB3AEBAKoCACHdAQEAqgIAIQHkAQAAANgBAgiIAQEAqQIAIZYBQACvAgAh2AEAAIkD2AEi2QEBAKkCACHaAQEAqgIAIdsBgAAAAAHcAQEAqgIAId0BAQCqAgAhCIgBAQAAAAGWAUAAAAAB2AEAAADYAQLZAQEAAAAB2gEBAAAAAdsBgAAAAAHcAQEAAAAB3QEBAAAAAQQZAAD_AgAw4QEAAIADADDjAQAAggMAIOcBAACDAwAwBBkAANkCADDhAQAA2gIAMOMBAADcAgAg5wEAAN0CADADGQAAwAIAIOEBAADBAgAg5wEAAGEAIAQZAAC0AgAw4QEAALUCADDjAQAAtwIAIOcBAAC4AgAwAAAHBgAAqAMAIAcAAKkDACC8AQAApQIAIL0BAAClAgAgvgEAAKUCACC_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_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-WAs_WR1AWgRBWwRCXAtDXx5EYCRFYgVGYwVHZQVIZgVJZwVKaQVLawtMbCVNbgVOcAtPcSZQcgVRcwVSdAtTdydUeC1VegdWewdXfQdYfgdZfwdagQEHW4MBC1yEAS5dhgEHXogBC1-JAS9gigEHYYsBB2KMAQtjjwEwZJABNmWRAQlmkgEJZ5MBCWiUAQlplQEJapcBCWuZAQtsmgE3bZwBCW6eAQtvnwE4cKABCXGhAQlyogELc6UBOXSmAT11qAECdqkBAnerAQJ4rAECea0BAnqvAQJ7sQELfLIBPn20AQJ-tgELf7cBP4ABuAECgQG5AQKCAboBC4MBvQFAhAG-AUQ"
};
async function decodeBase64AsWasm(wasmBase64) {
  const { Buffer: Buffer2 } = await import("buffer");
  const wasmArray = Buffer2.from(wasmBase64, "base64");
  return new WebAssembly.Module(wasmArray);
}
config2.compilerWasm = {
  getRuntime: async () => await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js"),
  getQueryCompilerWasmModule: async () => {
    const { wasm } = await import("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js");
    return await decodeBase64AsWasm(wasm);
  },
  importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
  return runtime.getPrismaClient(config2);
}

// src/generated/prisma/internal/prismaNamespace.ts
var runtime2 = __toESM(require("@prisma/client/runtime/client"));
var getExtensionContext = runtime2.Extensions.getExtensionContext;
var NullTypes2 = {
  DbNull: runtime2.NullTypes.DbNull,
  JsonNull: runtime2.NullTypes.JsonNull,
  AnyNull: runtime2.NullTypes.AnyNull
};
var TransactionIsolationLevel = runtime2.makeStrictEnum({
  ReadUncommitted: "ReadUncommitted",
  ReadCommitted: "ReadCommitted",
  RepeatableRead: "RepeatableRead",
  Serializable: "Serializable"
});
var defineExtension = runtime2.Extensions.defineExtension;

// src/generated/prisma/client.ts
var PrismaClient = getPrismaClientClass();

// src/lib/prisma.ts
var connectionString = `${process.env.DATABASE_URL}`;
var adapter = new import_adapter_pg.PrismaPg({ connectionString });
var prisma = new PrismaClient({ adapter });

// src/utils/redis.ts
var import_redis = require("redis");
var redisClient = (0, import_redis.createClient)({
  username: config_default.redis_user,
  password: config_default.redis_password,
  socket: {
    host: config_default.redis_host,
    port: Number(config_default.redis_port)
  }
});
redisClient.on("error", (error) => {
  console.error("Redis Error:", error);
});

// src/utils/email.ts
var import_nodemailer = __toESM(require("nodemailer"));
var import_ejs = __toESM(require("ejs"));
var import_path = __toESM(require("path"));
var transporter = import_nodemailer.default.createTransport({
  host: config_default.smtp_host,
  port: Number(config_default.smtp_port),
  secure: Number(config_default.smtp_port) === 465,
  auth: {
    user: config_default.smtp_user,
    pass: config_default.smtp_password
  }
});
var sendEmailVerificationEmail = async (email, name, otp) => {
  const templatePath = import_path.default.join(
    process.cwd(),
    "src",
    "templates",
    "verification_email.ejs"
  );
  const html = await import_ejs.default.renderFile(templatePath, {
    name,
    otp
  });
  await transporter.sendMail({
    from: `"BloodLink" <${config_default.email_sender}>`,
    to: email,
    subject: "Verify Your BloodLink Account",
    html
  });
};
var sendForgotPasswordEmail = async (email, name, otp) => {
  const templatePath = import_path.default.join(
    process.cwd(),
    "src",
    "templates",
    "forgot_password.ejs"
  );
  const html = await import_ejs.default.renderFile(templatePath, {
    name,
    otp
  });
  await transporter.sendMail({
    from: `"BloodLink" <${config_default.email_sender}>`,
    to: email,
    subject: "BloodLink Password Reset OTP",
    html
  });
};
var sendResetPasswordEmail = async (email, name) => {
  const templatePath = import_path.default.join(
    process.cwd(),
    "src",
    "templates",
    "reset_password.ejs"
  );
  const html = await import_ejs.default.renderFile(templatePath, {
    name
  });
  await transporter.sendMail({
    from: `"BloodLink" <${config_default.email_sender}>`,
    to: email,
    subject: "BloodLink Password Reset Successful",
    html
  });
};
var sendWelcomeEmail = async (email, name) => {
  const templatePath = import_path.default.join(
    process.cwd(),
    "src",
    "templates",
    "welcome_email.ejs"
  );
  const html = await import_ejs.default.renderFile(templatePath, {
    name
  });
  await transporter.sendMail({
    from: `"BloodLink" <${config_default.email_sender}>`,
    to: email,
    subject: "Welcome to BloodLink \u{1F389}",
    html
  });
};

// src/utils/auditLog.ts
var createAuditLog = async ({
  userId,
  action,
  entity,
  entityId,
  details,
  ipAddress,
  userAgent
}) => {
  return prisma.auditLog.create({
    data: {
      action,
      entity,
      ...entityId !== void 0 && {
        entityId
      },
      ...details !== void 0 && {
        details
      },
      ...ipAddress !== void 0 && {
        ipAddress
      },
      ...userAgent !== void 0 && {
        userAgent
      },
      ...userId !== void 0 && {
        user: {
          connect: {
            id: userId
          }
        }
      }
    }
  });
};

// src/modules/auth/auth.service.ts
var googleClient = new import_google_auth_library.OAuth2Client(
  config_default.google_client_id,
  config_default.google_client_secret,
  config_default.google_callback_url
);
var register = async (payload) => {
  const email = payload.email.trim().toLowerCase();
  const existingUser = await prisma.user.findUnique({
    where: { email }
  });
  if (existingUser) {
    throw new Error("User already exists with this email");
  }
  const hashedPassword = await import_bcrypt.default.hash(
    payload.password,
    10
  );
  const user = await prisma.user.create({
    data: {
      name: payload.name,
      email,
      password: hashedPassword,
      phone: payload.phone ?? null,
      location: payload.location ?? null,
      role: Role.RECIPIENT,
      status: AccountStatus.ACTIVE,
      emailVerified: false
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
      updatedAt: true
    }
  });
  const otp = import_crypto.default.randomInt(1e5, 1e6).toString();
  await redisClient.set(
    `verify-email:${email}`,
    otp,
    {
      EX: 300
    }
  );
  await sendEmailVerificationEmail(
    email,
    user.name,
    otp
  );
  return user;
};
var verifyEmail = async (email, otp) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
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
      email: normalizedEmail
    },
    data: {
      emailVerified: true
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true
    }
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
var loginUser = async (payload) => {
  const email = payload.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (!user) {
    throw new Error("Invalid email or password");
  }
  if (user.status !== AccountStatus.ACTIVE) {
    throw new Error("Your account is not active");
  }
  if (!user.emailVerified) {
    throw new Error("Please verify your email first");
  }
  if (!user.password) {
    throw new Error("Please use your registered password");
  }
  const isPasswordMatched = await import_bcrypt.default.compare(
    payload.password,
    user.password
  );
  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }
  const accessToken = import_jsonwebtoken.default.sign(
    {
      id: user.id,
      role: user.role
    },
    config_default.jwt_access_secret,
    {
      expiresIn: 60 * 60 * 24
      // 1 day
    }
  );
  const refreshToken = import_jsonwebtoken.default.sign(
    {
      id: user.id,
      role: user.role
    },
    config_default.jwt_refresh_secret,
    {
      expiresIn: 60 * 60 * 24 * 7
      // 7 days
    }
  );
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 1e3 * 60 * 60 * 24 * 7
      )
    }
  });
  await createAuditLog({
    userId: user.id,
    action: AuditAction.LOGIN,
    entity: "User",
    entityId: user.id,
    details: {
      email: user.email,
      role: user.role,
      message: "User logged in successfully"
    }
  });
  const { password, ...userWithoutPassword } = user;
  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword
  };
};
var googleLogin = async (payload) => {
  const { credential } = payload;
  if (!credential) {
    throw new Error("Google credential is required");
  }
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: config_default.google_client_id
  });
  const googlePayload = ticket.getPayload();
  if (!googlePayload) {
    throw new Error("Invalid Google credential");
  }
  const googleId = googlePayload.sub;
  const googleEmail = googlePayload.email;
  const googleName = googlePayload.name;
  if (!googleId) {
    throw new Error("Google user ID not found");
  }
  if (!googleEmail) {
    throw new Error("Google account email not found");
  }
  const email = googleEmail.trim().toLowerCase();
  let user = await prisma.user.findUnique({
    where: {
      email
    }
  });
  if (user) {
    if (user.status === AccountStatus.BLOCKED) {
      throw new Error("Your account is blocked");
    }
    if (user.status === AccountStatus.DELETED || user.deletedAt) {
      throw new Error("Your account is deleted");
    }
    if (!user.googleId) {
      user = await prisma.user.update({
        where: {
          id: user.id
        },
        data: {
          googleId,
          emailVerified: true
        }
      });
    } else if (user.googleId !== googleId) {
      throw new Error(
        "This email is already linked with another Google account"
      );
    }
  } else {
    const name = googleName || email.split("@")[0] || "Google User";
    user = await prisma.user.create({
      data: {
        name,
        email,
        // Google users don't need password
        password: null,
        // Save Google unique ID
        googleId,
        // Google already verified the email
        emailVerified: true,
        // New Google users become Recipient
        role: Role.RECIPIENT,
        status: AccountStatus.ACTIVE
      }
    });
  }
  const accessToken = import_jsonwebtoken.default.sign(
    {
      id: user.id,
      role: user.role
    },
    config_default.jwt_access_secret,
    {
      expiresIn: 60 * 60 * 24
    }
  );
  const refreshToken = import_jsonwebtoken.default.sign(
    {
      id: user.id,
      role: user.role
    },
    config_default.jwt_refresh_secret,
    {
      expiresIn: 60 * 60 * 24 * 7
    }
  );
  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: refreshToken,
      expiresAt: new Date(
        Date.now() + 1e3 * 60 * 60 * 24 * 7
      )
    }
  });
  await createAuditLog({
    userId: user.id,
    action: AuditAction.LOGIN,
    entity: "User",
    entityId: user.id,
    details: {
      email: user.email,
      role: user.role,
      loginMethod: "GOOGLE"
    }
  });
  const {
    password,
    ...userWithoutPassword
  } = user;
  return {
    user: userWithoutPassword,
    accessToken,
    refreshToken
  };
};
var refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }
  const storedToken = await prisma.refreshToken.findUnique({
    where: {
      token: refreshToken
    }
  });
  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }
  if (storedToken.expiresAt < /* @__PURE__ */ new Date()) {
    await prisma.refreshToken.delete({
      where: {
        id: storedToken.id
      }
    });
    throw new Error("Refresh token expired");
  }
  const decoded = import_jsonwebtoken.default.verify(
    refreshToken,
    config_default.jwt_refresh_secret
  );
  const accessToken = import_jsonwebtoken.default.sign(
    {
      id: decoded.id,
      role: decoded.role
    },
    config_default.jwt_access_secret,
    {
      expiresIn: 60 * 60 * 24
    }
  );
  return {
    accessToken
  };
};
var forgotPassword = async (email) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
  });
  if (!user) {
    return {
      message: "If this email is registered, a password reset OTP has been sent"
    };
  }
  if (user.status !== AccountStatus.ACTIVE) {
    throw new Error("Your account is not active");
  }
  const otp = import_crypto.default.randomInt(1e5, 1e6).toString();
  await redisClient.set(
    `reset-password:${normalizedEmail}`,
    otp,
    {
      EX: 300
    }
  );
  await sendForgotPasswordEmail(
    normalizedEmail,
    user.name,
    otp
  );
  return {
    message: "Password reset OTP sent successfully"
  };
};
var resetPassword = async (email, otp, newPassword) => {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({
    where: {
      email: normalizedEmail
    }
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
  const hashedPassword = await import_bcrypt.default.hash(
    newPassword,
    10
  );
  await prisma.user.update({
    where: {
      email: normalizedEmail
    },
    data: {
      password: hashedPassword
    }
  });
  await redisClient.del(
    `reset-password:${normalizedEmail}`
  );
  await prisma.refreshToken.deleteMany({
    where: {
      userId: user.id
    }
  });
  await sendResetPasswordEmail(
    normalizedEmail,
    user.name
  );
  return {
    message: "Password reset successfully"
  };
};
var AuthService = {
  register,
  verifyEmail,
  loginUser,
  googleLogin,
  refreshAccessToken,
  forgotPassword,
  resetPassword
};

// src/modules/auth/auth.validation.ts
var import_zod = require("zod");
var RegisterZodSchema = import_zod.z.object({
  name: import_zod.z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be at most 100 characters"),
  email: import_zod.z.string().email("Invalid email address"),
  password: import_zod.z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
    "Password must contain uppercase, lowercase, number and special character"
  ),
  phone: import_zod.z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number must be at most 15 characters").optional(),
  location: import_zod.z.string().optional()
});
var LoginZodSchema = import_zod.z.object({
  email: import_zod.z.string().email("Invalid email address"),
  password: import_zod.z.string().min(1, "Password is required")
});
var ForgetPasswordZodSchema = import_zod.z.object({
  email: import_zod.z.string().email("Invalid email address")
});
var ResetPasswordZodSchema = import_zod.z.object({
  email: import_zod.z.string().email("Invalid email address"),
  otp: import_zod.z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers"),
  newPassword: import_zod.z.string().min(8, "Password must be at least 8 characters").regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
    "Password must contain uppercase, lowercase, number and special character"
  )
});
var VerifyEmailZodSchema = import_zod.z.object({
  email: import_zod.z.string().email("Invalid email address"),
  otp: import_zod.z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must contain only numbers")
});
var GoogleLoginZodSchema = import_zod.z.object({
  credential: import_zod.z.string().min(1, "Google credential is required")
});
var authValidation = {
  RegisterZodSchema,
  LoginZodSchema,
  ForgetPasswordZodSchema,
  ResetPasswordZodSchema,
  VerifyEmailZodSchema,
  GoogleLoginZodSchema
};

// src/utils/sendResponse.ts
var sendResponse = (res, data) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta
  });
};

// src/utils/catchAsync.ts
var catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// src/modules/auth/auth.controller.ts
var register2 = catchAsync(
  async (req, res) => {
    console.log("REQ BODY:", req.body);
    const payload = authValidation.RegisterZodSchema.safeParse(req.body);
    if (!payload.success) {
      const errorMessage = payload.error.issues.map((issue) => issue.message).join(" ");
      throw new Error(errorMessage);
    }
    const result = await AuthService.register(payload.data);
    sendResponse(res, {
      success: true,
      statusCode: import_http_status3.default.CREATED,
      message: "Registration successful. Please check your email to verify your account.",
      data: result
    });
  }
);
var verifyEmail2 = catchAsync(
  async (req, res) => {
    const payload = authValidation.VerifyEmailZodSchema.safeParse(req.body);
    if (!payload.success) {
      const errorMessage = payload.error.issues.map((issue) => issue.message).join(", ");
      throw new Error(errorMessage);
    }
    const result = await AuthService.verifyEmail(
      payload.data.email,
      payload.data.otp
    );
    sendResponse(res, {
      success: true,
      statusCode: import_http_status3.default.OK,
      message: "Email verified successfully",
      data: result
    });
  }
);
var loginUser2 = catchAsync(async (req, res) => {
  const payload = authValidation.LoginZodSchema.safeParse(req.body);
  if (!payload.success) {
    let errorMessage = "";
    payload.error.issues.forEach((issue) => {
      errorMessage += `${issue.message} `;
    });
    throw new Error(errorMessage);
  }
  const result = await AuthService.loginUser(payload.data);
  const { accessToken, refreshToken, user } = result;
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1e3 * 60 * 60 * 24
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 1e3 * 60 * 60 * 24 * 7
  });
  sendResponse(res, {
    statusCode: import_http_status3.default.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken,
      refreshToken,
      user
    }
  });
});
var googleLogin2 = catchAsync(async (req, res) => {
  const payload = req.body;
  const result = await AuthService.googleLogin(payload);
  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: config_default.node_env === "production",
    sameSite: config_default.node_env === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1e3
  });
  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: config_default.node_env === "production",
    sameSite: config_default.node_env === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1e3
  });
  sendResponse(res, {
    statusCode: import_http_status3.default.OK,
    success: true,
    message: "Google login successful",
    data: {
      user: result.user
    }
  });
});
var refreshAccessToken2 = catchAsync(
  async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    const result = await AuthService.refreshAccessToken(
      refreshToken
    );
    res.cookie("accessToken", result.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1e3 * 60 * 60 * 24
    });
    sendResponse(res, {
      statusCode: import_http_status3.default.OK,
      success: true,
      message: "Access token refreshed successfully",
      data: result
    });
  }
);
var forgotPassword2 = catchAsync(
  async (req, res) => {
    const payload = authValidation.ForgetPasswordZodSchema.safeParse(req.body);
    if (!payload.success) {
      const errorMessage = payload.error.issues.map((issue) => issue.message).join(", ");
      throw new Error(errorMessage);
    }
    const result = await AuthService.forgotPassword(
      payload.data.email
    );
    sendResponse(res, {
      success: true,
      statusCode: import_http_status3.default.OK,
      message: result.message,
      data: null
    });
  }
);
var resetPassword2 = catchAsync(
  async (req, res) => {
    const payload = authValidation.ResetPasswordZodSchema.safeParse(req.body);
    if (!payload.success) {
      const errorMessage = payload.error.issues.map((issue) => issue.message).join(", ");
      throw new Error(errorMessage);
    }
    const result = await AuthService.resetPassword(
      payload.data.email,
      payload.data.otp,
      payload.data.newPassword
    );
    sendResponse(res, {
      success: true,
      statusCode: import_http_status3.default.OK,
      message: result.message,
      data: null
    });
  }
);
var AuthController = {
  register: register2,
  verifyEmail: verifyEmail2,
  loginUser: loginUser2,
  googleLogin: googleLogin2,
  refreshAccessToken: refreshAccessToken2,
  forgotPassword: forgotPassword2,
  resetPassword: resetPassword2
};

// src/middlewares/validateRequest.ts
var validateRequest = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const message = result.error.issues.map((issue) => issue.message).join(", ");
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message,
        data: null
      });
    }
    req.body = result.data;
    next();
  };
};

// src/modules/auth/auth.route.ts
var router = (0, import_express.Router)();
router.post(
  "/register",
  validateRequest(authValidation.RegisterZodSchema),
  AuthController.register
);
router.post(
  "/verify-email",
  validateRequest(authValidation.VerifyEmailZodSchema),
  AuthController.verifyEmail
);
router.post(
  "/login",
  validateRequest(authValidation.LoginZodSchema),
  AuthController.loginUser
);
router.post(
  "/google",
  validateRequest(authValidation.GoogleLoginZodSchema),
  AuthController.googleLogin
);
router.post(
  "/refresh-token",
  AuthController.refreshAccessToken
);
router.post(
  "/forgot-password",
  validateRequest(authValidation.ForgetPasswordZodSchema),
  AuthController.forgotPassword
);
router.post(
  "/reset-password",
  validateRequest(authValidation.ResetPasswordZodSchema),
  AuthController.resetPassword
);
var AuthRoutes = router;

// src/modules/user/user.route.ts
var import_express2 = require("express");

// src/modules/user/user.controller.ts
var import_http_status4 = __toESM(require("http-status"));

// src/modules/user/user.service.ts
var getMyProfile = async (userId) => {
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deletedAt: null
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
          isAvailable: true
        }
      }
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};
var updateMyProfile = async (userId, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });
  if (!user) {
    throw new Error("User not found");
  }
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
      deletedAt: null
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
      updatedAt: true
    }
  });
  return updatedUser;
};
var UserService = {
  getMyProfile,
  updateMyProfile
};

// src/modules/user/user.controller.ts
var getMyProfile2 = catchAsync(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User not found");
    }
    const result = await UserService.getMyProfile(userId);
    sendResponse(res, {
      statusCode: import_http_status4.default.OK,
      success: true,
      message: "Profile retrieved successfully",
      data: result
    });
  }
);
var updateMyProfile2 = catchAsync(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User not found");
    }
    const result = await UserService.updateMyProfile(
      userId,
      req.body
    );
    sendResponse(res, {
      statusCode: import_http_status4.default.OK,
      success: true,
      message: "Profile updated successfully",
      data: result
    });
  }
);
var UserController = {
  getMyProfile: getMyProfile2,
  updateMyProfile: updateMyProfile2
};

// src/middlewares/auth.ts
var import_jsonwebtoken2 = __toESM(require("jsonwebtoken"));
var import_http_status5 = __toESM(require("http-status"));
var auth = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const token = req.cookies?.accessToken || req.get("authorization")?.replace("Bearer ", "");
      if (!token) {
        return res.status(import_http_status5.default.UNAUTHORIZED).json({
          success: false,
          statusCode: import_http_status5.default.UNAUTHORIZED,
          message: "You are not logged in",
          data: null
        });
      }
      const decoded = import_jsonwebtoken2.default.verify(
        token,
        config_default.jwt_access_secret
      );
      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        return res.status(import_http_status5.default.FORBIDDEN).json({
          success: false,
          statusCode: import_http_status5.default.FORBIDDEN,
          message: "You do not have permission to access this resource",
          data: null
        });
      }
      req.user = {
        id: decoded.id,
        role: decoded.role
      };
      next();
    } catch (error) {
      return res.status(import_http_status5.default.UNAUTHORIZED).json({
        success: false,
        statusCode: import_http_status5.default.UNAUTHORIZED,
        message: "Invalid or expired access token",
        data: null
      });
    }
  };
};

// src/modules/user/user.validation.ts
var import_zod2 = require("zod");
var UpdateProfileZodSchema = import_zod2.z.object({
  name: import_zod2.z.string().min(2).max(100).optional(),
  phone: import_zod2.z.string().min(10).max(15).optional(),
  location: import_zod2.z.string().optional(),
  profileImage: import_zod2.z.string().url().optional()
});
var userValidation = {
  UpdateProfileZodSchema
};

// src/modules/user/user.route.ts
var router2 = (0, import_express2.Router)();
router2.get(
  "/me",
  auth(),
  UserController.getMyProfile
);
router2.patch(
  "/me",
  auth(),
  validateRequest(userValidation.UpdateProfileZodSchema),
  UserController.updateMyProfile
);
var UserRoutes = router2;

// src/modules/bloodRequest/bloodRequest.route.ts
var import_express3 = require("express");

// src/modules/bloodRequest/bloodRequest.controller.ts
var import_http_status6 = __toESM(require("http-status"));

// src/modules/bloodRequest/bloodRequest.validation.ts
var import_zod3 = require("zod");
var CreateBloodRequestZodSchema = import_zod3.z.object({
  bloodGroup: import_zod3.z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE"
  ]),
  units: import_zod3.z.number().int().positive().default(1),
  hospitalName: import_zod3.z.string().min(2),
  hospitalAddress: import_zod3.z.string().optional(),
  requiredDate: import_zod3.z.coerce.date(),
  urgency: import_zod3.z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]).default("NORMAL"),
  contactNumber: import_zod3.z.string().min(10).max(15).optional(),
  patientName: import_zod3.z.string().min(2).optional(),
  notes: import_zod3.z.string().optional()
});
var UpdateBloodRequestZodSchema = import_zod3.z.object({
  bloodGroup: import_zod3.z.enum([
    "A_POSITIVE",
    "A_NEGATIVE",
    "B_POSITIVE",
    "B_NEGATIVE",
    "AB_POSITIVE",
    "AB_NEGATIVE",
    "O_POSITIVE",
    "O_NEGATIVE"
  ]).optional(),
  units: import_zod3.z.number().int().positive().optional(),
  hospitalName: import_zod3.z.string().min(2).optional(),
  hospitalAddress: import_zod3.z.string().optional(),
  requiredDate: import_zod3.z.coerce.date().optional(),
  urgency: import_zod3.z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]).optional(),
  contactNumber: import_zod3.z.string().min(10).max(15).optional(),
  patientName: import_zod3.z.string().min(2).optional(),
  notes: import_zod3.z.string().optional()
});
var RejectBloodRequestZodSchema = import_zod3.z.object({
  rejectionReason: import_zod3.z.string().min(5, "Rejection reason must be at least 5 characters").max(500, "Rejection reason cannot exceed 500 characters")
});
var bloodRequestValidation = {
  CreateBloodRequestZodSchema,
  UpdateBloodRequestZodSchema,
  RejectBloodRequestZodSchema
};

// src/modules/bloodRequest/bloodRequest.service.ts
var createBloodRequest = async (recipientId, payload) => {
  const user = await prisma.user.findUnique({
    where: {
      id: recipientId
    }
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
      notes: payload.notes ?? null
    }
  });
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.CREATE,
    entity: "BloodRequest",
    entityId: bloodRequest.id,
    details: {
      bloodGroup: bloodRequest.bloodGroup,
      units: bloodRequest.units,
      urgency: bloodRequest.urgency,
      message: "Blood request created by recipient"
    }
  });
  return bloodRequest;
};
var getAllBloodRequests = async (page, limit, status, bloodGroup, sortBy = "createdAt", sortOrder = "desc") => {
  const skip = (page - 1) * limit;
  const where = {
    deletedAt: null,
    ...status ? { status } : {},
    ...bloodGroup ? { bloodGroup } : {}
  };
  const [requests, total] = await Promise.all([
    prisma.bloodRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder
      },
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true
          }
        }
      }
    }),
    prisma.bloodRequest.count({
      where
    })
  ]);
  return {
    data: requests,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var getBloodRequestById = async (id) => {
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id,
      deletedAt: null
    },
    include: {
      recipient: {
        select: {
          id: true,
          name: true,
          phone: true,
          location: true
        }
      }
    }
  });
  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }
  return bloodRequest;
};
var updateBloodRequest = async (id, recipientId, payload) => {
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: {
      id
    }
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
      id
    },
    data: {
      ...payload.bloodGroup !== void 0 && {
        bloodGroup: payload.bloodGroup
      },
      ...payload.units !== void 0 && {
        units: payload.units
      },
      ...payload.hospitalName !== void 0 && {
        hospitalName: payload.hospitalName
      },
      ...payload.hospitalAddress !== void 0 && {
        hospitalAddress: payload.hospitalAddress
      },
      ...payload.requiredDate !== void 0 && {
        requiredDate: payload.requiredDate
      },
      ...payload.urgency !== void 0 && {
        urgency: payload.urgency
      },
      ...payload.contactNumber !== void 0 && {
        contactNumber: payload.contactNumber
      },
      ...payload.patientName !== void 0 && {
        patientName: payload.patientName
      },
      ...payload.notes !== void 0 && {
        notes: payload.notes
      }
    }
  });
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.UPDATE,
    entity: "BloodRequest",
    entityId: updatedBloodRequest.id,
    details: {
      message: "Blood request updated by recipient",
      updatedFields: Object.keys(payload)
    }
  });
  return updatedBloodRequest;
};
var deleteBloodRequest = async (id, recipientId) => {
  const bloodRequest = await prisma.bloodRequest.findUnique({
    where: {
      id
    }
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
      id
    },
    data: {
      deletedAt: /* @__PURE__ */ new Date()
    }
  });
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.DELETE,
    entity: "BloodRequest",
    entityId: deletedBloodRequest.id,
    details: {
      message: "Blood request deleted by recipient"
    }
  });
  return deletedBloodRequest;
};
var searchBloodRequests = async (searchTerm, page, limit) => {
  const skip = (page - 1) * limit;
  const where = {
    deletedAt: null,
    OR: [
      {
        hospitalName: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        hospitalAddress: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        patientName: {
          contains: searchTerm,
          mode: "insensitive"
        }
      },
      {
        notes: {
          contains: searchTerm,
          mode: "insensitive"
        }
      }
    ]
  };
  const [requests, total] = await Promise.all([
    prisma.bloodRequest.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
      },
      include: {
        recipient: {
          select: {
            id: true,
            name: true,
            phone: true,
            location: true
          }
        }
      }
    }),
    prisma.bloodRequest.count({
      where
    })
  ]);
  return {
    data: requests,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
};
var verifyBloodRequest = async (bloodRequestId, adminId) => {
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: bloodRequestId,
      deletedAt: null
    }
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
      id: bloodRequestId
    },
    data: {
      verificationStatus: "VERIFIED",
      verifiedAt: /* @__PURE__ */ new Date(),
      verifiedBy: adminId,
      rejectionReason: null
    }
  });
  await createAuditLog({
    userId: adminId,
    action: AuditAction.APPROVE,
    entity: "BloodRequest",
    entityId: bloodRequestId,
    details: {
      verificationStatus: "VERIFIED",
      message: "Blood request verified by admin"
    }
  });
  return updatedBloodRequest;
};
var rejectBloodRequest = async (bloodRequestId, adminId, rejectionReason) => {
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: bloodRequestId,
      deletedAt: null
    }
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
      id: bloodRequestId
    },
    data: {
      verificationStatus: "REJECTED",
      rejectionReason,
      verifiedAt: /* @__PURE__ */ new Date(),
      verifiedBy: adminId
    }
  });
  await createAuditLog({
    userId: adminId,
    action: AuditAction.REJECT,
    entity: "BloodRequest",
    entityId: bloodRequestId,
    details: {
      verificationStatus: "REJECTED",
      rejectionReason,
      message: "Blood request rejected by admin"
    }
  });
  return updatedBloodRequest;
};
var BloodRequestService = {
  createBloodRequest,
  getAllBloodRequests,
  getBloodRequestById,
  updateBloodRequest,
  deleteBloodRequest,
  searchBloodRequests,
  verifyBloodRequest,
  rejectBloodRequest
};

// src/modules/bloodRequest/bloodRequest.controller.ts
var createBloodRequest2 = catchAsync(
  async (req, res) => {
    const recipientId = req.user?.id;
    if (!recipientId) {
      throw new Error("User not found");
    }
    const payload = bloodRequestValidation.CreateBloodRequestZodSchema.safeParse(
      req.body
    );
    if (!payload.success) {
      const errorMessage = payload.error.issues.map((issue) => issue.message).join(", ");
      throw new Error(errorMessage);
    }
    const result = await BloodRequestService.createBloodRequest(
      recipientId,
      payload.data
    );
    sendResponse(res, {
      statusCode: import_http_status6.default.CREATED,
      success: true,
      message: "Blood request created successfully",
      data: result
    });
  }
);
var getAllBloodRequests2 = catchAsync(
  async (req, res) => {
    const query = req.query;
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ? String(query.sortBy) : "createdAt";
    const sortOrder = query.sortOrder ? String(query.sortOrder) : "desc";
    const status = typeof query.status === "string" ? query.status : void 0;
    const bloodGroup = typeof query.bloodGroup === "string" ? query.bloodGroup : void 0;
    const result = await BloodRequestService.getAllBloodRequests(
      page,
      limit,
      status,
      bloodGroup,
      sortBy,
      sortOrder
    );
    sendResponse(res, {
      statusCode: import_http_status6.default.OK,
      success: true,
      message: "Blood requests retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var getBloodRequestById2 = catchAsync(
  async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!id) {
      throw new Error("Blood request ID is required");
    }
    const result = await BloodRequestService.getBloodRequestById(id);
    sendResponse(res, {
      statusCode: import_http_status6.default.OK,
      success: true,
      message: "Blood request retrieved successfully",
      data: result
    });
  }
);
var updateBloodRequest2 = catchAsync(
  async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const recipientId = req.user?.id;
    if (!id) {
      throw new Error("Blood request ID is required");
    }
    if (!recipientId) {
      throw new Error("User not found");
    }
    const result = await BloodRequestService.updateBloodRequest(
      id,
      recipientId,
      req.body
    );
    sendResponse(res, {
      statusCode: import_http_status6.default.OK,
      success: true,
      message: "Blood request updated successfully",
      data: result
    });
  }
);
var deleteBloodRequest2 = catchAsync(
  async (req, res) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const recipientId = req.user?.id;
    if (!id) {
      throw new Error("Blood request ID is required");
    }
    if (!recipientId) {
      throw new Error("User not found");
    }
    const result = await BloodRequestService.deleteBloodRequest(
      id,
      recipientId
    );
    sendResponse(res, {
      statusCode: import_http_status6.default.OK,
      success: true,
      message: "Blood request deleted successfully",
      data: result
    });
  }
);
var searchBloodRequests2 = catchAsync(
  async (req, res) => {
    const searchTerm = typeof req.query.q === "string" ? req.query.q : "";
    if (!searchTerm) {
      throw new Error("Search keyword is required");
    }
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const result = await BloodRequestService.searchBloodRequests(
      searchTerm,
      page,
      limit
    );
    sendResponse(res, {
      statusCode: import_http_status6.default.OK,
      success: true,
      message: "Blood requests search results retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var verifyBloodRequest2 = catchAsync(
  async (req, res) => {
    const adminId = req.user?.id;
    if (!adminId) {
      throw new Error("Admin authentication required");
    }
    const bloodRequestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!bloodRequestId) {
      throw new Error("Blood request ID is required");
    }
    const result = await BloodRequestService.verifyBloodRequest(
      bloodRequestId,
      adminId
    );
    sendResponse(res, {
      success: true,
      statusCode: import_http_status6.default.OK,
      message: "Blood request verified successfully",
      data: result
    });
  }
);
var rejectBloodRequest2 = catchAsync(
  async (req, res) => {
    const adminId = req.user?.id;
    if (!adminId) {
      throw new Error("Admin authentication required");
    }
    const bloodRequestId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!bloodRequestId) {
      throw new Error("Blood request ID is required");
    }
    const { rejectionReason } = req.body;
    const result = await BloodRequestService.rejectBloodRequest(
      bloodRequestId,
      adminId,
      rejectionReason
    );
    sendResponse(res, {
      success: true,
      statusCode: import_http_status6.default.OK,
      message: "Blood request rejected successfully",
      data: result
    });
  }
);
var BloodRequestController = {
  createBloodRequest: createBloodRequest2,
  getAllBloodRequests: getAllBloodRequests2,
  getBloodRequestById: getBloodRequestById2,
  updateBloodRequest: updateBloodRequest2,
  deleteBloodRequest: deleteBloodRequest2,
  searchBloodRequests: searchBloodRequests2,
  verifyBloodRequest: verifyBloodRequest2,
  rejectBloodRequest: rejectBloodRequest2
};

// src/modules/bloodRequest/bloodRequest.route.ts
var router3 = (0, import_express3.Router)();
router3.post(
  "/",
  auth(Role.RECIPIENT),
  validateRequest(
    bloodRequestValidation.CreateBloodRequestZodSchema
  ),
  BloodRequestController.createBloodRequest
);
router3.get(
  "/",
  auth(Role.ADMIN, Role.DONOR, Role.RECIPIENT),
  BloodRequestController.getAllBloodRequests
);
router3.get(
  "/search",
  auth(Role.ADMIN, Role.DONOR, Role.RECIPIENT),
  BloodRequestController.searchBloodRequests
);
router3.patch(
  "/:id/verify",
  auth(Role.ADMIN),
  BloodRequestController.verifyBloodRequest
);
router3.patch(
  "/:id/reject",
  auth(Role.ADMIN),
  validateRequest(
    bloodRequestValidation.RejectBloodRequestZodSchema
  ),
  BloodRequestController.rejectBloodRequest
);
router3.get(
  "/:id",
  auth(Role.ADMIN, Role.DONOR, Role.RECIPIENT),
  BloodRequestController.getBloodRequestById
);
router3.patch(
  "/:id",
  auth(Role.RECIPIENT),
  validateRequest(
    bloodRequestValidation.UpdateBloodRequestZodSchema
  ),
  BloodRequestController.updateBloodRequest
);
router3.delete(
  "/:id",
  auth(Role.RECIPIENT),
  BloodRequestController.deleteBloodRequest
);
var BloodRequestRoutes = router3;

// src/modules/donation/donation.route.ts
var import_express4 = require("express");

// src/modules/donation/donation.controller.ts
var import_http_status7 = __toESM(require("http-status"));

// src/modules/donation/donation.service.ts
var createDonation = async (donorUserId, payload) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId: donorUserId
    }
  });
  if (!donor) {
    throw new Error("Donor profile not found");
  }
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: payload.bloodRequestId,
      deletedAt: null
    }
  });
  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }
  if (bloodRequest.status !== "PENDING") {
    throw new Error(
      "Donation cannot be created for this blood request"
    );
  }
  if (!donor.isAvailable) {
    throw new Error("Donor is currently unavailable");
  }
  const existingDonation = await prisma.donation.findUnique({
    where: {
      donorId_bloodRequestId: {
        donorId: donor.id,
        bloodRequestId: payload.bloodRequestId
      }
    }
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
      status: DonationStatus.PENDING
    }
  });
  await createAuditLog({
    userId: donorUserId,
    action: AuditAction.CREATE,
    entity: "Donation",
    entityId: donation.id,
    details: {
      bloodRequestId: payload.bloodRequestId,
      units: donation.units,
      message: "Donation request created by donor"
    }
  });
  return donation;
};
var getMyDonations = async (donorUserId, page = 1, limit = 10) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId: donorUserId
    }
  });
  if (!donor) {
    throw new Error("Donor profile not found");
  }
  const skip = (page - 1) * limit;
  const [donations, total] = await prisma.$transaction([
    prisma.donation.findMany({
      where: {
        donorId: donor.id
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
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
            patientName: true
          }
        }
      }
    }),
    prisma.donation.count({
      where: {
        donorId: donor.id
      }
    })
  ]);
  return {
    data: donations,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  };
};
var approveDonation = async (donationId, recipientId) => {
  const updatedDonation = await prisma.$transaction(
    async (tx) => {
      const donation = await tx.donation.findUnique({
        where: {
          id: donationId
        },
        include: {
          bloodRequest: true
        }
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
      await tx.$queryRaw`
        SELECT id
        FROM "BloodRequest"
        WHERE id = ${donation.bloodRequestId}
        FOR UPDATE
      `;
      const acceptedDonations = await tx.donation.aggregate({
        where: {
          bloodRequestId: donation.bloodRequestId,
          status: DonationStatus.ACCEPTED
        },
        _sum: {
          units: true
        }
      });
      const acceptedUnits = acceptedDonations._sum.units ?? 0;
      const totalUnits = acceptedUnits + donation.units;
      if (totalUnits > donation.bloodRequest.units) {
        throw new Error(
          `Only ${donation.bloodRequest.units - acceptedUnits} unit(s) are still required`
        );
      }
      const approvedDonation = await tx.donation.update({
        where: {
          id: donationId
        },
        data: {
          status: DonationStatus.ACCEPTED,
          donationDate: /* @__PURE__ */ new Date()
        }
      });
      if (totalUnits >= donation.bloodRequest.units) {
        await tx.bloodRequest.update({
          where: {
            id: donation.bloodRequestId
          },
          data: {
            status: BloodRequestStatus.FULFILLED
          }
        });
      }
      return approvedDonation;
    },
    {
      timeout: 1e4,
      maxWait: 1e4
    }
  );
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.APPROVE,
    entity: "Donation",
    entityId: donationId,
    details: {
      bloodRequestId: updatedDonation.bloodRequestId,
      units: updatedDonation.units,
      message: "Donation approved by recipient"
    }
  });
  return updatedDonation;
};
var rejectDonation = async (donationId, recipientId) => {
  const updatedDonation = await prisma.$transaction(
    async (tx) => {
      const donation = await tx.donation.findUnique({
        where: {
          id: donationId
        },
        include: {
          bloodRequest: true
        }
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
      if (donation.bloodRequest.status !== "PENDING") {
        throw new Error(
          "This blood request is no longer active"
        );
      }
      const rejectedDonation = await tx.donation.update({
        where: {
          id: donationId
        },
        data: {
          status: DonationStatus.REJECTED
        }
      });
      return rejectedDonation;
    },
    {
      timeout: 1e4,
      maxWait: 1e4
    }
  );
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.REJECT,
    entity: "Donation",
    entityId: donationId,
    details: {
      message: "Donation rejected by recipient",
      bloodRequestId: updatedDonation.bloodRequestId,
      units: updatedDonation.units
    }
  });
  return updatedDonation;
};
var DonationService = {
  createDonation,
  getMyDonations,
  approveDonation,
  rejectDonation
};

// src/modules/donation/donation.controller.ts
var createDonation2 = catchAsync(
  async (req, res) => {
    const donorUserId = req.user?.id;
    if (!donorUserId) {
      throw new Error("User not found");
    }
    const result = await DonationService.createDonation(
      donorUserId,
      req.body
    );
    sendResponse(res, {
      statusCode: import_http_status7.default.CREATED,
      success: true,
      message: "Donation request created successfully",
      data: result
    });
  }
);
var getMyDonations2 = catchAsync(
  async (req, res) => {
    const donorUserId = req.user?.id;
    if (!donorUserId) {
      throw new Error("User not found");
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const result = await DonationService.getMyDonations(
      donorUserId,
      page,
      limit
    );
    sendResponse(res, {
      statusCode: import_http_status7.default.OK,
      success: true,
      message: "My donations retrieved successfully",
      data: result
    });
  }
);
var approveDonation2 = catchAsync(
  async (req, res) => {
    const recipientId = req.user?.id;
    if (!recipientId) {
      throw new Error("User not found");
    }
    const donationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!donationId) {
      throw new Error("Donation ID is required");
    }
    const result = await DonationService.approveDonation(
      donationId,
      recipientId
    );
    sendResponse(res, {
      statusCode: import_http_status7.default.OK,
      success: true,
      message: "Donation approved successfully",
      data: result
    });
  }
);
var rejectDonation2 = catchAsync(
  async (req, res) => {
    const recipientId = req.user?.id;
    if (!recipientId) {
      throw new Error("User not found");
    }
    const donationId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    if (!donationId) {
      throw new Error("Donation ID is required");
    }
    const result = await DonationService.rejectDonation(
      donationId,
      recipientId
    );
    sendResponse(res, {
      statusCode: import_http_status7.default.OK,
      success: true,
      message: "Donation rejected successfully",
      data: result
    });
  }
);
var DonationController = {
  createDonation: createDonation2,
  getMyDonations: getMyDonations2,
  approveDonation: approveDonation2,
  rejectDonation: rejectDonation2
};

// src/modules/donation/donation.validation.ts
var import_zod4 = require("zod");
var CreateDonationZodSchema = import_zod4.z.object({
  bloodRequestId: import_zod4.z.string().uuid("Invalid blood request ID"),
  units: import_zod4.z.number().int("Units must be an integer").positive("Units must be greater than 0").max(10, "Units cannot be more than 10").default(1),
  notes: import_zod4.z.string().max(500, "Notes cannot exceed 500 characters").optional()
});
var donationValidation = {
  CreateDonationZodSchema
};

// src/modules/donation/donation.route.ts
var router4 = (0, import_express4.Router)();
router4.post(
  "/",
  auth(Role.DONOR),
  validateRequest(
    donationValidation.CreateDonationZodSchema
  ),
  DonationController.createDonation
);
router4.get(
  "/my",
  auth(Role.DONOR),
  DonationController.getMyDonations
);
router4.patch(
  "/:id/approve",
  auth(Role.RECIPIENT),
  DonationController.approveDonation
);
router4.patch(
  "/:id/reject",
  auth(Role.RECIPIENT),
  DonationController.rejectDonation
);
var DonationRoutes = router4;

// src/modules/payment/payment.route.ts
var import_express5 = require("express");

// src/modules/payment/payment.controller.ts
var import_http_status9 = __toESM(require("http-status"));

// src/modules/payment/payment.service.ts
var import_http_status8 = __toESM(require("http-status"));

// src/lib/bkash.ts
var ID_TOKEN_KEY = "bloodlink:bkash:idToken";
var REFRESH_TOKEN_KEY = "bloodlink:bkash:refreshToken";
var getBkashIdToken = async () => {
  try {
    const bkashIdToken = await redisClient.get(ID_TOKEN_KEY);
    const bkashIdTokenTTL = await redisClient.ttl(ID_TOKEN_KEY);
    const bkashRefreshToken = await redisClient.get(REFRESH_TOKEN_KEY);
    const bkashRefreshTokenTTL = await redisClient.ttl(REFRESH_TOKEN_KEY);
    if (bkashIdToken && bkashIdTokenTTL > 600) {
      return bkashIdToken;
    }
    if (bkashRefreshToken && bkashRefreshTokenTTL > 600) {
      const refreshResponse = await fetch(
        `${config_default.bkash_base_url}/tokenized/checkout/token/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            username: config_default.bkash_username,
            password: config_default.bkash_password
          },
          body: JSON.stringify({
            app_key: config_default.bkash_app_key,
            app_secret: config_default.bkash_app_secret,
            refresh_token: bkashRefreshToken
          })
        }
      );
      const refreshResult = await refreshResponse.json();
      if (!refreshResponse.ok) {
        throw new Error(
          refreshResult.errorMessage || "bKash token refresh failed"
        );
      }
      if (!refreshResult.id_token) {
        throw new Error(
          "Invalid bKash refresh token response"
        );
      }
      await redisClient.set(
        ID_TOKEN_KEY,
        refreshResult.id_token,
        {
          expiration: {
            type: "EX",
            value: 60 * 60
          }
        }
      );
      return refreshResult.id_token;
    }
    const response = await fetch(
      `${config_default.bkash_base_url}/tokenized/checkout/token/grant`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          username: config_default.bkash_username,
          password: config_default.bkash_password
        },
        body: JSON.stringify({
          app_key: config_default.bkash_app_key,
          app_secret: config_default.bkash_app_secret
        })
      }
    );
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        result.errorMessage || "bKash token grant failed"
      );
    }
    if (!result.id_token || !result.refresh_token) {
      throw new Error(
        "Invalid bKash token response"
      );
    }
    await redisClient.set(
      ID_TOKEN_KEY,
      result.id_token,
      {
        expiration: {
          type: "EX",
          value: 60 * 60
        }
      }
    );
    await redisClient.set(
      REFRESH_TOKEN_KEY,
      result.refresh_token,
      {
        expiration: {
          type: "EX",
          value: 60 * 60 * 24 * 28
        }
      }
    );
    return result.id_token;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("bKash authentication failed");
  }
};

// src/utils/appError.ts
var AppError = class extends Error {
  statusCode;
  constructor(statusCode, message, stack = "") {
    super(message);
    this.statusCode = statusCode;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
};

// src/lib/cloudinaryUpload.ts
var import_streamifier = __toESM(require("streamifier"));

// src/lib/cloudinary.ts
var import_cloudinary = require("cloudinary");
import_cloudinary.v2.config({
  cloud_name: config_default.cloudinary_cloud_name,
  api_key: config_default.cloudinary_api_key,
  api_secret: config_default.cloudinary_api_secret
});
var cloudinary_default = import_cloudinary.v2;

// src/lib/cloudinaryUpload.ts
var uploadToCloudinary = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary_default.uploader.upload_stream(
      {
        folder,
        resource_type: "auto"
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }
        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }
        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id
        });
      }
    );
    import_streamifier.default.createReadStream(buffer).pipe(uploadStream);
  });
};

// src/utils/generatePaymentReceipt.ts
var import_pdfkit = __toESM(require("pdfkit"));
var generatePaymentReceipt = (data) => {
  return new Promise((resolve, reject) => {
    const doc = new import_pdfkit.default({
      size: "A4",
      margin: 50
    });
    const chunks = [];
    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
    doc.on("error", (error) => {
      reject(error);
    });
    doc.fontSize(22).font("Helvetica-Bold").text("BloodLink Payment Receipt", {
      align: "center"
    });
    doc.moveDown(2);
    doc.fontSize(12).font("Helvetica");
    doc.text(`Payment ID: ${data.paymentId}`);
    doc.moveDown(0.5);
    doc.text(`Transaction ID: ${data.transactionId}`);
    doc.moveDown(0.5);
    doc.text(`Blood Request ID: ${data.bloodRequestId}`);
    doc.moveDown(0.5);
    doc.text(`Amount: ${data.amount} ${data.currency}`);
    doc.moveDown(0.5);
    doc.text(`Payment Method: ${data.method}`);
    doc.moveDown(0.5);
    doc.text(
      `Paid At: ${data.paidAt.toISOString()}`
    );
    doc.moveDown(2);
    doc.fontSize(14).font("Helvetica-Bold").text("Payment Status: PAID", {
      align: "center"
    });
    doc.moveDown(2);
    doc.fontSize(10).font("Helvetica").text(
      "Thank you for using BloodLink.",
      {
        align: "center"
      }
    );
    doc.end();
  });
};

// src/modules/payment/payment.service.ts
var createBkashPayment = async (payload) => {
  const bkashIdToken = await getBkashIdToken();
  if (!bkashIdToken) {
    throw new AppError(
      import_http_status8.default.BAD_GATEWAY,
      "No bKash Access Token Found"
    );
  }
  const response = await fetch(
    `${config_default.bkash_base_url}/tokenized/checkout/create`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config_default.bkash_app_key
      },
      body: JSON.stringify(payload)
    }
  );
  const result = await response.json();
  console.log(
    "bKash Create Status:",
    response.status
  );
  console.log(
    "bKash Create Response:",
    result
  );
  if (!response.ok) {
    throw new AppError(
      import_http_status8.default.BAD_GATEWAY,
      result.statusMessage || "bKash Payment Creation Failed"
    );
  }
  if (!result.paymentID || !result.bkashURL) {
    throw new AppError(
      import_http_status8.default.BAD_GATEWAY,
      "Invalid bKash Payment Response"
    );
  }
  return result;
};
var initiatePayment = async (recipientId, payload) => {
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: payload.bloodRequestId,
      recipientId,
      deletedAt: null
    }
  });
  if (!bloodRequest) {
    throw new AppError(
      import_http_status8.default.NOT_FOUND,
      "Blood Request Not Found"
    );
  }
  if (bloodRequest.verificationStatus !== VerificationStatus.VERIFIED) {
    throw new AppError(
      import_http_status8.default.BAD_REQUEST,
      "Blood Request Must Be Verified Before Payment"
    );
  }
  if (bloodRequest.status !== "PENDING") {
    throw new AppError(
      import_http_status8.default.BAD_REQUEST,
      "Payment Cannot Be Initiated For This Blood Request"
    );
  }
  const existingPayment = await prisma.payment.findUnique({
    where: {
      bloodRequestId: bloodRequest.id
    }
  });
  if (existingPayment && (existingPayment.status === PaymentStatus.PENDING || existingPayment.status === PaymentStatus.PAID)) {
    throw new AppError(
      import_http_status8.default.BAD_REQUEST,
      `Payment is already ${existingPayment.status.toLowerCase()} for this blood request`
    );
  }
  const amount = bloodRequest.units * 100;
  const bkashPayload = {
    mode: "0011",
    payerReference: recipientId,
    callbackURL: config_default.bkash_callback_url,
    amount: amount.toString(),
    currency: "BDT",
    intent: "sale",
    merchantInvoiceNumber: `BL-${bloodRequest.id}`
  };
  const bkashPayment = await createBkashPayment(bkashPayload);
  if (!bkashPayment.paymentID) {
    throw new AppError(
      import_http_status8.default.BAD_GATEWAY,
      "bKash Payment ID Not Found"
    );
  }
  if (!bkashPayment.bkashURL) {
    throw new AppError(
      import_http_status8.default.BAD_GATEWAY,
      "bKash Payment URL Not Found"
    );
  }
  const payment = await prisma.$transaction(
    async (tx) => {
      const currentPayment = await tx.payment.findUnique({
        where: {
          bloodRequestId: bloodRequest.id
        }
      });
      if (!currentPayment) {
        return tx.payment.create({
          data: {
            bloodRequestId: bloodRequest.id,
            amount,
            currency: "BDT",
            method: PaymentMethod.BKASH,
            status: PaymentStatus.PENDING,
            bkashPaymentId: bkashPayment.paymentID,
            gatewayResponse: JSON.parse(
              JSON.stringify(bkashPayment)
            )
          }
        });
      }
      if (currentPayment.status === PaymentStatus.PENDING) {
        throw new AppError(
          import_http_status8.default.BAD_REQUEST,
          "Payment is already pending for this blood request"
        );
      }
      if (currentPayment.status === PaymentStatus.PAID) {
        throw new AppError(
          import_http_status8.default.BAD_REQUEST,
          "Payment is already completed for this blood request"
        );
      }
      if (currentPayment.status === PaymentStatus.FAILED || currentPayment.status === PaymentStatus.CANCELLED) {
        return tx.payment.update({
          where: {
            id: currentPayment.id
          },
          data: {
            amount,
            currency: "BDT",
            method: PaymentMethod.BKASH,
            status: PaymentStatus.PENDING,
            // New bKash payment ID
            bkashPaymentId: bkashPayment.paymentID,
            // Reset previous transaction data
            transactionId: null,
            paidAt: null,
            // Save new bKash response
            gatewayResponse: JSON.parse(
              JSON.stringify(bkashPayment)
            )
          }
        });
      }
      throw new AppError(
        import_http_status8.default.BAD_REQUEST,
        "Payment cannot be retried in its current status"
      );
    },
    {
      timeout: 1e4,
      maxWait: 1e4
    }
  );
  await createAuditLog({
    userId: recipientId,
    action: AuditAction.PAYMENT,
    entity: "Payment",
    entityId: payment.id,
    details: {
      bloodRequestId: payment.bloodRequestId,
      amount: payment.amount.toString(),
      currency: payment.currency,
      method: payment.method,
      status: payment.status,
      bkashPaymentId: payment.bkashPaymentId,
      message: "bKash payment initiated/retried by recipient"
    }
  });
  return {
    payment,
    paymentID: bkashPayment.paymentID,
    paymentUrl: bkashPayment.bkashURL
  };
};
var executeBkashPayment = async (paymentID) => {
  const bkashIdToken = await getBkashIdToken();
  if (!bkashIdToken) {
    throw new AppError(
      import_http_status8.default.BAD_GATEWAY,
      "No bKash Access Token Found"
    );
  }
  const executeUrl = `${config_default.bkash_base_url}/tokenized/checkout/execute`;
  console.log(
    "bKash Execute URL:",
    executeUrl
  );
  console.log(
    "bKash Payment ID:",
    paymentID
  );
  const response = await fetch(
    executeUrl,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: bkashIdToken,
        "X-App-Key": config_default.bkash_app_key
      },
      body: JSON.stringify({
        paymentID
      })
    }
  );
  const result = await response.json();
  console.log(
    "bKash Execute Status:",
    response.status
  );
  console.log(
    "bKash Execute Response:",
    result
  );
  if (!response.ok) {
    throw new AppError(
      import_http_status8.default.BAD_GATEWAY,
      result.statusMessage || "bKash Payment Execution Failed"
    );
  }
  const payment = await prisma.payment.findUnique({
    where: {
      bkashPaymentId: paymentID
    },
    include: {
      bloodRequest: {
        select: {
          id: true,
          recipientId: true
        }
      }
    }
  });
  if (!payment) {
    throw new AppError(
      import_http_status8.default.NOT_FOUND,
      "Payment Record Not Found"
    );
  }
  if (payment.status === PaymentStatus.PAID) {
    return payment;
  }
  if (result.transactionStatus === "Completed" && result.trxID) {
    const updatedPayment = await prisma.payment.update({
      where: {
        id: payment.id
      },
      data: {
        status: PaymentStatus.PAID,
        transactionId: result.trxID,
        paidAt: /* @__PURE__ */ new Date(),
        gatewayResponse: JSON.parse(
          JSON.stringify(result)
        )
      }
    });
    const receiptPdf = await generatePaymentReceipt({
      paymentId: updatedPayment.id,
      transactionId: result.trxID,
      amount: updatedPayment.amount.toString(),
      currency: updatedPayment.currency,
      method: updatedPayment.method,
      paidAt: updatedPayment.paidAt,
      bloodRequestId: updatedPayment.bloodRequestId
    });
    const uploadedReceipt = await uploadToCloudinary(
      receiptPdf,
      "bloodlink/payment-receipts"
    );
    const paymentWithReceipt = await prisma.payment.update({
      where: {
        id: updatedPayment.id
      },
      data: {
        receiptPdfUrl: uploadedReceipt.secure_url
      }
    });
    await createAuditLog({
      userId: payment.bloodRequest.recipientId,
      action: AuditAction.PAYMENT,
      entity: "Payment",
      entityId: paymentWithReceipt.id,
      details: {
        bloodRequestId: paymentWithReceipt.bloodRequestId,
        amount: paymentWithReceipt.amount.toString(),
        currency: paymentWithReceipt.currency,
        method: paymentWithReceipt.method,
        status: paymentWithReceipt.status,
        transactionId: paymentWithReceipt.transactionId,
        receiptPdfUrl: paymentWithReceipt.receiptPdfUrl,
        message: "Payment completed and receipt PDF uploaded successfully"
      }
    });
    return paymentWithReceipt;
  }
  return result;
};
var bkashCallback = async (query) => {
  const paymentID = query.paymentID;
  const status = query.status;
  if (!paymentID) {
    throw new AppError(
      import_http_status8.default.BAD_REQUEST,
      "Payment ID Missing"
    );
  }
  if (!status) {
    throw new AppError(
      import_http_status8.default.BAD_REQUEST,
      "Payment Status Missing"
    );
  }
  const payment = await prisma.payment.findUnique({
    where: {
      bkashPaymentId: paymentID
    },
    include: {
      bloodRequest: {
        select: {
          id: true,
          recipientId: true
        }
      }
    }
  });
  if (!payment) {
    throw new AppError(
      import_http_status8.default.NOT_FOUND,
      "Payment Not Found"
    );
  }
  if (status === "cancel") {
    const updatedPayment = await prisma.payment.update({
      where: {
        id: payment.id
      },
      data: {
        status: PaymentStatus.CANCELLED,
        gatewayResponse: {
          callbackStatus: status,
          paymentID
        }
      }
    });
    await createAuditLog({
      userId: payment.bloodRequest.recipientId,
      action: AuditAction.PAYMENT,
      entity: "Payment",
      entityId: updatedPayment.id,
      details: {
        bloodRequestId: updatedPayment.bloodRequestId,
        amount: updatedPayment.amount.toString(),
        currency: updatedPayment.currency,
        method: updatedPayment.method,
        status: updatedPayment.status,
        message: "Payment cancelled by user"
      }
    });
    return {
      payment: updatedPayment,
      status: "cancel",
      message: "Payment Cancelled"
    };
  }
  if (status === "failure") {
    const updatedPayment = await prisma.payment.update({
      where: {
        id: payment.id
      },
      data: {
        status: PaymentStatus.FAILED,
        gatewayResponse: {
          callbackStatus: status,
          paymentID
        }
      }
    });
    await createAuditLog({
      userId: payment.bloodRequest.recipientId,
      action: AuditAction.PAYMENT,
      entity: "Payment",
      entityId: updatedPayment.id,
      details: {
        bloodRequestId: updatedPayment.bloodRequestId,
        amount: updatedPayment.amount.toString(),
        currency: updatedPayment.currency,
        method: updatedPayment.method,
        status: updatedPayment.status,
        message: "Payment failed"
      }
    });
    return {
      payment: updatedPayment,
      status: "failure",
      message: "Payment Failed"
    };
  }
  if (status === "success") {
    const executeResult = await executeBkashPayment(
      paymentID
    );
    return {
      payment: executeResult,
      status: "success",
      message: "Payment Completed Successfully"
    };
  }
  throw new AppError(
    import_http_status8.default.BAD_REQUEST,
    "Unknown Payment Status"
  );
};
var getMyPayments = async (query, recipientId) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const andConditions = [
    {
      bloodRequest: {
        recipientId,
        deletedAt: null
      }
    }
  ];
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  if (query.method) {
    andConditions.push({
      method: query.method
    });
  }
  const payments = await prisma.payment.findMany({
    where: {
      AND: andConditions
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
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
          status: true
        }
      }
    }
  });
  const total = await prisma.payment.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      )
    }
  };
};
var getAllPayments = async (query) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;
  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";
  const andConditions = [];
  if (query.recipientEmail) {
    andConditions.push({
      bloodRequest: {
        recipient: {
          email: query.recipientEmail
        }
      }
    });
  }
  if (query.status) {
    andConditions.push({
      status: query.status
    });
  }
  if (query.method) {
    andConditions.push({
      method: query.method
    });
  }
  const payments = await prisma.payment.findMany({
    where: {
      AND: andConditions
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder
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
          recipient: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      }
    }
  });
  const total = await prisma.payment.count({
    where: {
      AND: andConditions
    }
  });
  return {
    data: payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(
        total / limit
      )
    }
  };
};
var getSinglePayment = async (paymentId, user) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId
    },
    include: {
      bloodRequest: {
        include: {
          recipient: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        }
      }
    }
  });
  if (!payment) {
    throw new AppError(
      import_http_status8.default.NOT_FOUND,
      "Payment Not Found"
    );
  }
  if (user.role === Role.RECIPIENT) {
    if (payment.bloodRequest.recipientId !== user.id) {
      throw new AppError(
        import_http_status8.default.FORBIDDEN,
        "You Are Not Allowed To View This Payment"
      );
    }
  }
  return payment;
};
var uploadPaymentReceipt = async (paymentId, file, userId) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId
    },
    include: {
      bloodRequest: {
        select: {
          recipientId: true
        }
      }
    }
  });
  if (!payment) {
    throw new AppError(
      import_http_status8.default.NOT_FOUND,
      "Payment Not Found"
    );
  }
  if (payment.bloodRequest.recipientId !== userId) {
    throw new AppError(
      import_http_status8.default.FORBIDDEN,
      "You Are Not Allowed To Upload Receipt For This Payment"
    );
  }
  if (payment.status !== PaymentStatus.PAID) {
    throw new AppError(
      import_http_status8.default.BAD_REQUEST,
      "Payment Must Be Completed Before Uploading Receipt"
    );
  }
  if (!file) {
    throw new AppError(
      import_http_status8.default.BAD_REQUEST,
      "Payment Receipt PDF Is Required"
    );
  }
  if (file.mimetype !== "application/pdf") {
    throw new AppError(
      import_http_status8.default.BAD_REQUEST,
      "Only PDF Files Are Allowed"
    );
  }
  const uploadedFile = await uploadToCloudinary(
    file.buffer,
    "bloodlink/payment-receipts"
  );
  const updatedPayment = await prisma.payment.update({
    where: {
      id: payment.id
    },
    data: {
      receiptPdfUrl: uploadedFile.secure_url
    }
  });
  await createAuditLog({
    userId,
    action: AuditAction.PAYMENT,
    entity: "Payment",
    entityId: payment.id,
    details: {
      paymentId: payment.id,
      receiptPdfUrl: uploadedFile.secure_url,
      message: "Payment receipt PDF uploaded successfully"
    }
  });
  return updatedPayment;
};
var PaymentService = {
  createBkashPayment,
  initiatePayment,
  executeBkashPayment,
  bkashCallback,
  uploadPaymentReceipt,
  getMyPayments,
  getAllPayments,
  getSinglePayment
};

// src/modules/payment/payment.controller.ts
var initiatePayment2 = catchAsync(
  async (req, res) => {
    const recipientId = req.user?.id;
    if (!recipientId) {
      throw new Error("User not found");
    }
    const result = await PaymentService.initiatePayment(
      recipientId,
      req.body
    );
    sendResponse(res, {
      statusCode: import_http_status9.default.CREATED,
      success: true,
      message: "Payment initiated successfully",
      data: result
    });
  }
);
var executeBkashPayment2 = catchAsync(
  async (req, res) => {
    const paymentID = req.params.paymentID;
    if (!paymentID || Array.isArray(paymentID)) {
      throw new Error("Invalid payment ID");
    }
    const result = await PaymentService.executeBkashPayment(
      paymentID
    );
    sendResponse(res, {
      statusCode: import_http_status9.default.OK,
      success: true,
      message: "Payment executed successfully",
      data: result
    });
  }
);
var bkashCallback2 = catchAsync(
  async (req, res) => {
    const paymentID = typeof req.query.paymentID === "string" ? req.query.paymentID : void 0;
    const status = typeof req.query.status === "string" ? req.query.status : void 0;
    if (!paymentID) {
      throw new Error("Payment ID missing");
    }
    if (!status) {
      throw new Error("Payment status missing");
    }
    const result = await PaymentService.bkashCallback({
      paymentID,
      status
    });
    sendResponse(res, {
      statusCode: import_http_status9.default.OK,
      success: result.status === "success",
      message: result.message,
      data: result.payment
    });
  }
);
var getMyPayments2 = catchAsync(
  async (req, res) => {
    const recipientId = req.user?.id;
    if (!recipientId) {
      throw new Error("User not found");
    }
    const result = await PaymentService.getMyPayments(
      req.query,
      recipientId
    );
    sendResponse(res, {
      statusCode: import_http_status9.default.OK,
      success: true,
      message: "My payments retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var getAllPayments2 = catchAsync(
  async (req, res) => {
    const result = await PaymentService.getAllPayments(
      req.query
    );
    sendResponse(res, {
      statusCode: import_http_status9.default.OK,
      success: true,
      message: "All payments retrieved successfully",
      data: result.data,
      meta: result.meta
    });
  }
);
var getSinglePayment2 = catchAsync(
  async (req, res) => {
    const paymentId = req.params.id;
    if (!paymentId || Array.isArray(paymentId)) {
      throw new Error("Invalid payment ID");
    }
    if (!req.user) {
      throw new Error("User not found");
    }
    const result = await PaymentService.getSinglePayment(
      paymentId,
      req.user
    );
    sendResponse(res, {
      statusCode: import_http_status9.default.OK,
      success: true,
      message: "Payment retrieved successfully",
      data: result
    });
  }
);
var PaymentController = {
  initiatePayment: initiatePayment2,
  executeBkashPayment: executeBkashPayment2,
  bkashCallback: bkashCallback2,
  getMyPayments: getMyPayments2,
  getAllPayments: getAllPayments2,
  getSinglePayment: getSinglePayment2
};

// src/modules/payment/payment.validation.ts
var import_zod5 = require("zod");
var InitiatePaymentZodSchema = import_zod5.z.object({
  bloodRequestId: import_zod5.z.string().uuid("Invalid blood request ID")
});
var paymentValidation = {
  InitiatePaymentZodSchema
};

// src/modules/payment/payment.route.ts
var router5 = (0, import_express5.Router)();
router5.post(
  "/initiate",
  auth(Role.RECIPIENT),
  validateRequest(
    paymentValidation.InitiatePaymentZodSchema
  ),
  PaymentController.initiatePayment
);
router5.post(
  "/execute/:paymentID",
  auth(Role.RECIPIENT),
  PaymentController.executeBkashPayment
);
router5.get(
  "/callback",
  PaymentController.bkashCallback
);
router5.get(
  "/my",
  auth(Role.RECIPIENT),
  PaymentController.getMyPayments
);
router5.get(
  "/all",
  auth(Role.ADMIN),
  PaymentController.getAllPayments
);
router5.get(
  "/:id",
  auth(Role.RECIPIENT, Role.ADMIN),
  PaymentController.getSinglePayment
);
var PaymentRoutes = router5;

// src/modules/donor/donor.route.ts
var import_express6 = require("express");

// src/modules/donor/donor.controller.ts
var import_http_status10 = __toESM(require("http-status"));

// src/modules/donor/donor.service.ts
var compatibleBloodGroups = {
  O_NEGATIVE: ["O_NEGATIVE"],
  O_POSITIVE: ["O_NEGATIVE", "O_POSITIVE"],
  A_NEGATIVE: ["O_NEGATIVE", "A_NEGATIVE"],
  A_POSITIVE: [
    "O_NEGATIVE",
    "O_POSITIVE",
    "A_NEGATIVE",
    "A_POSITIVE"
  ],
  B_NEGATIVE: ["O_NEGATIVE", "B_NEGATIVE"],
  B_POSITIVE: [
    "O_NEGATIVE",
    "O_POSITIVE",
    "B_NEGATIVE",
    "B_POSITIVE"
  ],
  AB_NEGATIVE: [
    "O_NEGATIVE",
    "A_NEGATIVE",
    "B_NEGATIVE",
    "AB_NEGATIVE"
  ],
  AB_POSITIVE: [
    "O_NEGATIVE",
    "O_POSITIVE",
    "A_NEGATIVE",
    "A_POSITIVE",
    "B_NEGATIVE",
    "B_POSITIVE",
    "AB_NEGATIVE",
    "AB_POSITIVE"
  ]
};
var getMyDonorProfile = async (userId) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId
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
          emailVerified: true
        }
      }
    }
  });
  if (!donor) {
    throw new Error("Donor profile not found");
  }
  return donor;
};
var matchDonors = async (bloodRequestId) => {
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: bloodRequestId,
      deletedAt: null
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
      verificationStatus: true
    }
  });
  if (!bloodRequest) {
    throw new Error("Blood request not found");
  }
  if (bloodRequest.verificationStatus !== "VERIFIED") {
    throw new Error(
      "Only verified blood requests can be matched with donors"
    );
  }
  if (bloodRequest.status !== "PENDING") {
    throw new Error(
      "Donors cannot be matched for this blood request"
    );
  }
  const compatibleGroups = compatibleBloodGroups[bloodRequest.bloodGroup];
  if (!compatibleGroups) {
    throw new Error(
      "No compatible blood groups found"
    );
  }
  const donors = await prisma.donor.findMany({
    where: {
      bloodGroup: {
        in: compatibleGroups
      },
      isAvailable: true,
      user: {
        status: "ACTIVE",
        emailVerified: true,
        deletedAt: null
      }
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
          profileImage: true
        }
      }
    },
    orderBy: {
      lastDonationDate: "asc"
    }
  });
  return {
    bloodRequest,
    compatibleBloodGroups: compatibleGroups,
    totalMatchedDonors: donors.length,
    donors
  };
};
var findNearbyDonors = async (bloodRequestId, radiusKm = 20) => {
  const bloodRequest = await prisma.bloodRequest.findFirst({
    where: {
      id: bloodRequestId,
      deletedAt: null
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
      verificationStatus: true
    }
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
  if (bloodRequest.hospitalLatitude === null || bloodRequest.hospitalLongitude === null) {
    throw new Error(
      "Hospital location coordinates are not available"
    );
  }
  const compatibleGroups = compatibleBloodGroups[bloodRequest.bloodGroup];
  const donors = await prisma.donor.findMany({
    where: {
      bloodGroup: {
        in: compatibleGroups
      },
      isAvailable: true,
      latitude: {
        not: null
      },
      longitude: {
        not: null
      },
      user: {
        status: "ACTIVE",
        emailVerified: true,
        deletedAt: null
      }
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
          profileImage: true
        }
      }
    }
  });
  const nearbyDonors = donors.map((donor) => {
    const lat1 = bloodRequest.hospitalLatitude;
    const lon1 = bloodRequest.hospitalLongitude;
    const lat2 = donor.latitude;
    const lon2 = donor.longitude;
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    const distance = 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return {
      ...donor,
      distanceKm: Number(distance.toFixed(2))
    };
  }).filter((donor) => donor.distanceKm <= radiusKm).sort((a, b) => a.distanceKm - b.distanceKm);
  return {
    bloodRequest,
    radiusKm,
    totalNearbyDonors: nearbyDonors.length,
    donors: nearbyDonors
  };
};
var updateAvailability = async (userId, isAvailable) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId
    }
  });
  if (!donor) {
    throw new Error("Donor profile not found");
  }
  const updatedDonor = await prisma.donor.update({
    where: {
      userId
    },
    data: {
      isAvailable
    },
    select: {
      id: true,
      userId: true,
      bloodGroup: true,
      isAvailable: true,
      updatedAt: true
    }
  });
  return updatedDonor;
};
var updateDonorLocation = async (userId, latitude, longitude, address) => {
  const donor = await prisma.donor.findUnique({
    where: {
      userId
    }
  });
  if (!donor) {
    throw new Error("Donor profile not found");
  }
  const updatedDonor = await prisma.donor.update({
    where: {
      userId
    },
    data: {
      latitude,
      longitude,
      ...address !== void 0 && {
        address
      }
    },
    select: {
      id: true,
      userId: true,
      bloodGroup: true,
      address: true,
      latitude: true,
      longitude: true,
      isAvailable: true,
      updatedAt: true
    }
  });
  return updatedDonor;
};
var DonorService = {
  getMyDonorProfile,
  matchDonors,
  findNearbyDonors,
  updateAvailability,
  updateDonorLocation
};

// src/modules/donor/donor.controller.ts
var getMyDonorProfile2 = catchAsync(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User not found");
    }
    const result = await DonorService.getMyDonorProfile(userId);
    sendResponse(res, {
      statusCode: import_http_status10.default.OK,
      success: true,
      message: "Donor profile retrieved successfully",
      data: result
    });
  }
);
var matchDonors2 = catchAsync(
  async (req, res) => {
    const { bloodRequestId } = req.params;
    if (!bloodRequestId || Array.isArray(bloodRequestId)) {
      throw new Error("Blood request ID is required");
    }
    const result = await DonorService.matchDonors(
      bloodRequestId
    );
    sendResponse(res, {
      statusCode: import_http_status10.default.OK,
      success: true,
      message: "Compatible donors retrieved successfully",
      data: result
    });
  }
);
var findNearbyDonors2 = catchAsync(
  async (req, res) => {
    const { bloodRequestId } = req.params;
    if (!bloodRequestId || Array.isArray(bloodRequestId)) {
      throw new Error("Blood request ID is required");
    }
    const radiusKm = req.query.radius ? Number(req.query.radius) : 20;
    if (Number.isNaN(radiusKm) || radiusKm <= 0) {
      throw new Error("Radius must be a positive number");
    }
    const result = await DonorService.findNearbyDonors(
      bloodRequestId,
      radiusKm
    );
    sendResponse(res, {
      statusCode: import_http_status10.default.OK,
      success: true,
      message: "Nearby compatible donors retrieved successfully",
      data: result
    });
  }
);
var updateAvailability2 = catchAsync(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User not found");
    }
    const { isAvailable } = req.body;
    if (typeof isAvailable !== "boolean") {
      throw new Error("isAvailable must be a boolean");
    }
    const result = await DonorService.updateAvailability(
      userId,
      isAvailable
    );
    sendResponse(res, {
      statusCode: import_http_status10.default.OK,
      success: true,
      message: "Donor availability updated successfully",
      data: result
    });
  }
);
var updateDonorLocation2 = catchAsync(
  async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new Error("User not found");
    }
    const {
      latitude,
      longitude,
      address
    } = req.body;
    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new Error(
        "Latitude and longitude must be numbers"
      );
    }
    const result = await DonorService.updateDonorLocation(
      userId,
      latitude,
      longitude,
      address
    );
    sendResponse(res, {
      statusCode: import_http_status10.default.OK,
      success: true,
      message: "Donor location updated successfully",
      data: result
    });
  }
);
var DonorController = {
  getMyDonorProfile: getMyDonorProfile2,
  matchDonors: matchDonors2,
  findNearbyDonors: findNearbyDonors2,
  updateAvailability: updateAvailability2,
  updateDonorLocation: updateDonorLocation2
};

// src/modules/donor/donor.route.ts
var router6 = (0, import_express6.Router)();
router6.get(
  "/me",
  auth(Role.DONOR),
  DonorController.getMyDonorProfile
);
router6.get(
  "/match/:bloodRequestId",
  auth(Role.RECIPIENT, Role.ADMIN),
  DonorController.matchDonors
);
router6.get(
  "/nearby/:bloodRequestId",
  auth(Role.RECIPIENT, Role.ADMIN),
  DonorController.findNearbyDonors
);
router6.patch(
  "/availability",
  auth(Role.DONOR),
  DonorController.updateAvailability
);
router6.patch(
  "/location",
  auth(Role.DONOR),
  DonorController.updateDonorLocation
);
var DonorRoutes = router6;

// src/modules/admin/admin.route.ts
var import_express7 = require("express");

// src/modules/admin/admin.contoller.ts
var import_http_status11 = __toESM(require("http-status"));

// src/modules/admin/admin.service.ts
var getAllUsers = async (page = 1, limit = 10, searchTerm, role, status) => {
  const skip = (page - 1) * limit;
  const where = {
    deletedAt: null,
    ...searchTerm && {
      OR: [
        {
          name: {
            contains: searchTerm,
            mode: "insensitive"
          }
        },
        {
          email: {
            contains: searchTerm,
            mode: "insensitive"
          }
        }
      ]
    },
    ...role && { role },
    ...status && { status }
  };
  const [users, total] = await prisma.$transaction([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc"
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
        updatedAt: true
      }
    }),
    prisma.user.count({ where })
  ]);
  return {
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  };
};
var blockUser = async (adminId, userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
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
      id: userId
    },
    data: {
      status: AccountStatus.BLOCKED
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true
    }
  });
  await createAuditLog({
    userId: adminId,
    action: AuditAction.BLOCK,
    entity: "User",
    entityId: userId,
    details: {
      message: "User blocked by admin"
    }
  });
  return updatedUser;
};
var unblockUser = async (adminId, userId) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    }
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
      id: userId
    },
    data: {
      status: AccountStatus.ACTIVE
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      updatedAt: true
    }
  });
  await createAuditLog({
    userId: adminId,
    action: AuditAction.UNBLOCK,
    entity: "User",
    entityId: userId,
    details: {
      message: "User unblocked by admin"
    }
  });
  return updatedUser;
};
var getDashboardStats = async () => {
  const [
    totalUsers,
    totalDonors,
    totalRecipients,
    totalBloodRequests,
    pendingBloodRequests,
    fulfilledBloodRequests,
    totalDonations,
    acceptedDonations,
    rejectedDonations
  ] = await prisma.$transaction([
    prisma.user.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.user.count({
      where: {
        role: "DONOR",
        deletedAt: null
      }
    }),
    prisma.user.count({
      where: {
        role: "RECIPIENT",
        deletedAt: null
      }
    }),
    prisma.bloodRequest.count({
      where: {
        deletedAt: null
      }
    }),
    prisma.bloodRequest.count({
      where: {
        status: "PENDING",
        deletedAt: null
      }
    }),
    prisma.bloodRequest.count({
      where: {
        status: "FULFILLED",
        deletedAt: null
      }
    }),
    prisma.donation.count(),
    prisma.donation.count({
      where: {
        status: "ACCEPTED"
      }
    }),
    prisma.donation.count({
      where: {
        status: "REJECTED"
      }
    })
  ]);
  return {
    users: {
      total: totalUsers,
      donors: totalDonors,
      recipients: totalRecipients
    },
    bloodRequests: {
      total: totalBloodRequests,
      pending: pendingBloodRequests,
      fulfilled: fulfilledBloodRequests
    },
    donations: {
      total: totalDonations,
      accepted: acceptedDonations,
      rejected: rejectedDonations
    }
  };
};
var getAuditLogs = async (page = 1, limit = 10, action, entity, userId) => {
  const skip = (page - 1) * limit;
  const where = {
    ...action && { action },
    ...entity && { entity },
    ...userId && { userId }
  };
  const logs = await prisma.auditLog.findMany({
    where,
    skip,
    take: limit,
    orderBy: {
      createdAt: "desc"
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
  const total = await prisma.auditLog.count({
    where
  });
  return {
    data: logs,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit)
    }
  };
};
var AdminService = {
  getAllUsers,
  blockUser,
  unblockUser,
  getDashboardStats,
  getAuditLogs
};

// src/modules/admin/admin.contoller.ts
var getAllUsers2 = catchAsync(
  async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const searchTerm = typeof req.query.searchTerm === "string" ? req.query.searchTerm : void 0;
    const role = typeof req.query.role === "string" ? req.query.role : void 0;
    const status = typeof req.query.status === "string" ? req.query.status : void 0;
    if (Number.isNaN(page) || page < 1) {
      throw new Error("Page must be a positive number");
    }
    if (Number.isNaN(limit) || limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }
    const result = await AdminService.getAllUsers(
      page,
      limit,
      searchTerm,
      role,
      status
    );
    sendResponse(res, {
      statusCode: import_http_status11.default.OK,
      success: true,
      message: "Users retrieved successfully",
      data: result
    });
  }
);
var blockUser2 = catchAsync(
  async (req, res) => {
    const adminId = req.user?.id;
    const { id } = req.params;
    if (!adminId) {
      throw new Error("Admin user not found");
    }
    if (!id || Array.isArray(id)) {
      throw new Error("User ID is required");
    }
    const result = await AdminService.blockUser(
      adminId,
      id
    );
    sendResponse(res, {
      statusCode: import_http_status11.default.OK,
      success: true,
      message: "User blocked successfully",
      data: result
    });
  }
);
var unblockUser2 = catchAsync(
  async (req, res) => {
    const adminId = req.user?.id;
    const { id } = req.params;
    if (!adminId) {
      throw new Error("Admin user not found");
    }
    if (!id || Array.isArray(id)) {
      throw new Error("User ID is required");
    }
    const result = await AdminService.unblockUser(
      adminId,
      id
    );
    sendResponse(res, {
      statusCode: import_http_status11.default.OK,
      success: true,
      message: "User unblocked successfully",
      data: result
    });
  }
);
var getDashboardStats2 = catchAsync(
  async (req, res) => {
    const result = await AdminService.getDashboardStats();
    sendResponse(res, {
      statusCode: import_http_status11.default.OK,
      success: true,
      message: "Dashboard statistics retrieved successfully",
      data: result
    });
  }
);
var getAuditLogs2 = catchAsync(
  async (req, res) => {
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const action = typeof req.query.action === "string" ? req.query.action : void 0;
    const entity = typeof req.query.entity === "string" ? req.query.entity : void 0;
    const userId = typeof req.query.userId === "string" ? req.query.userId : void 0;
    if (Number.isNaN(page) || page < 1) {
      throw new Error("Page must be a positive number");
    }
    if (Number.isNaN(limit) || limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }
    const result = await AdminService.getAuditLogs(
      page,
      limit,
      action,
      entity,
      userId
    );
    sendResponse(res, {
      statusCode: import_http_status11.default.OK,
      success: true,
      message: "Audit logs retrieved successfully",
      data: result
    });
  }
);
var AdminController = {
  getAllUsers: getAllUsers2,
  blockUser: blockUser2,
  unblockUser: unblockUser2,
  getDashboardStats: getDashboardStats2,
  getAuditLogs: getAuditLogs2
};

// src/modules/admin/admin.route.ts
var router7 = (0, import_express7.Router)();
router7.get(
  "/users",
  auth(Role.ADMIN),
  AdminController.getAllUsers
);
router7.patch(
  "/users/:id/block",
  auth(Role.ADMIN),
  AdminController.blockUser
);
router7.patch(
  "/users/:id/unblock",
  auth(Role.ADMIN),
  AdminController.unblockUser
);
router7.get(
  "/dashboard-stats",
  auth(Role.ADMIN),
  AdminController.getDashboardStats
);
router7.get(
  "/audit-logs",
  auth(Role.ADMIN),
  AdminController.getAuditLogs
);
var AdminRoutes = router7;

// src/routes.ts
var router8 = (0, import_express8.Router)();
router8.use("/auth", AuthRoutes);
router8.use("/users", UserRoutes);
router8.use("/admin", AdminRoutes);
router8.use("/blood-requests", BloodRequestRoutes);
router8.use("/donors", DonorRoutes);
router8.use("/donations", DonationRoutes);
router8.use("/payments", PaymentRoutes);
var routes_default = router8;

// src/app.ts
var import_express_rate_limit = __toESM(require("express-rate-limit"));

// src/docs/swagger.ts
var import_swagger_ui_express = __toESM(require("swagger-ui-express"));
var swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "BloodLink API",
    version: "1.0.0",
    description: "API documentation for BloodLink \u2014 Blood Donation & Emergency Assistance Platform"
  },
  servers: [
    {
      url: "https://blood-donation-and-emergency-platfo.vercel.app",
      description: "Production Server"
    },
    {
      url: "http://localhost:5000",
      description: "Local Server"
    }
  ],
  tags: [
    {
      name: "Auth",
      description: "Authentication APIs"
    },
    {
      name: "User",
      description: "User profile management APIs"
    },
    {
      name: "Blood Request",
      description: "Blood request management APIs"
    },
    {
      name: "Donor",
      description: "Donor management APIs"
    },
    {
      name: "Donation",
      description: "Blood donation APIs"
    },
    {
      name: "Payment",
      description: "Payment and bKash APIs"
    },
    {
      name: "Admin",
      description: "Admin management APIs"
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    }
  },
  paths: {
    // =========================
    // AUTH
    // =========================
    "/api/v1/auth/register": {
      post: {
        tags: ["Auth"],
        summary: "Register a new user",
        description: "Create a new BloodLink user account.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 100,
                    example: "Rahima Begum"
                  },
                  email: {
                    type: "string",
                    format: "email",
                    example: "rahima@example.com"
                  },
                  password: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                    example: "Password@123",
                    description: "Must contain uppercase, lowercase, number and special character."
                  },
                  phone: {
                    type: "string",
                    minLength: 10,
                    maxLength: 15,
                    example: "01712345678"
                  },
                  location: {
                    type: "string",
                    example: "Sylhet, Bangladesh"
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "User registered successfully"
          },
          "400": {
            description: "Validation error"
          }
        }
      }
    },
    "/api/v1/auth/verify-email": {
      post: {
        tags: ["Auth"],
        summary: "Verify email address",
        description: "Verify user's email address using a 6-digit OTP.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "rahima@example.com"
                  },
                  otp: {
                    type: "string",
                    minLength: 6,
                    maxLength: 6,
                    pattern: "^[0-9]{6}$",
                    example: "123456"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Email verified successfully"
          },
          "400": {
            description: "Invalid or expired OTP"
          }
        }
      }
    },
    "/api/v1/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login user",
        description: "Login using email and password.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "rahima@example.com"
                  },
                  password: {
                    type: "string",
                    format: "password",
                    example: "Password@123"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Login successful"
          },
          "401": {
            description: "Invalid credentials"
          }
        }
      }
    },
    "/api/v1/auth/google": {
      post: {
        tags: ["Auth"],
        summary: "Login with Google",
        description: "Login or register a user using Google OAuth credential.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["credential"],
                properties: {
                  credential: {
                    type: "string",
                    minLength: 1,
                    example: "google-id-token",
                    description: "Google Identity Services credential / ID token."
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Google login successful"
          },
          "401": {
            description: "Invalid Google credential"
          }
        }
      }
    },
    "/api/v1/auth/refresh-token": {
      post: {
        tags: ["Auth"],
        summary: "Refresh access token",
        description: "Generate a new access token using the refresh token.",
        responses: {
          "200": {
            description: "Access token refreshed successfully"
          },
          "401": {
            description: "Invalid or expired refresh token"
          }
        }
      }
    },
    "/api/v1/auth/forgot-password": {
      post: {
        tags: ["Auth"],
        summary: "Forgot password",
        description: "Send a password reset OTP to the user's email.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "rahima@example.com"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Password reset OTP sent successfully"
          },
          "404": {
            description: "User not found"
          },
          "400": {
            description: "Validation error"
          }
        }
      }
    },
    "/api/v1/auth/reset-password": {
      post: {
        tags: ["Auth"],
        summary: "Reset password",
        description: "Reset user password using a 6-digit OTP.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "otp", "newPassword"],
                properties: {
                  email: {
                    type: "string",
                    format: "email",
                    example: "rahima@example.com"
                  },
                  otp: {
                    type: "string",
                    minLength: 6,
                    maxLength: 6,
                    pattern: "^[0-9]{6}$",
                    example: "123456"
                  },
                  newPassword: {
                    type: "string",
                    format: "password",
                    minLength: 8,
                    example: "NewPassword@123",
                    description: "Must contain uppercase, lowercase, number and special character."
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Password reset successfully"
          },
          "400": {
            description: "Invalid or expired OTP"
          }
        }
      }
    },
    "/api/v1/user/me": {
      get: {
        tags: ["User"],
        summary: "Get my profile",
        description: "Get the authenticated user's profile.",
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          "200": {
            description: "Profile retrieved successfully"
          },
          "401": {
            description: "Unauthorized"
          }
        }
      },
      patch: {
        tags: ["User"],
        summary: "Update my profile",
        description: "Update the authenticated user's profile.",
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 100,
                    example: "Rahima Begum"
                  },
                  phone: {
                    type: "string",
                    minLength: 10,
                    maxLength: 15,
                    example: "01712345678"
                  },
                  location: {
                    type: "string",
                    example: "Sylhet, Bangladesh"
                  },
                  profileImage: {
                    type: "string",
                    format: "uri",
                    example: "https://res.cloudinary.com/example/image/upload/profile.jpg"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Profile updated successfully"
          },
          "400": {
            description: "Validation error"
          },
          "401": {
            description: "Unauthorized"
          }
        }
      }
    },
    "/api/v1/blood-request": {
      post: {
        tags: ["Blood Request"],
        summary: "Create blood request",
        description: "Create a new blood request. Only recipients can create blood requests.",
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "bloodGroup",
                  "hospitalName",
                  "requiredDate"
                ],
                properties: {
                  bloodGroup: {
                    type: "string",
                    enum: [
                      "A_POSITIVE",
                      "A_NEGATIVE",
                      "B_POSITIVE",
                      "B_NEGATIVE",
                      "AB_POSITIVE",
                      "AB_NEGATIVE",
                      "O_POSITIVE",
                      "O_NEGATIVE"
                    ],
                    example: "B_POSITIVE"
                  },
                  units: {
                    type: "integer",
                    minimum: 1,
                    default: 1,
                    example: 2
                  },
                  hospitalName: {
                    type: "string",
                    minLength: 2,
                    example: "Sylhet MAG Osmani Medical College Hospital"
                  },
                  hospitalAddress: {
                    type: "string",
                    example: "Medical Road, Sylhet, Bangladesh"
                  },
                  requiredDate: {
                    type: "string",
                    format: "date-time",
                    example: "2026-09-10T10:00:00.000Z"
                  },
                  urgency: {
                    type: "string",
                    enum: [
                      "LOW",
                      "NORMAL",
                      "HIGH",
                      "CRITICAL"
                    ],
                    default: "NORMAL",
                    example: "HIGH"
                  },
                  contactNumber: {
                    type: "string",
                    minLength: 10,
                    maxLength: 15,
                    example: "01712345678"
                  },
                  patientName: {
                    type: "string",
                    minLength: 2,
                    example: "Rahima Begum"
                  },
                  notes: {
                    type: "string",
                    example: "Urgently needed for surgery"
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Blood request created successfully"
          },
          "400": {
            description: "Validation error"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Only recipients can create blood requests"
          }
        }
      },
      get: {
        tags: ["Blood Request"],
        summary: "Get all blood requests",
        description: "Get blood requests accessible to admin, donor and recipient users.",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1
            },
            description: "Page number"
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 10
            },
            description: "Number of records per page"
          },
          {
            name: "sortBy",
            in: "query",
            schema: {
              type: "string",
              example: "createdAt"
            },
            description: "Field to sort by"
          },
          {
            name: "sortOrder",
            in: "query",
            schema: {
              type: "string",
              enum: ["asc", "desc"],
              default: "desc"
            },
            description: "Sort direction"
          }
        ],
        responses: {
          "200": {
            description: "Blood requests retrieved successfully"
          },
          "401": {
            description: "Unauthorized"
          }
        }
      }
    },
    "/api/v1/blood-request/search": {
      get: {
        tags: ["Blood Request"],
        summary: "Search blood requests",
        description: "Search blood requests using available query parameters.",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "searchTerm",
            in: "query",
            schema: {
              type: "string",
              example: "Osmani"
            },
            description: "Search by relevant blood request information"
          },
          {
            name: "bloodGroup",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "A_POSITIVE",
                "A_NEGATIVE",
                "B_POSITIVE",
                "B_NEGATIVE",
                "AB_POSITIVE",
                "AB_NEGATIVE",
                "O_POSITIVE",
                "O_NEGATIVE"
              ],
              example: "B_POSITIVE"
            }
          },
          {
            name: "urgency",
            in: "query",
            schema: {
              type: "string",
              enum: [
                "LOW",
                "NORMAL",
                "HIGH",
                "CRITICAL"
              ],
              example: "HIGH"
            }
          },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              example: "PENDING"
            }
          },
          {
            name: "page",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 1
            }
          },
          {
            name: "limit",
            in: "query",
            schema: {
              type: "integer",
              minimum: 1,
              default: 10
            }
          }
        ],
        responses: {
          "200": {
            description: "Blood requests search completed successfully"
          },
          "401": {
            description: "Unauthorized"
          }
        }
      }
    },
    "/api/v1/blood-request/{id}/verify": {
      patch: {
        tags: ["Blood Request"],
        summary: "Verify blood request",
        description: "Verify a blood request. Only admins can perform this action.",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "Blood request ID"
          }
        ],
        responses: {
          "200": {
            description: "Blood request verified successfully"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Only admins can verify blood requests"
          },
          "404": {
            description: "Blood request not found"
          }
        }
      }
    },
    "/api/v1/blood-request/{id}/reject": {
      patch: {
        tags: ["Blood Request"],
        summary: "Reject blood request",
        description: "Reject a blood request. Only admins can perform this action.",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "Blood request ID"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["rejectionReason"],
                properties: {
                  rejectionReason: {
                    type: "string",
                    minLength: 5,
                    maxLength: 500,
                    example: "The submitted hospital information could not be verified."
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Blood request rejected successfully"
          },
          "400": {
            description: "Validation error"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Only admins can reject blood requests"
          },
          "404": {
            description: "Blood request not found"
          }
        }
      }
    },
    "/api/v1/blood-request/{id}": {
      get: {
        tags: ["Blood Request"],
        summary: "Get blood request by ID",
        description: "Retrieve a specific blood request by its ID.",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "Blood request ID"
          }
        ],
        responses: {
          "200": {
            description: "Blood request retrieved successfully"
          },
          "401": {
            description: "Unauthorized"
          },
          "404": {
            description: "Blood request not found"
          }
        }
      },
      patch: {
        tags: ["Blood Request"],
        summary: "Update blood request",
        description: "Update an existing blood request. Only the recipient can update it.",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "Blood request ID"
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  bloodGroup: {
                    type: "string",
                    enum: [
                      "A_POSITIVE",
                      "A_NEGATIVE",
                      "B_POSITIVE",
                      "B_NEGATIVE",
                      "AB_POSITIVE",
                      "AB_NEGATIVE",
                      "O_POSITIVE",
                      "O_NEGATIVE"
                    ],
                    example: "B_POSITIVE"
                  },
                  units: {
                    type: "integer",
                    minimum: 1,
                    example: 2
                  },
                  hospitalName: {
                    type: "string",
                    minLength: 2,
                    example: "Sylhet MAG Osmani Medical College Hospital"
                  },
                  hospitalAddress: {
                    type: "string",
                    example: "Medical Road, Sylhet, Bangladesh"
                  },
                  requiredDate: {
                    type: "string",
                    format: "date-time",
                    example: "2026-09-10T10:00:00.000Z"
                  },
                  urgency: {
                    type: "string",
                    enum: [
                      "LOW",
                      "NORMAL",
                      "HIGH",
                      "CRITICAL"
                    ],
                    example: "HIGH"
                  },
                  contactNumber: {
                    type: "string",
                    minLength: 10,
                    maxLength: 15,
                    example: "01712345678"
                  },
                  patientName: {
                    type: "string",
                    minLength: 2,
                    example: "Rahima Begum"
                  },
                  notes: {
                    type: "string",
                    example: "Urgently needed for surgery"
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Blood request updated successfully"
          },
          "400": {
            description: "Validation error"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Only the recipient can update this request"
          },
          "404": {
            description: "Blood request not found"
          }
        }
      },
      delete: {
        tags: ["Blood Request"],
        summary: "Delete blood request",
        description: "Delete a blood request. Only the recipient can perform this action.",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "Blood request ID"
          }
        ],
        responses: {
          "200": {
            description: "Blood request deleted successfully"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Only the recipient can delete this request"
          },
          "404": {
            description: "Blood request not found"
          }
        }
      }
    },
    "/api/v1/donor/me": {
      get: {
        tags: ["Donor"],
        summary: "Get my donor profile",
        description: "Retrieve the authenticated donor's profile.",
        security: [
          {
            bearerAuth: []
          }
        ],
        responses: {
          "200": {
            description: "Donor profile retrieved successfully"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Only donors can access this endpoint"
          },
          "404": {
            description: "Donor profile not found"
          }
        }
      }
    },
    "/api/v1/donor/match/{bloodRequestId}": {
      get: {
        tags: ["Donor"],
        summary: "Match compatible donors",
        description: "Find compatible donors for a specific blood request. Accessible by recipients and admins.",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "bloodRequestId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "Blood request ID"
          }
        ],
        responses: {
          "200": {
            description: "Compatible donors retrieved successfully"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Only recipients and admins can access this endpoint"
          },
          "404": {
            description: "Blood request not found"
          }
        }
      }
    },
    "/api/v1/donor/nearby/{bloodRequestId}": {
      get: {
        tags: ["Donor"],
        summary: "Find nearby compatible donors",
        description: "Find compatible donors near the blood request location. Default radius is 20 km.",
        security: [
          {
            bearerAuth: []
          }
        ],
        parameters: [
          {
            name: "bloodRequestId",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "Blood request ID"
          },
          {
            name: "radius",
            in: "query",
            required: false,
            schema: {
              type: "number",
              minimum: 0.1,
              default: 20
            },
            example: 20,
            description: "Search radius in kilometers. Defaults to 20 km."
          }
        ],
        responses: {
          "200": {
            description: "Nearby compatible donors retrieved successfully"
          },
          "400": {
            description: "Radius must be a positive number"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Only recipients and admins can access this endpoint"
          },
          "404": {
            description: "Blood request not found"
          }
        }
      }
    },
    "/api/v1/donor/availability": {
      patch: {
        tags: ["Donor"],
        summary: "Update donor availability",
        description: "Update the availability status of the authenticated donor.",
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["isAvailable"],
                properties: {
                  isAvailable: {
                    type: "boolean",
                    example: true,
                    description: "Whether the donor is currently available to donate blood."
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Donor availability updated successfully"
          },
          "400": {
            description: "isAvailable must be a boolean"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Only donors can update availability"
          }
        }
      }
    },
    "/api/v1/donor/location": {
      patch: {
        tags: ["Donor"],
        summary: "Update donor location",
        description: "Update the authenticated donor's current location.",
        security: [
          {
            bearerAuth: []
          }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: [
                  "latitude",
                  "longitude"
                ],
                properties: {
                  latitude: {
                    type: "number",
                    example: 24.8949,
                    description: "Donor latitude coordinate."
                  },
                  longitude: {
                    type: "number",
                    example: 91.8687,
                    description: "Donor longitude coordinate."
                  },
                  address: {
                    type: "string",
                    example: "Sylhet, Bangladesh",
                    description: "Optional donor address."
                  }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Donor location updated successfully"
          },
          "400": {
            description: "Latitude and longitude must be numbers"
          },
          "401": {
            description: "Unauthorized"
          },
          "403": {
            description: "Only donors can update location"
          }
        }
      }
    },
    "/api/v1/donation": {
      post: {
        tags: ["Donation"],
        summary: "Create a donation",
        description: "Create a blood donation request/record. Only DONOR can create a donation.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  bloodRequestId: {
                    type: "string",
                    format: "uuid",
                    example: "9e8f8fbb-9b65-4cb6-a517-870e0d6b151a"
                  }
                },
                required: ["bloodRequestId"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Donation created successfully"
          },
          400: {
            description: "Validation error"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only donor can create donation"
          }
        }
      }
    },
    "/api/v1/donation/my": {
      get: {
        tags: ["Donation"],
        summary: "Get my donations",
        description: "Retrieve donations created by the authenticated donor.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Donations retrieved successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only donor can access this endpoint"
          }
        }
      }
    },
    "/api/v1/donation/{id}/approve": {
      patch: {
        tags: ["Donation"],
        summary: "Approve a donation",
        description: "Recipient approves a donor's donation.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "Donation ID"
          }
        ],
        responses: {
          200: {
            description: "Donation approved successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only recipient can approve donation"
          },
          404: {
            description: "Donation not found"
          }
        }
      }
    },
    "/api/v1/donation/{id}/reject": {
      patch: {
        tags: ["Donation"],
        summary: "Reject a donation",
        description: "Recipient rejects a donor's donation.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "Donation ID"
          }
        ],
        responses: {
          200: {
            description: "Donation rejected successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only recipient can reject donation"
          },
          404: {
            description: "Donation not found"
          }
        }
      }
    },
    "/api/v1/payment/initiate": {
      post: {
        tags: ["Payment"],
        summary: "Initiate bKash payment",
        description: "Initiate a bKash payment for a blood request. Only RECIPIENT can initiate payment.",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  bloodRequestId: {
                    type: "string",
                    format: "uuid",
                    example: "9e8f8fbb-9b65-4cb6-a517-870e0d6b151a"
                  }
                },
                required: ["bloodRequestId"]
              }
            }
          }
        },
        responses: {
          201: {
            description: "Payment initiated successfully"
          },
          400: {
            description: "Validation error"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only recipient can initiate payment"
          }
        }
      }
    },
    "/api/v1/payment/execute/{paymentID}": {
      post: {
        tags: ["Payment"],
        summary: "Execute bKash payment",
        description: "Execute a previously initiated bKash payment.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "paymentID",
            in: "path",
            required: true,
            schema: {
              type: "string"
            },
            description: "bKash payment ID"
          }
        ],
        responses: {
          200: {
            description: "Payment executed successfully"
          },
          400: {
            description: "Payment execution failed"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only recipient can execute payment"
          },
          502: {
            description: "bKash gateway error"
          }
        }
      }
    },
    "/api/v1/payment/callback": {
      get: {
        tags: ["Payment"],
        summary: "bKash payment callback",
        description: "Callback endpoint used by bKash after payment processing.",
        parameters: [
          {
            name: "paymentID",
            in: "query",
            required: false,
            schema: {
              type: "string"
            }
          },
          {
            name: "status",
            in: "query",
            required: false,
            schema: {
              type: "string"
            }
          }
        ],
        responses: {
          200: {
            description: "Payment callback processed successfully"
          },
          400: {
            description: "Invalid callback"
          }
        }
      }
    },
    "/api/v1/payment/my": {
      get: {
        tags: ["Payment"],
        summary: "Get my payments",
        description: "Retrieve all payments made by the authenticated recipient.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Payments retrieved successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only recipient can access this endpoint"
          }
        }
      }
    },
    "/api/v1/payment/all": {
      get: {
        tags: ["Payment"],
        summary: "Get all payments",
        description: "Retrieve all payments. Only ADMIN can access this endpoint.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "All payments retrieved successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only admin can access this endpoint"
          }
        }
      }
    },
    "/api/v1/payment/{id}": {
      get: {
        tags: ["Payment"],
        summary: "Get payment by ID",
        description: "Retrieve a single payment by ID. Accessible by the payment owner or admin.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "Payment ID"
          }
        ],
        responses: {
          200: {
            description: "Payment retrieved successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Access denied"
          },
          404: {
            description: "Payment not found"
          }
        }
      }
    },
    "/api/v1/admin/users": {
      get: {
        tags: ["Admin"],
        summary: "Get all users",
        description: "Retrieve all users. Only ADMIN can access this endpoint.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1
            }
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 10
            }
          },
          {
            name: "searchTerm",
            in: "query",
            required: false,
            schema: {
              type: "string"
            }
          },
          {
            name: "role",
            in: "query",
            required: false,
            schema: {
              type: "string",
              enum: ["ADMIN", "DONOR", "RECIPIENT"]
            }
          }
        ],
        responses: {
          200: {
            description: "Users retrieved successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only admin can access this endpoint"
          }
        }
      }
    },
    "/api/v1/admin/users/{id}/block": {
      patch: {
        tags: ["Admin"],
        summary: "Block a user",
        description: "Block a user account. Only ADMIN can access this endpoint.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "User ID"
          }
        ],
        responses: {
          200: {
            description: "User blocked successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only admin can block users"
          },
          404: {
            description: "User not found"
          }
        }
      }
    },
    "/api/v1/admin/users/{id}/unblock": {
      patch: {
        tags: ["Admin"],
        summary: "Unblock a user",
        description: "Unblock a previously blocked user account.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: {
              type: "string",
              format: "uuid"
            },
            description: "User ID"
          }
        ],
        responses: {
          200: {
            description: "User unblocked successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only admin can unblock users"
          },
          404: {
            description: "User not found"
          }
        }
      }
    },
    "/api/v1/admin/dashboard-stats": {
      get: {
        tags: ["Admin"],
        summary: "Get dashboard statistics",
        description: "Retrieve platform dashboard statistics. Only ADMIN can access this endpoint.",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Dashboard statistics retrieved successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only admin can access this endpoint"
          }
        }
      }
    },
    "/api/v1/admin/audit-logs": {
      get: {
        tags: ["Admin"],
        summary: "Get audit logs",
        description: "Retrieve system audit logs. Only ADMIN can access this endpoint.",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "page",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 1
            }
          },
          {
            name: "limit",
            in: "query",
            required: false,
            schema: {
              type: "integer",
              minimum: 1,
              default: 10
            }
          }
        ],
        responses: {
          200: {
            description: "Audit logs retrieved successfully"
          },
          401: {
            description: "Unauthorized"
          },
          403: {
            description: "Only admin can access this endpoint"
          }
        }
      }
    }
  }
};
var setupSwagger = (app2) => {
  app2.use(
    "/api-docs",
    import_swagger_ui_express.default.serve,
    import_swagger_ui_express.default.setup(swaggerDocument)
  );
};

// src/app.ts
var app = (0, import_express9.default)();
setupSwagger(app);
app.use((0, import_helmet.default)());
app.use(
  (0, import_cors.default)({
    credentials: true
  })
);
app.use(import_express9.default.urlencoded({ extended: true }));
app.use(import_express9.default.json());
app.use((0, import_cookie_parser.default)());
var limiter = (0, import_express_rate_limit.default)({
  windowMs: 15 * 60 * 1e3,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    errors: []
  }
});
app.use("/api/v1", limiter);
app.use("/api/v1", routes_default);
app.get("/", async (req, res) => {
  res.status(200).json({
    success: true,
    message: "BloodLink API is running",
    data: {
      version: "v1",
      status: "healthy"
    }
  });
});
app.use(notFound);
app.use(globalErrorHandler);
var app_default = app;

// src/vercel.ts
var vercel_default = app_default;
//# sourceMappingURL=vercel.js.map