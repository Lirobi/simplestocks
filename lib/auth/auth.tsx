import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { compare } from 'bcrypt';
import { redirect } from 'next/navigation';
const SECRET_KEY = process.env.JWT_SECRET_KEY || 'your-secret-key';

export async function verifyToken(token: string) {
    try {
        // Verify the token using the secret key

        const decoded = jwt.verify(token, SECRET_KEY);

        const user = await prisma.user.findUnique({
            where: { id: parseInt(decoded.userId) }
        });
        return user; // Return the decoded payload (e.g., user data)
    } catch (error) {
        console.error('Token verification failed:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            redirect('/login');
        }
        return null; // Return null if the token is invalid
    }
}


export function createToken(userId: string) {
    const token = jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1d' });
    return token;
}

export async function login(email: string, password: string) {
    try {
        const user = await findUserByEmail(email.toLowerCase());

        if (!user) {
            throw new Error('Invalid email or password'); // Better error message for security
        }

        // Verify password
        const isValidPassword = await verifyPassword(password, user.password);

        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        // Set session/token here
        return user;
    } catch (error) {
        console.error('Login error:', error);
        throw new Error('Authentication failed. Please try again.');
    }
}

async function findUserByEmail(email: string) {
    return await prisma.user.findUnique({
        where: { email }
    });
}

async function verifyPassword(password: string, hashedPassword: string) {
    return await compare(password, hashedPassword);
}

