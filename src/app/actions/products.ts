"use server"
import prisma from "@/lib/db";
import {supabaseServer} from "@/lib/supabase-server";
import {getCurrentUser} from "@/lib/user";
import {revalidatePath} from "next/cache";
import { createSchema } from "@/lib/validators/product";
import {
    brandLabels,
    categoryLabels,
    genderLabels,
    seasonLabels,
    sizeLabels,
    stateLabels,
    statusLabels
} from "@/lib/product";

export async function getProduct(id: string) {
    const user = await getCurrentUser()

    return prisma.product.findUnique({
        where: {
            id,
            userId: user.id
        }
    });
}


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

    // text fields
    const data = {
        name: String(formData.getAll("name") || ""),
        description: String(formData.get("description") || ""),
        price: Number(formData.get("price") || 0),
        gender: String(formData.get("gender") || ""),
        category: String(formData.get("category") || ""),
        size: String(formData.get("size") || ""),
        season: String(formData.get("season") || ""),
        brand: String(formData.get("brand") || ""),
        status: String(formData.get("status") || ""),
        state: String(formData.get("state") || ""),
    };

    const parsed = createSchema.safeParse(data);
    if (!parsed.success) {
        console.log(parsed.error);
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

export async function deleteAllProducts() {
    try {
        const user = await getCurrentUser();
        const supabase = supabaseServer();

        // Get all products with their photoKeys
        const products = await prisma.product.findMany({
            where: { userId: user.id },
            select: { photoKey: true }
        });

        // Delete images from storage
        if (products.length > 0) {
            const photoKeys = products.map(p => p.photoKey).filter(Boolean);

            if (photoKeys.length > 0) {
                const { error: storageError } = await supabase.storage
                    .from("photos")
                    .remove(photoKeys);

                if (storageError) {
                    console.error('Erreur lors de la suppression des images:', storageError);
                    return {
                        success: false,
                        error: 'Erreur lors de la suppression des images'
                    };
                }
            }
        }

        // Delete all user's products
        const result = await prisma.product.deleteMany({
            where: { userId: user.id }
        });

        revalidatePath('/dashboard/products');

        return {
            success: true,
            deletedCount: result.count,
            message: `${result.count} produit(s) supprimé(s) avec succès`
        };

    } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        return {
            success: false,
            error: 'Une erreur est survenue lors de la suppression'
        };
    }
}


export async function exportProductsToCSV() {
    const user = await getCurrentUser();

    try {
        const products = await prisma.product.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: "desc" },
            select: {
                name: true,
                description: true,
                photo: true,
                price: true,
                gender: true,
                status: true,
                category: true,
                size: true,
                season: true,
                brand: true,
                state: true
            }
        });

        // CSV headers
        const headers = [
            'nom',
            'description',
            'image',
            'prix',
            'sexe',
            'statut',
            'categorie',
            'taille',
            'saison',
            'marque',
            'etat'
        ];

        // Data conversion
        const csvData = products.map(product => [
            `"${(product.name || '').replace(/"/g, '""')}"`,
            `"${(product.description ?? '').replace(/"/g, '""')}"`,
            `"${product.photo || ''}"`,
            product.price.toString(),
            `"${genderLabels[product.gender] || product.gender}"`,
            `"${statusLabels[product.status] || product.status}"`,
            `"${categoryLabels[product.category] || product.category}"`,
            `"${sizeLabels[product.size] || product.size}"`,
            `"${seasonLabels[product.season] || product.season}"`,
            `"${brandLabels[product.brand] || product.brand}"`,
            `"${stateLabels[product.state] || product.state}"`
        ]);

        // CSV construction
        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        // Add BOM for Excel compatibility with UTF-8 characters
        const csvWithBOM = '\uFEFF' + csvContent;

        return {
            success: true,
            data: csvWithBOM,
            filename: `products_export_${new Date().toISOString().split('T')[0]}.csv`
        };

    } catch (error) {
        console.error('Erreur lors de l\'export CSV:', error);
        return {
            success: false,
            error: 'Erreur lors de l\'export des produits'
        };
    }
}