import {SignOutButton} from "@/components/sign-out-button";
import Link from "next/link";

export default function DashboardLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className={"min-h-screen w-full"}>
        <header className={"flex justify-between p-4 items-center"}>
            <div className={'flex gap-4'}>
                <span><Link href={"/dashboard"}>Minitroc Laundry</Link></span>
                <ul className={"list-none flex gap-4"}>
                    <li><Link href={"/dashboard/products/new"}>Nouveau produit</Link></li>
                    <li><Link href={"/dashboard/products"}>Liste produits</Link></li>
                </ul>
            </div>
            <SignOutButton/>
        </header>
        <main>
            {children}
        </main>
    </div>
}