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
export async function checkIfEmailAlreadyUsed(email: string): Promise<boolean> {
    try {
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });
        if (user) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error checking if email is already used:', error);
        throw new Error('Error checking if email is already used');
    }
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
        where: { email: email.toLowerCase() }
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
                email: email.toLowerCase(),
                password: hashedPassword,
                firstName: firstName[0].toUpperCase() + firstName.slice(1),
                lastName: lastName[0].toUpperCase() + lastName.slice(1),
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