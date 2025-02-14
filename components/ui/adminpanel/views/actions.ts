"use server";

import prisma from "@/lib/prisma";
import { Business, User } from "@prisma/client";



export async function getUsers(count?: number) {
    if (!count) {
        const users = await prisma.user.findMany();
        return users;
    }
    const users = await prisma.user.findMany({
        take: count,
        skip: count ? count * 10 : 0
    });
    return users;
}

export async function updateUser(user: User): Promise<User> {
    const updatedUser = await prisma.user.update({
        where: {
            id: user.id
        },
        data: user
    });
    return updatedUser;
}
export async function getBusinesses(count?: number) {
    if (!count) {
        const businesses = await prisma.business.findMany();
        return businesses;
    }
    const businesses = await prisma.business.findMany({
        take: count,
        skip: count ? count * 10 : 0
    });
    return businesses;
}

export async function createBusiness(business: Business) {
    console.log(business);
    try {
        const newBusiness = await prisma.business.create({
            data: business
        });
        return newBusiness;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function updateBusiness(business: Business): Promise<Business> {
    const updatedBusiness = await prisma.business.update({
        where: {
            id: business.id
        },
        data: business
    });
    return updatedBusiness;
}

export async function deleteBusiness(id: number): Promise<void> {
    await prisma.business.delete({
        where: {
            id: id
        }
    });
}