"use server"

import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";
export async function getProduct(id: string) {
    const product = await prisma.product.findUnique({
        where: { id: parseInt(id) }
    });
    return product;
}

export async function updateProduct(id: number, product: Product) {
    const updatedProduct = await prisma.product.update({
        where: { id },
        data: product
    });
    return updatedProduct;
}