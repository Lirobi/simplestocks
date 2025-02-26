"use server"

import prisma from "@/lib/prisma";

export async function toggleMaintenance() {
    const appStatus = await prisma.appStatus.findFirst();

    if (appStatus?.status === "Active") {
        await prisma.appStatus.update({
            where: {
                id: appStatus.id
            },
            data: {
                status: "Maintenance"
            }
        });
    } else {
        await prisma.appStatus.update({
            where: {
                id: appStatus.id
            },
            data: {
                status: "Active"
            }
        });
    }
}   