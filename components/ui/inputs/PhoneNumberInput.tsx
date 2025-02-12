import React, { useId } from "react";

interface PhoneNumberInputProps {
    label?: string;
    setValue: (value: string) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
}

export default function PhoneNumberInput({
    label = "Phone Number",
    setValue,
    error,
    placeholder = "Enter phone number",
    required = false,
}: PhoneNumberInputProps) {
    const id = useId();

    const handleChange = (target: HTMLInputElement, value: string) => {
        for (let i = 0; i < value.length; i++) {
            if (!value[i].match(/[0-9]/)) {
                value = value.slice(0, i) + value.slice(i + 1);
                target.value = value;
            }
            if ((i - 2) % 3 === 0 && i >= 2) {
                value = value.slice(0, i) + " " + value.slice(i);
                target.value = value;
            }
        }
        if (value.length > 14) {
            value = value.slice(0, 14);
            target.value = value;
        }
        setValue(value.replaceAll(" ", ""));
    };

    return (
        <div className="flex flex-col gap-2 w-full">
            <label htmlFor={label} className={`text-primary`}>{label}</label>
            <input
                id={id}
                type="tel"
                onChange={(e) => handleChange(e.target, e.target.value)}
                placeholder={placeholder}
                required={required}
                className="px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-primary bg-background-light dark:bg-background-dark text-foreground-light dark:text-foreground-dark border-line-light dark:border-line-dark"
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
        </div>
    );
} 