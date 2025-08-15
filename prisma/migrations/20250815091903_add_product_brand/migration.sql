-- CreateEnum
CREATE TYPE "public"."Brand" AS ENUM ('jacadi', 'petit_bateau', 'sergent_major', 'zara', 'hm', 'kiabi', 'no_name', 'bonpoint', 'tartine_et_chocolat', 'bonton', 'okaidi', 'dpam', 'tape_a_loeil', 'vertbaudet', 'catimini', 'ca', 'tex_carrefour', 'in_extenso_auchan', 'gemo', 'zeeman', 'primark', 'lidl', 'monoprix', 'la_redoute', 'orchestra', 'grain_de_ble', 'boutchou_monoprix', 'ikks', 'absorba', 'natalys', 'Empty');

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "brand" "public"."Brand" NOT NULL DEFAULT 'Empty';
