import {brandLabels, categoryLabels, genderLabels, seasonLabels, sizeLabels, stateLabels} from "@/lib/product";
import {Brand, Category, Gender, Season, Size, State} from "@prisma/client";
import {StepName} from "@/types/step";

export const productAttributes : Record<StepName | "price", { label: string, words?: string[], color: string, formatter?: (value: never) => string}>= {
    name: {
        label: "Nom",
        words: ["nom du produit", "nom"],
        color: "bg-red-100"
    },
    description: {
        label: "Description",
        words: ["description du produit", "description"],
        color: "bg-green-100"
    },
    category: {
        label: "Catégorie",
        color: "bg-purple-100",
        formatter: (value: Category) => categoryLabels[value] || "-"
    },
    brand: {
        label: "Marque",
        words: ["marque", "marc"],
        color: "bg-orange-100",
        formatter: (value: Brand) => brandLabels[value] || "-"
    },
    gender: {
        label: "Genre",
        words: ["genre", "sexe"],
        color: "bg-blue-100",
        formatter: (value: Gender) => genderLabels[value] || "-"
    },
    state: {
        label: "État",
        color: "bg-lime-100",
        formatter: (value: State) => stateLabels[value] || "-"
    },
    size: {
        label: "Taille",
        color: "bg-amber-100",
        formatter: (value: Size) => sizeLabels[value] || "-"
    },
    season: {
        label: "Saison",
        color: "bg-pink-100",
        formatter: (value: Season) => seasonLabels[value] || "-"
    },
    price: {
        label: "Prix",
        color: "bg-yellow-100",
        formatter: (value: number) => `${value}€`
    },
    photo: {
        label: "Photo",
        words: ['Photo', 'Photos'],
        color: "bg-gray-100",
        formatter: (value: string) => value ? "✓ Photo ajoutée" : "✗ Pas de photo"
    }
}