"use client"
import Image from 'next/image';
import { Product } from '@prisma/client';
import { GenderType, SeasonType } from '../../prisma/generated/zod';
import {deleteProduct} from "@/app/actions/products";
import {toast} from "react-toastify";
import {TrashIcon} from "lucide-react";

type ProductCardProps = {
  product: Product;
};

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(price);
  };

  const translateGender = (gender: GenderType) => {
    const translations: Record<GenderType, string> = {
      M: 'Homme',
      F: 'Femme',
      Unisex: 'Unisexe',
      Empty: ''
    };
    return translations[gender];
  };

  const translateSeason = (season: SeasonType) => {
    const translations: Record<SeasonType, string> = {
      summer: 'Été',
      winter: 'Hiver',
      autumn: 'Automne',
      spring: 'Printemps',
      all_seasons: 'Toutes saisons',
      Empty: ''
    };
    return translations[season];
  };

  const handleDelete = async () => {
    const response = await deleteProduct(product.id)

    if("error" in response) {
      toast(`Erreur lors de la suppression: ${response.error}`, { type: "error" });
      return;
    }

    toast("Produit supprimé", { type: "success" });
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg">
      <div className="relative h-48 w-full">
        <Image 
          src={product.photo} 
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold truncate">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description || 'Aucune description'}</p>

        <div className="mt-3 flex flex-wrap gap-2">
          {product.gender !== 'Empty' && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              {translateGender(product.gender as GenderType)}
            </span>
          )}

          {product.season !== 'Empty' && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              {translateSeason(product.season as SeasonType)}
            </span>
          )}

          {product.category && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
              {product.category}
            </span>
          )}

          <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
            {product.size}
          </span>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-indigo-600">{formatPrice(product.price)}</span>
          <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors" onClick={() => handleDelete()}>
            <TrashIcon className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
