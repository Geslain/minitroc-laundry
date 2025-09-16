import EditProductForm from "./components/edit-product-form";
import {notFound} from "next/navigation";
import {getProduct} from "@/app/actions/products";

export default async function EditProductPage({params}: { params: Promise<{ id: string }> }) {
    const {id} = await params
    const product = await getProduct(id)

    if (!product) {
        notFound();
    }

    return <EditProductForm product={product}/>;
}
