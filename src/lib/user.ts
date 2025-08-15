import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export async function getCurrentUser() {
    const session = await auth();

    if (!session.userId) throw new Error("Unauthorized");

    return prisma.user.upsert({
        where: {clerkUserId: session.userId},
        update: {},
        create: {clerkUserId: session.userId},
    });
}