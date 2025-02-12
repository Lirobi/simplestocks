interface BaseTextAreaProps {
    label: string;
    name?: string;
    value?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function BaseTextArea({
    label,
    name,
    value,
    placeholder,
    rows = 4,
    required = false,
    disabled = false,
    error,
    className = '',
    onChange
}: BaseTextAreaProps) {
    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="block mb-2.5 text-xl font-bold text-primary-900 dark:text-primary-100"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
                id={name}
                name={name}
                value={value}
                onChange={(e) => onChange(e)}
                rows={rows}
                disabled={disabled}
                placeholder={placeholder}
                className={`
                    w-full px-3 py-2 rounded-lg
                    bg-background-light dark:bg-background-dark
                    border border-line-dark dark:border-line-light
                    text-foreground-light dark:text-foreground-dark
                    focus:ring-2 focus:ring-line-dark dark:focus:ring-line-light
                    focus:border-line-dark dark:focus:border-line-light
                    disabled:bg-background-secondary dark:disabled:bg-background-tertiary
                    disabled:cursor-not-allowed
                    placeholder:text-foreground-light dark:placeholder:text-foreground-dark
                    ${error ? 'border-red-500 dark:border-red-400' : ''}
                    ${className}
                `}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500 dark:text-red-400">{error}</p>
            )}
        </div>
    );
} 