"use client";
import React from "react";

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

export default function Container({
    children,
    className = ""
}: ContainerProps) {
    return (
        <div className={`w-full h-full flex flex-col overflow-auto dark:bg-backgroundSecondary-dark bg-background-light ${className}`}>
            {children}
        </div>
    );
} 