'use client'
import React from "react";

interface AuthenticateFormInputProps {
    label: string;
    type: string;
    color?: "primary" | "secondary";
    setValue: (value: string) => void;
}

export default function AuthenticateFormInput({ label, type, color = "primary", setValue }: AuthenticateFormInputProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            <label htmlFor={label} className={`${color === "primary" ? "text-primary" : "text-foreground-light dark:text-foreground-dark"}`}>{label}</label>
            <input className="px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-primary bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark border-line-light dark:border-line-dark" type={type} placeholder={label} onChange={(e) => setValue(e.target.value)} />
        </div>
    );
}