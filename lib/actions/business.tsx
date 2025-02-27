'use server'

import prisma from "@/lib/prisma";
import { getUser } from "./user";

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

// Update the business name function to handle both string and number types
export async function getBusinessNameFromUserId(userId: string | number) {
    const idAsNumber = typeof userId === 'string' ? parseInt(userId) : userId;

    const user = await prisma.user.findUnique({
        where: {
            id: idAsNumber
        },
        include: {
            business: true
        }
    });
    return user?.business?.name;
}

export async function getBusinessFromId(businessId: number) {
    return await prisma.business.findUnique({
        where: { id: businessId }
    });
}

export async function getUsersFromBusinessId(businessId: number) {
    return await prisma.user.findMany({
        where: { businessId }
    });
}

export async function removeUserFromBusiness(userId: number) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { businessId: null }
        });
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false, error: "Failed to remove user from business" };
    }
}

export async function getBusinesses() {
    return await prisma.business.findMany();
}


export async function updateBusiness(businessId: number, business: Business) {
    return await prisma.business.update({
        where: { id: businessId },
        data: business
    });
}

export async function deleteBusiness(businessId: number) {
    return await prisma.business.delete({
        where: { id: businessId }
    });
}


