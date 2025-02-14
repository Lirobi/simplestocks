"use server";

import { User } from "@prisma/client";
import prisma from "@/lib/prisma";

export async function getBusinessFromId(businessId: number) {
    const business = await prisma.business.findFirst({
        where: {
            id: businessId
        }
    });
    return business;
}

export async function getUsersFromBusinessId(businessId: number) {
    const users = await prisma.user.findMany({
        where: {
            businessId: businessId
        }
    });
    return users;
}

export async function updateUser(userId: number, data: User) {
    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                address: data.address,
                city: data.city,
                postalCode: data.postalCode,
                country: data.country,
                phone: data.phone,
                email: data.email,
                role: data.role
            }
        });
        return { success: true, user: updatedUser };
    } catch (error) {
        return { success: false, error: "Failed to update user" };
    }
}