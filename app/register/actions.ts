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

export async function registerUser(params: RegisterUserParams) {
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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new Error('User already exists');
    }

    // Hash the password
    const hashedPassword = await hash(password, 12);

    try {
        // Create the user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                phone: phoneNumber,
                birthDate: new Date(birthDate),
                address,
                city,
                postalCode,
                country
            }
        });

        // Remove password from the returned object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    } catch (error) {
        console.error('Error creating user:', error);
        throw new Error('Error creating user');
    }
} 