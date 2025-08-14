import {auth} from "@clerk/nextjs/server";

export async function getCurrentUser() {
    const user = await auth();

    if (!user.userId) throw new Error("Unauthorized");
    return user
}