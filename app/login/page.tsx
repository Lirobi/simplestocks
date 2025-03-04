"use client"
import AuthenticateForm from "@/components/ui/forms/LoginForm";
import { loginUser } from "./actions";
import { redirect } from "next/navigation";
import { getUser } from "./actions";
import { useState, useEffect } from "react";
import Loading from "@/components/ui/icons/Loading";
export default function Login() {

    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const isLoggedIn = async () => {
            const user = await getUser();
            if (user) {
                redirect("/dashboard");
            } else {
                setIsLoading(false);
            }
        }
        isLoggedIn();
    }, []);

    const handleSubmit = async (email: string, password: string) => {
        const user = await loginUser(email, password);
        if (user.success == true) {
            redirect("/dashboard");
        } else {
            setError("Invalid email or password");
            setTimeout(() => {
                setError("");
            }, 3000);
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col gap-4 p-4 rounded-md justify-center items-center scale-125">
                {
                    isLoading ? (
                        <Loading />
                    ) : (
                        <AuthenticateForm onSubmit={handleSubmit} error={error} />
                    )
                }
            </div>
        </div>
    );
}