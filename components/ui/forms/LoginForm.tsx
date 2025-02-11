"use client"
import React, { useState } from "react";
import AuthenticateFormInput from "../inputs/AuthenticateFormInput";
import AuthenticateFormButton from "../buttons/AuthenticateFormButton";
import ClickableText from "../buttons/ClickableText";

interface AuthenticateFormProps {
    onSubmit: (email: string, password: string) => void;
}

export default function AuthenticateForm({ onSubmit }: AuthenticateFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        onSubmit(email, password);
    }

    return (
        <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-md justify-center items-center scale-150">
            <h1 className="text-2xl font-bold">Login</h1>

            <form className="flex flex-col gap-2 w-fit" onSubmit={handleSubmit}>
                <AuthenticateFormInput label="Email" type="email" setValue={setEmail} />
                <AuthenticateFormInput label="Password" type="password" setValue={setPassword} />
                <AuthenticateFormButton text="Login" onSubmit={handleSubmit} />
            </form>
            <ClickableText text="Forgot Password?" onClick={() => { }} />
        </div>
    );
}
