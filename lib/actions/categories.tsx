"use server";

import prisma from "@/lib/prisma";

export async function getCategories() {
    const categories = await prisma.category.findMany();
    return categories;
}

export async function getCategoriesByBusinessId(businessId: number) {
    const categories = await prisma.category.findMany({
        where: {
            businessId: businessId
        }
    });
    return categories;
}

export async function addCategory(name: string, description: string, businessId: number) {
    const category = await prisma.category.create({
        data: { name, description, businessId: businessId }
    });
    return category;
}

export async function deleteCategory(id: number) {
    const category = await prisma.category.delete({
        where: { id }
    });
    return category;
}

export async function updateCategory(id: number, name: string, description: string) {
    const category = await prisma.category.update({
        where: { id },
        data: { name, description }
    });
    return category;
}
