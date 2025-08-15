-- CreateEnum
CREATE TYPE "public"."State" AS ENUM ('new', 'very_good', 'good', 'fair', 'donation');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "state" "public"."State" NOT NULL DEFAULT 'new';
