"use client";
import { useState } from "react";
interface SidebarDropdownProps {
    title: string;
    items: {
        label: string;
        onClick: () => void;
    }[];
}

export default function SidebarDropdown({ title, items }: SidebarDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={`flex flex-col  transition-all duration-300 gap-2 dark:hover:bg-backgroundSecondary-dark hover:bg-backgroundSecondary-light ${isOpen ? 'dark:bg-backgroundSecondary dark:text-foreground bg-backgroundSecondary text-foreground' : ''} rounded-md px-2 py-2 font-bold w-full`}>
            <button onClick={() => setIsOpen(!isOpen)} className={`flex transition-all duration-300  rounded-md px-4 py-0.5 dark:hover:bg-backgroundTertiary-dark hover:bg-backgroundTertiary-light ${isOpen ? 'hover:bg-backgroundTertiary' : ''}`}>{title}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                >
                    <path d="M6 9l6 6 6-6" />
                </svg>
            </button>

            {items.map((item) => (
                <button key={item.label} onClick={item.onClick} className={`${isOpen ? 'inline-block' : 'hidden'} text-left ml-2 text-nowrap dark:hover:bg-backgroundTertiary-dark hover:bg-backgroundTertiary-light rounded-md px-4 py-0.5`}>{item.label}</button>
            ))}
        </div>
    );
}