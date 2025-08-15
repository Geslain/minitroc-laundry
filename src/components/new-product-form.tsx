"use client";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {newProductSchema} from "@/lib/validators/product";
import {addProduct} from "@/app/actions/products";
import {toast} from "react-toastify";
import Camera from "./camera";
import {categoryLabels, genderLabels, seasonLabels} from "@/lib/product";
import {Category, Gender, Season} from "@prisma/client";

type FormValues = z.input<typeof newProductSchema>;
export default function NewProductForm() {
    const {control, register, handleSubmit, formState: {errors, isSubmitting}, reset, setValue, getValues} =
        useForm<FormValues>({
            resolver: zodResolver(newProductSchema),
            defaultValues: {
                category: Category.Empty,
                gender: Gender.Empty,
                season: Season.Empty,
            }
        });

    const onSubmit = async (values: FormValues) => {
        const fd = new FormData();
        Object.entries(values).forEach(([k, v]) => {
            if (k === "photo" && v instanceof File) {
                fd.append("photo", v);
            } else if (k === "gender" && v === "") {
                fd.append(k, "Empty"); // Convertit les valeurs vides en Empty pour l'enum Gender
            } else if (k === "season" && v === "") {
                fd.append(k, "Empty"); // Convertit les valeurs vides en Empty pour l'enum Season
            } else {
                fd.append(k, String(v ?? ""));
            }
        });

        try {
            const response = await addProduct(fd);
            if ("error" in response) {
                toast(`Erreur: ${response.error || 'Une erreur est survenue'}`, {type: "error"});
                return;
            }
            reset();
            toast("Produit créé ✅", {type: "success"});
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            toast("Erreur lors de la communication avec le serveur", {type: "error"});
        }
    };

    function handleCapture(imageSrc: Blob) {
        setValue("photo", new File([imageSrc], "temp"))
    }

    return (
        <div className={"grid grid-cols-2"}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <input placeholder="Name" {...register("name")} className={errors.name ? "border-red-500" : ""}/>
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <textarea placeholder="Description" {...register("description")}
                              className={errors.description ? "border-red-500" : ""}/>
                    {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <input type="number" step="0.01" placeholder="Price" {...register("price")}
                           className={errors.price ? "border-red-500" : ""}/>
                    {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <select {...register("gender")} className={errors.gender ? "border-red-500" : getValues("gender") === Gender.Empty ? "text-gray-400" : ""}>
                        {Object.entries(genderLabels).map(([key, value]) => (<option key={key} value={key} disabled={!value}>{value || "(Sélectionnez un genre)"}</option>))}
                    </select>
                    {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <select {...register("category")} className={errors.category ? "border-red-500" : getValues("category") === Category.Empty ? "text-gray-400" : ""}>
                        {Object.entries(categoryLabels).map(([key, value]) => (<option key={key} value={key} disabled={!value}>{value || "(Sélectionnez une catégorie)"}</option>))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <input placeholder="Size" {...register("size")} className={errors.size ? "border-red-500" : ""}/>
                    {errors.size && <p className="text-red-500 text-sm">{errors.size.message}</p>}
                </div>

                <div className="flex flex-col gap-1">
                    <select {...register("season")} className={errors.season ? "border-red-500" : getValues("season") === Season.Empty ? "text-gray-400" : ""}>
                        {Object.entries(seasonLabels).map(([key, value]) => (<option key={key} value={key} disabled={!value}>{value || "(Sélectionnez une saison)"}</option>))}
                    </select>
                    {errors.season && <p className="text-red-500 text-sm">{errors.season.message}</p>}
                </div>
                <div className="flex flex-col gap-1">
                    <Controller
                        name="photo"
                        control={control}
                        render={({field: {ref, name, onBlur, onChange}}) => {
                            return (
                                <input
                                    type="file"
                                    ref={ref}
                                    accept="image/*"
                                    name={name}
                                    onBlur={onBlur}
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        onChange(file);
                                    }}
                                    className={errors.photo ? "border-red-500" : ""}
                                />
                            );
                        }}
                    />
                    {errors.photo && <p className="text-red-500 text-sm">{errors.photo.message}</p>}
                </div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                    {isSubmitting ? "Création en cours..." : "Créer"}
                </button>

            </form>
            <div>
                <Camera onCapture={handleCapture}/>
            </div>
        </div>
    );
}