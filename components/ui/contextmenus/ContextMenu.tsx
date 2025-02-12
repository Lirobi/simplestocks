"use client";
import { useEffect, useRef } from 'react';
import { ContextMenuAction } from "@/lib/types/ContextMenuProps";

interface ContextMenuProps {
    className?: string;
    actions: ContextMenuAction[];
    coordinates: { x: number, y: number };
}

export default function ContextMenu({ className, actions, coordinates }: ContextMenuProps) {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuRef.current) return;

        // Get viewport dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Get menu dimensions
        const menuRect = menuRef.current.getBoundingClientRect();
        const menuWidth = menuRect.width;
        const menuHeight = menuRect.height;

        // Adjust position if menu would overflow viewport
        let adjustedX = coordinates.x;
        let adjustedY = coordinates.y;

        if (coordinates.x + menuWidth > viewportWidth) {
            adjustedX = coordinates.x - menuWidth;
        }

        if (coordinates.y + menuHeight > viewportHeight) {
            adjustedY = coordinates.y - menuHeight;
        }

        // Apply adjusted position
        menuRef.current.style.left = `${adjustedX}px`;
        menuRef.current.style.top = `${adjustedY}px`;
    }, [coordinates]);

    return (
        <div
            ref={menuRef}
            className={`fixed z-50 min-w-[160px] dark:bg-background-dark bg-background-light border border-line rounded-md shadow-lg ${className}`}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="py-1">
                {actions.map((action, index) => (
                    <button
                        key={index}
                        onClick={(e) => {
                            e.stopPropagation();
                            action.onClick();
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-primary/10 transition-colors"
                    >
                        {action.label}
                    </button>
                ))}
            </div>
        </div>
    );
}