"use client";
import { SignUp } from "@clerk/nextjs";

export default function Page() {
    return (
        <main className="min-h-screen grid place-items-center p-6">
            <SignUp
                appearance={{ variables: { colorPrimary: "#111" } }}
                fallbackRedirectUrl="/dashboard"
            />
        </main>
    );
}