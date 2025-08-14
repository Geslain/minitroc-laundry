import {z} from "zod";
import {GenderSchema, SeasonSchema} from "../../../prisma/generated/zod";

export const NewProductSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    price: z.number().min(0, "Le prix doit être positif"),
    gender: z.enum(["", ...GenderSchema.options]).default(""),
    category: z.string().optional(),
    size: z.string().min(1, "La taille est requise"),
    season: z.enum(["", ...SeasonSchema.options.filter(s => s !== "Empty")]).default(""),
    photo: z.union([
        z.instanceof(File, {message: "Image requise"})
            .refine(file => !file || file.size !== 0 || file.size <= 5000000, {message: "Taille maximale dépassée"}),
        z.string().optional()
    ])
        .refine(value => value instanceof File || typeof value === "string", {
            message: "Image requise"
        }),
});