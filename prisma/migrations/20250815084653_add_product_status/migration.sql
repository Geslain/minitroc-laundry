-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('finished', 'in_progress', 'collected', 'pending', 'sold', 'reserved', 'available');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "status" "public"."Status" NOT NULL DEFAULT 'collected';
