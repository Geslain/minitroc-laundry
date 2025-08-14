"use server"
import prisma from "@/lib/db";
import {supabaseServer} from "@/lib/supabaseServer";
import {getCurrentUser} from "@/lib/user";
import {z} from "zod";
import {mapGender, mapSeason} from "@/lib/product";

const createSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional().or(z.literal("")),
    price: z.coerce.number().min(0),
    gender: z.enum(["M", "F", "Unisex", ""]).default(""),
    category: z.string().trim().optional().or(z.literal("")),
    size: z.string().trim().min(1),
    season: z.enum(["summer", "winter", "autumn", "spring", "all seasons", ""]).default(""),
});

export async function getProducts() {
    const {userId} = await getCurrentUser()

    const user = await prisma.user.upsert({
        where: {clerkUserId: userId},
        update: {},
        create: {clerkUserId: userId},
    });

    return prisma.product.findMany({
        where: {userId: user.id},
        orderBy: {createdAt: "desc"},
    });
}

export async function addProduct(formData: FormData) {
    const {userId} = await getCurrentUser()

    const user = await prisma.user.upsert({
        where: {clerkUserId: userId},
        update: {},
        create: {clerkUserId: userId},
    });

    // multipart form
    const file = formData.get("photo") as File | null;
    if (!file) {
        return {error: "Missing photo"};
    }

    // champs textuels
    const data = {
        name: String(formData.get("name") || ""),
        description: String(formData.get("description") || ""),
        price: Number(formData.get("price") || 0),
        gender: String(formData.get("gender") || ""),
        category: String(formData.get("category") || ""),
        size: String(formData.get("size") || ""),
        season: String(formData.get("season") || ""),
    };
    const parsed = createSchema.safeParse(data);
    if (!parsed.success) {
        return { error: parsed.error.message };
    }

    // Upload Supabase Storage
    const supabase = supabaseServer();
    const arrayBuf = await file.arrayBuffer();
    const photoKey = `photos/${user.id}/${Date.now()}-${file.name}`;
    const {error: upErr} = await supabase
        .storage
        .from("photos")
        .upload(photoKey, arrayBuf, {contentType: file.type, upsert: false});
    if (upErr) return { error: upErr.message };

    const {data: publicUrlData} = supabase.storage.from("photos").getPublicUrl(photoKey);
    const photoUrl = publicUrlData.publicUrl;


    return prisma.product.create({
        data: {
            userId: user.id,
            name: parsed.data.name.trim(),
            description: parsed.data.description?.trim() ?? null,
            price: parsed.data.price,
            gender: mapGender(parsed.data.gender),
            category: parsed.data.category?.trim() ?? null,
            size: parsed.data.size.trim(),
            season: mapSeason(parsed.data.season),
            photo: photoUrl,
            photoKey: photoKey,
        },
    });
}