interface BaseButtonProps {
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
}

export default function BaseButton({
    children,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    className = '',
    onClick
}: BaseButtonProps) {
    const variants = {
        primary: 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 text-white',
        secondary: 'bg-primary-200 hover:bg-primary-300 dark:bg-primary-700 dark:hover:bg-primary-600 text-primary-900 dark:text-primary-50',
        danger: 'bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white',
        success: 'bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white'
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg'
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
                bg-primary
                rounded-md font-medium
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]}
                ${sizes[size]}
                ${className}
            `}
        >
            {children}
        </button>
    );
} 