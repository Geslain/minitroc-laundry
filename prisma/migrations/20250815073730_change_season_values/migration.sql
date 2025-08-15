/*
  Warnings:

  - The values [summer,winter,autumn,spring,all_seasons] on the enum `Season` will be removed. If these variants are still used in the database, this will fail.
  - The `category` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."Category" AS ENUM ('jacket', 'socks', 'accessories', 'pajamas', 'set', 'dress', 'coat', 'tshirt_short', 'tshirt_long', 'sweatshirt', 'pants', 'bodysuit', 'Empty');

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Season_new" AS ENUM ('mid_season', 'hot', 'cold', 'Empty');
ALTER TABLE "public"."Product" ALTER COLUMN "season" DROP DEFAULT;
ALTER TABLE "public"."Product" ALTER COLUMN "season" TYPE "public"."Season_new" USING ("season"::text::"public"."Season_new");
ALTER TYPE "public"."Season" RENAME TO "Season_old";
ALTER TYPE "public"."Season_new" RENAME TO "Season";
DROP TYPE "public"."Season_old";
ALTER TABLE "public"."Product" ALTER COLUMN "season" SET DEFAULT 'Empty';
COMMIT;

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "category",
ADD COLUMN     "category" "public"."Category" NOT NULL DEFAULT 'Empty';
