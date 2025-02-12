import { ChangeEvent, useState } from 'react';

interface PostalCodeInputProps {
    setValue: (value: string) => void;
    label?: string;
    required?: boolean;
    placeholder?: string;
}

export default function PostalCodeInput({
    setValue,
    label = "Postal Code",
    required = false,
    placeholder = "Enter postal code"
}: PostalCodeInputProps) {
    const [error, setError] = useState<string>("");
    const [touched, setTouched] = useState(false);

    const validatePostalCode = (value: string): boolean => {
        const postalCodeRegex = /^[A-Za-z0-9\s-]{3,10}$/;
        return postalCodeRegex.test(value);
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        let value = e.target.value;

        if (touched) {
            validateError(value);
        }
        for (let i = 0; i < value.length; i++) {
            if (!value[i].match(/[0-9]/)) {
                value = value.slice(0, i) + value.slice(i + 1);
                e.target.value = value;
            }
        }
        setValue(value);
    };

    const handleBlur = (e: ChangeEvent<HTMLInputElement>): void => {
        setTouched(true);
        validateError(e.target.value);
    };

    const validateError = (value: string): void => {
        if (!value && required) {
            setError("Postal code is required");
        } else if (value && !validatePostalCode(value)) {
            setError("Please enter a valid postal code");
        } else {
            setError("");
        }
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <label htmlFor={label} className={`text-primary`}>{label}</label>
            <input
                id="postalCode"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={`px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-primary bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark border-line-light dark:border-line-dark ${error ? 'border-primary' : ''}`}
            />
            {error && <p className="text-primary text-sm mt-1">{error}</p>}
        </div >
    );
} 