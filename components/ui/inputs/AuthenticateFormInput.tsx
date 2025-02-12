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
            <label htmlFor={label} className={`${color === "primary" ? "text-primary" : "text-secondary"}`}>{label}</label>
            <input className="border p-1 rounded-md" type={type} placeholder={label} onChange={(e) => setValue(e.target.value)} />
        </div>
    );
}