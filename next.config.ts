import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [new URL('https://melpdnoeiuvhrpvqtrvy.supabase.co/**')],
    },
};

export default nextConfig;
