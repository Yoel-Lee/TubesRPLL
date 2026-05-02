-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "baseSalary" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "phoneNumber" TEXT;
