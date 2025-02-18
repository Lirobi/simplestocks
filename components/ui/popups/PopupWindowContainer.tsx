import { useEffect } from 'react';

export default function PopupWindowContainer({
    children,
    title,
    onClose,
    className = ""
}: {
    children: React.ReactNode;
    title: string;
    onClose: () => void;
    className?: string;
}) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className={`bg-background-light border border-backgroundSecondary-light dark:border-backgroundSecondary-dark  dark:bg-background-dark rounded-lg shadow-xl w-full max-w-2xl ${className}`}>
                <div className="flex justify-between items-center p-6 pb-2 gap-4">
                    <h3 className="text-2xl font-semibold text-foreground-light dark:text-foreground-dark">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-foreground-light dark:text-foreground-dark hover:text-primary hover:scale-110 transition-all duration-300"
                    >
                        <span className="text-3xl">&times;</span>
                    </button>
                </div>
                <div className="p-6 pt-2">
                    {children}
                </div>
            </div>
        </div>
    );
}