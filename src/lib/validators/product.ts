import {z} from "zod";
import {CategorySchema, GenderSchema, SeasonSchema} from "../../../prisma/generated/zod";
import {mapCategory, mapGender, mapSeason} from "../product";

export const newProductSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Le prix doit être positif"),
    gender: z.enum(["", ...GenderSchema.options]).default(""),
    category: z.enum(["", ...CategorySchema.options]).default(""),
    size: z.string().min(1, "La taille est requise"),
    season: z.enum(["", ...SeasonSchema.options]).default(""),
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
    size: z.string().trim().min(1),
    season: z.string().transform(mapSeason),
});
