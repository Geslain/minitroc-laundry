"use server"
import prisma from "@/lib/db";
import { LocalStorage } from "@/lib/local-storage-service";
import {getCurrentUser} from "@/lib/user";
import {revalidatePath} from "next/cache";
import {createSchema} from "@/lib/validators/product";
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
        name: String(formData.get("name") || ""),
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
        return {error: parsed.error.message};
    }

    // Upload to local storage
    const uploadResult = await LocalStorage.uploadFile(file, user.id);
    if (!uploadResult.success) {
        return {error: uploadResult.error};
    }

    return prisma.product.create({
        data: {
            userId: user.id,
            ...parsed.data,
            photo: uploadResult.photoUrl!,
            photoKey: uploadResult.photoKey!,
        },
    });
}

export async function deleteProduct(id: string) {
    const user = await getCurrentUser()

    const product = await prisma.product.findUnique({
        where: {id, userId: user.id},
        select: {photoKey: true, name: true}
    });

    if (!product) {
        return {error: 'Produit non trouvé'};
    }

    const deleteResult = await LocalStorage.deleteFile(product.photoKey);
    if (!deleteResult.success) {
        return {error: 'Erreur lors de la suppression du fichier'};
    }

    await prisma.product.delete({
        where: {id, userId: user.id}
    })

    revalidatePath('/dashboard/products')
    return {
        success: true,
    }
}

export async function deleteAllProducts() {
    try {
        const user = await getCurrentUser();

        // Get all products with their photoKeys
        const products = await prisma.product.findMany({
            where: {userId: user.id},
            select: {photoKey: true}
        });

        // Delete images from storage
        if (products.length > 0) {
            const photoKeys = products.map(p => p.photoKey).filter(Boolean);

            if (photoKeys.length > 0) {
                const deleteResult = await LocalStorage.deleteFiles(photoKeys);
                if (!deleteResult.success) {
                    console.error('Erreur lors de la suppression des images:', deleteResult.error);
                    return {
                        success: false,
                        error: 'Erreur lors de la suppression des images'
                    };
                }
            }
        }

        // Delete all user's products
        const result = await prisma.product.deleteMany({
            where: {userId: user.id}
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

export async function updateProduct(id: string, formData: FormData) {
    const user = await getCurrentUser();
    if (!id) {
        return {error: "ID du produit manquant"};
    }

    const existingProduct = await prisma.product.findUnique({
        where: {id, userId: user.id},
        select: {photoKey: true}
    });

    if (!existingProduct) {
        return {error: "Produit non trouvé"};
    }

    const data = {
        name: String(formData.get("name") || ""),
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
        return {error: parsed.error.message};
    }

    const file = formData.get("photo") as File | null;
    let photoUrl = undefined;
    let photoKey = undefined;

    if (file && file.size > 0) {
        // Delete the old photo
        if (existingProduct.photoKey) {
            await LocalStorage.deleteFile(existingProduct.photoKey);
        }

        // Upload new photo
        const uploadResult = await LocalStorage.uploadFile(file, user.id);
        if (!uploadResult.success) {
            return {error: uploadResult.error};
        }

        photoUrl = uploadResult.photoUrl;
        photoKey = uploadResult.photoKey;
    }

    const updateData = {
        ...parsed.data,
        ...(photoUrl && {photo: photoUrl}),
        ...(photoKey && {photoKey: photoKey}),
    };

    const updatedProduct = await prisma.product.update({
        where: {id, userId: user.id},
        data: updateData
    });

    revalidatePath('/dashboard/products');
    return updatedProduct;
}

export async function exportProductsToCSV() {
    const user = await getCurrentUser();

    try {
        const products = await prisma.product.findMany({
            where: {userId: user.id},
            orderBy: {createdAt: "desc"},
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