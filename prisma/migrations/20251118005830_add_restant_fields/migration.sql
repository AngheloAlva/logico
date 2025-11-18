/*
  Warnings:

  - You are about to drop the column `regionId` on the `city` table. All the data in the column will be lost.
  - You are about to drop the column `licenseUrl` on the `driver` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `driver` table. All the data in the column will be lost.
  - You are about to drop the column `class` on the `motorbike` table. All the data in the column will be lost.
  - You are about to drop the column `cylinders` on the `motorbike` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `motorbike` table. All the data in the column will be lost.
  - You are about to drop the column `mileage` on the `motorbike` table. All the data in the column will be lost.
  - You are about to drop the column `contactEmail` on the `pharmacy` table. All the data in the column will be lost.
  - You are about to drop the column `contactName` on the `pharmacy` table. All the data in the column will be lost.
  - You are about to drop the column `contactPhone` on the `pharmacy` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `driver` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[code]` on the table `pharmacy` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `provinceId` to the `city` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maternalLastName` to the `driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paternalLastName` to the `driver` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `driver` table without a default value. This is not possible if the table is not empty.
  - Made the column `address` on table `driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `regionId` on table `driver` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cityId` on table `driver` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `chassisNumber` to the `motorbike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `engineNumber` to the `motorbike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `motorbike` table without a default value. This is not possible if the table is not empty.
  - Added the required column `closingTime` to the `pharmacy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `pharmacy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `pharmacy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `pharmacy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingTime` to the `pharmacy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `pharmacy` table without a default value. This is not possible if the table is not empty.
  - Added the required column `provinceId` to the `pharmacy` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MotorbikeOwner" AS ENUM ('EMPRESA', 'MOTORISTA');

-- DropForeignKey
ALTER TABLE "public"."city" DROP CONSTRAINT "city_regionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."driver" DROP CONSTRAINT "driver_cityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."driver" DROP CONSTRAINT "driver_regionId_fkey";

-- DropIndex
DROP INDEX "public"."motorbike_driverId_key";

-- AlterTable
ALTER TABLE "city" DROP COLUMN "regionId",
ADD COLUMN     "provinceId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "driver" DROP COLUMN "licenseUrl",
DROP COLUMN "name",
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "hasPersonalMotorbike" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "licenseExpiryDate" TIMESTAMP(3),
ADD COLUMN     "licenseFileUrl" TEXT,
ADD COLUMN     "licenseLastCheckDate" TIMESTAMP(3),
ADD COLUMN     "maternalLastName" TEXT NOT NULL,
ADD COLUMN     "passport" TEXT,
ADD COLUMN     "paternalLastName" TEXT NOT NULL,
ADD COLUMN     "provinceId" TEXT NOT NULL,
ALTER COLUMN "address" SET NOT NULL,
ALTER COLUMN "regionId" SET NOT NULL,
ALTER COLUMN "cityId" SET NOT NULL;

-- AlterTable
ALTER TABLE "motorbike" DROP COLUMN "class",
DROP COLUMN "cylinders",
DROP COLUMN "image",
DROP COLUMN "mileage",
ADD COLUMN     "chassisNumber" TEXT NOT NULL,
ADD COLUMN     "engineNumber" TEXT NOT NULL,
ADD COLUMN     "owner" "MotorbikeOwner" NOT NULL;

-- AlterTable
ALTER TABLE "pharmacy" DROP COLUMN "contactEmail",
DROP COLUMN "contactName",
DROP COLUMN "contactPhone",
ADD COLUMN     "closingTime" TEXT NOT NULL,
ADD COLUMN     "code" TEXT NOT NULL,
ADD COLUMN     "latitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "longitude" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "openingTime" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "provinceId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "province" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "regionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "province_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contact" (
    "id" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "driverId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "motorbike_documentation" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "circulationPermitFileUrl" TEXT,
    "mandatoryInsuranceFileUrl" TEXT,
    "mandatoryInsuranceExpiryDate" TIMESTAMP(3),
    "technicalInspectionFileUrl" TEXT,
    "technicalInspectionExpiryDate" TIMESTAMP(3),
    "motorbikeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "motorbike_documentation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "motorbike_documentation_motorbikeId_year_key" ON "motorbike_documentation"("motorbikeId", "year");

-- CreateIndex
CREATE UNIQUE INDEX "driver_code_key" ON "driver"("code");

-- CreateIndex
CREATE UNIQUE INDEX "pharmacy_code_key" ON "pharmacy"("code");

-- AddForeignKey
ALTER TABLE "province" ADD CONSTRAINT "province_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "city" ADD CONSTRAINT "city_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pharmacy" ADD CONSTRAINT "pharmacy_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver" ADD CONSTRAINT "driver_regionId_fkey" FOREIGN KEY ("regionId") REFERENCES "region"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver" ADD CONSTRAINT "driver_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES "province"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver" ADD CONSTRAINT "driver_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "city"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contact" ADD CONSTRAINT "emergency_contact_driverId_fkey" FOREIGN KEY ("driverId") REFERENCES "driver"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "motorbike_documentation" ADD CONSTRAINT "motorbike_documentation_motorbikeId_fkey" FOREIGN KEY ("motorbikeId") REFERENCES "motorbike"("id") ON DELETE CASCADE ON UPDATE CASCADE;
