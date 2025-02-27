'use server';
import prisma from "@/lib/prisma";
import { User } from "@/lib/types/User";

export async function getUsers() {
    return await prisma.user.findMany();
}

export async function getBusinesses() {
    return await prisma.business.findMany();
}

export async function updateUser(userId: number, data: Partial<User>) {
    return await prisma.user.update({
        where: { id: userId },
        data
    });
}

export async function getUserData(userId: number) {
    return await prisma.userData.findUnique({
        where: { userId }
    });
} 