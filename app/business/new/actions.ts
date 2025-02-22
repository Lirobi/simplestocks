"use server"

import prisma from "@/lib/prisma";


interface Business {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export async function createBusiness(business: Business, userId: string) {
    const newBusiness = await prisma.business.create({
        data: { name: business.name, address: business.address, city: business.city, postalCode: business.postalCode, country: business.country }
    });
    await prisma.user.update({
        where: { id: parseInt(userId) },
        data: {
            businessId: newBusiness.id,
            role: "Admin"
        }
    });
    return newBusiness;
}
