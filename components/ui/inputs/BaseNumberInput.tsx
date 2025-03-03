interface BaseNumberInputProps {
    label: string;
    name?: string;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    required?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
    focus?: boolean;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function BaseNumberInput({
    label,
    name,
    value,
    min,
    max,
    step = 1,
    required = false,
    disabled = false,
    error,
    className = '',
    onChange,
    onKeyDown,
    focus = false
}: BaseNumberInputProps) {

    const invalidChars = ["-", "+", "e"];

    const inputBox = document.getElementById(name) as HTMLInputElement;

    inputBox?.addEventListener("keydown", (e) => {
        if (invalidChars.includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    });

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
                type="number"
                id={name}
                name={name}
                value={value}
                onChange={(e) => onChange(e)}
                onKeyDown={(e) => onKeyDown?.(e)}
                min={min}
                max={max}
                step={step}
                disabled={disabled}
                autoFocus={focus}
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