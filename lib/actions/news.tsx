"use server"

import prisma from "@/lib/prisma";
import { NewsArticle } from "@prisma/client";
export async function createNewsArticle(title: string, content: string, userId: number) {
    return await prisma.newsArticle.create({ data: { title, content, userId } });
}

export async function getNewsArticles() {
    return await prisma.newsArticle.findMany();
}

export async function updateNewsArticle(id: number, data: Partial<NewsArticle>) {
    return await prisma.newsArticle.update({ where: { id }, data });
}

export async function deleteNewsArticle(id: number) {
    return await prisma.newsArticle.delete({ where: { id } });
}
