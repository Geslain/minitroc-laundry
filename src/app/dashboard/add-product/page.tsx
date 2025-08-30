import ProductFunnel from "@/components/product-funnel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajouter un produit | Minitroc",
  description: "Ajoutez facilement un nouveau produit de seconde main"
};

export default function AddProductPage() {
  return (
    <div className="container mx-auto">
      <ProductFunnel />
    </div>
  );
}
