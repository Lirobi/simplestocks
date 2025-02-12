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
        cookieStore.set("token", token);
        return { success: true, user };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Authentication failed'
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

export async function deleteToken() {
    try {
        const cookieStore = await cookies();
        cookieStore.delete("token");
    } catch (error) {
        throw new Error("Failed to delete token");
    }
}