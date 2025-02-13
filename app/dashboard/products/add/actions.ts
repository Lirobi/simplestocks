"use server";

import prisma from "@/lib/prisma";

export async function getCategories() {
    const categories = await prisma.category.findMany();
    return categories;
}


export async function addProduct(name: string, price: number, quantity: number, categoryId: string, description: string) {
    const product = await prisma.product.create({
        data: {
            name,
            description,
            sku: Math.random().toString(36).substring(2, 15), // Generate random SKU for now
            categoryId: parseInt(categoryId),
            unitPrice: price,
            costPrice: price, // Using same price for now
            quantity,
            minStockLevel: 10, // Using default from schema
        },
        include: {
            category: true
        }
    });
    return product;
}