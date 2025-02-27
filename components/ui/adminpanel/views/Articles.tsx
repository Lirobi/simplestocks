"use client"

import { useEffect, useState } from "react";
import { NewsArticle } from "@prisma/client";
import { createNewsArticle, deleteNewsArticle, updateNewsArticle, getNewsArticles } from "@/lib/actions/news";
import PopupWindowContainer from "@/components/ui/popups/PopupWindowContainer";
import { getUser } from "@/lib/actions/user";
import { User } from "@/lib/types/User";
import RichTextEditor from "@/components/ui/views/RichTextEditor";
function ArticlePopup({ onClose, article }: { onClose: () => void, article?: NewsArticle }) {
    const [user, setUser] = useState<User | null>(null);

    const [title, setTitle] = useState(article?.title || "");
    const [content, setContent] = useState(article?.content || "");

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getUser();
            setUser(user);
        }
        fetchUser();
    }, []);

    async function handleSave() {
        if (article) {
            await updateNewsArticle(article.id, { title, content });
        } else {
            await createNewsArticle(title, content, user.id);
        }
        onClose();
    }
    return (
        <PopupWindowContainer onClose={onClose} title="New Article">
            <div className="dark:bg-background-dark bg-background-light p-4 rounded-md">
                <div className="flex flex-col gap-2">
                    <input type="text" placeholder="Title" className="w-full p-2 rounded-md border border-gray-300" value={title} onChange={(e) => setTitle(e.target.value)} />


                    <RichTextEditor value={content} setValue={setContent} />
                    <button onClick={handleSave} className="bg-primary p-2 rounded-md">Save</button>
                </div>
            </div>
        </PopupWindowContainer>
    )
}

export default function Articles() {
    const [showArticlePopup, setShowArticlePopup] = useState(false);
    const [articles, setArticles] = useState<NewsArticle[]>([]);

    const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

    useEffect(() => {
        const fetchArticles = async () => {
            const articles = await getNewsArticles();
            setArticles(articles);
        }
        fetchArticles();
    }, []);

    async function handleDelete(id: string) {
        await deleteNewsArticle(parseInt(id));
        setArticles(articles.filter((article) => article.id !== parseInt(id)));
    }

    return (
        <div className="flex flex-col gap-2 justify-center items-center">
            <button onClick={() => setShowArticlePopup(true)} className="bg-primary text-white p-2 rounded-md w-fit">New Article</button>
            {showArticlePopup && <ArticlePopup onClose={() => { setShowArticlePopup(false); setSelectedArticle(null) }} article={selectedArticle} />}

            <div className="flex flex-col gap-2 p-4">
                {
                    articles.map((article) => (
                        <div key={article.id} className="dark:bg-background-dark bg-background-light p-4 rounded-md">
                            <div className="flex flex-row justify-between items-center">
                                <button className="bg-primary text-white p-2 rounded-md" onClick={() => { setSelectedArticle(article); setShowArticlePopup(true) }}>Edit</button>
                                <button className="bg-red-500 text-white p-2 rounded-md" onClick={() => handleDelete(article.id.toString())}>Delete</button>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h1>{article.title}</h1>
                                <p dangerouslySetInnerHTML={{ __html: article.content }}></p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}