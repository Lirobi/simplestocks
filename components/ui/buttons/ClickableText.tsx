import React from "react";

interface ClickableTextProps {
    text: string;
    color?: "primary" | "secondary";
    onClick: () => void;
}

export default function ClickableText({ text, onClick, color = "primary" }: ClickableTextProps) {
    return (
        <button
            className={`animated-underline ${color === "primary" ? "text-primary" : "text-secondary"}`}
            onClick={onClick}
        >
            {text}
        </button>
    );
}
