"use server"

import prisma from "@/lib/prisma"


export async function addVisit(ipAddress: string) {
    const visit = await prisma.visit.create({
        data: {
            ipAddress
        }
    })
}
