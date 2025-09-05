import {SignOutButton} from "@/components/sign-out-button";
import Link from "next/link";
import {ToastContainer} from "react-toastify";
import Image from "next/image";

export default function DashboardLayout({children}: Readonly<{
    children: React.ReactNode;
}>) {
    return <div className={"min-h-screen w-full h-[100vh] flex flex-col"}>
        <ToastContainer />
        <header className={"flex justify-between px-3 py-1 items-center bg-blue-500 text-blue-100 text-shadow-md shadow-md"}>
            <div className={'flex gap-8 items-center'}>
                <span>
                    <Link href={"/dashboard"}><Image src={"/logo.png"} width={75} height={75} alt={"logo"}/></Link>
                </span>
                <ul className={"list-none flex gap-8"}>
                    <li className={"hover:text-blue-200 transition-transform hover:scale-105 text-lg"}><Link href={"/dashboard/products/new"}>Nouveau produit</Link></li>
                    <li className={"hover:text-blue-200 transition-transform hover:scale-105 text-lg"}><Link href={"/dashboard/products"}>Liste produits</Link></li>
                </ul>
            </div>
            <SignOutButton/>
        </header>
        <main className={"overflow-y-auto h-full mb-4"}>
            {children}
        </main>
    </div>
}