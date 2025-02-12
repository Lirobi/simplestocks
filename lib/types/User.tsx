import { Business } from "@prisma/client";

export type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    birthDate: Date;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
    businessId: number | null;
}
