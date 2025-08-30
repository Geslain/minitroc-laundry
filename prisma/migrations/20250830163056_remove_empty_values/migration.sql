/*
  Warnings:

  - The values [Empty] on the enum `Brand` will be removed. If these variants are still used in the database, this will fail.
  - The values [Empty] on the enum `Category` will be removed. If these variants are still used in the database, this will fail.
  - The values [Empty] on the enum `Gender` will be removed. If these variants are still used in the database, this will fail.
  - The values [Empty] on the enum `Season` will be removed. If these variants are still used in the database, this will fail.
  - The values [Empty] on the enum `Size` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Brand_new" AS ENUM ('jacadi', 'petit_bateau', 'sergent_major', 'zara', 'hm', 'kiabi', 'no_name', 'bonpoint', 'tartine_et_chocolat', 'bonton', 'okaidi', 'dpam', 'tape_a_loeil', 'vertbaudet', 'catimini', 'ca', 'tex_carrefour', 'in_extenso_auchan', 'gemo', 'zeeman', 'primark', 'lidl', 'la_redoute', 'orchestra', 'grain_de_ble', 'boutchou_monoprix', 'ikks', 'absorba', 'natalys', 'bebel', 'shein', 'uniqlo', 'benetton');
ALTER TABLE "public"."Product" ALTER COLUMN "brand" DROP DEFAULT;
ALTER TABLE "public"."Product" ALTER COLUMN "brand" TYPE "public"."Brand_new" USING ("brand"::text::"public"."Brand_new");
ALTER TYPE "public"."Brand" RENAME TO "Brand_old";
ALTER TYPE "public"."Brand_new" RENAME TO "Brand";
DROP TYPE "public"."Brand_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Category_new" AS ENUM ('jacket', 'socks', 'accessories', 'pajamas', 'set', 'dress', 'coat', 'tshirt_short', 'tshirt_long', 'sweatshirt', 'pants', 'bodysuit', 'sleeping_bag');
ALTER TABLE "public"."Product" ALTER COLUMN "category" DROP DEFAULT;
ALTER TABLE "public"."Product" ALTER COLUMN "category" TYPE "public"."Category_new" USING ("category"::text::"public"."Category_new");
ALTER TYPE "public"."Category" RENAME TO "Category_old";
ALTER TYPE "public"."Category_new" RENAME TO "Category";
DROP TYPE "public"."Category_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Gender_new" AS ENUM ('M', 'F', 'Unisex');
ALTER TABLE "public"."Product" ALTER COLUMN "gender" DROP DEFAULT;
ALTER TABLE "public"."Product" ALTER COLUMN "gender" TYPE "public"."Gender_new" USING ("gender"::text::"public"."Gender_new");
ALTER TYPE "public"."Gender" RENAME TO "Gender_old";
ALTER TYPE "public"."Gender_new" RENAME TO "Gender";
DROP TYPE "public"."Gender_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Season_new" AS ENUM ('mid_season', 'hot', 'cold');
ALTER TABLE "public"."Product" ALTER COLUMN "season" DROP DEFAULT;
ALTER TABLE "public"."Product" ALTER COLUMN "season" TYPE "public"."Season_new" USING ("season"::text::"public"."Season_new");
ALTER TYPE "public"."Season" RENAME TO "Season_old";
ALTER TYPE "public"."Season_new" RENAME TO "Season";
DROP TYPE "public"."Season_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "public"."Size_new" AS ENUM ('zero_months', 'one_month', 'three_months', 'six_months', 'nine_months', 'twelve_months', 'eighteen_months', 'twenty_four_months', 'two_years', 'three_years', 'four_years', 'five_years', 'six_years');
ALTER TABLE "public"."Product" ALTER COLUMN "size" DROP DEFAULT;
ALTER TABLE "public"."Product" ALTER COLUMN "size" TYPE "public"."Size_new" USING ("size"::text::"public"."Size_new");
ALTER TYPE "public"."Size" RENAME TO "Size_old";
ALTER TYPE "public"."Size_new" RENAME TO "Size";
DROP TYPE "public"."Size_old";
COMMIT;

-- AlterTable
ALTER TABLE "public"."Product" ALTER COLUMN "gender" DROP DEFAULT,
ALTER COLUMN "season" DROP DEFAULT,
ALTER COLUMN "category" DROP DEFAULT,
ALTER COLUMN "size" DROP DEFAULT,
ALTER COLUMN "brand" DROP DEFAULT;
