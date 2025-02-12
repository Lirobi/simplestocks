interface BaseDateInputProps {
    label: string;
    name?: string;
    value?: string;
    min?: string;
    max?: string;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BaseDateInput({
    label,
    name,
    value,
    min,
    max,
    required = false,
    disabled = false,
    error,
    className = '',
    onChange
}: BaseDateInputProps) {
    return (
        <div className="mb-4">
            <label
                htmlFor={name}
                className="block mb-2.5 text-xl font-bold text-primary-900 dark:text-primary-100"
            >
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
                type="date"
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                min={min}
                max={max}
                disabled={disabled}
                className={`
                    w-full px-3 py-2 rounded-lg
                    bg-background-light dark:bg-background-dark
                    border border-line-dark dark:border-line-light
                    text-foreground-light dark:text-foreground-dark
                    focus:ring-2 focus:ring-line-dark dark:focus:ring-line-light
                    focus:border-line-dark dark:focus:border-line-light
                    disabled:bg-background-secondary dark:disabled:bg-background-tertiary
                    disabled:cursor-not-allowed
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