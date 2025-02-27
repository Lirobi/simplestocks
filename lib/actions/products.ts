'use server';
import prisma from "@/lib/prisma";

export async function addProduct(name: string, price: number, quantity: number, category: string, description: string, businessId: number) {
    return await prisma.product.create({
        data: {
            name,
            unitPrice: price,
            quantity,
            categoryId: parseInt(category),
            description,
            businessId,
            sku: null,
            costPrice: price,
        }
    });
}

export async function getCategories(businessId: number) {
    return await prisma.category.findMany({
        where: { businessId }
    });
} 