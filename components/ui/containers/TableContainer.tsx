"use client";
import React from "react";

interface TableContainerProps {
    title: string;
    addButtonText: string;
    onAddClick: () => void;
    children: React.ReactNode;
    searchBar?: React.ReactNode;
}

export default function TableContainer({
    title,
    addButtonText,
    onAddClick,
    children,
    searchBar
}: TableContainerProps) {
    return (
        <div className="w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light">
            <div className="flex justify-between items-center pr-10">
                <h1 className="text-3xl font-bold p-10 pb-4">{title}</h1>
                <button
                    onClick={onAddClick}
                    className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-dark transition-colors"
                >
                    {addButtonText}
                </button>
            </div>
            {searchBar && (
                <div className="w-full px-10 mb-4 sticky top-2 z-20">
                    {searchBar}
                </div>
            )}
            <div className="flex-1 px-10 pb-32">
                <div className="relative shadow-md rounded-md pb-5 pr-4 dark:bg-background-dark bg-background-light border border-backgroundSecondary-light dark:border-backgroundSecondary-dark">
                    {children}
                </div>
            </div>
        </div>
    );
} 