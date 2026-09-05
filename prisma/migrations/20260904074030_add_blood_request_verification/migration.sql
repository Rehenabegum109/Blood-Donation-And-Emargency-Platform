/*
  Warnings:

  - A unique constraint covering the columns `[donorId,bloodRequestId]` on the table `Donation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bkashPaymentId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `bloodGroup` on the `Donor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');

-- AlterTable
ALTER TABLE "BloodRequest" ADD COLUMN     "hospitalLatitude" DOUBLE PRECISION,
ADD COLUMN     "hospitalLongitude" DOUBLE PRECISION,
ADD COLUMN     "rejectionReason" TEXT,
ADD COLUMN     "verificationStatus" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "verifiedAt" TIMESTAMP(3),
ADD COLUMN     "verifiedBy" TEXT;

-- AlterTable
ALTER TABLE "Donor" ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
DROP COLUMN "bloodGroup",
ADD COLUMN     "bloodGroup" "BloodGroup" NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "bkashPaymentId" TEXT;

-- CreateIndex
CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- CreateIndex
CREATE INDEX "BloodRequest_recipientId_idx" ON "BloodRequest"("recipientId");

-- CreateIndex
CREATE INDEX "BloodRequest_bloodGroup_idx" ON "BloodRequest"("bloodGroup");

-- CreateIndex
CREATE INDEX "BloodRequest_status_idx" ON "BloodRequest"("status");

-- CreateIndex
CREATE INDEX "BloodRequest_urgency_idx" ON "BloodRequest"("urgency");

-- CreateIndex
CREATE INDEX "BloodRequest_requiredDate_idx" ON "BloodRequest"("requiredDate");

-- CreateIndex
CREATE INDEX "BloodRequest_bloodGroup_status_urgency_idx" ON "BloodRequest"("bloodGroup", "status", "urgency");

-- CreateIndex
CREATE INDEX "BloodRequest_verificationStatus_idx" ON "BloodRequest"("verificationStatus");

-- CreateIndex
CREATE INDEX "Donation_bloodRequestId_status_idx" ON "Donation"("bloodRequestId", "status");

-- CreateIndex
CREATE INDEX "Donation_donorId_status_idx" ON "Donation"("donorId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Donation_donorId_bloodRequestId_key" ON "Donation"("donorId", "bloodRequestId");

-- CreateIndex
CREATE INDEX "Donor_bloodGroup_idx" ON "Donor"("bloodGroup");

-- CreateIndex
CREATE INDEX "Donor_isAvailable_idx" ON "Donor"("isAvailable");

-- CreateIndex
CREATE INDEX "Donor_bloodGroup_isAvailable_idx" ON "Donor"("bloodGroup", "isAvailable");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_bkashPaymentId_key" ON "Payment"("bkashPaymentId");

-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken"("userId");

-- CreateIndex
CREATE INDEX "RefreshToken_expiresAt_idx" ON "RefreshToken"("expiresAt");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "User_status_idx" ON "User"("status");

-- CreateIndex
CREATE INDEX "User_deletedAt_idx" ON "User"("deletedAt");
