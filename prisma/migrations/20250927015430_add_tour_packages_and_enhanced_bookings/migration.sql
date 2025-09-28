/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `packages` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('ADVENTURE', 'CULTURAL', 'NATURE', 'HISTORICAL', 'BEACH', 'MOUNTAIN', 'CITY', 'WILDLIFE', 'LUXURY', 'BUDGET', 'FAMILY', 'ROMANTIC');

-- CreateEnum
CREATE TYPE "public"."Difficulty" AS ENUM ('EASY', 'MODERATE', 'CHALLENGING', 'EXTREME');

-- CreateEnum
CREATE TYPE "public"."PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED');

-- AlterTable
ALTER TABLE "public"."bookings" ADD COLUMN     "contactInfo" JSONB,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "guestNames" TEXT[],
ADD COLUMN     "guests" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentId" TEXT,
ADD COLUMN     "paymentStatus" "public"."PaymentStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "totalPrice" DECIMAL(10,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."packages" ADD COLUMN     "availableFrom" TIMESTAMP(3),
ADD COLUMN     "availableTo" TIMESTAMP(3),
ADD COLUMN     "category" "public"."Category" NOT NULL DEFAULT 'ADVENTURE',
ADD COLUMN     "coordinates" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "coverImage" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "difficulty" "public"."Difficulty" NOT NULL DEFAULT 'EASY',
ADD COLUMN     "duration" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "excludes" TEXT[],
ADD COLUMN     "highlights" TEXT[],
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "includes" TEXT[],
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "isAvailable" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "itinerary" JSONB,
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'TBD',
ADD COLUMN     "maxGuests" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "minAge" INTEGER,
ADD COLUMN     "originalPrice" DECIMAL(10,2),
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "reviewCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "shortDescription" TEXT,
ADD COLUMN     "slug" TEXT,
ADD COLUMN     "tags" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "packages_slug_key" ON "public"."packages"("slug");
