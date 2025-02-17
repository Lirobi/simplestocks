"use client"
import AuthenticateForm from "@/components/ui/forms/LoginForm";
import { loginUser } from "./actions";
import { redirect } from "next/navigation";
import { getUser } from "./actions";
import { useState } from "react";

export default function Login() {

    const [error, setError] = useState("");
    const isLoggedIn = async () => {
        const user = await getUser();
        if (user) {
            redirect("/dashboard");
        }
    }
    isLoggedIn();

    const handleSubmit = async (email: string, password: string) => {
        const user = await loginUser(email, password);
        if (user) {
            redirect("/dashboard");
        } else {
            setError("Invalid email or password");
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded-md justify-center items-center scale-125">
                <AuthenticateForm onSubmit={handleSubmit} error={error} />
            </div>
        </div>
    );
}