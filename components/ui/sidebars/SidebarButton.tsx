"use client";
import { useState } from "react";
interface SidebarButtonProps {
    title: string;
    onClick: () => void;
}

export default function SidebarButton({ title, onClick }: SidebarButtonProps) {
    return (
        <div className={`flex flex-col transition-colors duration-300 gap-2 dark:hover:bg-backgroundSecondary-dark hover:bg-backgroundSecondary-light rounded-md  font-bold w-full`}>
            <button onClick={onClick} className={`flex   rounded-md px-6 py-2.5`}>{title}
            </button>
        </div>
    );
}