"use server";

import prisma from "@/lib/prisma";

export async function getBusinessNameFromUserId(userId: string) {
    const user = await prisma.user.findUnique({
        where: {
            id: parseInt(userId)
        },
        include: {
            business: true
        }
    });
    return user?.business?.name;
}   