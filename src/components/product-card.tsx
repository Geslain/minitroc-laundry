"use client"
import Image from 'next/image';
import {Product} from '@prisma/client';
import {deleteProduct} from "@/app/actions/products";
import {toast} from "react-toastify";
import {TrashIcon} from "lucide-react";
import {brandLabels, categoryLabels, genderLabels, seasonLabels, sizeLabels} from "@/lib/product";
import Button from "@/components/button";
import {steps} from "@/lib/step";

type ProductCardProps = {
    product: Product;
};

export default function ProductCard({product}: Readonly<ProductCardProps>) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(price);
    };

    const handleDelete = async () => {
        const response = await deleteProduct(product.id)

        if ("error" in response) {
            toast(`Erreur lors de la suppression: ${response.error}`, {type: "error"});
            return;
        }

        toast("Produit supprimé", {type: "success"});
    }

    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg flex flex-col">
            <div className="relative h-48 w-full">
                <Image
                    src={product.photo}
                    alt={product.name}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="p-4 flex flex-col grow">
                <h3 className="text-lg font-semibold truncate">{product.name}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description ?? 'Aucune description'}</p>

                <div className="mt-3 flex flex-wrap gap-2">
            <span className={`px-2 py-1 text-blue-800 text-xs rounded-full ${steps.gender.color}`}>
              {genderLabels[product.gender]}
            </span>
                    <span className={`px-2 py-1 text-green-800 text-xs rounded-full ${steps.season.color}`}>
              {seasonLabels[product.season]}
            </span>


                    {product.category && (
                        <span className={`px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full ${steps.category.color}`}>
              {categoryLabels[product.category]}
            </span>
                    )}

                    {product.brand && (
                        <span className={`px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full ${steps.brand.color}`}>
              {brandLabels[product.brand]}
            </span>
                    )}

                    <span className={`px-2 py-1 bg-amber-100 text-gray-800 text-xs rounded-full ${steps.size.color}`}>
            {sizeLabels[product.size]}
          </span>
                </div>

                <div className="mt-4 flex justify-between grow items-end">
                    <span className="text-xl font-bold text-indigo-600">{formatPrice(product.price)}</span>
                    <Button icon={TrashIcon} variant={"danger"} onClick={() => handleDelete()}/>
                </div>
            </div>
        </div>
    );
}
