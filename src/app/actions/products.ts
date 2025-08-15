"use server"
import prisma from "@/lib/db";
import {supabaseServer} from "@/lib/supabaseServer";
import {getCurrentUser} from "@/lib/user";
import {revalidatePath} from "next/cache";
import { createSchema } from "@/lib/validators/product";

export async function getProducts() {
    const user = await getCurrentUser()

    return prisma.product.findMany({
        where: {userId: user.id},
        orderBy: {createdAt: "desc"},
    });
}

export async function addProduct(formData: FormData) {
    const user = await getCurrentUser()

    // multipart form
    const file = formData.get("photo") as File | null;
    if (!file) {
        return {error: "Missing photo"};
    }

    // champs textuels
    const data = {
        name: String(formData.getAll("name") || ""),
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
            ...parsed.data,
            photo: photoUrl,
            photoKey: photoKey,
        },
    });
}

export async function deleteProduct(id: string) {
    const user = await getCurrentUser()
    const supabase = supabaseServer();

    const product = await prisma.product.findUnique({
        where: { id, userId: user.id },
        select: { photoKey: true, name: true }
    });

    if (!product) {
       return { error: 'Produit non trouvé' };
    }

    const { error: storageError } = await supabase.storage
        .from("photos")
        .remove([product.photoKey]);

    if (storageError) {
        return {error: 'Erreur lors de la suppression du fichier:'};
    }

    await prisma.product.delete({
        where: { id, userId: user.id }
    })

    revalidatePath('/dashboard/products')
    return {
        success: true,
    }
}