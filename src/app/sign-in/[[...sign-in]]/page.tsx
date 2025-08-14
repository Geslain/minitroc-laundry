"use client";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
    return (
        <main className="min-h-screen grid place-items-center p-6">
            <SignIn
                appearance={{ variables: { colorPrimary: "#111" } }}
                fallbackRedirectUrl="/dashboard"
                signUpFallbackRedirectUrl="/dashboard"
            />
        </main>
    );
}