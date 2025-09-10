"use client";
import { Product } from "@prisma/client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import Button from "@/components/button";
import {
    brandLabels,
    categoryLabels,
    genderLabels,
    seasonLabels,
    sizeLabels,
    stateLabels,
    statusLabels
} from "@/lib/product";
import Image from "next/image";

type FormValues = {
    id: string;
    name: string;
    description: string;
    category: string;
    gender: string;
    season: string;
    size: string;
    status: string;
    brand: string;
    state: string;
    price: number;
    photo?: File;
};

export default function EditProductForm({ product }: { product: Product }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(product.photo);

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        defaultValues: {
            id: product.id,
            name: product.name,
            description: product.description || "",
            category: product.category,
            gender: product.gender,
            season: product.season,
            size: product.size,
            status: product.status,
            brand: product.brand,
            state: product.state,
            price: product.price,
        }
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data: FormValues) => {
        setIsSubmitting(true);

        try {
            const formData = new FormData();

            // Ajouter tous les champs au FormData
            Object.entries(data).forEach(([key, value]) => {
                if (key !== 'photo') {
                    formData.append(key, String(value));
                }
            });

            // Ajouter la photo si elle existe
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput?.files?.[0]) {
                formData.append('photo', fileInput.files[0]);
            }

            const response = await fetch('/api/products/update', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success('Produit mis à jour avec succès');
                router.push('/dashboard/products');
                router.refresh();
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour:', error);
            toast.error('Une erreur est survenue lors de la mise à jour');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-6">Modifier le produit</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input type="hidden" {...register("id")} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne de gauche */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Nom du produit *
                            </label>
                            <input
                                id="name"
                                type="text"
                                {...register("name", { required: "Le nom est requis" })}
                                className="w-full p-2 border rounded-md"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                id="description"
                                {...register("description")}
                                className="w-full p-2 border rounded-md h-20"
                            />
                        </div>

                        <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                                Prix (€)
                            </label>
                            <input
                                id="price"
                                type="number"
                                step="0.01"
                                {...register("price", { valueAsNumber: true })}
                                className="w-full p-2 border rounded-md"
                            />
                        </div>

                        <div>
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                Catégorie *
                            </label>
                            <select
                                id="category"
                                {...register("category", { required: "La catégorie est requise" })}
                                className="w-full p-2 border rounded-md"
                            >
                                {Object.entries(categoryLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                                Marque *
                            </label>
                            <select
                                id="brand"
                                {...register("brand", { required: "La marque est requise" })}
                                className="w-full p-2 border rounded-md"
                            >
                                {Object.entries(brandLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {errors.brand && <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                        </div>
                    </div>

                    {/* Colonne de droite */}
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                Genre *
                            </label>
                            <select
                                id="gender"
                                {...register("gender", { required: "Le genre est requis" })}
                                className="w-full p-2 border rounded-md"
                            >
                                {Object.entries(genderLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                                Taille *
                            </label>
                            <select
                                id="size"
                                {...register("size", { required: "La taille est requise" })}
                                className="w-full p-2 border rounded-md"
                            >
                                {Object.entries(sizeLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {errors.size && <p className="text-red-500 text-sm mt-1">{errors.size.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="season" className="block text-sm font-medium text-gray-700 mb-1">
                                Saison *
                            </label>
                            <select
                                id="season"
                                {...register("season", { required: "La saison est requise" })}
                                className="w-full p-2 border rounded-md"
                            >
                                {Object.entries(seasonLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {errors.season && <p className="text-red-500 text-sm mt-1">{errors.season.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                État *
                            </label>
                            <select
                                id="state"
                                {...register("state", { required: "L'état est requis" })}
                                className="w-full p-2 border rounded-md"
                            >
                                {Object.entries(stateLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                            {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Statut
                            </label>
                            <select
                                id="status"
                                {...register("status")}
                                className="w-full p-2 border rounded-md"
                            >
                                {Object.entries(statusLabels).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Section Photo */}
                <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Photo
                    </label>

                    <div className="flex items-start gap-6">
                        {/* Aperçu de l'image */}
                        {previewImage && (
                            <div className="relative w-32 h-32 overflow-hidden rounded-md">
                                <Image
                                    src={previewImage}
                                    alt="Aperçu du produit"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        {/* Input file */}
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-md file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Laissez vide pour conserver l'image actuelle
                            </p>
                        </div>
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-4 mt-8">
                    <Button
                        type="button"
                        variant="none"
                        label="Annuler"
                        onClick={() => router.push('/dashboard/products')}
                    />
                    <Button
                        type="submit"
                        variant="primary"
                        label={isSubmitting ? "Mise à jour..." : "Mettre à jour"}
                        disabled={isSubmitting}
                    />
                </div>
            </form>
        </div>
    );
}
