import {z} from "zod";
import {CategorySchema, GenderSchema, SeasonSchema, SizeSchema} from "../../../prisma/generated/zod";
import {mapCategory, mapGender, mapSeason, mapSize} from "../product";

export const newProductSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Le prix doit être positif"),
    gender: z.enum( GenderSchema.options).default("Empty"),
    category: z.enum(CategorySchema.options).default("Empty"),
    size: z.enum(SizeSchema.options).default("Empty"),
    season: z.enum(SeasonSchema.options).default("Empty"),
    photo: z.union([
        z.instanceof(File, {message: "Image requise"})
            .refine(file => !file || file.size !== 0 || file.size <= 5000000, {message: "Taille maximale dépassée"}),
        z.string().optional()
    ])
        .refine(value => value instanceof File || typeof value === "string", {
            message: "Image requise"
        }),
});

export const createSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional().or(z.literal("")),
    price: z.coerce.number().min(0),
    gender: z.string().transform(mapGender),
    category: z.string().transform(mapCategory),
    size: z.string().transform(mapSize),
    season: z.string().transform(mapSeason),
});
