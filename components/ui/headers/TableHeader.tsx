"use client";
import React from "react";
import BaseButton from "../buttons/BaseButton";

interface TableHeaderProps {
    title: string;
    buttonText: string;
    onButtonClick: () => void;
}

export default function TableHeader({
    title,
    buttonText,
    onButtonClick
}: TableHeaderProps) {
    return (
        <div className="flex justify-between items-center pr-10">
            <h1 className="text-3xl font-bold p-10 pb-4">{title}</h1>
            <BaseButton
                onClick={onButtonClick}
                variant="primary"
                className="px-4 py-2"
            >
                {buttonText}
            </BaseButton>
        </div>
    );
} 