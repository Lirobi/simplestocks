'use server'
import { login, createToken, verifyToken } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import { User } from "@/lib/types/User";

export async function loginUser(emailOrFormData: string | FormData, passwordParam?: string) {
    try {
        let email: string;
        let password: string;

        if (emailOrFormData instanceof FormData) {
            email = emailOrFormData.get('email') as string;
            password = emailOrFormData.get('password') as string;
        } else {
            email = emailOrFormData;
            password = passwordParam!;
        }

        if (!email || !password) {
            throw new Error('Please provide both email and password');
        }

        const user = await login(email, password);
        const token = await createToken(user.id.toString()); // Convert id to string

        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 900
        });

        return { success: true, user };
    } catch (error) {
        console.error('Login error:', error);
        return {
            success: false,
            error: 'Authentication failed. Please check your credentials.'
        };
    }
}

export async function getUser(): Promise<User | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get("token");
    if (token) {
        const user = await verifyToken(token.value);
        return {
            ...user,
            updatedAt: new Date(),
            business: user.businessId || null,
        } as User;
    }
    return null;
}

export async function logoutUser() {
    const cookieStore = await cookies();
    cookieStore.set("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(0) // Immediate expiration
    });
}