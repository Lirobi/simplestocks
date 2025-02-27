"use client"

import { getNewsArticles } from "@/lib/actions/news";
import { getUsers } from "@/lib/actions/user";
import { NewsArticle, User } from "@prisma/client";
import { useEffect, useState } from "react";

export default function Dashboard() {
    const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
    const [users, setUsers] = useState<Partial<User>[]>([]);

    useEffect(() => {
        const fetchNewsArticles = async () => {
            const articles = await getNewsArticles();
            setNewsArticles(articles);
        };
        fetchNewsArticles();
        const fetchUsers = async () => {
            const users = await getUsers();
            setUsers(users);
        };
        fetchUsers();
    }, []);

    return (
        <div className="w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light">
            <div className="flex justify-between items-center pr-10">
                <h1 className="text-3xl font-bold p-10 pb-4">News</h1>
            </div>
            <div className="flex flex-col gap-4 p-10">
                {newsArticles
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((article) => (
                        <div key={article.id} className="flex flex-col gap-2">
                            <div className="flex flex-row justify-between items-center">
                                <p className="font-bold flex gap-2 items-center text-2xl">
                                    <div className="bg-primary rounded-full w-10 h-10 flex items-center justify-center">
                                        <p className="text-white">{users.find((user) => user.id === article.userId)?.firstName.charAt(0) + users.find((user) => user.id === article.userId)?.lastName.charAt(0)}</p>
                                    </div>
                                    {users.find((user) => user.id === article.userId)?.firstName + " " + users.find((user) => user.id === article.userId)?.lastName}
                                </p>
                                <p className="text-sm bg-primary text-white p-2 rounded-md">Published {new Date(article.createdAt).toLocaleDateString() + " at " + new Date(article.createdAt).toLocaleTimeString()}</p>
                            </div>

                            <h2 className="text-xl font-bold">{article.title}</h2>
                            <p className="text-sm" dangerouslySetInnerHTML={{ __html: article.content }}></p>
                            <div className="border-t border-gray-300 pt-2">
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}