"use server";

import prisma from "../prisma";

export const createLog = async (userId: number, action: string, description?: string, ipAddress?: string) => {
    const newLog = await prisma.log.create({
        data: {
            userId,
            action,
            description,
            ipAddress: ipAddress || "unknown",
        },
    });
    return newLog;
};
