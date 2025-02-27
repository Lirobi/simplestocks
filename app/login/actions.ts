'use server'
import { login, createToken, verifyToken } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import { User } from "@/lib/types/User";
import prisma from "@/lib/prisma";
import { createLog } from "@/lib/log/log";
import { headers } from "next/headers";

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
        if (!user) {
            throw new Error('Invalid email or password');
        }
        const token = await createToken(user.id.toString()); // Convert id to string
        const setUserLastLogin = await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
        });
        const cookieStore = await cookies();
        cookieStore.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 30 * 24 * 60 * 60 // 30 days
        });



        try {
            const userData = await prisma.userData.findUnique({
                where: { userId: user.id }
            });


            if (!userData) {
                await prisma.userData.create({ data: { userId: user.id } });
            }

            // Get request headers and metadata
            const headersList = await headers();
            const userAgent = headersList.get('user-agent') || '';
            const ip = headersList.get('x-forwarded-for')?.split(',')[0] || headersList.get('x-real-ip') || '';
            // Get real IP address from various headers
            const realIp = headersList.get('cf-connecting-ip') || // Cloudflare
                headersList.get('x-real-ip') || // Nginx
                headersList.get('x-client-ip') || // Apache
                headersList.get('x-forwarded-for')?.split(',')[0] || // Standard proxy header
                ip || // Fallback to previously extracted IP
                'unknown';

            console.log("User logged in from ip: " + realIp);
            // Update user data with login information
            await prisma.userData.update({
                where: { userId: user.id },
                data: {
                    lastLoginIp: realIp,
                    lastLoginDate: new Date(),
                    lastLoginDevice: userAgent,
                    lastLoginBrowser: userAgent.split(' ')[0],
                    lastLoginOs: userAgent.includes('Windows') ? 'Windows' :
                        userAgent.includes('Mac') ? 'Mac' :
                            userAgent.includes('Linux') ? 'Linux' : 'Unknown'
                }
            });

            // Log the login action
            await createLog(user.id, 'LOGIN', `User logged in from ip: ${realIp}, device: ${userAgent}, browser: ${userAgent.split(' ')[0]}, os: ${userAgent.includes('Windows') ? 'Windows' : userAgent.includes('Mac') ? 'Mac' : userAgent.includes('Linux') ? 'Linux' : 'Unknown'}`, realIp);

            console.log(userData);

        } catch (error) {
            console.error('Error finding user data:', error);
        }


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