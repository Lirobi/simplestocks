"use client";
import React from "react";

interface SearchBarProps {
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
    return (
        <div className="relative">
            <input
                type="text"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="drop-shadow-md border border-backgroundSecondary-light dark:border-backgroundSecondary-dark dark:bg-background-dark bg-background-light rounded-md p-2 w-full pr-10"
            />
            <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
            </svg>
        </div>
    );
} 