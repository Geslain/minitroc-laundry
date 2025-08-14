import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const createSchema = z.object({
    name: z.string().trim().min(1),
    description: z.string().trim().optional().or(z.literal("")),
    price: z.coerce.number().min(0),
    gender: z.enum(["M","F","Unisex",""]).default(""),
    category: z.string().trim().optional().or(z.literal("")),
    size: z.string().trim().min(1),
    season: z.enum(["summer","winter","autumn","spring","all seasons",""]).default(""),
});

function mapGender(g: string) {
    if (!g) return "Empty";
    if (g === "Unisex") return "Unisex";
    if (g === "M" || g === "F") return g;
    return "Empty";
}
function mapSeason(s: string) {
    if (!s) return "Empty";
    if (s === "all seasons") return "all_seasons";
    if (["summer","winter","autumn","spring"].includes(s)) return s as any;
    return "Empty";
}

export async function GET(req: NextRequest) {
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
    return NextResponse.json({ products });
}

export async function POST(req: NextRequest) {
    const { userId } = await auth();

    const prisma = new PrismaClient()

    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.upsert({
        where: { clerkUserId: userId },
        update: {},
        create: { clerkUserId: userId },
    });

    // multipart form
    const form = await req.formData();
    const file = form.get("photo") as File | null;
    if (!file) return NextResponse.json({ error: "Missing photo" }, { status: 400 });

    // champs textuels
    const data = {
        name: String(form.get("name") || ""),
        description: String(form.get("description") || ""),
        price: Number(form.get("price") || 0),
        gender: String(form.get("gender") || ""),
        category: String(form.get("category") || ""),
        size: String(form.get("size") || ""),
        season: String(form.get("season") || ""),
    };
    const parsed = createSchema.safeParse(data);
    if (!parsed.success) {
        return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    // Upload Supabase Storage
    const supabase = supabaseServer();
    const arrayBuf = await file.arrayBuffer();
    const photoKey = `photos/${user.id}/${Date.now()}-${file.name}`;
    const { error: upErr } = await supabase
        .storage
        .from("photos")
        .upload(photoKey, arrayBuf, { contentType: file.type, upsert: false });
    if (upErr) return NextResponse.json({ error: upErr.message }, { status: 400 });

    const { data: publicUrlData } = supabase.storage.from("photos").getPublicUrl(photoKey);
    const photoUrl = publicUrlData.publicUrl;

    const product = await prisma.product.create({
        data: {
            userId: user.id,
            name: parsed.data.name.trim(),
            description: parsed.data.description?.trim() ?? null,
            price: parsed.data.price,
            gender: mapGender(parsed.data.gender),
            category: parsed.data.category?.trim() ?? null,
            size: parsed.data.size.trim(),
            season: mapSeason(parsed.data.season),
            photo: photoUrl,
            photoKey: photoKey,
        },
    });

    return NextResponse.json({ ok: true, product }, { status: 201 });
}