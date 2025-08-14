"use client";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {NewProductSchema} from "@/lib/validators/product";

type FormValues = z.input<typeof NewProductSchema>;

export default function NewProductForm() {
    const {control, register, handleSubmit, formState: {errors, isSubmitting}, reset} =
        useForm<FormValues>({
            resolver: zodResolver(NewProductSchema)
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
            } else if (k === "season" && v === "all seasons") {
                fd.append(k, "all_seasons"); // Conversion du format
            } else {
                fd.append(k, String(v ?? ""));
            }
        });

        try {
            const res = await fetch("/api/products", {method: "POST", body: fd});
            if (!res.ok) {
                const errorData = await res.json();
                console.error(errorData);
                alert(`Erreur: ${errorData.message || 'Une erreur est survenue'}`);
                return;
            }
            reset();
            alert("Produit créé ✅");
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            alert("Erreur lors de la communication avec le serveur");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <input placeholder="Name" {...register("name")} />
            <textarea placeholder="Description" {...register("description")} />
            <input type="number" step="0.01" placeholder="Price" {...register("price")} />
            <select {...register("gender")}>
                <option value="">(vide)</option>
                <option value="M">M</option>
                <option value="F">F</option>
                <option value="Unisex">Unisex</option>
            </select>
            <input placeholder="Category" {...register("category")} />
            <input placeholder="Size" {...register("size")} />
            <select {...register("season")}>
                <option value="">(vide)</option>
                <option value="summer">Été</option>
                <option value="winter">Hiver</option>
                <option value="autumn">Automne</option>
                <option value="spring">Printemps</option>
                <option value="all seasons">Toutes saisons</option>
            </select>
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
                        />
                    );
                }}
            />
            {errors.photo && <p className="text-red-500">{errors.photo.message as string}</p>}
            <button type="submit" disabled={isSubmitting}
                    className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Créer
            </button>
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}
        </form>
    );
}