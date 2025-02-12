"use client";
import { useState } from "react";
interface SidebarButtonProps {
    title: string;
    onClick: () => void;
}

export default function SidebarButton({ title, onClick }: SidebarButtonProps) {
    return (
        <div className={`flex flex-col transition-all duration-300 gap-2 dark:hover:bg-backgroundSecondary-dark hover:bg-backgroundSecondary-light rounded-md px-2 py-2 font-bold w-full`}>
            <button onClick={onClick} className={`flex transition-all duration-300  rounded-md px-4 py-0.5`}>{title}
            </button>
        </div>
    );
}