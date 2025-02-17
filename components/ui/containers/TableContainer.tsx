"use client";
import React from "react";
import BaseButton from "../buttons/BaseButton";
import SearchBar from "../inputs/SearchBar";

interface TableContainerProps {
    title: string;
    addButtonText: string;
    onAddClick: () => void;
    children: React.ReactNode;
    // Support both patterns for backward compatibility
    searchBar?: React.ReactNode;
    searchQuery?: string;
    onSearchChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    searchPlaceholder?: string;
}

export default function TableContainer({
    title,
    addButtonText,
    onAddClick,
    children,
    searchBar,
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search"
}: TableContainerProps) {
    return (
        <div className="w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light">
            <div className="flex justify-between items-center pr-10">
                <h1 className="text-3xl font-bold p-10 pb-4">{title}</h1>
                <BaseButton
                    onClick={onAddClick}
                    variant="primary"
                    className="px-4 py-2"
                >
                    {addButtonText}
                </BaseButton>
            </div>

            {searchBar ? (
                <div className="w-full px-10 mb-4 sticky top-2 z-20">
                    {searchBar}
                </div>
            ) : onSearchChange && (
                <div className="w-full px-10 mb-4 sticky top-2 z-20">
                    <SearchBar
                        placeholder={searchPlaceholder}
                        value={searchQuery || ""}
                        onChange={onSearchChange}
                    />
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