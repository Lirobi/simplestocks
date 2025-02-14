"use server";

import { User, Business, Invite } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function createInvite(businessId: number, maxUses: number) {
    const invite = await prisma.invite.create({
        data: {
            businessId: businessId,
            maxUses: 1,
            uses: 0,
        }
    });
    return invite;
}

export async function getInvite(url: string) {
    const invite = await prisma.invite.findUnique({
        where: {
            url: url
        }
    });
    return invite;
}