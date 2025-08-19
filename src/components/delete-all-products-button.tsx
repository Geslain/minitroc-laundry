"use client";
import { useState } from "react";
import { toast } from "react-toastify";
import { deleteAllProducts } from "@/app/actions/products";
import Button from "./button";
import { Trash2Icon } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isDeleting: boolean;
    productCount: number;
}

function ConfirmationModal({ isOpen, onClose, onConfirm, isDeleting, productCount }: ConfirmationModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                    <Trash2Icon className="w-6 h-6 text-red-600" />
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                    Supprimer tous les produits ?
                </h3>
                
                <p className="text-sm text-gray-500 text-center mb-6">
                    Cette action supprimera définitivement tous vos {productCount} produit(s) 
                    et leurs images associées. Cette action est irréversible.
                </p>
                
                <div className="flex space-x-4">
                    <button
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                    >
                        {isDeleting ? "Suppression..." : "Supprimer tout"}
                    </button>
                </div>
            </div>
        </div>
    );
}

interface DeleteAllProductsButtonProps {
    productCount: number;
    disabled?: boolean;
}

export default function DeleteAllProductsButton({ productCount, disabled = false }: DeleteAllProductsButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        
        try {
            const result = await deleteAllProducts();
            
            if (!result.success) {
                toast(`Erreur: ${result.error}`, { type: "error" });
                return;
            }

            toast(result.message || "Tous les produits ont été supprimés ✅", { type: "success" });
            setShowConfirmation(false);
            
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            toast("Erreur lors de la suppression des produits", { type: "error" });
        } finally {
            setIsDeleting(false);
        }
    };

    const handleClick = () => {
        if (productCount === 0) {
            toast("Aucun produit à supprimer", { type: "info" });
            return;
        }
        setShowConfirmation(true);
    };

    return (
        <>
            <Button
                onClick={handleClick}
                disabled={disabled || isDeleting || productCount === 0}
                icon={Trash2Icon}
                label={
                    productCount === 0 
                        ? "Aucun produit" 
                        : isDeleting 
                            ? "Suppression..." 
                            : `Supprimer tout (${productCount})`
                }
                variant="danger"
                className="relative"
            />
            
            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                productCount={productCount}
            />
        </>
    );
}
