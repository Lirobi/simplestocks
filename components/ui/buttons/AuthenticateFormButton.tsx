import React from "react";

interface AuthenticateFormButtonProps {
    text: string;
    color?: string;
    onSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function AuthenticateFormButton({ text, onSubmit, color = "var(--primary)" }: AuthenticateFormButtonProps) {
    return (
        <button className="font-bold text-white p-2 rounded-md w-full" onClick={onSubmit} style={{ backgroundColor: color }}>
            {text}
        </button>
    );
}