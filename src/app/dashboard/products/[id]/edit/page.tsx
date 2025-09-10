import EditProductForm from "./components/edit-product-form";
import {notFound} from "next/navigation";
import {getProduct} from "@/app/actions/products";

export default async function EditProductPage({params}: {params: {id: string}}) {
    const product = await getProduct(params.id,)

    if (!product) {
        notFound();
    }

    return <EditProductForm product={product} />;
}
