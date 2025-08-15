import {z} from "zod";
import {CategorySchema, GenderSchema, SeasonSchema, SizeSchema, StatusSchema, StateSchema, BrandSchema} from "../../../prisma/generated/zod";
import {mapCategory, mapGender, mapSeason, mapSize, mapStatus, mapState, mapBrand} from "../product";
import {Season, Category, Gender, Size, Status, State, Brand} from "@prisma/client";

export const newProductSchema = z.object({
    name: z.string().min(1, "Le nom est requis"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Le prix doit être positif"),
    gender: z.enum(GenderSchema.options).default(Gender.Empty),
    category: z.enum(CategorySchema.options).default(Category.Empty),
    size: z.enum(SizeSchema.options).default(Size.Empty),
    season: z.enum(SeasonSchema.options).default(Season.Empty),
    status: z.enum(StatusSchema.options).default(Status.collected),
    state: z.enum(StateSchema.options).default(State.donation),
    brand: z.enum(BrandSchema.options).default(Brand.Empty),
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
    status: z.string().transform(mapStatus),
    state: z.string().transform(mapState),
    brand: z.string().transform(mapBrand),
});
