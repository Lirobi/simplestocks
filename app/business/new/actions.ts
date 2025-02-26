"use server"

import { getUser } from "@/app/login/actions"
import prisma from "@/lib/prisma";

interface Business {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export async function createBusiness(business: Business) {
    try {
        const user = await getUser();
        if (!user?.id) throw new Error("Unauthorized");

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
            where: { id: user.id },
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
