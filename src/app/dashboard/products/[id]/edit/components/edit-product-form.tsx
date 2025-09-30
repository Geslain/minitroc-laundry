"use client";
import {Product} from "@prisma/client";
import {useEffect, useRef, useState} from "react";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import {useForm} from "react-hook-form";
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
import {calculatePrice} from "@/lib/price";
import Camera from "@/components/camera";
import {updateProduct} from "@/app/actions/products";
import {newProductSchema} from "@/lib/validators/product";
import {z} from "zod";

export type FormValues = z.input<typeof newProductSchema>

export default function EditProductForm({product}: { product: Product }) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(product.photo);
    const takePhotoRef = useRef<HTMLButtonElement>(null);
    const clearPhotoRef = useRef<HTMLButtonElement>(null);
    const [photoFile, setPhotoFile] = useState<File | null>(null);

    const {register, handleSubmit, setValue, watch, formState: {errors}} = useForm<FormValues>({
        defaultValues: {
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

    // Observer les changements pour calculer le prix automatiquement
    const category = watch("category");
    const brand = watch("brand");
    const state = watch("state");

    useEffect(() => {
        if (category && brand && state) {
            const newPrice = calculatePrice(brand, category, state);
            setValue("price", newPrice);
        }
    }, [category, brand, state, setValue]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCameraCapture = (imageSrc: Blob | undefined) => {
        if (imageSrc) {
            const file = new File([imageSrc], "photo.jpg", {type: "image/jpeg"});
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setPhotoFile(null);
            setPreviewImage(product.photo);
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

            // Ajouter la photo si elle existe (soit de l'input file soit de la caméra)
            if (photoFile) {
                formData.append('photo', photoFile);
            }

            const result = await updateProduct(product.id, formData);

            if ('error' in result) {
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
        <div className={"flex justify-center h-full w-full p-5"}>
            <div className="max-w-6xl mx-auto p-4 bg-white rounded-lg shadow-md flex flex-col overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold">Modifier le produit</h1>
                        <p className="text-gray-500 mt-1">ID: <span
                            className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">{product.id}</span></p>
                    </div>
                    <div className="flex space-x-4">
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
                            onClick={handleSubmit(onSubmit)}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}
                      className="flex flex-col md:flex-row gap-6 flex-grow overflow-hidden h-full">
                    {/* Colonne de gauche - Informations produit */}
                    <div className="md:w-2/3 overflow-y-auto pr-4 max-h-[calc(100vh-180px)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Colonne de gauche */}
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-medium text-gray-700 mb-0.5">
                                        Nom du produit *
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        {...register("name", {required: "Le nom est requis"})}
                                        className="w-full p-2 border rounded-md"
                                    />
                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="description"
                                           className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        {...register("description")}
                                        className="w-full p-1.5 border rounded-md h-16 text-sm"
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
                                        {...register("price", {valueAsNumber: true})}
                                        className="w-full p-2 border rounded-md bg-gray-100"
                                        disabled
                                    />
                                    <p className="text-xs text-gray-500 mt-0.5">Prix calculé automatiquement</p>
                                </div>

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Catégorie *
                                    </label>
                                    <select
                                        id="category"
                                        {...register("category", {required: "La catégorie est requise"})}
                                        className="w-full p-1.5 border rounded-md text-sm"
                                    >
                                        {Object.entries(categoryLabels).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    {errors.category &&
                                        <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
                                        Marque *
                                    </label>
                                    <select
                                        id="brand"
                                        {...register("brand", {required: "La marque est requise"})}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        {Object.entries(brandLabels).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    {errors.brand &&
                                        <p className="text-red-500 text-sm mt-1">{errors.brand.message}</p>}
                                </div>
                            </div>

                            {/* Colonne de droite */}
                            <div className="space-y-3">
                                <div>
                                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                                        Genre *
                                    </label>
                                    <select
                                        id="gender"
                                        {...register("gender", {required: "Le genre est requis"})}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        {Object.entries(genderLabels).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    {errors.gender &&
                                        <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                                        Taille *
                                    </label>
                                    <select
                                        id="size"
                                        {...register("size", {required: "La taille est requise"})}
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
                                        {...register("season", {required: "La saison est requise"})}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        {Object.entries(seasonLabels).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    {errors.season &&
                                        <p className="text-red-500 text-sm mt-1">{errors.season.message}</p>}
                                </div>

                                <div>
                                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                        État *
                                    </label>
                                    <select
                                        id="state"
                                        {...register("state", {required: "L'état est requis"})}
                                        className="w-full p-2 border rounded-md"
                                    >
                                        {Object.entries(stateLabels).map(([value, label]) => (
                                            <option key={value} value={value}>{label}</option>
                                        ))}
                                    </select>
                                    {errors.state &&
                                        <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
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
                    </div>

                    {/* Colonne droite - Section Photo */}
                    <div
                        className="md:w-1/3 md:pl-6 md:border-l border-gray-200 overflow-y-auto max-h-[calc(100vh-180px)]">
                        <h2 className="text-lg font-semibold mb-3">Photo du produit</h2>

                        <div className="flex flex-col gap-6 justify-center items-center">
                            {/* Aperçu de l'image */}
                            {previewImage && (
                                <div className="relative overflow-hidden rounded-md" style={{ width: 400, height: 400 }}>
                                    <Image
                                        src={previewImage}
                                        alt="Preview"
                                        fill
                                        style={{ objectFit: "contain" }} // conserve l'orientation
                                    />
                                </div>
                            )}

                            {/* Options de photo */}
                            <div className="flex flex-col gap-4">
                                {/* Input file */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Télécharger une image
                                    </label>
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
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        Laissez vide pour conserver l&apos;image actuelle
                                    </p>
                                </div>

                                {/* Ou utiliser la caméra */}
                                <div className="mt-2">
                                    <p className="text-xs font-medium text-gray-700 mb-1">Ou prendre une photo avec la
                                        caméra</p>
                                    <Camera
                                        onCapture={handleCameraCapture}
                                        takePhotoRef={takePhotoRef}
                                        clearPhotoRef={clearPhotoRef}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
