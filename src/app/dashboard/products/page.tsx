import ProductCard from "@/components/product-card";
import {PrismaClient, Product} from "@prisma/client";
import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";

type Props = {
    products: Product[];
}

export default async function ProductsPage() {
    const { userId } = await auth();
    const prisma = new PrismaClient()

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.upsert({
        where: { clerkUserId: userId },
        update: {},
        create: { clerkUserId: userId },
    });

    const products = await prisma.product.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });

    return <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Produits</h1>

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