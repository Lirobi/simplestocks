import React from "react";

interface AuthenticateFormButtonProps {
    text: string;
    color?: "primary" | "secondary";
    onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function AuthenticateFormButton({ text, onSubmit, color = "primary" }: AuthenticateFormButtonProps) {
    return (
        <button className={`font-bold text-white p-2 rounded-md w-full ${color === "primary" ? "bg-primary" : "bg-secondary"}`} onClick={onSubmit}>
            {text}
        </button>
    );
}