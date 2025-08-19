import ProductCard from "@/components/product-card";
import {getProducts} from "@/app/actions/products";
import ExportCSVButton from "@/components/export-csv-button";
import DeleteAllProductsButton from "@/components/delete-all-products-button";

export default async function ProductsPage() {
    const products = await getProducts()

    return <div className="container mx-auto px-4 py-8">
        <div className={"flex justify-between  mb-6"}>
            <h1 className="text-3xl font-bold">Produits</h1>
            <div className={"flex gap-2"}>
                <ExportCSVButton/>
                <DeleteAllProductsButton productCount={products.length}/>
            </div>
        </div>

        {products.length === 0 ? (
            <div className="text-center py-10">
                <p className="text-gray-500">Aucun produit trouvé</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        )}
    </div>
}