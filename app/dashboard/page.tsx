"use client"

import { getNewsArticles } from "@/lib/actions/news";
import { NewsArticle } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
    useEffect(() => {
        const fetchNewsArticles = async () => {
            const articles = await getNewsArticles();
            setNewsArticles(articles);
        };
        fetchNewsArticles();
    }, []);
    return (
        <div className="w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light">
            <div className="flex justify-between items-center pr-10">
                <h1 className="text-3xl font-bold p-10 pb-4">News</h1>


            </div>
            <div className="flex flex-col gap-4 p-10">
                {newsArticles.map((article) => (
                    <div key={article.id} className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold">{article.title}</h2>
                        <p className="text-sm" dangerouslySetInnerHTML={{ __html: article.content }}></p>
                    </div>
                ))}
            </div>
        </div>
    );
}