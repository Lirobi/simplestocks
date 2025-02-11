import React from "react";

interface ClickableTextProps {
    text: string;
    color?: string;
    onClick: () => void;
}

export default function ClickableText({ text, onClick, color = "var(--primary)" }: ClickableTextProps) {
    return (
        <button
            className="animated-underline"
            onClick={onClick}
            style={{ color: color }}
        >
            {text}
        </button>
    );
}
