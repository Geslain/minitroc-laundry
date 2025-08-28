/*
  Warnings:

  - The values [monoprix] on the enum `Brand` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Brand_new" AS ENUM ('jacadi', 'petit_bateau', 'sergent_major', 'zara', 'hm', 'kiabi', 'no_name', 'bonpoint', 'tartine_et_chocolat', 'bonton', 'okaidi', 'dpam', 'tape_a_loeil', 'vertbaudet', 'catimini', 'ca', 'tex_carrefour', 'in_extenso_auchan', 'gemo', 'zeeman', 'primark', 'lidl', 'la_redoute', 'orchestra', 'grain_de_ble', 'boutchou_monoprix', 'ikks', 'absorba', 'natalys', 'bebel', 'shein', 'uniqlo', 'benetton', 'Empty');
ALTER TABLE "public"."Product" ALTER COLUMN "brand" DROP DEFAULT;
ALTER TABLE "public"."Product" ALTER COLUMN "brand" TYPE "public"."Brand_new" USING ("brand"::text::"public"."Brand_new");
ALTER TYPE "public"."Brand" RENAME TO "Brand_old";
ALTER TYPE "public"."Brand_new" RENAME TO "Brand";
DROP TYPE "public"."Brand_old";
ALTER TABLE "public"."Product" ALTER COLUMN "brand" SET DEFAULT 'Empty';
COMMIT;
