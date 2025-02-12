"use server";
import prisma from "@/lib/prisma";

export async function getProducts() {
    const products = await prisma.product.findMany();
    return products;
}

export async function getCategories() {
    const categories = await prisma.category.findMany();
    return categories;
}

export async function deleteProduct(id: number) {
    const product = await prisma.product.delete({
        where: { id },
    });
    return product;
}


export async function changeProductQuantity(id: number, quantity: number) {
    const product = await prisma.product.update({
        where: { id },
        data: { quantity },
    });
    return product;
}