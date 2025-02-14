import React from "react";

interface AuthenticateFormButtonProps {
    text: string;
    color?: "primary" | "secondary";
    onSubmit?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: "button" | "submit";
}

export default function AuthenticateFormButton({ text, onSubmit = () => { }, color = "primary", type = "button" }: AuthenticateFormButtonProps) {
    return (
        <button className={`font-bold text-white p-2 rounded-md w-full ${color === "primary" ? "bg-primary" : "bg-secondary"}`} onClick={onSubmit} type={type}>
            {text}
        </button>
    );
}