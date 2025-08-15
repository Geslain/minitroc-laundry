/*
  Warnings:

  - The `size` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Size" AS ENUM ('zero_months', 'one_month', 'three_months', 'six_months', 'nine_months', 'twelve_months', 'eighteen_months', 'twenty_four_months', 'two_years', 'three_years', 'four_years', 'five_years', 'six_years', 'Empty');

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "size",
ADD COLUMN     "size" "public"."Size" NOT NULL DEFAULT 'Empty';
