'use server'

import { hash } from 'bcrypt';
import prisma from '@/lib/prisma';

interface RegisterUserParams {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    birthDate: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

// A utiliser au passage à l'étape suivante du formulaire pour s'assurer que l'user ne va pas utiliser un email déjà utilisé
export async function checkIfEmailAlreadyUsed(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email }
        });
        return !!user;
    } catch (error) {
        console.error('Error checking email:', error);
        throw new Error('Failed to check email');
    }
}

export async function registerUser(params: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    birthDate: Date;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}) {
    const {
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        birthDate,
        address,
        city,
        postalCode,
        country
    } = params;

    try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('Email already exists');
        }

        // Hash password
        const hashedPassword = await hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phoneNumber,
                birthDate,
                address,
                city,
                postalCode,
                country
            }
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error('Error registering user:', error);
        throw error;
    }
} 