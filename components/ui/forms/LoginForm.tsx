"use client"
import React, { useState } from "react";
import AuthenticateFormInput from "../inputs/AuthenticateFormInput";
import AuthenticateFormButton from "../buttons/AuthenticateFormButton";
import ClickableText from "../buttons/ClickableText";
import { KeyObject } from "crypto";

interface AuthenticateFormProps {
    onSubmit: (email: string, password: string) => void;
    error?: string;
}

export default function AuthenticateForm({ onSubmit, error }: AuthenticateFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onSubmit(email, password);
    }
    const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
        if (e.key === "Enter") {
            onSubmit(email, password);
        }
    }

    return (
        <div className="flex flex-col gap-4 bg-background-light dark:bg-background-dark p-4 rounded-md justify-center items-center max-md:scale-125 scale-150">
            <h1 className="text-2xl font-bold">Login</h1>

            <form className="flex flex-col gap-2 w-fit" onSubmit={handleSubmit} onKeyDown={handleKeyDown} autoComplete="on">
                <AuthenticateFormInput label="Email" type="email" setValue={setEmail} />
                <AuthenticateFormInput label="Password" type="password" setValue={setPassword} />
                {error && <p className="text-red-500">{error}</p>}
                <AuthenticateFormButton text="Login" onSubmit={handleSubmit} />
            </form>
            <ClickableText text="Forgot Password?" onClick={() => { }} />
        </div>
    );
}
