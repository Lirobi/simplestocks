"use server"

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth/auth";

interface Business {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export async function createBusiness(business: Business) {
    try {
        const session = await auth();
        if (!session?.user?.id) throw new Error("Unauthorized");

        const newBusiness = await prisma.business.create({
            data: {
                name: business.name,
                address: business.address,
                city: business.city,
                postalCode: business.postalCode,
                country: business.country
            }
        });

        await prisma.user.update({
            where: { id: session.user.id },
            data: {
                businessId: newBusiness.id,
                role: "Admin"
            }
        });

        return { success: true, business: newBusiness };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to create business" };
    }
}
