"use client";
import React from "react";

interface TableContentProps {
    children: React.ReactNode;
    className?: string;
}

export default function TableContent({
    children,
    className = ""
}: TableContentProps) {
    return (
        <div className={`flex-1 px-10 pb-32 ${className}`}>
            <div className="relative shadow-md rounded-md pb-5 pr-4 dark:bg-background-dark bg-background-light border border-backgroundSecondary-light dark:border-backgroundSecondary-dark">
                {children}
            </div>
        </div>
    );
} 